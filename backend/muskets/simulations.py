import numpy as np
from collections import deque
from datetime import datetime

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
    fed_tax.bracket['individual']['cap_gains'] = update_bracket(fed_tax.bracket, inflation_rate, 'individual', 'cap_gains')
    fed_tax.bracket['couple']['cap_gains'] = update_bracket(fed_tax.bracket, inflation_rate, 'couple', 'cap_gains')

    # Update event series
    for event in event_series:
        if 'inflationAdjusted' in event.data and event.data['inflationAdjusted']:
            event.data['initialAmount'] *= (1 + inflation_rate)

    # Update the after tax contribution limit in the scenario
    scenario.aftertax_ann_contribution = scenario.aftertax_ann_contribution * (1 + inflation_rate)

    return inflation_rate

def gross_income(event_series: list[EventSeries], year: int, spouse_alive: bool, user_alive: bool) -> float:
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

    return gross_income

def get_social_security(event_series: list[EventSeries], year: int, spouse_alive: bool, user_alive: bool) -> float:
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
        if isinstance(event.data['start'], int):
            continue
        elif isinstance(event.data['start'], dict):
            duration = sample_from_distribution(event.data['duration'])

            if event.data['start']['type'] == 'fixed':
                event.data['start'] = event.data['start']['value']
            elif event.data['start']['type'] == 'uniform' or event.data['start']['type'] == 'normal':
                event.data['start'] = sample_from_distribution(event.data['start'])
            elif event.data['start']['type'] == 'startWith':
                dependent_event = find_event(events, event.data['start']['eventSeries'])
                event.data['start'] = dependent_event.data['start']
            else:
                raise ValueError(f"Unknown event start type: {event.data['start']['type']}")
            
            event.data['end'] = event.data['start'] + duration
        else:
            raise ValueError(f"Unknown event start type: {event.data['start']['type']}")

def find_investment(investments: list[Investment], investment_id: str) -> Investment:
    """
    Find an investment in the list of investments by its ID.
    """
    for investment in investments:
        if investment.investment_id == investment_id:
            return investment
    return None

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

def roth_conversion(upper_limit: float, federal_taxable_income_after_deduction: float, investments: list[Investment], roth_conversion_strategy: list) -> float:
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
                after_tax.value += rc
                inv.value -= rc
                rc = 0
            else:
                after_tax.value += inv.value
                rc -= inv.value
                inv.value = 0
                # Remove the investment from the list of investments
                investments.remove(inv)
        else:
            # Create a new investment with the same type and tax status = "after-tax retirement"
            new_investment = create_after_tax_retirement_investment(inv.asset_type)
            if inv.value >= rc:
                new_investment.value += rc
                inv.value -= rc
                rc = 0
            else:
                new_investment.value += inv.value
                rc -= inv.value
                inv.value = 0
                # Remove the investment from the list of investments
                investments.remove(inv)
            investments.append(new_investment)

    return converted_value

def calculate_tax(income: float, bracket: dict) -> tuple[float, float]:
    res = 0

    previous_bracket = 0
    upper_bracket = 0
    for brack, percentage in bracket['income'].items():
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
    return calculate_tax(income, bracket)[0]

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
    upper_bracket = calculate_tax(taxable_income, bracket)[1]

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
    return calculate_tax(income, bracket)[0]

def non_discretionary_expenses(event_series: list[EventSeries], year: int) -> float:
    """
    Calculate the non-discretionary expenses from the event series.
    """
    non_discretionary_expenses = 0
    
    for event in event_series:
        if event.type == 'expense' and 'discretionary' in event.data and not event.data['discretionary'] and check_event_start(event, year):
            non_discretionary_expenses += event.data['initialAmount']

    return non_discretionary_expenses

def discretionary_expenses(event_series: list[EventSeries], spending_strategy: list[str], year: int) -> list[float]:
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

    return [discretionary_expenses[spending] for spending in spending_strategy if spending in discretionary_expenses]

