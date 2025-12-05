# Google Calendar Setup Instructions

## 🚀 REQUIRED STEPS TO MAKE GOOGLE CALENDAR WORK:

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### 2. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "Dashboard Calendar"
5. Authorized JavaScript origins:
   - `https://your-vercel-domain.vercel.app`
   - `http://localhost:3000` (for testing)
6. Authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/auth-callback`
   - `http://localhost:3000/auth-callback` (for testing)

### 3. Get Your Credentials
After creating, you'll get:
- **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-xxxxx`)

### 4. Update Environment Variables in Vercel
In your Vercel dashboard, add these environment variables:
- `GOOGLE_CLIENT_ID` = your_client_id_from_step_3
- `GOOGLE_CLIENT_SECRET` = your_client_secret_from_step_3
- `GOOGLE_REDIRECT_URI` = `https://your-vercel-domain.vercel.app/auth-callback`

### 5. Deploy and Test!
1. Deploy to Vercel
2. Click "Connect Google Calendar" 
3. Authorize access to your calendar
4. Your events should appear!

## 🔧 Files Created:
- `/api/auth/google.js` - Handles OAuth flow
- `/api/calendar/events.js` - Fetches calendar events
- `/public/auth-callback.html` - Handles OAuth callback
- `/src/services/googleCalendarAPI.js` - Frontend service

## ✅ This Will Work Because:
- Server-side API calls (no CORS issues)
- Proper OAuth 2.0 flow
- Vercel serverless functions handle Google API
- Your React app stays beautiful and functional!