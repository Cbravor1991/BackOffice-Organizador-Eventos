import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Logo from '../components/Logo';

import EventForm from '../components/EventForm';
import Image from '../images/readingSideDoodleLogin.png';
import Stack from '@mui/material/Stack';
import { Button, Divider, Typography, TextField } from '@mui/material';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';





const LOGIN_URL = '/user/login';

const LoadEventPage = () => {
    

   
    return (

            <EventForm />
            
     

    )
}

export default LoadEventPage
