import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
print(sys.path)
import yaml
from models.scenario import Scenario
from models.investment import AssetType
from typing import Dict, List

with open('imports/sample.yaml', 'r') as file: 
    scenario=yaml.safe_load(file)
    
class ScenarioYamlUtils: 
    def __init__(self, file):
        with open(file, 'r') as file: 
            self.scenario=yaml.safe_load(file)
    
    def get_name(self): 
        return self.scenario['name']
    
    def get_marital_status(self):
        return self.scenario['maritalStatus']
    
    def get_birth_years(self):
        return self.scenario['birthYears']
    
    def get_life_expectancy(self):
        return self.scenario['lifeExpectancy']
    
    def get_investment_types(self):
        return self.scenario['investmentTypes']
    
    def get_investments(self):
        return self.scenario['investments']

    def get_event_series(self):
        return self.scenario['eventSeries']
    
    def get_inflation_assumption(self):
        return self.scenario['inflationAssumption']
    
    def get_after_tax_contribution_limit(self):
        return self.scenario['afterTaxContributionLimit']
    
    def get_spending_strategy(self):
        return self.scenario['spendingStrategy']
    
    def get_expense_withdrawal_strategy(self):
        return self.scenario['expenseWithdrawalStrategy']
    
    def get_rmd_strategy(self):
        return self.scenario['RMDStrategy']
    
    def get_roth_convertion_opt(self):
        return self.scenario['RothConversionOpt']
    
    def get_roth_conversion_start(self):
        return self.scenario['RothConversionStart']
    
    def get_roth_conversion_end(self):
        return self.scenario['RothConversionEnd']
    
    def get_roth_conversion_strategy(self): 
        return self.scenario['RothConversionStrategy']
    
    def get_financial_goal(self):
        return self.scenario['financialGoal']
    
    def get_residence_state(self):
        return self.scenario['residenceState']
    
    ### Below are the methods for comparison
    def compare_name(self, scenario:Scenario):
        return self.get_name() == scenario.name
    
    def compare_marital_status(self, scenario: Scenario):
        marital_status="couple" if scenario.is_married else "individual"
        return self.get_marital_status() == marital_status
    
    def compare_birth_years(self, scenario: Scenario): 
        birth_years=self.get_birth_years()
        if len(birth_years) < 2: 
            return birth_years[1] == scenario.birth_yr
        return (birth_years[1] == scenario.birth_yr) and (birth_years[2] == scenario.spouse_birth_yr)
    
    def compare_life_expectancy(self, scenario:Scenario):
        pass
    
    def compare_investment_type(self, ivmt_type: List[Dict], asset_type:AssetType):
        return ivmt_type['name']==asset_type.get_name() and \
            ivmt_type['description']==asset_type.get_description() and \
            ivmt_type['expenseRatio']==asset_type.get_expense_ratio() and \
            ivmt_type['taxability']==asset_type.get_taxable()
            
    def compare_investment_types(self, asset_type:AssetType):
        pass
    
    def compare_investment(self):
        pass
    
    def compare_event(self):
        pass
    
    def compare_event_series(self):
        pass
    
    def compare_inflationAssumption(self):
        pass
    
    def compare_after_tax_contribution_limit(self):
        pass
    
    def compare_spending_strategy(self):
        pass
    
    def compare_expense_withdrawal_strategy(self): 
        pass
    
    def compare_rmd_strategy(self):
        pass
        
    def compare_roth_conversion(self):
        pass
    
    def compare_financial_goal(self):
        pass
    
    def compare_residence_state(self):
        pass

    
print(scenario['investmentTypes'][0])