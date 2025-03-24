from typing import Dict
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.collection import Collection
from bson import ObjectId

# Connect to the db
mongo_client = MongoClient(host=['mongodb://root:example@mongodb:27017'])
db = mongo_client['financial_planner']

"""
PT: Hey, I want to create two collections if the db doesn't have it yet,
one is called scenario, another is called user.
"""
# Create collection if not created.
if 'scenario' not in db.list_collection_names():
    db.create_collection('scenario')

if 'user' not in db.list_collection_names():
    db.create_collection('user')

# Return the collection objects
SCENARIO_COLLECTION = db['scenario']
USER_COLLECTION = db['user']


"""
PT: Can you add index to the collections?
"""
# Ensure indexes in user collection.
USER_COLLECTION.create_index([('email', ASCENDING)], unique=True)


"""
PT: Can you write some methods that checks if a document already exists, inserting to a collection etc?
"""
def insert_document(collection: Collection, document: Dict) -> ObjectId:
    """
    Insert a document into the collection.
    :param collection: MongoDB collection object
    :param document: Dictionary representing the document to insert
    :return: Inserted document ID
    """
    return collection.insert_one(document).inserted_id

def update_document(collection: Collection, object_id: str | ObjectId, update_values, upsert=False):
    """
    Update a document in the collection.
    :param collection: MongoDB collection object
    :param object_id: ObjectId of the document
    :param update_values: Dictionary of values to update
    :param upsert: If True, insert if document does not exist
    :return: Update result object
    """
    return collection.update_one({'_id': ObjectId(object_id)}, {'$set': update_values}, upsert=upsert)

def document_exists(collection: Collection, query):
    """
    Check if a document exists in the collection.
    :param collection: MongoDB collection object
    :param query: Query dictionary to search for the document
    :return: True if document exists, False otherwise
    """
    return collection.count_documents(query, limit=1) > 0

def find_document(collection: Collection, query, projection=None):
    """
    Find a single document in the collection.
    :param collection: MongoDB collection object
    :param query: Query dictionary to search for the document
    :param projection: Fields to return (optional)
    :return: Document or None if not found
    """
    return collection.find_one(query, projection)

def delete_document(collection: Collection, object_id: str | ObjectId):
    """
    Delete a document in the collection.
    :param collection: MongoDB collection object
    :param query: Query dictionary to search for the document
    :return: Delete result object
    """
    return collection.delete_one({'_id': ObjectId(object_id)})
