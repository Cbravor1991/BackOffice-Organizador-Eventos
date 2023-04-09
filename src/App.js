import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import LoginPage from './routes/LoginPage';
import HomePage from './routes/HomePage';
import DashBoardPage from './routes/DashboardPage';
import CreateEventForm from './routes/CreateEventForm';
import EventList from './routes/EventList';
import ShowsEvents from './routes/ShowsEvents';
import EditEvent from './routes/EditEvents';

import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar';
import Layout from './components/Layout';
import { Dashboard } from '@mui/icons-material';
import ImageLoader from './routes/ImageLoader';
import { FileLoaderGallery } from './components/FileLoaderGallery';
import EditGallery from './routes/EditGallery';


export default function App() {
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
          <Route path="loadEvent" element={<CreateEventForm />} />
          <Route path="eventList" element={<EventList />} />
          <Route path="showEvents" element={<ShowsEvents />} />
          <Route path="editEvent" element={<EditEvent />} />
          <Route path="fileLoaderGallery" element={<FileLoaderGallery />} />   
          <Route path="imageLoader" element={<ImageLoader />} />   
          <Route path="editGallery" element={<EditGallery />} />

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


