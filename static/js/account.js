// ==========================================
// SHARED UTILITY FUNCTIONS
// ==========================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}

// ==========================================
// LOGIN PAGE LOGIC
// ==========================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) emailInput.focus();

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            emailInput.focus();
            return false;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            passwordInput.focus();
            return false;
        }

        submitLogin(email, password);
    });

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    }
}

function submitLogin(email, password) {
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect || '/pretest.html';
        } else {
            showError(data.message || 'accounts failed. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// ==========================================
// SIGNUP PAGE LOGIC
// ==========================================

function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    if (nameInput) nameInput.focus();

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (name.length < 2) {
            showError('Please enter your full name');
            nameInput.focus();
            return false;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            emailInput.focus();
            return false;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            passwordInput.focus();
            return false;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            confirmPasswordInput.focus();
            return false;
        }

        submitSignup(name, email, password);
    });

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                if (this.value === passwordInput.value) {
                    this.classList.add('valid');
                    this.classList.remove('invalid');
                } else {
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                }
            } else {
                this.classList.remove('valid', 'invalid');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = getPasswordStrength(this.value);
            if (this.value.length === 0) {
                this.classList.remove('valid', 'invalid');
            } else if (strength < 2) {
                this.classList.add('invalid');
                this.classList.remove('valid');
            } else {
                this.classList.add('valid');
                this.classList.remove('invalid');
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    }
}

