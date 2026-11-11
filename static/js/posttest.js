// Get the form
const postTestForm = document.getElementById('post-test-form');

// Auto-calc BMI + VO2 Max when weight or height changes
const weightInput = document.getElementById('post-weight');
const heightInput = document.getElementById('post-height');

const bmiField = document.getElementById('post-bmi');
const vo2Field = document.getElementById('post-vo2max');

// Auto BMI Calculation
function calculateBMI() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value) / 100;

    if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        bmiField.value = bmi.toFixed(1);
    }
}

// Simple VO2 Max calculation (replace with your real formula)
function calculateVO2Max() {
    if (bmiField.value) {
        // Sample demo formula — you can change anytime
        const vo2 = 50 - (bmiField.value * 0.2);
        vo2Field.value = vo2.toFixed(1);
    }
}

// Trigger auto-calculations when input changes
weightInput.addEventListener('input', () => {
    calculateBMI();
    calculateVO2Max();
});

heightInput.addEventListener('input', () => {
    calculateBMI();
    calculateVO2Max();
});

// Form submit
postTestForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
        bmi: bmiField.value,
        vo2max: vo2Field.value,
        flexibility: document.getElementById('post-flexibility').value,
        strength: document.getElementById('post-strength').value,
        agility: document.getElementById('post-agility').value,
        speed: document.getElementById('post-speed').value,
        endurance: document.getElementById('post-endurance').value,
        weight: weightInput.value,
        height: heightInput.value
    };

    // Validation
    for (const key in data) {
        if (!data[key]) {
            alert(`Please enter a value for ${key.toUpperCase()}`);
            return;
        }
    }

    console.log("Post-Test Data Saved:", data);
    alert("Post-Test data saved successfully!");
});