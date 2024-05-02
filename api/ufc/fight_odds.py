import requests
from datetime import datetime, timedelta

class UFCOdds:
    def __init__(self):
        self._odds_url = "https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds?regions=us&markets=h2h&oddsFormat=american&apiKey=b2d720a23ab769a3d0697a74ff069a2e"
        self._fight_odds = {}
    

    def get_odds(self):
        # for date, event_details in self._fight_odds.items():
        #     print(event_details)
        #     for matchup in event_details:
        #         for fighter in matchup:
        #             print(fighter)

        event_odds = []
        for date, event_details in self._fight_odds.items():
            event_odds.append({
                'title': date,
                'date': date,
                'fighters': [fighter for matchup in event_details for fighter in matchup],
            })

        return event_odds

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

                    odds[0]['name'] = correct_names(odds[0]['name'])
                    odds[1]['name'] = correct_names(odds[1]['name'])

                    if date_str in fights:
                        fights[date_str].append(odds)
                    else:
                        fights[date_str] = [odds]
        
        self._fight_odds = fights
    

def correct_names(name):
    name_corrections = {
        'Sergey Pavlovich': 'Sergei Pavlovich',
        'Elves Brenner': 'Elves Brener',
        'José Aldo': 'Jose Aldo',
        'Paulo Henrique Costa': 'Paulo Costa',
    }
    if name in name_corrections:
        return name_corrections[name]
    else:
        return name