from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from .serializers import GoogleSignInSerialzer

class GoogleSignInView(GenericAPIView):
    serializer_class=GoogleSignInSerialzer

    def post(self, request):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['access_token'])

        return Response(data, status=HTTP_200_OK)