import Form from 'react-bootstrap/Form'

const DistributionForm = ({name, text, field, distribution, handleChange}:any) => {

  console.log(distribution.type); // Debugging log

  return (
      <>
      
      <div>
            <Form.Label>{text}</Form.Label>
            <Form.Select name={'type'} value={distribution.type || ""} onChange={(e) => handleChange(e, field)}>
                <option value="" disabled>Select a distribution</option>
                <option value="fixed">fixed</option>
                <option value="normal">normal</option>
                <option value="uniform">uniform</option>
            </Form.Select>
            { distribution.type === 'fixed' && (
                <div className='fixed-disribution'>
                    <Form.Control 
                        type='number' 
                        name='value' 
                        value={distribution.value} 
                        placeholder='Enter the fixed value' 
                        onChange={(e) => handleChange(e, field)}
                    />
                </div>  
            )}
            { distribution.type === 'normal' && (
                <div className='normal-distribution'>
                    <Form.Control
                        type='number'
                        name='mean'
                        value={distribution.mean}
                        placeholder='Enter the mean'
                        onChange={(e) => handleChange(e,field)}
                    />
                    <Form.Control
                        type='number'
                        name='stdev'
                        value={distribution.stdev}
                        placeholder='Enter the standard deviation'
                        onChange={(e) => handleChange(e,field)}
                    />
                </div>
            )}
            { distribution.type === "uniform" && (
              <div className='uniform-distribution'>
                <Form.Control
                        type='number'
                        name='lower'
                        value={distribution.lower}
                        placeholder='Enter the lower value'
                        onChange={(e) => handleChange(e,field)}
                    />
                    <Form.Control
                        type='number'
                        name='upper'
                        value={distribution.upper}
                        placeholder='Enter the upper value'
                        onChange={(e) => handleChange(e,field)}
                    />
              </div>
            )}
        </div>
      </> 
    );  
}


export default DistributionForm;