import re
from bson import ObjectId
from flask import Flask, request, jsonify, send_file
import os
import logging
from datetime import datetime
import yaml

from models.user import User
from dbconn import USER_COLLECTION, SCENARIO_COLLECTION, mongo_client, find_document, insert_document, update_document
from models.scenario import Scenario

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

@app.route('/api/test')
def test():
    app.logger.info('Reached test route.')
    res = {"data": "Hello World!"}
    return jsonify(res)

@app.route('/')
def hello():
    app.logger.info('Serving the HTML page')
    return send_file('index.html')

@app.route('/api/get_scenario', methods=['POST'])
def get_scenario():
    try:
        # Get the scenario ID from the query parameters
        scenario_id = request.get_json().get('_id')
        
        if not scenario_id:
            app.logger.error(f'Scenario ID is required received {scenario_id}')
            return jsonify({"error": "Scenario ID is required"}), 400
        
        # Find the scenario by ID
        scenario = find_document(SCENARIO_COLLECTION, {"_id": ObjectId(scenario_id)})
        
        if scenario:
            # Convert ObjectId to string for JSON serialization
            scenario['_id'] = str(scenario['_id'])
            return jsonify({"data": scenario}), 200
        else:
            return jsonify({"error": "Scenario not found"}), 404
    
    except Exception as e:
        app.logger.error(f"Error in get_scenario: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/add_scenario', methods=['POST'])
def add_scenario():
    app.logger.info('Received request to add a scenario.')
    
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400
        
        # Grab User info
        user_email = data['user_email']
        user_name = data['user_name'] 

        # Create objects
        user = User(user_name, user_email)
        scenario = Scenario.from_dict(data['scenario'])
        # Add the scenario ID to the user's list of scenarios
        user.add_scenario(scenario)
        return jsonify({"message": "Scenario added successfully", "data": user.to_dict()}), 201

    except Exception as e:
        app.logger.error(f"Error adding scenario: {e}")
        return jsonify({"error": "Failed to add scenario"}), 500

@app.route('/api/update_scenario', methods=['POST'])
def update_scenario():
    app.logger.info('Reached update_scenario route.')

    # Get the updated scenario data
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    # Get the scenario ID from the request
    scenario_id = data['scenario']['_id']
    if not scenario_id:
        return jsonify({"error": "Scenario ID is required"}), 400

    new_scenario = Scenario.from_dict(data['scenario'])

    # Find the scenario by ID
    scenario = find_document(SCENARIO_COLLECTION, {"_id": scenario_id})
    if not scenario:
        return jsonify({"error": "Scenario not found"}), 404
    
    # Update the scenario data
    cnt = update_document(SCENARIO_COLLECTION, scenario_id, new_scenario, upsert=True).matched_count

    return jsonify({"message": "Scenario updated successfully"}), 200 if cnt > 0 else 500

@app.route('/api/delete_scenario', methods=['POST'])
def delete_scenario():
    app.logger.info('Reached delete_scenario route.')

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    # Get user email and create a user object
    user_email = data['user_email']
    user_name = data['user_name']
    user = User(user_name, user_email)

    # Check if the scenario ID is in the user's list of scenarios
    scenario_id = data['scenario_id']
    if scenario_id not in user.scenarios:
        return jsonify({"error": "Scenario not found"}), 404
    
    # Remove the scenario from the user's list of scenarios
    if user.delete_scenario(scenario_id):
        return jsonify({"message": "Scenario deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete scenario"}), 500

@app.route('/api/export_scenario', methods=['POST'])
def export_scenario():
    app.logger.info('Reached export_scenario route.')

    try:
        # Get the scenario object from the get request
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        # Create objects
        scenario = Scenario.from_dict(data['scenario'])
        fname = f"{datetime.now().strftime('%Y%m%d%H%M%S')}.yaml"
        scenario.export_yaml(fname)
        
        return send_file(fname), 201

    except Exception as e:
        app.logger.error(f"Error adding scenario: {e}")
        return jsonify({"error": "Failed to add scenario"}), 500

# PT: Can you help me on implementing this? I am going to receive the yaml file?
@app.route('/api/import_scenario', methods=['POST'])
def import_scenario():
    app.logger.info('Reached import_scenario route.')

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    # Get user email and create a user object
    user_email = data['user_email']
    user_name = data['user_name']
    user = User(user_name, user_email)

    # Ensure a file is provided
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    # Ensure it's a YAML file
    if not file.filename or not file.filename.endswith(('.yaml', '.yml')):
        return jsonify({"error": "Invalid file type, only YAML is accepted"}), 400
    
    fname = f"uploads/{file.filename}"
    file.save(fname)
    
    try:
        # Parse YAML content
        scenario = Scenario.from_yaml(fname)

        # Add the scenario ID to the user's list of scenarios
        user.add_scenario(scenario)

        return jsonify({"message": "Scenario imported successfully", "data": user.to_dict()}), 201

    except yaml.YAMLError as e:
        return jsonify({"error": f"Invalid YAML format: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to import scenario: {str(e)}"}), 500

# PT: Can you help me to implement a route to get a user profile by email?
@app.route('/api/get_user', methods=['GET'])
def get_user():
    app.logger.info('Reached get_user route.')

    # Get the user email from the query parameters
    user_email = request.args.get('user_email')
    user_name = request.args.get('user_name')
    
    if not user_email:
        return jsonify({"error": "User email is required"}), 400
    
    # Find the user by email
    user = find_document(USER_COLLECTION, {"email": user_email})
    
    if not user:
        # Create a new user using the user name and email
        if not user_name:
            return jsonify({"error": "User name is required"}), 400
        new_user = User(user_name, user_email)
        new_user.save_to_db()
        user = new_user.to_dict()

    # Convert ObjectId to string for JSON serialization
    user['_id'] = str(user['_id'])
    return jsonify({"data": user}), 200

if __name__ == "__main__":
    app.logger.info('Starting Flask application')
    app.run(host="0.0.0.0", port=8000, debug=True)
    app.logger.info('Stopping Flask application')

    # Close the database connection.
    app.logger.info('Closing the database connection')
    mongo_client.close()
    app.logger.info('Database connection closed')
