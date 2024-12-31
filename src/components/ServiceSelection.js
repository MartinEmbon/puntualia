import React from 'react';
import './ServiceSelection.css';

function ServiceSelection({ services, onSelectService  }) {
  return (
    <div className="service-selection">
      <h2>Select a Service</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <button onClick={() => onSelectService(service)}>
              {service.name} ({service.duration})
            </button>
          </li>
        ))}
      </ul>

       {/* Back button to return to the date selection */}
       <div className="button-container">
        {/* <button onClick={onBack}>Back</button> */}
      </div>
    </div>
  );
}

export default ServiceSelection;
