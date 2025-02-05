from django.urls import path
from .views import home, pnemonia_detection

urlpatterns = [
    path("", home, name="home"),
    path("upload/", pnemonia_detection, name="pnemonia_detection"),  # Corrected route to match form submission
]
