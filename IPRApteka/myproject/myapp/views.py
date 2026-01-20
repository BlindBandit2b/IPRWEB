import datetime
import requests
from django.http import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.http import HttpResponseForbidden
from django.urls import reverse
from .models import AppointmentSchedule
from django.shortcuts import render, get_object_or_404, redirect
from .forms import CustomLoginForm, CustomRegisterForm, ClientUpdateForm, ServiceForm, DoctorCategoryForm, \
    VisitForm, DoctorProfileForm, VisitUpdateForm # формы, которые создадим ниже
from django.contrib.auth.decorators import login_required
from .models import Client, Doctor, Service, DoctorCategory, PlannedVisit, AppointmentSchedule  # импорт моделей профилей


def auth_view(request):
    if request.method == 'POST':
        if 'login_submit' in request.POST:
            login_form = CustomLoginForm(request, data=request.POST)
            register_form = CustomRegisterForm()
            if login_form.is_valid():
                user = login_form.get_user()
                auth_login(request, user)
                if user.groups.filter(name='Doctor').exists():
                    return redirect('service_list')  # Название маршрута для докторов
                else:
                    return redirect('service_user_list')  # Название маршрута для клиентов

        elif 'register_submit' in request.POST:
            register_form = CustomRegisterForm(request.POST)
            login_form = CustomLoginForm()
            if register_form.is_valid():
                user = register_form.save()
                user.email = register_form.cleaned_data.get('email')
                user.save()

                # Назначение группы в зависимости от email
                if user.email.endswith('@doctor.com'):
                    group = Group.objects.get(name='Doctor')
                    user.groups.add(group)
                    # Создаём профиль доктора
                    Doctor.objects.create(user=user)
                else:
                    group = Group.objects.get(name='Client')
                    user.groups.add(group)
                    # Создаём профиль клиента
                    Client.objects.create(user=user)

                auth_login(request, user)
                if user.groups.filter(name='Doctor').exists():
                    return redirect('service_list')  # Название маршрута для докторов
                else:
                    return redirect('service_user_list')  # Название маршрута для клиентов
    else:
        login_form = CustomLoginForm()
        register_form = CustomRegisterForm()

    return render(request, 'myapp/auth.html', {
        'login_form': login_form,
        'register_form': register_form,
    })

def home(request):
    return render(request, 'myapp/home.html')

@login_required
def profile_view(request):
    user = request.user
    user = request.user
    # Получаем шутку с JokeAPI (медицинскую однострочную)
    try:
        response = requests.get("https://v2.jokeapi.dev/joke/Any?contains=doctor")
        joke_data = response.json()

        if joke_data.get('type') == 'single':
            joke = joke_data.get('joke', 'Шутка не найдена')
        elif joke_data.get('type') == 'twopart':
            joke = f"{joke_data.get('setup', '')} ... {joke_data.get('delivery', '')}"
        else:
            joke = 'Шутка не найдена'
    except Exception:
        joke = 'Не удалось получить шутку :('

    # Проверяем, есть ли профиль клиента
    client_profile = getattr(user, 'profile', None)  # related_name='profile' в Client.user
    # Проверяем, есть ли профиль доктора
    doctor_profile = getattr(user, 'doctor', None)  # related_name не указан — default 'doctor'
    if user.groups.filter(name='Doctor').exists():
        context = {
            'type': 'doctor',
            'first_name': doctor_profile.first_name,
            'last_name': doctor_profile.last_name,
            'email': user.email,
            'specialization': doctor_profile.specialization,
            'category': doctor_profile.category,
            'department': doctor_profile.department,
            'info': doctor_profile.info,
        }
        return render(request, 'myapp/profile_d.html', context)
    elif user.groups.filter(name='Client').exists():
        context = {
            'type': 'client',
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_of_birth': getattr(user.profile, 'date_of_birth', None),
            'mobile': getattr(user.profile, 'mobile', None),
            'address': getattr(user.profile, 'address', None),
            'joke': joke,  # передаем шутку
        }
        return render(request, 'myapp/profile_c.html', context)
    else:
        return redirect('service_user_list')

