import React from 'react';
import dollarImage from '../assets/dollar.png';
import userprofile from '../assets/userprofile.png'
import './NavBar.css';
import {Link} from 'react-router-dom'

function NavBar(){
    return(
        <div className = "navbar">
            {/* Logo + Website Name */}
            <div className= 'logo-container'>
                <img src={dollarImage} alt="Dollar" className='dollar' />
                <h3 className="title">Financial Planner</h3>
            </div>

            {/* User Profile Logo */}
            <div className = 'user-profile-logo'>
                <Link to='/profile'>
                    <img src={userprofile} alt ="userlogo" className='profileLogo'/>
                </Link>
            </div>

            {/* Sidebar for navigation */}
            <div className='sidebar'>
                <ul className='items'>
                    <Link to = '/overview'><li>Overview</li></Link>
                    <Link to = '/scenarios'><li>Scenarios</li></Link>
                    <Link to = '/sharing'><li>Sharing</li></Link>
                </ul>
            </div>


        </div>
    )
}

export default NavBar;  