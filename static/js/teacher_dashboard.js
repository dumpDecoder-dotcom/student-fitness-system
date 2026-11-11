// ------------------------------
// View Switching Logic
// ------------------------------
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.getAttribute('data-view');
    document.getElementById('studentsView').classList.toggle('d-none', view !== 'students');
    document.getElementById('analyticsView').classList.toggle('d-none', view !== 'analytics');

    // Update title dynamically
    document.getElementById('viewTitle').textContent =
      view === 'students' ? 'Student Management' : 'Class Analytics';

    // Highlight active button
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ------------------------------
// Optional: Simple Chart Example
// ------------------------------
const ctx = document.getElementById('analyticsChart');
if (ctx) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C', 'D', 'E'],
      datasets: [{
        label: 'Average Progress (%)',
        data: [80, 72, 90, 65, 88],
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ------------------------------
// Main Logic
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {

  // --------------------------
  // Student Table Filters
  // --------------------------
  const searchInput = document.getElementById("tableFilter");
  const sectionFilter = document.getElementById("sectionFilter");
  const statusFilter = document.getElementById("statusFilter");
  const rows = document.querySelectorAll("#studentsTable tbody tr");

  if (searchInput && sectionFilter && statusFilter) {
    function applyFilters() {
      const searchValue = searchInput.value.toLowerCase();
      const sectionValue = sectionFilter.value.toLowerCase();
      const statusValue = statusFilter.value.toLowerCase();

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const sectionText = row.querySelector(".tag")?.innerText.toLowerCase() || "";
        const statusText = row.querySelector(".status-badge")?.innerText.toLowerCase() || "";

        const matchesSearch = text.includes(searchValue);
        const matchesSection = sectionValue === "" || sectionText === sectionValue;
        const matchesStatus = statusValue === "" || statusText === statusValue;

        row.style.display = (matchesSearch && matchesSection && matchesStatus) ? "" : "none";
      });
    }

    searchInput.addEventListener("keyup", applyFilters);
    sectionFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
  }

  // --------------------------
  // Modal View for Students
  // --------------------------
  const viewButtons = document.querySelectorAll(".view-btn");
  const modalEl = document.getElementById("studentModal");

  if (viewButtons.length && modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    let chartInstance = null;

    viewButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        console.log("View clicked!"); // debug test

        const row = btn.closest("tr");
        const student = JSON.parse(row.getAttribute("data-student"));

        // Fill modal fields
        document.getElementById("studentName").textContent = student.name;
        document.getElementById("studentSection").textContent = student.section;
        document.getElementById("studentAge").textContent = student.age;
        document.getElementById("studentEmail").textContent = student.email;
        document.getElementById("studentBmi").textContent = student.bmi;
        document.getElementById("studentAgility").textContent = student.agility;

        // Fill data table
        const dataBody = document.getElementById("dataTableBody");
        const metrics = ["Metric 1", "Metric 2", "Metric 3"];
        dataBody.innerHTML = metrics.map((m, i) => `
          <tr>
            <td>${m}</td>
            <td>${student.pre[i]}</td>
            <td>${student.post[i]}</td>
          </tr>
        `).join("");

        // Draw performance chart
        const ctx = document.getElementById("performanceChart");
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: metrics,
            datasets: [
              {
                label: "Pre-Test",
                data: student.pre,
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
                tension: 0.3
              },
              {
                label: "Post-Test",
                data: student.post,
                borderColor: "rgba(54, 162, 235, 1)",
                fill: false,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: "bottom" } },
            scales: { y: { beginAtZero: true } }
          }
        });

        // Show modal
        modal.show();
      });
    });
  }
});