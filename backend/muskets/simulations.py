import numpy as np
import logging
import copy
import csv
from collections import deque
from datetime import datetime

from models.scenario import Scenario
from models.tax import FederalTax, StateTax
from models.event_series import EventSeries
from models.investment import Investment, AssetType
from models.rmd import RMD
from functools import reduce
from collections import defaultdict

logger = logging.getLogger('models.scenario')

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
        # print(f"Type: {type(bracket)}, bracket: {bracket}")
        if bracket == 'inf': 
            res[bracket] = percentage
            break
        new_bracket = round(bracket * (1 + inflation_rate), 2)
        res[new_bracket] = percentage
    return res

def update_inflation(scenario: Scenario, fed_tax: FederalTax, state_tax: StateTax, event_series: list[EventSeries], inflation_assumption: dict) -> float:
    """
    Update the inflation rate and all of the inflation-related values
    """
    inflation_rate = sample_from_distribution(inflation_assumption)

    # Update the federal tax bracket
    fed_tax.bracket['individual']['income'] = update_bracket(fed_tax.bracket, inflation_rate, 'individual', 'income')
    fed_tax.bracket['couple']['income'] = update_bracket(fed_tax.bracket, inflation_rate, 'couple', 'income')

    # Update the state tax bracket
    state_tax.bracket['individual']['income'] = update_bracket(state_tax.bracket, inflation_rate, 'individual', 'income')
    state_tax.bracket['couple']['income'] = update_bracket(state_tax.bracket, inflation_rate, 'couple', 'income')
    
    # Update the standard deduction
    fed_tax.bracket['individual']['deduction'] = update_bracket(fed_tax.bracket, inflation_rate, 'individual', 'deduction')
    fed_tax.bracket['couple']['deduction'] = update_bracket(fed_tax.bracket, inflation_rate, 'couple', 'deduction')

    # Upate 
    fed_tax.bracket['individual']['cap_gains'] = update_bracket(fed_tax.bracket, inflation_rate, 'individual', 'cap_gains')
    fed_tax.bracket['couple']['cap_gains'] = update_bracket(fed_tax.bracket, inflation_rate, 'couple', 'cap_gains')

    # Update event series
    for event in event_series:
        if 'inflationAdjusted' in event.data and event.data['inflationAdjusted']:
            event.data['initialAmount'] *= (1 + inflation_rate)

    # Update the after tax contribution limit in the scenario
    scenario.aftertax_ann_contribution = scenario.aftertax_ann_contribution * (1 + inflation_rate)

    return inflation_rate

def gross_income(event_series: list[EventSeries], year: int, spouse_alive: bool, user_alive: bool, simulation_log: str) -> float:
    """
    Calculate the gross income from the cash event and all other event series.
    """
    gross_income = 0
    
    for event in event_series:
        if event.type == 'income' and not event.data['socialSecurity'] and check_event_start(event, year):
            change_dist = event.data['changeDistribution']
            is_percent = event.data['changeAmtOrPct'] == 'percent'

            # Change the amount in the event series according to the changeDistribution
            change = sample_from_distribution(change_dist)
            if is_percent:
                event.data['initialAmount'] *= (1 + change)
            else:
                event.data['initialAmount'] += change

            amount_gained = event.data['initialAmount']
            if spouse_alive and user_alive:
                gross_income += amount_gained
            elif user_alive:
                gross_income += amount_gained * event.data['userFraction']
            elif spouse_alive:
                gross_income += amount_gained * (1 - event.data['userFraction'])
            log_financial_event(simulation_log, year, "INCOME", amount_gained, f"Adding income from {event.name}")

    return gross_income

def get_social_security(event_series: list[EventSeries], year: int, spouse_alive: bool, user_alive: bool, simulation_log:str) -> float:
    social_security = 0

    for event in event_series:
        if event.type == 'income' and event.data['socialSecurity'] and check_event_start(event, year):
            change_dist = event.data['changeDistribution']
            is_percent = event.data['changeAmtOrPct'] == 'percent'

            # Change the amount in the event series according to the changeDistribution
            change = sample_from_distribution(change_dist)
            if is_percent:
                event.data['initialAmount'] *= (1 + change)
            else:
                event.data['initialAmount'] += change

            amount_gained = event.data['initialAmount']
            if spouse_alive and user_alive:
                gross_income += amount_gained
            elif user_alive:
                gross_income += amount_gained * event.data['userFraction']
            elif spouse_alive:
                gross_income += amount_gained * (1 - event.data['userFraction'])
            log_financial_event(simulation_log, year, "INCOME", amount_gained, f"Adding SS income from {event.name}")

    return social_security

