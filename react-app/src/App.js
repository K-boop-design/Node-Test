
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import EventForm from './EventForm';
import LoginForm from './LoginForm'
import './App.css';
import LandingPage from './LandingPage';
import Events from './Events';
import Eventlist from './Eventlist';
// import openSocket from 'socket.io-client'
function App() {
  
  // const socket = openSocket("http://localhost:3001" , {transports: ['websocket']});
  // socket.on('register', data => {
  //   if (data.action === 'create') {
  //     console.log(data.register);
  //   }
  // });
  // console.log(socket)
  
  return (

    <div className="App">
      {/* <h1>Event Form</h1>
      <EventForm /> */}
      <Router>
      <Routes>
        <Route path="/register" element={<EventForm/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path='/landing' element={<LandingPage/>}/>
        <Route path='/evs' element={<Events/>}/>
        <Route path='/evslist' element={<Eventlist/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;



