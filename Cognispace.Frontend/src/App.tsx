import { useEffect, useState } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes components
import Home from './features/Home';
import Mealplan from './features/Mealplan';
import Meal from './features/Meal';
import { Profile } from './features/Profile/Profile';
import Chat from './features/Chat';
import FoodAgent from './features/FoodAgent';
import Recipe from './features/Recipe';
import { Ingredients } from './features/Profile/Ingredients';
import './style/main.scss';
import { ImSun } from 'react-icons/im';
import { Calendar } from './features/Profile/Calendar';
import React from 'react';

export const ThemeContext = React.createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };


  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <div className={`App ${theme}`}>
      <ThemeContext.Provider value={theme}>
        <div style={{ position: 'absolute', right: 20 }}><ImSun style={{ fontSize: '24px' }} onClick={toggleTheme}>Toggle Theme</ImSun></div>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/food" element={<FoodAgent />} />
            <Route path="/mealplan" element={<Mealplan />} />
            <Route path="/meal" element={<Meal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/recipe" element={<Recipe />} />
          </Routes>
        </HashRouter>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