def find_event(event_series: list[EventSeries], name: str) -> EventSeries:
    """
    Find an event in the list of event series by its ID.
    """
    for event in event_series:
        if event.name == name:
            return event
    return None

def check_event_start(event: EventSeries, year: int) -> bool:
    """
    Check if the event is starting in the current year.
    """
    return year >= event.data['start'] and year <= event.data['end']

def initialize_event(events: list[EventSeries]) -> None:

    for event in events:
        duration = sample_from_distribution(event.data['duration'])
        if isinstance(event.data['start'], int):
            continue
        if isinstance(event.data['start'], dict):

            if event.data['start']['type'] == 'fixed':
                event.data['start'] = event.data['start']['value']
            elif event.data['start']['type'] == 'uniform' or event.data['start']['type'] == 'normal':
                event.data['start'] = sample_from_distribution(event.data['start'])
            elif event.data['start']['type'] == 'startWith':
                dependent_event = find_event(events, event.data['start']['eventSeries'])
                event.data['start'] = dependent_event.data['start']
            else:
                raise ValueError(f"Unknown event start type: {event.data['start']['type']}")
            
        else:
            raise ValueError(f"Unknown event start type: {event.data['start']['type']}")
        event.data['duration'] = duration
        event.data['end'] = event.data['start'] + duration

def find_investment(investments: list[Investment], investment_id: str) -> Investment:
    """
    Find an investment in the list of investments by its ID.
    """
    for investment in investments:
        # logger.debug(f"Investment ID: {investment.investment_id}, Type: {type(investment.investment_id)}")
        if investment.investment_id == investment_id:
            return investment
    return None

def perform_rmd(rmd_obj: RMD, age: int, investments: list[Investment], simulation_log:str, year: int)-> float:
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
    # Find existing after-tax investments
    for ivmt in investments: 
        if ivmt.tax_status == 'after-tax':
            nonretire_by_type_dict[ivmt.asset_type].append(ivmt)
    # print(f"After Tax: {nonretire_by_type_dict}, Length: {len(nonretire_by_type_dict)}")
    
    # print("Inside RMD: pretax list")
    # for ivmt in pretax_list:
        # print(f"investment type: {ivmt.asset_type}, investment id: {ivmt.investment_id}, value: {ivmt.value}, tax status: {ivmt.tax_status}")
        
    sum=reduce(lambda sum, curr: sum+curr.value, pretax_list, 0)
    
    # Calculate RMD 
    rmd_distribution = rmd_obj.calculate_rmd(age)
    rmd = sum / rmd_distribution
    rmd = round(rmd, 2)
    # print(f"RMD inside: {rmd}, age: {age}, sum: {sum}, rmd_distribution: {rmd_distribution}")
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
    log_financial_event(simulation_log, year, "RMD", rmd, f"RMD calculated for age {age}")
    return rmd

def update_investments(asset_types: list[AssetType], investments: list[Investment], simulation_log:str, year:int)-> float:
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
    
    # print(mapped_investments)
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
        log_financial_event(simulation_log, year, "INVEST", ivmt.value, f"Updating investment {ivmt.investment_id}")
    log_financial_event(simulation_log, year, "INVEST", total_generated_income, f"Total generated income from updating investments")
    return total_generated_income

def after_tax_retirement_name(investment: Investment) -> str:
    """
    Create a name for the after-tax retirement investment based on the investment type.
    """
    if investment.tax_status == 'after-tax retirement':
        return f"{investment.asset_type} after-tax retirement"
    else:
        return f"{investment.asset_type} after-tax"

def create_after_tax_retirement_investment(name: str) -> Investment:
    new_investment = {
        'invstmentType': name,
        'value': 0,
        'taxStatus': 'after-tax retirement',
        'id': f'{name} after-tax retirement'
    }
    investment_obj = Investment.from_dict(new_investment)
    return investment_obj

