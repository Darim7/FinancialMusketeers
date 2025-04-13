// Login.js
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import dollarImage from '../assets/dollar.png';
import googlelogo from '../assets/googlelogo.png';
import './LoginPage.css';
import axios from 'axios';
import {initializeApp} from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, browserLocalPersistence, setPersistence} from 'firebase/auth';

  

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAPaSB_lPbKi6sr4yN0O6Hk8TqtKpDDDiM",
    authDomain: "financial-planner-13b9f.firebaseapp.com",
    projectId: "financial-planner-13b9f",
    storageBucket: "financial-planner-13b9f.firebasestorage.app",
    messagingSenderId: "150332107675",
    appId: "1:150332107675:web:b889264c004568d1514f3e"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);


  auth.languageCode = 'en'

  setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Authentication persistence configured');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error.message);
  });
  

  const provider = new GoogleAuthProvider();

  function LoginPage() {

    const navigate = useNavigate();

    const googleSignIn = () => {
      signInWithPopup(auth, provider)
      .then((result) => {

        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        // const token = credential.accessToken;
        // Once user log in, a token will be created
        const token = credential ? credential.accessToken : null;

        // The signed-in user info.
        const user = result.user;

        // localStorage.setItem('userEmail', JSON.stringify(user.email));
        localStorage.setItem('userEmail', user.email ?? '');
        localStorage.setItem('userName', user.displayName ?? '');


       

        
        navigate('./overview')
     
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      
        });
      }
      // Listen for authentication state changes
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log('User is logged in:', user.email);
            navigate('/overview'); // Redirect if user is authenticated
          } else {
            console.log('No user is logged in');
          }
        });
      
        return () => unsubscribe(); // Cleanup subscription on unmount
      }, [auth, navigate]);
    return (
      <div className='login-form'>

        {/* Logo + Website Name */}
        <div className = 'login-logo'>
          <img src={dollarImage} alt="Dollar" className='dollar' />
          <h3 className ="title">Financial Planner</h3>
        </div>

        <div className = 'google-login'>
          <img src={googlelogo} alt="Google" className='google-logo' />
          <h3 className='signin' onClick={() => {googleSignIn()}}>
              Sign in with Google
          </h3>

        </div>

        <div className = 'separate'>
          <p>Or</p>
        </div>
        
        <div className = 'guest-mode'>
          <h3 className = "guest" onClick={()=>navigate('/overview')}>
            Continue as Guest
          </h3>

        </div>

      </div>
    )
  }

export default LoginPage;