from django.contrib import admin
from django.urls import path, include
from .views import (
    ChangeEmailView,
    UserEmailView,
    ChangePasswordView,
    UserDetailsView,
    SubscribeView,
    CancelSubscription
)

urlpatterns = [
    path('email/', UserEmailView.as_view(), name='email'),
    path('change-email/', ChangeEmailView.as_view(), name='change-email'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('billing/', UserDetailsView.as_view(), name='billing'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('cancel-subscription/', CancelSubscription.as_view(), name='cancel-subscription'),
]