def roth_conversion(upper_limit: float, federal_taxable_income_after_deduction: float, investments: list[Investment], roth_conversion_strategy: list, simulation_log: str, year: int) -> float:
    # Calculation amount of roth conversion.
    rc = upper_limit - (federal_taxable_income_after_deduction)

    converted_value = rc
    # Iterate over the investments in the Roth conversion strategy in the given order
    for investment_id in roth_conversion_strategy:
        if rc <= 0:
            break
        # transferring each of them in-kind to an investment with the
        # same investment type and with tax status = “after-tax retirement”
        # until the total amount transferred equals rc. The last investment to be transferred
        # might be partially transferred.
        inv = find_investment(investments, investment_id)
        if inv is None:
            raise ValueError(f"Investment {investment_id} not found in investments list. But it is in the strategy list.")
        
        after_tax = find_investment(investments, after_tax_retirement_name(inv))
        if after_tax:
            if inv.value >= rc:
                log_financial_event(simulation_log, year, "ROTH CONVERSION", rc, f"Moving from {inv.investment_id} to {after_tax.investment_id}. New value: {after_tax.value}, remaining RC value: {0}")
                after_tax.value += rc
                inv.value -= rc
                rc = 0
            else:
                after_tax.value += inv.value
                rc -= inv.value
                log_financial_event(simulation_log, year, "ROTH CONVERSION", inv.value, f"Moving from {inv.investment_id} to {after_tax.investment_id}. New value: {after_tax.value}, remaining RC value: {rc}")
                inv.value = 0

        else:
            # Create a new investment with the same type and tax status = "after-tax retirement"
            new_investment = create_after_tax_retirement_investment(inv.asset_type)
            if inv.value >= rc:
                log_financial_event(simulation_log, year, "ROTH CONVERSION", rc, f"Moving from {inv.investment_id} to {new_investment.investment_id}. New value: {new_investment.value}, remaining RC value: {0}")
                new_investment.value += rc
                inv.value -= rc
                rc = 0
            else:
                new_investment.value += inv.value
                rc -= inv.value
                log_financial_event(simulation_log, year, "ROTH CONVERSION", inv.value, f"Moving from {inv.investment_id} to {new_investment.investment_id}. New value: {new_investment.value}, remaining RC value: {rc}")
                inv.value = 0
            investments.append(new_investment)
    log_financial_event(simulation_log, year, "ROTH CONVERSION", converted_value, f"Total converted value from Roth Conversion: {converted_value}")
    return converted_value

def calculate_tax(income: float, bracket: dict, type_of_tax: str) -> tuple[float, float]:
    res = 0

    previous_bracket = 0
    upper_bracket = 0
    for brack, percentage in bracket[type_of_tax].items():
        if brack == 'inf':
            res += (income-previous_bracket) * percentage
            break
        if income > brack:
            res += (brack - previous_bracket) * percentage
        else:
            res += (income - previous_bracket) * percentage
            upper_bracket = brack
            break
        previous_bracket = brack
    
    return round(res, 2), upper_bracket
def fed_income_tax(tax_obj: FederalTax, income: float, status: str) -> float:    
    """
    Calculate the federal income tax based on the given income and filing status.

    Args:
        income (int): The taxable income.
        status (str): The filing status ('individual', 'couple').

    Returns:
        float: The calculated federal income tax.
    """
    bracket = tax_obj.bracket[status]
    income = income - bracket['deduction']
    if income < 0: 
        return 0
    return calculate_tax(income, bracket, 'income')[0]

def capital_gains_tax(tax_obj: FederalTax, income: float, cap_gains: float, status: str) -> float:
    """
    Calculate the capital gains tax based on the given income and filing status.
    Args:
        income (int): The taxable income.
        status (str): The filing status ('individual', 'couple').
    Returns:
        float: The calculated capital gains tax.
    """
    if cap_gains <= 0:
        return 0
    
    bracket = tax_obj.bracket[status]
    taxable_income = income + cap_gains - bracket['deduction']

    # Find the right bracket for the capital gains tax.
    upper_bracket = round(calculate_tax(taxable_income, bracket, 'cap_gains')[1], 2)

    # print(f"Income: {income}, Cap Gains: {cap_gains}, Taxable Income: {taxable_income}, Upper Bracket: {upper_bracket}, Bracket: {bracket}")

    return cap_gains * bracket['cap_gains'][upper_bracket] if upper_bracket else 0

def state_income_tax(tax_obj: StateTax, income: float, status: str) -> float:
    """
    Calculate the state income tax based on the given income and filing status.
    Args:
        income (int): The taxable income.
        status (str): The filing status ('individual', 'couple').
    Returns:
        float: The calculated state income tax.
    """
    bracket = tax_obj.bracket[status]
    return calculate_tax(income, bracket, 'income')[0]

