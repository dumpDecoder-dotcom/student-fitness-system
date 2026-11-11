from django.db import models
import hashlib

def simple_hash(password):
    return hashlib.md5(password.encode()).hexdigest()

class Student(models.Model):
    student_no = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    middle_initial = models.CharField(max_length=1, blank=True)
    age = models.IntegerField()
    section = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.student_no} - {self.get_full_name()}"

class Teacher(models.Model):
    employee_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.employee_number} - {self.get_full_name()}"

class FitnessTest(models.Model):
    TEST_TYPES = [
        ('pre', 'Pre-Test'),
        ('post', 'Post-Test'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    test_type = models.CharField(max_length=10, choices=TEST_TYPES)
    height = models.FloatField()
    weight = models.FloatField()
    bmi = models.FloatField()
    vo2_max = models.FloatField()
    flexibility = models.FloatField()
    strength = models.FloatField()
    agility = models.FloatField()
    speed = models.FloatField()
    endurance = models.FloatField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.student_no} - {self.get_test_type_display()} - {self.created_at.date()}"