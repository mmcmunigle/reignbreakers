import requests
import json
from time import sleep

class Offers:
    
    def __init__(self):
        self._sent_offers_url = "https://reignmakers.draftkings.com/api/marketplaces/v1/offers/sent?orderByType=OfferPlaced&isDescending=true&offset=0&limit=100&format=json"
        self._active_offers_url = "https://reignmakers.draftkings.com/api/marketplaces/v1/offers/active/merchandise/Collectible/{}?orderByType=Price&isDescending=true&limit=1&offset=0&format=json"
        self._merch_url = "https://reignmakers.draftkings.com/collectibles/{}"
        self.offers = []

    def get_latest_offers(self):
        resp = requests.get(self._sent_offers_url, timeout=5)
        if not resp.ok:
            print(f"Could not pull latest sent offers {resp}")
            return
        
        sent_offers = resp.json().get('merchandiseOffersSent')
        if not sent_offers:
            return
        
        self.offers = self._add_offer_details(sent_offers)

    
    def add_offer_details(self, sent_offers) -> list:
        
        for offer in sent_offers:
            sleep(1)
            merch_key = offer.get('merchandiseKey')
            resp = requests.get(self._active_offers_url.format(merch_key), timeout=2)

            if not resp.ok:
                print(f"Could not get merchandise data for {offer.get('merchandiseName')}")
                continue
            
            all_offers = resp.json().get('merchandiseOffers', [])
            if len(all_offers) > 0:
                top_offer = all_offers[0]
                offer['top_offer'] = top_offer['offerPrice']
                offer['top_user_key'] = top_offer['userKey']
                offer['top_user_name'] = top_offer['userName']
                offer['market_url'] = self._merch_url.format(offer['merchandiseKey'])
        
        return sent_offers

with open('./offers.json') as of:
    sent_offers = json.load(of)

offers = Offers()

offer_details = offers.add_offer_details(sent_offers['merchandiseOffersSent'])

for offer in offer_details:
    if offer['top_user_name'] != 'goober4321':
        print(f"Me: {offer['offerPrice']} Them: {offer['top_offer']} - {offer['market_url']}")