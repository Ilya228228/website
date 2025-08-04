import React from 'react';
import '@patternfly/elements/pf-icon/pf-icon.js';

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
        const dayDisplays = schedule.monthlyDays?.map(day => 
          day === 'last' ? 'последний день' : `${day} число`
        ) || [];

        return (
        <>
          <span>Каждый месяц </span>
          <span className="highlight-days">
            {dayDisplays.join(', ')}
          </span>
          <span> в {schedule.time}</span>
        </>
      );
      
      default:
        return `Ежедневно в ${schedule.time}`;
    }
  };

  // Функция для получения списка выбранных баз
  const getSelectedDatabases = () => {
    const selected = [];
    if (schedule.databases?.db1) selected.push('БД1');
    if (schedule.databases?.db2) selected.push('БД2');
    if (schedule.databases?.db3) selected.push('БД3');
    if (schedule.databases?.db4) selected.push('БД4');
    if (schedule.databases?.db5) selected.push('БД5');

    return selected.map((db, index) => (
      <span key={index} className="database-tag">
        {db}
      </span>
    ));
  };

  // Функция для отображения информации о хранилищах
  const getStorageInfo = () => {
    if (!schedule.storages || schedule.storages.length === 0) {
      return null;
    }

    return schedule.storages.map((storage, index) => {
      let typeName = '';
      switch (storage.type) {
        case 'local': typeName = 'Локальное'; break;
        case 'nfs': typeName = 'NFS'; break;
        case 'iscsi': typeName = 'iSCSI'; break;
        default: typeName = 'Неизвестно';
      }
      
      return (
        <div key={index} className="storage-block">
          <div className="storage-type">{typeName}</div>
          <div className="storage-path">{storage.path}</div>
          {storage.mountPoint && (
            <div className="storage-mount-point">
              <span className="arrow">→</span> {storage.mountPoint}
            </div>
          )}
        </div>
      );
    });
  };

  return (
  <div className="schedule-item">
    <div
    style={{ paddingLeft: '30px', paddingTop: '10px' }}
    >
      <div className={`status-indicator ${schedule.isScheduleActive ? 'active' : 'inactive'}`}></div>
      <div style={{fontSize:'16px'}}>
        <h3>{schedule.name}</h3>
      </div>

      <div className={'description'}>
        {schedule.description}
      </div>

      <div className="schedule-details">
        <pf-icon icon="clock" size="sm" style={{color: '#2464ec'}}></pf-icon>
        {getScheduleInfo()}
      </div>

      <div className={"maxCopies"}>
        Максимальное количество копий: 
        <span>{schedule.maxCopies}</span>
      </div>

      {/* Отображаем выбранные базы данных */}
      <div className="schedule-databases">
        <span>Компоненты: </span>
        <div className="database-tags">
          {getSelectedDatabases()}
        </div>
      </div>

      {/* Блок хранилищ */}
      {schedule.storages && schedule.storages.length > 0 && (
        <div className="schedule-storages">
          <span>Хранилища:</span>
          <div className="storages-list">
            {getStorageInfo()}
          </div>
        </div>
      )}
    </div>
    
      
      
      <div className="schedule-actions">
        <button className="icon-btn">
          <pf-icon icon="cog" size="md"></pf-icon>
        </button>
        <button 
          className="icon-btn"
          onClick={() => onDelete(schedule.id)}
        >
          <pf-icon icon="trash" size="md"></pf-icon>
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem;