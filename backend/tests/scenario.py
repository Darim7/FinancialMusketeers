import pytest
from pymongo import MongoClient
import mongomock
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.scenario import Scenario
from utils.yaml_utils import ScenarioYamlUtils

@pytest.fixture
def mock_db():
    client=mongomock.MongoClient()
    return client['test-db']
# TODO: Scenario Import 
def test_import_couple():
    # convert Yaml to instance
    # instance to database
    # Check if the data is written correctly 
    file_name='imports/scenario_couple.yaml'
    scenario_yaml=ScenarioYamlUtils(file_name)

    scenario=Scenario.from_yaml(file_name)
    
    assert scenario_yaml==scenario

def test_import_individual():
    file_name='imports/scenario_individual.yaml'
    scenario_yaml=ScenarioYamlUtils(file_name)

    scenario=Scenario.from_yaml(file_name)
    
    assert scenario_yaml==scenario
    

# TODO: Scenario Export 
# export_yaml(self, filename) 