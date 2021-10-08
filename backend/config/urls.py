from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('spac-admin1135/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/v1/', include('apps.companies.urls')),
    path('api/v1/', include('apps.accounts.urls')),
    path('api/v1/rest-auth/', include('rest_auth.urls')),
    path('api/v1/rest-auth/registration/', include('rest_auth.registration.urls')),
]