def non_discretionary_expenses(event_series: list[EventSeries], year: int, simulation_log:str) -> float:
    """
    Calculate the non-discretionary expenses from the event series.
    """
    non_discretionary_expenses = 0
    
    for event in event_series:
        if event.type == 'expense' and 'discretionary' in event.data and not event.data['discretionary'] and check_event_start(event, year):
            non_discretionary_expenses += event.data['initialAmount']
            log_financial_event(simulation_log, year, "EXPENSE", event.data['initialAmount'], f"Adding discretionary expense from {event.name}")
    log_financial_event(simulation_log, year, "EXPENSE", non_discretionary_expenses, f"Total non-discretionary expenses")
    return non_discretionary_expenses

def discretionary_expenses(event_series: list[EventSeries], spending_strategy: list[str], year: int, simulation_log:str) -> list[float]:
    """
    Calculate the discretionary expenses from the event series.
    Args:
        event_series (list[EventSeries]): List of event series.
        spending_strategy (list[str]): List of spending strategies.
    Returns:
        list[float]: List of discretionary expenses sorted by the spending strategy.
    """
    discretionary_expenses = {}
    
    for event in event_series:
        if event.type == 'expense' and 'discretionary' in event.data and event.data['discretionary'] and check_event_start(event, year):
            discretionary_expenses[event.name] = event.data['initialAmount']
            log_financial_event(simulation_log, year, "EXPENSE", event.data['initialAmount'], f"Adding discretionary expense from {event.name}")
    log_financial_event(simulation_log, year, "EXPENSE", discretionary_expenses, f"Total discretionary expenses")
    return [(discretionary_expenses[spending], spending) for spending in spending_strategy if spending in discretionary_expenses]

def make_investments(invest_event: EventSeries, investments: list[Investment], year: int, simulation_log:str) -> float:
    """
    Calculate the total investment events from the event series.
    """
    if not check_event_start(invest_event, year):
        return 0.0
    
    cash = None
    for investment in investments:
        if investment.asset_type == 'cash':
            cash = investment.value

    if cash <= 0:
        return 0.0
    logger.info(f"Starting Investments: (cash: {cash})")
    allocation = {invest.investment_id : invest_event.data['assetAllocation'][invest.investment_id] for invest in investments if invest.investment_id in invest_event.data['assetAllocation']}
    logger.info(f"Allocation: {allocation}")
    # Check if already has a glide path if yes and if the gliding allocation is not empty
    # then update the gliding rates
    if invest_event.data['glidePath'] and 'glidingAllocation' in invest_event.data:
        # Update the gliding rates
        for alloc in invest_event.data['assetAllocation']:
            # Allocation used to invest
            invest_event.data['glidingAllocation'][alloc] = invest_event.data['glidingAllocation'][alloc] + invest_event.data['glidingIncrements'][alloc]
        allocation = invest_event.data['glidingAllocation']
        logger.info(f"Glide Path: {invest_event.data['glidePath']}, Gliding Allocation: {invest_event.data['glidingAllocation']}")

    # If not, start with the first allocation and set up the current allocation.
    elif invest_event.data['glidePath'] and 'glidingAllocation' not in invest_event.data:
        allocation = invest_event.data['assetAllocation']
        invest_event.data['glidingAllocation'] = allocation
        invest_event.data['glidingIncrements'] = {}
        
        # Calculate how much to glide for each year for each allocation.
        for alloc in invest_event.data['assetAllocation']:
            # Gliding rate difference for each year
            # logger.debug(f"Allocation: {alloc}, Asset Allocation: {invest_event.data['assetAllocation'][alloc]}, Asset Allocation 2: {invest_event.data['assetAllocation2'][alloc]}, Duration: {invest_event.data['duration']}")
            invest_event.data['glidingIncrements'][alloc] = (invest_event.data['assetAllocation2'][alloc] - invest_event.data['assetAllocation'][alloc]) / (invest_event.data['duration'])
    
    # Choose the amount to invest.
    cash = max(0, cash - invest_event.data['maxCash'])
    logger.info(f"Cash to invest: {cash}, max cash: {invest_event.data['maxCash']}")
    if cash <= 0:
        return 0.0

    # Start investing.
    tot_invested = 0
    for invest_id in invest_event.data['assetAllocation']:
        investment = find_investment(investments, invest_id)
        if investment.asset_type == 'cash':
            continue
        invest_amount = cash * allocation[investment.investment_id]
        investment.value += invest_amount
        tot_invested += invest_amount
        logger.info(f"Investment ID: {investment.investment_id}, Invest Amount: {invest_amount}, Cash: {cash}, Allocation: {allocation[investment.investment_id]}")
        log_financial_event(simulation_log, year, 'INVEST', invest_amount, f"Investing in {investment.investment_id} with allocation {allocation[investment.investment_id]}. New value: {investment.value}")
    return tot_invested

