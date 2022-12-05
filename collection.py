import csv
from threading import Thread

import requests


class Collection:
    def __init__(self, username):
        self.user = username
        self.portfolio_url = "https://marketplace.draftkings.com/api/users/v1/portfolios/4278d426-173a-4c2c-826d-045a7424859f?format=json"
        self.all_cards = None
    
    def to_csv(self):
        pass
        # sorted_collection = sorted(self.all_cards, key=lambda d: -d['diff'])
        # field_names = ['name', 'thumbnailUrl', 'rarity', 'team', 'position', 'pp', 'lp', 'diff', 'diff_p', 'sale', 'link']
        # with open('collection.csv', 'w') as csvfile:
        #     writer = csv.DictWriter(csvfile, fieldnames=field_names)
        #     writer.writeheader()
        #     writer.writerows(sorted_collection)

    def update_collection(self):
        response = requests.get(self.portfolio_url)
        cards = []
        for card in response.json()['collectibleEditions']:
            cards.append(card)

        self.all_cards = threaded_process_range(6, cards)
        self.to_csv()


def process_cards(cards, store):
    """process a number of ids, storing the results in a dict"""
    for card in cards:
        ckey = card['collectibleKey']
        for_sale = card["collectibleEditionStatus"] == "ForImmediateSale"
        for attempt in range(5):
            try:
                print(card['name'])
                response = requests.get(f"https://marketplace.draftkings.com/api/marketplaces/v2/listings/collectibles/{ckey}?format=json")
                break
            except:
                print(f"Unable to get collectable data for {card['name']}")
        if attempt == 3:
            print(f"giving up on {card['name']}")
            continue
        purchase_price = card.get('purchasePrice', 0)
        listing =  response.json()['collectibleListing']
        lowest_price = listing.get('lowestListedEditionPrice', 0)
        ufc = 'UFC' if 'UFC' in listing.get('collectionName') else None
        team_attr = [attr for attr in listing['collectibleAttributes'] if attr['displayName'] == 'Team']
        position = [attr for attr in listing['collectibleAttributes'] if attr['displayName'] == 'Position']
        rarity = [attr for attr in listing['collectibleAttributes'] if attr['displayName'] == 'Rarity Tier']
        diff = round(lowest_price - purchase_price, 2)
        diff_p = round((diff * 100) / purchase_price, 2) if purchase_price else None,
        edition = card['editionNumber']
        store.append({
            'name': card['name'].split('(')[0].split(':')[0],
            'edition': edition,
            'thumbnailUrl': card.get('thumbnailUrl'),
            'rarity': rarity[0]['value'],
            'team': ufc or (team_attr[0]['value'] if len(team_attr) else None),
            'position': position[0]['value'] if len(position) else None,
            'pp': purchase_price,
            'lp': lowest_price,
            'diff': diff,
            'diff_p': diff_p,
            'sale': card["saleListingPrice"] if for_sale else None,
            'link': f'https://marketplace.draftkings.com/listings/collectibles/{ckey}/editions/{edition}'
        })
    return store


def threaded_process_range(nthreads, cards):
    """process the id range in a specified number of threads"""
    store = []
    threads = []
    # create the threads
    for i in range(nthreads):
        some_cards = cards[i::nthreads]
        t = Thread(target=process_cards, args=(some_cards, store))
        threads.append(t)

    # start the threads
    [ t.start() for t in threads ]
    # wait for the threads to finish
    [ t.join() for t in threads ]
    return store


