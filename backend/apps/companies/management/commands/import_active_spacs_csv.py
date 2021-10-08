from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, Industry
import csv
import os.path
from os import path
from datetime import datetime

class Command(BaseCommand):
    help = 'Import active SPACs from a csv'

    def handle(self, *args, **kwargs):
        with open('active_spac_list.csv', 'r') as f:
            reader = csv.reader(f)
            first_row = True
            for row in reader:
                if first_row:
                    first_row = False
                    continue

                spac, created = Company.objects.get_or_create(
                    cik=row[1],
                    ) 
                
                spac.name =row[0]
                print(created, spac.name, datetime.now())

                spac.common_ticker_symbol=row[2]
                spac.unit_ticker_symbol=row[3]
                spac.warrant_ticker_symbol=row[4]
                spac.rights_ticker_symbol=row[5]
                
                status = row[6]

                if status == 'Searching':
                    spac.status = 'S'
                    if row[7]:
                        spac.ipo_date = datetime.strptime(row[7], '%m/%d/%Y')
                elif status == 'PREIPO':
                    spac.status = 'P'
                elif status == 'Found':
                    spac.status = 'F'
                    spac.target_company = row[10]
                    
                    if row[7]:
                        spac.ipo_date = datetime.strptime(row[7], '%m/%d/%Y')
                
                if row[8]:
                    spac.trust_size = row[8].replace(",", "").replace("$", "").replace(".00", "")

                if row[9]:
                    spac.unit_qty = row[9].replace(",", "")
                
                industries = [x.strip() for x in row[11].split(',')]
                for industry in industries:
                    i, created = Industry.objects.get_or_create(name=industry)
                    spac.industry.add(i)
                    i.save()

                spac.focus = row[12]

                spac.save()
                