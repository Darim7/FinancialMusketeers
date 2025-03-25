import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import yaml
from models.scenario import Scenario
from models.investment import AssetType, Investment
from models.event_series import EventSeries
from utils.compare_utils import compare_dict, compare_str_list
from typing import Dict, List

# with open('imports/sample.yaml', 'r') as file: 
#     scenario=yaml.safe_load(file)
    
class ScenarioYamlUtils: 
    def __init__(self, file):
        with open(file, 'r') as file: 
            self.scenario=yaml.safe_load(file)
    
    def get_yaml(self): 
        return self.scenario
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
    
    def get_spending_strategy(self)->List[str]:
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
        return self.get_marital_status() == scenario.get_marital_status()
    
    def compare_birth_years(self, scenario: Scenario): 
        birth_years=self.get_birth_years()
        scenario_birth_years=scenario.get_birth_years()
        if len(birth_years)==len(scenario_birth_years):
            for i, year in enumerate(birth_years):
                if i == 0 and year != scenario.birth_yr:
                    return False
                elif i == 1 and year != scenario.spouse_birth_yr:
                    return False
            return True
        return False
                
    def compare_life_expectancy(self, scenario:Scenario):
        life_expectancy=self.get_life_expectancy()
        scenario_life_expectancy=scenario._life_expectancy
        if len(life_expectancy)==len(scenario_life_expectancy):
            for i, age in enumerate(life_expectancy):
                if i == 0 and age != scenario.life_exp:
                    return False
                elif i == 1 and age != scenario.spouse_life_exp:
                    return False
            return True
        return False
        
    # Compare individual investment types
    def compare_investment_type(self, ivmt_type: Dict, asset_type:AssetType):
        return ivmt_type['name']==asset_type.get_name() and \
            ivmt_type['description']==asset_type.get_description() and \
            ivmt_type['returnAmtOrPct']==asset_type.get_return_amt_or_pct() and \
            ivmt_type['returnDistribution']==asset_type.get_return_distribution() and \
            ivmt_type['expenseRatio']==asset_type.get_expense_ratio() and \
            ivmt_type['incomeAmtOrPct']==asset_type.get_income_amt_or_pct() and \
            ivmt_type['incomeDistribution']==asset_type.get_income_distribution() and \
            ivmt_type['taxability']==asset_type.get_taxable() 
            
    # Compare a list of investment types
    def compare_investment_types(self, scenario:Scenario):
        scenario_ivmt_types=scenario.get_investment_types()
        ivmt_types=self.get_investment_types()
        if len(ivmt_types)==len(scenario_ivmt_types):
            for i, type in enumerate(ivmt_types): 
                if not self.compare_investment_type(type, scenario_ivmt_types[i]):
                    return False
            return True
        return False

    # Compare individual investment
    def compare_investment(self, investment:Dict, scenario_ivmt:Investment):
        asset_type=scenario_ivmt.get_asset_type()
        return investment['investmentType']==asset_type and \
            investment['value']==scenario_ivmt.get_value() and \
            investment['taxStatus']==scenario_ivmt.get_tax_status() and \
            investment['id']==scenario_ivmt.get_investment_id()
    
    def compare_investments(self, scenario:Scenario):
        scenario_ivmts=scenario.get_investments()
        ivmts=self.get_investments()
        if len(ivmts)==len(scenario_ivmts):
            for i, ivmt in enumerate(ivmts):
                if not self.compare_investment(ivmt, scenario_ivmts[i]):
                    return False
            return True
        return False
    
    def compare_distribution(self, distribution:Dict, scenario_distribution: Dict)->bool:
        if distribution['type']==scenario_distribution['type']:
            if distribution['type']=='fixed':
                if distribution['value']!=scenario_distribution['value']:
                    return False
            elif distribution['type']=='normal':
                if distribution['mean']!=scenario_distribution['mean'] or \
                    distribution['stdev']!=scenario_distribution['stdev']:
                        return False
            elif distribution['type']=='uniform':
                if distribution['lower']!=scenario_distribution['lower'] or \
                    distribution['upper']!=scenario_distribution['upper']:
                        return False
            else: 
                if distribution['type']=='GBM':
                    if distribution['mu']!=scenario_distribution['mu'] or \
                        distribution['sigma']!=scenario_distribution['sigma']:
                            return False
            return True
        return False
    
    def compare_event(self, event:Dict, scenario_event:EventSeries): 
        data=scenario_event.get_data()   
        if event['name']!=scenario_event.get_name() and \
            event['type']!=scenario_event.get_type(): 
                return False
        start=event['start']
        scenario_event_start=scenario_event.get_start()
        # Compare distribution for Start
        if not self.compare_distribution(start, scenario_event_start): 
            return False
        duration=event['duration']
        scenario_event_duration=scenario_event.get_duration()
        # Compare distribution for duration
        if not self.compare_distribution(duration, scenario_event_duration):
            return False
        # Compare event type 
        if event['type']=='income' or event['type']=='expense':
            if event['initialAmount']==data['initialAmount'] and \
                event['changeAmtOrPct']==data['changeAmtOrPct'] and \
                event['inflationAdjusted']==data['inflationAdjusted'] and \
                event['userFraction']==data['userFraction']:
                    if not self.compare_distribution(event['changeDistribution'], data['changeDistribution']):
                          return False
                    if event['type']=='income' and event['socialSecurity']!=data['socialSecurity']:
                        return False
                    if event['type']=='expense' and event['discretionary']!=data['discretionary']:
                        return False
            else: 
                return False
        else: 
            # compare asset allocation
            if compare_dict(event['assetAllocation'], data['assetAllocation']):
                if event['type']=='invest' and event['maxCash']==data['maxCash']:
                    if event['glidePath'] and not compare_dict(event['assetAllocation2'], data['assetAllocation2']):
                        return False
            else: 
                return False     
        return True
    
    def compare_event_series(self, scenario:Scenario):
        event_series=self.get_event_series()
        scenario_event_series=scenario.get_event_series()
        if len(event_series)==len(scenario_event_series):
            for i, event in enumerate(event_series):
                if not self.compare_event(event, scenario_event_series[i]):
                    return False
        else: 
            return False
        return True
    
    def compare_inflation_assumption(self, scenario:Scenario):
        inflation_assumption=self.get_inflation_assumption()
        scenario_inflation_assumption=scenario.get_inflation_assumption()
        return self.compare_distribution(inflation_assumption, scenario_inflation_assumption)
    
    def compare_after_tax_contribution_limit(self, scenario:Scenario):
        after_tax_contribution_limit=self.get_after_tax_contribution_limit()
        scenario_after_tax_contribution_lim=scenario.get_after_tax_contribution_limit()
        return after_tax_contribution_limit==scenario_after_tax_contribution_lim
    
    def compare_spending_strategy(self, scenario:Scenario):
        spending_strat=self.get_spending_strategy()
        scenario_spending_strat=scenario.get_spending_strategy()
        return compare_str_list(spending_strat, scenario_spending_strat)
    
    def compare_expense_withdrawal_strategy(self, scenario:Scenario): 
        expense_withdrawal_strat=self.get_expense_withdrawal_strategy()
        scenario_expense_withdrawal_strat=scenario.get_expense_withdrawal_strategy()
        return compare_str_list(expense_withdrawal_strat, scenario_expense_withdrawal_strat)
    
    def compare_rmd_strategy(self, scenario:Scenario):
        rmd_strat=self.get_rmd_strategy()
        scenario_rmd_strat=scenario.get_rmd_strategy()
        return compare_str_list(rmd_strat, scenario_rmd_strat)
        
    def compare_roth_conversion(self, scenario:Scenario):
        roth_opt=self.get_roth_convertion_opt()
        scenario_roth_opt=scenario.is_roth_conversion_enabled()
        roth_strat=self.get_roth_conversion_strategy()
        scenario_roth_strat=scenario.get_roth_conversion_strategy()
        roth_start=self.get_roth_conversion_start()
        scenario_roth_start=scenario.get_roth_conversion_start()
        roth_end=self.get_roth_conversion_end()
        scenario_roth_end=scenario.get_roth_conversion_end()
        if roth_opt==scenario_roth_opt and \
            roth_start==scenario_roth_start and \
            roth_end==scenario_roth_end:
                return compare_str_list(roth_strat, scenario_roth_strat)
        return False
    
    def compare_financial_goal(self,scenario:Scenario):
        return self.get_financial_goal()==scenario.get_financial_goal()
    
    def compare_residence_state(self, scenario:Scenario):
        return self.get_residence_state()==scenario.get_residence_state()

    def verify_yaml_to_scenario(self, scenario:Scenario):
        return self.compare_name(scenario) and \
            self.compare_marital_status(scenario) and \
            self.compare_birth_years(scenario) and \
            self.compare_life_expectancy(scenario) and \
            self.compare_investment_types(scenario) and \
            self.compare_investments(scenario) and \
            self.compare_event_series(scenario) and \
            self.compare_inflation_assumption(scenario) and \
            self.compare_after_tax_contribution_limit(scenario) and \
            self.compare_spending_strategy(scenario) and \
            self.compare_expense_withdrawal_strategy(scenario) and \
            self.compare_rmd_strategy(scenario) and \
            self.compare_roth_conversion(scenario) and \
            self.compare_financial_goal(scenario) and \
            self.compare_residence_state(scenario)

file_name='imports/scenario_couple.yaml'
scenario_yaml=ScenarioYamlUtils(file_name)

print(scenario_yaml.get_yaml())
