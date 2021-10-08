from rest_framework import serializers
from rest_auth.serializers import TokenSerializer
from django.contrib.auth import get_user_model

class ChangeEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    confirm_email = serializers.EmailField()

class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(style={'input_type': 'password'})
    confirm_password = serializers.CharField(style={'input_type': 'password'})
    current_password = serializers.CharField(style={'input_type': 'password'})

class SubscribeSerializer(serializers.Serializer):
    stripeToken = serializers.CharField(max_length=60)
    payment_method_id = serializers.CharField(max_length=60)

class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('is_member',)

class CustomTokenSerializer(TokenSerializer):
    user = UserTokenSerializer(read_only=True)

    class Meta(TokenSerializer.Meta):
        fields = ('key', 'user')