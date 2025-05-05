// Create Scenario Page
import './CreateScenario.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DistributionForm from './DistributionForm';
import Form from 'react-bootstrap/Form';

 {/* Investment Modal */}
  
 function InvestmentForm({showInvestmentModal, closeInvestmentModal, saveInvestment, investment, values,handleInvestmentChange, returnDistribution, incomeDistribution, handleDistributionChange, addInvestmentCase, handleInvestmentCaseChange}:any) {

    return (
        <Modal show={showInvestmentModal} onHide={closeInvestmentModal} backdrop='static' centered>

            <Modal.Header closeButton> </Modal.Header>

            <Modal.Body>
                <div className='investment-container'>
                <h3>Investments</h3>

                <Form.Label htmlFor = "investment-name">Investment Name: </Form.Label>
                    <Form.Control
                        type = "text"
                        name = "name"
                        value={investment.name}
                        onChange={handleInvestmentChange}
                    />

                <Form.Label htmlFor = "description"> Description: </Form.Label>
                    <Form.Control
                        type = "text"
                        name = "description"    
                        value={investment.description}
                        onChange={handleInvestmentChange}
                    />

                <Form.Label htmlFor = "return-amount"> Return Amount or Percent: </Form.Label>
                    <Form.Select 
                        name = "returnAmtOrPct"   
                        value={investment.returnAmtOrPct}
                        onChange={handleInvestmentChange}
                    >
                        <option disabled value=""> Select an option</option>
                        <option value="amount">amount</option>
                        <option value="percent">percent</option>
                    </Form.Select>
                

                <DistributionForm name={'returnDistribution'} field={"returnDistribution"} text={"Return Distribution:"} distribution={investment.returnDistribution} handleChange={handleDistributionChange}/> 

                <Form.Label htmlFor = "expense-ratio"> Expense Ratio: </Form.Label>
                    <Form.Control
                        type = "number"
                        name = "expenseRatio" 
                        value={investment.expenseRatio}
                        onChange={handleInvestmentChange}
                    />
                    
                <Form.Label htmlFor = "income-amount"> Income Amount or Percent: </Form.Label>
                        <Form.Select 
                            name = "incomeAmtOrPct"  
                            value={investment.incomeAmtOrPct}
                            onChange={handleInvestmentChange}
                        >
                            <option disabled value="">Select an option</option>
                            <option value="amount">amount</option>
                            <option value="percent">percent</option>
                        </Form.Select>
                <DistributionForm name={'incomeDistribution'} field={"incomeDistribution"} text={"Income Distribution:"} distribution={investment.incomeDistribution} handleChange={handleDistributionChange} /> 


                <Form.Label htmlFor = "taxability"> Taxability: </Form.Label>
                <Form.Check 
                    type='checkbox'
                    id = "Taxable"
                    // value = "true"
                    name = "taxability"
                    checked={investment.taxability === true}
                    // onChange={handleInvestmentChange}
                    onChange={(e) => handleInvestmentChange({
                        target: {
                            name: e.target.name,
                            value: e.target.checked, // Set the boolean value directly
                        },
                    })}
                    label="Taxable"
                />
                <Form.Check 
                    type='checkbox'
                    id = "Tax-Exempt"
                    name=  "taxability"     
                    value = "false"
                    checked={investment.taxability === false}
                    // onChange={handleInvestmentChange}
                    onChange={(e) => handleInvestmentChange({
                        target: {
                            name: e.target.name,
                            value: e.target.checked, // Set the boolean value directly
                        },
                    })}
                    label="Tax-Exempt"
                />
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