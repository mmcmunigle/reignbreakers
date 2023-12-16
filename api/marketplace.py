import requests


class Market:
    def __init__(self):
        self._marketplace_url = "https://marketplace.draftkings.com/fetcher/8b8f14fb451944aca580a1e6bcb95cd4/merchandise?offset=50&limit=50000&collectionKey=8b8f14fb451944aca580a1e6bcb95cd4&isDescending=false&merchandiseType=Collectible&includeOfferDetails=true&_data=routes%2F_main.fetcher.%24collectionKey.merchandise"
        self._collection_key = None
        self.merchandise = {}

    def update_merchandise(self):
        response = requests.get(self._marketplace_url.format(self._collection_key, self._collection_key))
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
    def __init__(self):
        super().__init__()
        self._collection_key = "8b8f14fb451944aca580a1e6bcb95cd4"

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

        if set_name not in ["Heatwave", "UFC 281", "UFC 282", "Genesis", "Takedown", "Booster", "Crafting", "UFC Fight Night 12.9.23"]:
            return

        if not set_name in self.merchandise[name][rarity].keys():
            self.merchandise[name][rarity][set_name] = {}

        self.merchandise[name][rarity][set_name] = {
            'price': round(collectable['lowestListedEditionPrice'], 2),
            'quantity': collectable['quantity'],
            'link': link,
            'division': attributes.get('division'),
            'champion': attributes.get('champion_status'),
            'edition_tier': attributes.get('edition_tier'),
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
