import React, { useState } from 'react';
import { googleLogout, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import axios from '../api/axios';

export default function LoginButton() {
    const handleLoginError = (error) => {
        localStorage.clear();
        window.location.href = "/home";
        console.log(error);
    };

    const handleLoginSuccess = (response) => {
        localStorage.setItem('user', jwtDecode(response.credential));
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
                    <p>{localStorage.getItem('user').name}</p>
                    <span style={{width: '20px'}}></span>
                    <button className="header__btn" onClick={logOut}>Sign out</button>
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