def rebalance(rebalance_event: EventSeries, investments: list[Investment], year: int, simulation_log:str) -> float:
    if not check_event_start(rebalance_event, year):
        return 0.0

    # Get the set of investments to rebalance, make it a dict.
    rebalancing_set = {invest.investment_id : invest for invest in investments if invest.investment_id in rebalance_event.data['assetAllocation']}
    logger.info(f"Rebalancing set: {rebalancing_set}")
    # Caculate the total value of the listed investments for rebalancing
    total_value = sum(invest.value for invest in rebalancing_set.values())
    logger.info(f"Total Investment Value: {total_value}")

    # Go through the specified investments and rebalance them to the target allocation.
    changed_amount = 0
    for invest_id, target_allocation in rebalance_event.data['assetAllocation'].items():
        if invest_id in rebalancing_set:
            invest = rebalancing_set[invest_id]
            logger.info(f"Investment ID: {invest.investment_id}, Target Allocation: {target_allocation}, Current Value: {invest.value}, Total Value: {total_value}")
            target_value = total_value * target_allocation
            diff = target_value - invest.value
            # Process all the sales
            if diff < 0: 
                invest.value += diff
                # total_value += diff
                changed_amount += abs(diff)
                log_financial_event(simulation_log, year, 'REBALANCE', diff, f"Selling from {invest.investment_id}. New value: {invest.value}, Target value: {target_value}, Target Allocation: {target_allocation}")
                logger.info(f"Target Value: {target_value}, Difference: {diff}, Changed Amount: {changed_amount}")
                
    for invest_id, target_allocation in rebalance_event.data['assetAllocation'].items():
        if invest_id in rebalancing_set:
            invest = rebalancing_set[invest_id]
            logger.info(f"Investment ID: {invest.investment_id}, Target Allocation: {target_allocation}, Current Value: {invest.value}, Total Value: {total_value}")
            target_value = total_value * target_allocation
            diff = target_value - invest.value
            # Process all the purchases.
            if diff > 0: 
                invest.value += diff
                # total_value += diff
                # changed_amount += abs(diff)
                log_financial_event(simulation_log, year, 'REBALANCE', diff, f"Buying {invest.investment_id}. New value: {invest.value}, Target value: {target_value}, Target Allocation: {target_allocation}")
                logger.info(f"Target Value: {target_value}, Difference: {diff}, Changed Amount: {changed_amount}")
    
    log_financial_event(simulation_log, year, 'REBALANCE', changed_amount, f"Total sales from rebalancing")

    return changed_amount

#####################################
# Main algorithm for the simulation #
#####################################

