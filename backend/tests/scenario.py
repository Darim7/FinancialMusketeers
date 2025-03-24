import pytest
from fastapi.testclient import TestClient
from mongomock import MongoClient
from app import app  # Import your FastAPI app

# Mock MongoDB connection
@pytest.fixture
def mock_mongo():
    client = MongoClient()  # Create a mock MongoDB client
    db = client["test_db"]  # Use a test database
    return db

# Use FastAPI's TestClient
client = TestClient(app)

def test_add_scenario(mock_mongo, monkeypatch):
    """
    Test the /api/add_scenario endpoint.
    """

    # Mock the database dependency
    def mock_get_db():
        return mock_mongo

    # Patch the database function in the app
    monkeypatch.setattr("app.get_db", mock_get_db)

    # Sample scenario payload
    scenario_payload = {
        "name": "Test Scenario",
        "marital_status": "individual",
        "birth_years": [1990],
        "life_expectancy": [{"type": "fixed", "value": 85}],
        "investment_types": [],
        "investments": [],
        "event_series": [],
        "inflation_assumption": {"type": "fixed", "value": 0.03},
        "after_tax_contribution_limit": 7000,
        "spending_strategy": [],
        "expense_withdrawal_strategy": [],
        "rmd_strategy": [],
        "roth_conversion_opt": False,
        "roth_conversion_start": 0,
        "roth_conversion_end": 0,
        "roth_conversion_strategy": [],
        "financial_goal": 10000,
        "residence_state": "NY",
    }

    # Make API request
    response = client.post("localhost:8000/api/add_scenario", json=scenario_payload)

    # Assertions
    assert response.status_code == 201
    assert response.json()["message"] == "Scenario added successfully"

    # Check if scenario was inserted into mock DB
    saved_scenario = mock_mongo.scenarios.find_one({"name": "Test Scenario"})
    assert saved_scenario is not None
    assert saved_scenario["marital_status"] == "individual"
