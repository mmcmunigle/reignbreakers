

import json

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Blueprint, Flask, jsonify, make_response

from collection import Collection
from marketplace import UFCMarket, GolfMarket
from ufc.fight_odds import UFCOdds
from ufc.ufc_activity import check_activity


app = Flask(__name__)
api = Blueprint('api', __name__)

my_collection = Collection('goober321')
ufc_market_23 = UFCMarket("8b8f14fb451944aca580a1e6bcb95cd4")
ufc_market_24 = UFCMarket("27c4291759404392ab5db212ea61597e")
golf_market = GolfMarket()
ufc_odds = UFCOdds()

events_file = "./ufc/events.json"

@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@api.route('/ufc-inventory', methods=['GET'])
def get_inventory():
    ufc_cards = my_collection.get_ufc()
    return jsonify(ufc_cards)


@api.route('/ufc-market-2023', methods=['GET'])
def get_ufc_market_23_data():
    return jsonify(ufc_market_23.merchandise)


@api.route('/ufc-market-2024', methods=['GET'])
def get_ufc_market_24_data():
    return jsonify(ufc_market_24.merchandise)


@api.route('/pga-market', methods=['GET'])
def get_pga_market_data():
    return jsonify(golf_market.merchandise)


@api.route('/ufc-events', methods=['GET'])
def get_ufc_events():
    with open(events_file) as f:
        events =  json.load(f)
        for event in events:
            for matchup in event['matchups']:
                for fighter in matchup:
                    fighter['details'] = ufc_market_24.merchandise.get(fighter['name'])
        return events


@api.route('/ufc-events/v2', methods=['GET'])
def get_ufc_events_v2():
    events = ufc_odds.get_odds()
    for event_details in events:
        for fighter in event_details['fighters']:
                fighter['details'] = {
                    '2024': ufc_market_24.merchandise.get(fighter['name']),
                    '2023': ufc_market_23.merchandise.get(fighter['name'])
                }

    return events

@api.route('/ufc-odds', methods=['GET'])
def get_ufc_odds():
    return ufc_odds.get_odds()


@api.route('/ufc-event-fighters', methods=['GET'])
def get_ufc_event_fighters():
    return ufc_odds.get_event_fighters()


@api.route('/pga-rankings', methods=['GET'])
def get_ranked_golfers():
    ranked_golfers = []
    # wgr = {}
    # with open('./pga/rankings.txt') as rankings_file:
    #     for rank, name in enumerate(rankings_file.read().splitlines()):
    #         wgr[name] = rank
    with open('./pga/rankings.txt') as ranked_file:
        for rank, name in enumerate(ranked_file.read().splitlines()):
            ranked_golfers.append({
                'name': name,
                'rank': rank + 1,
                # 'wgr': wgr.get(name),
                'details': golf_market.merchandise.get(name)
            })
        return jsonify(ranked_golfers)


def update_collectables():
    my_collection.update_collection()
    print(ufc_odds.get_event_fighters())
    my_collection.add_ufc_event_details(ufc_odds.get_event_fighters())
    # my_collection.update_collection(ufc_market_23.merchandise)
    # my_collection.update_collection(golf_market.merchandise)


def update_ufc_market_data():
    ufc_market_23.update_merchandise()
    ufc_market_24.update_merchandise()


def update_golf_market_data():
    pass
    # golf_market.update_merchandise()

def update_ufc_odds():
    ufc_odds.pull_latest_odds()

def initialize_app():
    scheduler = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 50})
    # scheduler.add_job(check_activity, 'interval', seconds=5)
    scheduler.add_job(update_collectables, 'interval', minutes=1, replace_existing=True)
    scheduler.add_job(update_ufc_market_data, 'interval', minutes=15, replace_existing=True)
    scheduler.add_job(update_golf_market_data, 'interval', minutes=200)
    scheduler.add_job(update_ufc_odds, 'interval', minutes=600, replace_existing=True)
    scheduler.start()

    update_ufc_odds()
    update_ufc_market_data()
    # update_golf_market_data()
    update_collectables()

    app.register_blueprint(api, url_prefix='/api')
    app.run(host='0.0.0.0')


if __name__ == '__main__':
    initialize_app()