def run_year(scenario: Scenario, year: int, state_tax: StateTax, fed_tax: FederalTax, prev_state_tax: float, prev_fed_tax: float, user_age: int, user_alive: bool, spouse_age: int, spouse_alive: bool, simulation_log: str) -> dict:
    """
    Run a single year of the simulation.
    """
    # User info
    marital_status = "individual" if not scenario.is_married or (not spouse_alive or not user_alive) else "couple"
    cash_investment = find_investment(scenario.ivmts, "cash")

    # Get the investments, event series, and RMD strategy
    investments = scenario.get_investments()
    event_series = scenario.get_event_series()
    rmd = scenario.get_rmd_strategy()

    logger.info(f"Marital status: {marital_status}.")
    logger.info(f"prev_fed_tax: {prev_fed_tax}. prev_state_tax: {prev_state_tax}.")

    # STEP 1: Update inflation
    inflation_assumption = scenario.inflation_rate
    update_inflation(scenario, fed_tax, state_tax, event_series, inflation_assumption)

    # STEP 2: Calculate gross income
    gross_income_value = gross_income(event_series, year, spouse_alive, user_alive, simulation_log)
    
    social_security_income = get_social_security(event_series, year, spouse_alive, user_alive, simulation_log)

    # Calculate the current year income and add it to the cash event
    currYearIncome = round(gross_income_value + 0.85 * social_security_income, 2) 
    cash_investment.value += currYearIncome

    logger.info(f"Gross income: {gross_income_value}, Social Security: {social_security_income}, Current Year Income: {currYearIncome}")

    # STEP 3: RMD
    pretax_list = [ivmt for ivmt in investments if ivmt.investment_id in rmd and ivmt.tax_status == 'pre-tax']
    rmd_obj = RMD(pretax_list)
    rmd_amount = perform_rmd(rmd_obj, user_age, investments, simulation_log, year)

    # STEP 4: Update investments
    capital_gains = update_investments(scenario.ivmt_types, investments, simulation_log, year)
    # cash_investment.value += capital_gains
    currYearIncome += capital_gains
    log_financial_event(simulation_log, year, "INCOME", capital_gains, f"New total income for current year: {currYearIncome}")

    # STEP 5: Roth conversion
    fed_taxable_income_after_deduction = currYearIncome - fed_tax.bracket[marital_status]['deduction']
    upper_limit = calculate_tax(fed_taxable_income_after_deduction, fed_tax.bracket[marital_status], 'income')[1]
    roth_converted = roth_conversion(upper_limit, fed_taxable_income_after_deduction, investments, scenario.roth_strat, simulation_log, year)
    currYearIncome += roth_converted
    currYearIncome += rmd_amount

    logger.info(f"Roth conversion: {roth_converted}")

    # STEP 7: Calculate non-discretionary
    non_discresionary_expenses_value = non_discretionary_expenses(event_series, year, simulation_log)
    expenses_breakdown = {event.name: event.data['initialAmount'] for event in event_series if event.data['type'] == 'expense' and not event.data['discretionary'] and check_event_start(event, year)}
    discretionary_expenses_value = discretionary_expenses(event_series, scenario.spending_strat, year, simulation_log)

    logger.info(f"Non-discretionary expenses: {non_discresionary_expenses_value}, Discretionary expenses: {discretionary_expenses_value}")

    # Subtract previous year's tax and expenses.
    cash_investment.value -= round((prev_fed_tax + prev_state_tax + non_discresionary_expenses_value), 2)
    log_financial_event(simulation_log, year, "TAX", prev_fed_tax, f"Subtracting previous year federal tax")
    log_financial_event(simulation_log, year, "TAX", prev_state_tax, f"Subtracting previous year state tax")
    log_financial_event(simulation_log, year, "EXPENSE", non_discresionary_expenses_value, f"Subtracting non-discretionary expenses")
    if cash_investment.value < 0:
        # If what's left is negative, get money from the investments.
        for invest in scenario.expense_withdrawal_strat:
            invest_obj = find_investment(investments, invest)
            if invest_obj is None:
                raise ValueError(f"Investment {invest} not found in investments list. But it is in the strategy list.")
            if invest_obj.value >= abs(cash_investment.value):
                invest_obj.value += cash_investment.value
                log_financial_event(simulation_log, year, "EXPENSE", cash_investment.value, f"Withdrawing from {invest_obj.investment_id}. New value: {invest_obj.value}, remaining cash investment value: {0}")
                cash_investment.value = 0
                break
            else:
                cash_investment.value += invest_obj.value
                log_financial_event(simulation_log, year, "EXPENSE", invest_obj.value, f"Withdrawing from {invest_obj.investment_id}. New value: {invest_obj.value}, remaining cash investment value: {cash_investment.value}")
                invest_obj.value = 0

    # Pay discretionary expenses
    q = deque(discretionary_expenses_value)
    while cash_investment.value > 0 and q:
        expense_amount, expense_name = q.popleft()
        expense = round(expense_amount, 2)
        if cash_investment.value >= expense:
            log_financial_event(simulation_log, year, "EXPENSE", expense, f"Paying {expense_name}. Cash remaining: {cash_investment.value}")
            cash_investment.value -= expense
            expenses_breakdown[expense_name] = expense
        else:
            # If the current year income is less than the expense, pay partial.
            log_financial_event(simulation_log, year, "EXPENSE", cash_investment.value, f"Partially paying {expense_name}. Expense value: {expense}")
            expenses_breakdown[expense_name] = cash_investment.value
            cash_investment.value = 0
            break

    logger.info(f"Cash investment value: {cash_investment.value}")

    # STEP 8: invest in the investments
    invest_event = find_event(event_series, "my investments")
    amount_invested = make_investments(invest_event, investments, year, simulation_log)
    cash_investment.value -= amount_invested
    
    logger.info(f"Invested amount: {amount_invested}, Cash investment value: {cash_investment.value}")

    # STEP 9: Rebalance the investments
    rebalance_event = find_event(event_series, "rebalance")
    amount_rebalanced = rebalance(rebalance_event, investments, year, simulation_log)
    capital_gains += amount_rebalanced

    logger.info(f"Rebalanced amount: {amount_rebalanced}.")

    # Calculate federal and state income tax
    federal_tax_value = fed_income_tax(fed_tax, currYearIncome, marital_status)
    log_financial_event(simulation_log, year, "TAX", federal_tax_value, f"Federal Income Tax Calculated")
    # Calculate capital gains tax
    capital_gains = capital_gains_tax(fed_tax, currYearIncome, capital_gains, marital_status)
    federal_tax_value += capital_gains
    log_financial_event(simulation_log, year, "TAX", capital_gains, f"Federal Capital Gains Tax Calculated. Total Federal Tax: {federal_tax_value}")
    
    # Calculate state tax
    state_tax_value = state_income_tax(state_tax, currYearIncome, marital_status)
    log_financial_event(simulation_log, year, "TAX", state_tax_value, f"State Income Tax Calculated.")

    # Check if the financial goal is met
    currYearSum = 0
    for invest in investments:
        currYearSum += invest.value

    logger.info(f"Current year net worth: {currYearSum}, Financial goal: {scenario.financial_goal}")

    investment_breakdown = {invest.investment_id: invest.value for invest in investments}

    income_breakdown = {
        'gross_income': gross_income_value,
        'social_security': social_security_income,
        'capital_gains': capital_gains,
        'current_year_income': currYearIncome,
    }

    return {
        'federal_tax': federal_tax_value,
        'state_tax': state_tax_value,
        'rmd': rmd_amount,
        'capital_gains': capital_gains,
        'roth_converted': roth_converted,
        'amount_invested': amount_invested,
        'amount_rebalanced': amount_rebalanced,
        'financial_goal': currYearSum >= scenario.financial_goal,
        'investment_values': investment_breakdown,
        'income_breakdown': income_breakdown,
        'expenses_breakdown': expenses_breakdown,
    }

