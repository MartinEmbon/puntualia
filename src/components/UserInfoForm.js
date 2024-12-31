import React, { useState } from 'react';
import './UserInfoForm.css'; // Importing the styles

const UserInfoForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name &&dni) {
      onSubmit({ name, dni });
    } else {
      alert("Please enter both name and DNI");
    }
  };

  return (
    <form className="user-info-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Name:</label>
        <input
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">DNI:</label>
        <input
          className="form-input"
          type="number"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />
      </div>
      {/* <div className="form-group">
        <label className="form-label">Cellphone:</label>
        <input
          className="form-input"
          type="number"
          value={cellphone}
          onChange={(e) => setCellphone(e.target.value)}
          required
        />
      </div> */}
      <button className="submit-btn" type="submit">Next</button>
    </form>
  );
};

export default UserInfoForm;
