import React, { useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import '../styles/index.css';
import { Button, Divider, Typography, TextField } from '@mui/material';
import './swal.css'
import Navbar from '../components/NavBar';
import useStorage from '../hooks/useStorage';


function Galery() {

  const [selectedImg, setSelectedImg] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const types = ['image/png', 'image/jpeg'];
  const{url, progress} = useStorage(file, setFile);
  
  window.localStorage.setItem('url', url);
  window.localStorage.setItem('progress', progress);
  
  console.log(url);

  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
       setFile(selected);
       window.localStorage.setItem('file', file);
       setError('');} else {
       setFile(null);
       setError('Selecciona u archivo que sea una imagen (png or jpg)');
     }};


  const handleEvent = (e) => {
    let photos = JSON.parse(window.localStorage.getItem("photos_user"));
        photos= [];
        window.localStorage.setItem("photos_user", JSON.stringify(photos));
        window.history.back();
    };


  return (
    <div>
    <Navbar />
    <div className="Galery">
      
      <Typography variant="h6" component="div" sx={{ color: 'black', marginTop: '10px', fontSize: 16, fontWeight: 700, mb: 2 }}>
        Selecciona tus fotos para cargar a la galeria
      </Typography>
      
      <Typography variant="h6" component="div" sx={{ fontSize: 14, fontWeight: 700, mb: 2 }}>
        Los formatos admitidos son jpg o png, con un tamaño máximo de 5 Mb.
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

      <ImageGrid setSelectedImg={setSelectedImg} />
    </div>
    </div>
  )
}
export default Galery;
