import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, HashRouter } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes components
import Home from './features/Home';
import Mealplan from './features/Mealplan';
import Meal from './features/Meal';
import { Profile } from './features/Profile';
import Chat from './features/Chat';
import FoodAgent from './features/FoodAgent';
import Recipe from './features/Recipe';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/food" element={<FoodAgent />} />
          <Route path="/mealplan" element={<Mealplan />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/recipe" element={<Recipe />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
