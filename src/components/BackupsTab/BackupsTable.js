import React from 'react';

const BackupsTable = ({ backups }) => {
  return (
    <div className="backups-table">
      <table>
        <thead>
          <tr>
            <th>Имя файла</th>
            <th>Дата</th>
            <th>Размер</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {backups.map(backup => (
            <tr key={backup.id}>
              <td><b>{backup.name}</b></td>
              <td>{backup.date}</td>
              <td>{backup.size}</td>
              <td>
                <span className={`status-badge ${
                  backup.status === 'Завершено' ? 'status-completed' : 'status-pending'
                }`}>
                  {backup.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackupsTable;