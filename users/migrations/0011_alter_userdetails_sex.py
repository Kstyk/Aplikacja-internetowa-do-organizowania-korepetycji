# Generated by Django 4.2 on 2023-11-01 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_alter_userdetails_sex'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='sex',
            field=models.CharField(blank=True, choices=[('mężczyzna', 'mężczyzna'), ('kobieta', 'kobieta')], max_length=20, null=True),
        ),
    ]
