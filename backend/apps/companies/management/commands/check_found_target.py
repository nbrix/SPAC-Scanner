from django.core.management.base import BaseCommand
from ...models import Company, SECFilings
from ...scrapers.EdgarRSS import EdgarRSS
from datetime import datetime
import time
import csv 

class Command(BaseCommand):
    help = 'Get all SEC filings from SPACs stored in database'

    def handle(self, *args, **kwargs):
        # Get list of companies that are searching for a target
        all_companies = Company.objects.filter(status='S')
        number_companies = len(all_companies)

        #i = 1
        result = []
        for company in all_companies:
            #print(i, ' of ', number_companies)

            # Check if company has filed a 425 form
            if company.status == 'S':
                if company.target:
                    company.status = 'F'
                    company.save()
                    continue

                is_425 = SECFilings.objects.filter(
                        filing_type='425',
                        company=company,
                    )

                if is_425.count() > 0:
                    print('Target Found', company.name)
                    company.status = 'F'
                    result.append({'Company': company.name})
                    company.save()

        with open('Target Found.csv', 'w', newline='') as f: 
            w = csv.DictWriter(f, ['Company']) 
            w.writeheader() 
            for d in result: 
                w.writerow(d)


            




            
            