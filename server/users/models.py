# users/models.py
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.ROLE_ADMIN)  # force Admin role

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("role") != User.ROLE_ADMIN:
            raise ValueError("Superuser must have role=Admin.")

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_ADMIN = "Admin"
    ROLE_MANAGER = "Manager"
    ROLE_EMPLOYEE = "Employee"

    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_MANAGER, "Manager"),
        (ROLE_EMPLOYEE, "Employee"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_EMPLOYEE)

    objects = UserManager()  # custom manager

    def __str__(self):
        return f"{self.username} ({self.role})"
