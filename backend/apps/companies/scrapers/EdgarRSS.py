import requests  
import feedparser
import re
import csv 
from bs4 import BeautifulSoup
import datetime
import pytz
import time

user_agent = {"User-Agent":"SPACscanner (http://www.spacscanner.com)"}

class EdgarRSS:
    base_url = "https://www.sec.gov"
    rss_url = base_url + "/cgi-bin/browse-edgar?CIK={}&owner=exclude&output=atom"
    
    def __init__(self, *args):
        try:
            self.options = dict(args)
        except TypeError as err:
            print("TypeError: {0}".format(err))

        
    def get_all_company_filings(self, cik):
        SecFeed = feedparser.parse(self.rss_url.format(cik), request_headers=user_agent)

        results = []
        while True:
            for entry in SecFeed.entries:
                results.append(self.get_filing_data(entry))
            time.sleep(0.25)

            try:
                SecFeed.feed.links
            except:
                print(SecFeed.feed)

            next_page = next((link['href'] for link in SecFeed.feed.links if link.rel == 'next'), None)
            if next_page:
                SecFeed = feedparser.parse(next_page, request_headers=user_agent)
            else:
                break

        return results


    def get_file_url(self, url):
        res = requests.get(url, headers=user_agent)
        time.sleep(0.25)
        soup = BeautifulSoup(res.content, 'html.parser') 

        table = soup.find("table",{"class":"tableFile"})

        rows = table.findAll('tr')
        
        file_link = rows[1].find('a').get('href')

        return file_link

    def get_file(self, cik, accession_number):
        time.sleep(0.25)
        SecFeed = feedparser.parse(self.rss_url.format(cik), request_headers=user_agent)

        for entry in SecFeed.entries:
            file_data = self.get_filing_data(entry)
            
            if file_data['accession-number'] == accession_number:
                return file_data

        return None


    def get_filing_data(self, entry,):
        data = {}

        data['filing-href'] = self.base_url + self.get_file_url(entry['filing-href'])
        data['filing-type'] = entry['filing-type']
        data['filing-date'] = entry['filing-date']
        data['form-name'] = entry['form-name']
        data['title'] = entry['title']
        data['updated'] = entry['updated']
        data['accession-number'] = entry['accession-number']
        
        return data

    def get_recent_filings(self, count, time_frame):
        '''
        count: number of files to retrieve,
        time_frame: within last X minutes
        '''
        api_url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=&company=&dateb=&owner=exclude&start=0&count={}&output=atom"
        SecFeed = feedparser.parse(api_url.format(count), request_headers=user_agent)
        est = pytz.timezone('US/Eastern')

        filings = []
        current_time = datetime.datetime.now().astimezone(est)
        for entry in SecFeed.entries:

            if current_time - datetime.timedelta(minutes=time_frame) > datetime.datetime.fromisoformat(entry['updated']):
                continue

            filing = {}
            filing['updated'] = entry['updated']
            filing['link'] = entry['link']
            filing['filing-type'] = entry['category']

            # extract accession number
            pattern = re.compile(r"\d{10}-\d{2}-\d{6}")
            match = pattern.search(entry['id'])
            filing['accession-number'] = match.group(0)
            
            # extract cik
            pattern = re.compile(r"\((\d+)\)")
            match = pattern.search(entry['title'])
            filing['cik'] = match.group(0)[1:-1]

            filings.append(filing)

        return filings            

    def update_all_company_filings(self, cik, SECFilings, company):
        SecFeed = feedparser.parse(self.rss_url.format(cik), request_headers=user_agent)

        results = []
        while True:
            for entry in SecFeed.entries:
                filing = {}

                
                filing['filing-type'] = entry['filing-type']
                filing['filing-date'] = entry['filing-date']
                filing['form-name'] = entry['form-name']
                filing['title'] = entry['title']
                filing['updated'] = entry['updated']
                filing['accession-number'] = entry['accession-number']

                filing_exists = SECFilings.objects.filter(
                    filing_type=filing['filing-type'],
                    date_filed=filing['filing-date'],
                    updated=filing['updated'],
                    form_name=filing['form-name'],
                    title=filing['title'],
                    company=company,
                    ).count()
                if not filing_exists:
                    filing['filing-href'] = self.base_url + self.get_file_url(entry['filing-href'])
                    results.append(filing)
                    time.sleep(0.25)

            try:
                SecFeed.feed.links
            except:
                print(SecFeed.feed)

            next_page = next((link['href'] for link in SecFeed.feed.links if link.rel == 'next'), None)
            if next_page:
                SecFeed = feedparser.parse(next_page, request_headers=user_agent)
            else:
                break

        return results