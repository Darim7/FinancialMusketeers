// Create Scenario Page
import React from 'react';
import {useState, useEffect } from 'react';
import Select from 'react-select'
import './CreateScenario.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import DistributionForm from './DistributionForm';

 {/* Investment Modal */}
  
 function InvestmentForm({showInvestmentModal, closeInvestmentModal, saveInvestment, investment, handleInvestmentChange, distributions, distributionValues, handleDistributionChange, addInvestmentCase, handleInvestmentCaseChange}) {

    return (
        <Modal show={showInvestmentModal} onHide={closeInvestmentModal} centered>

            <Modal.Header closeButton> </Modal.Header>

            <Modal.Body>
                <div className='investment-container'>
                <h3>Investments</h3>

                <label htmlFor = "investment-name">Investment Name: </label>
                    <input
                    type = "text"
                    name = "investmentName"
                    value={investment.investmentName}
                    onChange={handleInvestmentChange}
                    />

                <label htmlFor = "description"> Description: </label>
                    <input
                    type = "text"
                    name = "description"    
                    value={investment.description}
                    onChange={handleInvestmentChange}
                    />

                <label htmlFor = "return-amount"> Return Amount or Percent: </label>
                    <input
                    type = "text"
                    name = "returnAmtOrPct"     
                    value={investment.returnAmtOrPct}
                    onChange={handleInvestmentChange}
                    />

            <DistributionForm name={'Return Distribution'} index={0} distributions={distributions} distributionValues={distributionValues} handleDistributionChange={handleDistributionChange} /> 

            <label htmlFor = "expense-ratio"> Expense Ratio: </label>
                <input
                type = "number"
                name = "expenseRatio" 
                value={investment.expenseRatio}
                onChange={handleInvestmentChange}
                />

            <label htmlFor = "income-amount"> Income Amount or Percent: </label>
                <input
                type = "text"
                name = "incomeAmtOrPct" 
                value={investment.incomeAmtOrPct}
                onChange={handleInvestmentChange}
                />
            <DistributionForm name={'Income Distribution'} index={1} distributions={distributions} distributionValues={distributionValues} handleDistributionChange={handleDistributionChange} /> 


            <label htmlFor = "taxability"> Taxability: </label>
                <input
                type = "radio"
                id = "Taxable"
                value = "Taxable"
                name = "taxability"
                checked={investment.taxability === "Taxable"}
                onChange={handleInvestmentChange}
                /> Taxable
                <input 
                type ="radio"
                id = "Tax-Exempt"
                name=  "taxability"     
                value = "Tax-Exempt"
                checked={investment.taxability === "Tax-Exempt"}
                onChange={handleInvestmentChange}
                /> Tax-Exempt

            {/*------------ Ask user the amount of their investment, and whether it is tax-exempt or not ---------*/}
                <Button onClick={addInvestmentCase}>Set Investment</Button>

                {investment.investmentCases.map((investmentCase, index) => (
                    <div key={investmentCase.id}>

                        <label htmlFor="value">Value: </label>
                        <input
                        type="text"
                        name="value"
                        value={investmentCase.value ||''}
                        onChange={(e) => handleInvestmentCaseChange(index, e)}
                        />

                        <label htmlFor="tax-status"> Tax Status:</label>
                            <input
                                type="radio"
                                id = "non-retirement"
                                name = "taxStatus"
                                value="non-retirement"
                                checked={investmentCase.taxStatus === "non-retirement"}
                                onChange={(e) => handleInvestmentCaseChange(index, e)}/> Non-Retirement

                            <input 
                                type ="radio"
                                id = "pre-tax"
                                name = "taxStatus"
                                value="pre-tax"
                                checked={investmentCase.taxStatus === "pre-tax"}
                                onChange={(e) => handleInvestmentCaseChange(index, e)} /> Pre-Tax
                            
                            
                            <input 
                                type ="radio"
                                id = "after-tax"
                                name = "taxStatus"
                                value="after-tax"
                                checked={investmentCase.taxStatus === "after-tax"}
                                onChange={(e) => handleInvestmentCaseChange(index, e)} /> After-Tax

                    </div>
                ))}

            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant='danger' onClick={closeInvestmentModal}>
                Cancel
            </Button>

            <Button variant='primary' onClick={saveInvestment}>
                Save
            </Button>

            
            </Modal.Footer>
        </Modal>
    )    
}
 export default InvestmentForm;