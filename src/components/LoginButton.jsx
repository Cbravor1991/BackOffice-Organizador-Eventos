import React, { useState } from 'react';
import { googleLogout, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import axios from '../api/axios';


export default function LoginButton() {
    const [ user, setUser ] = useState('');

    const handleLoginError = (error) => {
        console.log(error);
        window.location.href = "/";
    };

    const handleLoginSuccess = (response) => {
        setUser(jwtDecode(response.credential));
        
        const params = new URLSearchParams([['token', response.credential]]);
                             
        const headers = {'accept': 'application/json',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Credentials': true,
                               'Access-Control-Allow-Headers': '*'
                             }  
                            
        axios({method: 'get', url: '/organizer/login', params: params, headers: headers})
          .then((response) => {
          console.log(response.data);
          let data=JSON.parse(response.data);
          window.localStorage.setItem("token", response.data);
          })
       .catch((error) => {
       console.log(error);
      });
     
      window.location.href = "/eventList";
      console.log("token")
      console.log(JSON.stringify(response.access_token))
    };

    const logOut = () => {
        googleLogout();
        setUser(null);
    };    

    return (
        <div>
            {user ? (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <p>{user.name}</p>
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
