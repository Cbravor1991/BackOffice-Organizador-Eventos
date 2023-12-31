import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


export default function CardEvent() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '10%', py: 4 }}>
      <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 20, fontWeight: 700, mb: 2 }}>
        Bienvenido a tus eventos
      </Typography>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Button href={'/loadEvent'} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 14, fontWeight: 700, color: '#fff',
         justifyContent: 'left', backgroundColor: '#1286f7', borderRadius: 2, px: 4, py: 1, '&:hover': { backgroundColor: '#1286f7' } }}>
          Crear evento
        </Button>
      </Grid>  
      <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Button href={'/loadDrafts'} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 12, fontWeight: 600, color: '#fff',
         justifyContent: 'left', marginTop: '20px', backgroundColor: 'grey', borderRadius: 2, px: 4, py: 1,
          '&:hover': { backgroundColor: '#1286f7' } }}>
          Borradores
        </Button>
        <Button href={'/showsCanceled'} sx={{ fontFamily: "'Circular Std', Arial, sans-serif", fontSize: 12, fontWeight: 600, color: '#fff',
         justifyContent: 'right', marginTop: '20px', backgroundColor: 'grey', borderRadius: 2, px: 4, py: 1,
          '&:hover': { backgroundColor: '#1286f7' } }}>
          Cancelados
        </Button>

      </Grid>
    </Box>
  );
}
