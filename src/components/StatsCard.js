import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './StatsCard.css';

const StatsCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-title">{title}</div>
        <div className="stats-card-icon" style={{ backgroundColor: color }}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="stats-card-value">{value}</div>
      
      <div className="stats-card-change">
        <div className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{change}</span>
        </div>
        <span className="stats-period">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;