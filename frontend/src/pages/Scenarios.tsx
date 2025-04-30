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
    const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null); 
    
    //Store Multiple Scenario Forms
    const [saveFormArray, setSaveFormArray] = useState<{ id: number; _id: string| null; name: string; }[]>([]);
    console.log("what is saveFormArray", saveFormArray);
  

    //Current Scenario Form
    const [scenarioForm, setScenarioForm] = useState<{ id: number; _id: string | null ; name: string;} | null>(null);
    
    //User Data
    const [userData, setUserData] = useState<string[] | null>(null);

    //Get User Scenario 
    const [usrScenario, setUsrScenario] = useState(null);

    //Fetch User Scenarios
    const [fetchUserScenarios, setFetchUserScenarios] = useState<any[]>([]);

    // const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleExportModalShow = () => setExportModalShow(true);

    const handleCreateNew = () => {
        const newScenario = { 
            id: Date.now(), 
            _id : null,
            name: '', };
        setScenarioForm(newScenario);
        setSaveFormArray((prev) => [...prev, newScenario]);
        
        handleShow();
    };
    
    const handleClose = () => setShow(false);
    const handleExportModalClose = () => setExportModalShow(false);
    
    const handleViewForm = (form: React.SetStateAction<{ id: number; _id: string | null; name: string; } | null>) => {
        console.log("what is form", form);
        console.log("what is the name", form?.name);
        setScenarioForm(form);
        console.log("what is the scenario form", scenarioForm);
        console.log("what is saveFormArray", saveFormArray);
        handleShow();
    };

    const handleDeleteForm = (id: number) => {
        setSaveFormArray((prevForms) => prevForms.filter((form) => form.id !== id));
    };

    const getUser = async () => {
        try {
          const response = await axios.get('/api/get_user', {
            params: {
              user_email: userEmail,
              user_name: userName
            }
          });
      
            const userData = response.data;
            // const userDataArray = userData.data.scenarios;
            const userDataArray = userData.data.scenarios || [];
            console.log("User Data Array:", userDataArray);
            setUserData(userDataArray);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
    
    useEffect(() => {
        if (userEmail && userName) {
          getUser();
        }
      }, [userEmail, userName]);

    console.log("User Data:", userData);


    const getScenario = async () => {
        if (!userData || userData.length === 0) {
            console.error("No scenario IDs found in userData.");
            return;
        }
    
        try {
            // Asked ChatGPT: How do I loop through user scenario IDs and fetch data from the backend?
            const scenarioPromises = userData.map(async (scenario) => {
            const response = await axios.post('/api/get_scenario', { _id: scenario });
            return response.data.data;
            });
    
            const scenarios = await Promise.all(scenarioPromises);
            setFetchUserScenarios(scenarios);
          

        } catch (err) {
            console.error("Error fetching scenarios:", err);
        }
    };
    useEffect(() => {
        console.log("what the heck is userdata.scenario", userData?.length);
        if (userData && userData.length > 0) {
            getScenario();
        }
    }, [userData]);

    useEffect(() => {
        console.log("Fetch User Scenarios:", fetchUserScenarios);
    }, [fetchUserScenarios]);
    
    console.log("Fetch Scenarios:", fetchUserScenarios);
      
    
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
                
                const data = response.data;
                const userScenarios = data.data.scenarios;
                const userScenarioArray = userScenarios.length === 1 ? userScenarios[0] : userScenarios[userScenarios.length - 1];
            

                console.log("User Data:", data); 

                setUsrScenario(userScenarios);

                setScenarioForm((prevForm) =>
                    prevForm ? { ...prevForm, _id: userScenarioArray } : prevForm
                );
                
                // Update the object_id in saveFormArray
                setSaveFormArray((prevForms) =>
                    prevForms.map((form, index) =>
                        index === array_len - 1
                            ? { ...form, _id: userScenarioArray}
                            : form
                    )
                );
                console.log("Scenario added successfully:", response.data);
            } catch (error) {
                console.error("Error adding scenario:", error);
            }
        }
    };
    
    useEffect(() => {
        console.log("User Scenario:", usrScenario);
    }, [usrScenario]);

    useEffect(() => {
        console.log("Updated Scenario Form:", scenarioForm);
    }, [scenarioForm]);
    
    useEffect(() => {
        console.log("Updated Save Form Array:", saveFormArray);
    }, [saveFormArray]);

    console.log("SAVE FORM ARRAY", saveFormArray)

    const updateScenario = async () => {
        if (userEmail != null && scenarioForm) {
            // If user log back in and their data come from fetchUserScenarios, then the saveFormArray will be empty
            // and the scenarioForm will be the last form that was saved
            const array_len = saveFormArray.length;
            const array = saveFormArray[array_len - 1];
            // console.log("what is _id", scenarioForm?._id);
            try {
                const response = await axios.post('/api/update_scenario', {
                    'scenario': array,
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
        const selectedScenario =
            saveFormArray.find((form) => form.id === scenarioId) ||
            fetchUserScenarios.find((form) => form._id === scenarioId);

        console.log("WHAT IS SELECTED SCENARIO", fetchUserScenarios);
        console.log("WHAT IS SAVE FORM ID", saveFormArray);

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
    
            // Ask ChatGPT for help for this: 
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
        // Ask ChatGPT for help for this:
        // Create a file input element 
        const input = document.createElement('input');
        // Only allow YAML files
        input.type = 'file';
        input.accept = '.yaml, .yml';

        // Take the first file from user
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            console.log("what is the file", file);
    
            if (file) {
                // Read the file content
                // const fileRead = new FileReader();
                const formData = new FormData();
                formData.append('file', file);
                formData.append('user_email', userEmail || "");
                formData.append('user_name', userName || "");
                console.log("what is the form data", formData);
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                  }
                // fileRead.onload = async (e) => {
                //     const content = e.target?.result;
                    try {
                        const response = await axios.post('/api/import_scenario', 
                        formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }

                        );
                            console.log("Imported scenario:", response.data);

                            alert("Scenario imported successfully!");

                        } catch (error) {
                            console.error("Error importing scenario:", error);
                            alert("Failed to import scenario.");
                        }
                    
                };
            }
        
        input.click();
    
        

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
                            {fetchUserScenarios.length > 0 || saveFormArray.length > 0 ? (
                            <div>
                                <select
                                className="form-select"
                                value={selectedScenarioId || ''} // Set the selected value
                                onChange={(e) => {
                                    console.log("Selected Scenario ID:", e.target.value)
                                    setSelectedScenarioId(e.target.value)
                                }} // Will know which scenario to export, base on num
                                >
                                <option value="" disabled>
                                    Select a Scenario
                                </option>
                                
                                {fetchUserScenarios.map((form) => (
                                    <option key={form._id} value={form._id}>
                                        {form.name || "Untitled Form"}
                                    </option>
                                ))}

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
                                        exportYAML(Number(selectedScenarioId));
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
                {fetchUserScenarios && fetchUserScenarios.length > 0 && (
                    fetchUserScenarios.map((form) => (
                    <Button
                        key={form._id}
                        variant="outline-primary"
                        onClick={() => handleViewForm(form)}>
                        {form.name || "Untitled Form"}
                    </Button>
                    ))
                )}

                {saveFormArray.map((form) => (
                    <Button 
                        key={form.id} 
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
                if (scenarioForm?._id) {
                    // Update the scenario if it has an object_id
                    updateScenario();
                } else {
                    // Add a new scenario if it does not have an object_id
                    addScenario();
                }
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
