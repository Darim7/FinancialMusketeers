import DistributionForm from "./DistributionForm";
import Form from "react-bootstrap/Form"

const EventForm = ({ handleEventChange, handleAnswerChange, handleDistributionChange, answers, selectedEvent, diffEvent }:any) => {
    return (
        <div className="event-page">
            <h3>Events</h3>

            {/* Dropdown to select the type of event */}
            <Form.Label htmlFor="type-of-event">Type of Event:</Form.Label>
            <Form.Select
                id="typeOfEvents"
                name="typeOfEvents"
                onChange={handleEventChange}
                value={selectedEvent}
            >
                <option value="" disabled>Choose an Event</option>
                {Object.keys(diffEvent).map((event) => (
                    <option key={event} value={event}>
                        {event}
                    </option>
                ))}
            </Form.Select>
           
            {/* Render questions based on the selected event */}
            
            {selectedEvent && (
                console.log("Selected Event: HEREE ", selectedEvent),
                <div>
                    <h3>{selectedEvent} Questions</h3>
                    {console.log("diff event: WTTTT", diffEvent[selectedEvent])}
                    {/* {console.log("UGGGGG:", diffEvent['Event'])}  */}
                    
                    {diffEvent[selectedEvent].map(({ question, type, fields, name }:any, index:any) => (
                        (question === "Asset Allocation2:" && (answers["glidePath"] !== "true") ) ? null : ( 
                            <div key={index}>
                                <Form.Label>{question}</Form.Label>

                                {/* Handle object type questions with fields */}

                                {type === "object" && fields && (
                                <div>
                                     {fields.every((outerArray:any) => outerArray.length === 0) ?  ( // Ask Copilot to check if fields are empty
                                        <p>No investments to select</p>
                                    ) : (
                                       fields.map((outerArray:any, outerIndex:number) => (
                                            outerArray.map((innerField:any, nestedIndex:number) => (
                                                <div key={nestedIndex}>
                                                    <Form.Label>
                                                        {innerField.id || "Unnamed Investment"} 
                                                    </Form.Label>
                                                    <Form.Control
                                                        type = "number"
                                                        value = {answers[name]?.[innerField.id] || ""}
                                                        onChange={(e) =>{
                                                            console.log(`Field Target Value: ${e.target.value}, answers[question]: ${answers[name]}, innerfield.name: ${innerField.id}`)
                                                            console.log("Answers: ", answers)
                                                            console.log("Answer Question: ", answers[name])
                                                            console.log("TEST:", answers['assetAllocation'])
                                                            console.log(`Answer Name: ${name}, Question: ${question}`)
                                                            handleAnswerChange(e,name, {
                                                                ...answers[name],
                                                                // [innerField.name]: e.target.value, //Ask Copilot how to save the value under the investment name
                                                                [innerField.id]: e.target.value, //Ask Copilot how to save the value under the investment name

                                                               
                                                            })
                                                        }
                                                            
                                                            
                                                        }
                                                        
                                                    
                                                    />
                                                </div>
                                        ))
                                    ))
                            )}    
                                </div>
                                )}
                               
                                {/* Handle boolean type questions */}
                                {type === "boolean" ? (
                                    
                                    <div>
                                       <Form.Check
                                            type="checkbox"
                                            name={question}
                                            value="true"
                                            checked={answers[name] === "true"}
                                            onChange={(e) => handleAnswerChange(e, name, e.target.value)}
                                            label="True"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            name={question}
                                            value="false"
                                            checked={answers[name] === "false"}
                                            onChange={(e) => handleAnswerChange(e, name, e.target.value)}
                                            label="False"
                                        /> 
                                    </div>
                                ) : null}

                                {type === "select" ? (
                                    <div>
                                        <Form.Select 
                                            name={question}
                                            value={answers[name] || ""}
                                            onChange={(e) => handleAnswerChange(e, name, e.target.value)}
                                        >
                                            <option disabled value="">Select an option</option>
                                            <option value="amount">amount</option>
                                            <option value="percent">percent</option>
                                        </Form.Select>
                                           
                                    </div>
                                ): null}
                                {/* Handle text or number type questions */}
                                {type === "text" || type === "number" ? (
                                    <Form.Control
                                        type={type}
                                        name={question}
                                        value={answers[name] || ""}
                                        onChange={(e) => handleAnswerChange(e, name, e.target.value)}
                                    />
                                ) : null}
                                {/* Handle distribution questions */}
                                {type === "distribution" ? (
                                    <DistributionForm
                                        name={name}
                                        text={""}
                                        distribution={answers[name] || {type:""}}
                                        handleChange={handleDistributionChange}
                                        field={name}
                                    />
                                ) : null }
                            </div>
                            
                        )
                    
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventForm;
    
           
        
    
