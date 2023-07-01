import validators
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Site


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(
        write_only=True, required=False, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=False)

    def validate_email(self, value):
        user = self.instance
        if value and User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return value

    def validate_username(self, value):
        user = self.instance
        if value and User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def validate(self, attrs):
        if 'password' in attrs and 'password_confirm' in attrs and attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def update(self, instance, validated_data):
        if 'email' in self.validated_data:
            instance.email = self.validated_data['email']
        if 'username' in self.validated_data:
            instance.username = self.validated_data['username']
        if 'password' in self.validated_data:
            instance.set_password(self.validated_data['password'])
        instance.save()
        return instance


class SiteSerializer(serializers.ModelSerializer):

    def validate(self, data):
        if 'baseURL' in data and not validators.url(data['baseURL']):
            raise serializers.ValidationError(
                {"baseURL": "baseURL field should be a valid url."})
        data.pop('createdAt', None)
        data.pop('updatedAt', None)
        data.pop('status', None)
        return data

    class Meta:
        model = Site
        fields = ('baseURL', 'note', 'status', 'createdAt', 'updatedAt')
