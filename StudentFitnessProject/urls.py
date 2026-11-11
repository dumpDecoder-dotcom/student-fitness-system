from django.urls import path
from django.contrib import admin
from StudentFitnessApp.views import *
from django.urls import path, include

urlpatterns = [

    path('admin/', admin.site.urls),
    path('', include('StudentFitnessApp.urls')),
    # Account routes
    path('', landing_page, name='landing_page'),
    path('login/', login_page, name='login'),
    path('signup/', signup, name='signup'),
    path('pretest/', pretest_page, name='pretest'),

    # Student routes
    path('student_dashboard/', student_dashboard, name='student_dashboard'),
    path('student_post-test/', student_post_test, name='student_post_test'),

    # Teacher routes
    path('teacher/dashboard/', teacher_dashboard, name='teacher_dashboard'),
    path('teacher/class-analytics/', class_analytics, name='class_analytics'),

    # Logout
    path('logout/', logout_view, name='logout'),
]