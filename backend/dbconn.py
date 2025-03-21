from pymongo import MongoClient

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
