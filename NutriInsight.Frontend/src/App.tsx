import { useEffect, useState } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes components
import Mealplan from './containers/Mealplan';
import Meal from './containers/Meal';
import Chat from './containers/Chat';
import FoodAgent from './containers/FoodAgent';
import Recipe from './containers/Recipe';
import { Ingredients } from './containers/Ingredients';
import { ImSun } from 'react-icons/im';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Calendar } from './containers/Calendar';
import React from 'react';
import { Hydration } from './containers/Hydration';
import Water from './containers/Water';
import { Profile } from './containers/Profile';

export const ThemeContext = React.createContext('light');


export const lightTheme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#CACACA',
  primaryColor: '#243DD7',
  basic: {
    100: 'white',
    200: '#f9f9f9'
  },
  turkus: {
    100: '#9EF0F0',
    200: '#3DDBD9',
    300: '#009D9A',
    400: '#007D79',
    500: '#004144',
    600: '#000000',
    700: '#000000'
  }
}

export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#CACACA',
  primaryColor: '#243DD7',
  background: '#999',
  basic: {
    100: '#262626',
    200: '#161616'
  },
  turkus: {
    100: '#9EF0F0',
    200: '#3DDBD9',
    300: '#009D9A',
    400: '#007D79',
    500: '#004144',
    600: '#000000',
    700: '#000000'
  }
}

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.basic[200]};
    color: ${({ theme }) => theme.text};
    font-family: Gilroy-Regular, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
  }
  p {
    
  }
  `

export const PrimaryButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 5px;
  width: 140px;
  color: ${({ theme }) => theme.primaryColor};
  border: 1px solid ${({ theme }) => theme.primaryColor};
  padding: 10px 20px;
  font-size: 16px;
  font-family: Gilroy-Medium;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.primaryColor};
    color: white;
    transition: 0.2s;
  }

  &:disabled {
    cursor: not-allowed;
    transition: 0.2s;
  }
`

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
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <div style={{ position: 'absolute', right: 20 }}><ImSun style={{ fontSize: '24px' }} onClick={toggleTheme}>Toggle Theme</ImSun></div>
        <HashRouter>
          <Routes>
            <Route path="/" element={<FoodAgent />} />
            <Route path="/mealplan" element={<Mealplan />} />
            <Route path="/meal" element={<Meal />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/recipe" element={<Recipe />} />


            <Route path="/hydration" element={<Hydration />} />
            <Route path="/water" element={<Water />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