def save_logs_to_csv(logs: list[dict], filename: str) -> None:
    # Get all unique keys, excluding the one you want first
    first_key = "year"
    all_keys = set().union(*(d.keys() for d in logs))
    remaining_keys = sorted(k for k in all_keys if k != first_key)
    order = [first_key] + remaining_keys

    with open(filename, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=order)
        writer.writeheader()
        writer.writerows(logs)

def log_financial_event(simulation_log:str, year: int, transaction_type: str, amt: float, msg: str, new=False, new_year=False) -> None:
    with open(simulation_log, 'a') as f:
        if new: 
            f.write("Year, Transaction Type, Amount, Message\n")
            return 
        if new_year:
            f.write("_______________________________________________________\n")
            return
        f.write(f"Year: {year}, Transaction Type: {transaction_type}, Amount: {amt}, Message: {msg}\n")
    # return {
    #     'year': year,
    #     'transaction_type': transaction_type,
    #     'amount': amt,
    #     'message': msg
    # }
    

def run_simulation(scenario: Scenario, user: str, num_sim: int) -> list[dict]:
    """
    Run the simulation for the given scenario.
    """
    # Initialize the state and federal tax objects
    state_tax = StateTax(scenario.state)
    fed_tax = FederalTax()

    # Initialize the random variables for the simulation
    start_year = datetime.now().year

    user_birth_year = scenario.birth_yr
    user_curr_age = start_year - user_birth_year
    user_death_age = round(sample_from_distribution(scenario.life_exp))

    spouse_curr_age = 0
    spouse_death_age = 0
    if scenario.is_married:
        spouse_birth_year = scenario.spouse_birth_yr
        spouse_curr_age = start_year - spouse_birth_year
        spouse_death_age = round(sample_from_distribution(scenario.spouse_life_exp))
    
    # Start the year counter
    years_to_run = int(max((user_death_age - user_curr_age), (spouse_death_age - spouse_curr_age) if scenario.is_married else 0))

    # Initialize the previous year tax values
    prev_state_tax = 0
    prev_fed_tax = 0

    # Initialize the event series
    initialize_event(scenario.event_series)
    result = []

    # Run the simulation for each year
    end_year = start_year + years_to_run + 1

    # Logging simulation details
    logger.info(f"Running simulation for {years_to_run} years.")
    logger.info(f"User current age: {user_curr_age}, User death age: {user_death_age}")
    logger.info(f"Spouse current age: {spouse_curr_age}, Spouse death age: {spouse_death_age}")
    logger.info(f"Start year: {start_year}, End year: {end_year}")

    investment_logs = []
    simulation_logs = []
    log_file=f"./user_logs/{user}_{datetime.now()}.log"
    log_financial_event(log_file, 0, "", 0, "", new=True, new_year=False)
    for year in range(start_year, end_year):
        # Check if the user or spouse is alive
        user_alive = user_curr_age <= user_death_age
        spouse_alive = spouse_curr_age <= spouse_death_age if scenario.is_married else False
        log_financial_event(log_file, year, "", 0, "", new_year=True)
        # Run the year simulation.
        logger.info("---------------------------------------------------------------------------")
        logger.info(f"Running year {year}.")
        logger.info(f"User age/alive: {user_curr_age}/{user_alive} and spouse age/alive: {spouse_curr_age}/{spouse_alive}")
        year_res = run_year(scenario, year, state_tax, fed_tax, prev_state_tax, prev_fed_tax, user_curr_age, user_alive, spouse_curr_age, spouse_alive, log_file)
        
        year_investments = {'year': year}
        for invest in scenario.get_investments():
            year_investments[invest.investment_id] = round(invest.value, 2)
        investment_logs.append(year_investments)
        
        # Update the user and spouse ages and the previous year tax values
        user_curr_age += 1
        spouse_curr_age += 1 if scenario.is_married else 0
        prev_state_tax = year_res['state_tax']
        prev_fed_tax = year_res['federal_tax']

        result.append({year: year_res})

    if num_sim == 0:
        save_logs_to_csv(investment_logs, f"./user_logs/{user}_{datetime.now()}.csv")

    return result

