import {useState, useEffect} from 'react';
import {Button, Row, Col, Toast} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { firebaseConfig, getTokenFirebase, onMessageListener,
         onForegroundMessage, getOrRegisterServiceWorker, getAccessToken } from '../firebase/config-notification';
import { ToastContainer, toast } from 'react-toastify';


export default function  Notification() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState(false);
  
  /*let token_user = window.localStorage.getItem("token");
  console.log(token_user);*/
  
  //const token = getTokenFirebase()
  const token = getAccessToken()
  .then(() => {
  console.log(token);
  setTokenFound(true);
  });
  
 
  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log('Received foreground message: ', payload);
        const { notification: { title, body } } = payload;
        return (<Toast title={title} body={body} />);
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));
  }, []);

  
  onMessageListener().then(payload => {
    setShow(true);
    setNotification({title: payload.notification.title, body: payload.notification.body})
    console.log(payload);
  }).catch(err => console.log('failed: ', err));


  const ToastifyNotification = ({ title, body }) => (
    <div className="push-notification">
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );

  
  return (
   <>
    <div className="Notification">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide animation style={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Notification</strong>
            <small>12 mins ago</small>
          </Toast.Header>
          <Toast.Body> Prueba para mostrar notificación </Toast.Body>
        </Toast>
      <header className="App-header">
         {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
         {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
        <Button onClick={() => setShow(true)}>Mostrar notificación</Button>
      </header>
    </div>
    <br/>
    <div className="app">

      <button
        className="btn-primary"
        onClick={() => toast(<ToastifyNotification title="New Message" body="Hi there!" />)}
      >
        Show toast notification
      </button>

      <ToastContainer hideProgressBar />
    </div>
  </>  
)}

