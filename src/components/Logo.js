import React from 'react';
import logo from "../images//sign-gedc253aab_1280.png";

export class Logo extends React.Component {

  render(){

    return (
     <div>
       <h1 style={{ color:'white', fontSize: 20 }}>#Hospedate</h1>
       <h1 style={{ color:'white', fontSize: 20 }}>Ahora</h1>
       <img style={{height: 100, width: 100, alignSelf:'center' }} src={logo} alt="Logo" />
       <br />
     </div>
    );

  }
}

export default Logo