def make_investments(invest_event: EventSeries, investments: list[Investment], year: int) -> float:
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

    allocation = {invest.investment_id : invest_event.data['assetAllocation'][invest.investment_id] for invest in investments}

    # Check if already has a glide path if yes and if the gliding allocation is not empty
    # then update the gliding rates
    if invest_event.data['glidePath'] and 'glidingAllocation' in invest_event.data:
        # Update the gliding rates
        for alloc in invest_event.data['assetAllocation']:
            # Allocation used to invest
            invest_event.data['glidingAllocation'][alloc] = invest_event.data['glidingAllocation'][alloc] + invest_event.data['glidingIncrements'][alloc]
        allocation = invest_event.data['glidingAllocation']

    # If not, start with the first allocation and set up the current allocation.
    elif invest_event.data['glidePath'] and 'glidingAllocation' not in invest_event.data:
        allocation = invest_event.data['assetAllocation']
        invest_event.data['glidingAllocation'] = allocation
        
        # Calculate how much to glide for each year for each allocation.
        for alloc in invest_event.data['assetAllocation']:
            # Gliding rate difference for each year
            invest_event.data['glidingIncrements'][alloc] = (invest_event.data['assetAllocation2'][alloc] - invest_event.data['assetAllocation'][alloc]) / (invest_event.data['duration'])
    
    # Choose the amount to invest.
    cash = max(0, cash - invest_event.data['maxCash'])
    if cash <= 0:
        return 0.0

    # Start investing.
    tot_invested = 0
    for investment in investments:
        if investment.asset_type == 'cash':
            continue
        invest_amount = cash * allocation[investment.investment_id]
        investment.value += invest_amount
        tot_invested += invest_amount

    return tot_invested

def rebalance(rebalance_event: EventSeries, investments: list[Investment], year: int) -> float:
    if not check_event_start(rebalance_event, year):
        return 0.0

    # Get the set of investments to rebalance, make it a dict.
    rebalancing_set = {invest.investment_id : invest for invest in investments if invest.investment_id in rebalance_event.data['assetAllocation']}
    
    # Caculate the total value of the listed investments for rebalancing
    total_value = sum(invest.value for invest in rebalancing_set.values())
    
    # Go through the specified investments and rebalance them to the target allocation.
    changed_amount = 0
    for invest_id, target_allocation in rebalance_event.data['assetAllocation'].items():
        if invest_id in rebalancing_set:
            invest = rebalancing_set[invest_id]
            target_value = total_value * target_allocation
            diff = target_value - invest.value
            invest.value += diff
            total_value += diff
            changed_amount += abs(diff)

    return changed_amount

#####################################
# Main algorithm for the simulation #
#####################################

