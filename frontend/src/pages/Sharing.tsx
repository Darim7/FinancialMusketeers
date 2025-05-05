import NavBar from '../components/NavBar';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Sharing.css';


function Sharing() {
    
const userEmail = localStorage.getItem('userEmail');
const userName = localStorage.getItem('userName');

// Current Scenario Form
const [UserScenarioForm, setUserScenarioForm] = useState<{ id: number; _id: string | null ; name: string;} | null>(null);

//Store Multiple Scenario Forms
const [UserSaveFormArray, setUserSaveFormArray] = useState<{ id: number; _id: string| null; name: string; }[]>([]);

const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null); 

//Grab user info from the backend for logged in users
const [userData, setUserData] = useState<string[] | null>(null);

const [SharingModalShow, setSharingModalShow] = useState(false); 


const [targetEmail, setTargetEmail] = useState("");

console.log("Target Email:", targetEmail);


const handleSharingModalShow = () => setSharingModalShow(true);

const handleSharingModalClose = () => setSharingModalShow(false);


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
        console.log("WHAT IS SCNEARIO", scenarios);
        setUserSaveFormArray(scenarios);
    

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


const shareScenario = async () => {
    if (!selectedScenarioId) {
        console.error("No scenario ID selected for sharing.");
        return;
    }
    try {
        const response = await axios.post('/api/share_scenario', {
            scenario_id: selectedScenarioId,
            user_email: userEmail,
            target_user_email: targetEmail
        });
        console.log("Scenario shared successfully:", response.data);
    } catch (error) {       
        console.error("Error sharing scenario:", error);
    }
};




  return (
    <div id='scenario-header'>
        <div id ='navbar'>
            <NavBar/>
        </div>
        <div id='main-content'>
            <h1>Sharing</h1>
            <Button onClick={handleSharingModalShow} variant="primary">
                + Export Scenario
            </Button>

            <Modal show={SharingModalShow} onHide={handleSharingModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Select a Scenario to Share
                    </Modal.Title>
                </Modal.Header>
                
            
                <Modal.Body>
                {userName && userEmail ? (
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

                        {UserSaveFormArray.length > 0 ? (
                            UserSaveFormArray.map((form) => (
                            <option key={form._id} value={form._id}>
                                {form.name || "Untitled Form"}
                                    </option>
                            ))
                            ) : (
                            <option value="" disabled>
                                No scenarios available
                            </option>
                                )}
                            </select>
                ) : (
                    <p>Please log in to share your scenarios.</p>
                )}
                <h4>Enter Recipient's Email:</h4>
                <input
                    type="email"
                    className="form-control"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="Enter email address"
                />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleSharingModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        shareScenario();
                        handleSharingModalClose();
                    }
                    }>
                        Share
                    </Button>
                </Modal.Footer>

            </Modal>

        </div>
    </div>
  );
}





export default Sharing;
