import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, HashRouter } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes components
import Home from './features/Home';
import Mealplan from './features/Mealplan';
import Meal from './features/Meal';
import { Profile } from './features/Profile';

function App() {
  return (
    <div className="App">
      <HashRouter>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mealplan" element={<Mealplan />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

      </HashRouter>
    </div>
  );
}

export default App;
