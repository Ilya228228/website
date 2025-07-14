import React from 'react';

const ScheduleItem = ({ schedule, onDelete }) => {

  // Форматирование информации о расписании
  const getScheduleInfo = () => {
    switch(schedule.frequency) {
      case 'weekly':
        return (
          <>
            <span>Каждую неделю в </span>
            <span className="highlight-days">
              {schedule.weeklyDays?.join(', ') || 'не выбраны дни'}
            </span>
            <span> в {schedule.time}</span>
          </>
        );
      
      case 'monthly':
        const dayDisplay = schedule.monthlyDay === 0 
          ? 'последний день' 
          : `${schedule.monthlyDay} число`;

        return (
          <>
            <span>Каждый месяц </span>
            <span className="highlight-day">{dayDisplay}</span>
            <span> в {schedule.time}</span>
          </>
        );
      
      default:
        return `Ежедневно в ${schedule.time}`;
    }
  };

  return (
    <div className="schedule-item">
      <div className="schedule-info">
        <h3>{schedule.name}</h3>
        <div className="schedule-details">
          {getScheduleInfo()}
        </div>
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