import pytest
# import sys
# import os
import requests
import json
import time
from bson import ObjectId
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app  # Import your Flask app and DB function
from dbconn import SCENARIO_COLLECTION, USER_COLLECTION
from models.user import User
from tests.utils.yaml_utils import ScenarioYamlUtils
import uuid


@pytest.fixture(scope="function")
def scenario_data(request):
    # Get scenario file from marker or default
    file = getattr(request, 'param', 'imports/scenario_individual.yaml')
    scenario_yaml = ScenarioYamlUtils(file)
    scenario_payload = scenario_yaml.get_yaml()
    uid=uuid.uuid4()
    user_email = f'test_{uid}@financialmusketeers.org'

    with open('utils/user_data.json', 'r') as f:
        user_data = json.load(f)
    user_name = f'Test_{uid}'

    user_data={
        "user_name": user_name,
        "user_email": user_email
    }
    
    # with open('utils/user_data.json', 'w') as f:
    #     json.dump(user_data, f)
    data = {
        "user_name": user_name,
        "user_email": user_email,
        "scenario": scenario_payload
    }

    assert USER_COLLECTION.delete_one({"email": user_email}) is not None

    response = requests.post(
        "http://flask_server:8000/api/add_scenario",
        json=data,
        headers={'Content-Type': 'application/json'}
    )


    assert response.status_code == 201
    res_json = response.json()
    print("POST Response Data:", json.dumps(res_json["data"], indent=2))

    assert res_json["message"] == "Scenario added successfully"

    new_object_id = res_json["data"]["scenarios"][-1]

    yield {
        "object_id": new_object_id,
        "user_email": user_email,
        'user_name': user_name,
        'scenario': scenario_payload
    }

    # Teardown
    SCENARIO_COLLECTION.delete_one({"_id": ObjectId(new_object_id)})
    USER_COLLECTION.delete_one({"email": user_email})
def test_add_scenario(scenario_data):
    new_object_id=scenario_data['object_id']
    user= USER_COLLECTION.find_one({"email": scenario_data['user_email']})
    print(f'user: {user}')
    # Verify scenario exists in the mock DB
    saved_scenario = SCENARIO_COLLECTION.find_one({"_id": ObjectId(new_object_id)})
    assert saved_scenario is not None
    assert saved_scenario["maritalStatus"] == "individual"
    # cleanup(new_object_id, user_email)
    

def test_get_scenario(scenario_data):
    new_obj_id=scenario_data['object_id']
    # Send GET request to retrieve the scenario    
    response=requests.post('http://flask_server:8000/api/get_scenario', json={"_id": new_obj_id}, headers={'Content-Type': 'application/json'})
    
    assert response.status_code==200
    res_json=response.json()
    user= USER_COLLECTION.find_one({"email": scenario_data['user_email']})
    print(f'user: {user}')
    # Verify that the scenario is equal to the object id we are requesting for
    assert res_json['data']["_id"]==new_obj_id

def test_update_scenario(scenario_data):
    new_obj_id = scenario_data['object_id']
    scenario = scenario_data['scenario']
    # Construct data for the update
    scenario['_id'] = new_obj_id
    scenario['name'] = 'Updated Scenario'
    # Send POST request to update the scenario 
    response=requests.post('http://flask_server:8000/api/update_scenario', json={"scenario": scenario}, headers={'Content-Type': 'application/json'})
    # print(f"Response: {response.json()}")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['message'] == 'Scenario updated successfully'
    
    # Verify that the scenario is updated in the DB
    updated_scenario = SCENARIO_COLLECTION.find_one({"_id": ObjectId(new_obj_id)})
    assert updated_scenario is not None 
    assert updated_scenario["name"] == "Updated Scenario"

    
def test_get_user(scenario_data):
    with open('utils/user_data.json', 'r') as f:
        user_data=json.load(f)
    # Add a scenario to the mock DB
    new_obj_id=scenario_data['object_id']
    user_name=scenario_data['user_name']
    user_email=scenario_data['user_email']
    print(f"user email: {scenario_data['user_email']}")
    user= USER_COLLECTION.find_one({"email": scenario_data['user_email']}) 
    # Send GET request to retrieve the user
    response=requests.get('http://flask_server:8000/api/get_user', params={"user_name": user_name, "user_email": user_email}, headers={'Content-Type': 'application/json'})
    assert response.status_code==200
    res_json=response.json()
    
    scenarios=SCENARIO_COLLECTION.find({})
    
    print(res_json['data'])
    # Verify that the user information is correct
    assert res_json['data']['email']==user['email']
    assert res_json['data']['_id']==str(user['_id'])
    assert res_json['data']['name']==user['name']
    scenarios=res_json['data']['scenarios']
    assert len(scenarios)==1
    assert scenarios[0]==new_obj_id
