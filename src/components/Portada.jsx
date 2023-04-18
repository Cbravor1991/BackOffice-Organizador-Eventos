import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from '../api/axios';
import swal from 'sweetalert2';

export default function Portada(props) {
  console.log("entro")
  console.log(props.portada)

    


    

           
            
            
          
  return (
    <Card sx={{ maxWidth: 345 }}>
       <Typography variant="h6" component="div" sx={{ color: 'black', fontSize: 16, fontWeight: 700, mb: 2 }}>
          Foto de portada
        </Typography>
      <CardMedia
      
        sx={{ height: 200 }}
        image= {props.portada}
      />
      <CardContent>
       
      </CardContent>
      <CardActions>
        
      </CardActions>
    </Card>
  );
}