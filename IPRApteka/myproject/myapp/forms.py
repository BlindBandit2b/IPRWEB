from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from .models import Client, Service, DoctorCategory, AppointmentSchedule, Doctor, PlannedVisit, Diagnosis


class CustomLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'placeholder': 'Username',
            'class': 'input'
        })
        self.fields['password'].widget.attrs.update({
            'placeholder': 'Password',
            'class': 'input'
        })

class CustomRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'placeholder': 'Email',
        'class': 'input',
    }))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'placeholder': 'Username',
            'class': 'input',
        })
        self.fields['password1'].widget.attrs.update({
            'placeholder': 'Password',
            'class': 'input',
        })
        self.fields['password2'].widget.attrs.update({
            'placeholder': 'Confirm Password',
            'class': 'input',
        })

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user


class ClientUpdateForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'date_of_birth', 'mobile', 'address']
        widgets = {
            'mobile': forms.TextInput(attrs={'placeholder': '+375 (29) 123-45-67'}),
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
        }


class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['name', 'category', 'price', 'description']


class DoctorCategoryForm(forms.ModelForm):
    class Meta:
        model = DoctorCategory
        fields = ['name']

class VisitForm(forms.Form):
    doctor = forms.ModelChoiceField(
        queryset=Doctor.objects.all(),
        label='Врач',
        widget=forms.Select(attrs={'class': 'input'})
    )
    date = forms.DateField(
        widget=forms.Select(attrs={'class': 'input'}),
        label='Дата приема'
    )
    time_start = forms.TimeField(
        widget=forms.TimeInput(format='%H:%M', attrs={'type': 'time', 'class': 'input'}),
        label='Время начала'
    )

class DoctorProfileForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ['first_name', 'last_name', 'specialization', 'category', 'department', 'info']
        widgets = {
            'specialization': forms.Select(attrs={'class': 'input'}),
            'category': forms.Select(attrs={'class': 'input'}),
            'department': forms.Select(attrs={'class': 'input'}),
            'info': forms.Textarea(attrs={'class': 'input', 'rows': 4}),
        }


class VisitUpdateForm(forms.ModelForm):
    schedule_date = forms.DateField(label="Дата посещения")
    schedule_time_start = forms.TimeField(label="Время начала")
    schedule_time_end = forms.TimeField(label="Время окончания")
    diagnosis_text = forms.CharField(label="Диагноз", widget=forms.Textarea, required=False)

    class Meta:
        model = PlannedVisit
        fields = ['diagnosis_text']  # остальные поля редактируйте отдельно

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Инициализируем поля из связанных моделей
        if self.instance and self.instance.schedule:
            self.fields['schedule_date'].initial = self.instance.schedule.date
            self.fields['schedule_time_start'].initial = self.instance.schedule.time_start
            self.fields['schedule_time_end'].initial = self.instance.schedule.time_end
            self.fields['diagnosis_text'].initial = self.instance.diagnosis_text or (
                self.instance.diagnosis.name if self.instance.diagnosis else '')

    def save(self, commit=True):
        visit = super().save(commit=False)
        schedule = visit.schedule
        schedule.date = self.cleaned_data['schedule_date']
        schedule.time_start = self.cleaned_data['schedule_time_start']
        schedule.time_end = self.cleaned_data['schedule_time_end']
        schedule.save()

        # Сохраняем текст диагноза
        visit.diagnosis_text = self.cleaned_data.get('diagnosis_text', '').strip()

        # Обновляем/создаем объект Diagnosis и связываем с посещением
        if visit.diagnosis_text:
            diagnosis_obj, created = Diagnosis.objects.get_or_create(
                client=visit.client,
                name=visit.diagnosis_text,
                defaults={'description': visit.diagnosis_text}
            )
            visit.diagnosis = diagnosis_obj
        else:
            visit.diagnosis = None

        if commit:
            visit.save()
            self.save_m2m()
        return visit