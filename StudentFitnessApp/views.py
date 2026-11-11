from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Student, Teacher, FitnessTest
import hashlib
import re


def simple_hash(password):
    return hashlib.md5(password.encode()).hexdigest()


def landing_page(request):
    return render(request, 'landing_page.html')


def login_page(request):
    if request.method == 'POST':
        student_no = request.POST.get('student_no')
        password = request.POST.get('password')

        # Check student
        try:
            student = Student.objects.get(student_no=student_no, password=simple_hash(password))
            request.session['user_id'] = student.student_no
            request.session['user_role'] = 'student'
            request.session['user_name'] = student.get_full_name()
            messages.success(request, f"Welcome back, {student.first_name}!")

            # Check if student has already completed pre-test
            has_pretest = FitnessTest.objects.filter(student=student, test_type='pre').exists()

            if has_pretest:
                return redirect('student_dashboard')
            else:
                return redirect('pretest')

        except Student.DoesNotExist:
            pass

        # Check teacher
        try:
            teacher = Teacher.objects.get(email=student_no, password=simple_hash(password))
            request.session['user_id'] = teacher.employee_number
            request.session['user_role'] = 'teacher'
            request.session['user_name'] = teacher.get_full_name()
            messages.success(request, f"Welcome back, {teacher.first_name}!")
            return redirect('teacher_dashboard')
        except Teacher.DoesNotExist:
            pass

        messages.error(request, "Invalid ID number or password")

    return render(request, 'login.html')

def signup(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        middle_initial = request.POST.get('middle_initial', '')
        last_name = request.POST.get('last_name')
        age = request.POST.get('age')
        section = request.POST.get('section')
        email = request.POST.get('email')
        student_no = request.POST.get('student_no')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # Validation
        errors = []

        if not all([first_name, last_name, age, section, email, student_no, password, confirm_password]):
            errors.append("All required fields must be filled.")

        if password != confirm_password:
            errors.append("Passwords do not match.")

        if len(password) < 8:
            errors.append("Password must be at least 8 characters long.")

        if not re.search(r'[^a-zA-Z0-9]', password):
            errors.append("Password must contain at least one special character.")

        if Student.objects.filter(email=email).exists():
            errors.append("Email already exists.")

        if Student.objects.filter(student_no=student_no).exists():
            errors.append("Student number already exists.")

        if errors:
            for error in errors:
                messages.error(request, error)
            return render(request, 'signup.html', {
                'first_name': first_name,
                'middle_initial': middle_initial,
                'last_name': last_name,
                'age': age,
                'section': section,
                'email': email,
                'student_no': student_no,
            })

        try:
            # Create student with separate name fields
            student = Student.objects.create(
                student_no=student_no,
                first_name=first_name,
                last_name=last_name,
                middle_initial=middle_initial.upper() if middle_initial else '',
                age=age,
                section=section,
                email=email,
                password=simple_hash(password)
            )

            messages.success(request, "Account created successfully! Please log in to continue.")
            return redirect('login')

        except Exception as e:
            messages.error(request, f"Error creating account: {str(e)}")
            return render(request, 'signup.html', {
                'first_name': first_name,
                'middle_initial': middle_initial,
                'last_name': last_name,
                'age': age,
                'section': section,
                'email': email,
                'student_no': student_no,
            })

    return render(request, 'signup.html')


def student_dashboard(request):
    if 'user_id' not in request.session or request.session['user_role'] != 'student':
        return redirect('login')

    student = Student.objects.get(student_no=request.session['user_id'])
    tests = FitnessTest.objects.filter(student=student)
    pre_test = tests.filter(test_type='pre').first()
    post_test = tests.filter(test_type='post').first()

    context = {
        'student': student,
        'tests': tests,
        'pre_test': pre_test,
        'post_test': post_test,
    }
    return render(request, 'student_dashboard.html', context)


def pretest_page(request):
    if 'user_id' not in request.session or request.session['user_role'] != 'student':
        return redirect('login')

    student = Student.objects.get(student_no=request.session['user_id'])

    # Check if pre-test already exists
    existing_pretest = FitnessTest.objects.filter(student=student, test_type='pre').first()
    if existing_pretest:
        messages.info(request, "You have already completed your pre-test.")
        return redirect('student_dashboard')

    if request.method == 'POST':
        try:
            # Server-side validation
            errors = []

            weight = float(request.POST.get('weight', 0))
            height = float(request.POST.get('height', 0))
            age = int(request.POST.get('age', 0))
            resting_hr = int(request.POST.get('restingHeartRate', 0))
            flexibility = float(request.POST.get('flexibility', 0))
            strength = int(request.POST.get('strength', 0))
            agility = float(request.POST.get('agility', 0))
            speed = float(request.POST.get('speed', 0))
            endurance = float(request.POST.get('endurance', 0))

            # Validation rules
            if weight < 20 or weight > 300:
                errors.append("Weight must be between 20-300 kg")
            if height < 100 or height > 250:
                errors.append("Height must be between 100-250 cm")
            if age < 13 or age > 100:
                errors.append("Age must be between 13-100")
            if resting_hr < 30 or resting_hr > 200:
                errors.append("Resting heart rate must be between 30-200 bpm")
            if flexibility < 0 or flexibility > 100:
                errors.append("Flexibility must be between 0-100 cm")
            if strength < 0 or strength > 100:
                errors.append("Strength must be between 0-100 reps")
            if agility < 5 or agility > 30:
                errors.append("Agility must be between 5-30 seconds")
            if speed < 4 or speed > 20:
                errors.append("Speed must be between 4-20 seconds")
            if endurance < 1 or endurance > 60:
                errors.append("Endurance must be between 1-60 minutes")

            if errors:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'pretest.html', {
                    'student': student,
                })

            # Create pre-test
            FitnessTest.objects.create(
                student=student,
                test_type='pre',
                height=height,
                weight=weight,
                bmi=float(request.POST.get('bmi')),
                vo2_max=float(request.POST.get('vo2max')),
                flexibility=flexibility,
                strength=strength,
                agility=agility,
                speed=speed,
                endurance=endurance,
                remarks=f"Age: {age}, Resting HR: {resting_hr}"
            )

            messages.success(request, "Pre-test completed successfully!")
            return redirect('student_dashboard')  # This should redirect to student_dashboard

        except Exception as e:
            messages.error(request, f"Error saving pre-test: {str(e)}")
            return render(request, 'pretest.html', {
                'student': student,
            })

    return render(request, 'pretest.html', {'student': student})
