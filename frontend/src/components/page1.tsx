
const Page1 = ({ values, setValues, states, handleChanges, index }:any) => {
  return (
    
    <div className="label-container">
      <label htmlFor="scenario-name">Scenario Name:</label>
      <input
        type="text"
        name="scenarioName"
        value={values.scenarioName || ''}
        onChange={(e) => handleChanges(e, index)}
      />

      <label htmlFor="state-of-residence">State of Residence:</label>

      <select
        id="states"
        name="residenceState"
        value={values.residenceState || ''} // Reflects the saved state
        onChange={(e) => handleChanges(e, index)}
      >
        <option value="">Select a state</option>
        {states.map((state:any) => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </select> 
      
        
      <label htmlFor="retirement-age">Retirement Age:</label>
      <input
        type="number"
        min="0"
        name="retirementAge"
        value={values.retirementAge || ''}
        onChange={(e) => handleChanges(e, index)}
      />

      <label htmlFor="financial-goal">Financial Goal:</label>
      <input
        type="number"
        min="0"
        name="financialGoal"
        value={values.financialGoal || ''}
        onChange={(e) => handleChanges(e, index)}
      />

      <label htmlFor="marital-status">Marital Status:</label>
      <input
        type="radio"
        id="Individual"
        name="maritalStatus"
        value="Individual"
        checked={values.maritalStatus === 'Individual'}
        onChange={(e) => handleChanges(e, index)}
      />{' '}
      Individual
      <input
        type="radio"
        id="Couple"
        name="maritalStatus"
        value="couple"
        checked={values.maritalStatus === 'couple'}
        onChange={(e) => handleChanges(e, index)}
      />{' '}
      Couple

      <label htmlFor="birth-year">Birth Year:</label>
      <input
        type="number"
        min="1900"
        max={new Date().getFullYear()}
        name="birthYear1"
        value={values.birthYear1 || ''}
        onChange={(e) => handleChanges(e, 0)}
        maxLength={4}
       
      />

      {values.maritalStatus === 'couple' && (
        <>
          <label htmlFor="spouse-birth-year">Spouse Birth Year:</label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            name="birthYear2"
            value={values.birthYear2 || ''}
            onChange={(e) => handleChanges(e, 1)}
            maxLength={4}
          />
        </>
      )} 
    </div>
  );
};

export default Page1;