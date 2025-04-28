// Scenario 
import React from 'react';
import './Overview.css';
import './Scenario.css';
// import CreateScenario from '../components/CreateScenario';
import NavBar from '../components/NavBar';
import { useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateScenario from '../components/scenarioData';
import axios from 'axios';


function Scenario() {

    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    console.log("userEmail", userEmail);
    
    const [show, setShow] = useState(false);
    const [scenarioSaved, setScenarioSaved] = useState(false);
    const [exportModalShow, setExportModalShow] = useState(false); 
    const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null); 
    
    //Store Multiple Scenario Forms
    const [saveFormArray, setSaveFormArray] = useState<{ id: number; name: string; }[]>([])
    console.log("what is saveFormArray", saveFormArray);
  

    //Current Scenario Form
    const [scenarioForm, setScenarioForm] = useState<{ id: number; name: string;} | null>(null);
    
    //User Data
    const [userData, setUserData] = useState(null); 

    //Get User Scenario 
    const [usrScenario, setUsrScenario] = useState(null);

    // const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleExportModalShow = () => setExportModalShow(true);

    const handleCreateNew = () => {
        const newScenario = { id: Date.now(), name: '', };
        setScenarioForm(newScenario);
        setSaveFormArray((prev) => [...prev, newScenario]);
        
        handleShow();
    };
    
    const handleClose = () => setShow(false);
    const handleExportModalClose = () => setExportModalShow(false);
    
    const handleViewForm = (form: React.SetStateAction<{ id: number; name: string; } | null>) => {
        setScenarioForm(form);
        handleShow();
    };

    const handleDeleteForm = (id: number) => {
        setSaveFormArray((prevForms) => prevForms.filter((form) => form.id !== id));
    };

    // const getUser = async () => {
    //     if(userEmail != null){
    //         try {
    //             const response = await fetch(`/api/get_user?user_email=${userEmail}&user_name=${userName}`, {
    //                 method: 'GET', 
    //             });
        
    //             const data = await response.json();
    //             setUserData(data.data._id)
    //             }
    //         catch (error) {
    //                 console.error("Error getting user:", error);
    //         }
    //     }
    // }

    // useEffect(() => {
    //     getUser();  // Call getUser function
    // }, []); 

    // console.log("what is user data", userData)
   
    // // If there are existing user scenario, grab it and display it on the scenario page
    // // Check if user is logged in 
    // const getUserScenario = async () => {
    //     if(userEmail != null){
    //         try {
    //             console.log("GET USER SCENARIO", userData)
    //             const response = await fetch(`/api/get_scenario?_id=${userData}`, {
    //                 method: 'GET',
    //             });
    //             const data = await response.json();
    //             setUsrScenario(data)
    //         }
    //         catch (error) {
    //             console.error("Error getting user scenario:", error);
    //         }
    //     }
    // }

    // useEffect(() => {
    //     getUserScenario();  // Call getUser function
    // }, []); 
    const getUser = async () => {
        if (userEmail != null) {
            try {
                const response = await fetch(`/api/get_user?user_email=${userEmail}&user_name=${userName}`, {
                    method: 'GET',
                });
    
                const data = await response.json();
                // Store the full user data (not just the _id)
                setUserData(data.data); 
            } catch (error) {
                console.error("Error getting user:", error);
            }
        }
    }
    
    // const getUserScenario = async () => {
    //     if (userEmail != null) {
    //         try {
    //             console.log("GET USER SCENARIO", userData);  // Debugging: Check what userData is
    
    //             // Send the userData (_id) in the body of the POST request
    //             const response = await fetch('/api/get_scenario', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json', // Ensure you're sending JSON
    //                 },
    //                 body: JSON.stringify({
    //                     _id: userData,  // Sending _id as part of the JSON body
    //                 })
    //             });
    
    //             // Parse the response JSON
    //             const data = await response.json();
    
    //             // Handle the data (you might want to set it to your state)
    //             setUsrScenario(data);
    //         } catch (error) {
    //             console.error("Error getting user scenario:", error);
    //         }
    //     }
    // };
    
    
    // useEffect(() => {
    //     getUser();  // Call getUser function to set userData when the component mounts
    // }, []);  // Only run once when the component is first mounted
    
    // useEffect(() => {
    //     if (userData) {
    //         getUserScenario();  // Call getUserScenario only if userData is set
    //     }
    // }, [userData]);  // This effect runs whenever userData changes
    
    console.log("what is user data", userData);
    


    // Adding user scenarios to the backend
    // If user is not logged in, then their information will not sent to the backend
    const addScenario = async () => {
        if (userEmail != null) {  
            const array_len = saveFormArray.length;
            const array = saveFormArray[array_len - 1];
          
            try {
                const response = await axios.post('/api/add_scenario', {
                    user_name: userName,
                    user_email: userEmail,
                    scenario: array
                });
                  
                console.log("Scenario added successfully:", response.data);
            } catch (error) {
                console.error("Error adding scenario:", error);
            }
        }
    };

    const updateScenario = async () => {
        if (userEmail != null) {
            const array_len = saveFormArray.length;
            const array = saveFormArray[array_len - 1];
            try {
                const response = await axios.post('/api/update_scenario', {
                    user_name: userName,
                    user_email: userEmail,
                    scenario: array
                });
                console.log("Scenario updated successfully:", response.data);
            } catch (error) {
                console.error("Error updating scenario:", error);
            }
        }
    };
    

    // Export YAML File
    const exportYAML = async (scenarioId: number) => {
       
        // Find the selected scenario in saveFormArray
        const selectedScenario = saveFormArray.find((form) => form.id === scenarioId);
        if (!selectedScenario) {
            alert("Selected scenario not found!");
            return;
        }
    
        try {
            // Convert the selected scenario object to a JSON string and encode it as a query parameter
            const queryParams = new URLSearchParams({
                scenario: JSON.stringify(selectedScenario),
            });
    
        
            console.log("Exporting scenario:", selectedScenario);
            console.log("Query parameters:", queryParams.toString());
    

            const response = await fetch('/api/export_scenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({scenario: selectedScenario}),
            });
            
    
            if (!response.ok) {
                throw new Error(`Failed to export scenario: ${response.statusText}`);
            }
    
            // Get the YAML file as a blob
            const blob = await response.blob();
    
            // Create a download link for the file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedScenario.name || 'scenario'}.yaml`; // Use the scenario name or a default name
            a.click();
            window.URL.revokeObjectURL(url); // Clean up the URL object
    
            alert("Scenario exported successfully!");
        } catch (error) {
            console.error("Error exporting scenario:", error);
            alert("Failed to export scenario.");
        }
    };

    // Import YAML File
     const importYAML = async () =>{
        

     }


    return ( 
        <div id='scenario-header'>
            <div id ='navbar'>
                <NavBar/>
            </div>
           <div id='main-content'>
                <div id = "scenario-buttons">
                    <Button onClick={handleExportModalShow} variant="primary">
                      + Export Scenario
                    </Button>

                    <Modal show={exportModalShow} onHide={handleExportModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Select a Scenario to Export
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {saveFormArray.length > 0 ? (
                            <div>
                                <select
                                className="form-select"
                                value={selectedScenarioId || ''} // Set the selected value
                                onChange={(e) => setSelectedScenarioId(Number(e.target.value))} // Update the selected scenario ID
                                >
                                <option value="" disabled>
                                    Select a Scenario
                                </option>
                                {saveFormArray.map((form) => (
                                    <option key={form.id} value={form.id}>
                                        {form.name || "Untitled Form"}
                                    </option>
                                ))}
                            </select>
                            </div>
                            ) : (
                                <p>No scenarios available to export.</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleExportModalClose}>
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    if(selectedScenarioId){
                                        exportYAML(selectedScenarioId);
                                        // Handle export logic here using selectedScenarioId
                                        console.log("Exporting scenario with ID:", selectedScenarioId);
                                        handleExportModalClose();
                                    }
                                
                                }}>
                                Export
                            </Button>
                        </Modal.Footer>


                    </Modal>
                    <Button onClick={importYAML} variant = "primary">
                    + Import
                    </Button>
                    <Button variant="primary" onClick={handleCreateNew}>
                        + Create New
                    </Button>
                </div>
        
            
            <div id='scenario-header-content'>
                <h3>Scenario Forms:</h3>
                {saveFormArray.map((form) => (
                    <Button key={form.id} 
                        variant="outline-primary" 
                        onClick={() => handleViewForm(form)}>
                        {form.name || "Untitled Form"}
                        </Button>
                    ))}
           
            </div>

            </div>
            {/* </div> */}
            
            
            
            <Modal show={show} onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit Scenario
                    </Modal.Title>

                </Modal.Header>

            <Modal.Body>
            {scenarioForm && (
                <CreateScenario
                formInfo={scenarioForm}
                userEmail={userEmail}
                saveForms={setSaveFormArray}
                
            />
        )}        
            </Modal.Body> 

        <Modal.Footer>
            <Button 
                variant="success"
                onClick={() => {
                handleClose(); 
                setScenarioSaved(true); 
                console.log("Scenario Form ID:", scenarioForm?.id);
                console.log("Scenario Form Name:", scenarioForm?.name);
                if (scenarioForm?.id) {
                    // console.log("Scenario Form ID:", scenarioForm.id);
                    // console.log("Scenario Form Name:", scenarioForm.name);
                    updateScenario();
                } else {
                    addScenario();
                }
                addScenario();
            }}>
                Save
            </Button>
            {scenarioForm && (

            <Button
                variant="danger"
                onClick={() => {
                handleDeleteForm(scenarioForm.id); 
                handleClose();  }}>
                Delete
        </Button>
    )}
            </Modal.Footer> 

            </Modal>
        </div>
          
        
        
    );
}




export default Scenario;  
