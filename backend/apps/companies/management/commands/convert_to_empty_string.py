from django.core.management.base import BaseCommand
from ...models import Company, SECFilings
from ...scrapers.EdgarRSS import EdgarRSS
from datetime import datetime
import time

class Command(BaseCommand):
    help = "Convert 'None' type to empty string."

    def handle(self, *args, **kwargs):
        all_companies = Company.objects.all()

        i = 1
        number_companies = len(all_companies)
        for company in all_companies:
            print(i, ' of ', number_companies)
            i += 1
             
            if company.common_ticker_symbol is None:
                company.common_ticker_symbol = ''
            if company.warrant_ticker_symbol is None:
                company.warrant_ticker_symbol = ''
            if company.unit_ticker_symbol is None:
                company.unit_ticker_symbol = ''
            if company.rights_ticker_symbol is None:
                company.rights_ticker_symbol = ''

            company.save()

            

            




            
            