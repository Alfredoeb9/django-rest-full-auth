from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_('Invalid email address'))
        
    # def create_user(self, email, first_name, last_name, password=None):
    #     if not email:
    #         raise ValueError(_('Users must have an email address'))
    #     if not first_name:
    #         raise ValueError(_('Users must have a first name'))
    #     if not last_name:
    #         raise ValueError(_('Users must have a last name'))
    #     email=self.normalize_email(email)
    #     user=self.model(email=email, first_name=first_name, last_name=last_name)
    #     user.set_password(password)
    #     user.save(using=self._db)
    #     return user

    # def create_superuser(self, email, first_name, last_name, password=None):
    #     user=self.create_user(email, first_name, last_name, password)
    #     user.is_staff=True
    #     user.is_superuser=True
    #     user.save(using=self._db)
    #     return