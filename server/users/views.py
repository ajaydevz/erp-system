from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer
from .permissions import IsAdmin, IsAdminOrManager, IsOwnerOrAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    # print("enter to registration>>>>>>>>>.")
    queryset = User.objects.all()
    permission_classes = [IsAdmin]  # only Admins can register users in most ERPs  allow any! or Isadmin
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    print("enter >>>>>>")
    permission_classes = [AllowAny]



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Logout function called >>>")
        try:
            refresh_token = request.data.get('refresh')
            print("Got refresh token:", refresh_token)

            token = RefreshToken(refresh_token)
            token.blacklist()
            print("Token blacklisted")

            return Response(status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            print("Logout error:", str(e))
            return Response(status=status.HTTP_400_BAD_REQUEST)

# list users
class UsersListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return User.objects.all()  # Admin sees all
        elif user.role == 'Manager':
            return User.objects.filter(role='Employee')  
        return User.objects.none()

# creatte user
class UserCreateView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAdmin]


# Retrieve, Update, Delete user 
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
