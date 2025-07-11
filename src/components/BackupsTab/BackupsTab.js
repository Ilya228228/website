import React, { useState } from 'react';
import BackupsTable from './BackupsTable';

const BackupsTab = () => {
  const [backups, setBackups] = useState([
    { id: 1, name: 'backup_20230708.zip', date: '2023-07-08 02:00', size: '2.4 GB', status: 'Завершено' },
    { id: 2, name: 'backup_20230707.zip', date: '2023-07-07 02:00', size: '2.3 GB', status: 'Завершено' }
  ]);

  const handleCreateBackup = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newBackup = {
      id: Date.now(),
      name: `backup_${timestamp}.zip`,
      date: new Date().toLocaleString(),
      size: '0 KB',
      status: 'В процессе...'
    };
    
    setBackups([newBackup, ...backups]);
    
    // Симуляция процесса создания бэкапа
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id 
          ? { ...b, size: '2.4 GB', status: 'Завершено' } 
          : b
      ));
    }, 3000);
  };

  return (
    <div className="tab-panel">
      <div className="header-row">
        <h2>Резервные копии</h2>
        <button 
          className="btn create-now-btn"
          onClick={handleCreateBackup}
        >
          Создать сейчас
        </button>
      </div>
      
      <BackupsTable backups={backups} />
    </div>
  );
};

export default BackupsTab;