from django.core.management.base import BaseCommand
from ...models import Company, TargetCompany, FutureEarnings, SocialMedia
import csv

from datetime import datetime

class Command(BaseCommand):
    help = 'Import active SPACs from a csv'

    def handle(self, *args, **kwargs):


        with open('Target Projections 2021.csv', 'r') as f:
            reader = csv.reader(f)
            first_row = True
            for row in reader:
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
                print(company.target)

                # Revenue and Earnings
                # 2021
                earnings, created = FutureEarnings.objects.get_or_create(
                    target_company=target,
                    year=2021,
                    earnings_indicator = row[16],
                    revenue = row[4],
                    earnings=row[10],
                )
                earnings.save()

                # 2022
                earnings, created = FutureEarnings.objects.get_or_create(
                    target_company=target,
                    year=2022,
                    earnings_indicator = row[16],
                    revenue = row[5],
                    earnings=row[11],
                )
                earnings.save()

                # 2023
                earnings, created = FutureEarnings.objects.get_or_create(
                    target_company=target,
                    year=2023,
                    earnings_indicator = row[16],
                    revenue = row[6],
                    earnings=row[12],
                )
                earnings.save()

                # 2024
                earnings, created = FutureEarnings.objects.get_or_create(
                    target_company=target,
                    year=2024,
                    earnings_indicator = row[16],
                    revenue = row[7],
                    earnings=row[13],
                )
                earnings.save()

                # 2025
                earnings, created = FutureEarnings.objects.get_or_create(
                    target_company=target,
                    year=2025,
                    earnings_indicator = row[16],
                    revenue = row[8],
                    earnings=row[14],
                )
                earnings.save()

                # 2026
                earnings, created = FutureEarnings.objects.get_or_create(
                    target_company=target,
                    year=2026,
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

                # Website
                if row[21]:
                    social_media, created = SocialMedia.objects.get_or_create(
                        website=row[21]
                    )
                    target.social_media = social_media
                    social_media.save()

                # Status
                company.status = 'F'

                target.save()
                company.save()


                
                