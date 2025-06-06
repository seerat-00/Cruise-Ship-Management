import React, { useState, useEffect } from 'react';
import './BookResortandMovieTickets.css';
import { FaHotel, FaFilm } from 'react-icons/fa';
import { db } from '../Firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Static data for resorts with basic info and icons
const resortitems = [
  { id: 1, name: 'Beachside Resort', type: 'Resort', price: 250, description: 'Relaxing beachside getaway', icon: <FaHotel /> },
  { id: 2, name: 'Mountain View Resort', type: 'Resort', price: 180, description: 'Scenic mountain views', icon: <FaHotel /> },
];

// Static data for movie venues with seat info and current movie showing
const movieItems = [
  { id: 3, name: 'City Lights Cinema', type: 'Movie', price: 15, description: 'Latest movies in comfort', icon: <FaFilm />, totalSeats: 100, showing: 'Interstellar' },
  { id: 4, name: 'Premium 3D Movie', type: 'Movie', price: 20, description: 'Immersive 3D experience', icon: <FaFilm />, totalSeats: 80, showing: 'Inception' },
];

function BookResortAndMovieTickets() {
  // State for date and time inputs to filter bookings
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Resort bookings selected by user, stored as an array of items with quantity
  const [resortCart, setResortCart] = useState([]);

  // State for movie selection and quantity of tickets
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieQuantity, setMovieQuantity] = useState(1);

  // Tracks available seats dynamically based on existing bookings and selected time
  const [availableSeats, setAvailableSeats] = useState(0);

  // Helper to convert time string "HH:MM" to total minutes for comparison
  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  // Effect to update available seats whenever date/time or selected movie changes
  useEffect(() => {
    async function fetchAvailableSeats() {
      if (!selectedMovie || !date || !startTime || !endTime) {
        // If any input missing, reset available seats to zero
        setAvailableSeats(0);
        console.log('Missing input for available seats calculation, resetting to 0.');
        return;
      }
      try {
        // Query existing bookings for the selected movie and date
        const bookingQuery = query(
          collection(db, 'resortAndMovieBookings'),
          where('hallId', '==', selectedMovie.id),
          where('date', '==', date)
        );
        const querySnapshot = await getDocs(bookingQuery);

        let seatsBooked = 0;
        const startInput = timeToMinutes(startTime);
        const endInput = timeToMinutes(endTime);

        // Calculate seats booked for overlapping time periods
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          const bookedStart = timeToMinutes(booking.startTime);
          const bookedEnd = timeToMinutes(booking.endTime);

          // Check for overlapping bookings
          if (startInput < bookedEnd && endInput > bookedStart) {
            seatsBooked += booking.quantity;
          }
        });

        // Compute and set available seats left
        const seatsLeft = selectedMovie.totalSeats - seatsBooked;
        setAvailableSeats(seatsLeft);
        console.log(`Available seats for ${selectedMovie.name} on ${date} between ${startTime} and ${endTime}: ${seatsLeft}`);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setAvailableSeats(0);
      }
    }

    fetchAvailableSeats();
  }, [selectedMovie, date, startTime, endTime]);

  // Add resort to cart only if not already added
  const addToResortCart = (item) => {
    if (resortCart.find(i => i.id === item.id)) {
      alert(`${item.name} already added to cart.`);
      console.warn(`Attempted to add duplicate resort: ${item.name}`);
      return;
    }
    setResortCart([...resortCart, { ...item, quantity: 1 }]);
    console.log(`Added resort to cart: ${item.name}`);
  };

  // Remove resort from cart by ID
  const removeFromResortCart = (id) => {
    setResortCart(resortCart.filter(i => i.id !== id));
    console.log(`Removed resort with id ${id} from cart.`);
  };

  // Clear all resorts from cart
  const clearResortCart = () => {
    setResortCart([]);
    console.log('Cleared all resort bookings from cart.');
  };

  // Clear movie selection and reset related states
  const clearMovieSelection = () => {
    setSelectedMovie(null);
    setMovieQuantity(1);
    setAvailableSeats(0);
    console.log('Cleared movie selection and reset quantity and seats.');
  };

  // Increment movie ticket quantity but not exceeding available seats
  const incrementMovieQty = () => {
    if (movieQuantity < availableSeats) {
      setMovieQuantity(movieQuantity + 1);
      console.log(`Increased movie ticket quantity to ${movieQuantity + 1}.`);
    }
  };

  // Decrement movie ticket quantity but not below 1
  const decrementMovieQty = () => {
    if (movieQuantity > 1) {
      setMovieQuantity(movieQuantity - 1);
      console.log(`Decreased movie ticket quantity to ${movieQuantity - 1}.`);
    }
  };

  // Function to validate and place the booking order
  const placeOrder = async () => {
    // Basic validation for date and time
    if (!date || !startTime || !endTime) {
      alert('Please select date and time.');
      console.warn('Booking failed: missing date or time inputs.');
      return;
    }
    if (startTime >= endTime) {
      alert('Start time must be before end time.');
      console.warn('Booking failed: start time is not before end time.');
      return;
    }

    // Ensure user selected at least one booking option
    if (resortCart.length === 0 && !selectedMovie) {
      alert('Please add resort bookings or select a movie.');
      console.warn('Booking failed: no resorts or movie selected.');
      return;
    }

    try {
      // Check for conflicting bookings for each resort in cart
      for (const item of resortCart) {
        const bookingQuery = query(
          collection(db, 'resortAndMovieBookings'),
          where('hallId', '==', item.id),
          where('date', '==', date)
        );
        const querySnapshot = await getDocs(bookingQuery);

        const startInput = timeToMinutes(startTime);
        const endInput = timeToMinutes(endTime);

        for (const doc of querySnapshot.docs) {
          const booking = doc.data();
          const bookedStart = timeToMinutes(booking.startTime);
          const bookedEnd = timeToMinutes(booking.endTime);

          // Detect overlap and alert if found
          if (startInput < bookedEnd && endInput > bookedStart) {
            alert(`"${item.name}" is already booked from ${booking.startTime} to ${booking.endTime} on ${date}.`);
            console.warn(`Booking conflict detected for ${item.name} on ${date} from ${booking.startTime} to ${booking.endTime}.`);
            return;
          }
        }
      }

      // For movie booking, verify enough seats are available
      if (selectedMovie) {
        if (movieQuantity > availableSeats) {
          alert(`Only ${availableSeats} seats are available for "${selectedMovie.name}".`);
          console.warn(`Booking failed: insufficient seats for ${selectedMovie.name}. Requested: ${movieQuantity}, Available: ${availableSeats}`);
          return;
        }
      }

      // Save resort bookings to Firestore
      for (const item of resortCart) {
        await addDoc(collection(db, 'resortAndMovieBookings'), {
          hallId: item.id,
          hallName: item.name,
          quantity: item.quantity,
          date,
          startTime,
          endTime,
          bookedAt: new Date().toISOString(),
        });
        console.log(`Resort booking saved for ${item.name} on ${date}`);
      }

      // Save movie booking to Firestore if selected
      if (selectedMovie) {
        await addDoc(collection(db, 'resortAndMovieBookings'), {
          hallId: selectedMovie.id,
          hallName: selectedMovie.name,
          quantity: movieQuantity,
          date,
          startTime,
          endTime,
          bookedAt: new Date().toISOString(),
          movieShowing: selectedMovie.showing,
        });
        console.log(`Movie booking saved for ${selectedMovie.name} (${movieQuantity} tickets) on ${date}`);
      }

      // Notify user and reset form states on success
      alert('Booking confirmed!');
      console.info('Booking confirmed and data saved successfully.');

      setResortCart([]);
      setSelectedMovie(null);
      setMovieQuantity(1);
      setDate('');
      setStartTime('');
      setEndTime('');
      setAvailableSeats(0);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <main className="resort-container">
      <h1 className="resort-title">Book Resorts & Movie Tickets</h1>

      {/* Date and Time selection form */}
      <div className="resort-form">
        <label>
          Select Date:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </label>

        <label>
          Start Time:
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        </label>

        <label>
          End Time:
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        </label>
      </div>

      {/* Resort selection section */}
      <section aria-label="Available Resorts">
        <h2>Resorts</h2>
        <div className="resort-booking-grid">
          {resortitems.map(({ id, name, description, icon }) => (
            <article key={id} className="resort-card" tabIndex={0} aria-describedby={`desc-resort-${id}`}>
              <div className="resort-icon" aria-hidden="true">{icon}</div>
              <h3>{name}</h3>
              <p id={`desc-resort-${id}`}>{description}</p>
              <button onClick={() => addToResortCart({ id, name, description })} aria-label={`Add ${name} to booking`}>
                Add
              </button>
            </article>
          ))}
        </div>
        {/* Button to clear all resort bookings if any are selected */}
        {resortCart.length > 0 && (
          <button onClick={clearResortCart} className="clear-button" aria-label="Clear all resort bookings">
            Clear Resort Bookings
          </button>
        )}
      </section>

      {/* Selected resort bookings displayed in a sidebar */}
      <aside aria-label="Selected resort bookings" className="resort-cart">
        <h2>Your Resort Bookings</h2>
        {resortCart.length > 0 ? (
          <ul>
            {resortCart.map(({ id, name, quantity }) => (
              <li key={id} className="resort-cart-item">
                <span>{name} x ({quantity})</span>
                <button onClick={() => removeFromResortCart(id)} aria-label={`Remove ${name} from booking`}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No resorts added.</p>
        )}
      </aside>

      {/* Movie ticket selection */}
      <section aria-label="Movie selection" className="movie-selection">
        <h2>Movie Tickets</h2>
        <label htmlFor="movie-select">Select a Movie:</label>
        <select
          id="movie-select"
          value={selectedMovie ? selectedMovie.id : ''}
          onChange={(e) => {
            const movie = movieItems.find(item => item.id === parseInt(e.target.value));
            setSelectedMovie(movie || null);
            setMovieQuantity(1);
            console.log(movie ? `Selected movie: ${movie.name}` : 'Movie selection cleared');
          }}
        >
          <option value="">-- Choose a Movie --</option>
          {movieItems.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        {/* Display movie details and quantity controls if a movie is selected */}
        {selectedMovie && (
          <>
            <div className="movie-ticket-details">
              <p><strong>Now Showing:</strong> {selectedMovie.showing}</p>
              <p>{selectedMovie.description}</p>
              <p>Total Seats: {selectedMovie.totalSeats}</p>
              <p>Available Seats for selected time: {availableSeats}</p>

              <div>
                <button
                  onClick={decrementMovieQty}
                  aria-label="Decrease ticket quantity"
                  disabled={movieQuantity <= 1}
                >−</button>
                <span aria-live="polite" style={{ margin: '0 10px' }}>{movieQuantity}</span>
                <button
                  onClick={incrementMovieQty}
                  aria-label="Increase ticket quantity"
                  disabled={movieQuantity >= availableSeats}
                >+</button>
              </div>
            </div>
            {/* Button to clear current movie selection */}
            <button onClick={clearMovieSelection} className="clear-button" aria-label="Clear movie selection">
              Clear Movie Selection
            </button>
          </>
        )}
      </section>

      {/* Confirm booking button */}
      <div className="resort-button-group">
        <button className="fitness-order-button" onClick={placeOrder} aria-label="Confirm all bookings">
          Confirm Booking
        </button>
      </div>
    </main>
  );
}

export default BookResortAndMovieTickets;
