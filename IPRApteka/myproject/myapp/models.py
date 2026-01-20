from django.db import models
from django.contrib.auth.models import User  # Стандартный User
from django.core.validators import RegexValidator, MinValueValidator

from django.core.exceptions import ValidationError
from datetime import date

def validate_age(value):
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    if age < 18:
        raise ValidationError('Вам должно быть не менее 18 лет.')


from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Specialization(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='specializations',  null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.department.name})"


class DoctorCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    specialization = models.ForeignKey(Specialization, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(DoctorCategory, on_delete=models.SET_NULL, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    info = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}"

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(validators=[validate_age], null=True, blank=True)
    mobile = models.CharField(
        max_length=20,
        validators=[RegexValidator(regex = r'^\+375\d{9}$')],
        help_text='Введите номер в формате +375XXXXXXXXX без пробелов.')
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

class Diagnosis(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

class Service(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(DoctorCategory, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name

class AppointmentSchedule(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()

class PlannedVisit(models.Model):
    schedule = models.ForeignKey(AppointmentSchedule, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    services = models.ManyToManyField(Service)
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.SET_NULL, null=True, blank=True)
    diagnosis_text = models.TextField(null=True, blank=True)  # новое поле для текста диагноза

    @property
    def total_price(self):
        return sum(service.price for service in self.services.all())

class Sale(models.Model):
    visit = models.ForeignKey(PlannedVisit, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    date = models.DateField(auto_now_add=True)
