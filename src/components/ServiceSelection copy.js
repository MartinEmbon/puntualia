import React from 'react';
import './ServiceSelection.css';

const ServiceSelection = ({ services, onSelectService }) => {
  return (
    <div>
      {services.length === 0 ? (
        <p>No services available</p>
      ) : (
        services.map((service) => (
          <div key={service.id} onClick={() => onSelectService(service)}>
            <p>{service.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ServiceSelection;
