import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ViewBookedBeautySalon.css';

const ViewBookedBeautySalon = () => {
  // State to hold the list of appointments fetched from Firestore
  const [appointments, setAppointments] = useState([]);
  // State to track loading status for user feedback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async function to fetch appointments from Firestore
    const fetchAppointments = async () => {
      console.log('[ViewBookedBeautySalon] Starting to fetch appointments...');
      try {
        const salonRef = collection(db, 'beautyBookings');
        console.log('[ViewBookedBeautySalon] Reference to "beautyBookings" collection obtained.');
        
        const snapshot = await getDocs(salonRef);
        console.log(`[ViewBookedBeautySalon] Retrieved ${snapshot.size} documents from Firestore.`);

        // Map each document snapshot to an object with id and data fields
        const bookingsList = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`[ViewBookedBeautySalon] Processing document ID: ${doc.id}`, data);
          return {
            id: doc.id,
            ...data
          };
        });

        // Update state with fetched data
        setAppointments(bookingsList);
        console.log('[ViewBookedBeautySalon] Appointments state updated.');
      } catch (error) {
        // Log and alert any errors that occur during fetch
        console.error('[ViewBookedBeautySalon] Error fetching appointments:', error);
        alert('Failed to fetch appointments. Please try again.');
      } finally {
        // Always set loading to false after fetch attempt
        setLoading(false);
        console.log('[ViewBookedBeautySalon] Loading state set to false.');
      }
    };

    // Call the fetch function when component mounts
    fetchAppointments();
  }, []);

  return (
    <div className="view-salon-container">
      <h1>Booked Beauty Salon Appointments</h1>

      {loading ? (
        // Display loading indicator while fetching data
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        // Show message if no appointments found
        <p>No bookings found.</p>
      ) : (
        // Render table of appointments when data is available
        <table className="salon-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Quantity</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(({ id, hallName, date, startTime, endTime, quantity, bookedAt }) => (
              <tr key={id}>
                <td>{hallName}</td>
                <td>{date}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
                <td>{quantity}</td>
                {/* Format the bookedAt timestamp nicely */}
                <td>{bookedAt ? new Date(bookedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewBookedBeautySalon;
