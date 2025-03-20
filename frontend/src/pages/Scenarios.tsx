// Scenario 
import React from 'react';
import './Overview.css';
import './Scenario.css';
// import CreateScenario from '../components/CreateScenario';
import NavBar from '../components/NavBar';
import { useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import CreateScenario from '../components/testCreate'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Prev } from 'react-bootstrap/esm/PageItem';



function Scenario() {

    const [show, setShow] = useState(false);

    //Store Multiple Scenario Forms
    const [saveForms, setSaveForms] = useState<{ id: number; name: string; details: string; }[]>([])

    //Current Scenario Form
    const [scenarioForm, setScenarioForm] = useState<{ id: number; name: string; details: string; } | null>(null);
    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCreateNew = () => {
        const newScenario = {id: Date.now(), name: ''};
        
        setSaveForms((prev) => [...prev, newScenario]); // Store previous forms
        setScenarioForm(newScenario); // Set the new form as active
        handleShow();
    };

    const handleViewForm = (form) => {
        setScenarioForm(form);
        handleShow();
    };

    console.log(scenarioForm);
    return (
        
        <div className='scenario'>
            <NavBar/>
       
           <div className='main-content'>
                <Button variant="primary" onClick={handleCreateNew}>
                    + Create New
                </Button>
            </div>

            {/* If another form exists */}
            {saveForms.length > 0 && (
            
                <div className='scenario-header'>
                    <h3>Scenario Forms:</h3>
                    {saveForms.map((form) => (
                        <Button key={form.id} 
                            variant="outline-primary" 
                            onClick={() => handleViewForm(form)}>
                            {form.name || "Untitled Form"}
                        </Button>
                    ))}

                </div>
            )} 

           
            <Modal show={show} onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {/* If there exist a scenario: Edit, Else: Create */}
                        {scenarioForm ? "Edit Scenario" : "Create Scenario"}

                        </Modal.Title>

                </Modal.Header>

                
                <Modal.Body>
                
                    {scenarioForm && (
                        
                        <CreateScenario
                           formData={scenarioForm}
                           setSaveForms={setSaveForms}/>
                    )}
                    
                </Modal.Body> 
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}> 
                        Save
                    </Button>
                
                </Modal.Footer> 
            </Modal>
        </div>

    );
}









export default Scenario;  
