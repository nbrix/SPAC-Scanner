from django.contrib import admin
from .models import (
    Company, 
    Management, 
    Legal, 
    Auditor, 
    Sector, 
    Industry, 
    TargetCompany, 
    FutureEarnings,
    SECFilings,
    Portfolio,
    CommonQuote
)

class CompanyAdmin(admin.ModelAdmin):
    search_fields = ('name', 'cik', )

class ManagementAdmin(admin.ModelAdmin):
    list_display = ('member', 'role',)
    search_fields = ('name', )

class FutureEarningsAdmin(admin.ModelAdmin):
    list_display = ('target_company', 'year',)
    search_fields = ('target_company__name', )

class SECFilingsAdmin(admin.ModelAdmin):
    list_display = ('company', 'title',)
    search_fields = ('company__name', )


admin.site.register(Company, CompanyAdmin)
admin.site.register(Management, ManagementAdmin)
admin.site.register(Legal)
admin.site.register(Auditor)
admin.site.register(Sector)
admin.site.register(Industry)
admin.site.register(TargetCompany)
admin.site.register(FutureEarnings, FutureEarningsAdmin)
admin.site.register(SECFilings, SECFilingsAdmin)
admin.site.register(Portfolio)
admin.site.register(CommonQuote)
