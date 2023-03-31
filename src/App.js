import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import LoginPage from './routes/LoginPage';
import HomePage from './routes/HomePage';
import DashBoardPage from './routes/DashboardPage';
import { Text, Image, View, Page, Document, PDFDownloadLink } from '@react-pdf/renderer';

import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar';
import Layout from './components/Layout';
import { Dashboard } from '@mui/icons-material';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="dashboard" element={<DashBoardPage />} />
         
         

          {/*
        <Route element={<RequireAuth allowedRoles={[ROLES.Inquilino]} />}>
          <Route path="/" element={<Home />} />
        </Route>
  
        <Route element={<RequireAuth allowedRoles={[ROLES.Casero]} />}>
          <Route path="editor" element={<Editor />} />
        </Route>
  
  
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
  
        <Route element={<RequireAuth allowedRoles={[ROLES.Casero, ROLES.Admin]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route> */}


         
        </Route>
      </Routes>
    </>
  );
}

export default App;
