from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, Management
import csv

from datetime import datetime

class Command(BaseCommand):
    help = 'Import management info from csv'

    def handle(self, *args, **kwargs):
        with open('Management.csv', 'r') as f:
            reader = csv.reader(f)
            count = 0
            prev = None
            for row in reader:
                if not count:
                    count = 1
                    continue

                if row[0]:
                    name = row[0]
                else:
                    name = prev
                prev = name
                print(name)

                spac, created = Company.objects.get_or_create(
                    name = name,
                    ) 

                management, created = Management.objects.get_or_create(
                    member = row[1],
                    role = row[2],
                    ) 
                management.profile = row[3]
                spac.management.add(management)

                spac.save()
                management.save()
                