import React from 'react';

const ScheduleItem = ({ schedule, onDelete }) => {
  const frequencyMap = {
    daily: 'Ежедневно',
    weekly: 'Еженедельно',
    monthly: 'Ежемесячно'
  };

  return (
    <div className="schedule-item">
      <div className="schedule-info">
        <h3>{schedule.name}</h3>
        <p>{frequencyMap[schedule.frequency]} в {schedule.time}</p>
      </div>
      
      <div className="schedule-actions">
        <button className="icon-btn settings-btn">⚙️</button>
        <button 
          className="icon-btn delete-btn"
          onClick={() => onDelete(schedule.id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem;