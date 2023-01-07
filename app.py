

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Blueprint, Flask, jsonify

from collection import Collection
from ufc_activity import check_activity

app = Flask(__name__)
api = Blueprint('api', __name__)

my_collection = Collection('goober321')


@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@api.route('/inventory', methods=['GET'])
def home():
    return jsonify(my_collection.all_cards)


def update_collection():
    my_collection.update_collection()


def initialize_app():
    scheduler = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 50})
    scheduler.add_job(check_activity, 'interval', seconds=5)
    scheduler.add_job(update_collection, 'interval', minutes=20)
    scheduler.start()

    update_collection()

    app.register_blueprint(api, url_prefix='/api')
    app.run()


if __name__ == '__main__':
    initialize_app()
