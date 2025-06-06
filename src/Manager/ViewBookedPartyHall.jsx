import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ViewBookedPartyHall.css';

const ViewBookedPartyHalls = () => {
  // State to hold the list of bookings fetched from Firestore
  const [bookings, setBookings] = useState([]);
  // State to track loading status while fetching data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async function to fetch bookings from Firestore
    const fetchBookings = async () => {
      try {
        console.log('Starting to fetch bookings from Firestore...');
        // Reference to the 'bookings' collection in Firestore
        const bookingsRef = collection(db, 'bookings');
        // Get all documents from the collection
        const snapshot = await getDocs(bookingsRef);

        // Map over documents and create an array of booking objects
        const bookingsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Fetched bookings:', bookingsList);
        // Update state with the fetched bookings
        setBookings(bookingsList);
      } catch (error) {
        // Log error details to the console for debugging
        console.error('Error fetching bookings:', error);
        // Alert user about the failure
        alert('Failed to fetch bookings. Please try again.');
      } finally {
        // Regardless of success or failure, stop loading spinner
        setLoading(false);
        console.log('Finished fetching bookings.');
      }
    };

    // Call the fetch function when the component mounts
    fetchBookings();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="view-bookings-container">
      <h1>Booked Party Halls</h1>

      {/* Show loading message while fetching */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : 
      // Show message if no bookings are found
      bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        // Render bookings in a table
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Hall Name</th>
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
                {/* Convert bookedAt timestamp to a readable format */}
                <td>{new Date(bookedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewBookedPartyHalls;
