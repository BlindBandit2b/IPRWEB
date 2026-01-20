from django.test import TestCase, Client as TestClient
from .models import Client
from .models import Client as ClientProfile, Doctor, Service, DoctorCategory, AppointmentSchedule, PlannedVisit

from django.test import TestCase, Client
from django.contrib.auth.models import User, Group
from django.urls import reverse
from datetime import date, time, timedelta

from django.test import TestCase
from .forms import ClientUpdateForm

class ClientUpdateFormTests(TestCase):
    def test_form_valid_data(self):
        form_data = {
            'first_name': 'Иван',
            'last_name': 'Иванов',
            'date_of_birth': '1990-01-01',
            'mobile': '+375291234567',
            'address': 'Минск',
        }
        form = ClientUpdateForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_invalid_mobile(self):
        form_data = {
            'first_name': 'Иван',
            'last_name': 'Иванов',
            'date_of_birth': '1990-01-01',
            'mobile': '123',  # некорректный номер
            'address': 'Минск',
        }
        form = ClientUpdateForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('mobile', form.errors)


class VisitUpdateViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.doctor_group = Group.objects.create(name='Doctor')
        self.client_group = Group.objects.create(name='Client')

        self.doctor_user = User.objects.create_user(username='doctor', password='pass')
        self.doctor_user.groups.add(self.doctor_group)

        self.client_user = User.objects.create_user(username='client', password='pass')
        self.client_user.groups.add(self.client_group)

        self.doctor_profile = Doctor.objects.create(user=self.doctor_user)
        self.client_profile = ClientProfile.objects.create(user=self.client_user)

        self.schedule = AppointmentSchedule.objects.create(
            doctor=self.doctor_profile,
            date=date.today() + timedelta(days=1),
            time_start=time(9, 0),
            time_end=time(10, 0)
        )

        self.visit = PlannedVisit.objects.create(schedule=self.schedule, client=self.client_profile)

    def test_forbidden_for_non_doctor(self):
        self.client.login(username='client', password='pass')
        response = self.client.get(reverse('visit_update', args=[self.visit.id]))
        self.assertEqual(response.status_code, 403)

    def test_get_visit_update_form_doctor(self):
        self.client.login(username='doctor', password='pass')
        response = self.client.get(reverse('visit_update', args=[self.visit.id]))
        self.assertEqual(response.status_code, 200)
        self.assertIn('form', response.context)

    def test_post_visit_update_invalid_form(self):
        self.client.login(username='doctor', password='pass')
        response = self.client.post(reverse('visit_update', args=[self.visit.id]), {
            'schedule': '',  # пустое поле — невалидно
        })
        self.assertEqual(response.status_code, 200)  # форма перерисовывается с ошибками
        self.assertFormError(response, 'form', 'schedule', 'This field is required.')

    def test_post_visit_update_valid_form(self):
        self.client.login(username='doctor', password='pass')
        response = self.client.post(reverse('visit_update', args=[self.visit.id]), {
            'schedule': self.schedule.id,
            'client': self.client_profile.id,
            # другие нужные поля из формы
        })
        self.assertEqual(response.status_code, 302)  # редирект после успешного сохранения


class MoreViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='client', password='testpass', email='client@site.com')
        self.doctor_user = User.objects.create_user(username='doctor', password='testpass', email='doctor@doctor.com')

        client_group = Group.objects.create(name='Client')
        doctor_group = Group.objects.create(name='Doctor')
        self.user.groups.add(client_group)
        self.doctor_user.groups.add(doctor_group)

        self.client_profile = ClientProfile.objects.create(user=self.user)
        self.doctor_profile = Doctor.objects.create(user=self.doctor_user)

        self.category = DoctorCategory.objects.create(name='Категория')
        self.service = Service.objects.create(name='Консультация', price=50, category=self.category)

        self.schedule = AppointmentSchedule.objects.create(
            doctor=self.doctor_profile,
            date=date.today() + timedelta(days=1),
            time_start=time(10, 0),
            time_end=time(10, 30)
        )

        self.visit = PlannedVisit.objects.create(
            schedule=self.schedule,
            client=self.client_profile,
        )
        self.visit.services.add(self.service)

    def test_get_available_dates(self):
        url = reverse('get_available_dates', args=[self.doctor_profile.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('dates', response.json())

    def test_doctor_visits_view_forbidden(self):
        self.client.login(username='client', password='testpass')
        response = self.client.get(reverse('doctor_visits'))
        self.assertEqual(response.status_code, 403)

    def test_doctor_visits_view_success(self):
        self.client.login(username='doctor', password='testpass')
        response = self.client.get(reverse('doctor_visits'))
        self.assertEqual(response.status_code, 200)

    def test_visit_update_view_permissions(self):
        self.client.login(username='client', password='testpass')
        response = self.client.get(reverse('visit_update', args=[self.visit.id]))
        self.assertEqual(response.status_code, 403)

    def test_visit_update_view_success(self):
        self.client.login(username='doctor', password='testpass')
        response = self.client.get(reverse('visit_update', args=[self.visit.id]))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(reverse('visit_update', args=[self.visit.id]), {
            'schedule': self.schedule.id,
            'client': self.client_profile.id,
        })
        self.assertEqual(response.status_code, 302)

    def test_visit_delete_view_forbidden(self):
        self.client.login(username='client', password='testpass')
        response = self.client.post(reverse('visit_delete', args=[self.visit.id]))
        self.assertEqual(response.status_code, 403)

    def test_visit_delete_view_success(self):
        self.client.login(username='doctor', password='testpass')
        response = self.client.post(reverse('visit_delete', args=[self.visit.id]))
        self.assertEqual(response.status_code, 302)

    def test_cart_view_post_invalid_schedule(self):
        self.client.login(username='client', password='testpass')
        session = self.client.session
        session['cart'] = [self.service.id]
        session.save()

        response = self.client.post(reverse('cart'), {
            'doctor': self.doctor_profile.id,
            'date': date.today() + timedelta(days=2),
            'time_start': '08:00',
        })
        self.assertContains(response, "Выбранное время недоступно")

    def test_cart_view_get(self):
        self.client.login(username='client', password='testpass')
        response = self.client.get(reverse('cart'))
        self.assertEqual(response.status_code, 200)

    def test_service_detail_view(self):
        response = self.client.get(reverse('service_detail', args=[self.service.id]))
        self.assertEqual(response.status_code, 200)

class FormTests(TestCase):
    def test_valid_client_form(self):
        form_data = {
            'first_name': 'Иван',
            'last_name': 'Иванов',
            'date_of_birth': '2000-01-01',
            'mobile': '+375291234567',
            'address': 'Минск',
        }
        form = ClientUpdateForm(data=form_data)
        self.assertTrue(form.is_valid())

class ViewTests(TestCase):
    def setUp(self):
        self.client = TestClient()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client_model = Client.objects.create(
            user=self.user,
            first_name='Тест',
            last_name='Юзер',
            date_of_birth=date.today() - timedelta(days=365 * 20),
            mobile='+375291112233',
            address='Гомель'
        )

    def test_home_page(self):
        response = self.client.get(reverse('service_user_list'))  # замените на свой URL
        self.assertEqual(response.status_code, 200)

    def test_login_required_redirect(self):
        self.client.logout()
        response = self.client.get(reverse('my_appointments'))
        self.assertEqual(response.status_code, 302)  # редирект на логин

    def test_profile_page_authenticated(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)

class ClientModelTest(TestCase):
    def test_create_client(self):
        user = User.objects.create_user(username='anotheruser', password='54321')
        client = Client.objects.create(
            user=user,
            first_name='Иван',
            last_name='Иванов',
            date_of_birth=date.today() - timedelta(days=365*20),
            mobile='+375291234567',
            address='Минск'
        )
        self.assertEqual(str(client), "anotheruser's profile")


class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='clientuser', password='testpass', email='user@site.com')
        self.doctor_user = User.objects.create_user(username='docuser', password='testpass', email='a@doctor.com')

        Group.objects.create(name='Client')
        Group.objects.create(name='Doctor')

        self.client_group = Group.objects.get(name='Client')
        self.doctor_group = Group.objects.get(name='Doctor')
        self.user.groups.add(self.client_group)
        self.doctor_user.groups.add(self.doctor_group)

        self.client_profile = ClientProfile.objects.create(user=self.user)
        self.doctor_profile = Doctor.objects.create(user=self.doctor_user)

        self.service = Service.objects.create(name='Test Service', price=100)
        self.category = DoctorCategory.objects.create(name='Терапевт')

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)

    def test_auth_view_get(self):
        response = self.client.get(reverse('auth'))
        self.assertEqual(response.status_code, 200)

    def test_profile_view_authenticated(self):
        self.client.login(username='clientuser', password='testpass')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)

    def test_add_and_remove_from_cart(self):
        self.client.login(username='clientuser', password='testpass')
        response = self.client.get(reverse('add_to_cart', args=[self.service.id]))
        self.assertEqual(response.status_code, 302)

        session = self.client.session
        self.assertIn(self.service.id, session.get('cart', []))

        response = self.client.get(reverse('remove_from_cart', args=[self.service.id]))
        self.assertEqual(response.status_code, 302)
        session = self.client.session
        self.assertNotIn(self.service.id, session.get('cart', []))

    def test_service_create_update_delete(self):
        self.client.login(username='docuser', password='testpass')

        # Create
        response = self.client.post(reverse('service_create'), {
            'name': 'New Service',
            'price': 123,
        })
        self.assertEqual(response.status_code, 302)

        # Update
        service = Service.objects.create(name='To Update', price=50)
        response = self.client.post(reverse('service_update', args=[service.pk]), {
            'name': 'Updated Service',
            'price': 60,
        })
        self.assertEqual(response.status_code, 302)

        # Delete (GET and POST)
        response = self.client.get(reverse('service_delete', args=[service.pk]))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(reverse('service_delete', args=[service.pk]))
        self.assertEqual(response.status_code, 302)

    def test_doctor_category_crud(self):
        # Create
        response = self.client.post(reverse('doctor_category_create'), {'name': 'Test Cat'})
        self.assertEqual(response.status_code, 302)

        # Update
        response = self.client.post(reverse('doctor_category_update', args=[self.category.pk]), {'name': 'Updated Cat'})
        self.assertEqual(response.status_code, 302)

        # Delete
        response = self.client.post(reverse('doctor_category_delete', args=[self.category.pk]))
        self.assertEqual(response.status_code, 302)

    def test_user_service_list_filter(self):
        response = self.client.get(reverse('service_user_list'), {
            'category': self.category.id,
            'price_min': 50,
            'price_max': 150,
        })
        self.assertEqual(response.status_code, 200)

    def test_covid_stats_and_joke(self):
        response = self.client.get(reverse('covid_stats'))
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('joke_view'))
        self.assertEqual(response.status_code, 200)

    def test_visit_update_and_delete_security(self):
        self.client.login(username='docuser', password='testpass')

        schedule = AppointmentSchedule.objects.create(
            doctor=self.doctor_profile,
            date=date.today() + timedelta(days=1),
            time_start=time(9, 0)
        )
        visit = PlannedVisit.objects.create(schedule=schedule, client=self.client_profile)

        response = self.client.get(reverse('visit_update', args=[visit.pk]))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(reverse('visit_update', args=[visit.pk]), {
            'notes': 'Updated visit',
        })
        self.assertEqual(response.status_code, 302)

        response = self.client.get(reverse('visit_delete', args=[visit.pk]))
        self.assertEqual(response.status_code, 200)

        response = self.client.post(reverse('visit_delete', args=[visit.pk]))
        self.assertEqual(response.status_code, 302)

