from rest_framework import generics, status
from .models import Company, SECFilings, TargetCompany, FutureEarnings, Portfolio, Management
from .serializers import (
    CompanySerializer, 
    CompanyTickerSerializer, 
    CompanyProfileSerializer, 
    SECFilingsSerializer, 
    TargetCompanySerializer, 
    FutureEarningsSerializer, 
    TargetProfileSerializer, 
    CompanyNameSerializer,
    PortfolioSerializer,
    AddPortfolioSerializer,
    ManagementSerializer
)
import requests
from rest_framework.views import APIView
import time
from django.db.models import Q
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.conf import settings
import heapq
from itertools import chain
import datetime
import pytz
import certifi
from concurrent.futures import ThreadPoolExecutor, as_completed, wait

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework.decorators import action
from django.db.models.functions import Length

FINANCIAL_MODELING_PREP_KEY = settings.FINANCIAL_MODELING_PREP_KEY
POLYGON_KEY = settings.POLYGON_KEY
CERT_FILE = certifi.where()

EST = pytz.timezone('US/Eastern')

MAX_PORTFOLIO_SIZE = 50
MAX_RETRIES = 5
ALL_NEWS_LIMIT = '100'
MINUTE = 60
HOUR = 60 * 60

User = get_user_model()

def get_user_from_token(request):
    key = request.META.get("HTTP_AUTHORIZATION").split(' ')[1]
    token = Token.objects.get(key=key)
    user = User.objects.get(id=token.user_id)
    return user

def append_quote_details(query):
    serializer = CompanyProfileSerializer(query, many=True)
    company_tickers = ",".join([x['common_ticker_symbol'] for x in serializer.data if x['common_ticker_symbol'] != None])
    warrant_tickers = ",".join([x['warrant_ticker_symbol'] for x in serializer.data if x['warrant_ticker_symbol'] != None])
    unit_tickers = ",".join([x['unit_ticker_symbol'] for x in serializer.data if x['unit_ticker_symbol'] != None])
    rights_tickers = ",".join([x['rights_ticker_symbol'] for x in serializer.data if x['rights_ticker_symbol'] != None])
    
    external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company_tickers+','+warrant_tickers+','+unit_tickers+','+rights_tickers+"?apikey=" + FINANCIAL_MODELING_PREP_KEY 
    r = requests.get(external_api_url, timeout=10)

    for l in serializer.data:
        if l['common_ticker_symbol']:
            try:
                quote = next((x for x in r.json() if x['symbol'] == l['common_ticker_symbol']), None)
                l['common_quote'] = quote
                
            except ValueError as err:
                print("Value error: {0}".format(err))
        if l['warrant_ticker_symbol']:
            try:
                quote = next((x for x in r.json() if x['symbol'] == l['warrant_ticker_symbol']), None)
                l['warrant_quote'] = quote
                
            except ValueError as err:
                print("Value error: {0}".format(err))
        if l['unit_ticker_symbol']:
            try:
                quote = next((x for x in r.json() if x['symbol'] == l['unit_ticker_symbol']), None)
                l['unit_quote'] = quote
                
            except ValueError as err:
                print("Value error: {0}".format(err))
        if l['rights_ticker_symbol']:
            try:
                quote = next((x for x in r.json() if x['symbol'] == l['rights_ticker_symbol']), None)
                l['rights_quote'] = quote
                
            except ValueError as err:
                print("Value error: {0}".format(err))

    return serializer.data


