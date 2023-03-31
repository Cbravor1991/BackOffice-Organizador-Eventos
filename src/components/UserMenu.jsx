import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import axios from '../api/axios';
import { Logout } from '@mui/icons-material';
import { Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";


export default function UserMenu({username}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const [imageUrl, setImageUrl] = React.useState(null);

  if (!imageUrl){
    const params = new URLSearchParams([['user_email', username]]);

    axios.get('/getProfile/',{ params: params })
    .then((response) => {
        setImageUrl(response.data.pic);
    })
    .catch((error) => {
      if (error.response.status === 400) { // si es true el user guardado en el localstore ya no existe en el back, por lo que se borra y se pide iniciar de vuelta
        cerrarSesion();
      }
    });
  }

  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem("username")
    window.location.href = "/";
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
      <div style={{zIndex: 30}}>
        <List>

        <ListItem disablePadding>
            <ListItemButton
            ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}>
            <ListItemIcon>
                <Avatar
                    alt={username.toLocaleUpperCase()}
                    src={ imageUrl  || ""}
                />          
            </ListItemIcon>
            {/* <ListItemText primary={username} /> */}
            </ListItemButton>
        </ListItem> 
        </List>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-end"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-end' ? 'left top' : 'left bottom',
              }}
            >
              <Paper >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={(e) => {navigate("profile"); handleClose(e)}}> Mi perfil</MenuItem>
                    <MenuItem onClick={(e) => {navigate("showLodgings"); handleClose(e)}}> Mis propiedades</MenuItem>
                    <MenuItem onClick={(e) => {navigate("showsMyPublications"); handleClose(e)}}> Mis Publicaciones</MenuItem>
                    <MenuItem onClick={(e) => {navigate("showsMyReservations"); handleClose(e)}}> Mis Reservas</MenuItem>

                    <MenuItem onClick={cerrarSesion}> <Logout style={{transform: "scaleX(-1)"}}/> Cerrar sesión</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
  );
}
