import React, { useEffect, useState } from 'react';
import './ViewBookedFitnessCentre.css';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

const ViewBookedFitnessCentre = () => {
  // State to hold the list of fitness center bookings fetched from Firestore
  const [bookings, setBookings] = useState([]);
  // State to track loading status for user feedback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async function to fetch bookings from Firestore
    const fetchBookings = async () => {
      console.log('[ViewBookedFitnessCentre] Fetching bookings started...');
      try {
        // Reference to the 'fitnessBookings' collection in Firestore
        const bookingsRef = collection(db, 'fitnessBookings');
        console.log('[ViewBookedFitnessCentre] Collection reference obtained.');

        // Fetch all documents in the collection
        const snapshot = await getDocs(bookingsRef);
        console.log(`[ViewBookedFitnessCentre] Retrieved ${snapshot.size} bookings.`);

        // Map documents to an array of booking objects with id and data
        const bookingsList = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`[ViewBookedFitnessCentre] Processing document ID: ${doc.id}`, data);
          return {
            id: doc.id,
            ...data,
          };
        });

        // Update state with fetched bookings
        setBookings(bookingsList);
        console.log('[ViewBookedFitnessCentre] Bookings state updated.');
      } catch (error) {
        // Log and alert if there is an error during fetch
        console.error('[ViewBookedFitnessCentre] Error fetching bookings:', error);
        alert('Failed to fetch bookings. Please try again.');
      } finally {
        // Always turn off loading spinner after attempt
        setLoading(false);
        console.log('[ViewBookedFitnessCentre] Loading finished.');
      }
    };

    // Invoke fetch function on component mount
    fetchBookings();
  }, []);

  return (
    <div className="view-fitness-container">
      <h1>Fitness Center</h1>

      {loading ? (
        // Show loading message while fetching data
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        // Show message if no bookings are found
        <p>No bookings found.</p>
      ) : (
        // Display bookings in a table if data is available
        <table className="fitness-table">
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
            {bookings.map(({ id, hallName, date, startTime, endTime, quantity, bookedAt }) => (
              <tr key={id}>
                <td>{hallName}</td>
                <td>{date}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
                <td>{quantity}</td>
                {/* Defensive check for bookedAt */}
                <td>{bookedAt ? new Date(bookedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewBookedFitnessCentre;
