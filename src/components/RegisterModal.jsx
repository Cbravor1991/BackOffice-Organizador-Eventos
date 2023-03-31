import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useState } from 'react';
import axios from '../api/axios';
import swal from 'sweetalert2';

const PWD_ERROR = "At least 8 characters long and contain at least one number, one uppercase letter, and one lowercase letter."
const USER_ERROR = "Username must be at least 3 characters long and contain only letters and numbers."
const PWD_MATCH_ERROR = "Passwords do not match."

const USER_REGEX = /^[A-z][A-z0-9-_@].{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users/';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {


    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [errorPwd, setErrorPwd] = useState(false);
    const [errorUser, setErrorUser] = useState(false);
    const [errorMatch, setErrorMatch] = useState(false);
    const handleClose = () => props.setOpen(false);

    const handleUserChange = (event) => {
        USER_REGEX.test(event.target.value) ? setErrorUser(false) : setErrorUser(true);
        setUser(event.target.value);
    }
    const handlePwdChange = (event) => {
        PWD_REGEX.test(pwd) ? setErrorPwd(false) : setErrorPwd(true);
        setPwd(event.target.value)
    }
    const handleMatchPwdChange = (event) => {
        event.target.value === pwd ? setErrorMatch(false) : setErrorMatch(true);
        setMatchPwd(event.target.value);
    }

    const handleRegister = () => {
        if (errorUser || errorPwd || errorMatch) {
            return;
        }
        axios.post(REGISTER_URL,
            JSON.stringify({ 'email':user, 'password':pwd }),
            {
                headers: { 'Content-Type': 'application/json' }
            }
        ).then(() => {
            props.setOpen(false);
            swal.fire({title: "Exito", text:"Te registraste exitosamente!", icon: "success"})
            
        }).catch((err) => {
            swal.fire({title: "Error", text:`Error registrandose: "${(err.response ? err.response.data.detail : err)}"`, icon: "error"})
        });
    }


    return (
        <Stack direction="column" >
        <Button onClick={props.handleOpen}>Open modal</Button>
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack direction="column" spacing={2} sx={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <TextField error={errorUser}  required id="outlined-basic" label="Usuario" variant="outlined" onChange={handleUserChange} helperText={errorUser ? USER_ERROR : ''}/>
                    <TextField error={errorPwd} required id="outlined-basic" label="Contraseña" variant="outlined" type="password" onChange={handlePwdChange} helperText={errorPwd ? PWD_ERROR : ''}/>
                    <TextField error={errorMatch} required id="outlined-basic" label="Confirmar Contraseña" variant="outlined"  type="password" onChange={handleMatchPwdChange} helperText={errorMatch ? PWD_MATCH_ERROR : ''}/>
                <Button variant="contained" onClick={handleRegister}>Registrarse</Button>
                </Stack>
            </Box>
        </Modal>
        </Stack>
    );
}



