// Google OAuth endpoint for Vercel serverless function
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      prompt: 'consent'
    });
    
    res.json({ authUrl });
  } else if (req.method === 'POST') {
    // Exchange code for tokens
    const { code } = req.body;
    
    try {
      const { tokens } = await oauth2Client.getAccessToken(code);
      oauth2Client.setCredentials(tokens);
      
      // Store tokens securely (you might want to use a database)
      res.json({ success: true, tokens });
    } catch (error) {
      console.error('Token exchange error:', error);
      res.status(500).json({ error: 'Failed to exchange code for tokens' });
    }
  }
}