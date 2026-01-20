from django.contrib import admin
from .models import AppointmentSchedule, Doctor, Department, Specialization, PlannedVisit, Client

from django.urls import path
from django.db.models import Sum, Count
from django.shortcuts import render
from datetime import date

class CustomAdminSite(admin.AdminSite):
    site_header = "Панель администратора"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('visit-statistics/', self.admin_view(self.visit_statistics_view), name='visit_statistics'),
        ]
        # Добавляем кастомные URLы перед стандартными
        return custom_urls + urls

    def visit_statistics_view(self, request):
        # Параметры фильтрации из GET
        client_id = request.GET.get('client')
        doctor_id = request.GET.get('doctor')
        visit_date = request.GET.get('visit_date')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        context = {}

        # 1. Планируемые посещения с сортировкой по дате и группировкой по клиентам
        today = date.today()
        planned_visits = PlannedVisit.objects.filter(schedule__date__gte=today).order_by('schedule__date')
        visits_by_client = planned_visits.values(
            'client__id', 'client__first_name', 'client__last_name'
        ).annotate(visit_count=Count('id')).order_by('client__last_name')
        context['visits_by_client'] = visits_by_client

        # 2. Стоимость посещений клиента за период с группировкой по врачам
        cost_by_doctor = None
        if client_id and start_date and end_date:
            cost_by_doctor = PlannedVisit.objects.filter(
                client_id=client_id,
                schedule__date__range=[start_date, end_date]
            ).values(
                'schedule__doctor__id',
                'schedule__doctor__first_name',
                'schedule__doctor__last_name'
            ).annotate(total_cost=Sum('services__price')).order_by('schedule__doctor__last_name')
        context['cost_by_doctor'] = cost_by_doctor

        # 3. Список клиентов, которым назначено посещение конкретного врача на дату
        clients_for_doctor_date = None
        if doctor_id and visit_date:
            clients_for_doctor_date = PlannedVisit.objects.filter(
                schedule__doctor_id=doctor_id,
                schedule__date=visit_date
            ).values(
                'client__id', 'client__first_name', 'client__last_name'
            ).distinct()
        context['clients_for_doctor_date'] = clients_for_doctor_date

        # 4. Все клиенты заданного врача
        all_clients_for_doctor = None
        if doctor_id:
            all_clients_for_doctor = Client.objects.filter(
                plannedvisit__schedule__doctor_id=doctor_id
            ).distinct()
        context['all_clients_for_doctor'] = all_clients_for_doctor

        # Передаем списки для фильтров — ВСЕ клиенты и ВСЕ врачи без фильтраций
        context['clients'] = Client.objects.all()
        context['doctors'] = Doctor.objects.all()

        return render(request, 'admin/visit_statistics.html', context)


# Создаем и регистрируем кастомный админ-сайт
custom_admin_site = CustomAdminSite(name='customadmin')
custom_admin_site.register(PlannedVisit)
custom_admin_site.register(Client)
custom_admin_site.register(Doctor)
custom_admin_site.register(AppointmentSchedule)


@admin.register(AppointmentSchedule)
class AppointmentScheduleAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'date', 'time_start', 'time_end')
    list_filter = ('doctor', 'date')
    search_fields = ('doctor__user__username',)  # Поиск по имени врача


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'specialization', 'category', 'department')
    search_fields = ('first_name', 'last_name')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('name', 'department')
    list_filter = ('department',)
    search_fields = ('name',)
