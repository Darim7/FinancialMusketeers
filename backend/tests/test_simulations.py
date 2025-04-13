import pytest

from muskets.simulations import calculate_inflation_rate, update_inflation, update_investments, perform_rmd, fed_income_tax, state_income_tax, income_calculation
from muskets.tax_scraper import read_tax_to_dict,  read_rmd_to_dict
from tests.utils.yaml_utils import ScenarioYamlUtils
from tests.utils.compare_utils import assert_is_uniform, assert_within_range, assert_is_normal, compare_dict
from models.scenario import Scenario 
from models.tax import StateTax, FederalTax
from models.rmd import RMD
from functools import reduce
from itertools import chain 


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

        res = calculate_inflation_rate(inflation_assumption)
        assert res == 0.03

    
    def test_calculate_inflation_rate_normal(self):
        mean, stdev = 0.03, 0.01
        inflation_assumption = {
            "type": "normal", 
            "mean": mean,
            "stdev": stdev
        }

        # Check if rate is within the normal distribution
        assert_is_normal(lambda: calculate_inflation_rate(inflation_assumption), mean, stdev, label="inflation rate normal")

    @pytest.mark.parametrize("inflation_assumption", [
        {"type": "fixed", "value": 0.03},
        {"type": "uniform", "lower": 0.02, "upper": 0.05},
        {"type": "normal", "mean": 0.03, "stdev": 0.01}
    ])
    def test_update_inflation(self, create_scenario, inflation_assumption):
        scenario=create_scenario
        # value = 0.03
        # inflation_assumption = {
        #     "type": "fixed",
        #     "value": value, 
        # }
        marital_status = scenario.get_marital_status()
        tax_obj = FederalTax(marital_status)
        inflation_rate=update_inflation(tax_obj, inflation_assumption)
        
        # assert inflation_rate == value
        # Check if the tax brackets are updated correctly
        init_tax_brackets=read_tax_to_dict('federal')
        
        init_income_bracket=init_tax_brackets[marital_status]['income']

        expected_income_bracket = {}
        
        for upper, percentage in init_tax_brackets.items():
            if upper != float('inf'): 
                # Calculate new bracket with inflation 
                new_upper= upper * (1 + inflation_rate)
                expected_income_bracket[new_upper] = percentage
        
        # Compare the updated tax brackets with the expected ones 
        assert compare_dict(tax_obj.bracket[marital_status]['income'], expected_income_bracket) is True

class TestRMD: 
    @pytest.mark.parametrize("age", [
        72, 73, 80, 120
    ])
    def test_perform_rmd(self, create_scenario, age):
        scenario=create_scenario
        rmd_strat = scenario.get_rmd_strategy()
        investments = scenario.get_investments()
        pretax_list = [ivmt for ivmt in investments if ivmt.investment_id in rmd_strat and ivmt.tax_status == 'pre-tax']
        
        def find_ivmt_by_type(comp):
            return [ivmt for ivmt in investments if ivmt.asset_type == comp.asset_type and ivmt.tax_status == 'after-tax']
        aftertax_list = list(map(find_ivmt_by_type, pretax_list))
        aftertax_list = list(chain.from_iterable(aftertax_list))
        print(f"After Tax: {aftertax_list}")
      
        
        for ivmt in investments:
            print(f"investment type: {ivmt.asset_type}, investment id: {ivmt.investment_id}, value: {ivmt.value}, tax status: {ivmt.tax_status}")
        print("-----------------")
        for ivmt in aftertax_list:
            print(f"investment type: {ivmt.asset_type}, investment id: {ivmt.investment_id}, value: {ivmt.value}, tax status: {ivmt.tax_status}")
        
        
        
        sum=reduce(lambda sum, curr: sum+curr.value, pretax_list, 0)
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
                expected_rmd = sum//expected_rmd_table[age]
            else: 
                expected_rmd = sum//expected_rmd_table[120] # maximum rmd for age 120 and over
        print(f"expected rmd: {expected_rmd}")
        
        
        
        
        
    