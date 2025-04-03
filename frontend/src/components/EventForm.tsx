

const EventForm = ({handleEventChange, handleAnswerChange,answers,selectedEvent, diffEvent, index }) => {
    return (
        <div className='event-page'>
            <h3>Events</h3>
            
            <label htmlFor="type-of-event"> Type of Event:</label>
            <select
                id = "typeOfEvents"
                name = "typeOfEvents"
                onChange={handleEventChange} value={selectedEvent}>

                <option value="">-- Choose an Event --</option>
                {Object.keys(diffEvent).map((event) => (
                <option key={event} value={event}>{event.slice(0)}</option>
                ))}
            </select>

            {selectedEvent && (
            <div>
                <h3>{selectedEvent} Questions</h3>
                {/* Asked ChatGPT on how to map diff questions depends on the event user selects */}
                    {diffEvent[selectedEvent].map(({ question, type}, index) => (
                    <div key={index}>
                    <label>
                        {question}
                    </label>
                        
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
                            />False
                        </label>
                </div>
                        ): type === "text" || type === "number" ? (
                        <input

                        type={type}
                        value={answers[question] || ""}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        />
                    ) : null}
                </div>
                
            ))}
             </div>
        
        )}
            </div>
        );
    };
            
    
    export default EventForm;