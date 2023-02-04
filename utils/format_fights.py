# New fight data should be copied and pasted directly from Wikipedia
# in the following format:
#       Women's Strawweight bout: Jessica Penne vs. Tabatha Ricci[2]
#       Bantamweight bout: Da'Mon Blackshear vs. Farid Basharat[8]
import json

events = []
with open('./new_fights.txt') as fh:
    lines = fh.read().splitlines()
    for line in lines:
        if 'UFC' in line:
            event_details = line.split('(')
            print(event_details[0])
            events.append({
                "name": event_details[0],
                "date": event_details[1].split(')')[0],
                "type": "UFC",
                "payout": 125000,
                "matchups": []
            })
        elif line:
            matchups = line.split('-')
            for matchup in matchups:
                if not matchup:
                    continue
                fighters = matchup.split('vs.')
                if len(fighters) < 2:
                    continue
                events[len(events)-1]['matchups'].append([{
                    "name": fighters[0].split('(')[0].split('*')[0].strip().replace('ú', 'u').replace('Ľ', 'L'),
                    "record": "0-0-0",
                    "odds": "N/A",
                    "card": "N/A"
                }, {
                    "name": fighters[1].split('(')[0].split('*')[0].strip().replace('ú', 'u').replace('Ľ', 'L'),
                    "record": "0-0-0",
                    "odds": "N/A",
                    "card": "N/A"
                }])

with open('../ufc_events.json', "w") as fh:
    fh.write(json.dumps(events))