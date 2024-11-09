from rest_framework import serializers
from .utils import Google, register_social_user, login_social_user
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

class GoogleSignInSerialzer(serializers.Serializer):
    access_token=serializers.CharField(min_length=6)

    def validate_access_token(self, attrs):
        access_token=attrs.get('access_token')

        google=Google()

        data=google.validate(access_token)

        if data['aud'] != settings.GOOGLE_CLIENT_ID:
            raise AuthenticationFailed('Invalid token')

        email=data.get('email')
        first_name=data.get('given_name')
        last_name=data.get('family_name')

        provider='google'

        try:
            user = register_social_user(provider, email, first_name, last_name)
            return user
        except AuthenticationFailed as e:
            raise AuthenticationFailed(e)
        except Exception as e:
            raise AuthenticationFailed('Invalid token')