import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CountryProfile from './pages/CountryProfile';
import Compare from './pages/Compare';
import TravelEligibility from './pages/TravelEligibility';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:iso_code" element={<CountryProfile />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/travel" element={<TravelEligibility />} />
      </Routes>
    </Router>
  );
}

export default App;