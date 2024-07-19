import requests
from datetime import datetime, timedelta
from ufc.fight_odds import UFCOdds
from ufc.tapology_scraper import TapologyScraper
from ufc.utils import correct_name

class UfcEvents:
    def __init__(self):
        self._api_key = "639603f083e2494481fc33c5167b1523"
        self._schedule_url = "https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/2024?key={}"
        self._event_url = "https://api.sportsdata.io/v3/mma/scores/json/Event/{}?key={}"
        self._fighter_url = "https://api.sportsdata.io/v3/mma/scores/json/Fighter/{}?key={}"
        self._event_details = []
        self._fighter_events = {}
        self._ufc_odds = UFCOdds()
        self._vote_scraper = TapologyScraper()

    
    def get_ufc_event_details(self):
        return self._event_details

    def get_fighter_events(self):
        return self._fighter_events

    def get_ufc_schedule(self) -> list[object]:
        resp = requests.get(self._schedule_url.format(self._api_key), timeout=10)
        if not resp.ok:
            print("Could not get UFC Schedule")
            return {}

        future_events = []
        for event in resp.json():
            if not event['Active'] or datetime.strptime(event['Day'], "%Y-%m-%dT%H:%M:%S") < (datetime.today() - timedelta(days=1)):
                continue
            if 'Dana White' in event['Name'] or 'Ultimate' in event['Name']:
                continue

            future_events.append({
                'event_id': event['EventId'],
                'title': event['Name'],
                'date': event['Day'].split('T')[0]
            })
        
        print(future_events)

        return future_events

    def get_event_fighters(self, event_id: int) -> list[object]:
        resp = requests.get(self._event_url.format(event_id, self._api_key), timeout=10)

        if not resp.ok:
            print("Could not get UFC Event Details")
            return {}

        fighters = []
        for fight in resp.json()['Fights']:
            if not fight['Active'] or len(fight['Fighters']) == 0:
                continue

            for fighter in fight['Fighters']:
                name = (fighter.get('FirstName') or '') + ' ' + (fighter.get('LastName') or '')
                name = correct_name(name.strip())
                record = str(fighter.get('PreFightWins') or 0) + '-' + str(fighter.get('PreFightLosses') or 0)

                fighters.append({
                    'name': name,
                    'record': record,
                    'moneyline': self._ufc_odds.get_fighter_odds(name) or fighter.get('Moneyline'),
                    'vote': self._vote_scraper.get_fighter_votes(name)
                })

            # Ensure favorite is stored in the array first for consistency
            if fighters[-1]['moneyline'] and fighters[-1]['moneyline'] < 0:
                fighters[-1], fighters[-2] = fighters[-2], fighters[-1]
        
        print(fighters)

        return fighters

    def get_all_future_events(self):
        self._ufc_odds.pull_latest_odds()
        self._vote_scraper.scrape_upcoming_ufc_events()

        event_details = self.get_ufc_schedule()[0:8]

        for event in event_details:
            fighters = self.get_event_fighters(event['event_id'])
            event['fighters'] = fighters

            for fighter in fighters:
                self._fighter_events[fighter['name']] = (
                    event['title'].split(':')[0].strip() + '  ' +
                    datetime.strptime(event['date'], "%Y-%m-%d").strftime("%m-%d")
                )

        print(event_details)
            
        self._event_details = event_details
