# Generated by Django 3.1.4 on 2020-12-18 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0003_auto_20201218_0012'),
    ]

    operations = [
        migrations.AlterField(
            model_name='industry',
            name='name',
            field=models.CharField(max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='sector',
            name='name',
            field=models.CharField(max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='socialmedia',
            name='facebook',
            field=models.URLField(null=True),
        ),
        migrations.AlterField(
            model_name='socialmedia',
            name='instagram',
            field=models.URLField(null=True),
        ),
        migrations.AlterField(
            model_name='socialmedia',
            name='linkedin',
            field=models.URLField(null=True),
        ),
        migrations.AlterField(
            model_name='socialmedia',
            name='twitter',
            field=models.URLField(null=True),
        ),
        migrations.AlterField(
            model_name='socialmedia',
            name='website',
            field=models.URLField(null=True),
        ),
    ]