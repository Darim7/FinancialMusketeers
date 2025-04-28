import pytest

from muskets.simulations import sample_from_distribution, update_inflation, update_investments, perform_rmd, fed_income_tax, state_income_tax
from muskets.tax_scraper import read_tax_to_dict,  read_rmd_to_dict
from tests.utils.yaml_utils import ScenarioYamlUtils
from tests.utils.compare_utils import assert_is_uniform, assert_within_range, assert_is_normal, compare_dict
from models.scenario import Scenario 
from models.investment import Investment
from models.tax import StateTax, FederalTax
from models.rmd import RMD
from functools import reduce
# from itertools import chain 
from collections import defaultdict
import copy



@pytest.fixture(scope="function")
def create_scenario():
    file='imports/scenario_individual.yaml'
    scenario_yaml = ScenarioYamlUtils(file)
    scenario_payload = scenario_yaml.get_yaml()
    scenario=Scenario.from_dict(scenario_payload)
    yield scenario 

class TestInflation:
    def test_calculate_inflation_rate_fixed(self):
        inflation_assumption = {
            "type": "fixed",
            "value": 0.03, 
        }

        res = sample_from_distribution(inflation_assumption)
        assert res == 0.03

    
    def test_calculate_inflation_rate_normal(self):
        mean, stdev = 0.03, 0.01
        inflation_assumption = {
            "type": "normal", 
            "mean": mean,
            "stdev": stdev
        }

        # Check if rate is within the normal distribution
        assert_is_normal(lambda: sample_from_distribution(inflation_assumption), mean, stdev, label="inflation rate normal")

    @pytest.mark.parametrize("inflation_assumption", [
        {"type": "fixed", "value": 0.03},
        {"type": "uniform", "lower": 0.02, "upper": 0.05},
        {"type": "normal", "mean": 0.03, "stdev": 0.01}
    ])
    def test_update_inflation(self, create_scenario, inflation_assumption):
        scenario=create_scenario
        marital_status = scenario.get_marital_status()
        fed_tax = FederalTax()
        state_tax = StateTax(scenario.get_residence_state())
        event_series = scenario.get_event_series()
        expected_event_series = copy.deepcopy(event_series)
        inflation_rate=update_inflation(scenario, fed_tax, state_tax, event_series, inflation_assumption)
        
        # For each event in income or expense event series, ensure that the inflation rate is applied correctly 
        filtered_event_series = [event for event in event_series if event.type in ['income', 'expense']]
        expected_filtered_event_series = [event for event in expected_event_series if event.type in ['income', 'expense']]
        for i, event in enumerate(filtered_event_series):
            if event.data['inflationAdjusted']:
                # Check if inflation rate is applied correctly
                assert event.data['initialAmount'] == expected_event_series[i].data['initialAmount'] * (1 + inflation_rate)
                
        # Check if the tax brackets are updated correctly
        init_tax_brackets=read_tax_to_dict('federal')
        
        # init_income_bracket=init_tax_brackets[marital_status]['income']

        expected_income_bracket = {}
        
        for upper, percentage in init_tax_brackets[marital_status]['income'].items():
            if upper != 'inf': 
                # Calculate new bracket with inflation 
                new_upper= upper * (1 + inflation_rate)
                expected_income_bracket[new_upper] = percentage
            else:
                expected_income_bracket[upper] = percentage
        
        print(f"What is income: {fed_tax.bracket}")
        # Compare the updated tax brackets with the expected ones 
        assert compare_dict(fed_tax.bracket[marital_status]['income'], expected_income_bracket) is True

