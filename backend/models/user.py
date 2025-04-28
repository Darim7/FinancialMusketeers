from models.scenario import Scenario
from typing import Self, List
from bson import ObjectId

from models.scenario import Scenario
from models.exportable import Exportable
from dbconn import SCENARIO_COLLECTION, USER_COLLECTION, document_exists, insert_document, find_document, delete_document

import logging

logger = logging.getLogger(__name__)

class User(Exportable):
    def __init__(self, name: str, email:str, scenarios: List[ObjectId]=[]):
        self.name=name
        self.email=email
        self.scenarios=scenarios

        logger.info("HELLO FROM USER.PY")

        # logger.info(f"User {self.name} with email {self.email} created.")

        # Check if the user already exists in the database
        if document_exists(USER_COLLECTION, {'email': email}):
            res = find_document(USER_COLLECTION, {'email': email})
            # logger.info(f"User {email} already exists in the database.")
            logger.info("what is res", res)
            self.savedId = res['_id'] if res else None
            # logger.info("what is savedId", self.savedId)
            self.scenarios = res['scenarios'] if res else []
        else:
            logger.info(f"User {email} does not exist in the database. Creating a new user.")
            self.save_to_db()
        
    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'email': self.email,
            'scenarios': [str(s) for s in self.scenarios]
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
    
    def delete_scenario(self, scenario_id: ObjectId | str) -> bool:
        if scenario_id not in self.scenarios:
            return False
        
        if delete_document(SCENARIO_COLLECTION, scenario_id).deleted_count > 0:
            return True
        else:
            return False
    
    # Utilities for sharing scenarios
    ### TODO: Decide whether we need to return anything for share & revoke
    def share(self, email:str, scenario:Scenario):
        pass
    def revoke(self, email:str, scenario:Scenario):
        pass
    