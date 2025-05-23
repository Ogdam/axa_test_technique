# Generated by Django 4.2.20 on 2025-05-07 08:28

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="opportunite",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("numero", models.CharField(max_length=30)),
                ("nom_client", models.CharField(max_length=30)),
                (
                    "type_de_garantie",
                    models.CharField(
                        choices=[("TRC", "TRC seule"), ("DO", "DO seule")], max_length=3
                    ),
                ),
                (
                    "destination",
                    models.CharField(
                        choices=[("HAB", "Habitation"), ("HHAB", "Hors habitation")],
                        max_length=4,
                    ),
                ),
                (
                    "type_de_travaux",
                    models.CharField(
                        choices=[
                            ("LR", "Rénovation légère"),
                            ("LD", "Rénovation lourde"),
                            ("ON", "Ouvrage neuf"),
                        ],
                        max_length=2,
                    ),
                ),
                ("cout", models.FloatField()),
                ("existant", models.BooleanField()),
                ("vip", models.BooleanField()),
                ("rmco", models.BooleanField()),
                ("taux_seul", models.FloatField()),
            ],
        ),
    ]
