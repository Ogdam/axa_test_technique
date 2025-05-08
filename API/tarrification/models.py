import uuid

from django.db import models

DESTINATION = [
    ("HAB", "Habitation"),
    ("HHAB", "Hors habitation"),
]

TRAVAUX = [
    ("LR", "Rénovation légère"),
    ("LD", "Rénovation lourde"),
    ("ON", "Ouvrage neuf"),
]

GARANTIE = [
    ("TRC", "TRC seule"),
    ("DO", "DO seule"),
    ("TRCDO", "TRC + DO"),
]


class Opportunite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero = models.CharField(max_length=30)
    nom_client = models.CharField(max_length=30)
    type_de_garantie = models.CharField(
        max_length=5,
        choices=GARANTIE,
    )
    destination = models.CharField(
        max_length=4,
        choices=DESTINATION,
    )
    type_de_travaux = models.CharField(
        max_length=2,
        choices=TRAVAUX,
    )
    cout = models.FloatField( blank=True, null=True)
    existant = models.BooleanField(default=False)
    vip = models.BooleanField(default=False)
    rmco = models.BooleanField(default=False)
    taux_trc = models.FloatField( blank=True, null=True)
    taux_do = models.FloatField( blank=True, null=True)
    prime_seul_do = models.FloatField( blank=True, null=True)
    prime_seul_trc = models.FloatField( blank=True, null=True)
    prime_seul_duo = models.FloatField( blank=True, null=True)

    # extented fields
    descriptions = models.TextField(blank=True, null=True)
    adresse_chantier = models.CharField(max_length=100, blank=True, null=True)
    garanties_dommages_ouvrage = models.FloatField(blank=True, null=True)
    garanties_responsabilité_civile = models.FloatField( 
        blank=True, null=True
    )
    garanties_maintenance_visite = models.FloatField( 
        blank=True, null=True
    )
    garanties_mesure_conservatoire = models.FloatField( 
        blank=True, null=True
    )
    franchises_dommages_ouvrage = models.FloatField( 
       blank=True, null=True
    )
    franchises_assure_maître_ouvrage = models.FloatField( 
        blank=True, null=True
    )
    franchises_maintenance_visite = models.FloatField( 
        blank=True, null=True
    )
