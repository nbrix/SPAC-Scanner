# Generated by Django 3.1.4 on 2020-12-18 00:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0002_auto_20201218_0010'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='shares_redeemed',
            field=models.PositiveIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='trust_size',
            field=models.IntegerField(null=True),
        ),
    ]
