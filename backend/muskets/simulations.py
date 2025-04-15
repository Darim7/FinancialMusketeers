import numpy as np
from models.scenario import Scenario
from models.tax import FederalTax, StateTax
from models.event_series import EventSeries
from models.investment import Investment, AssetType
from models.rmd import RMD
from functools import reduce
from collections import defaultdict
from models.rmd import RMD
from functools import reduce
from collections import defaultdict

def sample_from_distribution(assumption: dict) -> float:
    res = -1

    # Check to see if the inflation assumption is a distribution or a single value
    if assumption['type'] == 'fixed':
        res = assumption['value']
    elif assumption['type'] == 'uniform':
        res = np.random.uniform(
            assumption['lower'],
            assumption['upper'])
    elif assumption['type'] == 'normal':
        res = np.random.normal(
            assumption['mean'],
            assumption['stdev'])
    else:
        raise ValueError(f"Unknown change distribution type: {assumption['type']}")
            
    return res

def update_bracket(bracket: dict, inflation_rate: float, marital_status: str, tax_category: str) -> dict: 
    res = {}
    if tax_category == 'deduction':
        res = bracket[marital_status][tax_category]
        res *= (1 + inflation_rate)
        return res

    for bracket, percentage in bracket[marital_status][tax_category].items():
        print(f"Type: {type(bracket)}, bracket: {bracket}")
        if bracket == 'inf': 
            res[bracket] = percentage
            break
        new_bracket = bracket * (1 + inflation_rate)
        res[new_bracket] = percentage
    return res
def update_inflation(tax_obj: FederalTax | StateTax, event_series: list[EventSeries], inflation_assumption: dict) -> float:
    """
    Update the inflation rate and all of the inflation-related values
    """
    inflation_rate = sample_from_distribution(inflation_assumption)
    # Update the tax bracket
    tax_obj.bracket['individual']['income'] = update_bracket(tax_obj.bracket, inflation_rate, 'individual', 'income')
    tax_obj.bracket['couple']['income'] = update_bracket(tax_obj.bracket, inflation_rate, 'couple', 'income')
    if isinstance(tax_obj, FederalTax):
        tax_obj.bracket['individual']['deduction'] = update_bracket(tax_obj.bracket, inflation_rate, 'individual', 'deduction')
        tax_obj.bracket['couple']['deduction'] = update_bracket(tax_obj.bracket, inflation_rate, 'couple', 'deduction')
        tax_obj.bracket['individual']['cap_gains'] = update_bracket(tax_obj.bracket, inflation_rate, 'individual', 'cap_gains')
        tax_obj.bracket['couple']['cap_gains'] = update_bracket(tax_obj.bracket, inflation_rate, 'couple', 'cap_gains')

    # Update event series
    for event in event_series:
        if 'inflationAdjusted' in event.data and event.data['inflationAdjusted']:
            event.data['initialAmount'] *= (1 + inflation_rate)

    return inflation_rate

def gross_income(event_series: list[EventSeries]) -> float:
    """
    Calculate the gross income from the cash event and all other event series.
    """
    gross_income = 0
    
    for event in event_series:
        if event.type == 'income':
            change_dist = event.data['changeDistribution']
            is_percent = event.data['changeAmtOrPct'] == 'percent'

            # Change the amount in the event series according to the changeDistribution
            change = sample_from_distribution(change_dist)
            if is_percent:
                event.data['initialAmount'] *= (1 + change)
            else:
                event.data['initialAmount'] += change
                
            gross_income += event.data['initialAmount']

        # Remember to account for social security.

    return gross_income

def update_investments(asset_types: list[AssetType], investments: list[Investment])-> float:
    """ Update the values of investments, reflecting expected annual return, reinvestment of generated income, and subtraction of expenses.

    Args:
        asset_types (list[AssetType]): List of Investment types
        investments (list[Investment]): List of Investments

    Returns:
        float: total generated income
    """
    
    # Map the investment types to its respective investments
    type_map = {atype.name : atype for atype in asset_types}
    mapped_investments = list(map(lambda ivmt: (ivmt, type_map[ivmt.asset_type]), investments))
    
    print(mapped_investments)
    total_generated_income = 0
    # TODO Check if cash is needed to update return
    for ivmt, asset_type in mapped_investments:
        if asset_type.name == "cash":
            continue
        init_value = ivmt.value
        # Calculate the generated income, using the given fixed amount or percentage, or sampling from the specified probability distribution.
        income_rate = sample_from_distribution(asset_type.incomeDistribution)
        income = (ivmt.value * income_rate)
        # Add to total generated income if the tax status is non-retirement and taxability is true
        if ivmt.tax_status == 'non-retirement' and asset_type.taxability:
            total_generated_income += income
        # Calculate the change in value, using the given fixed amount or percentage, or sampling from the specified probability distribution.
        ann_return_rate = sample_from_distribution(asset_type.returnDistribution)
        ann_return = ivmt.value * ann_return_rate
        ivmt.value += ann_return 
        # Add the income to the value of the investment.
        ivmt.value += income
        # Calculate this year’s expenses, by multiplying the expense ratio and the average value of the investment
        avg_value = (ivmt.value + init_value) / 2
        expense = avg_value * asset_type.expenseRatio
        ivmt.value -= expense
    return total_generated_income

