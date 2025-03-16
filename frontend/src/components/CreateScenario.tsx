// Create Scenario Page
import React from 'react';
import { useState } from 'react';
import './CreateScenario.css';
import Scenario from '../pages/Scenarios';

function CreateScenario() {
  {/* Allow user to pick a state */}
  const [selectedState, setSelectedState] = useState('');

  {/* Go to the next page */}
  const [info, setInfo] = useState(1); 
  const [investment, setInvestment] = useState(''); 
  const [events, setEvents] = useState('');

  {/* Update user input change */}
  const [values, setValues] = useState({
    scenarioName : '',
    retirementAge : '',
    financialGoal: '',
    lifeExpectancy: '',
    maritalStatus: '',
    birthYear: '' 

  })

  const handleChanges = (e) =>{
    setValues({...values, [e.target.name]:[e.target.value]})
  }

  

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form from submitting
    setInfo(info + 1);
  };

  const states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District Of Columbia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
    
  ]

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedState(event.target.value);
    };
  return (
    <div className="create-scenario"> 
      <h1>Scenario</h1>
      
      <form>

      {info === 1 && (
      <div className="label-container">
        
        <label htmlFor="scenario-name"> Name:</label>
            <input 
              type= "text"
              name ="scenarioName"
              value={values.scenarioName}
              onChange={(e)=> handleChanges(e)}
            />
        
        <label htmlFor="state-of-residence"> State of Residence:</label>
        <select
            id="states"
            name="states"
            value={selectedState}
            onChange={handleStateChange}
        >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
       
        <label htmlFor="retirement-age"> Retirement Age:</label>
          <input 
            type = "number" 
            min = "0"
            name = "retirementAge"
            value={values.retirementAge}
            onChange={(e)=> handleChanges(e)}
          />
        
        <label htmlFor="financial-goal"> Financial Goal:</label>
          <input 
            type = "number" 
            min = "0"
            name = "financialGoal"
            value={values.financialGoal}
            onChange={(e)=> handleChanges(e)}
          />
        
        <label htmlFor="life-expectancy"> Life Expectancy:</label>
          <input 
            type = "text" 
            pattern = "^(\d+)(, ?\d+)?$" 
            name = "lifeExpectancy"
            value={values.lifeExpectancy}
            onChange={(e)=> handleChanges(e)}
          />

        <label htmlFor="marital-status"> Marital Status:</label>
          <input type="radio" name = "maritalStatus" 
          onChange={(e)=> handleChanges(e)}
          value={values.maritalStatus}
          />Couple
          <input type ="radio" name = "maritalStatus"
          onChange={(e)=> handleChanges(e)}
          value={values.maritalStatus}
          />Individual
         

        <label htmlFor="birth-year"> Birth Year:</label>
          <input
            type = "text" 
            pattern = "^(\d{4})(,\s?\d{4})*$" 
            name = "birthYear"
            onChange={(e)=> handleChanges(e)}
            value={values.birthYear}
          />
        
          <button onClick={handleNext}>Next</button>
      </div>

      )}

      {info === 2 && (
        <div className='container'>
          <h3>Investment</h3>
          


          <button onClick={handleNext}>Next</button>


        </div>





      )}




      </form>

    
    
    </div>

  

  );
}

export default CreateScenario;  