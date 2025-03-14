from django.db import models

class Weight(models.Model):
    from_room = models.CharField(max_length=12)
    to_room = models.CharField(max_length=12)
    weight = models.FloatField()

    def __str__(self):
        return f"{self.from_room} to {self.to_room}: {self.weight}"

