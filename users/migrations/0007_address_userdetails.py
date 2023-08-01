from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0006_class_able_to_buy'),
        ('users', '0006_alter_user_email_alter_user_first_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('voivodeship', models.CharField(max_length=50)),
                ('city', models.CharField(max_length=150)),
                ('postal_code', models.CharField(max_length=6)),
                ('street', models.CharField(blank=True, max_length=50, null=True)),
                ('building_number', models.CharField(
                    blank=True, max_length=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_image', models.ImageField(blank=True,
                 null=True, upload_to='images/profile_images')),
                ('description', models.TextField(blank=True, null=True)),
                ('year_of_birth', models.IntegerField(blank=True, null=True)),
                ('phone_number', models.CharField(
                    blank=True, max_length=20, null=True)),
                ('sex', models.CharField(blank=True, choices=[
                 ('kobieta', 'kobietas'), ('mężczyzna', 'mężczyzna')], max_length=20, null=True)),
                ('experience', models.CharField(
                    blank=True, max_length=10000, null=True)),
                ('address', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='users.address')),
                ('known_languages', models.ManyToManyField(to='classes.language')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
