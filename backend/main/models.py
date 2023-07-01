from django.contrib.auth.models import User
from django.db import models


class Site(models.Model):
    baseURL = models.CharField(max_length=255)
    note = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=False, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.baseURL} : {self.status} with note {self.note}"


class Test(models.Model):
    name = models.CharField(max_length=255)
    doneAt = models.DateTimeField(blank=True, null=True)
    status = models.CharField(default="pending", blank=True,max_length=40)
    endpoints = models.JSONField(default=[])
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Test : {self.name} has created at {self.createdAt} and done at {self.doneAt}"
