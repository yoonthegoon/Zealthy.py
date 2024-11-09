from django.db import models


class OnboardingUser(models.Model):
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    birth_date = models.DateField(null=True, blank=True)
    street_address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    zip_code = models.CharField(max_length=255, null=True, blank=True)
    about_me = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.email

    def save(self, *args, **kwargs):
        self.user.email = self.user.username
        self.user.save()
        self.email = self.user.email
        super().save(*args, **kwargs)


class Page(models.Model):
    number = models.IntegerField(primary_key=True)
    components = models.JSONField()

    def __str__(self):
        return f"Page {self.number}"
