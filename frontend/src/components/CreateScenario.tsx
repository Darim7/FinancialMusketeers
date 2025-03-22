// Create Scenario Page
import React, { ReactComponentElement } from 'react';
import {useState, useEffect } from 'react';
// import './CreateScenario.css';
import Scenario from '../pages/Scenarios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';



function CreateScenario({formInfo, saveForms}) {

  // const [currData, setCurrData] = useState(formInfo);
  // console.log('test:', formInfo); 


  // {/* Allow user to pick a state */}
  // const [selectedState, setSelectedState] = useState('');

  {/* Go to the next page */}
  const [formStep, setformStep] = useState(1);


  /*********** Define types for Investment and Events *********/ 
  // type Investment = {
  //   id: number;
  //   investmentName: string;
  //   description: string;
  //   returnAmtOrPct: string;
  //   returnDistribution: string;
  //   expenseRatio: string;
  //   incomeAmtOrPct: string;
  //   incomeDistribution: string;
  //   taxability: string;
  // }

  // type Event = {

  // }

  /*************************************************************/

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

  useEffect(() => {
    console.log('formData:', formInfo);
    setValues({
      scenarioName: formInfo.scenarioName || '',
      states: formInfo.details || '',
      retirementAge: formInfo.retirementAge || '',
      financialGoal: formInfo.financialGoal || '',
      lifeExpectancy: formInfo.lifeExpectancy || '',
      maritalStatus: formInfo.maritalStatus || '',
      birthYear: formInfo.birthYear || '',
      investments: formInfo.investments || [],
      events: formInfo.events || []
    });
}, [formInfo]);

  {/*Show current investment modal*/}
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




  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [investmentSaved, setInvestmentSaved] = useState(false);


  // There are 4 different types of event
  const diffEvent = {
    Income: [
      { question: "Event Names: ", type: "text" },
      { question: "Start: ", type: "text" },
      { question: "Duration: ", type: "number" },
      { question: "Initial Amount: ", type: "number"},
      { question: "Change Amount or Percent: ", type: "text"},
      { question: "Change Distribution: ", type: "text"},
      { question: "Inflation Adjusted: ", type: "text"},
      { question: "User Fraction: ", type: "text"},
      { question: "Social Security: ", type: "number"},
    ],

    Expense: [
      { question: "Event Names: ", type: "text" },
      { question: "Start: ", type: "text" },
      { question: "Duration: ", type: "number" },
      { question: "Initial Amount: ", type: "number"},
      { question: "Change Amount or Percent: ", type: "text"},
      { question: "Change Distribution: ", type: "text"},
      { question: "Inflation Adjusted: ", type: "text"},
      { question: "User Fraction: ", type: "text"},
      { question: "Discretionary : ", type: "text"},

    ],
    Invest: [
      { question: "Event Names: ", type: "text" },
      { question: "Start: ", type: "text" },
      { question: "Duration: ", type: "number" },
      { question: "Asset Allocation: ", type: "text" },
      { question: "Glide Path : ", type: "text" },
    ],

    Rebalance: [
      { question: "Event Names: ", type: "text" },
      { question: "Start: ", type: "text" },
      { question: "Duration: ", type: "number" },
      { question: "Asset Allocation: ", type: "text" },
    ],
  };

  const [selectedEvent, setSelectedEvent] = useState("");
  const [answers, setAnswers] = useState({}); 
  const [currentEventIndex ,setCurrentEventIndex] = useState(-1);

  const handleEventChange = (e:React.ChangeEvent<any>) => {
    const eventType = e.target.value;
    setSelectedEvent(eventType);
    setAnswers({});
  };

  const handleAnswerChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    console.log(answers)
  };

  // console.log("test Here", values);

 
   const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {

    // All the declared variable and its values
    const { name, value } = e.target;
  
    setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
    }));
      
    //Loop through the form 
    saveForms((prevForms) =>
      prevForms.map((form) =>
      // Finds the form by ID and set the name == Scenario Name so user can see
      form.id === formInfo.id ? { ...form, [name]: value, name: name === 'scenarioName' ? value : form.name } : form

      )
      );
    };

  
  /******************* Handles Pagination ****************************************/
  const handleNext = (e:React.ChangeEvent<any>) => {
    e.preventDefault(); // Prevent form from submitting
    setformStep(formStep + 1);
  };

  const handleBack = (e:React.ChangeEvent<any>) => {
    e.preventDefault();
    setformStep(formStep - 1);
  }
  /******************* Handles Pagination ****************************************/
  

  /******************** Investment Functions *************************************/

  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [currentInvestmentIndex, setCurrentInvestmentIndex] = useState(-1);

  const newInvestmentModal = () => {
    setShowInvestmentModal(true);
    setCurrentInvestmentIndex(-1);
  }

  const editInvestmentModal = (investment, index) => {
    setInvestment({...investment});
    setCurrentInvestmentIndex(index);
    setShowInvestmentModal(true);
  }

  const closeInvestmentModal = () => {
    setShowInvestmentModal(false);
  }

  const saveInvestment = (e) => {

      let updatedInvestments;
      // Update if editing
      if (currentInvestmentIndex >= 0) {
        updatedInvestments = [...values.investments];
        updatedInvestments[currentInvestmentIndex] = investment;
      } else { /* then it is new */
        updatedInvestments = [...values.investments, investment];
      }

    // Update the local state with the new investments array
    setValues(prevValues => ({
      ...prevValues,
      investments: updatedInvestments
    }));
    saveForms(prevForms => 
      prevForms.map(form => 
        form.id === formInfo.id?{...form,investments: updatedInvestments}:form
      )
      
    
    );

    // Reset the investment form fields
    setInvestment({
      investmentName: '',
      description: '',
      returnAmtOrPct: '',
      returnDistribution: '',
      expenseRatio: '',
      incomeAmtOrPct: '',
      incomeDistribution: '',
      taxability: ''
    });

    setCurrentInvestmentIndex(-1);
    // Close the modal
    closeInvestmentModal();
  }
  

  const handleInvestmentChange = (e:React.ChangeEvent<any>) => {


    
    setInvestment({...investment, [e.target.name]:e.target.value});

  };

  const addInvestment = (e:React.ChangeEvent<any>) => {
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
  /******************** Investment Functions *************************************/

  /******************** Event Functions *************************************/
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const newEventCard = (e:React.ChangeEvent<any>) => {
      setCurrentEventIndex(-1);
      setShowEventModal(true);
  }
  
  const editEventModal = (event, index) => {
    setSelectedEvent(event.eventType);
    setAnswers({...event});
    setCurrentEventIndex(index);
    setShowEventModal(true);
  }

  const addNewEvent = (e:React.ChangeEvent<any>) => {
    setIsEditingEvent(false);
    setShowEventModal(true);
  }

  const closeEventModal = () => {
    setShowEventModal(false);  
  }

  const saveEventModal = () => {
    const newEvent = {
      eventType: selectedEvent,
      eventName: answers["Event Names: "] || "Unnamed Event",
      // Add other properties based on the event type
      ...answers // Include all answers
    };

    let updatedEvents;

    if (currentEventIndex >= 0){
      //Editing an existing event
      updatedEvents = [...values.events];
      updatedEvents[currentEventIndex] = newEvent;      
    } else {
      updatedEvents = [...values.events, newEvent];
    }
    setValues(prevValues => ({
      ...prevValues,
      events: updatedEvents
    }));
    saveForms(prevForms => 
      prevForms.map(form => 
        form.id === formInfo.id 
          ? { 
              ...form, 
              events: updatedEvents
                // Pass the complete updated investments array
            } 
          : form
      )
    );

    setAnswers({});
    setSelectedEvent("");
    closeEventModal();
    // Reset the investment form fields
  }
  /******************** Event Functions *************************************/

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
              onChange={handleChanges}
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
      
 
      // </Modal>

      )}

      {formStep === 2 && (
        <div className='investment-container'>
          <h3>Investments</h3>
          <Button variant='primary' onClick={newInvestmentModal}>
            + Add New Investment
          </Button>
          
          {values.investments.length > 0 ? (
            <div className='investmentLists'>
                {values.investments.map((investment, index) => (
                  <Card key={index} className='investmentCards' onClick={() => editInvestmentModal(investment, index)}>
                    <Card.Body>
                      <Card.Title>{investment.investmentName}</Card.Title>
                      <Card.Text>{investment.description}</Card.Text>
                    </Card.Body>
                  </Card>  
                ))}
            </div>
          ) : (
            <p>No Events</p>
          )}
          <Button variant='light' onClick={handleBack}>Back</Button>
          <Button variant='light' onClick={handleNext}>Next</Button> 
        </div>
      )}


      {formStep === 3 && (
        <div className='events-container'>
          <h3>Events</h3>
          <Button variant='primary' onClick={addNewEvent}>
            + Add New Event
          </Button>
        {values.events.length > 0 ? (
          <div className='eventsList'>
              {values.events.map((event, index) => (
                <Card key={index} className='eventCards' onClick={() => editEventModal(event, index)}>
                  <Card.Body>
                    <Card.Title>{event.eventName}</Card.Title>
                  </Card.Body>
                </Card>  
              ))}
          </div>
        ) : (
          <p>No Events</p>
        )}
        <Button variant='light' onClick={handleBack}>Back</Button>
        <Button variant='light' onClick={handleNext}>Next</Button> 
      </div>
      //   <div className='event-page'>
      //      <h3>Events</h3>
          
      //     <label htmlFor="type-of-event"> Type of Event:</label>
          // <select
          //   id = "typeOfEvents"
          //   name = "typeOfEvents"
          //   onChange={handleEventChange} value={selectedEvent}>

          //   <option value="">-- Choose an Event --</option>
          //     {Object.keys(diffEvent).map((event) => (
          //      <option key={event} value={event}>{event.slice(0)}</option>
          //     ))}
          // </select>

      //     {selectedEvent && (
      //     <div>
      //       <h3>{selectedEvent} Questions</h3>
      //           {diffEvent[selectedEvent].map(({ question, type}, index) => (
                  
      //             <div key={index}>
      //             <label>{question}</label>
      //             {type === "text" || type === "number" ? (
      //               <input
      //                 type={type}
      //                 value={answers[question] || ""}
      //                 onChange={(e) => handleAnswerChange(question, e.target.value)}
      //               />
      //             ) : null}
      //       </div>
              
      //     ))}
          
 
      //   </div>
        
      // )}

      //     <button onClick={handleNext}>Next</button>

      //   </div>

      )}

      </form>
      
      {/* Investment Modal */}
      <Modal show={showInvestmentModal} onHide={closeInvestmentModal} centered>
        <Modal.Header closeButton> </Modal.Header>
        <Modal.Body>
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
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={closeInvestmentModal}>
            Cancel
          </Button>
      
          <Button variant='primary' onClick={saveInvestment}>
            Save
          </Button>

          
        </Modal.Footer>
      </Modal>
    
      {/* Events Modal */}
      <Modal show={showEventModal} onHide={closeEventModal} centered>
        <Modal.Header closeButton> </Modal.Header>
          <Modal.Body>
          <div className='event-page'>
           <h3>Events</h3>
          
          <label htmlFor="type-of-event"> Type of Event:</label>
          <select
            id = "typeOfEvents"
            name = "typeOfEvents"
            onChange={handleEventChange} value={selectedEvent}>

            <option value="">-- Choose an Event --</option>
              {Object.keys(diffEvent).map((event) => (
               <option key={event} value={event}>{event.slice(0)}</option>
              ))}
          </select>

          {selectedEvent && (
          <div>
            <h3>{selectedEvent} Questions</h3>
                {diffEvent[selectedEvent].map(({ question, type}, index) => (
                  <div key={index}>
                  <label>{question}</label>
                  {type === "text" || type === "number" ? (
                    <input
                      type={type}
                      value={answers[question] || ""}
                      onChange={(e) => handleAnswerChange(question, e.target.value)}
                    />
                  ) : null}
            </div>
              
          ))}
          
 
        </div>
        
      )}
        </div>
          </Modal.Body>
          <Modal.Footer>
          <Button variant='danger' onClick={closeEventModal}>
            Cancel
          </Button>
          <Button variant='primary' onClick={saveEventModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>


  );
}


export default CreateScenario;  