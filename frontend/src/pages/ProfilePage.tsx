import NavBar from '../components/NavBar';
import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './ProfilePage.css'

function ProfilePage() {
    
    const [user, setUser] = useState({
        first_name : '',
        last_name : ''
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser(prevState => ({
            ...prevState, [name] :value
        }));
    };

    const saveUserData = () => {

    }

    const editUserData = () => {

    }
    
    return (
        <div className='profile'>
            <NavBar/>
            <div id='user-details'>
                <div id='profile-heading'> 
                    <h3> User Details</h3> 
                </div>
                <div id='first-name'>
                    <label>First Name</label>
                    <input type='text' name='first_name' placeholder='Enter your first name' value={user.first_name} onChange={handleInputChange} />
                </div>
                <div id='last-name'>
                    <label>Last Name</label>
                    <input type='text' name='last_name' placeholder='Enter your last name' value={user.last_name} onChange={handleInputChange} />
                </div>
                <div id='user-email'>
                    <label>Email</label>
                    <input type='text' placeholder='User email'></input>
                </div>
                <div className='buttons'>
                    <button id='save-button' onClick={saveUserData}>Save</button>
                    <button id='edit-button' onClick={editUserData}>Edit</button>
                </div>
            </div>
        </div>
    )
}
export default ProfilePage;  
