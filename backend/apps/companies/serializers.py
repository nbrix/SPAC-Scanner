from rest_framework import serializers
from .models import (
    Company, 
    Industry, 
    SECFilings, 
    TargetCompany, 
    FutureEarnings, 
    Portfolio, 
    Management, 
    CommonQuote,
    UnitQuote,
    WarrantQuote,
    RightsQuote,
)

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ('name',)

class CompanyNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            'name',
            'common_ticker_symbol',
            )

class CompanySerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True, many=True)

    class Meta:
        model = Company
        fields = (
            'name', 
            'common_ticker_symbol', 
            'unit_ticker_symbol',
            'warrant_ticker_symbol',
            'rights_ticker_symbol',
            'industry', 
            'ipo_date',
            'unit_qty',
            'target',
            'focus',
            'trust_size',
            'status',
            'created_at',
        )

class TargetCompanySerializer(serializers.ModelSerializer):
    company = CompanyNameSerializer(read_only=True)
    class Meta:
        model = TargetCompany
        fields = (
            'name',
            'enterprise_valuation',
            'equity_valuation',
            'pipe_size',
            'investor_presentation',
            'employees',
            'website',
            'about',
            'headquarters',
            'founded',
            'company',
        )

class TargetCompanyNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetCompany
        fields = (
            'name',
        )

class CommonQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonQuote
        fields = (
            'price',
            'change',
            'change_perc',
            'volume',
        )

class WarrantQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarrantQuote
        fields = (
            'price',
            'change',
            'change_perc',
            'volume',
        )

class UnitQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitQuote
        fields = (
            'price',
            'change',
            'change_perc',
            'volume',
        )

class RightsQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RightsQuote
        fields = (
            'price',
            'change',
            'change_perc',
            'volume',
        )

class CompanyProfileSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True, many=True)
    target = TargetCompanyNameSerializer(read_only=True)
    status = serializers.CharField(source='get_status_display')
    common_quote = CommonQuoteSerializer(read_only=True, many=False, source='commonquote')
    unit_quote = UnitQuoteSerializer(read_only=True, many=False, source='unitquote')
    warrant_quote = WarrantQuoteSerializer(read_only=True, many=False, source='warrantquote')
    rights_quote = RightsQuoteSerializer(read_only=True, many=False, source='rightsquote')


    class Meta:
        model = Company
        fields = (
            'name', 
            'common_ticker_symbol', 
            'unit_ticker_symbol',
            'warrant_ticker_symbol',
            'rights_ticker_symbol',
            'industry', 
            'ipo_date',
            'unit_qty',
            'target',
            'focus',
            'trust_size',
            'status',
            'common_quote',
            'unit_quote',
            'warrant_quote',
            'rights_quote',
        )

class CompanyTickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('common_ticker_symbol',)



class SECFilingsSerializer(serializers.ModelSerializer):
    company = CompanyNameSerializer(read_only=True)
    class Meta:
        model = SECFilings
        fields = (
            'company',
            'filing_type',
            'date_filed',
            'updated',
            'form_name',
            'title',
            'link',
        )

class CompanySECFilingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SECFilings
        fields = (
            'filing_type',
            'date_filed',
            'updated',
            'form_name',
            'title',
            'link',
        )



class FutureEarningsSerializer(serializers.ModelSerializer):
    #target_company = TargetCompanySerializer(read_only=True)
    class Meta:
        model = FutureEarnings
        fields = (
            'year',
            'earnings_indicator',
            'revenue',
            'earnings',
           # 'target_company',
        )

class TargetProfileSerializer(serializers.ModelSerializer):
    company = CompanyNameSerializer(read_only=True, many=False)
    earnings = serializers.SerializerMethodField()
    class Meta:
        model = TargetCompany
        fields = (
            'name',
            'enterprise_valuation',
            'equity_valuation',
            'pipe_size',
            'investor_presentation',
            'company',
            'earnings',
            'employees',
            'website',
            'about',
            'headquarters',
            'founded',
            'industry',
        )
    
    def get_earnings(self, instance):
        earnings = instance.futureearnings_set.all().order_by('year')
        return FutureEarningsSerializer(earnings, many=True).data


class SparklineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SECFilings
        fields = (
            'filing_type',
            'date_filed',
            'updated',
            'form_name',
            'title',
            'link',
        )

class AllSpacsSerializer(serializers.ModelSerializer):
    profile = CompanyProfileSerializer(read_only=True, many=False)
    class Meta:
        model = SECFilings
        fields = (
            'filing_type',
            'date_filed',
            'updated',
            'form_name',
            'title',
            'link',
        )

class PortfolioSerializer(serializers.ModelSerializer):
    company = CompanyProfileSerializer(read_only=True, many=True)
    class Meta:
        model = Portfolio
        fields = (
            'company',
        )  

class AddPortfolioSerializer(serializers.Serializer):
    companies = serializers.ListField(child=serializers.CharField())


class ManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Management
        fields = (
            'member',
            'role',
            'profile',
        )  