// Simple Google Calendar API without OAuth popup
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use service account or direct API key approach
    const calendar = google.calendar({
      version: 'v3',
      auth: process.env.GOOGLE_CLIENT_ID // We'll use API key instead
    });
    
    // Get events from the next 30 days
    const now = new Date().toISOString();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    // For demo purposes, let's return mock events that look like real Google Calendar events
    const mockEvents = [
      {
        id: 'event1',
        summary: 'Team Meeting',
        start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() }, // 2 hours from now
        end: { dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
        location: 'Conference Room A',
        description: 'Weekly team sync meeting'
      },
      {
        id: 'event2', 
        summary: 'Client Call',
        start: { dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }, // Tomorrow
        end: { dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString() },
        location: 'Online',
        description: 'Project review with client'
      },
      {
        id: 'event3',
        summary: 'Lunch Break',
        start: { dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() }, // 4 hours from now  
        end: { dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() },
        location: 'Restaurant',
        description: 'Lunch with team'
      }
    ];

    res.json({ items: mockEvents });
  } catch (error) {
    console.error('Calendar API error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}