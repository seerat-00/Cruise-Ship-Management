import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
// Import page components
import Home from './Home';
import Login from './Admin/Login';
import SignUp from './Admin/SignUp';
import Navigation from './Navigation';
import OrderCaterItems from './Voyager/OrderCaterItems';
import OrderStationeryItems from './Voyager/OrderStationeryItems';
import BookResortAndMovieTickets from './Voyager/BookResortandMovieTickets';
import BookPartyHall from './Voyager/BookPartyHall';
import BookFitnessCentre from './Voyager/BookFitnessCentre';
import BookBeautySalon from './Voyager/BookBeautySalon';
import Admin from './Admin/Admin';
import VoyagerRegistration from './Admin/VoyagerRegistration';
import ViewBookedPartyHalls from './Manager/ViewBookedPartyHall';
import ViewBookedBeautySalon from './Manager/ViewBookedBeautySalon';
import ViewBookedResortAndMovieTickets from './Manager/ViewBookedResortandMovieTickets';
import ViewBookedFitnessCentre from './Manager/ViewBookedFitnessCentre';
import ViewOrderedCateringItems from './Manager/ViewOrderedCateringItems';
import ViewOrderedStationeryItems from './Manager/ViewOrderedStationeryItems';

function App() {
  // State to check whether a user is logged in
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect to listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isLoggedIn = !!user;
      console.log('Auth state changed, user logged in:', isLoggedIn);
      setLoggedIn(isLoggedIn);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  return (
    <Router>
      {/* Navigation bar receives loggedIn and setLoggedIn for logout handling */}
      <Navigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      {/* All routes  */}
      <Routes>
        <Route path='/' element={<Home loggedIn={loggedIn} />} />
        <Route path="/admin/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path='/admin/signup' element={<SignUp />} />

        {/* Voyager routes */}
        <Route path="/voyager/catering" element={<OrderCaterItems />} />
        <Route path="/voyager/stationery" element={<OrderStationeryItems />} />
        <Route path="/voyager/resort" element={<BookResortAndMovieTickets />} />
        <Route path="/voyager/party" element={<BookPartyHall />} />
        <Route path="/voyager/fitness" element={<BookFitnessCentre />} />
        <Route path="/voyager/beauty" element={<BookBeautySalon />} />

        {/* Admin routes */}
        <Route path='/admin/manage' element={<Admin />} />
        <Route path='/admin/voyager' element={<VoyagerRegistration />} />

        {/* Manager routes */}
        <Route path='/manager/viewparty' element={<ViewBookedPartyHalls />} />
        <Route path='/manager/viewsalon' element={<ViewBookedBeautySalon />} />
        <Route path='/manager/viewresort' element={<ViewBookedResortAndMovieTickets />} />
        <Route path='/manager/viewfitness' element={<ViewBookedFitnessCentre />} />
        <Route path='/manager/viewcatering' element={<ViewOrderedCateringItems />} />
        <Route path='/manager/viewstationery' element={<ViewOrderedStationeryItems />} />
      </Routes>
    </Router>
  );
}

export default App;
