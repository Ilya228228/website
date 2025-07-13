import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'schedule', label: 'Расписание' },
    { id: 'backups', label: 'Резервные копии' },
    { id: 'restore', label: 'Восстановление' },
    { id: 'cleanup', label: 'Очистка' }
  ];

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;