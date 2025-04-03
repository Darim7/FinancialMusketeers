// Create Scenario Page
import React from 'react';
import {useState, useEffect } from 'react';
import './CreateScenario.css';
import Scenario from '../pages/Scenarios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Prev } from 'react-bootstrap/esm/PageItem';
import DistributionForm from './DistributionForm';
import Page1 from './page1';
import EventForm from './EventForm';

function CreateScenario({formInfo, saveForms}) {

  {/* Go to the next page */}
  const [formStep, setformStep] = useState(1);


  {/* Update user input change */}
  const [values, setValues] = useState({
    scenarioName : '',
    residenceState: '',
    retirementAge : '',
    financialGoal: '',
    lifeExpectancy: [] as any[],
    lifeExpectancyChoice: '',
    maritalStatus: '',
    birthYear: [] as any[],
    birthYear1: '',
    birthYear2: '',
    distributionForm1: '',
    distributionForm2: '',
    inflationAssumption: '',
    afterTaxContributionLimit: '',
    spendingStrategy: [] as any,
    expenseWithdrawalStrategy: [] as any [],
    RMDStrategy: [] as any [],
    RothConversionOpt: '',
    RothConversionOptInfo: [] as any [],
    RothConversionStart: '',
    RothConversionEnd: '',
    RothConversionStrategy: [] as any,
    investments: [] as any[],
    events: [] as any[],
    discretionary: [] as any []
  })

  console.log("what is the value", values);

  useEffect(() => {
    console.log('formData:', formInfo);
    setValues({
      scenarioName: formInfo.scenarioName || '',
      residenceState: formInfo.residenceState || '',
      retirementAge: formInfo.retirementAge || '',
      financialGoal: formInfo.financialGoal || '',
      lifeExpectancy: formInfo.lifeExpectancy || [],
      lifeExpectancyChoice: '',
      maritalStatus: formInfo.maritalStatus || '',
      birthYear: formInfo.birthYear || [],
      birthYear1: formInfo.birthYear1 || '',
      birthYear2: formInfo.birthYear2 || '',
      distributionForm1: formInfo.distributionForm1 || '',
      distributionForm2: formInfo.distributionForm2 || '',
      inflationAssumption: formInfo.inflationAssumption || '',
      afterTaxContributionLimit: formInfo.afterTaxContributionLimit || '',
      spendingStrategy: formInfo.spendingStrategy || [],
      expenseWithdrawalStrategy: formInfo.expenseWithdrawalStrategy || [],
      RMDStrategy: formInfo.RMDStrategy || [],
      RothConversionOpt: formInfo.RothConversionOpt || '',
      RothConversionOptInfo: formInfo.RothConversionOptInfo || [],
      RothConversionStart: formInfo.RothConversionStart || '',
      RothConversionEnd: formInfo.RothConversionEnd || '',
      RothConversionStrategy: formInfo.RothConversionStrategy || [],
      investments: formInfo.investments || [],
      events: formInfo.events || [],
      discretionary: formInfo.discretionary || []
    });
}, [formInfo]);

  {/*Show current investment modal*/}
  const [investment, setInvestment] = useState({
    investmentName: '',
    description: '',
    returnAmtOrPct: '',
    returnDistribution: {} as any,
    expenseRatio: '',
    incomeAmtOrPct: '',
    incomeDistribution: '',
    taxability: '',
    investmentCases: [] as any[]
  })

  // const [lifeExpectancyDistributions, setlifeExpectancyDistributions] = useState({
   
  //   fixed: {
  //     type: "",
  //     values: { value: 0, value2: 0}
  //   },
  //   normal: {
  //     type: "",
  //     values: {mean: 0, std: 0, mean2: 0, std2: 0}
  //   },
  //   uniform: {
  //     type: "",
  //     values: {lower: 0, upper: 0, lower2: 0, upper2: 0}
  //   }
  // })

  // console.log("Life Expectancy Distributions: ", lifeExpectancyDistributions);

  const handleLifeExpectancyChange = (e:React.ChangeEvent<any>, index: number) => {
    const { name, value } = e.target;
    
    const updatedLifeExpectancy = { ...lifeExpectancyDistributions };

    setlifeExpectancyDistributions((prevDistributions) => ({
      ...prevDistributions,
      [name]: {
        ...prevDistributions[name],
        values: {
          ...prevDistributions[name].values,
          [index]: value,
        },
      },
    }));
    console.log("Updated Life Expectancy: ", updatedLifeExpectancy);

  }



  const [show, setShow] = useState(false);


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
      { question: "Discretionary : ", type: "boolean"}, // This should be Boolean

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
    setAnswers((prev) => ({
       ...prev, 
       [question]: value }));
       
    console.log("Handle Answer Change: ", answers)



};

 
   const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    // All the declared variable and its values
    const { name, value } = e.target;

    const spouseYear = [values.birthYear1, values.birthYear2];

    
  
    setValues((prevValues) => ({
      
        ...prevValues,
        
        [name]: value,
        birthYear: spouseYear,
       
    }));

    //Loop through the form 
    saveForms((prevForms) =>
      prevForms.map((form) =>
      // Asked Copilot how to reflected the name when the form is saved so users can click on the scenario they created.
      // Finds the form by ID and set the name == Scenario Name so user can see
      // form.id === formInfo.id ? { ...form, [name]: value, name: name === 'scenarioName' ? value : form.name } : form
      form.id === formInfo.id ? { ...form, [name]: value, name: name === 'scenarioName' ? value : form.name } : form

      )
      );

      



    
   };


  /******************* Handles Pagination ****************************************/
  const handleNext = (e:React.ChangeEvent<any>) => {
    e.preventDefault(); // Prevent form from submitting

    if (formStep === 1){
      handleAddDistribution(e, 'lifeExpectancy', 0,'values');
      
      if (values.maritalStatus === 'couple') {
        handleAddDistribution(e, 'lifeExpectancy', 1, 'values');
      }
    }
    setformStep(formStep + 1);
  };

  const handleBack = (e:React.ChangeEvent<any>) => {
    e.preventDefault();
    setformStep(formStep - 1);
  }
  /******************* Handles Pagination ****************************************/
  

  /******************** Investment Types *************************************/

  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [currentInvestmentIndex, setCurrentInvestmentIndex] = useState(-1);

  /******************** Investment Types *************************************/




  {/* ----- This is for investment case after declaring the investment type -----*/}

    const addInvestmentCase = () => {
      setInvestment((prevInvestment) => ({
        ...prevInvestment,
        investmentCases: [
          ...prevInvestment.investmentCases,
          { id: Date.now(), value: '' },
        ],
      }));
    };
  
    const handleInvestmentCaseChange = (index, e) => {
      const { name, value } = e.target;

      const updatedInvestmentCases = investment.investmentCases.map((investmentCase, i) =>
        i === index ? { ...investmentCase, [name]: value } : investmentCase
      );

      setInvestment((prevInvestment) => ({
        ...prevInvestment,
        investmentCases: updatedInvestmentCases,
      }));

    
     
    };

  {/* ------ This is for investments case after declaring the investment type -----*/}


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
      let updatedExpenseWithdrawalStrategy;
      let updateRMD;
      let updateRothConversionStrategy;

      // Update if editing
      const investmentToSave = {
        ...investment,
        returnDistribution: distributions[0], // Capture the full distribution object
        incomeDistribution: distributions[1] // Capture the full distribution object
      };
      console.log("HELOOOOOOOOOOOOOOOOOOOO",investmentToSave);

      if (currentInvestmentIndex >= 0) {
        updatedInvestments = [...values.investments];
        updatedInvestments[currentInvestmentIndex] = investmentToSave;

  
        updatedExpenseWithdrawalStrategy = [...values.expenseWithdrawalStrategy];
        updatedExpenseWithdrawalStrategy[currentInvestmentIndex] = investmentToSave;

        if (investment.investmentCases.some(investmentCase => investmentCase.taxStatus === "pre-tax")){
        // If the tax-status is "pre-tax" then added to the array 
            updateRMD = [...values.RMDStrategy];
            updateRMD[currentInvestmentIndex] = investment;

            updateRothConversionStrategy = [...values.RothConversionStrategy];
            updateRothConversionStrategy[currentInvestmentIndex] = investment;
            
        } 
        // Keep the same 
        else {
          updateRMD = [...values.RMDStrategy];
          updateRothConversionStrategy = [...values.RothConversionStrategy]
        }

      } else { /* then it is new */
        updatedInvestments = [...values.investments, investment];
        updatedExpenseWithdrawalStrategy = [...values.expenseWithdrawalStrategy, investment];

        
        if (investment.investmentCases.some(investmentCase => investmentCase.taxStatus === "pre-tax")){
                updateRMD = [...values.RMDStrategy, investment];
                updateRothConversionStrategy = [...values.RothConversionStrategy, investment];       
          }
          else {
            updateRMD = [...values.RMDStrategy];

            updateRothConversionStrategy = [...values.RothConversionStrategy];
          }
      }

    

    // Update the local state with the new investments array
    setValues(prevValues => ({
      ...prevValues,
      investments: updatedInvestments,
      expenseWithdrawalStrategy: updatedExpenseWithdrawalStrategy,
      RMDStrategy : updateRMD,
      RothConversionStrategy: updateRothConversionStrategy,
   

    }));
    saveForms(prevForms => 
      prevForms.map(form => 
        form.id === formInfo.id?{
          ...form,
          investments: updatedInvestments,
          expenseWithdrawalStrategy: updatedExpenseWithdrawalStrategy,
          RMDStrategy: updateRMD,
          RothConversionStrategy: updateRothConversionStrategy

        }:form
      )
      
    
    );
    console.log('RETURN DISTRIBUTION', values.investments);
    //Reset the investment form fields
    setInvestment({
      investmentName: '',
      description: '',
      returnAmtOrPct: '',
      returnDistribution: {},
      expenseRatio: '',
      incomeAmtOrPct: '',
      incomeDistribution: '',
      taxability: '',
      investmentCases: [],
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
      returnDistribution: {},
      expenseRatio: '',
      incomeAmtOrPct: '',
      incomeDistribution: '',
      taxability: '',
      investmentCases: [] as any [],
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
    let updatedDiscretionary;


    if (currentEventIndex >= 0){
      //Editing an existing event
      updatedEvents = [...values.events];
      updatedEvents[currentEventIndex] = newEvent;  
    
     if(newEvent.eventType === "Expense" && newEvent["Discretionary : "] === "true"){
        updatedDiscretionary = [...values.discretionary];
        updatedDiscretionary[currentEventIndex] = newEvent;

     }
     else{
      updatedDiscretionary = values.discretionary;
      updatedDiscretionary = values.discretionary.filter(event => event["Discretionary : "] === "true");


     }
      

    } else {
      updatedEvents = [...values.events, newEvent];

      if (newEvent.eventType === "Expense" && newEvent["Discretionary : "] === "true") {
        updatedDiscretionary = [...values.discretionary, newEvent];
      } else {
        updatedDiscretionary = values.discretionary;
        updatedDiscretionary = values.discretionary.filter(event => event["Discretionary : "] === "true");

      }
      

    }
    setValues(prevValues => ({
      ...prevValues,
      events: updatedEvents,
      discretionary: updatedDiscretionary
    }));


    saveForms(prevForms => 
      prevForms.map(form => 
        form.id === formInfo.id 
          ? { 
              ...form, 
              events: updatedEvents,
              discretionary: updatedDiscretionary
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

  /******************** Distribution Form ***********************************/
  const [distributions, setDistributions] = useState([
    { type: "", values: { value: 0, mean: 0, std: 0, lower: 0, upper: 0 } }, // First distribution
    { type: "", values: { value: 0, mean: 0, std: 0, lower: 0, upper: 0 } }, // Second distribution
    { type: "", values: { value: 0, mean: 0, std: 0, lower: 0, upper: 0 } }, // Third distribution
  ]);

  interface DistributionValues {
    value: number;
    mean: number;
    std: number; 
    lower: number;
    upper: number;
  }
  
  const [distributionValues, setDistributionValues] = useState<DistributionValues>({});



  const handleDistributionChange = (e, index) => {
    const { name, value } = e.target;
    console.log(name, value);
 

    setDistributions((prevDistributions) => {
      const updatedDistributions = [...prevDistributions];

      if (name === "distribution-form") {
        updatedDistributions[index] = {
          ...updatedDistributions[index],
          type: value, 
          values: {},  
        };  
      } 
    
      else {
        updatedDistributions[index] = {
          ...updatedDistributions[index],
          values: {
            ...updatedDistributions[index].values,
            [name]: value,
          },
        };
      }

      setValues((prevValues)=>{
        const updatedLifeExpectancy = [...prevValues.lifeExpectancy]
        updatedLifeExpectancy[index] = updatedDistributions[index]
        return{
          ...prevValues,
          lifeExpectancy: updatedLifeExpectancy
        }
      });

      saveForms((prevForms) =>
        prevForms.map((form) =>
            form.id === formInfo.id
                ? {
                      ...form,
                      lifeExpectancy: updatedDistributions,
                  }
                : form
        )
    );

      
      return updatedDistributions;
    })
    
  }

  const handleAddDistribution = (e: React.ChangeEvent<any>, dest: string, index: number, type: string) => {
      e.preventDefault(); // Prevent default form behavior
      
      // console.log("Destination: ", dest);
      // console.log("Index: ", index);
      // console.log("Type: ", type);
      // console.log("Distributions: ", distributions[index]);
      const newDistribution = {
          type: distributions[index]?.type || "",
          ...(distributions[index]?.type === "fixed" && { value: distributions[index].values.value }),
          ...(distributions[index]?.type === "normal" && { mean: distributions[index].values.mean, stdev: distributions[index].values.std }),
          ...(distributions[index]?.type === "uniform" && { lower: distributions[index].values.lower, upper: distributions[index].values.upper }),
      };
      console.log("New Distribution: ", newDistribution);
    
      if (type === 'values'){
        setValues((prevValues) => ({
          ...prevValues,
          [dest]: [...(prevValues[dest] || []), newDistribution], // Append to the correct array
        }));
      }
      
      if (type === 'investment'){
        setInvestment((prevInvestment) => {
          const updatedInvestment = {
            ...prevInvestment,
            [dest]: newDistribution,
          };
          console.log("Updated Investment: ", values.investments); // Log after updating
          return updatedInvestment; // Return the updated state to save it
        });
        };    
      // Reset the distribution form
      setDistributions([
        { type: "", values: {} },
        { type: "", values: {} },
        { type: "", values: {} },
      ]);
      setDistributionValues({ value: 0, mean: 0, std: 0, lower: 0, upper: 0 });







  }
  /******************** Distribution Form ***********************************/

  const lifeExpectancyTypes =[
    { value: 'fixed', label: 'Fixed' },
    { value: 'normal', label: 'Normal' },
    { value: 'uniform', label: 'Uniform' }
  ]



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

  {/* Drag and Drop For Discretionary Item */}
  {/*---------------------------------------*/}
  
  //Stores things but does not re-render the components
  //Also save drag items
  const dragItem = React.useRef<any>(null)
  const dragOver = React.useRef<any>(null)

  // Sort Drag
  const handleSortDragForDiscretionary = () => {
    // Have a copy of the discretionary array and make change
    let discretionaryItems = [...values.discretionary]

    // Remove and Save Drag Item 
    const dragItems = discretionaryItems.splice(dragItem.current, 1)[0] //Removes 1 item and takes the 1st one
 
    // Switch the Position 
    discretionaryItems.splice(dragOver.current, 0, dragItems) // 0 means: just insert, dragOver.current: this is the new position

    // Reset the position 
    dragItem.current = null
    dragOver.current = null

    
    // Update the discretionary array after user rearrange
    setValues(prevValues => ({
      ...prevValues,
      discretionary: discretionaryItems
    }));
  }

  const handleSortDragForWithdrawal = () => {
    // Have a copy of the discretionary array and make change
    let withdrawalItems = [...values.expenseWithdrawalStrategy]

    // Remove and Save Drag Item 
    const dragItems = withdrawalItems.splice(dragItem.current, 1)[0] //Removes 1 item and takes the 1st one
 
    // Switch the Position 
    withdrawalItems.splice(dragOver.current, 0, dragItems) // 0 means: just insert, dragOver.current: this is the new position

    // Reset the position 
    dragItem.current = null
    dragOver.current = null

    
    // Update the discretionary array after user rearrange
    setValues(prevValues => ({
      ...prevValues,
      expenseWithdrawalStrategy: withdrawalItems
    }));
  }

  const handleSortDragForRMD = () => {
    // Have a copy of the discretionary array and make change
    let rmdItems = [...values.expenseWithdrawalStrategy]

    // Remove and Save Drag Item 
    const dragItems = rmdItems.splice(dragItem.current, 1)[0] //Removes 1 item and takes the 1st one
 
    // Switch the Position 
    rmdItems.splice(dragOver.current, 0, dragItems) // 0 means: just insert, dragOver.current: this is the new position

    // Reset the position 
    dragItem.current = null
    dragOver.current = null

    
    // Update the discretionary array after user rearrange
    setValues(prevValues => ({
      ...prevValues,
      RMDStrategy: rmdItems
    }));
  }

  const handleSortDragForConversionStrategy = () => {
    // Have a copy of the discretionary array and make change
    let conversionItems = [...values.RothConversionStrategy]

    // Remove and Save Drag Item 
    const dragItems = conversionItems.splice(dragItem.current, 1)[0] //Removes 1 item and takes the 1st one
 
    // Switch the Position 
    conversionItems.splice(dragOver.current, 0, dragItems) // 0 means: just insert, dragOver.current: this is the new position

    // Reset the position 
    dragItem.current = null
    dragOver.current = null

    
    // Update the discretionary array after user rearrange
    setValues(prevValues => ({
      ...prevValues,
      RothConversionStrategy: conversionItems
    }));
  }

  return (
    <div className="create-scenario"> 
      <h1>Scenario</h1> 

      <form>

      {formStep === 1 && (
        <div className="label-container">
        <Page1 values={values} setValues={setValues} states={states} handleChanges={handleChanges} index={0} />
     
      
       {/* TODO: Life Expectancy is optional, if user no input, default is 80 */}
       <DistributionForm name={'Life Expetancy'} index={0} distributions={distributions} distributionValues={distributionValues} handleDistributionChange={handleDistributionChange} />
        

       <Button variant='light' onClick={handleNext}>Next</Button>
        {/* <button onClick={handleNext}>Next</button> */}
      </div>

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

      )}

    {formStep === 4 && (
        <div className='scenarioPart2-container'>
          <label htmlFor="inflationAssumption"> Inflation Assumption:</label>
          <input
            type = "number" 
            name = "inflationAssumption"
            value = {values.inflationAssumption}
            onChange={handleChanges} 
          />


          <label htmlFor="afterTaxContributionLimit"> After Tax Contribution Limit:</label>
            <input
              type = "number" 
              name = "afterTaxContributionLimit"
              value = {values.afterTaxContributionLimit}
              onChange={handleChanges} 
          />

          {/* Select the order of spending  */}
          <label htmlFor="spendingStrategy"> Spending Strategy:</label>
            <div className='spending-list'>
            {values.discretionary.length > 0 ? (
              values.discretionary.map((item, index) => (
                <div key={index} className='spending-item'
                draggable
                onDragStart={(e)=> dragItem.current = index}
                onDragEnter={(e)=> dragOver.current = index}
                onDragEnd={handleSortDragForDiscretionary}
                onDragOver = {(e) => e.preventDefault()} //Allows things to drag so the red stop thing wont pop up
                >
                  {item.eventName}
                
                </div>
            ))
            ) : (
                <b>No discretionary items to select</b>
              )}
            </div>

          {/* Select the order for withdraw strategy */}
          <label htmlFor="expenseWithdrawalStrategy"> Expense Withdrawal Strategy:</label>
          <div className='spending-list'>
            {values.expenseWithdrawalStrategy.length > 0 ? (
              values.expenseWithdrawalStrategy.map((item, index) => (
                <div key={index} className='spending-item'
                draggable
                onDragStart={(e)=> dragItem.current = index}
                onDragEnter={(e)=> dragOver.current = index}
                onDragEnd={handleSortDragForWithdrawal}
                onDragOver = {(e) => e.preventDefault()} //Allows things to drag so the red stop thing wont pop up
                >
                  {item.investmentName}
                
                </div>
            ))
            ) : (
                <b>No withdrawal items to select</b>
              )}

            </div>
          

           {/* Select the order for RMD strategy  */}
           <label htmlFor="RMDStrategy"> RMD Strategy:</label>
            <div className='spending-list'>
              {values.RMDStrategy.length > 0 ? (
                values.RMDStrategy.map((item, index) => (
                <div key={index} className='spending-item'
                draggable
                onDragStart={(e)=> dragItem.current = index}
                onDragEnter={(e)=> dragOver.current = index}
                onDragEnd={handleSortDragForRMD}
                onDragOver = {(e) => e.preventDefault()} //Allows things to drag so the red stop thing wont pop up
                >
                  {item.investmentName}
                
                </div>
            ))
            ) : (
                <b>No RMD Strategy items to select</b>
              )}

            </div>
         
          {/* If it is true, then display the start and end year */}
           <label htmlFor="RothConversionOpt"> Roth Conversion Opt:</label>
            <input
              type = "radio" 
              name = "RothConversionOpt"
              value = "True"
              checked = {values.RothConversionOpt === "True"}
              onChange={handleChanges}/>True
            <input 
              type ="radio"
              name = "RothConversionOpt" 
              value = "False"
              checked={values.RothConversionOpt === "False"} 
              onChange={(e)=> handleChanges(e)} /> False 

        {values.RothConversionOpt === "True" && (
          <>
          <label htmlFor="RothConversionStart"> Roth Conversion Start:</label>
            <input
              type = "text" 
              name = "RothConversionStart"
              value = {values.RothConversionStart}
              onChange={handleChanges} 
          />

          
          <label htmlFor="RothConversionEnd"> Roth Conversion End:</label>
            <input
              type = "number" 
              name = "RothConversionEnd"
              value = {values.RothConversionEnd}
              onChange={handleChanges} 
          />
          </>
         )}

        <label htmlFor="RothConversionStrategy"> Roth Conversion Strategy:</label>
          <div className='spending-list'>
            {values.RothConversionStrategy.length > 0 ? (
              values.RothConversionStrategy.map((item, index) => (
                <div key={index} className='spending-item'
                draggable
                onDragStart={(e)=> dragItem.current = index}
                onDragEnter={(e)=> dragOver.current = index}
                onDragEnd={handleSortDragForConversionStrategy}
                onDragOver = {(e) => e.preventDefault()} //Allows things to drag so the red stop thing wont pop up
                >
                  {item.investmentName}
                
                </div>
            ))
            ) : (
                <b>No Conversion Strategy to select</b>
              )}

            </div>
            <Button variant='light' onClick={handleBack}>Back</Button>

       
      </div>

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
          {/* <label htmlFor = "return-distribution"> Return Distribution: </label>
            <input
              type = "text"
              name = "returnDistribution"    
              value={investment.returnDistribution}
              onChange={handleInvestmentChange}
            /> */}
          <DistributionForm name={'Return Distribution'} index={0} distributions={distributions} distributionValues={distributionValues} handleDistributionChange={handleDistributionChange} /> 
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
          <DistributionForm name={'Income Distribution'} index={1} distributions={distributions} distributionValues={distributionValues} handleDistributionChange={handleDistributionChange} /> 


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

{/*------------ Ask user the amount of their investment, and whether it is tax-exempt or not ---------*/}
            <Button onClick={addInvestmentCase}>Set Investment</Button>

            {investment.investmentCases.map((investmentCase, index) => (
              <div key={investmentCase.id}>

                <label htmlFor="value">Value: </label>
                <input
                  type="text"
                  name="value"
                  value={investmentCase.value ||''}
                  onChange={(e) => handleInvestmentCaseChange(index, e)}
                />

                <label htmlFor="tax-status"> Tax Status:</label>
                      <input
                        type="radio"
                        id = "non-retirement"
                        name = "taxStatus"
                        value="non-retirement"
                        checked={investmentCase.taxStatus === "non-retirement"}
                        onChange={(e) => handleInvestmentCaseChange(index, e)}/> Non-Retirement

                      <input 
                        type ="radio"
                        id = "pre-tax"
                        name = "taxStatus"
                        value="pre-tax"
                        checked={investmentCase.taxStatus === "pre-tax"}
                        onChange={(e) => handleInvestmentCaseChange(index, e)} /> Pre-Tax
                      
                      
                      <input 
                        type ="radio"
                        id = "after-tax"
                        name = "taxStatus"
                        value="after-tax"
                        checked={investmentCase.taxStatus === "after-tax"}
                        onChange={(e) => handleInvestmentCaseChange(index, e)} /> After-Tax




                {/* <label htmlFor="tax-status">Tax Status: </label>
                <input
                  type="text"
                  name="taxStatus"
                  value={investmentCase.taxStatus ||''}
                  onChange={(e) => handleInvestmentCaseChange(index, e)}
                /> */}

              </div>
            ))}

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
          <EventForm handleEventChange={handleEventChange} handleAnswerChange={handleAnswerChange} answers={answers}
           selectedEvent={selectedEvent} diffEvent= {diffEvent} index={0} />
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