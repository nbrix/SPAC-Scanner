# Generated by Django 3.1.7 on 2021-04-01 01:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0034_auto_20210401_0103'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='company',
            name='common_change',
        ),
        migrations.RemoveField(
            model_name='company',
            name='common_change_perc',
        ),
        migrations.RemoveField(
            model_name='company',
            name='common_price',
        ),
        migrations.RemoveField(
            model_name='company',
            name='common_volume',
        ),
        migrations.RemoveField(
            model_name='company',
            name='rights_change',
        ),
        migrations.RemoveField(
            model_name='company',
            name='rights_change_perc',
        ),
        migrations.RemoveField(
            model_name='company',
            name='rights_price',
        ),
        migrations.RemoveField(
            model_name='company',
            name='rights_volume',
        ),
        migrations.RemoveField(
            model_name='company',
            name='unit_change',
        ),
        migrations.RemoveField(
            model_name='company',
            name='unit_change_perc',
        ),
        migrations.RemoveField(
            model_name='company',
            name='unit_price',
        ),
        migrations.RemoveField(
            model_name='company',
            name='unit_volume',
        ),
        migrations.RemoveField(
            model_name='company',
            name='warrant_change',
        ),
        migrations.RemoveField(
            model_name='company',
            name='warrant_change_perc',
        ),
        migrations.RemoveField(
            model_name='company',
            name='warrant_price',
        ),
        migrations.RemoveField(
            model_name='company',
            name='warrant_volume',
        ),
    ]