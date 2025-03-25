import re
from flask import Flask, request, jsonify, send_file
import os
import logging
from datetime import datetime

from models.user import User
from dbconn import SCENARIO_COLLECTION, mongo_client, find_document, update_document
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

@app.route('/api/get_scenario', methods=['GET'])
def get_scenario():
    try:
        # Get the scenario ID from the query parameters
        scenario_id = request.args.get('id')
        
        if not scenario_id:
            return jsonify({"error": "Scenario ID is required"}), 400
        
        # Find the scenario by ID
        scenario = find_document(SCENARIO_COLLECTION, {"_id": scenario_id})
        
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

@app.route('/api/export_scenario', methods=['GET'])
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

@app.route('/api/import_scenario', methods=['POST'])
def import_scenario():
    app.logger.info('Reached import_scenario route.')
    return jsonify({"data": "Hello World!"})

if __name__ == "__main__":
    app.logger.info('Starting Flask application')
    app.run(host="0.0.0.0", port=8000, debug=True)
    app.logger.info('Stopping Flask application')

    # Close the database connection.
    app.logger.info('Closing the database connection')
    mongo_client.close()
    app.logger.info('Database connection closed')
