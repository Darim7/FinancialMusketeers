import { useState } from "react";

/******************** Distribution Form ***********************************/
const DistributionForm = ({ name, distributions, distributionValues, handleDistributionChange, index }) => {
    return (
      <>
      <div>
         <label htmlFor='distribution-form'>{name}</label>
          <select 
            name='distribution-form' 
            id='distribution-form'
            value={distributions[index].type}
            onChange={(e) => handleDistributionChange(e, index)}
          >
            <option disabled value=""> -- select an option -- </option>
            <option value="fixed">fixed</option>
            <option value="normal">normal</option>
            <option value="uniform">uniform</option>
          </select>
      </div>
      {/* {console.log(distributions)}
      {console.log(distributions[index])} */}
      { distributions[index].type == 'fixed' && (
        <div className='fixed-disribution'>
        <input 
          type='number' 
          name='value'
          value={distributions[index].values.value} 
          placeholder='Enter the fixed value'
          onChange={(e) => handleDistributionChange(e, index)}
         />
        </div>  
      )}
      { distributions[index].type == 'normal' && (
        <div className='normal-distribution'>
           <input type='number'
           name='mean' 
           value={distributions[index].values.mean} 
           placeholder='Enter the mean'  
           onChange={(e) => handleDistributionChange(e, index)}/>
           <input 
          type='number' 
          name='std' 
          value={distributions[index].values.std} 
          placeholder='Enter the standard deviation' 
          onChange={(e) => handleDistributionChange(e, index)}/>
        </div>
      )}
      {distributions[index].type == 'uniform' && (
      <div className='uniform-distribution'>
         <input 
          type='number'
          name='lower'
          value={distributions[index].values.lower} 
          placeholder='Enter the lower value' 
          onChange={(e) => handleDistributionChange(e, index)}/>
         <input 
          type='number' 
          name='upper' 
          value={distributions[index].values.upper} 
          placeholder='Enter the upper value' 
          onChange={(e) => handleDistributionChange(e, index)}/>
      </div>
      )}   
      </> 
    );  
}

export default DistributionForm;