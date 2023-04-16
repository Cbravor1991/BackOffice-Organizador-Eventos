import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

export default function UploadButtons() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button sx = {{backgroundColor: '#1286f7',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '30px',
    marginTop: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out'}}variant="contained" component="label">
        Cargar fotos
        
      </Button>
    </Stack>
  );
}
