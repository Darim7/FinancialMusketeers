import { useState } from "react";

/******************** Distribution Form ***********************************/
const DistributionForm = ({values, distributions, lifeExpectancyDistributions, handleChanges, index }) => {
    return (
      <div>
        <label htmlFor="life-expectancy">Life Expectancy:</label>

        <select
         id = "lifeExpectancyTypes"
         name="lifeExpectancyChoice"
         value={values.lifeExpectancyChoice || ''} 
         onChange={(e) => handleChanges(e, index)}
        >
          <option value="">Select a distribution</option>
          {distributions.map((distribution) => (
            <option key={distribution.value} value={distribution.value}>
              {distribution.label}
            </option>
          ))}
        </select>

       
        {values.lifeExpectancyChoice === 'fixed' && (
          <div>
            <label htmlFor="fixedDistribution">Fixed Life Expectancy:</label>
            <input
              type="number"
              min="0"
              name="lifeExpectancyDistributions"
              value={lifeExpectancyDistributions.fixed.values.value || ''}
              onChange={(e) => handleChanges(e, index)}
            />
          </div>
        )}

        {values.lifeExpectancyChoice === 'fixed' && values.maritalStatus === 'Couple' && (
          <div>
            <label htmlFor="fixedDistribution">Spouse Fixed Life Expectancy:</label>
            <input
              type="number"
              min="0"
              name="lifeExpectancyDistributions"
              value={lifeExpectancyDistributions.fixed.values.value2 || ''}
              onChange={(e) => handleChanges(e, index)}
            />
          </div>
        
        )}

        {values.lifeExpectancyChoice === 'normal' && (
          <div>
            <label htmlFor="distributionForm1">Normal Life Expectancy:</label>
            <input
              type="number"
              min="0"
              name="distributionForm1"
              value={values.distributionForm1 || ''}
              onChange={(e) => handleChanges(e, index)}
            />
            <label htmlFor="mean">Mean:</label>
            <input
              type="number"
              min="0"
              name="mean" // Ensure this matches the parent state key
              value={values.mean || ''} // Reflects the saved state
              onChange={(e) => handleChanges(e, index)} // Updates the parent state
            />

            <label htmlFor="stdv">Standard Deviation:</label>
            <input
              type="number"
              min="0"
              name="stdv" // Ensure this matches the parent state key
              value={values.stdv || ''} // Reflects the saved state
              onChange={(e) => handleChanges(e, index)} // Updates the parent state
            />





          </div>
        )}

        {values.lifeExpectancyChoice === 'normal' && values.maritalStatus === 'Couple' && (
          <div>
            <label htmlFor="distributionForm2">Uniform Life Expectancy:</label>
            <input
              type="number"
              min="0"
              name="distributionForm2"
              value={values.distributionForm2 || ''}
              onChange={(e) => handleChanges(e, index)}
            />
          </div>
        )}


      </div>
    );
  }

export default DistributionForm;