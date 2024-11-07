from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from .serializers import UserRegisterSerializer
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

# Create your views here.

class RegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)

        if serializer.is_valid():
            serializer.save()
            user = serializer.data
            # send email function user['email]
            return Response({
                'data': user,
                'message': 'User has been created successfully'
            }, status=HTTP_201_CREATED)
        
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
