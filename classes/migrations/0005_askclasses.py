# Generated by Django 4.2 on 2023-10-22 07:10

import classes.validators
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0009_alter_userdetails_sex'),
        ('classes', '0004_alter_opinion_classes_rated'),
    ]

    operations = [
        migrations.CreateModel(
            name='AskClasses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sended_at', models.DateTimeField(auto_now_add=True)),
                ('student_message', models.TextField()),
                ('accepted', models.BooleanField(blank=True, null=True)),
                ('teacher_message', models.TextField(blank=True, null=True)),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.address')),
                ('classes', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classes.class')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, validators=[classes.validators.validate_student_role])),
            ],
        ),
    ]
