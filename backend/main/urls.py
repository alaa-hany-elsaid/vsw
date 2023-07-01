from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .api import profile
from .api.sites import Sites, SiteDetail

urlpatterns = [
    path('login', views.LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', views.RegisterView.as_view(), name='auth_register'),
    path('test', views.test_end_point, name='test'),
    path('profile', profile.ProfileAPIView.as_view(), name="profile"),
    path('sites', Sites.as_view()),
    path('sites/<int:pk>', SiteDetail.as_view()),
    path('', views.get_routes)
]