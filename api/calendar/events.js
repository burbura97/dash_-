// Google Calendar events endpoint for Vercel serverless function
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.query;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const now = new Date().toISOString();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      timeMax: oneMonthFromNow.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      start: event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date),
      end: event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date),
      location: event.location || '',
      description: event.description || '',
      isAllDay: !event.start.dateTime,
      attendees: event.attendees || []
    }));

    res.json({ events });
  } catch (error) {
    console.error('Calendar API error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}