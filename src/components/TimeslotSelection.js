import React from 'react';

function TimeslotSelection({ timeslots, onSelectTimeslot, selectedTimeslotId }) {
  return (
    <div className="timeslot-buttons">
      <h3>Select a Timeslot:</h3>
      {timeslots.length > 0 ? (
        <div>
          {timeslots.map((timeslot) => (
            <button
              key={timeslot.id}
              onClick={() => onSelectTimeslot(timeslot)}  // Use the prop function to select timeslot
              className={timeslot.id === selectedTimeslotId ? 'selected' : ''}  // Apply 'selected' class
            >
              {timeslot.time}
              {timeslot.id === selectedTimeslotId && (
                <i className="fa fa-check" style={{ marginLeft: '8px' }}></i> // Display checkmark for selected timeslot
              )}
            </button>
          ))}
        </div>
      ) : (
        <p>No available timeslots for the selected date and service.</p>
      )}
    </div>
  );
}

export default TimeslotSelection;
