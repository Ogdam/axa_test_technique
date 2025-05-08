from django.contrib import admin

from tarrification.models import Opportunite


# Register your models here.
@admin.register(Opportunite)
class RequestDemoAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Opportunite._meta.get_fields()]
