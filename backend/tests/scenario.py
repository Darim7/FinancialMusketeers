import pytest
import sys
import os
import requests
import json
from bson import ObjectId
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app  # Import your Flask app and DB function
from dbconn import SCENARIO_COLLECTION, USER_COLLECTION
from models.user import User
from utils.yaml_utils import ScenarioYamlUtils

def cleanup(obj_id:str, user_email:str):
    # Cleanup
    # Convert the string to ObjectId
    object_id = ObjectId(obj_id)
    SCENARIO_COLLECTION.delete_one({"_id": object_id})
    USER_COLLECTION.delete_one({"email": user_email})
def add_scenario(file:str):
    scenario_yaml=ScenarioYamlUtils(file)
    scenario_payload=scenario_yaml.get_yaml()

    user_name="Test"
    user_email="test@financialmusketeers.org"
    # user = User(user_name, user_email)
    
    data= {
        "user_name": user_name,
        "user_email": user_email,
        "scenario": scenario_payload
    }
    # data=json.dumps(data)
    # Send POST request to add scenario
    response = requests.post("http://flask_server:8000/api/add_scenario", json=data, headers={'Content-Type': 'application/json'})

    # Assertions
    assert response.status_code == 201
    res_json=response.json()
    assert res_json["message"] == "Scenario added successfully"
    
    # Unpack body
    user_data=res_json["data"]
    new_object_id=user_data['scenarios'][-1]

    return (new_object_id, user_email)
def test_add_scenario():
    scenario_yaml=ScenarioYamlUtils('imports/scenario_individual.yaml')
    scenario_payload=scenario_yaml.get_yaml()

    user_name="Test"
    user_email="test@financialmusketeers.org"
    # user = User(user_name, user_email)
    
    data= {
        "user_name": user_name,
        "user_email": user_email,
        "scenario": scenario_payload
    }
    # data=json.dumps(data)
    # Send POST request to add scenario
    response = requests.post("http://flask_server:8000/api/add_scenario", json=data, headers={'Content-Type': 'application/json'})

    # Assertions
    assert response.status_code == 201
    res_json=response.json()
    assert res_json["message"] == "Scenario added successfully"
    
    # Unpack body
    user_data=res_json["data"]
    new_object_id=user_data['scenarios'][-1]

    # Verify scenario exists in the mock DB
    saved_scenario = SCENARIO_COLLECTION.find_one({"_id": ObjectId(new_object_id)})
    assert saved_scenario is not None
    assert saved_scenario["maritalStatus"] == "individual"
    cleanup(new_object_id, user_email)
    

def test_get_scenario():
    new_obj_id, user_email=add_scenario('imports/scenario_individual.yaml')
    
    response=requests.get('http://flask_server:8000/api/get_scenario', json={"id": new_obj_id}, headers={'Content-Type': 'application/json'})
    assert response.status_code==200
    res_json=response.json()
    
    # Verify that the scenario is equal to the object id we are requesting for
    assert res_json["_id"]==new_obj_id
    
    cleanup(new_obj_id, user_email)