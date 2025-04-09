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
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateScenario from '../components/scenarioData';



function Scenario() {

    const userEmail = localStorage.getItem('userEmail');
    
    const [show, setShow] = useState(false);
    const [scenarioSaved, setScenarioSaved] = useState(false);
    
    //Store Multiple Scenario Forms
    const [saveFormArray, setSaveFormArray] = useState<{ id: number; name: string; }[]>([])

    //Current Scenario Form
    const [scenarioForm, setScenarioForm] = useState<{ id: number; name: string;} | null>(null);
    

    // const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCreateNew = () => {
        const newScenario = { id: Date.now(), name: '' };
        setScenarioForm(newScenario);
        setSaveFormArray((prev) => [...prev, newScenario]);
        handleShow();
    };
    
    const handleClose = () => setShow(false);
    
    
    const handleViewForm = (form: React.SetStateAction<{ id: number; name: string; } | null>) => {
        setScenarioForm(form);
        handleShow();
    };

    const handleDeleteForm = (id: number) => {
        setSaveFormArray((prevForms) => prevForms.filter((form) => form.id !== id));
    };


    // Export YAML File
    const exportYAML = async () =>{
    }

     // Import YAML File
     const importYAML = async () =>{
     }


    return (
        <div className='scenario'>
            <NavBar/>
       
           <div className='main-content'>
                {/* Export form: YAML File */}
                <Button onClick={exportYAML} variant = "primary">
                  + Export
                </Button>

                <Button onClick={importYAML} variant = "primary">
                  + Import
                </Button>

                <Button variant="primary" onClick={handleCreateNew}>
                    + Create New
                </Button>

            </div>

            <div className='scenario-header'>
                <h3>Scenario Forms:</h3>
                {saveFormArray.map((form) => (
                    <Button key={form.id} 
                        variant="outline-primary" 
                        onClick={() => handleViewForm(form)}>
                        {form.name || "Untitled Form"}
                        </Button>
                    ))}
            </div>
            
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
                saveForms={setScenarioSaved}
                userEmail={userEmail}
            />
        )}        
            </Modal.Body> 

        <Modal.Footer>
            <Button 
                variant="success"
                onClick={() => {handleClose(); 
                setScenarioSaved(true); }}>
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