function submitSignup(name, email, password) {
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect || '/pretest.html';
        } else {
            showError(data.message || 'Signup failed. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// ==========================================
// FITNESS PRETEST PAGE LOGIC
// ==========================================

let currentStep = 1;
const totalSteps = 4;

function initPretestPage() {
    // Wait a bit for DOM to be ready
    const pretestForm = document.getElementById('pretestForm');
    if (!pretestForm) {
        console.log('⏳ Waiting for pretest form...');
        setTimeout(initPretestPage, 50);
        return;
    }

    console.log('✅ Pretest form found, initializing...');

    // Update progress bar
    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        const currentStepSpan = document.getElementById('currentStep');

        if (progressFill) progressFill.style.width = progress + '%';
        if (currentStepSpan) currentStepSpan.textContent = currentStep;
    }

    // Show current step
    function showStep(step) {
        console.log('Showing step:', step);

        // Hide all steps
        for (let i = 1; i <= totalSteps; i++) {
            const stepElement = document.getElementById('step' + i);
            if (stepElement) {
                stepElement.style.display = 'none';
            }
        }

        // Show current step
        const currentStepElement = document.getElementById('step' + step);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        // Update buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'block';
        if (nextBtn) nextBtn.style.display = step === totalSteps ? 'none' : 'block';
        if (submitBtn) submitBtn.style.display = step === totalSteps ? 'block' : 'none';

        updateProgress();
    }

    // Auto-calculate BMI
    function calculateBMI() {
        const weight = parseFloat(document.getElementById('weight')?.value);
        const height = parseFloat(document.getElementById('height')?.value);

        if (weight && height && weight > 0 && height > 0) {
            const heightInMeters = height / 100;
            const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            const bmiInput = document.getElementById('bmi');
            const bmiCategory = document.getElementById('bmiCategory');

            if (bmiInput) bmiInput.value = bmi;

            let category = '';
            if (bmi < 18.5) category = 'Category: Underweight';
            else if (bmi < 25) category = 'Category: Normal weight';
            else if (bmi < 30) category = 'Category: Overweight';
            else category = 'Category: Obese';

            if (bmiCategory) bmiCategory.textContent = category;
        }
    }

    // Auto-calculate Maximum Heart Rate
    function calculateMaxHeartRate() {
        const age = parseInt(document.getElementById('age')?.value);
        if (age && age > 0) {
            const maxHR = 220 - age;
            const maxHeartRateInput = document.getElementById('maxHeartRate');
            if (maxHeartRateInput) maxHeartRateInput.value = maxHR;
            console.log('Max Heart Rate calculated:', maxHR);
        }
    }

    // Auto-calculate VO2 Max
    function calculateVO2Max() {
        const maxHR = parseFloat(document.getElementById('maxHeartRate')?.value);
        const restingHR = parseFloat(document.getElementById('restingHeartRate')?.value);

        if (maxHR && restingHR && restingHR > 0) {
            const vo2max = (15.3 * (maxHR / restingHR)).toFixed(2);
            const vo2maxInput = document.getElementById('vo2max');
            const vo2Category = document.getElementById('vo2Category');

            if (vo2maxInput) vo2maxInput.value = vo2max;

            let category = '';
            if (vo2max < 30) category = 'Fitness Level: Poor';
            else if (vo2max < 40) category = 'Fitness Level: Average';
            else if (vo2max < 50) category = 'Fitness Level: Good';
            else category = 'Fitness Level: Excellent';

            if (vo2Category) vo2Category.textContent = category;
        }
    }

    // Event listeners for auto-calculation
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const restingHRInput = document.getElementById('restingHeartRate');

    if (weightInput) weightInput.addEventListener('input', calculateBMI);
    if (heightInput) heightInput.addEventListener('input', calculateBMI);
    if (ageInput) ageInput.addEventListener('input', calculateMaxHeartRate);
    if (restingHRInput) restingHRInput.addEventListener('input', calculateVO2Max);

    // NEXT BUTTON - Using direct onclick assignment
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        console.log('✅ Next button found, attaching handler');

        nextBtn.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();

            console.log('🔥 NEXT BUTTON CLICKED!');
            console.log('Current step:', currentStep);

            // Get current step element
            const stepElement = document.getElementById('step' + currentStep);
            if (!stepElement) {
                console.error('❌ Step element not found!');
                return false;
            }

            // Get all required inputs
            const requiredInputs = stepElement.querySelectorAll('input[required]');
            console.log('Found', requiredInputs.length, 'required inputs');

            // Validate each input
            for (let i = 0; i < requiredInputs.length; i++) {
                const input = requiredInputs[i];
                const value = input.type === 'password' ? input.value : input.value.trim();

                console.log('Checking:', input.name || input.id, '=', value ? '✓' : '✗');

                if (!value || value === '') {
                    const label = input.previousElementSibling;
                    const fieldName = label ? label.textContent : (input.name || input.id);
                    showError('Please fill in: ' + fieldName);
                    input.focus();
                    return false;
                }

                // Check password length
                if (input.type === 'password' && value.length < 6) {
                    showError('Password must be at least 6 characters long');
                    input.focus();
                    return false;
                }

                // Check number inputs
                if (input.type === 'number') {
                    const num = parseFloat(value);
                    if (isNaN(num)) {
                        showError('Please enter a valid number for ' + (input.name || input.id));
                        input.focus();
                        return false;
                    }
                }
            }

            console.log('✅ Validation passed!');

            // Calculate max heart rate when moving from step 1
            if (currentStep === 1) {
                console.log('Calculating max heart rate...');
                calculateMaxHeartRate();
            }

            // Calculate VO2 Max when moving from step 3
            if (currentStep === 3) {
                console.log('Calculating VO2 Max...');
                calculateVO2Max();
            }

            // Move to next step
            currentStep++;
            console.log('Moving to step:', currentStep);
            showStep(currentStep);

            return false;
        };
    } else {
        console.error('❌ Next button NOT FOUND!');
    }

    // PREVIOUS BUTTON - Using direct onclick assignment
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();

            console.log('⬅️ Previous button clicked');
            currentStep--;
            showStep(currentStep);

            return false;
        };
    }

    // FORM SUBMISSION
    pretestForm.onsubmit = function(e) {
        e.preventDefault();
        console.log('📝 Form submitted!');

        // Validate last step
        const stepElement = document.getElementById('step' + currentStep);
        const requiredInputs = stepElement.querySelectorAll('input[required]');

        for (let input of requiredInputs) {
            const value = input.value.trim();
            if (!value) {
                const label = input.previousElementSibling;
                const fieldName = label ? label.textContent : (input.name || input.id);
                showError('Please fill in: ' + fieldName);
                input.focus();
                return false;
            }
        }

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            middleInitial: document.getElementById('middleInitial').value,
            age: document.getElementById('age').value,
            section: document.getElementById('section').value,
            studentNo: document.getElementById('studentNo').value,
            password: document.getElementById('password').value,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            bmi: document.getElementById('bmi').value,
            restingHeartRate: document.getElementById('restingHeartRate').value,
            maxHeartRate: document.getElementById('maxHeartRate').value,
            vo2max: document.getElementById('vo2max').value,
            flexibility: document.getElementById('flexibility').value,
            strength: document.getElementById('strength').value,
            agility: document.getElementById('agility').value,
            speed: document.getElementById('speed').value,
            endurance: document.getElementById('endurance').value
        };

        submitFitnessPretest(formData);
        return false;
    };

    // Submit fitness pretest
    function submitFitnessPretest(formData) {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        console.log('Submitting Pre-Test Data:', formData);

        fetch('/pretest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Pre-test submitted successfully! Redirecting to dashboard...');
                setTimeout(() => {
                    window.location.href = data.redirect || '/dashboard';
                }, 1500);
            } else {
                showError(data.message || 'Submission failed. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('An error occurred. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // Initialize
    const totalStepsElement = document.getElementById('totalSteps');
    if (totalStepsElement) {
        totalStepsElement.textContent = totalSteps;
    }

    showStep(currentStep);
    console.log('✅ Pretest initialized successfully!');
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================

// Use window.onload to ensure everything is loaded
window.onload = function() {
    console.log('🚀 Window loaded - Initializing BulSU Fitness System...');
    console.log('DOM Ready State:', document.readyState);

    // Small delay to ensure everything is ready
    setTimeout(function() {
        initLoginPage();
        initSignupPage();
        initPretestPage();

        console.log('✅ BulSU Fitness System initialized successfully!');
    }, 100);
};