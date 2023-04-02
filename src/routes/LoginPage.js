import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Logo from '../components/Logo';

import RegisterModal from '../components/RegisterModal';
import Image from '../images/readingSideDoodleLogin.png';
import Stack from '@mui/material/Stack';
import { Button, Divider, Typography, TextField } from '@mui/material';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
          main: '#dc9c13',
        },
        secondary:{
            main: '#e9bc65',
        } 
      },
});



const LOGIN_URL = '/user/login';

const LoginPage = () => {
    const { setAuth } = useAuth();
    const [error, setError] = useState(false);

    const handleOpen = () => setOpen(true);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ 'email': user, 'password': pwd }),
                {
                    headers: { 'Content-Type': 'application/json', 
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': 'Authorization'},
                }
            );
            console.log(JSON.stringify(response));
            //const accessToken = response?.data?.accessToken;
            //const roles = response?.data?.roles;
            //setAuth({ user, pwd, roles, accessToken });

            window.localStorage.setItem("username", user)
            //navigate(from, { replace: true });
            window.location.href = from;
        } catch (err) {
            setError(true)
            if (!err?.response) {
                setErrMsg('El servidor no responde');
            } else if (err.response?.status === 401) {
                setErrMsg('Contraseña o usuario incorrecto');
            } else if (err.response?.status === 402) {
                setErrMsg('No tiene autorización');
            } else {
                setErrMsg('El ingreso ha fallado');
            }
            errRef.current.focus();
        }
    }

    return (

        <ThemeProvider theme={theme}>
            <RegisterModal setOpen={setOpen} handleOpen={handleOpen} open={open}/>
            <Stack direction="row" spacing={15} sx={{flex: '1', alignItems:'center', justifyContent: 'center', mt: 3}}> 
                <Stack direction="column" spacing={5} sx={{flex:1, alignItems:'center', maxWidth: '50%'}}>
                    <Typography color="#dc9c13" variant="h3" >
                        Hospedate Ahora
                    </Typography>
                    <img src={Image} height='90%' width='90%'/>
                    <Typography color="#dc9c13" variant="subtitle1"> 
                        Tus próximas vacaciones al alcance de un click
                    </Typography>
                </Stack>    
                <Stack direction="column" spacing={3}> 
                    <TextField error={error} label="Usuario o Email" variant="outlined" onChange={(e) => setUser(e.target.value)} />    
                    <TextField error={error} type="password" label="Contraseña" variant="outlined" onChange={(e) => setPwd(e.target.value)} helperText={error ? "Contraseña o usuario incorrecto" : ""}/>

                        <Button variant="contained" sx={{color: '#fff'}} onClick={handleSubmit}>
                            Iniciar Sesión  
                        </Button>

                    <Typography color="blue" variant='h8'>
                        ¿Olvidaste tu contraseña?
                    </Typography>
                    <Divider />

                    <Button variant="contained" sx={{color: '#000', fontWeight: 'bold'}} onClick={handleOpen}>
                        Crear cuenta nueva
                    </Button>
                </Stack>
            </Stack>
        </ThemeProvider>

    )
}

export default LoginPage
