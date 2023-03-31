import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Home from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import UserMenu from './UserMenu';

export default function ButtonAppBar() {
  let username = window.localStorage.getItem("username")    

  return (
    <Box sx={{ flexGrow: 1, mb: -10 }}>
      <AppBar position="static" sx={{background:'#e67e22'}}>
        <Toolbar>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HospedateAhora
          </Typography>
        {(username) ? (<>
        <Button>
            <Link style={{ color:"white", textDecoration: 'none' }} to="/showsAllPublications">
                    Publicaciones
            </Link>
        </Button>
        <UserMenu username={username}></UserMenu></>)
      : <></>}

          <IconButton>
            <Link style={{color:"white", textDecoration: 'none' }} to="/">
              <Home/> 
            </Link>
          </IconButton>
        
        </Toolbar>
      </AppBar>
    </Box>
  );
}
