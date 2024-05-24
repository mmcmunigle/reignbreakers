import requests
from bs4 import BeautifulSoup
from ufc.utils import correct_name

class TapologyScraper:
    def __init__(self) -> None:
        self._base_url = "https://www.tapology.com"
        self._headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36'}
        self._all_predictions = {}

    def get_fighter_votes(self, name: str) -> dict:
        return self._all_predictions.get(name, {})

    def _get_event_urls(self, fightcenter_url):
        response = requests.get(fightcenter_url, headers=self._headers)
        soup = BeautifulSoup(response.content, 'html.parser')

        event_urls = []
        events_div = soup.find_all('div', {'data-controller': 'bout-toggler'})

        for event in events_div:
            link = event.find('a')
            if link:
                href = link.get('href')
                if href and "/fightcenter/events/" in href:
                    event_urls.append(self._base_url + href)

        return event_urls

    def _get_fight_predictions(self, url):
        response = requests.get(url, headers=self._headers)
        soup = BeautifulSoup(response.content, 'html.parser')

        fight_predictions = {}

        title = soup.find('h2', class_='text-center').text.strip()
        fighter_names = title.split(' vs. ')

        # Find the section containing the fight predictions
        bout_page_picks = soup.find('div', id='boutPagePicks')
        if not bout_page_picks:
            print(f"Couldn't find the fight predictions section for {url}.")
            return fight_predictions

        # Extract fight titles
        fight_titles = bout_page_picks.find_all('div', class_='chartRow')

        for fight in fight_titles:
            last_name = fight.find('div', class_='chartLabel').text.strip()
            fighter_full_name = next((name for name in fighter_names if last_name in name), last_name)
            fighter_full_name = correct_name(fighter_full_name)

            # Extract percentages for KO/TKO, Submission, and Decision
            prediction_percentage = fight.find('div', class_='number').text.strip()
            tko_percentage = fight.find('div', class_='tko_bar')['style'].split('width:')[1].strip('%')
            sub_percentage = fight.find('div', class_='sub_bar')['style'].split('width:')[1].strip('%')
            dec_percentage = fight.find('div', class_='dec_bar')['style'].split('width:')[1].strip('%')
            
            fight_predictions[fighter_full_name] = {
                'win_percentage': str(round(float(prediction_percentage.replace('%', '')))) + '%',
                'tko_percentage': round(float(tko_percentage)),
                'sub_percentage': round(float(sub_percentage)),
                'dec_percentage': round(float(dec_percentage))
            }

        return fight_predictions

    # Function to extract fight links from an event page
    def _extract_fight_links(self, event_url):
        response = requests.get(event_url, headers=self._headers)
        soup = BeautifulSoup(response.content, 'html.parser')

        fights_table = soup.find('div', id="sectionFightCard")
        
        # Find all fight links
        fight_links = [a['href'] for a in fights_table.find_all('a', href=True) if '/fightcenter/bouts/' in a['href']]
        return list(set(fight_links))


    def scrape_upcoming_ufc_events(self):
        ufc_events_url = 'https://www.tapology.com/fightcenter?group=ufc'
        event_urls = self._get_event_urls(ufc_events_url)
        all_predictions = {}

        for url in event_urls[:8]:
            print(f"Scraping {url} ...")
            fight_links = self._extract_fight_links(url)
            for fight_link in fight_links:
                fight_url = 'https://www.tapology.com' + fight_link
                print(f"Scraping Fight {fight_url} ...")
                predictions = self._get_fight_predictions(fight_url)
                all_predictions.update(predictions)

        self._all_predictions = all_predictions
