# Generated by Django 3.1.5 on 2021-03-01 23:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0023_auto_20210301_2311'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='common_change',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='common_change_perc',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='common_volume',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='rights_change',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='rights_change_perc',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='rights_volume',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='unit_change',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='unit_change_perc',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='unit_volume',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='warrant_change',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='warrant_change_perc',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='warrant_volume',
            field=models.CharField(max_length=16, null=True),
        ),
    ]