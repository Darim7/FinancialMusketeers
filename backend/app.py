from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient
import os
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# Connect to the db
db = MongoClient(host=['mongodb://root:example@mongodb:27017'])

@app.route('/')
def hello():
    app.logger.info('Serving the HTML page')
    return send_file('index.html')

if __name__ == "__main__":
    app.logger.info('Starting Flask application')
    app.run(host="0.0.0.0", port=8000, debug=True)
    app.logger.info('Stopping Flask application')