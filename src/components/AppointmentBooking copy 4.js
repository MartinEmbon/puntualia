import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./AppointmentBooking.css";

// Import the necessary components
import ServiceSelection from "./ServiceSelection";
import TimeslotSelection from "./TimeslotSelection";
import DateSelection from "./DateSelection"; // New component for date selection

function AppointmentBooking() {
  const [services, setServices] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]); // State to store available dates
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [step, setStep] = useState(1); // Step state to manage current step in the process
  const [selectedTimeslotId, setSelectedTimeslotId] = useState(null); // Track selected timeslot

  const location = useLocation(); // Access query parameters from the URL
  const params = new URLSearchParams(location.search);
  const businessSlug = params.get("slug");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-services",
          {
            params: { username: "test" }, // Use actual username if needed
          }
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Fetch available dates when a service is selected
  const fetchAvailableDates = async (serviceId) => {
    try {
      const response = await axios.get(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-dates",
        {
          params: { username: "test", serviceId },
        }
      );
      setAvailableDates(response.data.days); // Assuming the response contains an array of available days
      setStep(2); // Move to the next step
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  // Fetch available timeslots for a specific date and service
  const fetchTimeslots = async (serviceId) => {
    try {
      const response = await axios.get(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot",
        {
          params: { username: "test", serviceId },
        }
      );
      console.log(response);
      const timeslotData = response.data.times.map((time, index) => ({
        id: index, // Assign a unique ID
        time: time,
        date: selectedDate, // Add the selected date to each timeslot
        service: selectedService ? selectedService.name : "", // Add the service name (if applicable)
      }));
      setTimeslots(timeslotData); // Update the timeslots with the new structure
      setStep(3); // Move to the next step for timeslot selection
    } catch (error) {
      console.error("Error fetching timeslots:", error);
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    fetchAvailableDates(service.id); // Fetch dates when service is selected
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    fetchTimeslots(selectedService.id); // Fetch timeslots when date is selected
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
    setSelectedDate(null);
    setStep(1); // Go back to step 1
  };

  const handleCancelAppointment = () => {
    setAppointmentConfirmed(false);
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate(null);
    setStep(1); // Go back to step 1 (service selection)
  };

  // const filteredTimeslots = selectedDate
  //   ? timeslots.filter(timeslot => timeslot.date === selectedDate && (!selectedService || timeslot.service === selectedService.name))
  //   : timeslots;

  const handleBack = () => {
    setStep(1);
    if (selectedService) setSelectedService(null);
    if (selectedDate) setSelectedDate(null);
  };

  return (
    <div className="appointment-booking">
      <h1>Book an Appointment</h1>

      {!appointmentConfirmed && (
        <div>
          {/* Service and Date Selection */}
          {step === 1 && !selectedService && (
            <ServiceSelection
              services={services}
              onSelectService={handleSelectService}
              // onBack={handleBack}
            />
          )}

          {/* Date Selection after Service */}
          {selectedService && step === 2 && (
            <DateSelection
              availableDates={availableDates}
              onSelectDate={handleSelectDate}
              onBack={handleBack}
            />
          )}

          {/* Timeslot Selection */}
          {selectedService && selectedDate && step === 3 && (
            <>
              <TimeslotSelection
                // timeslots={filteredTimeslots}
                timeslots={timeslots}
                onSelectTimeslot={handleSelectTimeslot}
                selectedTimeslotId={selectedTimeslotId}
              />
              <div className="confirm-button-container">
                {selectedTimeslot ? (
                  <button onClick={handleConfirmAppointment}>
                    Confirm Appointment
                  </button>
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
          <p>
            <strong>Service:</strong> {selectedService.name}
          </p>
          <p>
            <strong>Timeslot:</strong> {selectedTimeslot.time}
          </p>
          <p>
            <strong>Date:</strong> {selectedDate}
          </p>
          <button onClick={handleCancelAppointment}>Cancel Appointment</button>
        </div>
      )}
    </div>
  );
}

export default AppointmentBooking;