@login_required
def edit_profile(request):
    client = Client.objects.get(user=request.user)

    if request.method == 'POST':
        form = ClientUpdateForm(request.POST, instance=client)
        if form.is_valid():
            form.save()
            return redirect('profile')  # Название URL для просмотра профиля
    else:
        form = ClientUpdateForm(instance=client)

    return render(request, 'myapp/edit.html', {'form': form})

@login_required
def edit_doctor_profile(request):
    doctor = request.user.doctor

    if request.method == 'POST':
        form = DoctorProfileForm(request.POST, instance=doctor)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = DoctorProfileForm(instance=doctor)

    return render(request, 'myapp/edit_doctor.html', {'form': form})

def service_list(request):
    services = Service.objects.all()
    return render(request, 'myapp/service_list.html', {'services': services})

def service_create(request):
    if request.method == 'POST':
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('service_list')
    else:
        form = ServiceForm()
    return render(request, 'myapp/service_form.html', {'form': form})

def service_update(request, pk):
    service = get_object_or_404(Service, pk=pk)
    if request.method == 'POST':
        form = ServiceForm(request.POST, instance=service)
        if form.is_valid():
            form.save()
            return redirect('service_list')
    else:
        form = ServiceForm(instance=service)
    return render(request, 'myapp/service_form.html', {'form': form})

def service_delete(request, pk):
    service = get_object_or_404(Service, pk=pk)
    if request.method == 'POST':
        service.delete()
        return redirect('service_list')
    return render(request, 'myapp/service_confirm_delete.html', {'service': service})


def doctor_category_list(request):
    categories = DoctorCategory.objects.all()
    return render(request, 'myapp/doctor_category_list.html', {'categories': categories})

def doctor_category_create(request):
    if request.method == 'POST':
        form = DoctorCategoryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('doctor_category_list')
    else:
        form = DoctorCategoryForm()
    return render(request, 'myapp/doctor_category_form.html', {'form': form})

def doctor_category_update(request, pk):
    category = get_object_or_404(DoctorCategory, pk=pk)
    if request.method == 'POST':
        form = DoctorCategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            return redirect('doctor_category_list')
    else:
        form = DoctorCategoryForm(instance=category)
    return render(request, 'myapp/doctor_category_form.html', {'form': form})

def doctor_category_delete(request, pk):
    category = get_object_or_404(DoctorCategory, pk=pk)
    if request.method == 'POST':
        category.delete()
        return redirect('doctor_category_list')
    return render(request, 'myapp/doctor_category_confirm_delete.html', {'category': category})

def user_service_list(request):
    services = Service.objects.all()
    categories = DoctorCategory.objects.all()

    category_id = request.GET.get('category')
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')

    if category_id:
        services = services.filter(category_id=category_id)
    if price_min:
        services = services.filter(price__gte=price_min)
    if price_max:
        services = services.filter(price__lte=price_max)

    context = {
        'services': services,
        'categories': categories,
        'request': request,  # нужно для сохранения значений в форме
    }
    return render(request, 'myapp/service_user_list.html', context)

def service_detail(request, pk):
    service = get_object_or_404(Service, pk=pk)
    return render(request, 'myapp/service_detail.html', {'service': service})


@login_required
def cart_view(request):
    cart = request.session.get('cart', [])
    services = Service.objects.filter(pk__in=cart)
    total_price = sum(service.price for service in services)

    if request.method == 'POST':
        form = VisitForm(request.POST)
        if form.is_valid():
            client = request.user.profile
            doctor = form.cleaned_data['doctor']
            date = form.cleaned_data['date']
            time_start = form.cleaned_data['time_start']

            try:
                schedule = AppointmentSchedule.objects.get(doctor=doctor, date=date, time_start=time_start)
            except AppointmentSchedule.DoesNotExist:
                form.add_error(None, "Выбранное время недоступно")
                # Вернуть форму с ошибкой
                return render(request, 'myapp/cart.html', {
                    'services': services,
                    'total_price': total_price,
                    'form': form,
                })

            visit = PlannedVisit.objects.create(schedule=schedule, client=client)
            visit.services.set(services)
            visit.save()
            request.session['cart'] = []
            return redirect('my_appointments')
        else:
            print("Form errors:", form.errors)
    else:
        form = VisitForm()

    return render(request, 'myapp/cart.html', {
        'services': services,
        'total_price': total_price,
        'form': form,
    })

