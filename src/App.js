import React, {useState} from 'react';
//import './App.css';
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

import ProtectedRoute from './components/ProtectedRoute';
import Galery from './routes/Galery'
import UpdatePhotoGallery from './routes/UpdatePhotoGallery'
import Formulario from './routes/descripcion'
import Preview from './routes/Preview';
import Faqs from './routes/Faqs'


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
                <Route path="ver" element={<Formulario />} />  
                <Route path="preview" element={<Preview />} />  
                <Route path="faqs" element={<Faqs />} />  
               
               
                <Route path="photoUpload" element={<Galery />} />
                <Route path= "updatePhotoGallery" element={<UpdatePhotoGallery />}/>
              </Route>
            </Route>
         </Routes>
        </React.StrictMode>
      </GoogleOAuthProvider>

    </>
  );
}


