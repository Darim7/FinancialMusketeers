from scenario import Scenario
from typing import Self, List
from datetime import date
class User:
    def __init__(self, name: str, email:str , profile_path:str, scenarios: Iterable[Scenario]=[]):
        self.name=name
        self.email=email
        self.scenarios=scenarios

        # Check if the user already exists in the database
        if document_exists(USER_COLLECTION, {'email': email}):
            res = find_document(USER_COLLECTION, {'email': email})
            self.savedId = res['_id'] if res else None
            self.scenarios = res['scenarios'] if res else []
        else:
            self.save_to_db()
        
    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'email': self.email,
            'scenarios': self.scenarios
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return cls(
            name=data['name'],
            email=data['email'],
            scenarios=data['scenarios']
        )

    # Utilities to Add & Remove from DB
    def save_to_db(self) -> ObjectId:
        self.savedId = insert_document(USER_COLLECTION, self.to_dict())
        return self.savedId
    
    # def remove(self):
    #     pass
    
    # Utilities to update User information
    def update_name(self, name:str) -> str:
        return ""
    
    # Utilities for List of Scenarios
    def add_scenario(self, scenario: Scenario) -> None:
        scenario_id = scenario.save_to_db()
        self.scenarios.append(scenario_id)
        return
    
    # def get_scenario(scenario:Scenario)->Scenario:
    #     pass
    def update_scenario(self, scenario:Scenario) -> Scenario:
        pass
    def delete_scenario(self, scenario:Scenario) -> Scenario:
        pass
    
    # Utilities for sharing scenarios
    ### TODO: Decide whether we need to return anything for share & revoke
    def share(self, email:str, scenario:Scenario):
        pass
    def revoke(self, email:str, scenario:Scenario):
        pass
    