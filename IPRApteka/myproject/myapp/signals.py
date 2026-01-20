from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Client
from .models import Doctor

from django.contrib.auth.models import Group

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.groups.filter(name='Doctor').exists():
            # Создаем профиль Доктора
            Doctor.objects.create(user=instance)
        else:
            # Создаем профиль Клиента по умолчанию
            Client.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if instance.groups.filter(name='Doctor').exists():
        if hasattr(instance, 'doctor'):
            instance.doctor.save()
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
