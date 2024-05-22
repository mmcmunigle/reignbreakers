import requests
from datetime import datetime, timedelta

class Market:
    def __init__(self):
        self._marketplace_url = "https://marketplace.draftkings.com/fetcher/{}/merchandise?offset=50&limit=10000&collectionKey={}&isDescending=false&merchandiseType=Collectible&includeOfferDetails=true{}"
        self._collection_key = None
        self._request_params = ""
        self.merchandise = {}

    def update_merchandise(self):
        print(self._marketplace_url.format(self._collection_key, self._collection_key, self._request_params))
        response = requests.get(self._marketplace_url.format(self._collection_key, self._collection_key, self._request_params))
        if response.ok:
            self.merchandise = {}
            self.process_merchandise(response.json()['merchandise'])
        else:
            print(f"Error getting merchandise: {response.text}")
        
        print("Successfully Updated Market Data")

    def process_merchandise(self, market_data):
        """process a all merchandice cards"""
        for collectable in market_data:
            attributes = parse_attributes(collectable)
            self.parse_collectable(collectable, attributes)

    def parse_collectable(self, collectable, attributes):
        """
        Should be implemented by the child class
        """
        raise NotImplementedError


class UFCMarket(Market):
    def __init__(self, collection_key, query_params = ""):
        super().__init__()
        self._collection_key = collection_key
        self._request_params = query_params

    def parse_collectable(self, collectable, attributes):
        rarity = attributes.get('rarity_tier').lower()
        set_name = attributes.get('set_name')
        useable_all_season = attributes.get('useable_all_season') == 'Yes' or attributes.get('usable_all_season') == 'Yes'
        event_date = attributes.get('event_date')
        series = attributes.get('series', '')

        if '2024' in series and set_name == 'Event' and datetime.strptime(event_date, "%m/%d/%Y") + timedelta(days=3) < datetime.today():
            return

        if '2023' in series and not useable_all_season:
            return

        name = attributes['athlete_name']
        if name not in self.merchandise:
            self.merchandise[name] = {
                'core': {},
                'rare': {},
                'elite': {},
                'legendary': {},
                'reignmaker': {}
            }
        
        link = f"https://reignmakers.draftkings.com/collectibles/{collectable['merchandiseKey']}/"

        if not set_name in self.merchandise[name][rarity].keys():
            self.merchandise[name][rarity][set_name] = {}

        self.merchandise[name][rarity][set_name] = {
            'price': round(collectable['lowestListedEditionPrice'], 2),
            'quantity': collectable['quantity'],
            'link': link,
            'division': attributes.get('division'),
            'champion': attributes.get('champion_status'),
            'edition_tier': attributes.get('edition_tier'),
            'useable_all_season': useable_all_season,
            'event_date': event_date.replace('/', '-') if event_date else None
        }


class GolfMarket(Market):
    def __init__(self):
        super().__init__()
        self._collection_key = "6972b16d088c41ea860b598b397aed5f"

    def parse_collectable(self, collectable, attributes):
        name = attributes['athlete_name']
        if name not in self.merchandise:
            self.merchandise[name] = {
                'core': {},
                'rare': {},
                'elite': {},
                'legendary': {},
                'reignmaker': {}
            }
        
        rarity = attributes.get('rarity_tier').lower()
        set_name = attributes.get('set_name')
        link = f"https://marketplace.draftkings.com/listings/collectibles/{collectable['merchandiseKey']}/"

        if not set_name in  self.merchandise[name][rarity].keys():
            self.merchandise[name][rarity][set_name] = {}

        self.merchandise[name][rarity][set_name] = {
            'price': round(collectable['lowestListedEditionPrice'], 2),
            'quantity': collectable['quantity'],
            'link': link,
            'edition_tier': attributes.get('edition_tier'),
        }


def parse_attributes(content):
    attributes = {}
    for attribute in content['collectionAttributes']:
        name = attribute['displayName'].replace(' ', '_').lower()
        attributes[name] = attribute['value']

    return attributes
