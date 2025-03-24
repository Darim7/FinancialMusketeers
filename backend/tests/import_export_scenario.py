import pytest
from pymongo import MongoClient
import mongomock
from deepdiff import DeepDiff

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.scenario import Scenario
from models.investment import AssetType, Investment
from models.event_series import Expense, EventSeries, Income
from utils.yaml_utils import ScenarioYamlUtils

# TODO: Scenario Import 
def test_import_couple():
    # convert Yaml to instance
    # instance to database
    # Check if the data is written correctly 
    file_name='imports/scenario_couple.yaml'
    scenario_yaml=ScenarioYamlUtils(file_name)

    scenario=Scenario.from_yaml(file_name)
    
    assert scenario_yaml.verify_yaml_to_scenario(scenario)

def test_import_individual():
    file_name='imports/scenario_individual.yaml'
    scenario_yaml=ScenarioYamlUtils(file_name)

    scenario=Scenario.from_yaml(file_name)
    
    assert scenario_yaml.verify_yaml_to_scenario(scenario)==True

def test_import_individual_no_rco():
    # convert Yaml to instance
    # instance to database
    # Check if the data is written correctly 
    file_name='imports/scenario_individual_no_rco.yaml'
    scenario_yaml=ScenarioYamlUtils(file_name)

    scenario=Scenario.from_yaml(file_name)
    
    assert scenario_yaml.verify_yaml_to_scenario(scenario)
# TODO: Scenario Export 

def test_export_individual():
    # TODO: Ask GPT to generate a Scenario Object and the expected yaml file
    # Creating Asset Types
    cash = {
    "name": "cash",
    "description": "Cash held in account",
    "returnAmtOrPct": "amount",
    "returnDistribution": {"type": "fixed", "value": 0},
    "expenseRatio": 0,
    "incomeAmtOrPct": "percent",
    "incomeDistribution": {"type": "fixed", "value": 0},
    "taxability": True
    }

    sp500 = {
        "name": "S&P 500",
        "description": "S&P 500 index fund",
        "returnAmtOrPct": "percent",
        "returnDistribution": {"type": "GBM", "mu": 0.06, "sigma": 0.02},
        "expenseRatio": 0.001,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "normal", "mean": 0.01, "stdev": 0.005},
        "taxability": True
    }

    bonds = {
        "name": "tax-exempt bonds",
        "description": "NY tax-exempt bonds",
        "returnAmtOrPct": "amount",
        "returnDistribution": {"type": "fixed", "value": 0},
        "expenseRatio": 0.004,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "normal", "mean": 0.03, "stdev": 0.01},
        "taxability": False
    }


    # Creating Investments
    investment1 = {"name":cash, "value":100, "taxStatus":"non-retirement", "id":"cash"}
    investment2 = {"name": "S&P 500", "value": 10000, "taxStatus": "non-retirement", "id": "S&P 500 non-retirement"}
    investment3 = {"name": "tax-exempt bonds", "value": 2000, "taxStatus": "non-retirement", "id": "tax-exempt bonds"}
    investment4 = {"name": "S&P 500", "value": 10000, "taxStatus": "pre-tax", "id": "S&P 500 pre-tax"}
    investment5 = {"name": "S&P 500", "value": 2000, "taxStatus": "after-tax", "id": "S&P 500 after-tax"}

    investments = [investment1, investment2, investment3, investment4, investment5]

    # Creating Event Series
    salary_event = {
        "name":"salary",
        "start":{"type": "fixed", "value": 2025},
        "duration":{"type": "fixed", "value": 40},
        "type":"income",
        "initialAmount": 75000,
        "changeAmtOrPct": "amount",
        "changeDistribution": {"type": "uniform", "lower": 500, "upper": 2000},
        "inflationAdjusted": False,
        "userFraction": 1.0,
        "socialSecurity": False
    }

    food_event = {
        "name":"food",
        "start":{"type": "startWith", "eventSeries": "salary"},
        "duration":{"type": "fixed", "value": 200},
        "type":"expense",
        "initialAmount": 5000,
        "changeAmtOrPct": "percent",
        "changeDistribution": {"type": "normal", "mean": 0.02, "stdev": 0.01},
        "inflationAdjusted": True,
        "userFraction": 1.0,
        "discretionary": False
    }

    vacation_event = {
        "name":"vacation",
        "start":{"type": "startWith", "eventSeries": "salary"},
        "duration":{"type": "fixed", "value": 40},
        "type":"expense",
        "initialAmount": 1200,
        "changeAmtOrPct": "amount",
        "changeDistribution": {"type": "fixed", "value": 0},
        "inflationAdjusted": True,
        "userFraction": 1.0,
        "discretionary": True
    }

    event_series = [salary_event, food_event, vacation_event]

    # Creating the Scenario instance
    scenario = Scenario(
        name="Retirement Planning Scenario",
        marital_status="individual",
        birth_years=[1985],
        life_expectancy=[{"type": "fixed", "value": 80}],
        investment_types=[cash, sp500, bonds],
        investments=investments,
        event_series=event_series,
        inflation_assumption={"type": "fixed", "value": 0.03},
        after_tax_contribution_limit=7000,
        spending_strategy=["vacation"],
        expense_withdrawal_strategy=["S&P 500 non-retirement", "tax-exempt bonds"],
        rmd_strategy=["S&P 500 pre-tax"],
        roth_conversion_opt=True,
        roth_conversion_start=2050,
        roth_conversion_end=2060,
        roth_conversion_strategy=["S&P 500 pre-tax"],
        financial_goal=10000,
        residence_state="NY",
        shared=[]
    )
    scenario.export_yaml('exports/result_individual.yaml')

    # Open the 2 yaml files
    res_yaml='exports/result_individual.yaml'
    expect_yaml='expected_out/expected_individual.yaml'
    res_utils=ScenarioYamlUtils(res_yaml)
    expect_utils=ScenarioYamlUtils(expect_yaml)
    res=res_utils.get_yaml()
    expect=expect_utils.get_yaml()
    diff = DeepDiff(res, expect, ignore_order=True)
    assert not diff, f"YAML files {res_yaml} and {expect_yaml} differ: {diff}"

