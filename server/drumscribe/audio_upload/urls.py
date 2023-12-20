from django.urls import path
from .import views

urlpatterns = [
    path('upload/', views.upload_audio, name='upload_audio'),
    path('separate_drums/', views.separate_drums, name='separate_drums'),
]
