from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, FutureEarnings, SocialMedia, Industry, Management
import csv
import os.path
from os import path
import csv
import progressbar
import time
from tqdm import tqdm

from datetime import datetime

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class Command(BaseCommand):
    help = 'Update database from csv'

    def target_proj(self, year):
        file_name = 'Target Projections ' + str(year) +'.csv'
        try:
            with open(file_name, 'r') as f:
                lines = [line for line in f]
                reader = csv.reader(lines)
                first_row = True

                for row in tqdm(reader, total=len(lines)):
                    if first_row:
                        first_row = False
                        continue

                    target, created = TargetCompany.objects.get_or_create(
                        name = row[3],
                        ) 
                    
                    company, created = Company.objects.get_or_create(
                        cik=row[1],
                    )


                    company.target = target
                    #print(company.target)

                    # Revenue and Earnings
                    earnings, created = FutureEarnings.objects.get_or_create(
                        target_company=target,
                        year=year,
                        earnings_indicator = row[16],
                        revenue = row[4],
                        earnings=row[10],
                    )
                    earnings.save()

                    earnings, created = FutureEarnings.objects.get_or_create(
                        target_company=target,
                        year=year + 1,
                        earnings_indicator = row[16],
                        revenue = row[5],
                        earnings=row[11],
                    )
                    earnings.save()

                    earnings, created = FutureEarnings.objects.get_or_create(
                        target_company=target,
                        year=year + 2,
                        earnings_indicator = row[16],
                        revenue = row[6],
                        earnings=row[12],
                    )
                    earnings.save()

                    earnings, created = FutureEarnings.objects.get_or_create(
                        target_company=target,
                        year=year + 3,
                        earnings_indicator = row[16],
                        revenue = row[7],
                        earnings=row[13],
                    )
                    earnings.save()

                    earnings, created = FutureEarnings.objects.get_or_create(
                        target_company=target,
                        year=year + 4,
                        earnings_indicator = row[16],
                        revenue = row[8],
                        earnings=row[14],
                    )
                    earnings.save()

                    earnings, created = FutureEarnings.objects.get_or_create(
                        target_company=target,
                        year=year + 5,
                        earnings_indicator = row[16],
                        revenue = row[9],
                        earnings=row[15],
                    )
                    earnings.save()


                    # Valuation
                    if row[17]:
                        target.enterprise_valuation=float(row[17])
                    if row[18]:
                        target.equity_valuation=float(row[18])
                    if row[19]:
                        target.pipe_size=int(row[19])

                    # Investor Presentation
                    if row[20]:
                        target.investor_presentation=row[20]

                    # Status
                    company.status = 'F'

                    target.save()
                    company.save()
                
        except Exception as error:
            return "Target Projection (" + str(year) + "): " + str(error).rstrip()

    def import_active_spac_list(self):

        try:
            with open('active_spac_list.csv', 'r') as f:
                lines = [line for line in f]
                reader = csv.reader(lines)
                first_row = True

                pbar = tqdm(reader, total=len(lines))
                for row in pbar:
                    if first_row:
                        first_row = False
                        continue

                    spac, created = Company.objects.get_or_create(
                        cik=row[1],
                        ) 
                    
                    spac.name =row[0]

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

        except Exception as error:
            return "Active Spac List: " + str(error).rstrip()

    def get_management(self):
        try:
            with open('Management.csv', 'r') as f:
                lines = [line for line in f]
                reader = csv.reader(lines)
                count = 0
                prev = None

                for row in tqdm(reader, total=len(lines)):
                    if not count:
                        count = 1
                        continue

                    if row[0]:
                        name = row[0]
                    else:
                        name = prev
                    prev = name

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

        except Exception as error:
            return "Management: " + str(error).rstrip()

    def target_info(self):
        try:
            with open('Target Info.csv', 'r') as f:
                lines = [line for line in f]
                reader = csv.reader(lines)
                count = 0
                n = len(list(csv.reader(lines)))
                

                for row in tqdm(reader, total=n):
                    if not count:
                        count = 1
                        continue

                    spac, created = Company.objects.get_or_create(
                        name = row[0],
                        ) 
                    if created:
                        print(created, spac)
                        continue
                    
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
                    

        except Exception as error:
            return 'Target Info: ' + str(error).rstrip()
                

    def handle(self, *args, **kwargs):

        errors = []

        print(f"{bcolors.OKCYAN}Getting list of spacs...{bcolors.ENDC}")
        errors.append(self.import_active_spac_list())

        print(f"{bcolors.OKCYAN}Getting management...{bcolors.ENDC}")
        errors.append(self.get_management())

        print(f"{bcolors.OKCYAN}Getting target projections (2020)...{bcolors.ENDC}")
        errors.append(self.target_proj(2020))

        print(f"{bcolors.OKCYAN}Getting target projections (2021)...{bcolors.ENDC}")
        errors.append(self.target_proj(2021))

        print(f"{bcolors.OKCYAN}Getting target info...{bcolors.ENDC}")
        errors.append(self.target_info())

        is_error = False
        if errors:
            print()
            for error in errors:
                if error:
                    print(f"{bcolors.FAIL}ERROR: {error}{bcolors.ENDC}")
                    is_error = True
        if not is_error:
            print(f"{bcolors.OKGREEN}Update Succesful{bcolors.ENDC}")






        


                
                