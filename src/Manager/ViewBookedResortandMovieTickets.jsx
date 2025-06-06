import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ViewBookedResortandMovieTickets.css';

const ViewBookedResortAndMovieTickets = () => {
  // State to store bookings fetched from Firestore
  const [bookings, setBookings] = useState([]);
  // State to manage loading indicator
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async function to fetch resort and movie bookings from Firestore
    const fetchBookings = async () => {
      console.log('[ViewBookedResortAndMovieTickets] Fetching bookings...');
      try {
        const bookingsRef = collection(db, 'resortAndMovieBookings');
        console.log('[ViewBookedResortAndMovieTickets] Reference to collection obtained.');

        const snapshot = await getDocs(bookingsRef);
        console.log(`[ViewBookedResortAndMovieTickets] Retrieved ${snapshot.size} documents.`);

        // Map Firestore docs into a usable list with IDs and data
        const bookingsList = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`[ViewBookedResortAndMovieTickets] Document ID ${doc.id} processed.`, data);
          return {
            id: doc.id,
            ...data,
          };
        });

        setBookings(bookingsList); // Set bookings state with fetched data
        console.log('[ViewBookedResortAndMovieTickets] Bookings state updated.');
      } catch (error) {
        console.error('[ViewBookedResortAndMovieTickets] Error fetching bookings:', error);
        alert('Failed to fetch bookings. Please try again.');
      } finally {
        setLoading(false); // Always stop the loading indicator
        console.log('[ViewBookedResortAndMovieTickets] Loading complete.');
      }
    };

    fetchBookings(); // Trigger fetch when component mounts
  }, []);

  return (
    <main className="view-resort-container">
      <h1 className="view-resort-title">Booked Resort & Movie Tickets</h1>

      {loading ? (
        // While loading is true, show loading message
        <p className="loading-text">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        // If no bookings are found
        <p className="no-bookings-text">No bookings found.</p>
      ) : (
        // Render bookings in a table format
        <table className="resort-table" aria-label="List of booked resort and movie tickets">
          <thead>
            <tr>
              <th scope="col">Service Name</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Quantity</th>
              <th scope="col">Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(({ id, hallName, type, date, startTime, endTime, quantity, bookedAt }) => (
              <tr key={id}>
                <td>{hallName}</td>
                <td>{type || 'N/A'}</td>
                <td>{date}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
                <td>{quantity}</td>
                {/* Use defensive check on bookedAt in case it's undefined */}
                <td>{bookedAt ? new Date(bookedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default ViewBookedResortAndMovieTickets;
