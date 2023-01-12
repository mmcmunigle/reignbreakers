import requests

from send_email import gmail_send_message

ACTIVITY_API = 'https://marketplace.draftkings.com/api/activity/v1/transactions'

SEEN_CARDS = set()

def check_activity():
    transactions = requests.post(ACTIVITY_API, json={
        "EventTypes": ["Listings"],
        "MerchandiseType": "Collectible",
        "CollectionKeys": ["8B8F14FB451944ACA580A1E6BCB95CD4"],
        "MinPrice": 0,
        "MaxPrice": 2200,
        "Limit": 5,
        "Cursor": ""
    }, headers={'Content-Type': 'application/json'})

    for transaction in transactions.json()['transactions']:
        key = transaction['merchandiseKey']
        amount = transaction['amount']
        edition = transaction['editionNumber']
        if key + str(amount) in SEEN_CeARDS:
            print("Repeat Card Found")
            return
        SEEN_CARDS.add(key + str(amount))
        min_sale, min_list = get_marketplace_data(key)

        name = None
        for attribute in transaction['attributes']:
            if attribute['name'] == 'Rarity Tier':
                rarity = attribute['value']
            elif attribute['name'] == 'Athlete Name':
                name = attribute['value']
            elif attribute['name'] == 'Set Name':
                set_name = attribute['value']

        if set_name == "UFC Fight Night 1.14.23":
            if (rarity == 'Core' and int(amount) < 0.5
                or rarity == 'Rare' and int(amount) < 5.0
                or rarity == 'Elite' and int(amount) < 20.0
                or rarity == 'Legendary' and int(amount) < 100.0
                or rarity == 'Reignmaker' and int(amount) < 400.0):
                print("Found a potential Fight Night card")
            else:
                continue

        if set_name == "Genesis":
            if (rarity == 'Core' and int(amount) < 2.0
                or rarity == 'Rare' and int(amount) < 13.0
                or rarity == 'Elite' and int(amount) < 75.0
                or rarity == 'Legendary' and int(amount) < 300.0
                or rarity == 'Reignmaker' and int(amount) < 800.0):
                print("Found a potential Fight Night card")
            else:
                continue


        
        if (amount <= min_sale or amount <= min_list):
            print(f'{name} - {rarity} - ${amount}')
            gmail_send_message(f'{name} {rarity}#{edition} ${amount}',
                            f'https://marketplace.draftkings.com/listings/collectibles/{key}')
        else:
            print(f'MEH {name} - {rarity} - AMT ${amount} - SALE ${min_sale} - LIST ${min_list} ')


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