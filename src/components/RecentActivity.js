import React from 'react';
import { Activity, User, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import './RecentActivity.css';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'user',
      icon: User,
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 minutes ago',
      color: '#3B82F6'
    },
    {
      id: 2,
      type: 'order',
      icon: ShoppingBag,
      title: 'New order received',
      description: 'Order #1234 for $299.99',
      time: '5 minutes ago',
      color: '#10B981'
    },
    {
      id: 3,
      type: 'payment',
      icon: DollarSign,
      title: 'Payment processed',
      description: 'Invoice #INV-001 paid',
      time: '12 minutes ago',
      color: '#F59E0B'
    },
    {
      id: 4,
      type: 'user',
      icon: User,
      title: 'Profile updated',
      description: 'Sarah Smith updated profile',
      time: '1 hour ago',
      color: '#8B5CF6'
    },
    {
      id: 5,
      type: 'order',
      icon: ShoppingBag,
      title: 'Order shipped',
      description: 'Order #1230 shipped successfully',
      time: '2 hours ago',
      color: '#06B6D4'
    }
  ];

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <div className="activity-title-section">
          <Activity size={20} className="activity-icon" />
          <h3 className="activity-title">Recent Activity</h3>
        </div>
        <button className="view-all-btn">View All</button>
      </div>
      
      <div className="activity-list">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-item-icon" style={{ backgroundColor: activity.color }}>
                <IconComponent size={16} />
              </div>
              <div className="activity-item-content">
                <div className="activity-item-title">{activity.title}</div>
                <div className="activity-item-description">{activity.description}</div>
                <div className="activity-item-time">
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;