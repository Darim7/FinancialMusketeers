import NavBar from '../components/NavBar';
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './ProfilePage.css';
import LoginPage from '../pages/LoginPage';


function ProfilePage() {

    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    

    return (
        <div id='profile'>
            <NavBar/>
            {userEmail && userName ? (
            <div id='user-details'>
                <div id='profile-heading'> 
                    <h3> User Details</h3> 
                </div>
                <div id='name'>
                    <label>Name</label>
                    <input type='text' name='name' value={userName || ''} />
                </div>
            
                <div id='user-email'>
                    <label>Email</label>
                    <input type='text' name='email' value={userEmail || ''}></input>
                </div>
            </div>
            ) : (
                <LoginPage />
            )}
        </div>
    )
}
export default ProfilePage;  
