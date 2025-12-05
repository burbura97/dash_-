// Google Calendar service using Vercel serverless functions
class GoogleCalendarAPI {
  constructor() {
    this.accessToken = localStorage.getItem('googleAccessToken');
    this.isAuthenticated = !!this.accessToken;
    console.log('GoogleCalendarAPI initialized:', { 
      hasToken: !!this.accessToken, 
      isAuthenticated: this.isAuthenticated 
    });
  }

  async authenticate() {
    try {
      // Get auth URL from our serverless function
      const response = await fetch('/api/auth/google');
      const { authUrl } = await response.json();
      
      // Open popup for OAuth
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Check if we have a token in localStorage (set by popup callback)
            const token = localStorage.getItem('googleAccessToken');
            if (token) {
              this.accessToken = token;
              this.isAuthenticated = true;
              resolve(true);
            } else {
              reject(new Error('Authentication failed'));
            }
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async getEvents() {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`/api/calendar/events?accessToken=${this.accessToken}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, need to re-authenticate
          localStorage.removeItem('googleAccessToken');
          this.isAuthenticated = false;
          throw new Error('Authentication expired');
        }
        throw new Error('Failed to fetch events');
      }

      const { events } = await response.json();
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getUpcomingEvents(maxResults = 10) {
    try {
      const events = await this.getEvents();
      return events.slice(0, maxResults);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  async getTodayEvents() {
    try {
      const events = await this.getEvents();
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= today && eventDate < tomorrow;
      });
    } catch (error) {
      console.error('Error fetching today events:', error);
      return [];
    }
  }

  isSignedIn() {
    console.log('isSignedIn check:', this.isAuthenticated);
    return this.isAuthenticated;
  }

  signOut() {
    localStorage.removeItem('googleAccessToken');
    this.accessToken = null;
    this.isAuthenticated = false;
  }
}

export default new GoogleCalendarAPI();