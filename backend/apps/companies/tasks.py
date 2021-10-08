from celery import shared_task
from .models import Company, CommonQuote, UnitQuote, WarrantQuote, RightsQuote, SECFilings
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.status import HTTP_200_OK
from .scrapers.EdgarRSS import EdgarRSS
from bs4 import BeautifulSoup
import requests
import time

POLYGON_KEY = settings.POLYGON_KEY


@shared_task
def update_prices():
    external_api_url = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?&apiKey="+POLYGON_KEY 
            
    r = requests.get(external_api_url, timeout=10, verify=False)
    mapping = { x['ticker']: { 'price': x['min']['c'], 'volume': x['day']['v'], 'changesPercentage': x['todaysChangePerc'], 'change': x['todaysChange']} for x in r.json()['tickers'] }

    if r.status_code == HTTP_200_OK:
        print('Updating Prices - SUCCESS')
    else:
        print('Updating Prices - FAIL')
 
    for ticker in mapping:

        if Company.objects.filter(common_ticker_symbol__exact=ticker).count():
            
            # Update price data
            company, created = CommonQuote.objects.get_or_create(company__common_ticker_symbol__exact=ticker)
            company.price = float(round(mapping[ticker]['price'], 2))
            company.change = float(mapping[ticker]['change'])
            company.change_perc = float(mapping[ticker]['changesPercentage'])
            company.volume = int(mapping[ticker]['volume'])

            # If company is created for first time, map to quote
            if created:
                company.company = Company.objects.get(common_ticker_symbol__exact=ticker)
            
            company.save()

        elif Company.objects.filter(warrant_ticker_symbol__exact=ticker).count():
            # Update price data
            company, created = WarrantQuote.objects.get_or_create(company__warrant_ticker_symbol__exact=ticker)
            company.price = float(round(mapping[ticker]['price'], 2))
            company.change = float(mapping[ticker]['change'])
            company.change_perc = float(mapping[ticker]['changesPercentage'])
            company.volume = int(mapping[ticker]['volume'])

            # If company is created for first time, map to quote
            if created:
                company.company = Company.objects.get(warrant_ticker_symbol__exact=ticker)
            
            company.save()

        elif Company.objects.filter(unit_ticker_symbol__exact=ticker).count():
            
            # Update price data
            company, created = UnitQuote.objects.get_or_create(company__unit_ticker_symbol__exact=ticker)
            company.price = float(round(mapping[ticker]['price'], 2))
            company.change = float(mapping[ticker]['change'])
            company.change_perc = float(mapping[ticker]['changesPercentage'])
            company.volume = int(mapping[ticker]['volume'])

            # If company is created for first time, map to quote
            if created:
                company.company = Company.objects.get(unit_ticker_symbol__exact=ticker)
            
            company.save()

        elif Company.objects.filter(rights_ticker_symbol__exact=ticker).count():
            
            # Update price data
            company, created = RightsQuote.objects.get_or_create(company__rights_ticker_symbol__exact=ticker)
            company.price = float(round(mapping[ticker]['price'], 2))
            company.change = float(mapping[ticker]['change'])
            company.change_perc = float(mapping[ticker]['changesPercentage'])
            company.volume = int(mapping[ticker]['volume'])

            # If company is created for first time, map to quote
            if created:
                company.company = Company.objects.get(rights_ticker_symbol__exact=ticker)
            
            company.save()

@shared_task
def update_sec_files():
    edgar = EdgarRSS()
    filings = edgar.get_recent_filings(10,1)
    print('Looking for new files')
    user_agent = {"User-Agent":"SPACscanner (+http://www.spacscanner.com)"}

    for filing in filings:

        # check if cik is in companies
        cik_long = filing['cik']
        cik_short = filing['cik'].lstrip('0')
        company = None

        if Company.objects.filter(cik=cik_long).count():
            company = Company.objects.get(cik=cik_long)
        elif Company.objects.filter(cik=cik_short).count():
            company = Company.objects.get(cik=cik_short)
    
        if company:
            f = edgar.get_file(filing['cik'], filing['accession-number'])

            if f:
                company_filings, created = SECFilings.objects.get_or_create(
                        filing_type=f['filing-type'],
                        date_filed=f['filing-date'],
                        updated=f['updated'],
                        form_name=f['form-name'],
                        title=f['title'],
                        link=f['link'],
                        company=company,
                    )
                company_filings.save()
                print('Adding SEC file')
            
        # check if form type is S-1
        elif filing['filing-type'] == 'S-1':
            time.sleep(1)
            
            # check SIC
            res = requests.get("https://www.sec.gov/cgi-bin/browse-edgar?CIK={}&type=&company=&dateb=&owner=exclude".format(filing['cik']), headers=user_agent)
            soup = BeautifulSoup(res.content, 'html.parser') 
            sic = soup.find("acronym",{"title":"Standard Industrial Code"})
            if sic:
                sic = sic.findNext('a').text
                name = soup.find("span",{"class":"companyName"}).find(text=True)
                
                # create company
                company, created = Company.objects.get_or_create(
                    cik = filing['cik'],
                    name = name
                ) 
                company.save()

                # create filing
                f = edgar.get_file(filing['cik'], filing['accession-number'])
                company_filings, created = SECFilings.objects.get_or_create(
                        filing_type=f['filing-type'],
                        date_filed=f['filing-date'],
                        updated=f['updated'],
                        form_name=f['form-name'],
                        title=f['title'],
                        link=f['link'],
                        company=company,
                    )
                company_filings.save()
                print('Creating company and adding SEC file')
