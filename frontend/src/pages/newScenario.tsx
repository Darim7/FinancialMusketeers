import React from 'react';
import './Overview.css';
import './Scenario.css';
import CreateScenario from '../components/CreateScenario';
import NavBar from '../components/NavBar';
import { useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Page1 from '../components/page1';
import { CreateScenarioData } from '../components/scenarioData';


function NewScenario() {
      const [show, setShow] = useState(false);
      const [scenarioSaved, setScenarioSaved] = useState(false);
      
  
  
      //Store Multiple Scenario Forms
      const [saveForms, setSaveForms] = useState<{ id: number; name: string; }[]>([])
  
      //Current Scenario Form
      const [scenarioForm, setScenarioForm] = useState<{ id: number; name: string;} | null>(null);
      
  
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
  
  
      const handleCreateNew = () => {
          const newScenario = {id: Date.now(), name: ''};
  
          setSaveForms((prev) => [...prev, newScenario]); // Store the form user just created 
            
          setScenarioForm(newScenario);  // New form 
              
          
          handleShow();
      };
    
  
      
    const handleViewForm = (form) => { 
        setScenarioForm(form);
        handleShow();
    };

  return (
    <div className='scenario'>
     <NavBar/>
     <div className='main-content'>
                {/* Export form: YAML File */}
                <Button  variant = "primary">
                  + Export
                </Button>

                <Button  variant = "primary">
                  + Import
                </Button>

                <Button variant="primary" onClick={handleCreateNew}>
                    + Create New
                </Button>

                {/* <Button variant="primary" onClick={handleShow}>
                    + Create New
                </Button> */}
            </div>

      {scenarioSaved && (
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

      {/* Modal Component */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Scenario</Modal.Title>

        </Modal.Header>


    <Modal.Body>
        {scenarioForm && (
            <Page1
            formInfo={scenarioForm}
            saveForms={setSaveForms}/>
        )}         

    </Modal.Body>
        
        <Modal.Footer>
            <Button variant="secondary" onClick={() => {handleClose(); setScenarioSaved(true); }}>
                Save
            </Button>
                
            </Modal.Footer> 



      </Modal>
    </div>
  );
}

export default NewScenario;