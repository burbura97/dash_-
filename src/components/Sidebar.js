import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: true },
    { name: 'Analytics', icon: BarChart3, active: false },
    { name: 'Users', icon: Users, active: false },
    { name: 'Notifications', icon: Bell, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo">Zenith</h1>
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.name}>
                  <button
                    className={`nav-item ${activeItem === item.name ? 'nav-item-active' : ''}`}
                    onClick={() => setActiveItem(item.name)}
                  >
                    <IconComponent size={20} className="nav-icon" />
                    <span className="nav-text">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <span>A</span>
            </div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-email">admin@zenith.com</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;