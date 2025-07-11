import React, { useState } from 'react';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleItem from './ScheduleItem';
import './../../styles/modal.css';

const ScheduleTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Основная копия', frequency: 'daily', time: '02:00' },
    { id: 2, name: 'Финансовая', frequency: 'weekly', time: '04:30' }
  ]);

  const handleCreateSchedule = (newSchedule) => {
    setSchedules([...schedules, { ...newSchedule, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div className="tab-panel">
      <div className="header-row">
        <h2>Расписания резервного копирования</h2>
        <button 
          className="btn create-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Создать расписание
        </button>
      </div>

      <div className="schedule-list">
        {schedules.map(schedule => (
          <ScheduleItem 
            key={schedule.id} 
            schedule={schedule} 
            onDelete={handleDeleteSchedule} 
          />
        ))}
      </div>

      {isModalOpen && (
        <CreateScheduleModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateSchedule}
        />
      )}
    </div>
  );
};

export default ScheduleTab;