def simulates(scenario_dict: dict, user_name: str, num_simulations: int) -> list[dict]:
    """
    Run the simulation for the given scenario multiple times.
    """
    results = []
    for _ in range(num_simulations):
        # Run one life time of the user.
        logger.info("#####################################################################################")
        logger.info(f"Running simulation {_ + 1} of {num_simulations}.")
        running_scenario = copy.deepcopy(scenario_dict)
        scenario = Scenario.from_dict(running_scenario)
        result = run_simulation(scenario, user_name, _)
        results.append(result)
    
    return results

def organize_simulations(simulations_result: list[dict]) -> dict[int, list]:
    """
    Organize the simulation results into a dictionary.
    """
    organized_result: dict[int, list] = {}
    for simulation in simulations_result:
        for year_simulation in simulation:
            for year, year_data in year_simulation.items():
                if year not in organized_result:
                    organized_result[year] = []
                organized_result[year].append(year_data)
    
    return organized_result

def probability_of_success(year_simulation: list) -> float:
    """
    Calculate the probability of success for the given scenario.
    """
    cnt = 0
    for sim in year_simulation:
        if sim['financial_goal']:
            cnt += 1
    return cnt / len(year_simulation)

def gather_probability_of_success(organized_results: dict[int, list]) -> dict:
    """
    Gather the probability of success for each year.
    """
    prob_success = {}
    for year, year_simulation in organized_results.items():
        prob_success[year] = probability_of_success(year_simulation)
    
    return prob_success

def calculate_statistics(simulations: list[dict]) -> dict:
    return {}

def run_financial_planner(scenario_dict: dict, user_name: str, num_simulations: int) -> dict:
    """
    Run the financial planner for the given scenario.
    """
    # Run the simulations
    simulations_result = simulates(scenario_dict, user_name, num_simulations)

    # Organize the results
    organized_result = organize_simulations(simulations_result)

    # Calculate the probability of success
    prob_success = gather_probability_of_success(organized_result)

    # Calculate statistics
    statistics = calculate_statistics(simulations_result)

    return {
        'probability_of_success': prob_success,
        'statistics': statistics,
        'organized_results': organized_result
    }

if __name__ == "__main__":
    pass