class TestRMD: 
    @pytest.mark.parametrize("age", [
        72, 73, 80, 120
    ])
    def test_perform_rmd(self, create_scenario, age):
        scenario=create_scenario
        rmd_strat = scenario.get_rmd_strategy()
        investments = scenario.get_investments()
        expected_investments = copy.deepcopy(investments)

        expected_pretax_list = [ivmt for ivmt in expected_investments if ivmt.investment_id in rmd_strat and ivmt.tax_status == 'pre-tax']
        pretax_list = [ivmt for ivmt in investments if ivmt.investment_id in rmd_strat and ivmt.tax_status == 'pre-tax']

        nonretire_by_type_dict = defaultdict(list)
        for ivmt in expected_investments: 
            if ivmt.tax_status == 'after-tax':
                nonretire_by_type_dict[ivmt.asset_type].append(ivmt)
        print(f"After Tax: {nonretire_by_type_dict}, Length: {len(nonretire_by_type_dict)}")
      
        
        for ivmt in expected_investments:
            print(f"investment type: {ivmt.asset_type}, investment id: {ivmt.investment_id}, value: {ivmt.value}, tax status: {ivmt.tax_status}")
        
        sum=reduce(lambda sum, curr: sum+curr.value, expected_pretax_list, 0)
        print(sum)
        # Create a RMD object 
        rmd_obj = RMD(pretax_list)
        expected_rmd_table = read_rmd_to_dict()
        assert rmd_obj.table is not None
        assert compare_dict(rmd_obj.table, expected_rmd_table) is True
        
        if age < 73:
            expected_rmd = 0
        else: 
            # calculate rmd
            if age in expected_rmd_table:
                expected_rmd = sum/expected_rmd_table[age]
            else: 
                expected_rmd = sum/expected_rmd_table[120] # maximum rmd for age 120 and over
            expected_rmd = round(expected_rmd, 2)
        print(f"expected rmd: {expected_rmd}, age: {age}, sum: {sum}")
        
        temp_rmd=expected_rmd
        # Perform RMD 
        if age >= 73: 
            # Add the RMD to non-retirement account of the targeted asset type
            for ivmt in expected_pretax_list: 
                # Find the non-retirement account of the same asset type
                if ivmt.asset_type in nonretire_by_type_dict and len(nonretire_by_type_dict[ivmt.asset_type]) > 0:
                    target_account = nonretire_by_type_dict[ivmt.asset_type][0]
                else:
                    # Creates a new non-retirement account of the same asset type and add the new investment to the scenario
                    target_account = Investment(ivmt.asset_type, ivmt.value, "after-tax", ivmt.investment_id)
                    expected_investments.append(target_account)
                if temp_rmd < 0: 
                    break
                if ivmt.value >= temp_rmd:
                    # Move the value to nonretirement account
                    target_account.value += temp_rmd
                    ivmt.value -= temp_rmd
                    break
                elif ivmt.value < temp_rmd: 
                    target_account.value += ivmt.value
                    temp_rmd -= ivmt.value
                    ivmt.value = 0
            print(f"New After Tax: {nonretire_by_type_dict['S&P 500'][0].value}, Length: {len(nonretire_by_type_dict)}")
            print(f'Expected RMD: {expected_rmd}')
            # Call the perform_rmd function and verify the result with expected rmd and ensure the investments are updated correctly
            res_rmd = perform_rmd(rmd_obj, age, investments)
            
            assert res_rmd == expected_rmd
            # Check if the investments are updated correctly
            for i, ivmt in enumerate(investments):
                print(f'{ivmt} compare {expected_investments[i]}')
                assert (ivmt.value == expected_investments[i].value and \
                    ivmt.tax_status == expected_investments[i].tax_status and \
                    ivmt.asset_type == expected_investments[i].asset_type and \
                    ivmt.investment_id == expected_investments[i].investment_id)   
    
class TestTax:
    @pytest.mark.parametrize("income, status, tax_type", [
        (58000, "individual", "federal"), (700000, "individual", "federal"), (12000, "individual", "federal"), 
        (58000, "couple", "federal"), (700000, "couple", "federal"), (12000, "couple", "federal"),
        (58000, "individual", "ny"), (700000, "individual", "ny"), (12000, "individual", "ny"),
        (58000, "couple", "ny"), (700000, "couple", "ny"), (12000, "couple", "ny"),
    ])
    def test_income_tax(self, income, status, tax_type):
        marital_status = status
        tax_obj = FederalTax() if tax_type == 'federal' else StateTax(tax_type)
        income_bracket = tax_obj.bracket[marital_status]['income']
        # Set the deduction amount to 0 for state tax
        deducted_income = income
        if tax_type == 'federal':
            deduction = tax_obj.bracket[marital_status]['deduction']
            deducted_income = income - deduction 
        tax = 0 

        if deducted_income > 0:
            previous_upper = 0
            # Calculate the tax amount
            for upper, percentage in income_bracket.items():
                if upper == 'inf' or deducted_income < upper: 
                    print(f"Upper: {upper}, Prev Upper: {previous_upper}, Deducted Income: {deducted_income}")
                    value = (deducted_income - previous_upper) * percentage
                    tax += round(value, 2) 
                    break

                value = (upper - previous_upper) * percentage
                tax += round(value, 2)
                previous_upper = upper

        # Test with actual function
        if tax_type == 'federal':
            res = fed_income_tax(tax_obj, income, marital_status)
        else: 
            res = state_income_tax(tax_obj, income, marital_status)
        assert res == tax
    
        
        
        
    