import numpy as np
from models.scenario import Scenario
from models.tax import FederalTax, StateTax

def update_inflation(tax_obj, inflation_assumption: dict) -> float:
    """
    Update the inflation rate and all of the inflation-related values
    """
    inflation_rate = -1

    # Check to see if the inflation assumption is a distribution or a single value
    if inflation_assumption['type'] == 'fixed':
        inflation_rate = inflation_assumption['value']
    elif inflation_assumption['uniform']:
        inflation_rate = np.random.uniform(
            inflation_assumption['lower'],
            inflation_assumption['upper'],)
    else:
        inflation_rate = np.random.normal(
            inflation_assumption['mean'],
            inflation_assumption['stdev'],)

    # Update the tax bracket
    res = {}
    for bracket, percentage in tax_obj.bracket.items():
        new_bracket = bracket * (1 + inflation_rate)
        res[new_bracket] = percentage
    tax_obj.bracket = res

    return inflation_rate

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
