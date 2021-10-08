from django.db import models
from django.utils.translation import gettext_lazy as _
from datetime import datetime
from django.conf import settings

class Industry(models.Model):
    name = models.CharField(max_length=128, null=True)

    def __str__(self):
        return self.name

class Sector(models.Model):
    name = models.CharField(max_length=128, null=True)

class SocialMedia(models.Model):
    
    website = models.URLField(max_length=200, null=True)
    facebook = models.URLField(max_length=200, null=True)
    twitter = models.URLField(max_length=200, null=True)
    linkedin = models.URLField(max_length=200, null=True)
    instagram = models.URLField(max_length=200, null=True)

    def __str__(self):
        return self.website

class Management(models.Model):
    member = models.CharField(max_length=64)
    role = models.CharField(max_length=128)
    current_member = models.BooleanField(null=True)
    profile = models.TextField(null=True)
    hire_date = models.DateField(null=True)
    leave_date = models.DateField(null=True)
    social_media = models.OneToOneField(
        SocialMedia,
        on_delete=models.CASCADE,
        null=True,
    )

class TargetCompany(models.Model):
    name = models.CharField(max_length=128, null=True)
    sector = models.ManyToManyField(Sector)
    industry = models.ManyToManyField(Industry)
    country = models.CharField(max_length=128)
    enterprise_valuation = models.PositiveIntegerField(default=0)
    equity_valuation = models.PositiveIntegerField(default=0)
    pipe_size = models.PositiveSmallIntegerField(null=True)
    investor_presentation = models.URLField(max_length=2083, null=True)
    website = models.URLField(max_length=200, null=True)
    employees = models.CharField(max_length=16, null=True)
    industry = models.CharField(max_length=128, null=True)
    headquarters = models.CharField(max_length=64, null=True)
    founded = models.CharField(max_length=8, null=True)
    about = models.TextField(null=True, default="")


    social_media = models.OneToOneField(
        SocialMedia,
        on_delete=models.CASCADE,
        null=True,
    )

    def __str__(self):
        return self.name

class FutureEarnings(models.Model):
    year = models.PositiveSmallIntegerField()
    earnings_indicator = models.CharField(max_length=32)
    revenue = models.CharField(max_length=16)
    earnings = models.CharField(max_length=16)
    target_company = models.ForeignKey(TargetCompany, on_delete=models.CASCADE)
    
    last_modified = models.DateTimeField(auto_now=True, auto_now_add=False, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)


class Legal(models.Model):
    class Role(models.TextChoices):
        UNDERWRITER = 'U', _('Underwriter')
        ISSUER = 'I', _('Issuer')
        FOREIGN = 'F', _('Foreign')

    name = models.CharField(max_length=64)
    social_media = models.OneToOneField(
        SocialMedia,
        on_delete=models.CASCADE,
    )
    role = models.CharField(
        max_length=1,
        choices=Role.choices
    )

class Underwriter(models.Model):
    class Role(models.TextChoices):
        LEAD_LEFT = 'L', _('Lead Left')
        SOLE = 'S', _('Sole')
        JOINT = 'J', _('Joint')

    name = models.CharField(max_length=64)
    social_media = models.OneToOneField(
        SocialMedia,
        on_delete=models.CASCADE,
    )
    role = models.CharField(
        max_length=1,
        choices=Role.choices
    )

class Auditor(models.Model):
    name = models.CharField(max_length=64)
    social_media = models.OneToOneField(
        SocialMedia,
        on_delete=models.CASCADE,
    )


