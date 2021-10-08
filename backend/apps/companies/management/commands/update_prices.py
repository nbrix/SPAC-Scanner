from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, FutureEarnings, SocialMedia, CommonQuote, UnitQuote, WarrantQuote, RightsQuote
import requests
from django.shortcuts import get_object_or_404

class Command(BaseCommand):
    help = 'Update stock prices'

    def handle(self, *args, **kwargs):

        external_api_url = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?&apiKey=YzZd3d6b_TGPpUDfVBNqGdSd52gHz7hq" 
            
        r = requests.get(external_api_url, timeout=10, verify=False)
        mapping = { x['ticker']: { 'price': x['min']['c'], 'volume': x['day']['v'], 'changesPercentage': x['todaysChangePerc'], 'change': x['todaysChange']} for x in r.json()['tickers'] }

   
        #Company.objects.filter(cik='').delete()

        
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
    
            

                
                