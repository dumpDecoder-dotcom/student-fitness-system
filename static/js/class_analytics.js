// ✅ Simulated data (same as Teacher Dashboard)
const students = [
  { name: "Alex Rodriguez", section: "Section B", status: "Pre-Test Only", improvement: 0 },
  { name: "Amanda Wilson", section: "Section B", status: "Pre-Test Only", improvement: 0 },
  { name: "David Kim", section: "Section C", status: "Complete", improvement: 16 },
  { name: "Emily Davis", section: "Section A", status: "Complete", improvement: 14 },
  { name: "Jessica Lee", section: "Section C", status: "Complete", improvement: 17 },
  { name: "John Smith", section: "Section A", status: "Complete", improvement: 16 },
  { name: "Mike Chen", section: "Section B", status: "Pre-Test Only", improvement: 0 },
  { name: "Sarah Johnson", section: "Section A", status: "Complete", improvement: 18 },
];

// Initialize charts
const sectionCtx = document.getElementById("sectionPerformanceChart");
const bmiCtx = document.getElementById("bmiDistributionChart");

const sectionChart = new Chart(sectionCtx, {
  type: "bar",
  data: {
    labels: ["Section A", "Section B", "Section C"],
    datasets: [{
      label: "Improvement %",
      data: [15, 0, 16],
      backgroundColor: "#2DC5B9",
      borderRadius: 8,
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 5 } } }
  }
});

const bmiChart = new Chart(bmiCtx, {
  type: "pie",
  data: {
    labels: ["Normal: 7", "Overweight: 1"],
    datasets: [{
      data: [7, 1],
      backgroundColor: ["#F9B234", "#2DC5B9"]
    }]
  },
  options: { plugins: { legend: { position: "bottom" } } }
});

// ✅ Filter logic
const sectionSelect = document.getElementById("sectionSelect");
sectionSelect.addEventListener("change", function () {
  const selected = this.value;
  const filtered = selected === "All"
    ? students
    : students.filter(s => s.section === selected);

  const total = filtered.length;
  const complete = filtered.filter(s => s.status === "Complete").length;
  const pretest = filtered.filter(s => s.status === "Pre-Test Only").length;
  const avgImprove = filtered.reduce((a, b) => a + b.improvement, 0) / (total || 1);

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("avgImprovement").textContent = `+${avgImprove.toFixed(1)}%`;
  document.getElementById("completionRate").textContent = `${((complete / total) * 100 || 0).toFixed(1)}%`;
  document.getElementById("completionSummary").textContent = `${complete} of ${total} complete`;
  document.getElementById("completeCount").textContent = complete;
  document.getElementById("pretestCount").textContent = pretest;
  document.getElementById("noDataCount").textContent = total - (complete + pretest);

  // Update chart
  if (selected === "All") {
    sectionChart.data.datasets[0].data = [15, 0, 16];
  } else {
    const sectionAvg = filtered.reduce((a, b) => a + b.improvement, 0) / (filtered.length || 1);
    sectionChart.data.datasets[0].data = [0, 0, 0];
    const sectionIndex = ["Section A", "Section B", "Section C"].indexOf(selected);
    sectionChart.data.datasets[0].data[sectionIndex] = sectionAvg;
  }
  sectionChart.update();
});