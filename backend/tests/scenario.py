import pytest
from pymongo import MongoClient
import mongomock
from models.scenario import Scenario

@pytest.fixture
def mock_db():
    client=mongomock.MongoClient()
    return client['test-db']
# TODO: Scenario Import 
def test_import(mock_db):
    # convert Yaml to instance
    # instance to database
    # Check if the data is written correctly 
    
    pass

# TODO: Scenario Export 
# export_yaml(self, filename) 