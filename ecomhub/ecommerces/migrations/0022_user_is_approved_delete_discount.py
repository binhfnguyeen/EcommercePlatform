# Generated by Django 5.2 on 2025-06-03 02:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerces', '0021_alter_order_status_alter_payment_payment_method'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_approved',
            field=models.BooleanField(default=True),
        ),
        migrations.DeleteModel(
            name='Discount',
        ),
    ]
