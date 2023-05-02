import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardEvent() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '10%', py: 4 }}>
      <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
        Bienvenido a tus eventos
      </Typography>
      <Button href={'/loadEvent'} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', backgroundColor: '#1286f7', borderRadius: 2, px: 4, py: 1, '&:hover': { backgroundColor: '#1286f7' } }}>
        Crear evento
      </Button>
    </Box>
  );
}
