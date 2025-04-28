from models.scenario import Scenario
from typing import Self, List
from bson import ObjectId

from models.scenario import Scenario
from models.exportable import Exportable
from dbconn import SCENARIO_COLLECTION, USER_COLLECTION, document_exists, insert_document, find_document, delete_document, update_document

import logging

logger = logging.getLogger(__name__)

class User(Exportable):
    def __init__(self, name: str, email:str, scenarios: List[ObjectId]=None):
        self.name=name
        self.email=email
        self.scenarios=scenarios if scenarios else []

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
        # import app
        self.savedId = insert_document(USER_COLLECTION, self.to_dict())
        # app.logger.info(f"User Init: {self.name} | {self.email} | ID: {self.savedId}")
        return self.savedId
    
    def update_to_db(self) -> bool:
        res = update_document(USER_COLLECTION, self.savedId, self.to_dict())
        return res.modified_count > 0
    
    # Utilities to update User information
    def update_name(self, name:str) -> str:
        return ""
    
    # Utilities for List of Scenarios
    def add_scenario(self, scenario: Scenario) -> None:
        scenario_id = scenario.save_to_db()
        self.scenarios.append(scenario_id)
        self.update_to_db()
        return
    
    def delete_scenario(self, scenario_id: ObjectId | str) -> bool:
        if scenario_id not in self.scenarios:
            return False
        # Remove the scenario from the user's list of scenarios
        self.scenarios.remove(scenario_id)
        if self.update_to_db() > 0:
            # Delete the scenario from the user collections
            scenario_id = ObjectId(scenario_id) if isinstance(scenario_id, str) else scenario_id
            # Delete the scenario from the database
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
    