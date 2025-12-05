// Using native fetch API and Google API client library

class GoogleCalendarService {
  constructor() {
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.calendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID;
    this.accessToken = null;
  }

  // Initialize Google API
  async initializeGapi() {
    return new Promise((resolve, reject) => {
      try {
        if (window.gapi) {
          window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
              client_id: this.clientId,
            }).then(resolve).catch(reject);
          });
        } else {
          // Load Google API script if not already loaded
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => {
            window.gapi.load('auth2', () => {
              window.gapi.auth2.init({
                client_id: this.clientId,
              }).then(resolve).catch(reject);
            });
          };
          script.onerror = () => reject(new Error('Failed to load Google API'));
          document.body.appendChild(script);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Authenticate user
  async authenticate() {
    try {
      await this.initializeGapi();
      
      // Check if gapi is properly loaded
      if (!window.gapi || !window.gapi.auth2) {
        throw new Error('Google API not loaded properly');
      }
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        throw new Error('Google Auth instance not initialized');
      }
      
      console.log('Attempting to sign in...');
      const user = await authInstance.signIn({
        scope: 'https://www.googleapis.com/auth/calendar'
      });
      
      this.accessToken = user.getAuthResponse().access_token;
      console.log('Authentication successful');
      return this.accessToken;
    } catch (error) {
      console.error('Authentication failed:', error);
      
      // Provide helpful error messages
      if (error.error === 'popup_blocked_by_browser') {
        throw new Error('Popup was blocked by browser. Please allow popups for this site.');
      } else if (error.error === 'access_denied') {
        throw new Error('Access denied. Please grant calendar permissions.');
      } else if (error.error === 'redirect_uri_mismatch') {
        throw new Error('OAuth redirect URI mismatch. This might be a localhost issue.');
      }
      
      throw new Error(`Authentication failed: ${error.message || error.error || 'Unknown error'}`);
    }
  }

  // Check if user is signed in
  isSignedIn() {
    if (!window.gapi || !window.gapi.auth2) return false;
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance && authInstance.isSignedIn.get();
  }

  // Get current access token
  getCurrentToken() {
    if (!this.isSignedIn()) return null;
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    return user.getAuthResponse().access_token;
  }

  // Fetch calendar events
  async getEvents(timeMin = null, timeMax = null) {
    try {
      let token = this.accessToken || this.getCurrentToken();
      
      if (!token) {
        token = await this.authenticate();
      }

      const now = new Date();
      const startOfMonth = timeMin || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = timeMax || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const params = new URLSearchParams({
        timeMin: startOfMonth,
        timeMax: endOfMonth,
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '50'
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      if (error.message.includes('401')) {
        // Token expired, try to re-authenticate
        try {
          await this.authenticate();
          return this.getEvents(timeMin, timeMax);
        } catch (authError) {
          throw new Error('Authentication required');
        }
      }
      throw error;
    }
  }

  // Create a new event
  async createEvent(eventData) {
    try {
      let token = this.accessToken || this.getCurrentToken();
      
      if (!token) {
        token = await this.authenticate();
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  // Update an existing event
  async updateEvent(eventId, eventData) {
    try {
      let token = this.accessToken || this.getCurrentToken();
      
      if (!token) {
        token = await this.authenticate();
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(eventId) {
    try {
      let token = this.accessToken || this.getCurrentToken();
      
      if (!token) {
        token = await this.authenticate();
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }
}

export default new GoogleCalendarService();