def student_post_test(request):
    if 'user_id' not in request.session or request.session['user_role'] != 'student':
        return redirect('login')

    student = Student.objects.get(student_no=request.session['user_id'])
    pre_test = FitnessTest.objects.filter(student=student, test_type='pre').first()

    if not pre_test:
        messages.error(request, "You must complete the pre-test before taking the post-test.")
        return redirect('pretest')

    if request.method == 'POST':
        try:
            # Server-side validation (same as pre-test)
            errors = []

            weight = float(request.POST.get('weight', 0))
            height = float(request.POST.get('height', 0))
            age = int(request.POST.get('age', 0))
            resting_hr = int(request.POST.get('restingHeartRate', 0))
            flexibility = float(request.POST.get('flexibility', 0))
            strength = int(request.POST.get('strength', 0))
            agility = float(request.POST.get('agility', 0))
            speed = float(request.POST.get('speed', 0))
            endurance = float(request.POST.get('endurance', 0))

            # Validation rules
            if weight < 20 or weight > 300:
                errors.append("Weight must be between 20-300 kg")
            if height < 100 or height > 250:
                errors.append("Height must be between 100-250 cm")
            if age < 13 or age > 100:
                errors.append("Age must be between 13-100")
            if resting_hr < 30 or resting_hr > 200:
                errors.append("Resting heart rate must be between 30-200 bpm")
            if flexibility < 0 or flexibility > 100:
                errors.append("Flexibility must be between 0-100 cm")
            if strength < 0 or strength > 100:
                errors.append("Strength must be between 0-100 reps")
            if agility < 5 or agility > 30:
                errors.append("Agility must be between 5-30 seconds")
            if speed < 4 or speed > 20:
                errors.append("Speed must be between 4-20 seconds")
            if endurance < 1 or endurance > 60:
                errors.append("Endurance must be between 1-60 minutes")

            if errors:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'post_test.html', {
                    'student': student,
                    'pre_test': pre_test,
                })

            # Check if post-test already exists
            existing_post_test = FitnessTest.objects.filter(student=student, test_type='post').first()

            if existing_post_test:
                # Update existing post-test
                existing_post_test.height = height
                existing_post_test.weight = weight
                existing_post_test.bmi = float(request.POST.get('bmi'))
                existing_post_test.vo2_max = float(request.POST.get('vo2max'))
                existing_post_test.flexibility = flexibility
                existing_post_test.strength = strength
                existing_post_test.agility = agility
                existing_post_test.speed = speed
                existing_post_test.endurance = endurance
                existing_post_test.remarks = f"Post-test updated. Age: {age}, Resting HR: {resting_hr}"
                existing_post_test.save()
                messages.success(request, "Post-test updated successfully!")
            else:
                # Create new post-test
                FitnessTest.objects.create(
                    student=student,
                    test_type='post',
                    height=height,
                    weight=weight,
                    bmi=float(request.POST.get('bmi')),
                    vo2_max=float(request.POST.get('vo2max')),
                    flexibility=flexibility,
                    strength=strength,
                    agility=agility,
                    speed=speed,
                    endurance=endurance,
                    remarks=f"Post-test completed. Age: {age}, Resting HR: {resting_hr}"
                )
                messages.success(request, "Post-test completed successfully!")

            return redirect('student_dashboard')

        except Exception as e:
            messages.error(request, f"Error saving post-test: {str(e)}")
            return render(request, 'post_test.html', {
                'student': student,
                'pre_test': pre_test,
            })

    context = {
        'student': student,
        'pre_test': pre_test
    }
    return render(request, 'post_test.html', context)


def teacher_dashboard(request):
    if 'user_id' not in request.session or request.session['user_role'] != 'teacher':
        return redirect('login')
    return render(request, 'teacher_dashboard.html')


def class_analytics(request):
    if 'user_id' not in request.session or request.session['user_role'] != 'teacher':
        return redirect('login')
    return render(request, 'class_analytics.html')


def logout_view(request):
    request.session.flush()
    messages.success(request, "You have been logged out successfully.")
    return redirect('landing_page')