class Company(models.Model):
    
    class Status(models.TextChoices):
        PRE_IPO = 'P', _('PreIPO')
        TARGET_SEARCHING = 'S', _('Searching for target')
        TARGET_FOUND = 'F', _('Found target')
        MERGE_COMPLETE = 'M', _('Merge complete')

    name = models.CharField(max_length=128)
    cik = models.CharField(max_length=10)
    description = models.TextField(null=True, default="", blank=True)
    focus = models.TextField(null=True, default="", blank=True)
    trust_size = models.PositiveBigIntegerField(null=True, blank=True)
    ipo_date = models.DateField(null=True, blank=True)
    merger_deadline = models.DateField(null=True, blank=True)
    
    target = models.OneToOneField(
        TargetCompany,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    
    management = models.ManyToManyField(Management, blank=True)
    legal = models.ManyToManyField(Legal, blank=True)
    auditor = models.ManyToManyField(Auditor, blank=True)
    sector = models.ManyToManyField(Sector, blank=True)
    industry = models.ManyToManyField(Industry, blank=True)
    shares_redeemed = models.PositiveIntegerField(null=True, blank=True)
    country = models.CharField(max_length=128, blank=True)
    
    common_ticker_symbol = models.CharField(max_length=8, null=True, blank=True )
    common_qty = models.PositiveIntegerField(default=0, null=True, blank=True)
    preferred_qty = models.PositiveIntegerField(null=True, blank=True)
    unit_ticker_symbol = models.CharField(max_length=8, null=True, blank=True)
    unit_qty = models.PositiveIntegerField(null=True, blank=True)
    unit_common_total = models.PositiveSmallIntegerField(null=True, blank=True)
    unit_warrant_total = models.PositiveSmallIntegerField(null=True, blank=True)
    warrant_ticker_symbol = models.CharField(max_length=8, null=True, blank=True)
    warrant_qty = models.PositiveIntegerField(null=True, blank=True)
    warrant_ratio_antecedent = models.PositiveIntegerField(null=True, blank=True)
    warrant_ratio_consequent = models.PositiveIntegerField(null=True, blank=True)
    warrant_redemption_price = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True)
    rights_ticker_symbol = models.CharField(max_length=8, null=True, blank=True)
    rights_qty = models.PositiveIntegerField(null=True, blank=True)
    rights_redemption_price = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True)

    '''
    common_price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    common_change = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    common_change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    common_volume = models.PositiveIntegerField(null=True, blank=True)
    warrant_price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    warrant_change = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    warrant_change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    warrant_volume = models.PositiveIntegerField(null=True, blank=True)
    unit_price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    unit_change = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    unit_change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    unit_volume = models.PositiveIntegerField(null=True, blank=True)
    rights_price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    rights_change = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    rights_change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    rights_volume = models.PositiveIntegerField(null=True, blank=True)
    '''

    website = models.URLField(max_length=200, null=True, blank=True)
    facebook = models.URLField(max_length=200, null=True, blank=True)
    twitter = models.URLField(max_length=200, null=True, blank=True)
    linkedin = models.URLField(max_length=200, null=True, blank=True)
    instagram = models.URLField(max_length=200, null=True, blank=True)

    last_modified = models.DateTimeField(auto_now=True, blank=True, auto_now_add=False, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True, blank=True)

    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.PRE_IPO
    )

    def __str__(self):
        return self.name


class CommonQuote(models.Model):
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    volume = models.PositiveIntegerField(null=True)
    company = models.OneToOneField(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.company.name
    

class UnitQuote(models.Model):
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    volume = models.PositiveIntegerField(null=True)
    company = models.OneToOneField(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.company.name

class WarrantQuote(models.Model):
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    volume = models.PositiveIntegerField(null=True)
    company = models.OneToOneField(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.company.name

class RightsQuote(models.Model):
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    change_perc = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    volume = models.PositiveIntegerField(null=True)
    company = models.OneToOneField(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.company.name
    
class SECFilings(models.Model):
    filing_type = models.CharField(max_length=32, null=True)
    date_filed = models.CharField(max_length=32, null=True)
    updated = models.DateTimeField(auto_now=False, auto_now_add=False, null=True)
    form_name = models.CharField(max_length=256, null=True)
    title = models.CharField(max_length=256, null=True)
    link = models.URLField(max_length=2083)
    accession_number = models.CharField(max_length=32, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    last_modified = models.DateTimeField(auto_now=True, auto_now_add=False, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)

    def __str__(self):
        return self.title

class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company = models.ManyToManyField(Company)

   
