

import json

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Blueprint, Flask, jsonify

from collection import Collection
from merchandise import UFCMerchandise
from ufc_activity import check_activity

app = Flask(__name__)
api = Blueprint('api', __name__)

my_collection = Collection('goober321')
ufc_market = UFCMerchandise()


@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@api.route('/inventory', methods=['GET'])
def get_inventory():
    return jsonify(my_collection.all_collectables)


@api.route('/ufc_market', methods=['GET'])
def get_ufc_market_data():
    return jsonify(ufc_market.merchandise)


@api.route('/ufc_events', methods=['GET'])
def get_ufc_events():
    with open('./ufc_events.json') as events_file:
        events =  json.load(events_file)
        for event in events:
            for matchup in event['matchups']:
                for fighter in matchup:
                    fighter['details'] = ufc_market.merchandise.get(fighter['name'])
        return events


@api.route('/ranked_fighters', methods=['GET'])
def get_ranked_fighters():
    ranked_fighters = []
    with open('./ranked_fighters.txt') as ranked_file:
        fighter_names = ranked_file.read().splitlines()
        for name in fighter_names:
            ranked_fighters.append({
                'name': name,
                'details': ufc_market.merchandise.get(name)
            })

        return jsonify(ranked_fighters)


def update_collectables():
    my_collection.update_collection(ufc_market.merchandise)


def update_market_data():
    ufc_market.update_merchandise()


def initialize_app():
    scheduler = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 50})
    scheduler.add_job(check_activity, 'interval', seconds=5)
    scheduler.add_job(update_collectables, 'interval', minutes=2)
    scheduler.add_job(update_market_data, 'interval', minutes=1)
    scheduler.start()

    update_market_data()
    update_collectables()

    app.register_blueprint(api, url_prefix='/api')
    app.run()


if __name__ == '__main__':
    initialize_app()
