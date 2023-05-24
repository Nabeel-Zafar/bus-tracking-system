import React, { Component, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './Pages/Home'
import Login from './Pages/Login'
import EndUser from './Pages/EndUser';
import {
  Routes,
  Route,
} from "react-router-dom";

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
      {!loggedIn ?
      <Routes>  
        <Route path="/" exact element={<EndUser />} />
        <Route path="/login" element={<Login loginHandler={setLoggedIn}/>} />
        <Route path="*" element={<EndUser />} />
      </Routes> : <Home loginHandler={setLoggedIn}/>}
        {/* {loggedIn ? <Home /> : <Login loginHandler={setLoggedIn} />} */}
      </BrowserRouter>
    </div>
  );
}

export default App;
