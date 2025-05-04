import Form from 'react-bootstrap/Form';
import DistributionForm from './DistributionForm';
/******************** Distribution Form ***********************************/

const LifeExpectancyForm = ({text, distribution, handleChange, index}:any) => {

    return (
        <>
        <div>
            <Form.Label>{text}</Form.Label>
            <Form.Select name={'type'} value={distribution.type || ""} onChange={(e) => handleChange(e, index)}>
                <option value="" disabled>Select a distribution</option>
                <option value="fixed">fixed</option>
                <option value="normal">normal</option>
            </Form.Select>
            { distribution.type === 'fixed' && (
                <div className='fixed-disribution'>
                    <Form.Control 
                        type='number' 
                        name='value' 
                        value={distribution.value} 
                        placeholder='Enter the fixed value' 
                        onChange={(e) => handleChange(e, index)}
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
                        onChange={(e) => handleChange(e,index)}
                    />
                    <Form.Control
                        type='number'
                        name='stdev'
                        value={distribution.stdev}
                        placeholder='Enter the standard deviation'
                        onChange={(e) => handleChange(e,index)}
                    />
                </div>
            )}
        </div>
        </> 
      );  
  }
  
  export default LifeExpectancyForm;