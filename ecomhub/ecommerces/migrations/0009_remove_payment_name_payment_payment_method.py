# Generated by Django 5.2 on 2025-04-12 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerces', '0008_alter_order_payment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='name',
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_method',
            field=models.CharField(choices=[('MOMO', 'Momo'), ('CREDIT', 'Thẻ tín dụng'), ('COD', 'Thanh toán khi nhận hàng'), ('BANK', 'Chuyển khoản ngân hàng')], default='COD', max_length=50),
        ),
    ]
