# Generated by Django 3.1.5 on 2021-01-14 03:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0011_auto_20210109_2148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='targetcompany',
            name='social_media',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='companies.socialmedia'),
        ),
    ]
