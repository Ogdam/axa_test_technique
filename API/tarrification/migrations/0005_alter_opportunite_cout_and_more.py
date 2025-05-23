# Generated by Django 4.2.20 on 2025-05-07 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tarrification", "0004_alter_opportunite_cout"),
    ]

    operations = [
        migrations.AlterField(
            model_name="opportunite",
            name="cout",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="opportunite",
            name="prime_seul_do",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="opportunite",
            name="prime_seul_duo",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="opportunite",
            name="prime_seul_trc",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="opportunite",
            name="tarif_do",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="opportunite",
            name="tarif_trc",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="opportunite",
            name="taux_seul",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
