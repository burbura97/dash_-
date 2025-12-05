import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import './Chart.css';

const Chart = () => {
  const chartData = [
    { month: 'Jan', value: 65, height: '65%' },
    { month: 'Feb', value: 45, height: '45%' },
    { month: 'Mar', value: 78, height: '78%' },
    { month: 'Apr', value: 52, height: '52%' },
    { month: 'May', value: 90, height: '90%' },
    { month: 'Jun', value: 67, height: '67%' },
    { month: 'Jul', value: 85, height: '85%' },
    { month: 'Aug', value: 73, height: '73%' },
    { month: 'Sep', value: 92, height: '92%' },
    { month: 'Oct', value: 88, height: '88%' },
    { month: 'Nov', value: 95, height: '95%' },
    { month: 'Dec', value: 100, height: '100%' }
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Revenue Analytics</h3>
          <p className="chart-subtitle">Monthly performance overview</p>
        </div>
        <div className="chart-actions">
          <button className="chart-btn">
            <TrendingUp size={16} />
            View Details
          </button>
        </div>
      </div>
      
      <div className="chart-metrics">
        <div className="metric">
          <span className="metric-label">Total Revenue</span>
          <span className="metric-value">$547,890</span>
        </div>
        <div className="metric">
          <span className="metric-label">Growth</span>
          <span className="metric-value positive">+23.5%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Target</span>
          <span className="metric-value">$600,000</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <div className="chart">
          {chartData.map((item, index) => (
            <div key={index} className="chart-bar-container">
              <div 
                className="chart-bar"
                style={{ 
                  height: item.height,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="bar-value">${item.value}k</div>
              </div>
              <div className="chart-label">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;