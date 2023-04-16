import React, {useState} from 'react';
import './App.css';
import HomePage from './routes/HomePage';
import CreateEventForm from './routes/CreateEventForm';
//import EventList from './routes/EventList';
import ShowsEvents from './routes/ShowsEvents';
import EditEvent from './routes/EditEvents';

import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar';
import Layout from './components/Layout';
import { Dashboard } from '@mui/icons-material';
//import ImageLoader from './routes/ImageLoader';
import { FileLoaderGallery } from './components/FileLoaderGallery';
import { GoogleOAuthProvider } from '@react-oauth/google';
import EditGallery from './routes/EditGallery';
import ProtectedRoute from './components/ProtectedRoute';
import Galery from './routes/Galery'



export default function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <React.StrictMode>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* public routes */}
              <Route path="home" element={<HomePage />} />
              
              {/* private routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="loadEvent" element={<CreateEventForm />} />
                <Route path="eventList" element={<ShowsEvents />} />
                <Route path="showEvents" element={<ShowsEvents />} />
                <Route path="editEvent" element={<EditEvent />} />
                <Route path="fileLoaderGallery" element={<FileLoaderGallery />} />   
               
                <Route path="editGallery" element={<EditGallery />} />
                <Route path="galery" element={<Galery />} />
              </Route>
            </Route>
         </Routes>
        </React.StrictMode>
      </GoogleOAuthProvider>

    </>
  );
}


