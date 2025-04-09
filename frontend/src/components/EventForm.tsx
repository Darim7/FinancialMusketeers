const EventForm = ({ handleEventChange, handleAnswerChange, answers, selectedEvent, diffEvent }) => {
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

            {/* Render questions based on the selected event */}
            {selectedEvent && (
                <div>
                    <h3>{selectedEvent} Questions</h3>
                    {diffEvent[selectedEvent].map(({ question, type, fields }, index) => (
                        (question === "Asset Allocation2:" && answers["Glide Path:"] !== "true") ? null : (
                            <div key={index}>
                                <label>{question}</label>

                                {/* Handle object type questions with fields */}
                                {type === "object" && fields && (
                                <div>
                                    {console.log("Fields:", fields)}
                                     {fields.every((outerArray) => outerArray.length === 0) ?  ( // Ask Copilot to check if fields are empty
                                        <p>No investments to select</p>
                                    ) : (
                                       fields.map((outerArray, outerIndex) => (
                                            outerArray.map((innerField, nestedIndex) => (
                                                <div key={nestedIndex}>
                                                    <label>
                                                        {innerField.investmentName || "Unnamed Investment"} 
                                                    </label>
                                                    <input
                                                        type = "number"
                                                        value = {answers[question]?.[innerField.investmentName] || ""}
                                                        onChange={(e) =>
                                                            handleAnswerChange(question, {
                                                                ...answers[question],
                                                                [innerField.investmentName]: e.target.value, //Ask Copilot how to save the value under the investment name
                                                            })
                                                        }
                                                    
                                                    />
                                                    
                                                </div>
                                    ))
                                ))
                            )}    
                                </div>
                                )}
                                {type === "boolean" ? (
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name={question}
                                                value="true"
                                                checked={answers[question] === "true"}
                                                onChange={(e) => handleAnswerChange(question, e.target.value)}
                                            /> True
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name={question}
                                                value="false"
                                                checked={answers[question] === "false"}
                                                onChange={(e) => handleAnswerChange(question, e.target.value)}
                                            /> False
                                        </label>
                                    </div>
                                ) : null}
                                
                                {/* Handle text or number type questions */}
                                {type === "text" || type === "number" ? (
                                    <input
                                        type={type}
                                        name={question}
                                        value={answers[question] || ""}
                                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                                    />
                                ) : null}
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventForm;
    
           
        
    
