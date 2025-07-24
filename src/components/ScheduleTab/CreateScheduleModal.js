import React, { useState } from 'react';
import './../../styles/modal.css';

const CreateScheduleModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('00:00');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState([]);
  const [databases, setDatabases] = useState({
    db1: true,
    db2: true,
    db3: true
  });
  const [storages, setStorages] = useState([
    { type: '', path: '', mountPoint: '' }
  ]);
  const [errors, setErrors] = useState({});

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const daysOfMonth = Array.from({ length: 27 }, (_, i) => i + 1);

  // Функции для работы с днями недели/месяца
  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleMonthDay = (day) => {
    setSelectedMonthDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Функции для работы с базами данных
  const handleDatabaseToggle = (db) => {
    setDatabases({
      ...databases,
      [db]: !databases[db]
    });
  };

  // Функции для работы с хранилищами
  const handleStorageTypeChange = (index, value) => {
    const newStorages = [...storages];
    newStorages[index].type = value;
    
    if (value === 'local') {
      newStorages[index].mountPoint = '';
    }
    
    setStorages(newStorages);
  };

  const handleStoragePathChange = (index, value) => {
    const newStorages = [...storages];
    newStorages[index].path = value;
    setStorages(newStorages);
  };

  const handleMountPointChange = (index, value) => {
    const newStorages = [...storages];
    newStorages[index].mountPoint = value;
    setStorages(newStorages);
  };

  const addStorage = () => {
    setStorages([...storages, { type: '', path: '', mountPoint: '' }]);
  };

  const removeStorage = (index) => {
    if (storages.length > 1) {
      const newStorages = [...storages];
      newStorages.splice(index, 1);
      setStorages(newStorages);
    }
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    let hasError = false;
    
    // Валидация баз данных
    const selectedDbs = Object.values(databases).filter(val => val);
    if (selectedDbs.length === 0) {
      newErrors.databases = 'Выберите хотя бы одну базу данных';
      hasError = true;
    }
    
    // Валидация дней недели
    if (frequency === 'weekly' && selectedDays.length === 0) {
      newErrors.weekly = 'Выберите хотя бы один день недели';
      hasError = true;
    }
    
    // Валидация дней месяца
    if (frequency === 'monthly' && selectedMonthDays.length === 0) {
      newErrors.monthly = 'Выберите хотя бы один день месяца';
      hasError = true;
    }
    
    // Валидация хранилищ
    const storageErrors = [];
    let hasStorageError = false;
    let hasValidStorage = false;
    
    storages.forEach((storage, index) => {
      const errors = {};
      
      if (!storage.type) {
        errors.type = 'Выберите тип хранилища';
        hasStorageError = true;
      } else {
        if (!storage.path) {
          errors.path = 'Укажите путь';
          hasStorageError = true;
        }
        
        if (storage.type !== 'local' && !storage.mountPoint) {
          errors.mountPoint = 'Укажите точку монтирования';
          hasStorageError = true;
        }
        
        // Проверяем есть ли хотя бы одно полностью заполненное хранилище
        if (storage.type && storage.path && 
            (storage.type === 'local' || storage.mountPoint)) {
          hasValidStorage = true;
        }
      }
      
      storageErrors[index] = errors;
    });
    
    if (!hasValidStorage) {
      newErrors.storagesGlobal = 'Необходимо указать хотя бы одно хранилище';
      hasError = true;
    }
    
    if (hasStorageError) {
      newErrors.storages = storageErrors;
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // Формируем данные для расписания
    const scheduleData = { 
      name, 
      frequency, 
      time,
      databases,
      storages: storages.filter(s => s.type && s.path), // Фильтруем пустые
      ...(frequency === 'weekly' && { weeklyDays: selectedDays }),
      ...(frequency === 'monthly' && { monthlyDays: selectedMonthDays })
    };
    
    onCreate(scheduleData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Создать расписание</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Частота:</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
            
            {/* Блок выбора дней недели */}
            {frequency === 'weekly' && (
              <div className="form-group">
                <label>Дни недели:</label>
                {errors.weekly && <div className="error-message">{errors.weekly}</div>}
                <div className="days-selector">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`day-btn ${selectedDays.includes(day) ? 'selected' : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Блок выбора дней месяца */}
            {frequency === 'monthly' && (
              <div className="form-group">
                <label>Дни месяца:</label>
                {errors.monthly && <div className="error-message">{errors.monthly}</div>}
                <div className="month-day-selector">
                  {daysOfMonth.map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-btn ${selectedMonthDays.includes(day) ? 'selected' : ''}`}
                      onClick={() => toggleMonthDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`day-btn last-day ${selectedMonthDays.includes('last') ? 'selected' : ''}`}
                    onClick={() => toggleMonthDay('last')}
                  >
                    Последний день
                  </button>
                </div>
              </div>
            )}
            
            {/* Блок выбора времени */}
            <div className="form-group">
              <label>Время:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            
            {/* Блок выбора баз данных */}
            <div className="form-group">
              <label>Компоненты:</label>
              {errors.databases && <div className="error-message">{errors.databases}</div>}
              <div className="databases-selector">
                {['db1', 'db2', 'db3'].map(db => (
                  <div 
                    key={db}
                    className={`database-item ${databases[db] ? 'selected' : ''}`}
                    onClick={() => handleDatabaseToggle(db)}
                  >
                    <div className="custom-checkbox">
                      {databases[db] && (
                        <div className="check-icon">
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="database-label">
                      {db === 'db1' && 'БД1'}
                      {db === 'db2' && 'БД2'}
                      {db === 'db3' && 'БД3'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Блок хранилищ */}
            <div className="form-group">
              <label>Хранилища:</label>
              {errors.storagesGlobal && <div className="error-message">{errors.storagesGlobal}</div>}
              
              {storages.map((storage, index) => {
                const storageError = errors.storages?.[index] || {};
                
                return (
                  <div key={index} className="storage-block">
                    <div className="storage-row">
                      <select
                        value={storage.type}
                        onChange={(e) => handleStorageTypeChange(index, e.target.value)}
                        className={storageError.type ? 'error' : ''}
                      >
                        <option value="">Выберите тип хранилища</option>
                        <option value="local">Локальное</option>
                        <option value="nfs">NFS</option>
                        <option value="iscsi">iSCSI</option>
                      </select>
                      
                      <button 
                        type="button" 
                        className="remove-storage-btn"
                        onClick={() => removeStorage(index)}
                        disabled={storages.length <= 1}
                      >
                        ×
                      </button>
                    </div>
                    {storageError.type && <div className="error-message">{storageError.type}</div>}
                    
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Путь до хранилища"
                        value={storage.path}
                        onChange={(e) => handleStoragePathChange(index, e.target.value)}
                        className={storageError.path ? 'error' : ''}
                      />
                      {storageError.path && <div className="error-message">{storageError.path}</div>}
                    </div>
                    
                    {storage.type !== 'local' && storage.type !== '' && (
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="Точка монтирования"
                          value={storage.mountPoint}
                          onChange={(e) => handleMountPointChange(index, e.target.value)}
                          className={storageError.mountPoint ? 'error' : ''}
                        />
                        {storageError.mountPoint && <div className="error-message">{storageError.mountPoint}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <button 
                type="button" 
                className="btn add-storage-btn"
                onClick={addStorage}
              >
                + Добавить хранилище
              </button>
            </div>
            
          
            <div className="form-actions">
              <button type="button" className="btn cancel-btn" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn create-btn">
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;