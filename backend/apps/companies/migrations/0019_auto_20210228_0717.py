# Generated by Django 3.1.5 on 2021-02-28 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0018_auto_20210228_0538'),
    ]

    operations = [
        migrations.AlterField(
            model_name='management',
            name='current_member',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='management',
            name='hire_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='management',
            name='leave_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='management',
            name='profile',
            field=models.TextField(null=True),
        ),
    ]