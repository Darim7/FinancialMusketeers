// Create Scenario Page
import React from 'react';
import { useState } from 'react';
import './CreateScenario.css';
import Scenario from '../pages/Scenarios';

function CreateScenario() {

  // {/* Allow user to pick a state */}
  // const [selectedState, setSelectedState] = useState('');

  {/* Go to the next page */}
  const [formStep, setformStep] = useState(1);

  {/* Update user input change */}
  const [values, setValues] = useState({
    scenarioName : '',
    states: '',
    retirementAge : '',
    financialGoal: '',
    lifeExpectancy: '',
    maritalStatus: '',
    birthYear: '' ,
    investments: [] as any[],
    events: [] as any[]
  })

  const [investment, setInvestment] = useState({
    investmentName: '',
    description: '',
    returnAmtOrPct: '',
    returnDistribution: '',
    expenseRatio: '',
    incomeAmtOrPct: '',
    incomeDistribution: '',
    taxability: ''
  })

  // There are 4 different types of event
  const [incomeEvents, setIncomeEvents] = useState({
    initialAmount: '',
    changeAmtOrPct: '',
    changeDistribution: '',
    inflationAdjusted: '',
    userFraction: '',
    socialSecurity: ''
  })

  const [expenseEvents, setExpenseEvents] = useState({
    initialAmount: '',
    changeAmtOrPct: '',
    changeDistribution: '',
    inflationAdjusted: '',
    userFraction: '',
    discretionary: ''

  })

  const [investEvents, setInvestEvents] = useState({
    assetAllocation: '',
    glidePath: '',
    assetAllocation2: '',
    maxCash: ''

  })

  const [rebalanceEvents, setRebalanceEvents] = useState({
    assetAllocation: ''

  })


  console.log(values);

  {/* Handle user input change */}
  {/* Store in array because of multiple input */}
  const handleChanges = (e) =>{
    setValues({...values, [e.target.name]:[e.target.value]})
  }

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form from submitting
    setformStep(formStep + 1);
  };

  const handleInvestmentChange = (e) => {
    setInvestment({...investment, [e.target.name]:e.target.value});
  };

  const addInvestment = (e) => {
    setValues({...values, investments: [...values.investments, investment]})

    setInvestment({
      investmentName: '',
      description: '',
      returnAmtOrPct: '',
      returnDistribution: '',
      expenseRatio: '',
      incomeAmtOrPct: '',
      incomeDistribution: '',
      taxability: ''
    })
  }




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

  return (
    <div className="create-scenario"> 
      <h1>Scenario</h1>
      
      <form>

      {formStep === 1 && (
      <div className="label-container">
        
        <label htmlFor="scenario-name"> Scenario Name:</label> 
            <input // Type of data
              type= "text"  // Input text format
              name ="scenarioName"  // Name of the input
              value={values.scenarioName}
              onChange={(e)=> handleChanges(e)}
            />
        
        <label htmlFor="state-of-residence"> State of Residence:</label>
        <select
            id="states"
            name="states"
            value={values.states}
            onChange={handleChanges}
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
        
        {/* TODO: Life Expectancy is optional, if user no input, default is 80 */}
        <label htmlFor="life-expectancy"> Life Expectancy:</label>
          <input 
            type = "text" 
            pattern = "^(\d+)(, ?\d+)?$" 
            name = "lifeExpectancy"
            value={values.lifeExpectancy}
            onChange={(e)=> handleChanges(e)}
          />

        <label htmlFor="marital-status"> Marital Status:</label>
          <input
            type="radio"
            id = "Individual"
            name = "maritalStatus" 
            value ="Individual"
            onChange={(e)=> handleChanges(e)}/> Individual

          <input 
            type ="radio"
            id = "Couple"
            name = "maritalStatus" 
            value = "Couple"
            onChange={(e)=> handleChanges(e)} /> Couple
         
        {/* TODO: Only allow 2 year input if married */}
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

      {formStep === 2 && (
        <div className='investment-container'>
          <h3>Investments</h3>

          <label htmlFor = "investment-name">Investment Name: </label>
            <input
              type = "text"
              name = "investmentName"
              value={investment.investmentName}
              onChange={handleInvestmentChange}
            />

          <label htmlFor = "description"> Description: </label>
            <input
              type = "text"
              name = "description"    
              value={investment.description}
              onChange={handleInvestmentChange}
            />

          {/*TODO: 1)Fix Amount, 2)User input, 3)A percentage sampled
            from a Markov Process
          */}
          <label htmlFor = "return-amount"> Return Amount or Percent: </label>
            <input
              type = "text"
              name = "returnAmtOrPct"     
              value={investment.returnAmtOrPct}
              onChange={handleInvestmentChange}
            />
          
          {/*TODO: 1)Fix Amount, 2)User input, 3)A percentage sampled
            from a Markov Process
          */}
          <label htmlFor = "return-distribution"> Return Distribution: </label>
            <input
              type = "text"
              name = "returnDistribution"    
              value={investment.returnDistribution}
              onChange={handleInvestmentChange}
            />

          <label htmlFor = "expense-ratio"> Expense Ratio: </label>
            <input
              type = "number"
              name = "expenseRatio" 
              value={investment.expenseRatio}
              onChange={handleInvestmentChange}
            />

          <label htmlFor = "income-amount"> Income Amount or Percent: </label>
            <input
              type = "text"
              name = "incomeAmtOrPct" 
              value={investment.incomeAmtOrPct}
              onChange={handleInvestmentChange}
            />
          
          <label htmlFor = "income-distribution"> Income Distribution: </label>
            <input
              type = "text"
              name = "incomeDistribution"  
              value={investment.incomeDistribution}
              onChange={handleInvestmentChange}
            />

          <label htmlFor = "taxability"> Taxability: </label>
            <input
              type = "radio"
              id = "Taxable"
              value = "Taxable"
              name = "taxability"
              checked={investment.taxability === "Taxable"}
              onChange={handleInvestmentChange}
            /> Taxable
            <input 
              type ="radio"
              id = "Tax-Exempt"
              name=  "taxability"     
              value = "Tax-Exempt"
              checked={investment.taxability === "Tax-Exempt"}
              onChange={handleInvestmentChange}
            /> Tax-Exempt
          
          
          <button type='button' onClick={addInvestment}>Add Investment</button>
 
          <button type="button" onClick={() => setformStep(1)}>
            Back
          </button>

          <button onClick={handleNext}>Next</button>

        </div>
      )}
      {formStep === 3 && (
        <div className='event-page'>
           <h3>Events</h3>
           <label htmlFor = "eventName"> Event Name: </label>
            <input
              type = "text"
              name = "eventName"           
            />

          <label htmlFor = "startsWith"> Start Date: </label>
            <input
              type = "text"
              name = "startsWith"           
            />




        </div>



      )}




      </form>

    
    
    </div>

  

  );
}

export default CreateScenario;  