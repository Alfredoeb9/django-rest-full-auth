from google.auth.transport import requests
from google.oauth2 import id_token
from accounts.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

class Google():

    @staticmethod
    def validate(access_token):
        try:
            idinfo = id_token.verify_oauth2_token(access_token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            return idinfo
        except Exception as e:
            raise AuthenticationFailed('Invalid token')

def login_social_user(email, password):
    login_user = authenticate(email=email, password=password)    
    user_tokens = login_user.tokens()

    return {
        'email': login_user.email,
        'full_name': login_user.get_full_name,
        'access_token': str(user_tokens.get('access')),
        'refresh_token': str(user_tokens.get('refresh'))
    }
    

def register_social_user(provider, email, first_name, last_name):
    user = User.objects.filter(email=email)

    if user.exists():
        user = user.first()

        if provider != user.auth_provider:
            raise AuthenticationFailed(f"Please continue your login using {user.auth_provider}")

        return login_social_user(user.email, settings.SOCIAL_AUTH_PASSWORD)
    
    new_user = User.objects.create(
        email=email,
        first_name=first_name,
        last_name=last_name,
        auth_provider=provider,
        password=settings.SOCIAL_AUTH_PASSWORD,
        is_verified=True
    )

    new_user.save()

    result = login_social_user(new_user.email, settings.SOCIAL_AUTH_PASSWORD)
    
    return result

