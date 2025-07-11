import React, { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import ScheduleTab from './components/ScheduleTab/ScheduleTab';
import BackupsTab from './components/BackupsTab/BackupsTab';
import RestoreTab from './components/RestoreTab';
import CleanupTab from './components/CleanupTab';
import './styles/main.css';

function App() {
  const [activeTab, setActiveTab] = useState('schedule');

  const renderTab = () => {
    switch(activeTab) {
      case 'schedule': return <ScheduleTab />;
      case 'backups': return <BackupsTab />;
      case 'restore': return <RestoreTab />;
      case 'cleanup': return <CleanupTab />;
      default: return <ScheduleTab />;
    }
  };

  return (
    <div className="app">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
}

export default App;