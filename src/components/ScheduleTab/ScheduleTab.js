import React, { useState } from 'react';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleItem from './ScheduleItem';
import './../../styles/modal.css';

const ScheduleTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState([
  { 
    id: 1, 
    name: 'Основная копия', 
    frequency: 'daily', 
    time: '02:00',
    databases: { db1: true, db2: true, db3: true },
    storages: [
      { type: 'local', path: '/var/backups' }
    ]
  },
  { 
    id: 2, 
    name: 'Финансовая', 
    frequency: 'weekly', 
    time: '04:30',
    weeklyDays: ['Пн', 'Ср', 'Пт'],
    databases: { db1: true, db2: false, db3: true },
    storages: [
      { type: 'nfs', path: '192.168.1.100:/backups', mountPoint: '/mnt/nfs' },
      { type: 'local', path: '/backups/finance' }
    ]
  },
  { 
    id: 3, 
    name: 'Архивная', 
    frequency: 'monthly', 
    time: '23:00',
    monthlyDays: [15],
    databases: { db1: false, db2: false, db3: true },
    storages: [
      { type: 'iscsi', path: 'iqn.2023-08.local:storage', mountPoint: '/mnt/iscsi' }
    ]
  }
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