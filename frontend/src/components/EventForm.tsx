import DistributionForm from "./DistributionForm";

const EventForm = ({ handleEventChange, handleAnswerChange, handleDistributionChange, answers, selectedEvent, diffEvent }:any) => {
    return (
        <div className="event-page">
            <h3>Events</h3>

            {/* Dropdown to select the type of event */}
            <label htmlFor="type-of-event">Type of Event:</label>
            <select
                id="typeOfEvents"
                name="typeOfEvents"
                onChange={handleEventChange}
                value={selectedEvent}
            >
                <option value="">-- Choose an Event --</option>
                {Object.keys(diffEvent).map((event) => (
                    <option key={event} value={event}>
                        {event}
                    </option>
                ))}
            </select>
            {/* {console.log(diffEvent[selectedEvent])} */}
            {/* Render questions based on the selected event */}
            {selectedEvent && (
                <div>
                    <h3>{selectedEvent} Questions</h3>
                    
                    {diffEvent[selectedEvent].map(({ question, type, fields, name }:any, index:any) => (
                        (question === "Asset Allocation2:" && (answers["glidePath"] !== "true") ) ? null : ( 
                            <div key={index}>
                                <label>{question}</label>

                                {/* Handle object type questions with fields */}

                                {type === "object" && fields && (
                                <div>
                                     {fields.every((outerArray:any) => outerArray.length === 0) ?  ( // Ask Copilot to check if fields are empty
                                        <p>No investments to select</p>
                                    ) : (
                                       fields.map((outerArray:any, outerIndex:number) => (
                                            outerArray.map((innerField:any, nestedIndex:number) => (
                                                <div key={nestedIndex}>
                                                    <label>
                                                        {innerField.id || "Unnamed Investment"} 
                                                    </label>
                                                    <input
                                                        type = "number"
                                                        value = {answers[question]?.[innerField.id] || ""}
                                                        onChange={(e) =>{
                                                            console.log(`Field Target Value: ${e.target.value}, answers[question]: ${answers[question]}, innerfield.name: ${innerField.id}`)
                                                            console.log("Answers: ", answers)
                                                            console.log("Answer Question: ", answers[question])
                                                            console.log("TEST:", answers['assetAllocation'])
                                                            console.log(`Answer Name: ${name}, Question: ${question}`)
                                                            handleAnswerChange(question, {
                                                                ...answers[question],
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
                                        <label>
                                            <input
                                                type="radio"
                                                name={question}
                                                value="true"
                                                checked={answers[name] === "true"}
                                                onChange={(e) => handleAnswerChange(name, e.target.value)}
                                            /> True
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name={question}
                                                value="false"
                                                checked={answers[name] === "false"}
                                                onChange={(e) => handleAnswerChange(name, e.target.value)}
                                            /> False
                                        </label>
                                    </div>
                                ) : null}

                                {type === "select" ? (
                                    <div>
                                        <select 
                                            name={question}
                                            value={answers[name] || ""}
                                            onChange={(e) => handleAnswerChange(name, e.target.value)}
                                            >
                                            <option disabled value=""> -- select an option -- </option>
                                            <option value="amount">amount</option>
                                            <option value="percent">percent</option>
                                        </select>
                                           
                                    </div>
                                ): null}
                                {/* Handle text or number type questions */}
                                {type === "text" || type === "number" ? (
                                    <input
                                        type={type}
                                        name={question}
                                        value={answers[name] || ""}
                                        onChange={(e) => handleAnswerChange(name, e.target.value)}
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
    
           
        
    
