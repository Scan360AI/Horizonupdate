// ===========================
// KITZANOS FINANCIAL REPORT
// Main JavaScript Module
// ===========================

class FinancialReport {
  constructor() {
    this.data = null;
    this.currentPage = this.getCurrentPage();
  }

  // Load JSON data
  async loadData() {
    try {
      const basePath = window.location.pathname.includes('/pages/') ? '../data/' : 'data/';
      const response = await fetch(basePath + 'kitzanos-data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Errore nel caricamento dei dati. Se stai visualizzando il file localmente (file://), usa un server locale o carica su Netlify.');
      return null;
    }
  }

  // Get current page from URL
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
  }

  // Set active navigation link
  setActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = this.currentPage;
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `../index.html` && currentPage === 'index') {
        link.classList.add('active');
      } else if (href.includes(currentPage) && currentPage !== 'index') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Format currency
  formatCurrency(value) {
    if (typeof value === 'string') {
      return value;
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // Format percentage
  formatPercentage(value) {
    return `${value.toFixed(2)}%`;
  }

  // Format number
  formatNumber(value) {
    return new Intl.NumberFormat('it-IT').format(value);
  }

  // Get trend class
  getTrendClass(trend) {
    if (trend > 0) return 'trend-positive';
    if (trend < 0) return 'trend-negative';
    return 'trend-neutral';
  }

  // Get trend icon
  getTrendIcon(direction) {
    switch(direction) {
      case 'up': return '▲';
      case 'down': return '▼';
      default: return '–';
    }
  }

  // Render metric card
  renderMetricCard(metric) {
    const trendHTML = metric.trend ? `
      <div class="metric-trend ${metric.trend.direction}">
        ${this.getTrendIcon(metric.trend.direction)}
        ${Math.abs(metric.trend.value)}${metric.trend.unit || '%'} ${metric.trend.label}
      </div>
    ` : '';

    const badgeHTML = metric.badge ? `
      <span class="badge ${metric.badge.class}">${metric.badge.label}</span>
    ` : '';

    const categoryHTML = metric.category ? `
      <div class="metric-category">
        <span class="badge ${metric.category.class}">${metric.category.label}</span>
      </div>
    ` : '';

    return `
      <div class="metric-card">
        <div class="metric-header">
          <div>
            <div class="metric-label">${metric.title}</div>
            <div class="metric-value">${metric.value}</div>
            ${trendHTML}
            ${badgeHTML}
            ${categoryHTML}
          </div>
          <div class="metric-icon ${metric.colorClass}">
            <i class="${metric.icon}"></i>
          </div>
        </div>
        <div class="metric-benchmark">${metric.benchmark}</div>
      </div>
    `;
  }

  // Initialize
  async init() {
    await this.loadData();
    this.setActiveNav();
    console.log('Financial Report initialized', this.data);
  }
}

// Global instance
const report = new FinancialReport();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  report.init();
});
