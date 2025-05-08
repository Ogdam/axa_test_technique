from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Opportunite
from .serializers import OpportuniteMinimalSerializer, OpportuniteSerializer
from .utils import docx_export, pdf_export

class OpportuniteViewSet(viewsets.ModelViewSet):
    queryset = Opportunite.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return OpportuniteMinimalSerializer
        return OpportuniteSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serialiser = self.get_serializer_class()
        serializer = serialiser(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        opportunite = get_object_or_404(queryset, pk=pk)
        serialiser = self.get_serializer_class()
        serializer = serialiser(opportunite)
        return Response(serializer.data)

    def create(self, request):
        numero = request.data.get("numero")
        if Opportunite.objects.filter(numero=numero).exists():
            return Response(
                {"error": "Opportunite with this numero already exists."}, status=400
            )
        serializer = self.get_serializer_class()(data=request.data)
        if serializer.is_valid():
            opportunite = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer_class()(instance, data=request.data)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=["get"], url_path="export/(?P<file_format>[^/.]+)")
    def export(self, request, pk=None, file_format=None):
        opportunite = get_object_or_404(self.get_queryset(), pk=pk)
        if file_format == "docx":
            return docx_export(opportunite)
        elif file_format == "pdf":
            return pdf_export(opportunite)
        else:
            return Response({"error": "Unsupported format"}, status=400)
