import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import googleCalendarAPI from '../services/googleCalendarAPI';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and load events on mount
  useEffect(() => {
    setIsAuthenticated(googleCalendarAPI.isSignedIn());
    loadEvents();
  }, [currentDate]);

  // Load real Google Calendar events
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (googleCalendarAPI.isSignedIn()) {
        const googleEvents = await googleCalendarAPI.getEvents();
        // Transform Google Calendar events to our format
        const transformedEvents = googleEvents.map(event => ({
          id: event.id,
          title: event.summary || 'Untitled Event',
          start: event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date),
          end: event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date),
          location: event.location || '',
          description: event.description || '',
          isAllDay: !event.start.dateTime
        }));
        
        setEvents(transformedEvents);
        console.log('Loaded Google Calendar events:', transformedEvents);
      } else {
        // Show empty state if not authenticated
        setEvents([]);
        console.log('Not authenticated - showing empty calendar');
      }
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      setError('Failed to load calendar events. Please try connecting your Google Calendar.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Calendar authentication
  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await googleCalendarAPI.authenticate();
      setIsAuthenticated(true);
      await loadEvents();
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Failed to connect to Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    googleCalendarAPI.signOut();
    setIsAuthenticated(false);
    setEvents([]);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    console.log('Getting events for date:', dateStr, 'Total events:', events.length);
    
    const matchingEvents = events.filter(event => {
      // Handle Date objects from our API
      if (event.start instanceof Date) {
        const eventDate = event.start.toISOString().split('T')[0];
        console.log('Comparing:', eventDate, 'vs', dateStr, 'Match:', eventDate === dateStr);
        return eventDate === dateStr;
      }
      // Handle Google Calendar API format (legacy)
      if (event.start.date) {
        console.log('Legacy date format:', event.start.date, 'vs', dateStr);
        return event.start.date === dateStr;
      } else if (event.start.dateTime) {
        const eventDate = new Date(event.start.dateTime).toISOString().split('T')[0];
        console.log('Legacy dateTime format:', eventDate, 'vs', dateStr);
        return eventDate === dateStr;
      }
      return false;
    });
    
    console.log('Found matching events:', matchingEvents.length);
    return matchingEvents;
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayEvents = getEventsForDate(date);
    setSelectedEvents(dayEvents);
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    // Calculate calendar grid
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateForComparison = new Date();
    currentDateForComparison.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === currentDateForComparison.toDateString();
      const hasEvents = getEventsForDate(date).length > 0;
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        hasEvents,
        isSelected,
        events: getEventsForDate(date)
      });
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Time formatting is handled inline in the modal

  // Just load events directly - no auth needed

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth} className="nav-button">
            <ChevronLeft size={20} />
          </button>
          <h2 className="calendar-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={goToNextMonth} className="nav-button">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="calendar-actions">
          {!isAuthenticated ? (
            <button 
              onClick={handleGoogleAuth} 
              disabled={loading} 
              className="connect-button"
            >
              {loading ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
          ) : (
            <div className="auth-controls">
              <button 
                onClick={loadEvents} 
                disabled={loading} 
                className="refresh-button"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button 
                onClick={handleSignOut} 
                className="signout-button"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="calendar-grid">
        <div className="weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="days-grid">
          {generateCalendarGrid().map((dayData, index) => (
            <div
              key={index}
              className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} 
                         ${dayData.isToday ? 'today' : ''} 
                         ${dayData.isSelected ? 'selected' : ''} 
                         ${dayData.hasEvents ? 'has-events' : ''}`}
              onClick={() => handleDateClick(dayData.date)}
            >
              <span className="day-number">{dayData.day}</span>
              {dayData.hasEvents && (
                <div className="event-indicators">
                  {dayData.events.slice(0, 2).map((event, i) => (
                    <div key={i} className="event-preview" title={event.title}>
                      {event.title.length > 12 ? event.title.substring(0, 12) + "..." : event.title}
                    </div>
                  ))}
                  {dayData.events.length > 2 && (
                    <span className="more-events">+{dayData.events.length - 2} more</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && selectedEvents.length > 0 && (
        <div className="event-modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Events for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button className="close-modal" onClick={() => setSelectedDate(null)}>×</button>
            </div>
            <div className="events-list">
              {selectedEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-header">
                    <h4 className="event-title">{event.title}</h4>
                    <div className="event-time">
                      <Clock size={14} />
                      {event.start.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })} - {event.end.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                  {event.location && (
                    <div className="event-location">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  )}
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="event-attendees">
                      <span>With: {event.attendees.map(a => a.name || a.email).join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;