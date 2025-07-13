import React, { useState } from 'react';
import { useModal } from '../common/ModalManager';
import './../../styles/modal.css';

const CreateScheduleModal = ({ onCreate }) => {
  const { closeModal } = useModal();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('00:00');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const scheduleData = { 
      name, 
      frequency, 
      time,
      ...(frequency === 'weekly' && { weeklyDays: selectedDays }),
      ...(frequency === 'monthly' && { monthlyDay: dayOfMonth })
    };
    
    onCreate(scheduleData);
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <h3>Создать расписание</h3>
        <button className="close-btn" onClick={closeModal}>×</button>
      </div>
      
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
        
        {frequency === 'weekly' && (
          <div className="form-group">
            <label>Дни недели:</label>
            <div className="days-selector">
              {daysOfWeek.map((day, index) => (
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
        
        {frequency === 'monthly' && (
          <div className="form-group">
            <label>День месяца:</label>
            <div className="month-day-selector">
              {daysOfMonth.map(day => (
                <button
                  key={day}
                  type="button"
                  className={`day-btn ${dayOfMonth === day ? 'selected' : ''}`}
                  onClick={() => setDayOfMonth(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label>Время:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn cancel-btn" onClick={closeModal}>
            Отмена
          </button>
          <button type="submit" className="btn create-btn">
            Создать
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateScheduleModal;