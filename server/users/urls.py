from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UsersListView,
    ProfileView,
    UserDetailView,
    UserCreateView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('users/', UsersListView.as_view(), name='users-list'),
    path('users/create/', UserCreateView.as_view(), name='users-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='users-detail'),
    path('profile/', ProfileView.as_view(), name='profile'),
]


