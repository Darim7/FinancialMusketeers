// Scenario 
import React from 'react';
import './Overview.css';
import './Scenario.css';
import CreateScenario from '../components/CreateScenario';
import NavBar from '../components/NavBar';
import { useNavigate} from 'react-router-dom';

function Scenario() {

    const navigate = useNavigate();
    const addScenarioClick = () => {
        navigate('/createscenario'); 
      }

  return (
    <div className='scenario'>
        <NavBar/>
        <div className='main-content'>

            <div className='scenario-header'>
                <h1>Scenario</h1>
            </div>

            <div className='scenario-content'>
                <button className='create-button' onClick={addScenarioClick}>+ Create</button>
            </div>

        </div>
    </div>
  );
}

export default Scenario;  
