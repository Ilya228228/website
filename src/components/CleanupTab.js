import React from 'react';

const CleanupTab = () => {
  return (
    <div className="tab-panel">
      <h2>Очистка резервных копий</h2>
      <div className="cleanup-content">
        <p>Управление политиками хранения резервных копий:</p>
        {/* Здесь будут настройки очистки */}
        <button className="btn cleanup-btn">Очистить старые копии</button>
      </div>
    </div>
  );
};

export default CleanupTab;