import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './AppointmentBooking.css';

// Import the necessary components
import ServiceSelection from './ServiceSelection';
import TimeslotSelection from './TimeslotSelection';

function AppointmentBooking() {
  const [services, setServices] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [step, setStep] = useState(1); // Step state to manage current step in the process
  const [selectedTimeslotId, setSelectedTimeslotId] = useState(null); // Track selected timeslot

  const location = useLocation();  // Access query parameters from the URL
  const params = new URLSearchParams(location.search);
  const businessSlug = params.get('slug');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-services', {
          params: { username: 'test' } // Use actual username if needed
        });
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setStep(2);  // Move to the next step when a service is selected
  };

  const handleSelectTimeslot = (timeslot) => {
    setSelectedTimeslot(timeslot);
    setSelectedTimeslotId(timeslot.id);
  };

  const handleConfirmAppointment = () => {
    if (selectedService && selectedTimeslot) {
      setAppointmentConfirmed(true);
    }
  };

  const handleCancel = () => {
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate('');
    setStep(1); // Go back to step 1
  };

  const handleCancelAppointment = () => {
    setAppointmentConfirmed(false);
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate('');
  };

  const filteredTimeslots = selectedDate
    ? timeslots.filter(timeslot => timeslot.date === selectedDate && (!selectedService || timeslot.service === selectedService.name))
    : timeslots;

  const handleBack = () => {
    setStep(1);
    if (selectedService) setSelectedService(null);
    if (selectedDate) setSelectedDate('');
  };

  return (
    <div className="appointment-booking">
      <h1>Book an Appointment</h1>

      {!appointmentConfirmed && (
        <div>
          {/* Date Picker */}
          {!selectedDate && (
            <div>
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Disable past dates
                placeholder="Select a date"
              />
            </div>
          )}

          {/* Service and Timeslot Selection */}
          {selectedDate && step === 1 && (
            <ServiceSelection
              services={services}
              onSelectService={handleSelectService}
              onBack={handleBack}
            />
          )}

          {selectedDate && step === 2 && selectedService && (
            <>
              <TimeslotSelection
                timeslots={filteredTimeslots}
                onSelectTimeslot={handleSelectTimeslot}
                selectedTimeslotId={selectedTimeslotId}
              />
              <div className="confirm-button-container">
                {selectedTimeslot ? (
                  <button onClick={handleConfirmAppointment}>Confirm Appointment</button>
                ) : (
                  <p>Please select a timeslot.</p>
                )}
              </div>
              <div className="button-container">
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleBack}>Back</button>
              </div>
            </>
          )}
        </div>
      )}

      {appointmentConfirmed && (
        <div className="appointment-confirmed">
          <h2>Appointment Confirmed</h2>
          <p><strong>Service:</strong> {selectedService.name}</p>
          <p><strong>Timeslot:</strong> {selectedTimeslot.time}</p>
          <p><strong>Date:</strong> {selectedDate}</p>
          <button onClick={handleCancelAppointment}>Cancel Appointment</button>
        </div>
      )}
    </div>
  );
}

export default AppointmentBooking;
