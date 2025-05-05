import Form from 'react-bootstrap/Form';

const Page1 = ({ values, setValues, states, handleChanges, index }:any) => {
  return (
    
    <div className="label-container">
      <Form.Label htmlFor='scenario-name'>Scenario Name:</Form.Label>
      <Form.Control
        type="text"
        name="name"
        value={values.name || ''}
        onChange={(e) => handleChanges(e, index)}
        
      />

      <Form.Label htmlFor="state-of-residence">State of Residence:</Form.Label>
      <Form.Select
        id="states"
        name="residenceState"
        value={values.residenceState || ''} // Reflects the saved state
        onChange={(e) => handleChanges(e, index)}
      >
        <option value="" disabled>Select a state</option>
        {states.map((state:any) => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </Form.Select>
      
      <Form.Label htmlFor="financial-goal">Financial Goal:</Form.Label>
      <Form.Control
        type="number"
        min="0"
        name="financialGoal"
        value={values.financialGoal || ''}
        onChange={(e) => handleChanges(e, index)}
      />

      <Form.Label htmlFor="marital-status">Marital Status:</Form.Label>
      <Form.Check 
        type='checkbox'
        id="Individual"
        name="maritalStatus"
        value="Individual"
        checked={values.maritalStatus === 'Individual'}
        onChange={(e) => handleChanges(e, index)}
        label="Individual"
      />
      <Form.Check 
        type='checkbox'
        id="Couple"
        name="maritalStatus"
        value="couple"
        checked={values.maritalStatus === 'couple'}
        onChange={(e) => handleChanges(e, index)}
        label="Couple"
      />

      <Form.Label htmlFor="birth-year">Birth Year:</Form.Label>
      <Form.Control
        type="number"
        min="1900"
        max={new Date().getFullYear()}
        name="birthYear1"
        value={values.birthYears[0] || ''}
        onChange={(e) => handleChanges(e, 0)}
        maxLength={4}
      />

      {values.maritalStatus === 'couple' && (
        <>
          <Form.Label htmlFor="spouse-birth-year">Spouse Birth Year:</Form.Label>
          <Form.Control
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            name="birthYear2"
            value={values.birthYears[1] || ''}
            onChange={(e) => handleChanges(e, 1)}
            maxLength={4}
          />
        </>
      )} 
    </div>
  );
};

export default Page1;