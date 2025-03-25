import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import './App.css';
import NavBar from './components/NavBar';
import Scenario from './pages/Scenarios';
import CreateScenario from './components/CreateScenario';
import ProfilePage from './pages/ProfilePage';
// import 'bootstrap/dist/css/bootstrap.min.css';


function App(){
  return(
    <div>
      <BrowserRouter>
        <Routes>
          {/* Default Page */}
          <Route index element={<LoginPage/>} />

          <Route path = "/overview" element={<Overview/>} />
          <Route path = "/scenarios" element={<Scenario/>} />
          <Route path = "/createscenario" element={<CreateScenario/>} />
          <Route path = '/profile' element={<ProfilePage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
