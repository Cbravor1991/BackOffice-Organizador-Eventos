import React, { useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import '../styles/index.css';
import { Button, Divider, Typography, TextField } from '@mui/material';
import ProgressBar from '../components/ProgressBar';
import Box from '@mui/material/Box';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import axios from '../api/axios';
import swal from 'sweetalert2';
import './swal.css'


function Galery() {

  const [selectedImg, setSelectedImg] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
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

     
      swal.fire({
        title: "Has creado tu evento correctamente",
        icon: "success",
        customClass: {
          container: 'spotify-modal-container',
          popup: 'spotify-modal-popup',
          title: 'spotify-modal-title',
          content: 'spotify-modal-content',
          confirmButton: 'spotify-modal-button',
          cancelButton: 'spotify-modal-button'
        },
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "Ir a mis eventos"
      }).then(function (result) {
        if (result.isConfirmed) {
          window.location.href = '/showEvents';
        } else if (result.isDismissed) {
          //window.location.href = "http://localhost:3000/editGallery";
        }
      });
      
      

  };

  return (
    <div className="Galery">
      <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
        Galeria
      </Typography>
      <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
        Selecciona una foto para eliminar o comvertirla en portada
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

      <ImageGrid setSelectedImg={setSelectedImg} />
    </div>
  )
}
export default Galery;
