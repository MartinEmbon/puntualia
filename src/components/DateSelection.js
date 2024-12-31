import React from 'react';
import './DateSelection.css'; // Import the CSS file for styling

function DateSelection({ availableDates, onSelectDate, onBack }) {
  return (
    <div className="date-selection-container">
      <h2>Select a Date</h2>
      <div className="date-buttons">
        {availableDates.length > 0 ? (
          availableDates.map((date, index) => (
            <button
              key={index}
              className="date-button"
              onClick={() => onSelectDate(date)}
            >
              {date}
            </button>
          ))
        ) : (
          <p>No available dates for this service.</p>
        )}
      </div>
      <div className="button-container">
        <button className="back-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

export default DateSelection;
