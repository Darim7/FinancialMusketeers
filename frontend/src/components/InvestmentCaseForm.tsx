import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function InvestmentCaseForm({investmentTypes, investment, showInvestmentCase, closeInvestmentCase, handleInvestmentCaseChange, saveInvestmentCase}:any){
    

    return (
        <Modal show={showInvestmentCase} onHide={closeInvestmentCase}>
            <Modal.Header closeButton> </Modal.Header>

            <Modal.Body>
                <div className='investments'>
                    <h3>Investments</h3>

                    <div className="investmentType">
                        {/* Dropdown to select the scenarios */}
                        <Form.Select 
                            id="selectInvestmentType"
                            name="investmentType"
                            value={investment.investmentType ? investment.investmentType: ''}   
                            onChange={handleInvestmentCaseChange}         
                        >
                        <option value="" disabled>Select an Investment Type</option>
                        {(investmentTypes).map((investmentType:any) => (
                            <option key={investmentType.name} value={investmentType.name}>
                                {investmentType.name}
                            </option>
                        ))}
                        </Form.Select>
                    </div>

                    <Form.Label htmlFor = "investment-name">Investment Value: </Form.Label>
                    <Form.Control
                        type = "number"
                        id = "value"
                        name = "value"
                        value={investment.value ? investment.value : ""}
                        onChange={(e) => handleInvestmentCaseChange(e)}
                    />

                    <Form.Label htmlFor="tax-status"> Tax Status:</Form.Label>
                    <Form.Check
                        type="checkbox"
                        id = "non-retirement"
                        name = "taxStatus"
                        value="non-retirement"
                        checked={investment.taxStatus === "non-retirement"}
                        onChange={(e) => handleInvestmentCaseChange(e)}
                        label="Non-Retirement"
                    /> 
                    <Form.Check 
                        type ="checkbox"
                        id = "pre-tax"
                        name = "taxStatus"
                        value="pre-tax"
                        checked={investment.taxStatus === "pre-tax"}
                        onChange={(e) => handleInvestmentCaseChange(e)}
                        label="Pre-Tax"
                    /> 
                    <Form.Check 
                        type ="checkbox"
                        id = "after-tax"
                        name = "taxStatus"
                        value="after-tax"
                        checked={investment.taxStatus === "after-tax"}
                        onChange={(e) => handleInvestmentCaseChange(e)}
                        label="After-Tax"
                    /> 
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant='danger' onClick={closeInvestmentCase}>
                    Cancel
                </Button>

                <Button variant='primary' onClick={saveInvestmentCase}>
                    Save
                </Button>
            </Modal.Footer>

        </Modal>
    )
}

export default InvestmentCaseForm;
