import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CountryProfile from './pages/CountryProfile';
import Compare from './pages/Compare';
import TravelEligibility from './pages/TravelEligibility';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import { AuthProvider } from './context/AuthContext';
import NotFound from './pages/NotFound';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:iso_code" element={<CountryProfile />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/travel" element={<TravelEligibility />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;