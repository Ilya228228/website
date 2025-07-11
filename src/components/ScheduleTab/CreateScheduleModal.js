import React, { useState } from 'react';
import './../../styles/modal.css';

const CreateScheduleModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('00:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, frequency, time });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Создать расписание</h3>
          <button className="close-btn" onClick={onClose}>×</button>
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
  );
};

export default CreateScheduleModal;