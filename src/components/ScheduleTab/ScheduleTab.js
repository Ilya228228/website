import React, { useState } from 'react';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleItem from './ScheduleItem';
import { useModal } from '../common/ModalManager';

const ScheduleTab = () => {
  const { openModal } = useModal();
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Основная копия', frequency: 'daily', time: '02:00' },
    { id: 2, name: 'Финансовая', frequency: 'weekly', time: '04:30', weeklyDays: ['Пн', 'Ср', 'Пт'] },
    { id: 3, name: 'Архивная', frequency: 'monthly', time: '23:00', monthlyDay: 15 }
  ]);

  const handleCreateSchedule = (newSchedule) => {
    setSchedules([...schedules, { ...newSchedule, id: Date.now() }]);
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const openCreateModal = () => {
    openModal(
      <CreateScheduleModal 
        onCreate={handleCreateSchedule} 
      />
    );
  };

  return (
    <div className="tab-panel">
      <div className="header-row">
        <h2>Расписание резервного копирования</h2>
        <button 
          className="btn create-btn"
          onClick={openCreateModal}
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
    </div>
  );
};

export default ScheduleTab;