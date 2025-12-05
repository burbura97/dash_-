import React from 'react';
import { 
  Plus, 
  UserPlus, 
  FileText, 
  Send, 
  Download,
  Zap
} from 'lucide-react';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: 'Add User',
      description: 'Create new user account',
      icon: UserPlus,
      color: '#3B82F6',
      onClick: () => console.log('Add User clicked')
    },
    {
      id: 2,
      title: 'New Report',
      description: 'Generate analytics report',
      icon: FileText,
      color: '#10B981',
      onClick: () => console.log('New Report clicked')
    },
    {
      id: 3,
      title: 'Send Invoice',
      description: 'Create and send invoice',
      icon: Send,
      color: '#F59E0B',
      onClick: () => console.log('Send Invoice clicked')
    },
    {
      id: 4,
      title: 'Export Data',
      description: 'Download CSV export',
      icon: Download,
      color: '#8B5CF6',
      onClick: () => console.log('Export Data clicked')
    }
  ];

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <div className="quick-actions-title-section">
          <Zap size={20} className="quick-actions-icon" />
          <h3 className="quick-actions-title">Quick Actions</h3>
        </div>
      </div>
      
      <div className="actions-grid">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className="action-card"
              onClick={action.onClick}
            >
              <div className="action-card-icon" style={{ backgroundColor: action.color }}>
                <IconComponent size={20} />
              </div>
              <div className="action-card-content">
                <div className="action-card-title">{action.title}</div>
                <div className="action-card-description">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      
      <button className="create-custom-action">
        <Plus size={16} />
        Create Custom Action
      </button>
    </div>
  );
};

export default QuickActions;