
# ASSIGNED-SIC=6770 AND TYPE=s-1
# https://www.sec.gov/cgi-bin/srch-edgar?text=ASSIGNED-SIC%3D6770+AND+TYPE%3Ds-1&first=2018&last=2020

import requests 
from bs4 import BeautifulSoup 
import re
import csv 
from s1_scraper import S1Scraper

sic = 6770
form_type = "s-1"
from_date = 2021
to_date = 2021
base_url = "https://www.sec.gov"
query = "/cgi-bin/srch-edgar?text=ASSIGNED-SIC%3D{}+AND+TYPE%3D{}&first={}&last={}"
   

def get_number_companies(soup):
    count = 0
    while True:
        table = soup.div.findAll('table')[1]
        for row in table.findAll('tr'): 
            col = row.findAll('td')
            company = {} 
            if col:
                count = count + 1

        if soup.find('a', text="[NEXT]"):
            url = base_url + soup.find('a', text="[NEXT]")['href']
            soup = BeautifulSoup(requests.get(url).content, 'html.parser')
        else:
            break
    return count


def get_cik(company_url):
    edgar_resp = requests.get(company_url)
    soup = BeautifulSoup(edgar_resp.content, 'html.parser')
    cik_text = soup.find('span',class_='companyName').a.text
    return cik_text.split(' ', 1)[0]

def write_to_file(data, header, filename):
    with open(filename, 'w', newline='') as f: 
        w = csv.DictWriter(f, header) 
        w.writeheader() 
        for d in data: 
            w.writerow(d)

def get_sic(cik):
    company_url = 'https://www.sec.gov/cgi-bin/browse-edgar?CIK={}&action=getcompany'
    data = requests.get(company_url.format(cik))
    soup = BeautifulSoup(data.content, 'html.parser')
    # Get the company info block
    company_info = soup.find('div', {'class': 'companyInfo'})
    # Get the acronym tag
    acronym = company_info.find('acronym', {'title': 'Standard Industrial Code'})
    # find the next url to acronym tag
    sic = acronym.findNext('a')
    return sic.text

def check_delisted(cik):
    company_url = 'https://www.sec.gov/cgi-bin/browse-edgar?CIK={}&type=25&action=getcompany'
    data = requests.get(company_url.format(cik))
    soup = BeautifulSoup(data.content, 'html.parser')
    # Get the company info block
    table = soup.find('table', {'class': 'tableFile2'})
    filings = table.findAll('tr')

    if len(filings) > 1:
        return True
    return False
    

def get_active_spacs(companies):
    active_companies = []
    for company in companies:
        if not check_delisted(company["CIK"]):
            active_companies.append(company)
    return active_companies


def main():
    
    url = base_url + query
    #url = "https://www.sec.gov/Archives/edgar/data/1805087/000104746920003522/a2241668zs-1.htm"
    edgar_resp = requests.get(url.format(sic, form_type, from_date, to_date))
    soup = BeautifulSoup(edgar_resp.content, 'html.parser') 



    count = 0
    num_companies = get_number_companies(soup)
    #printProgressBar(count, num_companies, prefix = 'Progress:', suffix = 'Complete', length = 50)


    companies=[]
    while True:
        table = soup.div.findAll('table')[1]
        for row in table.findAll('tr'): 
            col = row.findAll('td')
            company = {} 
            if col:
                print(col[1].text)
                try:
                    s1_scraper = S1Scraper(base_url + row.find('a', text="[text]")['href'])
                except Exception as e:
                    print(e)
                    continue
                else:
                    pass
                finally:
                    pass
                
                symbols = s1_scraper.get_ticker_symbols()
                
                print(symbols)
                #s1_scraper.get_management_members()
                #s1_scraper.get_legal_team()

                company['Company'] = col[1].text 
                company['Link'] = base_url + col[1].a['href']
                company['CIK'] = get_cik(company['Link'])
                company['Units'] = symbols['units']
                company['Ticker'] = symbols['common']
                company['Warrants'] = symbols['warrants']
                company['Rights'] = symbols['rights']
                companies.append(company) 

                count = count + 1
                #printProgressBar(count, num_companies, prefix = 'Progress:', suffix = 'Complete', length = 50)
                #s1_scraper.get_focus();
                
           
        if soup.find('a', text="[NEXT]"):
            url = base_url + soup.find('a', text="[NEXT]")['href']
            edgar_resp = requests.get(url.format(sic, form_type, from_date, to_date))
            soup = BeautifulSoup(edgar_resp.content, 'html.parser')
        else:
            break
    
    header = ['Company','CIK','Ticker','Units','Warrants','Rights','Link']

    
    write_to_file(companies, header, 'spac_list.csv') 
    write_to_file(get_active_spacs(companies), header, 'active_spac_list.csv') 

if __name__ == "__main__":
    main()