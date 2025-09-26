// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async'; // <--- YA NO SE NECESITA
import HomePage from './HomePage';
import InfographicPage from './InfographicPage';

function App() {
  return (
    // <HelmetProvider> // <--- QUITA ESTA LÍNEA
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/infografia" element={<InfographicPage />} />
        </Routes>
      </Router>
    // </HelmetProvider> // <--- QUITA ESTA LÍNEA
  );
}

export default App;