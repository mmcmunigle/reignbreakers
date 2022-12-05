import requests

from send_email import gmail_send_message

ACTIVITY_API = 'https://marketplace.draftkings.com/api/activity/v1/transactions'

SEEN_CARDS = set()

def check_activity():
    transactions = requests.post(ACTIVITY_API, json={
        "EventTypes": ["Listings"],
        "MerchandiseType": "Collectible",
        "CollectionKeys": ["8B8F14FB451944ACA580A1E6BCB95CD4"],
        "MinPrice": 1,
        "MaxPrice": 1900,
        "Limit": 1,
        "Cursor": ""
    }, headers={'Content-Type': 'application/json'})

    latest = transactions.json()['transactions'][0]
    key = latest['merchandiseKey']
    amount = latest['amount']
    if key + str(amount) in SEEN_CARDS:
        print("Repeat Card Found")
        return
    SEEN_CARDS.add(key + str(amount))
    
    rarity = 'Unknown'
    name = None
    for attribute in latest['attributes']:
        if attribute['name'] == 'Rarity Tier':
            rarity = attribute['value']
        elif attribute['name'] == 'Athlete Name':
            name = attribute['value']
    print(latest['merchandiseName'])

    gmail_send_message(f'{name} - {rarity}',f' ${amount} https://marketplace.draftkings.com/listings/collectibles/{key}')

if __name__ == '__main__':
    check_activity()