import React from 'react';
import '@patternfly/elements/pf-icon/pf-icon.js';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'schedule', label: 'Расписание', icon: 'calendar' },
    { id: 'backups', label: 'Резервные копии', icon: 'file-alt' },
    { id: 'restore', label: 'Восстановление', icon: 'redo' },
    { id: 'cleanup', label: 'Очистка', icon: 'trash' }
  ];

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          style={{
            display: 'flex',
            gap: '8px',
          }}
        >
          <pf-icon icon={tab.icon} size="md"></pf-icon>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;