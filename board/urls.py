from django.urls import path
from . import views

urlpatterns = [
    path('', views.whiteboard_view, name='whiteboard'),
]