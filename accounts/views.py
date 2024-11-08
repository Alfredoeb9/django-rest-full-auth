from django.shortcuts import render
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from accounts.utils import send_otp_email
from .serializers import UserRegisterSerializer
from .models import OneTimePassword


# THIS IS WHAT GETS HIT WHEN A USER REGISTERS

class RegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)

        if serializer.is_valid():
            serializer.save()
            user = serializer.data

            # In production user celery to send email to delay the response
            send_otp_email(user['email'])

            return Response({
                'data': user,
                'message': 'User has been created successfully'
            }, status=HTTP_201_CREATED)
        
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        otp_code = request.data.get('otp')

        if not otp_code:
            return Response({'error': 'OTP is required'}, status=HTTP_400_BAD_REQUEST)
        
        try:
            user_otp = OneTimePassword.objects.get(otp=otp_code)
            user = user_otp.user

            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({'message': 'User has been verified successfully'}, status=HTTP_201_CREATED)
            
            return Response({'message': 'User is already verified'}, status=HTTP_204_NO_CONTENT)
        
        except OneTimePassword.DoesNotExist:
            return Response({'error': 'Invalid OTP'}, status=HTTP_400_BAD_REQUEST)