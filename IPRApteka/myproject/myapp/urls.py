from django.urls import path
from . import views

urlpatterns = [
    path('add-to-cart/<int:pk>/', views.add_to_cart, name='add_to_cart'),
    path('my_appointments/', views.my_appointments, name='my_appointments'),
    path('cart/', views.cart_view, name='cart'),
    path('remove-from-cart/<int:pk>/', views.remove_from_cart, name='remove_from_cart'),
    path('auth/', views.auth_view, name="auth"),
    path('main/', views.user_service_list, name='service_user_list'),
    path('main/<int:pk>/', views.service_detail, name='service_detail'),
    path('profile/', views.profile_view, name="profile"),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('doctor/', views.profile_view, name="doctor"),
    path('doctor/edit/', views.edit_doctor_profile, name='edit_doctor_profile'),
    path('get-available-dates/<int:doctor_id>/', views.get_available_dates, name='get_available_dates'),
    path('services/', views.service_list, name='service_list'),
    path('services/new/', views.service_create, name='service_create'),
    path('services/<int:pk>/edit/', views.service_update, name='service_update'),
    path('services/<int:pk>/delete/', views.service_delete, name='service_delete'),
    path('doctor-categories/', views.doctor_category_list, name='doctor_category_list'),
    path('doctor-categories/new/', views.doctor_category_create, name='doctor_category_create'),
    path('doctor-categories/<int:pk>/edit/', views.doctor_category_update, name='doctor_category_update'),
    path('doctor-categories/<int:pk>/delete/', views.doctor_category_delete, name='doctor_category_delete'),
    path('doctor/visits/', views.doctor_visits_view, name='doctor_visits'),
    path('doctor/visit/<int:visit_id>/edit/', views.visit_update_view, name='visit_update'),
    path('doctor/visit/<int:visit_id>/delete/', views.visit_delete_view, name='visit_delete'),
    path('api/covid/Belarus/', views.covid_stats, name='covid-stats'),
    path('api/covid/', views.covid_stats, name='covid-stats-worldwide'),
]

