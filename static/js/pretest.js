// Pre-test Form Multi-step Navigation
let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepElement = document.getElementById('currentStep');
    const progressPercentage = (currentStep / totalSteps) * 100;

    progressFill.style.width = `${progressPercentage}%`;
    currentStepElement.textContent = currentStep;

    // Update step dots
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (i <= currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    }
}

function showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`step${i}`).style.display = 'none';
    }

    // Show current step
    document.getElementById(`step${stepNumber}`).style.display = 'block';

    // Update navigation buttons
    document.getElementById('prevBtn').style.display = stepNumber === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = stepNumber === totalSteps ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = stepNumber === totalSteps ? 'block' : 'none';
}

function validateStep(stepNumber) {
    let isValid = true;

    switch(stepNumber) {
        case 1:
            const weight = document.getElementById('weight').value;
            const height = document.getElementById('height').value;
            if (!weight || !height || weight <= 0 || height <= 0) {
                showAlert('Please enter valid weight and height values.', 'danger');
                isValid = false;
            }
            break;

        case 2:
            const age = document.getElementById('age').value;
            const restingHeartRate = document.getElementById('restingHeartRate').value;
            if (!age || !restingHeartRate || age <= 0 || restingHeartRate <= 0) {
                showAlert('Please enter valid age and resting heart rate values.', 'danger');
                isValid = false;
            }
            break;

        case 3:
            const flexibility = document.getElementById('flexibility').value;
            const strength = document.getElementById('strength').value;
            const agility = document.getElementById('agility').value;
            const speed = document.getElementById('speed').value;
            const endurance = document.getElementById('endurance').value;

            if (!flexibility || !strength || !agility || !speed || !endurance) {
                showAlert('Please complete all fitness component fields.', 'danger');
                isValid = false;
            }
            break;
    }

    return isValid;
}

function nextStep() {
    if (validateStep(currentStep)) {
        currentStep++;
        updateProgress();
        showStep(currentStep);
    }
}

function prevStep() {
    currentStep--;
    updateProgress();
    showStep(currentStep);
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (weight && height && height > 0) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        document.getElementById('bmi').value = bmi.toFixed(1);

        // BMI Category
        const bmiCategory = document.getElementById('bmiCategory');
        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = 'text-warning';
        } else if (bmi < 25) {
            category = 'Normal weight';
            color = 'text-success';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = 'text-warning';
        } else {
            category = 'Obese';
            color = 'text-danger';
        }

        bmiCategory.innerHTML = `<span class="${color}"><i class="fas fa-info-circle me-1"></i>${category}</span>`;
    }
}

// VO2 Max Calculator
function calculateVO2Max() {
    const age = parseInt(document.getElementById('age').value);
    const restingHeartRate = parseInt(document.getElementById('restingHeartRate').value);

    if (age && restingHeartRate) {
        // Calculate Max Heart Rate
        const maxHeartRate = 220 - age;
        document.getElementById('maxHeartRate').value = maxHeartRate;

        // Calculate VO2 Max using a simplified formula
        const vo2max = 15.3 * (maxHeartRate / restingHeartRate);
        document.getElementById('vo2max').value = vo2max.toFixed(1);

        // VO2 Max Category
        const vo2Category = document.getElementById('vo2Category');
        let category = '';
        let color = '';

        if (vo2max < 30) {
            category = 'Poor';
            color = 'text-danger';
        } else if (vo2max < 40) {
            category = 'Fair';
            color = 'text-warning';
        } else if (vo2max < 50) {
            category = 'Good';
            color = 'text-info';
        } else {
            category = 'Excellent';
            color = 'text-success';
        }

        vo2Category.innerHTML = `<span class="${color}"><i class="fas fa-info-circle me-1"></i>${category}</span>`;
    }
}

// Alert System
function showAlert(message, type = 'info') {
    const alertDiv = document.getElementById('customAlert');
    const icons = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };

    alertDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas ${icons[type]} me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv.querySelector('.alert'));
        bsAlert.close();
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress
    updateProgress();
    showStep(1);

    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', prevStep);

    // BMI calculation
    document.getElementById('weight').addEventListener('input', calculateBMI);
    document.getElementById('height').addEventListener('input', calculateBMI);

    // VO2 Max calculation
    document.getElementById('age').addEventListener('input', calculateVO2Max);
    document.getElementById('restingHeartRate').addEventListener('input', calculateVO2Max);

    // Form submission
    document.getElementById('pretestForm').addEventListener('submit', function(e) {
        if (!validateStep(3)) {
            e.preventDefault();
            showAlert('Please complete all required fields.', 'danger');
        } else {
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
            submitBtn.disabled = true;
        }
    });

    // Skip pre-test
    document.getElementById('skipPretest').addEventListener('click', function(e) {
        if (!confirm('Are you sure you want to skip the pre-test? You can complete it later from your dashboard.')) {
            e.preventDefault();
        }
    });
});