import requests

from archive.send_email import gmail_send_message

ACTIVITY_API = 'https://marketplace.draftkings.com/api/activity/v1/transactions'

SEEN_CARDS = set()

WATCH_RULES = []

INACTIVE_FIGHTERS = {
    'Glover Teixeira': 'Retired',
    'Tim Elliott': 'Injured',
    'Jeffery Molina': 'Suspended',
    'Calvin Kattar': 'Injured',
    'Shamil Abdurakhimov': 'Cut',
    'Blagoy Ivanov': 'Bad',
    'Miesha Tate': 'Might not fight',
    'Tracy Cortez': 'Not Sure',
    'Stipe Miocic': 'Might not fight',
    'Katlyn Cerminara': 'Dont want',
    'Neil Magny': 'Not Good',
    'Lina Lansberg': 'Old',
    'Francis Ngannou': 'Retired',
}

def check_activity():
    transactions = requests.post(ACTIVITY_API, json={
        "EventTypes": ["Listings"],
        "MerchandiseType": "Collectible",
        "CollectionKeys": ["8B8F14FB451944ACA580A1E6BCB95CD4"],
        "MinPrice": 0,
        "MaxPrice": 2200,
        "Limit": 50,
        "Cursor": ""
    }, headers={'Content-Type': 'application/json'})

    for transaction in transactions.json()['transactions']:
        key = transaction['merchandiseKey']
        amount = transaction['amount']
        edition = transaction['editionNumber']
        if key + str(amount) in SEEN_CARDS:
            continue
        SEEN_CARDS.add(key + str(amount))
        # min_sale, min_list = get_marketplace_data(key)

        name = None
        for attribute in transaction['attributes']:
            if attribute['name'] == 'Rarity Tier':
                rarity = attribute['value']
            elif attribute['name'] == 'Athlete Name':
                name = attribute['value']
            elif attribute['name'] == 'Set Name':
                set_name = attribute['value']
        
        if name in INACTIVE_FIGHTERS.keys():
            continue
        
        for rule in WATCH_RULES:
            if set_name == rule['set'] and rarity == rule['rarity']:
                print(f'{name} - {rarity} - ${amount}')
                gmail_send_message(f'{name} {rarity}#{edition} ${amount}',
                                    f'https://marketplace.draftkings.com/listings/collectibles/{key}')


        if set_name == "Genesis":
            if (rarity == 'Core' and int(amount) < 2.0
                or rarity == 'Rare' and int(amount) < 12.0
                or rarity == 'Elite' and int(amount) < 50.0
                or rarity == 'Legendary' and int(amount) < 190.0
                or rarity == 'Reignmaker' and int(amount) < 500.0):
                print("Found a potential Genesis card")
                print(f'{name} - {rarity} - ${amount}')
                gmail_send_message(f'{name} {rarity}#{edition} ${amount}',
                                   f'https://marketplace.draftkings.com/listings/collectibles/{key}')


def get_marketplace_data(merchandise_key):
    base_marketplace_url = "https://marketplace.draftkings.com/api/marketplaces"
    listings_url = f"{base_marketplace_url}/v1/listings/collectibles/{merchandise_key}/editions?limit=8&format=json"
    sales_url = f"{base_marketplace_url}/v2/transactions/collectibles/{merchandise_key}/?limit=8&eventTypes=Sales&format=json"

    listings = requests.get(listings_url, timeout=2).json()
    sales = requests.get(sales_url, timeout=2).json()

    min_sale = 10000
    for sale in sales['transactions']:
        min_sale = min(sale['amount'], min_sale)
    
    min_list = 10000
    for listing in listings['editionListings']:
        min_list = min(listing['saleListingPrice'], min_list)

    return min_sale, min_list


if __name__ == '__main__':
    check_activity()