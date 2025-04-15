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
                            name="type"
                            value={investment.type ? investment.type: ''}   
                            onChange={handleInvestmentCaseChange}         
                        >
                        <option>Select an Investment Type</option>
                        {(investmentTypes).map((investmentType:any) => (
                            <option key={investmentType.name} value={investmentType.name}>
                                {investmentType.name}
                            </option>
                        ))}
                        </Form.Select>
                    </div>

                    <label htmlFor = "investment-name">Investment Value: </label>
                        <input
                            type = "text"
                            id = "value"
                            name = "value"
                            value={investment.value ? investment.value : ""}
                            onChange={(e) => handleInvestmentCaseChange(e)}
                        />

                    <label htmlFor="tax-status"> Tax Status:</label>
                            <input
                                type="radio"
                                id = "non-retirement"
                                name = "taxStatus"
                                value="non-retirement"
                                checked={investment.taxStatus === "non-retirement"}
                                onChange={(e) => handleInvestmentCaseChange(e)}
                            /> Non-Retirement

                            <input 
                                type ="radio"
                                id = "pre-tax"
                                name = "taxStatus"
                                value="pre-tax"
                                checked={investment.taxStatus === "pre-tax"}
                                onChange={(e) => handleInvestmentCaseChange(e)}
                            /> Pre-Tax
                            
                            
                            <input 
                                type ="radio"
                                id = "after-tax"
                                name = "taxStatus"
                                value="after-tax"
                                checked={investment.taxStatus === "after-tax"}
                                onChange={(e) => handleInvestmentCaseChange(e)}
                            /> After-Tax
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
