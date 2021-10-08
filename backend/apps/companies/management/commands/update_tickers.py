from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, FutureEarnings, SocialMedia
import csv

from datetime import datetime

class Command(BaseCommand):
    help = 'Import active SPACs from a csv'

    def handle(self, *args, **kwargs):


        with open('Ticker_update.csv', 'r') as f:
            reader = csv.reader(f)
            first_row = True
            for row in reader:
                if first_row:
                    first_row = False
                    continue

                company, created = Company.objects.get_or_create(
                    name=row[1],
                )


                
                print(company.name, created)

                if row[0] and row[0] != 'N/A':
                    company.common_ticker_symbol = row[0]

                if row[6] and row[6] != 'N/A':
                    company.unit_ticker_symbol = row[6]

                if row[4] and row[4] != 'N/A':
                    company.warrant_ticker_symbol = row[4]

                if row[8] and row[8] != 'N/A':
                    company.rights_ticker_symbol = row[8]

               
                company.save()


                
                