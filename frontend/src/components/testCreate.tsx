import React from 'react';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './testCreate.css';



function CreateScenario({ formData, setSaveForms }) {
    const [localData, setLocalData] = useState(formData);

     const [values, setValues] = useState({
        scenarioName : '',
        
        
      })


    useEffect(() => {
        console.log('formData:', formData);
        setValues({
        scenarioName: formData.scenarioName || '',
       
       
            
        });
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const newScenario = { 
            id: Date.now(),  // Unique ID based on timestamp
            name: values.scenarioName || '',  // Set name from input
           
        };

    
        // Update 'values' state based on user input
        setValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
    
        // Update 'formData' state to keep it in sync
        setSaveForms((prevForms) =>
          prevForms.map((form) =>
            form.id === formData.id ? { ...form, [name]: value } : form
          )
        );
      };
      





    // useEffect(() => {
    //     setLocalData(formData);
    // }, [formData]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setLocalData((prev) => ({ ...prev, [name]: value }));

    //     // Update the correct form in the savedForms list
    //     setSaveForms((prevForms) =>
    //         prevForms.map((form) =>
    //             form.id === formData.id ? { ...form, [name]: value } : form
    //         )
    //     );
    // };

    return (
        <form>


        <label htmlFor="scenario-name"> Scenario Name:</label> 
        <input // Type of data
              type= "text"  // Input text format
              name ="scenarioName"  // Name of the input
              value={values.scenarioName}
              onChange={(e)=> handleChange(e)}
              
            />
        
       

        
          
            {/* <input // Type of data
            type= "text"  // Input text format
            name ="scenarioName"  // Name of the input
            placeholder='Scenario Name' */}
            {/* /> */}

            {/* <input
                type="text"
                name="name"
                value={localData.name}
                onChange={handleChange}
                placeholder="Scenario Name"
            /> */}




            {/* <textarea
                name="details"
                value={localData.details}
                onChange={handleChange}
                placeholder="Details"
            ></textarea> */}
        </form>
    );
}

export default CreateScenario;