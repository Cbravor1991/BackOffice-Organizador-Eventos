import React, { useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import { Button, Typography } from '@mui/material';
import ProgressBar from './ProgressBar';

function Galery() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [cover, setCover] = useState('');
  const [key, setKey] = useState(0);
  const types = ['image/png', 'image/jpeg'];

  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');

    } else {
      setFile(null);
      setError('Selecciona u archivo que sea una imagen (png or jpg)');
    }
  };

  return (
    <div>
      <div className="Galery">
        <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Selecciona tus fotos para cargar a la galeria
        </Typography>

        <Button sx={{ borderRadius: '30px' }} variant="outlined" component="label">
          Añadir foto
          <input type="file" onChange={handleChange} />
        </Button>

        <div className="output" >
          {error && <div className="error">{error}</div>}
          {file && <div sx={{ color: 'black' }}>{file.name}</div>}
          {file && <ProgressBar file={file} setFile={setFile} />}
        </div>

        <ImageGrid key={key} setKey={setKey} setCover={setCover} cover={cover} />
      </div>
    </div>
  )
}

export default Galery;
