import React from 'react';
import HomePage from './routes/HomePage';
import CreateEventForm from './routes/CreateEventForm';
import EditEvent from './routes/EditEvents';
import ShowsEvents from './routes/ShowsEvents';
import ShowsDrafts from './routes/ShowsDrafts';
import ShowsCanceled from './routes/ShowsCanceled';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import { FileLoaderGallery } from './components/FileLoaderGallery';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';
import Galery from './routes/Galery'
import UpdatePhotoGallery from './routes/UpdatePhotoGallery'
import Formulario from './routes/descripcion'
import Preview from './routes/Preview';
import PreviewDraft from './routes/PreviewDraft';
import Faqs from './routes/Faqs';
import View from './routes/View';


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
                <Route path="loadDrafts" element={<ShowsDrafts />} />
                <Route path="showsCanceled" element={<ShowsCanceled />} />
                <Route path="editEvent" element={<EditEvent />} />
                <Route path="fileLoaderGallery" element={<FileLoaderGallery />} />   
                <Route path="ver" element={<Formulario />} />  
                <Route path="preview" element={<Preview />} />  
                <Route path="previewDraft" element={<PreviewDraft />} />
                <Route path="view" element={<View />} />
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


