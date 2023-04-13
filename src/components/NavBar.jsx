import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        < Toolbar>
          <Typography variant="h6" component="div" sx={{ mr: 'auto' }}>
            TICKETAPP
          </Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2}}
           
          >
            <Avatar  />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Avatar />
              <Typography sx={{ ml: 2, color: 'black' }}>Nombre</Typography>
            </MenuItem>
            
            <Divider />
            <MenuItem>
              <PersonAdd fontSize="small" />
              <Typography sx={{ ml: 2 , color: 'black'}}>Add Another Account</Typography>
            </MenuItem>
            <MenuItem>
              <Settings fontSize="small" />
              <Typography sx={{ ml: 2, color:'black'}}>Settings</Typography>
            </MenuItem>
            <MenuItem>
              <Logout fontSize="small" />
              <Typography sx={{ ml: 2, color:'black'}}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
