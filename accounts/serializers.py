from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=3, write_only=True)
    password2 = serializers.CharField(max_length=68, min_length=3, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {'password': {'required': True, 'write_only': True, 'min_length': 3, 'max_length': 68}, 'password2' : {'required': True, 'write_only': True, 'min_length': 3, 'max_length': 68}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Password fields did not match'})
        
        return attrs
    
    def create(self, validated_data):
        del validated_data['password2']
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user