def perform_rmd(rmd_obj: RMD, age: int, investments: list[Investment])-> float:
    """
    Performs the required minimum distribution (RMD) for previous year

    Args:
        rmd_obj (RMD): RMD object
        age (int): current age of user
        investments (list[Investment]): list of investments
        investments (list[Investment]): list of investments

    Returns:
        float: RMD amount
    """
    if age < 73: 
        return 0
    
    pretax_list = rmd_obj.ord_tax_deferred_ivmts
    nonretire_by_type_dict = defaultdict(list)
    for ivmt in investments: 
        if ivmt.tax_status == 'after-tax':
            nonretire_by_type_dict[ivmt.asset_type].append(ivmt)
    print(f"After Tax: {nonretire_by_type_dict}, Length: {len(nonretire_by_type_dict)}")
    
    print("Inside RMD: pretax list")
    for ivmt in pretax_list:
        print(f"investment type: {ivmt.asset_type}, investment id: {ivmt.investment_id}, value: {ivmt.value}, tax status: {ivmt.tax_status}")
        
    sum=reduce(lambda sum, curr: sum+curr.value, pretax_list, 0)
    
    # Calculate RMD 
    rmd_distribution = rmd_obj.calculate_rmd(age)
    rmd = sum / rmd_distribution
    rmd = round(rmd, 2)
    print(f"RMD inside: {rmd}, age: {age}, sum: {sum}, rmd_distribution: {rmd_distribution}")
    temp_rmd = rmd
    # Perform RMD 
    # Add the RMD to non-retirement account of the targeted asset type
    for ivmt in pretax_list: 
        # Find the non-retirement account of the same asset type
        if ivmt.asset_type in nonretire_by_type_dict and len(nonretire_by_type_dict[ivmt.asset_type]) > 0:
            target_account = nonretire_by_type_dict[ivmt.asset_type][0]
        else:
            # Creates a new non-retirement account of the same asset type and add the new investment to the scenario
            target_account = Investment(ivmt.asset_type, ivmt.value, "after-tax", ivmt.investment_id)
            investments.append(target_account)
        if temp_rmd < 0: 
            break
        if ivmt.value >= temp_rmd:
            # Move the value to nonretirement account
            target_account.value += temp_rmd
            ivmt.value -= temp_rmd
            break
        target_account.value += ivmt.value
        temp_rmd -= ivmt.value
        ivmt.value = 0
    return rmd

def calculate_tax(income: float, bracket: dict) -> float:
    res = 0

    previous_bracket = 0
    for brack, percentage in bracket['income'].items():
        if brack == 'inf':
            res += income * percentage
            break
        if income > brack:
            res += (brack - previous_bracket) * percentage
        else:
            res += (income - previous_bracket) * percentage
            break
        previous_bracket = brack
    
    return res
def fed_income_tax(tax_obj: FederalTax, income: float, status: str) -> float:    
    """
    Calculate the federal income tax based on the given income and filing status.

    Args:
        income (int): The taxable income.
        status (str): The filing status ('single', 'married', 'head_of_household').

    Returns:
        float: The calculated federal income tax.
    """
    bracket = tax_obj.bracket[status]
    income = income - bracket['deduction']
    if income < 0: 
        return 0
    return calculate_tax(income, bracket)

def state_income_tax(tax_obj: StateTax, income: float, status: str) -> float:
    """
    Calculate the state income tax based on the given income and filing status.
    Args:
        income (int): The taxable income.
        status (str): The filing status ('single', 'married', 'head_of_household').
    Returns:
        float: The calculated state income tax.
    """
    bracket = tax_obj.bracket[status]
    return calculate_tax(income, bracket)

def non_discresionary_expenses(event_series: list[EventSeries]) -> float:
    """
    Calculate the non-discretionary expenses from the event series.
    """
    non_discresionary_expenses = 0
    
    for event in event_series:
        if event.type == 'expense' and 'discretionary' in event.data and not event.data['discretionary']:
            non_discresionary_expenses += event.data['initialAmount']

    return non_discresionary_expenses

def income_calculation(tax_obj, inflation_assumption, income: float) -> float:
    return -1

# Main algorithm for the simulation

# TODO
"""
Compute and store the inflation-adjusted annual limits on retirement account contributions, in a
similar way.
"""

if __name__ == "__main__":
    pass