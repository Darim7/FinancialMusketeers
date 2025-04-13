import numpy as np
from models.scenario import Scenario
from models.tax import FederalTax, StateTax
from models.event_series import EventSeries
from models.investment import Investment, AssetType
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

def update_inflation(tax_obj: FederalTax | StateTax, event_series: list[EventSeries], inflation_assumption: dict) -> float:
    """
    Update the inflation rate and all of the inflation-related values
    """
    inflation_rate = sample_from_distribution(inflation_assumption)

    # Update the tax bracket
    res = {}
    for bracket, percentage in tax_obj.bracket.items():
        new_bracket = bracket * (1 + inflation_rate)
        res[new_bracket] = percentage
    tax_obj.bracket = res

    # Update event series
    for event in event_series:
        if 'inflationAdjusted' in event.data and event.data['inflationAdjusted']:
            event.data['initialValue'] *= (1 + inflation_rate)

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
                event.data['initialValue'] *= (1 + change)
            else:
                event.data['initialValue'] += change
                
            gross_income += event.data['initialValue']

        # Remember to account for social security.

    return gross_income

def update_investments():
    """
    Update the values of investments, reflecting expected annual return, reinvestment of generated income, and subtraction of expenses.
    """
    pass

def perform_rmd(rmd_obj: RMD, age: int, investments: list[Investment])-> float:
    """
    Performs the required minimum distribution (RMD) for previous year

    Args:
        rmd_obj (RMD): RMD object
        age (int): current age of user
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
    rmd = sum // rmd_distribution
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

def fed_income_tax(tax_obj, income: float) -> float:
    """
    Calculate the federal income tax based on the given income and filing status.

    Args:
        income (int): The taxable income.
        status (str): The filing status ('single', 'married', 'head_of_household').

    Returns:
        float: The calculated federal income tax.
    """
    return -1

def state_income_tax(income: int, status: str) -> float:
    """
    Calculate the state income tax based on the given income and filing status.
    Args:
        income (int): The taxable income.
        status (str): The filing status ('single', 'married', 'head_of_household').
    Returns:
        float: The calculated state income tax.
    """
    return -1

def income_calculation(tax_obj, inflation_assumption, income: float) -> float:
    return -1

# Main algorithm for the simulation

# TODO
"""
Compute and store the inflation-adjusted annual limits on retirement account contributions, in a
similar way.
"""
