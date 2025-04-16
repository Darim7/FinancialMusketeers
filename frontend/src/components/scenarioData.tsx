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
import InvestmentForm from './InvestmentForm';
import InvestmentCaseForm from './InvestmentCaseForm';
import LifeExpectancyForm from './LifeExpectancyForm';

function CreateScenario({formInfo, saveForms, userEmail}: any) {

  {/* Go to the next page */}
  const [formStep, setformStep] = useState(1);

  {/* Update user input change */}
  const [values, setValues] = useState({
    user_email: '',
    scenarioName : '',
    residenceState: '',
    financialGoal: '',
    lifeExpectancy: [{type:""}, {type: ""}] as any[],
    maritalStatus: '',
    birthYears: [0, 0] as number[], 
    birthYear1: '',
    birthYear2: '',
    inflationAssumption: {type:""},
    afterTaxContributionLimit: '',
    spendingStrategy: [] as any,
    expenseWithdrawalStrategy: [] as any [],
    RMDStrategy: [] as any [],
    RothConversionOpt: false,
    RothConversionOptInfo: [] as any [],
    RothConversionStart: '',
    RothConversionEnd: '',
    RothConversionStrategy: [] as any,
    AssetAllocation: [] as any[],
    investmentTypes: [] as any[],
    investments: [] as any[],
    eventSeries: [] as any[],
    discretionary: [] as any []
  })

  console.log("what is the value", values);

  useEffect(() => {
    console.log('formData:', formInfo);
    setValues({
      user_email: userEmail || formInfo.email || '',
      scenarioName: formInfo.scenarioName || '',
      residenceState: formInfo.residenceState || '',
      financialGoal: formInfo.financialGoal || '',
      lifeExpectancy: formInfo.lifeExpectancy || [{type:""}, {type:""}],
      maritalStatus: formInfo.maritalStatus || '',
      birthYears: formInfo.birthYears || [],
      birthYear1: formInfo.birthYear1 || '',
      birthYear2: formInfo.birthYear2 || '',
      inflationAssumption: formInfo.inflationAssumption || {type:""},
      afterTaxContributionLimit: formInfo.afterTaxContributionLimit || '',
      spendingStrategy: formInfo.spendingStrategy || [],
      expenseWithdrawalStrategy: formInfo.expenseWithdrawalStrategy || [],
      RMDStrategy: formInfo.RMDStrategy || [],
      // RothConversionOpt: formInfo.RothConversionOpt || '',
      RothConversionOpt: formInfo.RothConversionOpt === 'True',
      RothConversionOptInfo: formInfo.RothConversionOptInfo || [],
      RothConversionStart: formInfo.RothConversionStart || '',
      RothConversionEnd: formInfo.RothConversionEnd || '',
      RothConversionStrategy: formInfo.RothConversionStrategy || [],
      AssetAllocation: formInfo.AssetAllocation || [],
      investmentTypes: formInfo.investmentTypes || [],
      investments: formInfo.investments || [],
      eventSeries: formInfo.eventSeries || [],
      discretionary: formInfo.discretionary || []
    });
}, [formInfo]);

  {/*Show current investment modal*/}
  const [investment, setInvestment] = useState({
    name: '',
    description: '',
    returnAmtOrPct: '',
    returnDistribution: {type:""},
    expenseRatio: '',
    incomeAmtOrPct: '',
    incomeDistribution: {type:""},
    taxability: '',
    // investmentValues: [] as any[]
  })

  console.log('LIFE EXPECTANCY:', values.lifeExpectancy)
  
  const [investmentCaseValues, setInvestmentCaseValues] = useState({
    investmentType: '',
    value: '',
    taxStatus: '',
    id: '',
  })

  console.log("user email", values.user_email);

  console.log("what is the investment", values.investmentTypes);
  // There are 4 different types of event
  const diffEvent = {
    Income: [
      { question: "Event Names: ", type: "text", name:"name"},
      { question: "Start: ", type: "distribution", name:"start"  },
      { question: "Duration: ", type: "distribution", name:"duration" },
      { question: "Initial Amount: ", type: "number" , name:"initialAmount"},
      { question: "Change Amount or Percent: ", type: "select" , name:"changeAmountOrPercent"},
      { question: "Change Distribution: ", type: "distribution" , name:"changeDistribution"},
      { question: "Inflation Adjusted: ", type: "boolean", name:"inflationAdjusted"},
      { question: "User Fraction: ", type: "number", name:"userFraction"},
      { question: "Social Security: ", type: "boolean", name:"socialSecurity"},

    ],

    Expense: [
      { question: "Event Names: ", type: "text", name:"name"},
      { question: "Start: ", type: "distribution", name:"start"  },
      { question: "Duration: ", type: "distribution", name:"duration" },
      { question: "Initial Amount: ", type: "number" , name:"initialAmount"},
      { question: "Change Amount or Percent: ", type: "text" , name:"changeAmountOrPercent"},
      { question: "Change Distribution: ", type: "distribution" , name:"changeDistribution"},
      { question: "Inflation Adjusted: ", type: "boolean", name:"inflationAdjusted"},
      { question: "User Fraction: ", type: "number", name:"userFraction"},
      { question: "Discretionary : ", type: "boolean", name: "discretionary"}, // This should be Boolean
      
    ],
    Invest: [
      { question: "Event Names: ", type: "text", name:"name"},
      { question: "Start: ", type: "distribution", name:"start"  },
      { question: "Duration: ", type: "distribution", name:"duration" },
      { question: "Asset Allocation:",  type: "object", name: "assetAllocation", fields: [values.AssetAllocation]},
      { question: "Glide Path:", type: "boolean", name: "glidePath"},
      { question: "Asset Allocation2:", type: "object", name: "assetAllocation2",fields: [values.AssetAllocation]},

    ],

    Rebalance: [
      { question: "Event Names: ", type: "text", name:"name"},
      { question: "Start: ", type: "distribution", name:"start"  },
      { question: "Duration: ", type: "distribution", name:"duration" },
      { question: "Asset Allocation:", type: "object", name: "assetAllocation", fields:[values.AssetAllocation] },
    ],
  };

  // Event Section //

  // Event info storage -> answers
  const [answers, setAnswers] = useState({}); 

  const [selectedEvent, setSelectedEvent] = useState("");

  const [currentEventIndex ,setCurrentEventIndex] = useState(-1);

  // When the user selects a new type of event, reset the inputs
  const handleEventChange = (e:React.ChangeEvent<any>) => {
    const eventType = e.target.value;

    if (e.target.name == 'typeOfEvents'){
      setAnswers({});
      setSelectedEvent(eventType);
    }

    // setSelectedEvent(eventType);
  };

  // Handles inputs from the event page
  // const 
  // 
  //  = (question: string, value: any) => {
  //   setAnswers((prev) => ({
  //      ...prev, 
  //      [question]: value }));
       
  //   console.log("Handle Answer Change: ", answers)
  


  
  // };
  // const handleAnswerChange = (question: string, value: any) => {
  //   // Update local state
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [question]: value,
  //   }));
  
  //   // Update saved forms
  //   saveForms((prevForms) =>
  //     prevForms.map((form) =>
  //       form.id === formInfo.id
  //         ? { ...form, [question]: value }
  //         : form
  //     )
  //   );
  
  // };
  const handleAnswerChange = (e:React.ChangeEvent<any>,question: string, value: any) => {
    console.log(`Handle Answer Change: \n Question: ${question}, Value: ${value}`)
    const {name, type} = e.target;
    // Update local state

    let parsedValue = value;

    if (type === "number") {
      parsedValue = Number(value);
    }

    setAnswers((prev) => ({
      ...prev,
      [question]: parsedValue,
    }));
  
    // Update saved forms
    saveForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formInfo.id
          ? {
              ...form,
              // Prevent updating 'name' unless 'question' is 'scenarioName'
              [question]: question === 'scenarioName' ? parsedValue : form[question],
            }
          : form
      )
    );
  };
  
  

   // Change handler for values
  //  const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

  //   // All the declared variable and its values
  //   const { name, value } = e.target;

  //   console.log(name, value);

  //   // const spouseYear = [values.birthYear1, values.birthYear2];  
  //   // const spouseYear = [values.birthYear1, values.birthYear2].filter(Boolean); 

    
  //   setValues((prevValues) => ({  
  //       ...prevValues,
  //       [name]: value,
  //       // birthYears: spouseYear,
  //   }));

  //   //Loop through the form 
  //   saveForms((prevForms:any) =>
  //     prevForms.map((form:any) =>
  //     // Asked Copilot how to reflected the name when the form is saved so users can click on the scenario they created.
  //     // Finds the form by ID and set the name == Scenario Name so user can see
  //     // form.id === formInfo.id ? { ...form, [name]: value, name: name === 'scenarioName' ? value : form.name } : form
  //     form.id === formInfo.id ? { ...form, [name]: value, name: name === 'scenarioName' ? value : form.name } : form
     
  //     )
  //   );
    
  //  };
  const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,birthYearIndex?: number) => {
    const { name, value } = e.target;

    const parsedValue =
      name === 'RothConversionStart' || name === 'RothConversionEnd' || name === 'financialGoal'
        ? Number(value)
        : value;
    
    if (name === 'RothConversionOpt') {
          setValues((prev) => ({
            ...prev,
            [name]: value === 'true', 
          }));
          return;
        }
  
    if (name === 'birthYear1' || name === 'birthYear2') {
      // Ask ChatGPT how to correctly put the birth year into the birthYears array
      // setValues((prevValues) => {
      //   const updatedBirthYears = [...prevValues.birthYears];
      //   if (birthYearIndex !== undefined) {
      //     updatedBirthYears[birthYearIndex] = value;
      //   }
      setValues((prevValues) => {
        const updatedBirthYears = [...prevValues.birthYears];
        if (birthYearIndex !== undefined) {
          updatedBirthYears[birthYearIndex] = Number(value); // Ensure this is a number
        }
  
        return {
          ...prevValues,
          birthYears: updatedBirthYears,
          [name]: parsedValue, 
        };
      });
      saveForms((prevForms: any) =>
        prevForms.map((form: any) =>
          form.id === formInfo.id
            ? {
                ...form,
                birthYears: (() => {
                  const updated = [...form.birthYears || []];
                  updated[birthYearIndex || 0] = Number(value);
                  return updated;
                })(),
                [name]: parsedValue,
                name: name === 'scenarioName' ? value : form.name,
              }
            : form
        )
      );
    } else {
      
      setValues((prevValues) => ({
        ...prevValues,
        [name]: parsedValue,
      }));
  
      saveForms((prevForms: any) =>
        prevForms.map((form: any) =>
          form.id === formInfo.id
            ? {
                ...form,
                [name]: parsedValue,
                name: name === 'scenarioName' ? value : form.name,
              }
            : form
        )
      );
    }
   
  };
  


  /******************* Handles Pagination ****************************************/
  const handleNext = (e:React.ChangeEvent<any>) => {
    e.preventDefault(); // Prevent form from submitting

    if (formStep === 1){
      saveForms((prevForms:any) =>
        prevForms.map((form:any) =>
          // form.id === formInfo.id ? { ...form, ['lifeExpectancy']: values.lifeExpectancy, name: name === 'scenarioName' ? value : form.name } : form
          form.id === formInfo.id ? { ...form, ['lifeExpectancy']: values.lifeExpectancy } : form
        )
      );
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
    const [isInvestmentFormVisible, setIsInvestmentFormVisible] = useState(false);
    const [investments, setInvestments] = useState([]);
  

  
    const [showInvestmentCase, setShowInvestmentCase] = useState(false);
    const [currentInvestmentCaseIndex, setCurrentInvestmentCaseIndex] = useState(-1);

    const newInvestmentCase = () => {
      setShowInvestmentCase(true)
      setCurrentInvestmentIndex(-1);
    }

    const editInvestmentCase = (investmentCase: any, index: number) => {
      setInvestmentCaseValues({...investmentCase});
      setCurrentInvestmentCaseIndex(index);
      setShowInvestmentCase(true);
    }
  
    const closeInvestmentCase = () => {
      setShowInvestmentCase(false);
    }
  
    const addInvestmentCase = () => {
      setIsInvestmentFormVisible(true);
   
      setValues((prevValues) => ({
        ...prevValues,
        investments: [
          ...prevValues.investments,
          // { formid: Date.now(), investmentTypes: investment.name, value: '', id: investment.name},
          { investmentType: investment.name, value: '', id: investment.name},
        ],
      }));
    };
  
    // const handleInvestmentCaseChange = (index: number, e: React.ChangeEvent<any>) => {
    //   const { name, value } = e.target;
    
    //   // Update the investments array in the state
    //   const updatedInvestmentCases = values.investments.map((investmentValues, i) =>
    //     i === index ? { ...investmentValues, [name]: value } : investmentValues
    //   );
    
    //   // Update the state with the new investments array
    //   setValues((prevValues) => ({
    //     ...prevValues,
    //     investments: updatedInvestmentCases,
    //   }));
    
    //   // Update the investments in saveForms
    //   saveForms((prevForms) =>
    //     prevForms.map((form) =>
    //       form.id === formInfo.id
    //         ? {
    //             ...form,
    //             investments: updatedInvestmentCases, 
    //           }
    //         : form
    //     )
    //   );
    // };
    
    const handleInvestmentCaseChange = (e:React.ChangeEvent<any>) => {

      const {name, value, type} = e.target;

      let parsedValue = value;

      if (type==="number"){
        parsedValue = Number(value);
      }

      setInvestmentCaseValues({...investmentCaseValues, [e.target.name]:parsedValue});
    }

    const saveInvestmentCase = (e:React.ChangeEvent<any>) => {

      let updatedInvestmentCases;
      let updateAssetAllocation;
      let updateValueInvestments;
      let updatedExpenseWithdrawalStrategy;
      let updateRMD: any;
      let updateRothConversionStrategy: any;

      const newId = `${investmentCaseValues.investmentType} ${investmentCaseValues.taxStatus}`;

      const investmentCaseToSave = {
        ...investmentCaseValues,
        id: newId,
      };

      if (currentInvestmentCaseIndex >= 0) {
        updatedInvestmentCases = [...values.investments];
        updatedInvestmentCases[currentInvestmentCaseIndex] = investmentCaseToSave;

        updatedExpenseWithdrawalStrategy = [...values.expenseWithdrawalStrategy];
        updatedExpenseWithdrawalStrategy[currentInvestmentCaseIndex] = investmentCaseToSave.id;

        if (values.investments.some(investmentValues => investmentValues.taxStatus === "pre-tax")){
          // If the tax-status is "pre-tax" then added to the array 
              updateRMD = [...values.RMDStrategy];
              updateRMD[currentInvestmentCaseIndex] = investmentCaseToSave.id;
  
              updateRothConversionStrategy = [...values.RothConversionStrategy];
              updateRothConversionStrategy[currentInvestmentCaseIndex] = investmentCaseToSave.id;
          } 
        
        if (values.investments.some(investmentValues => investmentValues.taxStatus !== "pre-tax")){
            console.log("WTFFFFFFFFFF")
          
            updateAssetAllocation = [...values.AssetAllocation];
            updateAssetAllocation[currentInvestmentCaseIndex] = investmentCaseToSave.id;
            console.log("what is updateAssetAllocation", values.AssetAllocation);    
        } 
        else {
          updateRMD = [...values.RMDStrategy];
          updateRothConversionStrategy = [...values.RothConversionStrategy];
          console.log("I AM DEAD")
          updateAssetAllocation = [...values.AssetAllocation];
        }
      }
      else {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        updatedInvestmentCases = [...values.investments, investmentCaseToSave];
        updatedExpenseWithdrawalStrategy = [...values.expenseWithdrawalStrategy, investmentCaseToSave.id];
        updateRMD = [...values.RMDStrategy];

        updateRothConversionStrategy = [...values.RothConversionStrategy];

        updateAssetAllocation = [...values.AssetAllocation];
        console.log("AHHHH")

        if (investmentCaseToSave.taxStatus === 'pre-tax') {
          console.log("PREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
          updateRMD = [...values.RMDStrategy, investmentCaseToSave.id];
          updateRothConversionStrategy = [...values.RothConversionStrategy, investmentCaseToSave.id];  
        }
        else {
          updateAssetAllocation = [...values.AssetAllocation, investmentCaseToSave];
          console.log("WHY IS THIS NOT PRINTING:", updateAssetAllocation);
        }

        // if (values.investments.some(investmentValues => investmentValues.taxStatus === "pre-tax")){
        //   updateRMD = [...values.RMDStrategy, investmentCaseToSave];
        //   updateRothConversionStrategy = [...values.RothConversionStrategy, investmentCaseToSave];       
        // }
        // else if (values.investments.some(investmentValues => investmentValues.taxStatus !== "pre-tax")){
        //   updateAssetAllocation = [...values.AssetAllocation, investmentCaseToSave];
        //   console.log("WHY IS THIS NOT PRINTING:", updateAssetAllocation);
        // }

      }

      setValues(prevValues => ({
        ...prevValues,
        investments: updatedInvestmentCases,
        expenseWithdrawalStrategy: updatedExpenseWithdrawalStrategy,
        RMDStrategy : updateRMD,
        RothConversionStrategy: updateRothConversionStrategy,
        AssetAllocation: updateAssetAllocation,
      }));

      saveForms((prevForms):any => 
        prevForms.map((form):any => 
          form.id === formInfo.id?{
            ...form,
            investments: updatedInvestmentCases,
            expenseWithdrawalStrategy: updatedExpenseWithdrawalStrategy,
            RMDStrategy : updateRMD,
            RothConversionStrategy: updateRothConversionStrategy,
            AssetAllocation: updateAssetAllocation,
          }:form
        )
      );

      setInvestmentCaseValues({    
        investmentType: '',
        value: '',
        taxStatus: '',
      })

      setCurrentInvestmentCaseIndex(-1);
      closeInvestmentCase();
    }

  {/* ------ This is for investments case after declaring the investment type -----*/}

  const newInvestmentModal = () => {
    setInvestment({
      name: '',
      description: '',
      returnAmtOrPct: '',
      returnDistribution: { type: ''},
      expenseRatio: '',
      incomeAmtOrPct: '',
      incomeDistribution: { type: ''},
      taxability: '',
      // investmentValues: [],
    });

    setValues((prevValues) => ({
      ...prevValues,
      investments: prevValues.investments.map((investmentValues) =>
        investmentValues.id === investment.name ? { ...investmentValues, value: '' } : investmentValues
      ),
      investmentTypes:
        prevValues.investmentTypes.map((investmentValues) =>
          investmentValues.id === investment.name ? { ...investmentValues, value: ''} : investmentValues
        ),
    }));

    setIsInvestmentFormVisible(false);
    setShowInvestmentModal(true);
    setCurrentInvestmentIndex(-1);
    
  }

  useEffect(() => {
    if (investments.length > 0) {
      setIsInvestmentFormVisible(true);
    }
  }, [investments]); // This will run when investments state changes

  
  const editInvestmentModal = (investment: any, index: number) => {
  
    setInvestment({ ...investment });  // Update investment state
    console.log("What is the investment AHHH:", investment);
    setCurrentInvestmentIndex(index);  // Set the current index
    setShowInvestmentModal(true);  // Show the modal
  }

  const closeInvestmentModal = () => {
    setShowInvestmentModal(false);
  }

  const saveInvestment = (e:React.ChangeEvent<any>) => {

      let updatedInvestments;
      // let updateValueInvestments;
      let updatedExpenseWithdrawalStrategy;
      let updateRMD: any;
      let updateRothConversionStrategy: any;
      let updateAssetAllocation;

      // Update if editing
      const investmentToSave = {
        ...investment,
      };

      // console.log("what is the investment to SAVE", investment);
      console.log("HELOOOOOOOOOOOOOOOOOOOO",investmentToSave);
      console.log("investment index", currentInvestmentIndex)
     
      if (currentInvestmentIndex >= 0) {
        updatedInvestments = [...values.investmentTypes];
        

        updatedInvestments[currentInvestmentIndex] = investmentToSave;

      
        // updatedExpenseWithdrawalStrategy = [...values.expenseWithdrawalStrategy];
        // updatedExpenseWithdrawalStrategy[currentInvestmentIndex] = investmentToSave;

        // if (values.investments.some(investmentValues => investmentValues.taxStatus === "pre-tax")){
        // // If the tax-status is "pre-tax" then added to the array 
        //     updateRMD = [...values.RMDStrategy];
        //     updateRMD[currentInvestmentIndex] = investment;

        //     updateRothConversionStrategy = [...values.RothConversionStrategy];
        //     updateRothConversionStrategy[currentInvestmentIndex] = investment;
            
        // } 
        // console.log("what is the investment Sattus", investment.investmentCases.some(investmentCase => investmentCase.taxStatus));
        // if (values.investments.some(investmentValues => investmentValues.taxStatus !== "pre-tax")){
        //       console.log("WTFFFFFFFFFF")
            
        //       updateAssetAllocation = [...values.AssetAllocation];
        //       updateAssetAllocation[currentInvestmentIndex] = investment;
        //       console.log("what is updateAssetAllocation", values.AssetAllocation);
              
      } 
        // Keep the same 
      // else {
      //     // updateRMD = [...values.RMDStrategy];
      //     updateRothConversionStrategy = [...values.RothConversionStrategy];
      //     console.log("I AM DEAD")
      //     updateAssetAllocation = [...values.AssetAllocation];
      //   }

      // } 
      else { /* then it is new */
        updatedInvestments = [...values.investmentTypes, investment];
        // updatedExpenseWithdrawalStrategy = [...values.expenseWithdrawalStrategy, investment];
        // updateRMD = [...values.RMDStrategy];

        // updateRothConversionStrategy = [...values.RothConversionStrategy];

        // updateAssetAllocation = [...values.AssetAllocation];
        // console.log("AHHHH")
        
        // if (values.investments.some(investmentValues => investmentValues.taxStatus === "pre-tax")){
        //         updateRMD = [...values.RMDStrategy, investment];
        //         updateRothConversionStrategy = [...values.RothConversionStrategy, investment];       
        // }
        // else if (values.investments.some(investmentValues => investmentValues.taxStatus !== "pre-tax")){
        //     updateAssetAllocation = [...values.AssetAllocation, investment];
        //     console.log("WHY IS THIS NOT PRINTING:", updateAssetAllocation);
        // }
      }

    // Update the local state with the new investments array
    setValues(prevValues => ({
      ...prevValues,
      investmentTypes: updatedInvestments,
      // expenseWithdrawalStrategy: updatedExpenseWithdrawalStrategy,
      // RMDStrategy : updateRMD,
      // RothConversionStrategy: updateRothConversionStrategy,
      // AssetAllocation: updateAssetAllocation,
    }));

    saveForms(prevForms => 
      prevForms.map(form => 
        form.id === formInfo.id?{
          ...form,
          investmentTypes: updatedInvestments,
          // expenseWithdrawalStrategy: updatedExpenseWithdrawalStrategy,
          // RMDStrategy: updateRMD,
          // RothConversionStrategy: updateRothConversionStrategy,
          // AssetAllocation: updateAssetAllocation

        }:form
      )
    );
    console.log('RETURN DISTRIBUTION', values.investmentTypes);
    //Reset the investment form fields
    // setInvestment({
    //   name: '',
    //   description: '',
    //   returnAmtOrPct: '',
    //   returnDistribution: { type: ''},
    //   expenseRatio: '',
    //   incomeAmtOrPct: '',
    //   incomeDistribution: { type: ''},
    //   taxability: '',
    //   // investmentValues: [],
    // });
    // setValues((prevValues) => ({
    //   ...prevValues,
    //   investments: prevValues.investments.map((investmentValues) =>
    //     investmentValues.id === investment.name ? { ...investmentValues, value: '' } : investmentValues
    //   ),
    //   investmentTypes:
    //     prevValues.investmentTypes.map((investmentValues) =>
    //       investmentValues.id === investment.name ? { ...investmentValues, value: ''} : investmentValues
    //     ),
    // }));
    
    

    setCurrentInvestmentIndex(-1);
    // Close the modal
    closeInvestmentModal();
  }
  
  const handleInvestmentChange = (e:React.ChangeEvent<any>) => {
    setInvestment({...investment, [e.target.name]:e.target.value});
  };

  // const addInvestment = (e:React.ChangeEvent<any>) => {
  //   setValues({...values, investments: [...values.investments, investment]})

  //   setInvestment({
  //     investmentName: '',
  //     description: '',
  //     returnAmtOrPct: '',
  //     returnDistribution: {},
  //     expenseRatio: '',
  //     incomeAmtOrPct: '',
  //     incomeDistribution: '',
  //     taxability: '',
  //     investmentCases: [] as any [],
  //   })
  // }
  
  /******************** Investment Functions *************************************/

  /******************** Event Functions *************************************/
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const newEventCard = (e:React.ChangeEvent<any>) => {
      setCurrentEventIndex(-1);
      setShowEventModal(true);
  }
  
  const editEventModal = (event:any, index:number) => {
    // console.log("what is the event", event);
    setSelectedEvent(event.type);
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
      type: selectedEvent,
      name: answers["Event Names: "] || "Unnamed Event",
      discretionary: answers["Discretionary : "] || "false",
      // Add other properties based on the event type
      ...answers // Include all answers
    };
    console.log("what is the NEW EVENT:", newEvent.discretionary);

    let updatedEvents;
    let updatedDiscretionary;
    let updateSpendingStrategy;


    if (currentEventIndex >= 0){
      console.log("DOES IT GOES IN HERE?")
      //Editing an existing event
      updatedEvents = [...values.eventSeries];
      updatedEvents[currentEventIndex] = newEvent;  
      
    
     if(newEvent.type === "Expense" && newEvent.discretionary === "true"){
        // console.log("what is the New Event", newEvent);
        updatedDiscretionary = [...values.discretionary];
        updateSpendingStrategy=[...values.spendingStrategy]

        updatedDiscretionary[currentEventIndex] = newEvent;
        updateSpendingStrategy = newEvent;

     }
     else{
      updatedDiscretionary = values.discretionary;
      updateSpendingStrategy = values.spendingStrategy;
      // updatedDiscretionary = values.discretionary.filter(event => event["Discretionary : "] === "true");
      console.log("what is value's.discretionary WHEN IT IS FALSE", values.discretionary);
      console.log("what is updatedDiscretionary", updatedDiscretionary);


     }
      

    } else {
      updatedEvents = [...values.eventSeries, newEvent];
      console.log("what is the UPDATED EVENT FITST ", updatedEvents);
      console.log("what is new Event.type:", newEvent.type);
      console.log("what is new Event.name:", newEvent.name);
      

      if (newEvent.type === "Expense" && newEvent.discretionary === "true") {
        updatedDiscretionary = [...values.discretionary, newEvent];
        updateSpendingStrategy = [...values.spendingStrategy, newEvent];
        console.log("UPDATED DISCRETIONARY", updatedDiscretionary);
        console.log("DOES IT GOES IN HERE?")
      } else {
        updatedDiscretionary = values.discretionary;
        updateSpendingStrategy = values.spendingStrategy;

        console.log("what is VALUES.DISCRETIONARY", values.discretionary);
        // updatedDiscretionary = values.discretionary.filter(event => event["Discretionary : "] === "true");
        console.log("ELSE DISCRETIONARY:", updatedDiscretionary);

      }
      

    }
    setValues(prevValues => ({
      ...prevValues,
      eventSeries: updatedEvents,
      discretionary: updatedDiscretionary,
      spendingStrategy: updateSpendingStrategy,
    }));


    saveForms(prevForms => 
      prevForms.map(form => 
        form.id === formInfo.id 
          ? { 
              ...form, 
              eventSeries: updatedEvents,
              discretionary: updatedDiscretionary,
              spendingStrategy: updateSpendingStrategy
            } 
          : form
      )
    );

    setAnswers({});
    setSelectedEvent("");
    closeEventModal();
  }
  /******************** Event Functions *************************************/

  /******************** Distribution Functions ***********************************/
 
  // const handleMainDistributionChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
  //   const { name, value } = e.target
  //   console.log(name, value); // Debugging log
    
  //   setValues(prev => {
  //     let updatedValue;
  //     if (name === 'type') {
  //       updatedValue = { type: value }; // Initialize values
  //     } else {
  //       updatedValue = {
  //         ...prev[field],
  //         [name]: value,
  //         }
  //     };
  //       return { ...prev, [field]: updatedValue };
  //     });
  //   };
  const handleMainDistributionChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { name, value } = e.target;
    console.log(name, value); // Debugging log
  
    // Compute the updatedValue once so we can use it in both places
    const updatedValue = name === 'type'
      ? { type: value }
      : {
          ...values[field],
          [name]: Number(value),
        };
  
    // Update local state
    setValues(prev => ({
      ...prev,
      [field]: updatedValue,
    }));

    // Update saved forms
    saveForms(prevForms =>
      prevForms.map(form =>
        form.id === formInfo.id
          ? { ...form, [field]: updatedValue }
          : form
      )
    );
  };

  const handleLifeExpectancyChange = (e:React.ChangeEvent<any>, index: number) => {
    const {name, value} = e.target;

    console.log(name, value);

    //user is selecting a new type
    setValues(prev => {
      const updatedLifeExpectancy = [...prev.lifeExpectancy];
      if (!updatedLifeExpectancy[index]) {
        updatedLifeExpectancy[index] = { type: '' }; // Initialize if it doesn't exist
      }
      if (name === 'type') {
        updatedLifeExpectancy[index] = { type: value }; // Clear other fields when type changes
      } else {
        updatedLifeExpectancy[index] = {
          ...updatedLifeExpectancy[index],
          [name]: parseInt(value), // Handle empty input
        };
      }
      return { ...prev, lifeExpectancy: updatedLifeExpectancy };
    })
  }

  

  const handleInvestmentDistributionChange = (e: React.ChangeEvent<any>, field: string) => {
    const { name, value } = e.target
    console.log(name, value); // Debugging log
    
    setInvestment(prev => {
      let updatedValue;
      if (name === 'type') {
        updatedValue = { type: value }; // Initialize values
      } else {
        updatedValue = {
          ...prev[field],
          [name]: Number(value),
          }
      };
        return { ...prev, [field]: updatedValue };
      });
  }

  // const handleEventDistributionChange = (e: React.ChangeEvent<any>, field: string) => {
  //   const { name, value } = e.target
  //   console.log(name, value); // Debugging log
    
  //   setAnswers(prev => {
  //     let updatedValue;
  //     if (name === 'type') {
  //       updatedValue = { type: value }; // Initialize values
  //     } else {
  //       updatedValue = {
  //         ...prev[field],
  //         [name]: value,
  //         }
  //     };
  //       return { ...prev, [field]: updatedValue };
  //     });
  // }
  const handleEventDistributionChange = (e: React.ChangeEvent<any>, field: string) => {
    const { name, value } = e.target;
    console.log(name, value); // Debugging log
  
    // Compute updated value
    const updatedValue = name === 'type'
      ? { type: value }
      : {
          ...answers[field],
          [name]: Number(value),
        };
  
    // Update answers state
    setAnswers(prev => ({
      ...prev,
      [field]: updatedValue,
    }));
  
    // // Update saved forms
    // saveForms(prevForms =>
    //   prevForms.map(form =>
    //     form.id === formInfo.id
    //       ? { ...form, [field]: updatedValue }
    //       : form
    //   )
    // );
  };
  
  /******************** Distribution Form ***********************************/
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
  {console.log(values.lifeExpectancy[0])}
  return (
    <div className="create-scenario"> 
      <h1>Scenario</h1> 
      <form>

      {formStep === 1 && (
        <div className="label-container">
        <Page1 values={values} setValues={setValues} states={states} handleChanges={handleChanges} index={0} />
     
       {/* TODO: Life Expectancy is optional, if user no input, default is 80 */}
       {/* <DistributionForm name={'lifeExpectancy'} field={'lifeExpectancy'} text="Life Expectancy:" distribution={values.lifeExpectancy[0]} handleChange={handleLifeExpectancyChange} index={0} /> */}
       <LifeExpectancyForm text={"Life Expectancy:"} distribution={values.lifeExpectancy[0]} handleChange={handleLifeExpectancyChange} index={0}/>
       {values.maritalStatus === "couple" ? (
        <LifeExpectancyForm text={"Life Expectancy of Spouse: "} distribution={values.lifeExpectancy[1]} handleChange={handleLifeExpectancyChange} index={1} />
       ): null}

       <Button variant='light' onClick={handleNext}>Next</Button>
        {/* <button onClick={handleNext}>Next</button> */}
      </div>

      )}

      {formStep === 2 && (
        <div className='investment-container'>
          <h3>Investments</h3>
          <Button variant='primary' onClick={newInvestmentModal}>
            + Add New Investment Types
          </Button>
          
          {values.investmentTypes.length > 0 ? (
            <div className='investmentLists'>
                {values.investmentTypes.map((investment, index) => (
                  <Card key={index} className='investmentCards' onClick={() => editInvestmentModal(investment, index)}>
                    <Card.Body>
                      <Card.Title>{investment.name}</Card.Title>
                      <Card.Text>{investment.description}</Card.Text>
                    </Card.Body>
                  </Card>  
                ))}
            </div>
          ) : (
            <p>No Investment Types</p>
          )}
          <Button variant='light' onClick={handleBack}>Back</Button>
          <Button variant='light' onClick={handleNext}>Next</Button> 

          <InvestmentForm 
            showInvestmentModal={showInvestmentModal}
            closeInvestmentModal={closeInvestmentModal}
            saveInvestment={saveInvestment}
            values={values}
            investment={investment}
            handleInvestmentChange={handleInvestmentChange}
            returnDistribution={investment.returnDistribution}
            incomeDistribution={investment.incomeDistribution}
            handleDistributionChange={handleInvestmentDistributionChange}
            addInvestmentCase={addInvestmentCase}
            handleInvestmentCaseChange={handleInvestmentCaseChange}
          />
        </div>
      )}
      {formStep === 3 && (
        <div className='investment-values'>
          <h3> Investments </h3>

          <Button variant='primary' onClick={newInvestmentCase}>
            + Add New Investment
          </Button>

          {values.investments.length > 0 ? (
            <div className='investmentLists'>
                {values.investments.map((investment, index) => (
                  <Card key={index} className='investmentCards' onClick={() => editInvestmentCase(investment, index)}>
                    <Card.Body>
                      <Card.Title>{investment.investmentType}</Card.Title>
                      <Card.Text>${investment.value}, {investment.taxStatus}</Card.Text>
                    </Card.Body>
                  </Card>  
                ))}
            </div>
          ) : (
            <p>No Investment </p>
          )}
          <Button variant='light' onClick={handleBack}>Back</Button>
          <Button variant='light' onClick={handleNext}>Next</Button> 
          
          <InvestmentCaseForm
            investmentTypes={values.investmentTypes}
            investment={investmentCaseValues}
            showInvestmentCase={showInvestmentCase}
            closeInvestmentCase={closeInvestmentCase}
            handleInvestmentCaseChange={handleInvestmentCaseChange}
            saveInvestmentCase={saveInvestmentCase}
          />

        </div>
      )} 
      {formStep === 4 && (
        <div className='events-container'>
          <h3>Events</h3>
          <Button variant='primary' onClick={addNewEvent}>
            + Add New Event
          </Button>
        {values.eventSeries.length > 0 ? (
          <div className='eventsList'>
              {values.eventSeries.map((event, index) => (
                <Card key={index} className='eventCards' onClick={() => editEventModal(event, index)}>
                  <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
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

    {formStep === 5 && (
        <div className='scenarioPart2-container'>
          <DistributionForm name={"inflationAssumption"} text={"Inflation Assumption:"} field={"inflationAssumption"} distribution={values.inflationAssumption} handleChange={handleMainDistributionChange}/>

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
                  {/* {item.eventName}  */}
                  {item.name} 
                
                </div> // MIGHT HAVE TO FIX THIS
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
                  {item}
                  
                  
                
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
                  {item}
                
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
              value = "true"
              checked = {values.RothConversionOpt === true}
              onChange={handleChanges}/>True
            <input 
              type ="radio"
              name = "RothConversionOpt" 
              value = "false"
              checked={values.RothConversionOpt === false} 
              onChange={(e)=> handleChanges(e)} /> False 

        {values.RothConversionOpt === true && (
          <>
          <label htmlFor="RothConversionStart"> Roth Conversion Start:</label>
            <input
              type = "number" 
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
              values.RothConversionStrategy.map((item:any, index:number) => (
                <div key={index} className='spending-item'
                draggable
                onDragStart={(e)=> dragItem.current = index}
                onDragEnter={(e)=> dragOver.current = index}
                onDragEnd={handleSortDragForConversionStrategy}
                onDragOver = {(e) => e.preventDefault()} //Allows things to drag so the red stop thing wont pop up
                >
                  {item}
                
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

      {/* Events Modal */}
      <Modal show={showEventModal} onHide={closeEventModal} centered>
        <Modal.Header closeButton> </Modal.Header>

          <Modal.Body>
          <EventForm 
            handleEventChange={handleEventChange} 
            handleAnswerChange={handleAnswerChange}
            handleDistributionChange={handleEventDistributionChange} 
            answers={answers}
            selectedEvent={selectedEvent} 
            diffEvent={diffEvent}
          />
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