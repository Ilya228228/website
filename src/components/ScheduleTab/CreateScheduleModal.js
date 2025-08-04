import React, { useState } from 'react';
import './../../styles/modal.css';

const CreateScheduleModal = ({ onClose, onCreate }) => {
  // Состояния
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('00:00');
  const [maxCopies, setMaxCopies] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState([]);
  const [databases, setDatabases] = useState({
    db1: true,
    db2: true,
    db3: true,
    db4: true,
    db5: true
  });
  const [storages, setStorages] = useState([]);
  const [showAddButton, setShowAddButton] = useState(true);
  const [errors, setErrors] = useState({});
  const [isScheduleActive, setIsScheduleActive] = useState(true); // Состояние для галочки
  const [originalStorageValues, setOriginalStorageValues] = useState({});

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const daysOfMonth = Array.from({ length: 27 }, (_, i) => i + 1);

  // Функция обработки изменений
  const handleMaxCopiesChange = (e) => {
    const value = e.target.value;
    
    // Разрешаем пустую строку для очистки поля
    if (value === '') {
      setMaxCopies('');
      return;
    }
    
    // Парсим введенное значение как целое число
    const numValue = parseInt(value, 10);
    
    // Игнорируем нечисловые вводы
    if (isNaN(numValue)) return;
    
    // Корректируем значение если < 1
    if (numValue < 1) {
      setMaxCopies('1');
    } else {
      setMaxCopies(value);
    }
  };

// Функция обработки потери фокуса
const handleMaxCopiesBlur = () => {
  if (maxCopies === '') return;
  
  const numValue = parseInt(maxCopies, 10);
  if (numValue < 1) {
    setMaxCopies('1');
  } else {
    // Убираем ведущие нули
    setMaxCopies(numValue.toString());
  }
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
    setStorages([...storages, { 
      type: '', 
      path: '', 
      mountPoint: '', 
      isSaved: false, 
      wasSaved: false 
    }]);
    setShowAddButton(false);
  };

  const saveStorage = (index) => {
    const storage = storages[index];
    const newErrors = {};
    let hasError = false;
    
    if (!storage.type) {
      newErrors.type = 'Выберите тип хранилища';
      hasError = true;
    }
    
    if (!storage.path) {
      newErrors.path = 'Укажите путь до хранилища';
      hasError = true;
    }
    
    if (storage.type !== 'local' && !storage.mountPoint) {
      newErrors.mountPoint = 'Укажите точку монтирования';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(prev => ({
        ...prev,
        storages: {
          ...prev.storages,
          [index]: newErrors
        }
      }));
      return;
    }

    const newStorages = [...storages];
    newStorages[index].isSaved = true;
    // Сохраняем информацию, что хранилище было сохранено ранее
    newStorages[index].wasSaved = true; 
    setStorages(newStorages);
    
    // Очищаем ошибки для этого хранилища
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.storages && newErrors.storages[index]) {
        delete newErrors.storages[index];
      }
      return newErrors;
    });
    setShowAddButton(true);
  };

  const editStorage = (index) => {
    setOriginalStorageValues({
      ...originalStorageValues,
      [index]: {...storages[index]}
    });
    
    const newStorages = [...storages];
    newStorages[index].isSaved = false;
    setStorages(newStorages);
  };

  const removeStorage = (index) => {
    const newStorages = [...storages];
    newStorages.splice(index, 1);
    setStorages(newStorages);
    
    // Очищаем ошибки для этого хранилища
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.storages && newErrors.storages[index]) {
        delete newErrors.storages[index];
      }
      return newErrors;
    });
    const remainingEditing = storages.filter((s, i) => i !== index && !s.isSaved);
    if (remainingEditing.length === 0) {
      setShowAddButton(true);
    }
  };

  // Функция для переключения состояния галочки
  const toggleScheduleActive = () => {
    setIsScheduleActive(!isScheduleActive);
  };

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
    const savedStorages = storages.filter(s => s.isSaved);
    if (savedStorages.length === 0) {
      newErrors.storagesGlobal = 'Необходимо добавить хотя бы одно хранилище';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // Формируем данные для расписания
    const scheduleData = { 
      isScheduleActive,
      name, 
      description,
      frequency, 
      time,
      maxCopies,
      isActive: isScheduleActive, // Добавляем состояние активности
      databases,
      storages: savedStorages,
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
              <header>Основные настройки</header>
            </div>
            <div className="form-group">
              <label>Название</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание при необходимости"
              />
            </div>
            
            <div className="form-group">
              <label>Частота</label>
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
                <label>Дни недели</label>
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
                <label>Дни месяца</label>
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
              <label>Время</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Максимальное количество копий</label>
              <input
                type="number"
                min="1"
                step="1"
                value={maxCopies}
                onChange={handleMaxCopiesChange}
                onBlur={handleMaxCopiesBlur}
                required
              />
            </div>

            {/* Галочка "Расписание активно" */}
            <div className="form-group">
              <div 
                className={`active-item ${isScheduleActive ? 'selected' : ''}`}
                onClick={toggleScheduleActive}
              >
                <div className="custom-checkbox">
                  <div className="check-icon">
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
                <span className="active-label">Расписание активно</span>
              </div>
            </div>
            
            {/* Блок выбора баз данных */}
              <div className="form-group">
                <header>Компоненты</header>
                {errors.databases && <div className="error-message">{errors.databases}</div>}
                
                <div className="databases-grid">
                  <div className="database-column">
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
                                <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2"/>
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
                  
                  <div className="database-column">
                    {['db4', 'db5'].map(db => (
                      <div 
                        key={db}
                        className={`database-item ${databases[db] ? 'selected' : ''}`}
                        onClick={() => handleDatabaseToggle(db)}
                      >
                        <div className="custom-checkbox">
                          {databases[db] && (
                            <div className="check-icon">
                              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                                <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="database-label">
                          {db === 'db4' && 'БД4'}
                          {db === 'db5' && 'БД5'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            
           {/* Блок хранилищ */}
          <div className="form-group-storage">
            <header style={{fontSize: 'larger'}}>Хранилища</header>
            {errors.storagesGlobal && <div className="error-message">{errors.storagesGlobal}</div>}
            
            {storages.map((storage, index) => {
              const storageError = errors.storages?.[index] || {};
              
              // Определяем классы для разных состояний
              let storageBlockClass = 'storage-adding';
              if (storage.isSaved) {
                storageBlockClass = 'storage-saved';
              } else if (storage.wasSaved) {
                storageBlockClass = 'storage-editing';
              }
              
              return (
                <div key={index} className={storageBlockClass}>
                  {storage.isSaved ? (
                    // Режим просмотра сохраненного хранилища
                    <div className="storage-view">
                      <div className="storage-info">
                        <span className="storage-value">
                          {storage.type === 'local' && 'Локальное'}
                          {storage.type === 'nfs' && 'NFS'}
                          {storage.type === 'iscsi' && 'iSCSI'}
                        </span>
                        
                        <div>
                          <span className="storage-label">Путь до хранилища: </span>
                          <span className="storage-value">{storage.path}</span>
                        </div>
                        
                        {storage.type !== 'local' && (
                          <div>
                            <span className="storage-label">Точка монтирования: </span>
                            <span className="storage-value">{storage.mountPoint}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="storage-actions">
                        <button 
                          type="button" 
                          className="icon-btn"
                          onClick={() => editStorage(index)}
                          title="Изменить"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 512 512"
                            className="pf-icon-edit"
                            aria-hidden="true"
                          >
                            <path 
                              fill="currentColor" 
                              d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"
                            />
                          </svg>
                        </button>
                        <button 
                          type="button" 
                          className="icon-btn"
                          onClick={() => removeStorage(index)}
                          title="Удалить"
                        >
                          <pf-icon icon="trash" size="md"></pf-icon>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Режим редактирования хранилища
                    <div className="storage-edit">
                      <div className="storage-info-header">
                        {storage.wasSaved ? 'Редактировать хранилище' : 'Добавить новое хранилище'}
                      </div>

                      <div className='storage-info-red'>
                        Тип
                      </div>

                      <div className="storage-row">
                        <select
                          value={storage.type}
                          onChange={(e) => handleStorageTypeChange(index, e.target.value)}
                          className={storageError.type ? 'error' : ''}
                        >
                          <option value="" disabled selected hidden>Выберите тип</option>
                          <option value="local">Локальное хранилище</option>
                          <option value="nfs">NFS</option>
                          <option value="iscsi">iSCSI</option>
                        </select>
                      </div>
                      {storageError.type && <div className="error-message">{storageError.type}</div>}

                      <div className="input-group-red">
                        Путь до хранилища
                        <input
                          type="text"
                          placeholder="/path/to/storage"
                          value={storage.path}
                          onChange={(e) => handleStoragePathChange(index, e.target.value)}
                          className={storageError.path ? 'error' : ''}
                        />
                        {storageError.path && <div className="error-message">{storageError.path}</div>}
                      </div>

                      {storage.type !== 'local' && storage.type !== '' && (
                        <div className="input-group-red">
                          Точка монтирования
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
                      
                      <div className="storage-edit-actions">
                        <button 
                          type="button" 
                          className="btn save-storage-btn"
                          onClick={() => saveStorage(index)}
                        >
                          {storage.wasSaved ? 'Сохранить изменения' : 'Добавить хранилище'}
                        </button>
                        <button 
                          type="button" 
                          className="btn cancel-storage-btn"
                          onClick={() => {
                            if (storage.wasSaved) {
                              // Для существующего хранилища: просто выходим из режима редактирования
                              const newStorages = [...storages];
                              newStorages[index].isSaved = true;
                              setStorages(newStorages);
                            } else {
                              // Для нового хранилища: удаляем его
                              removeStorage(index);
                            }
                          }}
                        >
                          Отменить
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {showAddButton && (
              <button 
                type="button" 
                className="btn add-storage-btn"
                onClick={addStorage}
              >
                + Добавить хранилище
              </button>
            )}
          </div>
            
            <div className="form-actions">
              <button type="submit" className="btn create-modal-btn">
                Создать
              </button>
              <button style={{border: '1px solid #ddd'}} type="button" className="btn cancel-btn" onClick={onClose}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;