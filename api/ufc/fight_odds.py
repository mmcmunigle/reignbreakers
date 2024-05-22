import requests
from datetime import datetime, timedelta
from ufc.utils import correct_name

class UFCOdds:
    def __init__(self):
        self._odds_url = "https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds?regions=us&markets=h2h&oddsFormat=american&apiKey=7505f017e6ab83729ce0ffd91e5bd0a1"
        self._fight_odds = []
        self._fighter_odds = {}
    

    def get_odds(self):
        return self._fight_odds
    

    def get_fighter_odds(self, name: str) -> str:
        return self._fighter_odds[name] if name in self._fighter_odds else ''
        

    def get_event_fighters(self):
        fighter_events = {}
        for event in self._fight_odds:
            for fighter in event['fighters']:
                fighter_events[fighter] = event['date']

        return fighter_events


    def pull_latest_odds(self):
        resp = requests.get(self._odds_url, timeout=10).json()
        fights = {}

        for fight in resp:
            date = datetime.strptime(fight['commence_time'], "%Y-%m-%dT%H:%M:%S%z")

            # UFC events after midnight show up as Sunday instead of Saturday
            if date.weekday() == 6:
                date = date - timedelta(days=1)

            # UFC Fights only fall on Saturday
            if date.weekday() == 5:
                date_str = date.strftime("%Y-%m-%d")

                if len(fight['bookmakers']):
                    odds = fight['bookmakers'][0]['markets'][0]['outcomes']
                    if odds[0]['price'] > 0:
                        odds[0], odds[1] = odds[1], odds[0]

                    odds[0]['name'] = correct_name(odds[0]['name'].strip())
                    odds[1]['name'] = correct_name(odds[1]['name'].strip())

                    if date_str in fights:
                        fights[date_str].append(odds)
                    else:
                        fights[date_str] = [odds]
                
                self._fighter_odds[odds[0]['name']] = odds[0]['price']
                self._fighter_odds[odds[1]['name']] = odds[1]['price']

        fight_odds = []
        for date, event_details in fights.items():
            fight_odds.append({
                'title': date,
                'date': date,
                'fighters': [fighter for matchup in event_details for fighter in matchup],
            })

        self._fight_odds = fight_odds
