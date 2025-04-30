import NavBar from '../components/NavBar';
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './ProfilePage.css'

function ProfilePage() {
    
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : {
            first_name : '',
            last_name : '',
            email : ''
        };
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(user));
    }, [user]);
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser(prevState => ({
            ...prevState, [name] :value
        }));
    };

    const saveUserData = () => {
        setIsEditing(false)
    }

    const editUserData = () => {
        setIsEditing(true)
    }
    
    return (
        <div id='profile'>
            <NavBar/>
            <div id='user-details'>
                <div id='profile-heading'> 
                    <h3> User Details</h3> 
                </div>
                <div id='first-name'>
                    <label>First Name</label>
                    <input type='text' name='first_name' placeholder='Enter your first name' value={user.first_name} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div id='last-name'>
                    <label>Last Name</label>
                    <input type='text' name='last_name' placeholder='Enter your last name' value={user.last_name} onChange={handleInputChange} disabled={!isEditing}/>
                </div>
                <div id='user-email'>
                    <label>Email</label>
                    <input type='text' name='email' placeholder='Enter User email' value={user.email || ''} onChange={handleInputChange} disabled={!isEditing}></input>
                </div>
                <div className='buttons'>
                    {isEditing ? (
                        <button id='save-button' onClick={saveUserData}>Save</button>          
                    ) : (
                        <button id='edit-button' onClick={editUserData}>Edit</button>
                    )}
                </div>
            </div>
        </div>
    )
}
export default ProfilePage;  
