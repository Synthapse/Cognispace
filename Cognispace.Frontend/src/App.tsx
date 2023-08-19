import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes components
import Home from './features/Home';
import Meatplan from './features/Meatplan';

function App() {
  return (
    <div className="App">
    <Router>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meatplan" element={<Meatplan />} /> 
        </Routes>
      
    </Router>
    </div>
  );
}

export default App;
