import axios from 'axios';

export default axios.create({
    //baseURL: 'https://backend-hospedate-ahora.herokuapp.com/'
    baseURL: 'http://localhost:5000/'
});
