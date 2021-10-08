from django.core.management.base import BaseCommand
from ...models import Company, SECFilings
from ...scrapers.EdgarRSS import EdgarRSS
from bs4 import BeautifulSoup
from datetime import datetime
import requests
import time

class Command(BaseCommand):
    help = 'Get all SEC filings from SPACs stored in database'

    def handle(self, *args, **kwargs):
        edgar = EdgarRSS()
        filings = edgar.get_recent_filings(20,120)

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
                
            # check if form type is S-1
            elif filing['filing-type'] == 'S-1':

                # check SIC
                res = requests.get("https://www.sec.gov/cgi-bin/browse-edgar?CIK={}&type=&company=&dateb=&owner=exclude".format(filing['cik']))
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

                    

            




            
            