class ListCompany(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyNameSerializer


class DetailCompany(generics.RetrieveAPIView):
    #queryset = Company.objects.all()
    lookup_field = 'common_ticker_symbol'
    queryset = Company.objects.all()
    serializer_class = CompanyProfileSerializer


@action(detail=False, methods=['GET'])
class ListSparkline(APIView):
    @method_decorator(cache_page(MINUTE))
    @method_decorator(vary_on_cookie)
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        limit = self.request.query_params.get('limit', '1000')
        offset = self.request.query_params.get("offset", '1')
 
        while attempt_num < MAX_RETRIES:
            companies = Company.objects.filter(~Q(common_ticker_symbol=''))
            serializer = CompanyTickerSerializer(companies, many=True)
            company_tickers = ",".join([x['common_ticker_symbol'] for x in serializer.data if x['common_ticker_symbol'] is not None])
            external_api_url = "https://financialmodelingprep.com/api/v3/stock_news?tickers="+company_tickers+"&limit="+ALL_NEWS_LIMIT+"&apikey=" + FINANCIAL_MODELING_PREP_KEY 
            r = requests.get(external_api_url, timeout=10, verify=False)
            if r.status_code == HTTP_200_OK:
                results = r.json()

                try:
                    paginator = Paginator(results, limit)
                except:
                    paginator = Paginator(results, limit)

                try:
                    results = paginator.page(offset)
                except PageNotAnInteger:
                    results = paginator.page(offset)
                except EmptyPage:
                    results = []

                api_count = paginator.count
                api_next = None if not results.has_next() else results.next_page_number()
                api_previous = None if not results.has_previous() else results.previous_page_number()

                data = {
                    'count': api_count,
                    'next': api_next,
                    'previous': api_previous,
                    'results': list(results)
                }

                return Response(data, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)


@action(detail=False, methods=['GET'])
class ListSecFiles(APIView):
    serializer_class = SECFilingsSerializer

    def get(self, request, *args, **kwargs):
        file_types = self.request.query_params.get('type', None)
        ticker = self.request.query_params.get('ticker', None)
        limit = self.request.query_params.get('limit', '500')
        offset = self.request.query_params.get("offset", '1')
        
        if limit:
            pass
        else:
            limit = '500'

        if file_types is not None:
            file_types = file_types.split(',')
        if ticker is not None:
            ticker = ticker.split(',')

        if ticker is not None and file_types is not None:
            queryset = SECFilings.objects.filter(company__common_ticker_symbol__iexact=ticker[0]).filter(filing_type__iregex=r'(' + '|'.join(file_types) + ')').order_by('-updated')
        elif file_types is not None:
            queryset = SECFilings.objects.filter(filing_type__iregex=r'(' + '|'.join(file_types) + ')').order_by('-updated')
        elif ticker is not None:
            prev = None
            for t in ticker:
                queryset = SECFilings.objects.filter(company__common_ticker_symbol__iexact=t)
                if prev:
                    queryset = list(chain(queryset, prev)) 
                prev = queryset
            queryset = sorted(queryset, key=lambda instance: instance.updated, reverse=True)
        else:
            queryset = SECFilings.objects.all().order_by('-updated')


        try:
            paginator = Paginator(queryset, limit)
        except:
            paginator = Paginator(queryset, limit)

        try:
            queryset = paginator.page(offset)
        except PageNotAnInteger:
            queryset = paginator.page(offset)
        except EmptyPage:
            queryset = []

        api_count = paginator.count
        api_next = None if not queryset.has_next() else queryset.next_page_number()
        api_previous = None if not queryset.has_previous() else queryset.previous_page_number()

        serializer = SECFilingsSerializer(queryset, many=True)
        data = {
            'count': api_count,
            'next': api_next,
            'previous': api_previous,
            'results': list(serializer.data)
        }
        
        return Response(data, status=HTTP_200_OK)
        
        #return data


class DetailSecFiles(generics.RetrieveAPIView):
    queryset = SECFilings.objects.all()
    serializer_class = SECFilingsSerializer


@action(detail=False, methods=['GET'])
class ListTargetProfile(generics.ListAPIView):
    serializer_class = TargetProfileSerializer

    def get_queryset(self):
        ticker = self.request.query_params.get('ticker', None)

        if ticker is not None:
            queryset = TargetCompany.objects.filter(company__common_ticker_symbol__iexact=ticker)
        else:
            queryset = TargetCompany.objects.all()
        
        return queryset


@action(detail=False, methods=['GET'])
class ListNews(APIView):
    @method_decorator(cache_page(MINUTE))
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        limit = self.request.query_params.get('limit', '10')
        offset = self.request.query_params.get("offset", '1')
 
        while attempt_num < MAX_RETRIES:
            companies = Company.objects.filter(~Q(common_ticker_symbol=''))
            serializer = CompanyTickerSerializer(companies, many=True)
            company_tickers = ",".join([x['common_ticker_symbol'] for x in serializer.data if x['common_ticker_symbol'] is not None])
            external_api_url = "https://financialmodelingprep.com/api/v3/stock_news?tickers="+company_tickers+"&limit="+ALL_NEWS_LIMIT+"&apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=10, verify=False)
            if r.status_code == HTTP_200_OK:
                results = r.json()

                try:
                    paginator = Paginator(results, limit)
                except:
                    paginator = Paginator(results, limit)

                try:
                    results = paginator.page(offset)
                except PageNotAnInteger:
                    results = paginator.page(offset)
                except EmptyPage:
                    results = []

                api_count = paginator.count
                api_next = None if not results.has_next() else results.next_page_number()
                api_previous = None if not results.has_previous() else results.previous_page_number()

                data = {
                    'count': api_count,
                    'next': api_next,
                    'previous': api_previous,
                    'results': list(results)
                }

                return Response(data, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)

@action(detail=False, methods=['GET'])
class DetailNews(APIView):
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        limit = self.request.query_params.get('limit', '5')
        offset = self.request.query_params.get("offset", '1')

        while attempt_num < MAX_RETRIES:
            company = kwargs['pk']
            external_api_url = "https://financialmodelingprep.com/api/v3/stock_news?tickers="+company+"&limit=15&apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=10)
            if r.status_code == HTTP_200_OK:
                results = r.json()

                try:
                    paginator = Paginator(results, limit)
                except:
                    paginator = Paginator(results, limit)

                try:
                    results = paginator.page(offset)
                except PageNotAnInteger:
                    results = paginator.page(offset)
                except EmptyPage:
                    results = []

                api_count = paginator.count
                api_next = None if not results.has_next() else results.next_page_number()
                api_previous = None if not results.has_previous() else results.previous_page_number()

                data = {
                    'count': api_count,
                    'next': api_next,
                    'previous': api_previous,
                    'results': list(results)
                }

                return Response(data, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)

class ListGainers(APIView):
    @method_decorator(cache_page(MINUTE))
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        while attempt_num < MAX_RETRIES:
            companies = Company.objects.filter(~Q(common_ticker_symbol=''))
            serializer = CompanyTickerSerializer(companies, many=True)
            company_tickers = ",".join([x['common_ticker_symbol'] for x in serializer.data if x['common_ticker_symbol'] is not None])
            external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company_tickers+"?apikey="+FINANCIAL_MODELING_PREP_KEY 
            
            r = requests.get(external_api_url, timeout=20, verify=False)
            if r.status_code == HTTP_200_OK:
                data = r.json()
                gainers = heapq.nlargest( 5, data, key=lambda x: x['changesPercentage'] )
                return Response(gainers, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)

class ListLosers(APIView):
    @method_decorator(cache_page(MINUTE))
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        while attempt_num < MAX_RETRIES:
            companies = Company.objects.filter(~Q(common_ticker_symbol=''))
            serializer = CompanyTickerSerializer(companies, many=True)

            company_tickers = ",".join([x['common_ticker_symbol'] for x in serializer.data if x['common_ticker_symbol'] is not None])
            
            external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company_tickers+"?apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=20, verify=False)
            if r.status_code == HTTP_200_OK:
                data = r.json()
                gainers = heapq.nsmallest( 5, data, key=lambda x: x['changesPercentage'] )
                return Response(gainers, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)


class ListMostActive(APIView):
    @method_decorator(cache_page(MINUTE))
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        while attempt_num < MAX_RETRIES:
            companies = Company.objects.filter(~Q(common_ticker_symbol=''))
            serializer = CompanyTickerSerializer(companies, many=True)
            company_tickers = ",".join([x['common_ticker_symbol'] for x in serializer.data if x['common_ticker_symbol'] is not None])
            external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company_tickers+"?apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=20, verify=False)
            if r.status_code == HTTP_200_OK:
                data = r.json()
                gainers = heapq.nlargest( 5, data, key=lambda x: x['volume'] or -1 )
                return Response(gainers, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)

class DetailExchange(APIView):
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        
        while attempt_num < MAX_RETRIES:
            company = kwargs['symbol']
            external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company+"?apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=10)
            if r.status_code == HTTP_200_OK:
                data = r.json()
                if data:
                    data = data[0]['exchange']
                else:
                    data = []
                
                return Response(data, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)


class ListQuote(APIView):
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        
        while attempt_num < MAX_RETRIES:
            company = kwargs['symbol']
            external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company+"?apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=10)
            if r.status_code == HTTP_200_OK:
                data = r.json()
                if data:
                    data = data[0]
                else:
                    data = []
                return Response(data, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)

class ListQuotes(APIView):
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        
        while attempt_num < MAX_RETRIES:
            company = kwargs['symbol']
            external_api_url = "https://financialmodelingprep.com/api/v3/quote/"+company+"?apikey="+FINANCIAL_MODELING_PREP_KEY
            r = requests.get(external_api_url, timeout=10)
            if r.status_code == HTTP_200_OK:
                data = r.json()
                return Response(data[0], status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)



@action(detail=False, methods=['GET'])
class ListTargetProfile(generics.ListAPIView):
    serializer_class = TargetProfileSerializer

    def get_queryset(self):
        ticker = self.request.query_params.get('ticker', None)

        if not ticker: 
            return Response({"error": "Request failed"}, status=HTTP_404_NOT_FOUND)

        if ticker is not None:
            queryset = TargetCompany.objects.filter(company__common_ticker_symbol__iexact=ticker)
        else:
            queryset = TargetCompany.objects.all()
        
        return queryset


@action(detail=False, methods=['GET'])
class ListAllSpacs(APIView):
    
    @method_decorator(cache_page(MINUTE))
    def get(self, request, *args, **kwargs):
        attempt_num = 0
        limit = self.request.query_params.get('limit', '100')
        offset = self.request.query_params.get("offset", '1')

 
        while attempt_num < MAX_RETRIES:
            companies = Company.objects.all()
            serializer = CompanyProfileSerializer(companies, many=True)

            if serializer.data:

                results = serializer.data

                try:
                    paginator = Paginator(results, limit)
                except:
                    paginator = Paginator(results, limit)

                try:
                    results = paginator.page(offset)
                except PageNotAnInteger:
                    results = paginator.page(offset)
                except EmptyPage:
                    results = serializer

                api_count = paginator.count
                api_next = None if not results.has_next() else results.next_page_number()
                api_previous = None if not results.has_previous() else results.previous_page_number()

                data = {
                    'count': api_count,
                    'next': api_next,
                    'previous': api_previous,
                    'results': list(results)
                }

                return Response(data, status=HTTP_200_OK)
            else:
                attempt_num += 1
                # Use a logger to log the error here
                time.sleep(5)  # Wait for 5 seconds before re-trying
        return Response({"error": "Request failed"}, status=r.status_code)



def get_portfolio_tickers(company, date):
       
    if company['common_ticker_symbol']:
        try:
            intraday = [0,0]
            if company['common_ticker_symbol']:

                url = "https://api.polygon.io/v2/aggs/ticker/"+company['common_ticker_symbol']+"/range/5/minute/"+date+"/"+date+"?unadjusted=true&sort=asc&limit=120&apiKey=" + POLYGON_KEY
                r = requests.get(url, timeout=10)
                if r.status_code == HTTP_200_OK and r.json()['resultsCount']:
                    intraday = [x['c'] for x in r.json()['results']]
                company['sparkline'] = intraday

        except ValueError as err:
            print("Value error: {0}".format(err))

class UserPortfolioView(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PortfolioSerializer

    def get(self, request, *args, **kwargs):
        # get user from the token
        user = get_user_from_token(request)
        portfolio, created = Portfolio.objects.get_or_create(user=user)
        companies = portfolio.company.all()
        serializer = CompanyProfileSerializer(companies, many=True)

        if not serializer.data:
            return Response([], status=HTTP_400_BAD_REQUEST)
            
        date = datetime.datetime.now().astimezone(EST)
        weekno = date.weekday()

        # check if weekend, if so, subtract days until the weekday
        if weekno > 4:
            date = date - datetime.timedelta(days=weekno - 4)

        # if the time is before 9:30 EST, use the previous day's data
        # display nothing if it's Monday before 9:30
        elif date.time() < datetime.time(9, 30):
            date = date - datetime.timedelta(days=1)

        date = date.strftime('%Y-%m-%d')

        threads= []
        with ThreadPoolExecutor(max_workers=20) as executor:
            for company in serializer.data:
                threads.append(executor.submit(get_portfolio_tickers, company, date))
        
        return Response(serializer.data, status=HTTP_200_OK)



class AddPortfolioView(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PortfolioSerializer

    def post(self, request, *args, **kwargs):

        if not request or not request.data:
            return Response({"message": 'Did not receive data.'}, status=HTTP_400_BAD_REQUEST)

        user = get_user_from_token(request)
        portfolio_serializer = AddPortfolioSerializer(data=request.data['data'])

        if portfolio_serializer.is_valid():
            
            company_names = portfolio_serializer.data.get('companies')
            user_portfolio, created = Portfolio.objects.get_or_create(user=user)

            if user_portfolio.company.count() + len(company_names) > MAX_PORTFOLIO_SIZE:
                return Response({'error': 'max size'}, status=HTTP_200_OK)

            companies = Company.objects.filter(name__in=company_names)
            companies = append_quote_details(companies)
            
            is_added = False
            for company_name in company_names:
                company = Company.objects.get(name=company_name)

                if not Portfolio.objects.filter(user=user, company=company).exists():
                    is_added = True
                    user_portfolio.company.add(company)
                    user_portfolio.save()

            if is_added:
                return Response(companies, status=HTTP_200_OK)
            else:
                return Response([], status=HTTP_200_OK)
        
        return Response({"message": 'Did not receive the correct data.'}, status=HTTP_400_BAD_REQUEST)

        
class RemovePortfolioView(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PortfolioSerializer

    def post(self, request, *args, **kwargs):
        if not request.data:
            return Response({"message": 'Did not receive data.'}, status=HTTP_400_BAD_REQUEST)

        user = get_user_from_token(request)
        portfolio_serializer = AddPortfolioSerializer(data=request.data['data'])

        if portfolio_serializer.is_valid():
            companies = portfolio_serializer.data.get('companies')
            user_portfolio, created = Portfolio.objects.get_or_create(user=user)

            for company_name in companies:
                company = Company.objects.get(name=company_name)
                
                if Portfolio.objects.filter(user=user, company=company).exists():
                    user_portfolio.company.remove(company)
                    user_portfolio.save()


            return Response({"message": 'Company(s) successfully added.'}, status=HTTP_200_OK)
            
        
        return Response({"message": 'Did not receive the correct data.'}, status=HTTP_400_BAD_REQUEST)


@action(detail=False, methods=['GET'])
class ListManagement(generics.ListAPIView):
    serializer_class = ManagementSerializer

    def get_queryset(self):
        ticker = self.request.query_params.get('ticker', None)

        if ticker is not None:
            queryset = Management.objects.filter(company__common_ticker_symbol__iexact=ticker).order_by(Length('role').desc())
        else:
            queryset = Management.objects.all()
        
        return queryset