def run_year(scenario: Scenario, year: int, state_tax: StateTax, fed_tax: FederalTax, prev_state_tax: float, prev_fed_tax: float, user_age: int, user_alive: bool, spouse_age: int, spouse_alive: bool) -> dict:
    """
    Run a single year of the simulation.
    """
    # User info
    marital_status = "individual" if not scenario.is_married or not spouse_alive else "couple"
    cash_investment = find_investment(scenario.ivmts, "cash")

    # Get the investments, event series, and RMD strategy
    investments = scenario.get_investments()
    event_series = scenario.get_event_series()
    rmd = scenario.get_rmd_strategy()

    # STEP 1: Update inflation
    inflation_assumption = scenario.inflation_rate
    update_inflation(scenario, fed_tax, state_tax, event_series, inflation_assumption)

    # STEP 2: Calculate gross income
    gross_income_value = gross_income(event_series, year, spouse_alive, user_alive)
    social_security_income = get_social_security(event_series, year, spouse_alive, user_alive)

    # Calculate the current year income and add it to the cash event
    currYearIncome = gross_income_value + 0.15 * social_security_income
    cash_investment.value += currYearIncome

    currYearCash = cash_investment.value

    # STEP 3: RMD
    rmd_amount = perform_rmd(rmd, user_age, investments)

    # STEP 4: Update investments
    capital_gains = update_investments(scenario.ivmt_types, investments)

    # STEP 5: Calculate federal and state income tax
    federal_tax_value = fed_income_tax(fed_tax, currYearIncome, marital_status)
    state_tax_value = state_income_tax(state_tax, currYearIncome, marital_status)

    # Calculate capital gains tax
    federal_tax_value += capital_gains_tax(fed_tax, currYearIncome, capital_gains, marital_status)

    # TODO: STEP 6: Roth conversion
    fed_taxable_income_after_deduction = currYearIncome - fed_tax.bracket[marital_status]['deduction']
    upper_limit = calculate_tax(fed_taxable_income_after_deduction, fed_tax.bracket[marital_status])[1]
    roth_converted = roth_conversion(upper_limit, fed_taxable_income_after_deduction, investments, scenario.roth_strat)

    # STEP 7: Calculate non-discretionary
    non_discresionary_expenses_value = non_discresionary_expenses(event_series, year)
    discretionary_expenses_value = discretionary_expenses(event_series, scenario.spending_strat, year)

    # Subtract previous year's tax and expenses.
    currYearCash -= (prev_fed_tax + prev_state_tax + non_discresionary_expenses_value)
    if currYearCash < 0:
        # If what's left is negative, get money from the investments.
        for invest in scenario.expense_withdrawal_strat:
            invest_obj = find_investment(investments, invest)
            if invest_obj is None:
                raise ValueError(f"Investment {invest} not found in investments list. But it is in the strategy list.")
            if invest_obj.value >= abs(currYearCash):
                invest_obj.value += currYearCash
                currYearCash = 0
                break
            else:
                currYearCash += invest_obj.value
                invest_obj.value = 0

    # Pay discretionary expenses
    q = deque(discretionary_expenses_value)
    while currYearCash > 0 and q:
        expense = q.popleft()
        if currYearCash >= expense:
            currYearCash -= expense
        else:
            # If the current year income is less than the expense, pay partial.
            currYearCash = 0
            break
    
    # Update the cash event with the remaining cash
    cash_investment.value = currYearCash

    # STEP 8: invest in the investments
    invest_event = find_event(event_series, "my investments")
    amount_invested = make_investments(invest_event, investments, year)

    # STEP 9: Rebalance the investments
    rebalance_event = find_event(event_series, "rebalance")
    amount_rebalanced = rebalance(rebalance_event, investments, year)

    # Check if the financial goal is met
    currYearSum = 0
    for invest in investments:
        currYearSum += invest.value

    return {
        'federal_tax': federal_tax_value,
        'state_tax': state_tax_value,
        'rmd': rmd_amount,
        'capital_gains': capital_gains,
        'roth_converted': roth_converted,
        'amount_invested': amount_invested,
        'amount_rebalanced': amount_rebalanced,
        'financial_goal': currYearSum >= scenario.financial_goal
    }

def run_simulation(scenario: Scenario) -> dict:
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
    user_death_age = sample_from_distribution(scenario.life_exp)

    spouse_curr_age = 0
    spouse_death_age = 0
    if scenario.is_married:
        spouse_birth_year = scenario.spouse_birth_yr
        spouse_curr_age = start_year - spouse_birth_year
        spouse_death_age = sample_from_distribution(scenario.spouse_life_exp)
    
    # Start the year counter
    years_to_run = int(max((user_death_age - user_curr_age), (spouse_death_age - spouse_curr_age) if scenario.is_married else 0))

    # Initialize the previous year tax values
    prev_state_tax = 0
    prev_fed_tax = 0

    # Initialize the event series
    initialize_event(scenario.event_series)

    # Run the simulation for each year
    for year in range(start_year, start_year+years_to_run+1):
        # Check if the user or spouse is alive
        user_alive = user_curr_age + year <= user_death_age
        spouse_alive = spouse_curr_age + year <= spouse_death_age if scenario.is_married else False

        # Run the year simulation.
        result = run_year(scenario, year, state_tax, fed_tax, prev_state_tax, prev_fed_tax, user_curr_age, user_alive, spouse_curr_age, spouse_alive)
        prev_state_tax = result['state_tax']
        prev_fed_tax = result['federal_tax']

    return result

if __name__ == "__main__":
    pass