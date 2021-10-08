from django.core.management.base import BaseCommand
from ...models import Company, SECFilings
from ...scrapers.EdgarRSS import EdgarRSS
from datetime import datetime
import time
from tqdm import tqdm

class Command(BaseCommand):
    help = 'Get all SEC filings from SPACs stored in database'

    def handle(self, *args, **kwargs):
        all_companies = Company.objects.all()
        edgar = EdgarRSS()
        number_companies = len(all_companies)
        print(number_companies)

        pbar = tqdm(all_companies, total=number_companies)
        i = 0
        for company in pbar:
            
            i += 1
        
            
            filings = edgar.get_all_company_filings(company.cik)
            for filing in filings:
                company_filings, created = SECFilings.objects.get_or_create(
                        filing_type=filing['filing-type'],
                        date_filed=filing['filing-date'],
                        updated=filing['updated'],
                        form_name=filing['form-name'],
                        title=filing['title'],
                        link=filing['filing-href'],
                        company=company,
                    )
                if not created:
                    break
                company_filings.save()
            time.sleep(2)

            




            
            