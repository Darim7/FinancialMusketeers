/******************** Distribution Form ***********************************/
const DistributionForm = ({name, text, field, distribution, handleChange}:any) => {

  console.log(distribution.type); // Debugging log

  return (
      <>
      <div>
         <label htmlFor={name}>{text}</label>
          <select 
            name={"type"} 
            id={name}
            value={distribution.type}
            onChange={(e) => handleChange(e, field)}
          >
            <option disabled value=""> -- select an option -- </option>
            <option value="fixed">fixed</option>
            <option value="normal">normal</option>
            <option value="uniform">uniform</option>
          </select>
      </div>
      { distribution.type === 'fixed' && (
        <div className='fixed-disribution'>
        <input 
          type='text' 
          name='value'
          value={distribution.value} 
          placeholder='Enter the fixed value'
          onChange={(e) => handleChange(e, field)}
         />
        </div>  
      )}
      { distribution.type === 'normal' && (
        <div className='normal-distribution'>
           <input type='text'
           name='mean' 
           value={distribution.mean} 
           placeholder='Enter the mean'  
           onChange={(e) => handleChange(e, field)}/>
           <input 
          type='text' 
          name='std' 
          value={distribution.std} 
          placeholder='Enter the standard deviation' 
          onChange={(e) => handleChange(e, field)}/>
        </div>
      )}
      {distribution.type === 'uniform' && (
      <div className='uniform-distribution'>
         <input 
          type='text'
          name='lower'
          value={distribution.lower} 
          placeholder='Enter the lower value' 
          onChange={(e) => handleChange(e, field)}/>
         <input 
          type='text' 
          name='upper' 
          value={distribution.upper} 
          placeholder='Enter the upper value' 
          onChange={(e) => handleChange(e, field)}/>
      </div>
      )}   
      </> 
    );  
}

export default DistributionForm;