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
            events.append({
                "name": line,
                "date": "N?A",
                "type": line,
                "payout": 125000,
                "matchups": []
            })
        elif line:
            fighters = line.split(':')[1].split('[')[0].split('vs.')
            print(fighters)
            events[len(events)-1]['matchups'].append([{
                "name": fighters[0].strip(),
                "record": "0-0-0",
                "odds": "N/A",
                "card": "N/A"
            }, {
                "name": fighters[1].strip(),
                "record": "0-0-0",
                "odds": "N/A",
                "card": "N/A"
            }])

with open('./new_fights.json', "w") as fh:
    fh.write(json.dumps(events))