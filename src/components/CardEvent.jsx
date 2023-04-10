import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardEvent() {
  return (
    <Box sx={{ mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#282828', color: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%', py: 8 }}>
          <Typography variant="h6" component="div" sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>
            Bienvenido nuevamente crea un nuevo evento
          </Typography>
          <Button href={'/loadEvent'} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 4, py: 2, '&:hover': { backgroundColor: '#1286f7' } }}>
            Crear evento
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
