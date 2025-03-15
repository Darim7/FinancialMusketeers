from scenario import Scenario
from typing import Iterable
from datetime import date
class User:
    def __init__(self, name: str, email:str , profile_path:str, scenarios: Iterable[Scenario]=[]):
        self.name=name
        self.email=email
        self.profile_path=profile_path
        self.scenarios=scenarios
        #TODO: DO VALIDATION CHECKS
        self.insert()

    # Utilities to Add & Remove from DB
    def insert(self):
        pass
    def remove(self):
        pass
    
    # Utilities to update User information
    def update_name(self, name:str)->str:
        pass
    def update_email(self, email:str)->str:
        pass
    
    # Utilities for List of Scenarios
    def add_scenario(scenario:Scenario)->None:
        pass
    def get_scenario(scenario:Scenario)->Scenario:
        pass
    def update_scenario(scenario:Scenario)->Scenario:
        pass
    def delete_scenario(scenario:Scenario)->Scenario:
        pass
    
    # Utilities for sharing scenarios
    ### TODO: Decide whether we need to return anything for share & revoke
    def share(self, email:str, scenario:Scenario):
        pass
    def revoke(self, email:str, scenario:Scenario):
        pass
    
    # Miscallaneous Utilities
    def get_age(bday:date)->float:
        pass