def test_export_couple():
    # Asset Types
    cash = {
        "name": "cash",
        "description": "Cash held in account",
        "returnAmtOrPct": "amount",
        "returnDistribution": {"type": "fixed", "value": 0},
        "expenseRatio": 0,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "fixed", "value": 0},
        "taxability": True
    }   

    sp500 = {
        "name": "S&P 500",
        "description": "S&P 500 index fund",
        "returnAmtOrPct": "percent",
        "returnDistribution": {"type": "GBM", "mu": 0.06, "sigma": 0.02},
        "expenseRatio": 0.001,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "normal", "mean": 0.01, "stdev": 0.005},
        "taxability": True
    }   

    bonds = {
        "name": "tax-exempt bonds",
        "description": "NY tax-exempt bonds",
        "returnAmtOrPct": "amount",
        "returnDistribution": {"type": "fixed", "value": 0},
        "expenseRatio": 0.004,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "normal", "mean": 0.03, "stdev": 0.01},
        "taxability": False
    }   

    # Investments
    investments = [
        {"name": "cash", "value": 500, "taxStatus": "non-retirement", "id": "cash"},
        {"name": "S&P 500", "value": 20000, "taxStatus": "non-retirement", "id": "S&P 500 non-retirement"},
        {"name": "tax-exempt bonds", "value": 5000, "taxStatus": "non-retirement", "id": "tax-exempt bonds"},
        {"name": "S&P 500", "value": 15000, "taxStatus": "pre-tax", "id": "S&P 500 pre-tax"},
        {"name": "S&P 500", "value": 3000, "taxStatus": "after-tax", "id": "S&P 500 after-tax"}
    ]   

    # Event Series
    event_series = [
        {
            "name": "salary",
            "start": {"type": "fixed", "value": 2025},
            "duration": {"type": "fixed", "value": 40},
            "type": "income",
            "data": {
                "initialAmount": 120000,
                "changeAmtOrPct": "amount",
                "changeDistribution": {"type": "uniform", "lower": 1000, "upper": 5000},
                "inflationAdjusted": False,
                "userFraction": 0.6,
                "socialSecurity": True
            }
        },
        {
            "name": "spouse salary",
            "start": {"type": "fixed", "value": 2025},
            "duration": {"type": "fixed", "value": 35},
            "type": "income",
            "data": {
                "initialAmount": 90000,
                "changeAmtOrPct": "amount",
                "changeDistribution": {"type": "uniform", "lower": 800, "upper": 3000},
                "inflationAdjusted": False,
                "userFraction": 0.4,
                "socialSecurity": True
            }
        },
        {
            "name": "mortgage",
            "start": {"type": "fixed", "value": 2025},
            "duration": {"type": "fixed", "value": 30},
            "type": "expense",
            "data": {
                "initialAmount": 1500,
                "changeAmtOrPct": "amount",
                "changeDistribution": {"type": "fixed", "value": 0},
                "inflationAdjusted": False,
                "userFraction": 1.0,
                "discretionary": False
            }
        }
    ]


    # event_series = [salary_event, spouse_salary_event, mortgage_expense]

    # Creating the Scenario instance for a married couple
    scenario_married = Scenario(
        name="Married Couple Retirement Plan",
        marital_status="couple",
        birth_years=[1980, 1982],
        life_expectancy=[
            {"type": "fixed", "value": 85},
            {"type": "normal", "mean": 88, "stdev": 3}
        ],
        investment_types=[cash, sp500, bonds],
        investments=investments,
        event_series=event_series,
        inflation_assumption={"type": "fixed", "value": 0.03},
        after_tax_contribution_limit=14000,
        spending_strategy=["mortgage"],
        expense_withdrawal_strategy=["S&P 500 non-retirement", "tax-exempt bonds"],
        rmd_strategy=["S&P 500 pre-tax"],
        roth_conversion_opt=True,
        roth_conversion_start=2055,
        roth_conversion_end=2065,
        roth_conversion_strategy=["S&P 500 pre-tax"],
        financial_goal=500000,
        residence_state="CA",
        shared=[]
    )
    scenario_married.export_yaml('exports/result_couple.yaml')

    # Open the 2 yaml files
    res_yaml='exports/result_couple.yaml'
    expect_yaml='expected_out/expected_couple.yaml'
    res_utils=ScenarioYamlUtils(res_yaml)
    expect_utils=ScenarioYamlUtils(expect_yaml)
    res=res_utils.get_yaml()
    expect=expect_utils.get_yaml()
    diff = DeepDiff(res, expect, ignore_order=True)
    assert not diff, f"YAML files {res_yaml} and {expect_yaml} differ: {diff}"

