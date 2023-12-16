

import json

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Blueprint, Flask, jsonify, make_response

from collection import Collection
from marketplace import UFCMarket, GolfMarket
from ufc.ufc_activity import check_activity

app = Flask(__name__)
api = Blueprint('api', __name__)

my_collection = Collection('goober321')
ufc_market = UFCMarket()
golf_market = GolfMarket()
events_file = "./ufc/events.json"

@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@api.route('/ufc-inventory', methods=['GET'])
def get_inventory():
    with open(events_file) as f:
        events =  json.load(f)
        fighters = {}
        for event in events:
            for matchup in event['matchups']:
                for fighter in matchup:
                    fighters[fighter['name']] = {
                        'name': event['title'],
                        'date': event['date'],
                    }
        ufc_cards = my_collection.get_ufc()
        for card in ufc_cards:
            if fighters.get(card['name'], None):
                card['event'] = fighters[card['name']]
    return jsonify(ufc_cards)


@api.route('/ufc-market', methods=['GET'])
def get_ufc_market_data():
    return jsonify(ufc_market.merchandise)


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
                    fighter['details'] = ufc_market.merchandise.get(fighter['name'])
        return events


@api.route('/ranked-fighters', methods=['GET'])
def get_ranked_fighters():
    ranked_fighters = []
    with open('./ufc/ranked_fighters.txt') as ranked_file:
        for name in ranked_file.read().splitlines():
            ranked_fighters.append({
                'name': name,
                'details': ufc_market.merchandise.get(name)
            })
        return jsonify(ranked_fighters)


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
    my_collection.update_collection(ufc_market.merchandise)
    my_collection.update_collection(golf_market.merchandise)


def update_ufc_market_data():
    ufc_market.update_merchandise()


def update_golf_market_data():
    golf_market.update_merchandise()


def initialize_app():
    scheduler = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 50})
    # scheduler.add_job(check_activity, 'interval', seconds=5)
    scheduler.add_job(update_collectables, 'interval', minutes=2)
    scheduler.add_job(update_ufc_market_data, 'interval', minutes=1)
    scheduler.add_job(update_golf_market_data, 'interval', seconds=20)
    scheduler.start()

    update_golf_market_data()
    update_collectables()

    app.register_blueprint(api, url_prefix='/api')
    app.run(host='0.0.0.0')


if __name__ == '__main__':
    initialize_app()
