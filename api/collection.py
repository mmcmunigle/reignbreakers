import csv
from threading import Thread

import requests


class Collection:
    def __init__(self, username):
        self.user = username
        self.portfolio_url = "https://marketplace.draftkings.com/api/users/v1/portfolios/4278d426-173a-4c2c-826d-045a7424859f?format=json"
        self.all_collectables = None

    def update_collection(self, market):
        response = requests.get(self.portfolio_url)
        cards = []
        for card in response.json()['collectibleEditions']:
            cards.append(card)

        lineup_cards = {}

        self.all_collectables = process_cards(cards, market, lineup_cards)


def process_cards(cards, market, lineup_cards):
    """process a number of ids, storing the results in a dict"""
    collectables = []
    for card in cards:
        attributes = parse_attributes(card)
        ckey = card['collectibleKey']
        edition = card['editionNumber']
        rarity = attributes['rarity_tier'].lower()
        set_name = attributes.get('set_name')

        if not set_name:
            print(attributes)
        name = attributes.get('athlete_name')
        if not name:
            name = card['name']

        market_data = market_price = diff = diff_p = None
        if market.get(name) and set_name:
            market_data = market[name][rarity].get(set_name, None)
        
        lineup = True if lineup_cards.get(f"{ckey}{edition}") else False
        if lineup:
            print(f"LINEUP: {name}")

        purchase_price = card.get('purchasePrice', 0)

        if market_data:
            market_price = market_data['price']
            diff = round(market_price - purchase_price, 2)
            diff_p = round((diff * 100) / purchase_price, 2) if purchase_price else None,

        collectables.append({
            'name': name,
            'edition': edition,
            'thumbnailUrl': card.get('thumbnailUrl'),
            'rarity': rarity,
            'set_name': set_name,
            'lineup': lineup,
            'team': attributes.get('team') if attributes.get('team') else 'UFC',
            'position': attributes.get('position') if attributes.get('position') else None,
            'purchase': card.get('purchasePrice', 0),
            'sale': card.get('saleListingPrice', 0),
            'market': market_price or None,
            'diff': diff or None,
            'diff_p': diff_p or None,
            'link': f'https://marketplace.draftkings.com/listings/collectibles/{ckey}/editions/{edition}'
        })

    return collectables


def get_current_lineups():
    lineup_url = "https://api.draftkings.com/nftgames/v1/lineups/users/4278d426-173a-4c2c-826d-045a7424859f/entries/nft/upcomingandlive?format=json&includeUpcoming=True&includeLive=True"
    resp = requests.get(lineup_url)
    if not resp.ok:
        print("Failed to get lineup informatin")
        print(resp.text)
        resp = LINEUPS
    else:
        resp = resp.json()
    
    cards_in_lineups = {}
    entries = resp['contests']['upcomingContestEntries']
    for entry in entries:
        for card in entry['draftedCollectibleEditions']:
            card_id = card['collectibleEditionIdentifier'].replace('-','')
            cards_in_lineups[card_id] = {
                'gameKey': card['gameKey'],
                'status': card['competitionSummaries']['competitionStatus']
            }
    print(cards_in_lineups)
    return cards_in_lineups

def parse_attributes(card):
    attributes = {}
    for attribute in card['collectibleAttributes']:
        name = attribute['displayName'].replace(' ', '_').lower()
        attributes[name] = attribute['value']

    return attributes
