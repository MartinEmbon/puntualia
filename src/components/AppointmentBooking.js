import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './AppointmentBooking.css';

// Import the necessary components
import UserDetailsForm from './UserDetailsForm';

import ServiceSelection from './ServiceSelection';
import TimeslotSelection from './TimeslotSelection';
import DateSelection from './DateSelection';  // New component for date selection

function AppointmentBooking({ userInfo }) {
  const [services, setServices] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);  // State to store available dates
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [step, setStep] = useState(1); // Step state to manage current step in the process
  const [selectedTimeslotId, setSelectedTimeslotId] = useState(null); // Track selected timeslot
  const [isDisabled, setIsDisabled] = useState(false); // Track button state
  const [isLoading, setIsLoading] = useState(false);   // Track loading state
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("User Info:", userInfo);
    // You can now use userInfo in the appointment booking logic
    // e.g., Fetch available timeslots or display a personalized message
  }, [userInfo]);



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

  // Fetch available dates when a service is selected
  const fetchAvailableDates = async (serviceId) => {
    try {
      const response = await axios.get('https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-dates', {
        params: { username: 'test', serviceId }
      });
      setAvailableDates(response.data.days);  // Assuming the response contains an array of available days
      setStep(2);  // Move to the next step
    } catch (error) {
      console.error('Error fetching available dates:', error);
    }
  };

  // Fetch available timeslots for a specific date and service
  const fetchTimeslots = async (serviceId) => {
    try {
      const response = await axios.get('https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-time-create-slot', {
        params: { username: 'test', serviceId }
      });
      console.log(response);
      const timeslotData = response.data.times.map((time, index) => ({
        id: index, // Assign a unique ID
        time: time,
        date: selectedDate,  // Add the selected date to each timeslot
        service: selectedService ? selectedService.name : ''  // Add the service name (if applicable)
      }));
      setTimeslots(timeslotData);  // Update the timeslots with the new structure
      setStep(3);  // Move to the next step for timeslot selection
    } catch (error) {
      console.error('Error fetching timeslots:', error);
    }
  };
  
  const handleSelectService = (service) => {
    setSelectedService(service);
    fetchAvailableDates(service.id);  // Fetch dates when service is selected
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    fetchTimeslots(selectedService.id);  // Fetch timeslots when date is selected
  };

  const handleSelectTimeslot = (timeslot) => {
    setSelectedTimeslot(timeslot);
    setSelectedTimeslotId(timeslot.id);
  };

  // const handleConfirmAppointment = () => {
  //   if (selectedService && selectedTimeslot) {
  //     setAppointmentConfirmed(true);
  //      // Format the message
  //   const message = `
  //    Appointment Confirmed:
  //       Name: ${userInfo.name}       
  //       DNI: ${userInfo.dni}
  //       Service: ${selectedService.name}
  //       Timeslot: ${selectedTimeslot.time}
  //       Date: ${selectedDate}
  // `;

  // // Encode the message to be URL safe
  // const encodedMessage = encodeURIComponent(message);

  // // WhatsApp API URL with the message
  // const whatsappUrl = `https://wa.me/543795003578?text=${encodedMessage}`;

  // // Open the WhatsApp link (this can open a new tab or directly open WhatsApp)
  // window.open(whatsappUrl, '_blank');

  //   }
  // };
  // const handleConfirmAppointment = async (timeSlot) => {
  //   try {
  //     // Assuming you already have the necessary data like username, serviceId, and selected timeSlot
  //     const username = localStorage.getItem("username");
  //     const serviceId = selectedService;  // Replace with your selected service ID
  
  //     const response = await axios.put(
  //       "https://us-central1-your-project-id.cloudfunctions.net/puntualiaTimeManagement",
  //       {
  //         username,
  //         serviceId,
  //         timeSlot
  //       }
  //     );
  
  //     if (response.status === 200) {
  //       alert("Appointment confirmed successfully!");
  //       // You can now proceed to call the WhatsApp API or any other logic.
  //     } else {
  //       alert("Failed to confirm appointment.");
  //     }
  //   } catch (error) {
  //     console.error("Error confirming appointment:", error);
  //     alert("Error confirming appointment, please try again.");
  //   }
  // };

  const handleConfirmAppointment = async () => {
    if (!selectedTimeslot || !selectedService) return;
  
    try {
      setIsDisabled(true);
      setIsLoading(true);
      setErrorMessage("");
  
      // Step 1: Make the POST request to the server to confirm the appointment
      const response = await axios.post("https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-upcoming-events", {
        selectedDate,
        timeSlot: selectedTimeslot,
        service: selectedService,
        client: userInfo.name,
        dni: userInfo.dni
      });
  
      // Step 2: Check if the POST request was successful
      if (response.status === 200) {
        alert("Appointment request sent! Await admin confirmation.");
  
        // Step 3: Send a WhatsApp notification in another tab
        const message = `
          Appointment Confirmed:
          Name: ${userInfo.name}       
          DNI: ${userInfo.dni}
          Service: ${selectedService.name}
          Timeslot: ${selectedTimeslot.time}
          Date: ${selectedDate}
        `;
  
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/543795003578?text=${encodedMessage}`;
  
        // Open WhatsApp in a new tab or the default WhatsApp app
        window.open(whatsappUrl, '_blank');
      } else {
        throw new Error("Failed to send appointment request.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
      setIsDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate(null);
    setStep(1); // Go back to step 1

    setIsDisabled(false); // Reset isDisabled
    setIsLoading(false); // Reset isLoading
  };

  const handleCancelAppointment = () => {
    setAppointmentConfirmed(false);
    setSelectedService(null);
    setSelectedTimeslot(null);
    setSelectedDate(null);
    setStep(1);  // Go back to step 1 (service selection)


  };

  // const filteredTimeslots = selectedDate
  //   ? timeslots.filter(timeslot => timeslot.date === selectedDate && (!selectedService || timeslot.service === selectedService.name))
  //   : timeslots;

  const handleBack = () => {
    if (step === 3) {
      // Clear the selected timeslot when going back to step 3 (Timeslot Selection)
      setSelectedTimeslot(null);
      setStep(2);  // Go back to step 2 (Date Selection)
    } else if (step === 2) {
      // Go back to step 1 (Service Selection)
      setStep(1);
      setSelectedService(null);  // Optionally reset service when going back to step 1
      setSelectedDate(null);     // Optionally reset date when going back to step 1
    }
    setIsDisabled(false); // Reset isDisabled
    setIsLoading(false); // Reset isLoading
  };

  return (
    <div className="appointment-booking">
      <h1>Book an Appointment {userInfo.name}</h1>
  
      {!appointmentConfirmed && (
        <div>
          {/* Service Selection */}
          {step === 1 && !selectedService && (
            <ServiceSelection
              services={services}
              onSelectService={handleSelectService}
              // No need to include onBack here
            />
          )}
  
          {/* Date Selection after Service */}
          {selectedService && step === 2 && (
            <DateSelection
              availableDates={availableDates}
              onSelectDate={handleSelectDate}
              // Only show Back button if step > 1
              // onBack={step > 1 ? handleBack : null}
              onBack={handleBack} // Pass the handleBack to the DateSelection component

            />
          )}
  
          {/* Timeslot Selection */}
          {selectedService && selectedDate && step === 3 && (
            <>
              <TimeslotSelection
                timeslots={timeslots}
                onSelectTimeslot={handleSelectTimeslot}
                selectedTimeslotId={selectedTimeslotId}
              />
              
              
              <div className="confirm-button-container">


                {/* {selectedTimeslot ? (
                  <button onClick={handleConfirmAppointment}>Confirm Appointment</button>
                ) : (
                  <p>Please select a timeslot.</p>
                )} */}

{selectedTimeslot ? (
        <>
          <button
            onClick={handleConfirmAppointment}
            disabled={isDisabled}
            className={`confirm-button ${isDisabled ? "disabled" : ""}`}
          >
            {isLoading ? "Processing..." : "Confirm Appointment"}
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
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
