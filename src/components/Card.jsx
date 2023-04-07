import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const DELETE_PROPERTY_URL = '/deleteProperty/';

export default function Cards(props) {
  const stringDate = new Date(props.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return (
    <Box sx={{ mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: '#282828', color: '#fff' }}>
        <CardContent sx={{ pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
            {props.title}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
            {props.category}
          </Typography>
          <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 400, color: '#1DB954', mb: 1 }}>
            {stringDate}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
            {props.direction}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', pt: 0 }}>
          <Button href={'/editEvent'} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1DB954', borderRadius: 2, px: 2, py: 1, mr: 1, '&:hover': { backgroundColor: '#1ed760' } }}>
            Editar Evento
          </Button>
          <Button onClick={() => {}} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#191414', borderRadius: 2, px: 2, py: 1, '&:hover': { backgroundColor: '#1c1c1c' } }}>
            Eliminar Evento
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
