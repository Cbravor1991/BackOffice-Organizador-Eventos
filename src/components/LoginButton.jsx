import React, { useState } from 'react';
import { googleLogout, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

export default function LoginButton() {
    const [ user, setUser ] = useState();

    const handleLoginError = (error) => {
        console.log(error);
        window.location.href = "/";
    };

    const handleLoginSuccess = (response) => {
        setUser(jwtDecode(response.credential));
        window.location.href = "/eventList";
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
