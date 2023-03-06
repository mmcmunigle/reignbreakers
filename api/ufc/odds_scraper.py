from time import sleep
import json
import requests
import scrapy
from scrapy import signals
from scrapy.crawler import CrawlerProcess
from scrapy.http import HtmlResponse
from scrapy.signalmanager import dispatcher
from scrapy.spidermiddlewares.httperror import HttpError 
from twisted.internet.error import DNSLookupError 
from twisted.internet.error import TimeoutError, TCPTimedOutError


EVENT_PAGES = [
    "https://www.tapology.com/fightcenter/events/95023-ufc-fight-night",
    "https://www.tapology.com/fightcenter/events/94418-ufc-285",
    "https://www.tapology.com/fightcenter/events/95455-ufc-fight-night-smith-vs-hill",
    "https://www.tapology.com/fightcenter/events/95408-ufc-286",
    "https://www.tapology.com/fightcenter/events/96078-ufc-fight-night",
    "https://www.tapology.com/fightcenter/events/96871-ufc-287",
    "https://www.tapology.com/fightcenter/events/97461-ufc-fight-night",
    "https://www.tapology.com/fightcenter/events/97433-ufc-fight-night",
    "https://www.tapology.com/fightcenter/events/97740-ufc-fight-night",
    "https://www.tapology.com/fightcenter/events/97782-ufc-fight-night",
    "https://www.tapology.com/fightcenter/events/98223-ufc-fight-night"
]

EVENT_INDEX = 0


class OddsSpider(scrapy.Spider):
    name = 'oddsspider'
    event_url = None
    # ufc_url = "https://www.tapology.com/search?term=UFC&search=Submit&mainSearchFilter=events"
    event_details = {}
    # start_urls = ['https://www.tapology.com/fightcenter/events/94589-ufc-fight-night']

    def start_requests(self):
        yield scrapy.Request(self.event_url, callback = self.parse_fight_night,
                             errback = self.errback_httpbin, 
                             dont_filter=True)
    
    def parse_events(self, response):
        pass
        # for event in response.css(".altA").xpath('./a/@href').getall()[9:11]:
        #     event_url = f"https://www.tapology.com{event}"
        #     sleep(1)
        #     yield scrapy.Request(event_url, callback = self.parse_fight_night)

    def parse_fight_night(self, response):
        # r = HtmlResponse(url="", body=resp.text, encoding='utf-8')
        # r = requests.get("https://www.tapology.com/fightcenter/events/94589-ufc-fight-night")
        # response.replace(body = r.text)
        # reponse = scrapy.Request(start_urls)
        # print(response)
        fight_title = response.xpath('//div[@class="eventPageHeaderTitles"]/h1/text()').extract_first()
        fight_date = response.xpath('//li[@class="header"]/text()').extract_first().split(' ')[1]
        self.event_details = {'title': fight_title, 'date': fight_date}
        for href in response.css(".billing").xpath('./a/@href').getall():
            bout_url = f"https://www.tapology.com{href}"
            sleep(1)
            yield scrapy.Request(bout_url, callback = self.parse_match)

    def parse_match(self, response):
        left_name = response.css(".fName.left").xpath('./a/text()').extract_first()
        right_name = response.css(".fName.right").xpath('./a/text()').extract_first()
        stats = response.css("table.fighterStats").xpath('./tr').getall()

        left_odds = right_odds = left_record = right_record = None
        for row in stats:
            if 'Betting Odds' in row:
                odds = row.split('<td>')
                left_odds = odds[1].split(' ')[0]
                right_odds = odds[2].split(' ')[0]
            elif 'Pro Record At Fight' in row:
                records = row.split('<td>')
                left_record = records[1].split('\n')[1]
                right_record = records[2].split('\n')[1]

        vote_perc = response.css("div.stat_bar_holder").css("div.number").xpath('text()').getall()
        vote_name = response.css("div.stat_label").xpath('text()').getall()

        left_vote = vote_perc[0] if vote_name[0] in left_name else vote_perc[1]
        right_vote = vote_perc[0] if vote_name[0] in right_name else vote_perc[1]

        yield {
            'event': self.event_details,
            'matchup': [{
                'name': self.sanitize_name(left_name),
                'odds': left_odds,
                'record': left_record,
                'vote': left_vote,
            }, {
                'name': self.sanitize_name(right_name),
                'odds': right_odds,
                'record': right_record,
                'vote': right_vote,
            }]
        }

    
    def errback_httpbin(self, failure): 
      # logs failures 
      self.logger.error(repr(failure))  
      
      if failure.check(HttpError): 
         response = failure.value.response 
         self.logger.error("HttpError occurred on %s", response.url)  
      
      elif failure.check(DNSLookupError): 
         request = failure.request 
         self.logger.error("DNSLookupError occurred on %s", request.url) 

      elif failure.check(TimeoutError, TCPTimedOutError): 
         request = failure.request 
         self.logger.error("TimeoutError occurred on %s", request.url) 

    @staticmethod
    def sanitize_name(name: str):
        return name.replace("ç", "c").replace("é", "e").replace("ã", "a").replace("Ľ", "L").replace("Ł", "L").replace("š", "s").replace("ć", "c")


def execute_crawling(event_index):

    results = []

    def crawler_results(signal, sender, item, response, spider):
        results.append(item)

    dispatcher.connect(crawler_results, signal=signals.item_scraped)

    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36'
    })
    # spider = OddsSpider(event_url="https://www.tapology.com/fightcenter/events/95455-ufc-fight-night-smith-vs-hill")
    process.crawl(OddsSpider, event_url=EVENT_PAGES[event_index]) 
    
    process.start()

    event_details = results[0]['event']
    fights = []
    for result in results:
        del result['event']
        fights.append(result['matchup'])
    
    event_details['matchups'] = fights

    with open("events.json",'r+') as f:
        # First we load existing data into a dict.
        all_events = json.load(f)
        # Join new_data with file_data inside emp_details
        all_events.append(event_details)
        # Sets file's current position at offset.
        f.seek(0)
        # convert back to json.
        json.dump(all_events, f)
    
    # with open("./spider_events.json", "a") as f:
    #     f.write(json.dumps(event_details))

if __name__ == '__main__':
    from multiprocessing import Process
    with open("events.json", "w") as f:
        f.write(json.dumps([]))
    for k in range(len(EVENT_PAGES)):
        p = Process(target=execute_crawling, args=(k,))
        p.start()
        sleep(120)
        p.join() # this blocks until the process terminates


