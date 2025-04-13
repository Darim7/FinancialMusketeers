import numpy as np
from models.scenario import Scenario
from models.tax import FederalTax, StateTax
from models.event_series import EventSeries
from models.investment import Investment, AssetType

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

def perform_rmd(rmd_obj, age: int)-> float:
    """
    Performs the required minimum distribution (RMD) for previous year

    Args:
        rmd_obj (RMD): RMD object
        age (int): current age of user

    Returns:
        float: RMD amount
    """
    return -1

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
