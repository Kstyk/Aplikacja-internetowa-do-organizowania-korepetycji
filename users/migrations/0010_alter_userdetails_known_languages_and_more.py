# Generated by Django 4.2 on 2023-07-24 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0006_class_able_to_buy'),
        ('users', '0009_alter_userdetails_known_languages_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='known_languages',
            field=models.ManyToManyField(blank=True, related_name='known_languages', to='classes.language'),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='phone_number',
            field=models.CharField(blank=True, error_messages={'unique': 'Użytkownik o podanym numerze telefonu już istnieje.'}, max_length=20, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='sex',
            field=models.CharField(blank=True, choices=[('kobieta', 'kobieta'), ('mężczyzna', 'mężczyzna')], max_length=20, null=True),
        ),
    ]
