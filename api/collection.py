import requests
import json
from datetime import datetime

COLLECTION_KEYS = {
    'f226cd946f594de99b5c6aaf2ffcf4a0': 'pass',
    '8b8f14fb451944aca580a1e6bcb95cd4': 'ufc',
    '27c4291759404392ab5db212ea61597e': 'ufc',
    '5eae2563006d4fe0ae1405a31567c60c': 'football',
    '6972b16d088c41ea860b598b397aed5f': 'golf',
}

class Collection:
    def __init__(self, username):
        self.user = username
        self.portfolio_url = "https://marketplace.draftkings.com/api/users/v1/portfolios/4278d426-173a-4c2c-826d-045a7424859f?format=json"
        self._all_collectables = []

    def update_collection(self):
        response = requests.get(self.portfolio_url)
        if not response.ok:
            print("COULD NOT GET PORTFOLIO DATA")
            return

        self._all_collectables = []
        for card in response.json()['collectibleEditions']:
            self.process_cards(card)

    def add_ufc_event_details(self, event_details):
        for ufc_card in self.get_ufc():
            if ufc_card['name'] in event_details:
                ufc_card['event'] = event_details[ufc_card['name']]

    def get_all(self):
        return self._all_collectables

    def get_ufc(self):
        return [card.__dict__ for card in self._all_collectables if card.type == 'ufc' and card.useable_all_season]
    
    def get_golf(self):
        return [card.__dict__ for card in self._all_collectables if card.type == 'golf']
    
    def get_football(self):
        return [card.__dict__ for card in self._all_collectables if card.type == 'football']
    
    def get_pass(self):
        return [card.__dict__ for card in self._all_collectables if card.type == 'pass']

    def process_cards(self, card):
        collection_key = card['collectionKey']

        if (COLLECTION_KEYS.get(collection_key) == 'pass'):
            collectable = Pass(card)
        elif (COLLECTION_KEYS.get(collection_key) == 'ufc'):
            collectable = UFCard(card)
        elif (COLLECTION_KEYS.get(collection_key) == 'football'):
            collectable = FootballCard(card)
        elif (COLLECTION_KEYS.get(collection_key) == 'golf'):
            collectable = GolfCard(card)
        else:
            collectable = Collectable(card)

        # collectable.add_market_data(market)
        self._all_collectables.append(collectable)


class Collectable:
    type = 'other'
    rarity = None
    ckey = None
    edition = None
    set_name = None
    name = None
    useable_all_season = None
    thumbnail_url = None
    purchase = None
    market = None
    sale = None
    offer = None
    link = None
    attributes = {}

    def __init__(self, card):
        self.parse_attributes(card)

        ckey = card['collectibleKey']
        edition = card['editionNumber']
        self.rarity = self.attributes['rarity_tier'].lower()
        self.edition = edition
        self.set_name = self.attributes.get('set_name')
        self.collection = card.get('collectionName', '')
        self.name = card['name']
        self.useable_all_season = True,
        self.thumbnail_url = card.get('thumbnailUrl')
        self.purchase = card.get('purchasePrice', 0)
        self.market = card.get('lowestListedEditionPrice', 0)
        self.sale = card.get('saleListingPrice', 0)
        self.offer = card.get('topOfferPrice', 0)
        self.link = f'https://marketplace.draftkings.com/listings/collectibles/{ckey}/editions/{edition}'

    def parse_attributes(self, card):
        for attribute in card['collectibleAttributes']:
            name = attribute['displayName'].replace(' ', '_').lower()
            self.attributes[name] = attribute['value']
    
    def add_market_data(self, market):
        pass


class PlayerCard(Collectable):
    purchase_price = 0
    market = 0
    diff = 0

    def __init__(self, card):
        super().__init__(card)
        self.type = 'player'
        self.name = self.attributes.get('athlete_name')

    def add_market_data(self, market):
        pass
        # market_data = market_price = diff = None
        # if market.get(self.name):
        #     market_data = market[self.name][self.rarity].get(self.set_name)

        # purchase_price = self.purchase_price or 0

        # if market_data:
        #     market_price = market_data['price']
        #     diff = round(market_price - purchase_price, 2)

        # self.market = market_price or 0
        # self.diff = diff or 0


class Pass(Collectable):
    def __init__(self, card):
        super().__init__(card)
        self.type = 'pass'


class UFCard(PlayerCard):
    event = None

    def __init__(self, card):
        super().__init__(card)
        self.type = 'ufc'
        self.event = None
        self.event_date = self.attributes.get('event_date', None)

        if '23' in self.collection and 'UFC' in self.set_name:
            self.useable_all_season = False
        if 'Event' in self.set_name and datetime.strptime(self.event_date, "%m/%d/%Y") < datetime.today():
            self.useable_all_season = False


class FootballCard(PlayerCard):
    team = None
    position = None

    def __init__(self, card):
        super().__init__(card)
        self.type = 'football'
        self.team = self.attributes.get('team')
        self.position = self.attributes.get('position')


class GolfCard(PlayerCard):
    def __init__(self, card):
        super().__init__(card)
        self.type = 'golf'


# def get_current_lineups():
#     lineup_url = "https://api.draftkings.com/nftgames/v1/lineups/users/4278d426-173a-4c2c-826d-045a7424859f/entries/nft/upcomingandlive?format=json&includeUpcoming=True&includeLive=True"
#     resp = requests.get(lineup_url)
#     if not resp.ok:
#         print("Failed to get lineup informatin")
#         print(resp.text)
#         resp = LINEUPS
#     else:
#         resp = resp.json()
    
#     cards_in_lineups = {}
#     entries = resp['contests']['upcomingContestEntries']
#     for entry in entries:
#         for card in entry['draftedCollectibleEditions']:
#             card_id = card['collectibleEditionIdentifier'].replace('-','')
#             cards_in_lineups[card_id] = {
#                 'gameKey': card['gameKey'],
#                 'status': card['competitionSummaries']['competitionStatus']
#             }
#     print(cards_in_lineups)
#     return cards_in_lineupss