# Generated by Django 4.2 on 2023-08-06 11:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0013_alter_schedule_unique_together_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='class',
            name='type_of_classes',
        ),
        migrations.DeleteModel(
            name='TypeOfClasses',
        ),
    ]
