import React from 'react';
function TimeslotSelection({ timeslots, onSelectTimeslot, selectedTimeslotId }) {
  return (
    <div className="timeslot-selection-container">
      <h3>Select a Timeslot</h3>
      <div className="timeslot-buttons">

        {timeslots.length > 0 ? (
          timeslots.map((timeslot, index) => (
            <button
              key={index}  // Use the index for the key (you can also use 'id' if timeslot data has one)
              onClick={() => onSelectTimeslot(timeslot)}  // Pass the whole timeslot object
              className={timeslot.id === selectedTimeslotId ? 'selected' : ''}  // Highlight the selected timeslot
            >
              {timeslot.time}
              {console.log(timeslots)}
            </button>
          ))
        ) : (
          <p>No available timeslots for the selected date and service.</p>
        )}
      </div>
    </div>
  );
}

export default TimeslotSelection;
