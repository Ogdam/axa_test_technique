import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateDevis from './components/CreateDevis.tsx';
import ProjetList from './components/ProjetList.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjetList />} /> {}
        <Route path="/devis/:id" element={<CreateDevis />} /> {}
        <Route path="/devis/" element={<CreateDevis />} /> {}
      </Routes>
    </Router>
  );
}

export default App;