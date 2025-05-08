from rest_framework import serializers

from .models import Opportunite


class OpportuniteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunite
        fields = "__all__"
        
    def validate(self, data):
        for field in [
            'cout', 'tarif_trc', 'tarif_do', 'prime_seul_trc', 'prime_seul_do', 'prime_seul_duo',
            'garanties_dommages_ouvrage', 'garanties_responsabilité_civile',
            'garanties_maintenance_visite', 'garanties_mesure_conservatoire',
            'franchises_dommages_ouvrage', 'franchises_assure_maître_ouvrage',
            'franchises_maintenance_visite'
        ]:
            if field in data and data[field] is None:
                data[field] = 0.0 
        return data


class OpportuniteMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunite
        fields = ["id", "nom_client", "numero", "destination", "cout"]
