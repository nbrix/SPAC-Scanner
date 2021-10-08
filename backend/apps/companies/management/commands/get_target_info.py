from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, Industry
import csv

from datetime import datetime

class Command(BaseCommand):
    help = 'Import target company info from csv'

    def handle(self, *args, **kwargs):
        with open('Target Info.csv', 'r') as f:
            reader = csv.reader(f)
            count = 0
            for row in reader:
                if not count:
                    count = 1
                    continue
                spac, created = Company.objects.get_or_create(
                    name = row[0],
                    ) 
                if created:
                    print(created, spac)
                    continue
                
                print(created, spac.target.name, datetime.now())
                
                if row[3]:
                    spac.target.website=row[3]
                if row[4]:
                    spac.target.employees=row[4]
                if row[5]:
                    spac.target.industry=row[5]
                if row[6]:
                    spac.target.headquarters=row[6]
                if row[7]:
                    spac.target.founded=row[7]
                if row[8]:
                    spac.target.about=row[8]
                
                spac.target.save()
                