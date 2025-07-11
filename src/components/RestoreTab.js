import React from 'react';

const RestoreTab = () => {
  return (
    <div className="tab-panel">
      <h2>Восстановление данных</h2>
      <div className="restore-content">
        <p>Выберите резервную копию для восстановления:</p>
        {/* Здесь будет компонент выбора бэкапа */}
        <button className="btn restore-btn">Восстановить</button>
      </div>
    </div>
  );
};

export default RestoreTab;