def test_export_individual_no_rco():
    # Creating Asset Types
    cash = {
    "name": "cash",
    "description": "Cash held in account",
    "returnAmtOrPct": "amount",
    "returnDistribution": {"type": "fixed", "value": 0},
    "expenseRatio": 0,
    "incomeAmtOrPct": "percent",
    "incomeDistribution": {"type": "fixed", "value": 0},
    "taxability": True
    }

    sp500 = {
        "name": "S&P 500",
        "description": "S&P 500 index fund",
        "returnAmtOrPct": "percent",
        "returnDistribution": {"type": "GBM", "mu": 0.06, "sigma": 0.02},
        "expenseRatio": 0.001,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "normal", "mean": 0.01, "stdev": 0.005},
        "taxability": True
    }

    bonds = {
        "name": "tax-exempt bonds",
        "description": "NY tax-exempt bonds",
        "returnAmtOrPct": "amount",
        "returnDistribution": {"type": "fixed", "value": 0},
        "expenseRatio": 0.004,
        "incomeAmtOrPct": "percent",
        "incomeDistribution": {"type": "normal", "mean": 0.03, "stdev": 0.01},
        "taxability": False
    }

    # Creating Investments
    investment1 = {
        "asset": "cash",
        "amount": 500,
        "account_type": "non-retirement",
        "description": "cash"
    }

    investment2 = {
        "asset": "S&P 500",
        "amount": 20000,
        "account_type": "non-retirement",
        "description": "S&P 500 non-retirement"
    }

    investment3 = {
        "asset": "tax-exempt bonds",
        "amount": 5000,
        "account_type": "non-retirement",
        "description": "tax-exempt bonds"
    }

    investment4 = {
        "asset": "S&P 500",
        "amount": 15000,
        "account_type": "pre-tax",
        "description": "S&P 500 pre-tax"
    }

    investment5 = {
        "asset": "S&P 500",
        "amount": 3000,
        "account_type": "after-tax",
        "description": "S&P 500 after-tax"
    }

    investments = [investment1, investment2, investment3, investment4, investment5]

    # Creating Event Series
    salary_event = {
        "name": "salary",
        "start": {"type": "fixed", "value": 2025},
        "duration": {"type": "fixed", "value": 40},
        "type": "income",
        "initialAmount": 100000,
        "changeAmtOrPct": "amount",
        "changeDistribution": {"type": "uniform", "lower": 1000, "upper": 5000},
        "inflationAdjusted": False,
        "userFraction": 1.0,
        "socialSecurity": True
    }

    rent_expense = {
        "name": "rent",
        "start": {"type": "fixed", "value": 2025},
        "duration": {"type": "fixed", "value": 30},
        "type": "expense",
        "initialAmount": 2000,
        "changeAmtOrPct": "percent",
        "changeDistribution": {"type": "fixed", "value": 0.02},
        "inflationAdjusted": True,
        "userFraction": 1.0,
        "discretionary": False
    }

    event_series = [salary_event, rent_expense]


    # Creating the Scenario instance WITHOUT Roth Conversion Optimizer
    scenario_no_roth = Scenario(
        name="Retirement Plan Without Roth Conversion",
        marital_status="individual",
        birth_years=[1980],
        life_expectancy=[{"type": "fixed", "value": 85}],
        investment_types=[cash, sp500, bonds],
        investments=investments,
        event_series=event_series,
        inflation_assumption={"type": "fixed", "value": 0.03},
        after_tax_contribution_limit=7000,
        spending_strategy=["rent"],
        expense_withdrawal_strategy=["S&P 500 non-retirement", "tax-exempt bonds"],
        rmd_strategy=["S&P 500 pre-tax"],
        roth_conversion_opt=False,  # No Roth Conversion Optimizer
        roth_conversion_start=0,
        roth_conversion_end=0,
        roth_conversion_strategy=[],
        financial_goal=200000,
        residence_state="TX",
        shared=[]
    )
    # Open the 2 yaml files
    res_yaml='exports/result_individual_no_rco.yaml'
    expect_yaml='expected_out/expected_individual_no_rco.yaml'
    scenario_no_roth.export_yaml(res_yaml)
    res_utils=ScenarioYamlUtils(res_yaml)
    expect_utils=ScenarioYamlUtils(expect_yaml)
    res=res_utils.get_yaml()
    expect=expect_utils.get_yaml()
    diff = DeepDiff(res, expect, ignore_order=True)
    assert not diff, f"YAML files {res_yaml} and {expect_yaml} differ: {diff}"