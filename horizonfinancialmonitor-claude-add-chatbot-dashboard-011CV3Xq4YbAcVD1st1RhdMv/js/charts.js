// ===========================
// CHARTS MODULE
// Chart.js Configuration
// ===========================

// Chart.js default configuration
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#697386';

class ChartsManager {
  constructor() {
    this.charts = {};
  }

  // Create Economic Trend Chart
  createEconomicTrendChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
          ...ds,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: ds.borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              borderRadius: 6,
              usePointStyle: true,
              padding: 20,
              font: { size: 13, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 31, 54, 0.95)',
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 },
            padding: 12,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 6
          }
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Milioni €',
              font: { size: 12, weight: '600' }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return '€' + value.toFixed(1) + 'M';
              }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'EBITDA %',
              font: { size: 12, weight: '600' }
            },
            grid: {
              display: false
            },
            ticks: {
              callback: function(value) {
                return value.toFixed(1) + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { size: 13, weight: '500' }
            }
          }
        }
      }
    });
  }

  // Create Debt Sustainability Chart
  createDebtSustainabilityChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              padding: 20,
              font: { size: 13, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 31, 54, 0.95)',
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return value.toFixed(1) + 'x';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Create Working Capital Chart
  createWorkingCapitalChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
          ...ds,
          borderWidth: 0,
          borderRadius: 6
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              padding: 20,
              font: { size: 13, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 31, 54, 0.95)',
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y + ' giorni';
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return value + ' gg';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Create Stress Test Chart
  createStressTestChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
          ...ds,
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: ds.borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              padding: 20,
              font: { size: 13, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 31, 54, 0.95)',
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8
          },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                yMin: 1.0,
                yMax: 1.0,
                borderColor: '#DF1B41',
                borderWidth: 2,
                borderDash: [10, 5],
                label: {
                  content: 'Soglia minima (1.0x)',
                  enabled: true,
                  position: 'end'
                }
              }
            }
          }
        },
        scales: {
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: function(value) {
                return value.toFixed(2) + 'x';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Destroy all charts
  destroyAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }
}

// Global instance
const chartsManager = new ChartsManager();
