import React, { useState } from 'react';
import { googleLogout, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { Button } from '@mui/material';
import axios from '../api/axios';
import { styled } from '@mui/material/styles';

const LogoutButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#546e7a',
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: 10,
    '&:hover': {
        backgroundColor: '#37474f',
      },
    cursor: 'pointer',
    variant: 'contained',
  }));  

export default function LoginButton() {
    const handleLoginError = (error) => {
        localStorage.clear();
        window.location.href = "/home";
        console.log(error);
    };

    const handleLoginSuccess = (response) => {
        localStorage.setItem('user', jwtDecode(response.credential).name);
        console.log(jwtDecode(response.credential));
        
        const params = new URLSearchParams([['token', response.credential]]);
                             
        const headers = {'accept': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*'
                             }  
                            
        axios({method: 'get', url: '/organizer/login', params: params, headers: headers})
            .then((response) => {            
                window.localStorage.setItem("token", response.data.access_token);
                window.location.href = "/eventList";          
            })
       .catch((error) => handleLoginError(error));
    };

    const logOut = () => {
        googleLogout();
        localStorage.clear();
        window.location.href = "/home";
    };    

    return (
        <div>
            {localStorage.getItem('user') ? (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <p>{localStorage.getItem('user')}</p>
                    <span style={{width: '20px'}}></span>
                    <LogoutButton onClick={logOut}>Sign out</LogoutButton>
                </div>
            ) : (
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    useOneTap
                />
            )}
        </div>
    )
}
