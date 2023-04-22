import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardEvent() {
  return (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ backgroundColor: 'white', color: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '10%', py: 4 }}>
          <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Bienvenido a tu sección de preguntas frecuentes, recuerda que no es necesario que completes las cinco preguntas.
          </Typography>
          
        </Box>
      </Card>
    </Box>
  );
}