import React, { Component, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './Pages/Home'
import Login from './Pages/Login'

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)
  useEffect(() => {
    if(localStorage.getItem("user")){
      setLoggedIn(true)
    }
  })
  return (
    <div className="App">
      <BrowserRouter>
        {loggedIn ? <Home /> : <Login loginHandler={setLoggedIn} />}
      </BrowserRouter>
    </div>
  );
}

export default App;
