// Dashboard Chart: Pre-Test vs Post-Test
const ctx = document.getElementById('progressChart').getContext('2d');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['BMI', 'VO₂ Max', 'Flexibility', 'Strength', 'Agility', 'Speed', 'Endurance'],
    datasets: [
      {
        label: 'Pre-Test',
        data: [22.3, 45.8, 60, 50, 80, 70, 75],
        backgroundColor: '#A31D1D', // Dark red
        borderColor: '#6D2323',
        borderWidth: 1
      },
      {
        label: 'Post-Test',
        data: [22.5, 48.2, 65, 60, 85, 75, 80],
        backgroundColor: '#E5D0AC', // Light contrast
        borderColor: '#A31D1D',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#6D2323', font: { weight: '600', size: 14 } }
      },
      tooltip: {
        backgroundColor: '#6D2323',
        titleColor: '#F9F8F6',
        bodyColor: '#F9F8F6',
        titleFont: { weight: '700' }
      }
    },
    scales: {
      x: { ticks: { color: '#6D2323' }, grid: { color: '#F0F0F0' } },
      y: { beginAtZero: true, ticks: { color: '#6D2323' }, grid: { color: '#F0F0F0' } }
    }
  }
});