# Generated by Django 3.1.5 on 2021-01-09 21:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0009_auto_20201220_0512'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='targetcompany',
            name='industry',
        ),
        migrations.RemoveField(
            model_name='targetcompany',
            name='sector',
        ),
        migrations.RemoveField(
            model_name='targetcompany',
            name='social_media',
        ),
        migrations.RemoveField(
            model_name='company',
            name='target_company',
        ),
        migrations.DeleteModel(
            name='FutureEarnings',
        ),
        migrations.DeleteModel(
            name='TargetCompany',
        ),
    ]