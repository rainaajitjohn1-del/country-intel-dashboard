import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CountryProfile from './pages/CountryProfile';
import Compare from './pages/Compare';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:iso_code" element={<CountryProfile />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Router>
  );
}

export default App;