def remove_from_cart(request, pk):
    cart = request.session.get('cart', [])
    if pk in cart:
        cart.remove(pk)
        request.session['cart'] = cart
    return redirect('cart')

@login_required
def add_to_cart(request, pk):
    cart = request.session.get('cart', [])
    if pk not in cart:
        cart.append(pk)
        request.session['cart'] = cart
    return redirect('cart')

@login_required
def my_appointments(request):
    client = request.user.profile  # так как у Client related_name='profile'
    visits = PlannedVisit.objects.filter(client=client).order_by('schedule__date', 'schedule__time_start')
    return render(request, 'myapp/my_appointments.html', {'visits': visits})

@require_GET
def get_available_dates(request, doctor_id):
    # Получаем уникальные даты расписания врача, которые еще не заняты
    dates_qs = AppointmentSchedule.objects.filter(
        doctor_id=doctor_id,
        date__gte=datetime.date.today()
    ).order_by('date').values_list('date', flat=True).distinct()

    # Преобразуем даты в строку ISO для JS
    dates = [date.isoformat() for date in dates_qs]

    return JsonResponse({'dates': dates})

@login_required
def doctor_visits_view(request):
    # Получаем объект доктора по текущему юзеру
    try:
        doctor = request.user.doctor  # если связь OneToOne с User
    except Doctor.DoesNotExist:
        return HttpResponseForbidden("У вас нет доступа к этой странице.")

    visits = PlannedVisit.objects.filter(schedule__doctor=doctor).order_by('schedule__date', 'schedule__time_start')

    context = {
        'visits': visits,
    }
    return render(request, 'myapp/doctor_visits.html', context)


@login_required
def visit_update_view(request, visit_id):
    visit = get_object_or_404(PlannedVisit, id=visit_id)
    # Проверяем, что текущий пользователь — врач, владелец посещения
    if not hasattr(request.user, 'doctor') or visit.schedule.doctor != request.user.doctor:
        return HttpResponseForbidden("У вас нет прав для изменения этого посещения.")

    if request.method == "POST":
        form = VisitUpdateForm(request.POST, instance=visit)
        if form.is_valid():
            form.save()
            return redirect(reverse('doctor_visits'))
    else:
        form = VisitUpdateForm(instance=visit)

    return render(request, 'myapp/visit_update.html', {'form': form, 'visit': visit})


@login_required
def visit_delete_view(request, visit_id):
    visit = get_object_or_404(PlannedVisit, id=visit_id)
    if not hasattr(request.user, 'doctor') or visit.schedule.doctor != request.user.doctor:
        return HttpResponseForbidden("У вас нет прав для удаления этого посещения.")

    if request.method == "POST":
        visit.delete()
        return redirect(reverse('doctor_visits'))

    return render(request, 'myapp/visit_confirm_delete.html', {'visit': visit})


def covid_stats(request, country='worldwide'):
    if country == 'worldwide':
        url = 'https://disease.sh/v3/covid-19/all'
        display_country = 'Мир'
    else:
        url = f'https://disease.sh/v3/covid-19/countries/{country}'
        display_country = country.capitalize()

    response = requests.get(url)
    data = response.json() if response.status_code == 200 else None

    context = {
        'data': data,
        'country': display_country,
        'error': None if data else 'Не удалось получить данные',
    }
    return render(request, 'covid_stats.html', context)

def joke_view(request):
    url = "https://v2.jokeapi.dev/joke/Medical?type=single"
    response = requests.get(url)
    joke_data = response.json()

    joke_text = joke_data.get('joke', 'Шутка не найдена')

    return render(request, 'joke.html', {'joke': joke_text})
