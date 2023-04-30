import React, { useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import '../styles/index.css';
import { Button, Divider, Typography, TextField } from '@mui/material';
import ProgressBar from '../components/ProgressBar';
import './swal.css'
import Navbar from '../components/NavBar';
import Portada from '../components/Portada';


function Galery() {

  const [selectedImg, setSelectedImg] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [cover, setCover] = useState('');
  const types = ['image/png', 'image/jpeg'];

  const handleChange = (e) => {
   let selected = e.target.files[0];
  if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');} else {
      setFile(null);
      setError('Selecciona u archivo que sea una imagen (png or jpg)');
    }};

    const handleEvent = (e) => {

      let photos = JSON.parse(window.localStorage.getItem("cache_images"));
          photos= [];
          window.localStorage.setItem("cache_images", JSON.stringify(photos));
          window.location.href = '/updatePhotoGallery';


      
      

  };

  return (
    <div>
    <Navbar />
    <div className="Galery">
      
      <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
        Selecciona tus fotos para cargar a la galeria
      </Typography>

      <Button sx={{
        backgroundColor: '#1286f7',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '30px',
        marginTop: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out'
      }} variant="contained" component="label">
        Añadir foto
        <input type="file" onChange={handleChange} />
      </Button>



      <div className="output" >
        {error && <div className="error">{error}</div>}
        {file && <div sx={{ color: 'black' }}>{file.name}</div>}
        {file && <ProgressBar file={file} setFile={setFile} />}
      </div>

      <Button onClick={handleEvent}  sx={{
        backgroundColor: '#1286f7',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '30px',
        marginTop: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out'
      }} variant="contained" component="label">
        Finalizar carga de fotos
       
      </Button>
    

      <ImageGrid setCover={setCover} cover = {cover} />
    </div>
    </div>
  )
}
export default Galery;
