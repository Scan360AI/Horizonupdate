// ===========================
// PDF GENERATOR MODULE
// Using html2pdf.js for elegant PDF generation with CSS styling
// ===========================

class PDFGenerator {
  constructor(financialData) {
    this.data = financialData;
    this.logoBase64 = null;
  }

  // Load logo as base64
  async loadLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this.logoBase64 = canvas.toDataURL('image/png');
        resolve();
      };
      img.onerror = () => {
        console.warn('Could not load logo');
        resolve();
      };
      img.src = 'assets/images/logo.png';
    });
  }

  // Main method: Generate professional report with html2pdf
  async generateProfessionalReport(aiContent, chartImages = null) {
    try {
      console.log('📄 Generating professional report with html2pdf...');
      await this.loadLogo();

      const sections = this.parseSections(aiContent);
      const htmlContent = this.buildReportHTML(sections, chartImages);

      // Create temporary container
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = 'position: absolute; left: -9999px; top: 0;';
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      const companyNameSlug = this.data.company.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const filename = 'report-' + companyNameSlug + '-' + this.getCurrentDate() + '.pdf';

      // Configure html2pdf with better settings
      const opt = {
        margin: [20, 15, 20, 15],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.no-page-break'
        }
      };

      await html2pdf().set(opt).from(tempDiv.firstChild).save();

      document.body.removeChild(tempDiv);

      console.log('✅ Professional report generated successfully');
    } catch (error) {
      console.error('❌ Error generating professional report:', error);
      throw error;
    }
  }

  // Parse AI content into sections
  parseSections(aiContent) {
    const sections = [];
    const lines = aiContent.split('\n');
    let currentSection = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: []
        };
      } else if (currentSection && line.trim()) {
        currentSection.content.push(line);
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  // Build complete HTML for report
  buildReportHTML(sections, chartImages) {
    const currentDate = this.getFormattedDate();

    return '<html><head>' +
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">' +
      '<style>' + this.getStylesheet() + '</style>' +
      '</head><body>' +
      '<div class="report-container">' +
      this.generateCoverPage(currentDate) +
      this.generateContentPages(sections, chartImages) +
      '</div>' +
      '</body></html>';
  }

  // Get complete stylesheet
  getStylesheet() {
    return `
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #1A1F36;
        font-size: 10pt;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .report-container { background: white; }
      .page-break-after { page-break-after: always; }
      .page-break-before { page-break-before: always; }
      .no-page-break { page-break-inside: avoid; }

      /* Section Headers */
      .section-page {
        padding: 2rem 2.5rem;
        position: relative;
      }
      .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 3px solid #635BFF;
      }
      .section-number {
        width: 45px;
        height: 45px;
        background: linear-gradient(135deg, #635BFF 0%, #7C73E6 100%);
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18pt;
        font-weight: 700;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(99, 91, 255, 0.25);
      }
      .section-title {
        font-size: 20pt;
        font-weight: 700;
        color: #1A1F36;
        margin: 0;
        letter-spacing: -0.02em;
      }

      /* Page Header */
      .page-header {
        position: relative;
        padding: 0.75rem 2.5rem;
        background: linear-gradient(135deg, #F8F9FC 0%, #FFFFFF 100%);
        border-bottom: 2px solid #E3E8EE;
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .page-header-left {
        font-size: 9pt;
        color: #697386;
        font-weight: 500;
      }
      .page-header-right {
        font-size: 8pt;
        color: #9AA5B8;
      }

      /* Chart Container */
      .chart-container {
        background: white;
        border: 1px solid #E3E8EE;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem 0;
        box-shadow: 0 2px 8px rgba(50, 50, 93, 0.08);
        page-break-inside: avoid;
      }
      .chart-title {
        font-size: 11pt;
        font-weight: 600;
        color: #4F566B;
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #E3E8EE;
      }
      .chart-image {
        width: 100%;
        height: auto;
        display: block;
        margin-top: 1rem;
      }

      /* Tables */
      .table-wrapper {
        margin: 2rem 0;
        page-break-inside: avoid;
      }
      .table-title {
        font-size: 13pt;
        font-weight: 700;
        color: #1A1F36;
        margin: 0 0 1rem 0;
        letter-spacing: -0.01em;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        box-shadow: 0 1px 3px rgba(50, 50, 93, 0.08);
        border-radius: 8px;
        overflow: hidden;
        font-size: 9.5pt;
      }
      thead tr { background: #635BFF; color: white; }
      thead th {
        padding: 0.9rem 1rem;
        text-align: left;
        font-weight: 600;
        font-size: 10pt;
        letter-spacing: 0.02em;
      }
      tbody td {
        padding: 0.7rem 1rem;
        border-bottom: 1px solid #F1F3F5;
      }
      tbody tr:nth-child(even) { background: #FAFBFC; }
      tbody tr:hover { background: #F8F9FC; }
      .table-highlight {
        background: rgba(99, 91, 255, 0.08) !important;
        font-weight: 600;
      }
      .align-right { text-align: right; }
      .align-center { text-align: center; }

      /* Risk Profile Progress Bars */
      .risk-profiles {
        margin: 2rem 0;
        page-break-inside: avoid;
      }
      .risk-profile-item {
        margin-bottom: 1.5rem;
      }
      .risk-profile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .risk-profile-name {
        font-size: 10pt;
        font-weight: 600;
        color: #1A1F36;
      }
      .risk-profile-score {
        font-size: 11pt;
        font-weight: 700;
        color: #635BFF;
      }
      .risk-profile-bar-container {
        width: 100%;
        height: 24px;
        background: #F1F3F5;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .risk-profile-bar {
        height: 100%;
        border-radius: 12px;
        transition: width 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 0.75rem;
        font-size: 8pt;
        font-weight: 700;
        color: white;
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
      }
      .risk-bar-green { background: linear-gradient(90deg, #00D924 0%, #00F030 100%); }
      .risk-bar-light-green { background: linear-gradient(90deg, #5DD39E 0%, #7FE3B5 100%); }
      .risk-bar-yellow { background: linear-gradient(90deg, #FFB020 0%, #FFC04D 100%); }
      .risk-bar-orange { background: linear-gradient(90deg, #FF8C42 0%, #FFA666 100%); }
      .risk-bar-red { background: linear-gradient(90deg, #DF1B41 0%, #F04268 100%); }
    `;
  }

  // Generate elegant cover page
  generateCoverPage(currentDate) {
    const company = this.data.company.name;
    const rating = this.data.riskAssessment.rating;
    const categoryLabel = this.data.riskAssessment.categoryLabel;

    let html = '<div class="page-break-after" style="height: 280mm; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 3rem; background: linear-gradient(135deg, #FAFBFC 0%, #FFFFFF 100%);">';

    if (this.logoBase64) {
      html += '<img src="' + this.logoBase64 + '" alt="Logo" style="width: 140px; height: auto; margin-bottom: 4rem; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08));">';
    }

    html += '<h1 style="font-size: 42pt; font-weight: 800; color: #1A1F36; margin: 0 0 1rem 0; line-height: 1.1; letter-spacing: -0.03em;">' +
      'REPORT FINANZIARIO<br>COMPLETO' +
      '</h1>';

    html += '<div style="font-size: 22pt; font-weight: 600; color: #4F566B; margin-bottom: 0.75rem; letter-spacing: -0.01em;">' +
      company +
      '</div>';

    html += '<div style="font-size: 13pt; color: #697386; margin-bottom: 4rem; font-weight: 500;">' +
      currentDate +
      '</div>';

    html += '<div style="border: 4px solid #635BFF; border-radius: 20px; padding: 3rem 4rem; margin: 2rem auto; background: white; box-shadow: 0 8px 24px rgba(99, 91, 255, 0.2); max-width: 380px;">' +
      '<div style="font-size: 11pt; color: #697386; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; font-weight: 600;">' +
      'Rating Aziendale' +
      '</div>' +
      '<div style="font-size: 56pt; font-weight: 800; color: #635BFF; margin: 1rem 0; line-height: 1; letter-spacing: -0.02em;">' +
      rating +
      '</div>' +
      '<div style="font-size: 14pt; color: #4F566B; font-weight: 600; letter-spacing: -0.01em;">' +
      categoryLabel +
      '</div>' +
      '</div>';

    html += '</div>';
    return html;
  }

  // Generate content pages
  generateContentPages(sections, chartImages) {
    let html = '';
    let sectionNumber = 1;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.title;
      const sectionLower = sectionTitle.toLowerCase();

      // Page header
      html += '<div class="page-header no-page-break">' +
        '<div class="page-header-left">Report Finanziario Completo • ' + this.data.company.name + '</div>' +
        '<div class="page-header-right">' + this.getFormattedDate() + '</div>' +
        '</div>';

      html += '<div class="section-page ' + (i > 0 ? 'page-break-before' : '') + '">';

      // Section header with number
      html += '<div class="section-header no-page-break">' +
        '<div class="section-number">' + sectionNumber + '</div>' +
        '<h2 class="section-title">' + sectionTitle + '</h2>' +
        '</div>';

      // Add special content based on section
      if (sectionLower.includes('executive summary')) {
        html += this.generateKeyMetricsBoxes();
        html += this.generateSummaryCards();
      }

      if (sectionLower.includes('analisi economica') || sectionLower.includes('conto economico')) {
        html += this.generateContoEconomicoTable();
        if (chartImages && chartImages.economicTrend) {
          html += this.wrapChartInContainer(chartImages.economicTrend, 'Trend Economico 2022-2024');
        }
      }

      if (sectionLower.includes('stato patrimoniale')) {
        html += this.generateStatoPatrimonialeTable();
        if (chartImages && chartImages.workingCapital) {
          html += this.wrapChartInContainer(chartImages.workingCapital, 'Gestione Capitale Circolante');
        }
      }

      if (sectionLower.includes('indicatori finanziari')) {
        if (chartImages && chartImages.debtSustainability) {
          html += this.wrapChartInContainer(chartImages.debtSustainability, 'Sostenibilità del Debito');
        }
        if (chartImages && chartImages.stressTest) {
          html += this.wrapChartInContainer(chartImages.stressTest, 'Analisi Stress Test');
        }
      }

      if (sectionLower.includes('risk assessment') || sectionLower.includes('rischio')) {
        html += this.generateRiskBox();
        html += this.generateRiskProfilesBars();
        if (chartImages && chartImages.benchmarkRadar) {
          html += this.wrapChartInContainer(chartImages.benchmarkRadar, 'Benchmark Settoriale');
        }
      }

      if (sectionLower.includes('codice della crisi')) {
        html += this.generateCodiceCrisiIndicators();
      }

      // Add AI-generated content
      const content = section.content.join('\n');
      html += this.markdownToHTML(content);

      html += '</div>';
      sectionNumber++;
    }

    return html;
  }

  // Wrap chart in styled container
  wrapChartInContainer(chartBase64, title) {
    return '<div class="chart-container no-page-break">' +
      '<div class="chart-title">' + title + '</div>' +
      '<img src="' + chartBase64 + '" class="chart-image" alt="' + title + '">' +
      '</div>';
  }

  // Generate key metrics boxes (4-column grid)
  generateKeyMetricsBoxes() {
    if (!this.data.keyMetrics) return '';

    const metrics = this.data.keyMetrics.slice(0, 4);
    let html = '<div class="no-page-break" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin: 2rem 0;">';

    metrics.forEach(m => {
      const trendColor = m.trend > 0 ? '#00D924' : m.trend < 0 ? '#DF1B41' : '#697386';
      const trendSymbol = m.trend > 0 ? '↑' : m.trend < 0 ? '↓' : '→';

      html += '<div style="background: white; border: 1px solid #E3E8EE; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(50, 50, 93, 0.08);">' +
        '<div style="font-size: 8.5pt; color: #697386; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 0.75rem; font-weight: 600;">' +
        m.label +
        '</div>' +
        '<div style="font-size: 20pt; font-weight: 700; color: #1A1F36; margin-bottom: 0.5rem; letter-spacing: -0.02em;">' +
        m.value +
        '</div>';

      if (m.trend !== undefined) {
        html += '<div style="font-size: 10pt; font-weight: 700; color: ' + trendColor + ';">' +
          trendSymbol + ' ' + Math.abs(m.trend).toFixed(1) + '%' +
          '</div>';
      }

      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  // Generate summary cards (strengths/weaknesses)
  generateSummaryCards() {
    if (!this.data.executiveSummary) return '';

    const strengths = this.data.executiveSummary.strengths || [];
    const weaknesses = this.data.executiveSummary.weaknesses || [];

    let html = '<div class="no-page-break" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">';

    // Strengths card
    html += '<div style="background: linear-gradient(135deg, rgba(0, 217, 36, 0.08) 0%, rgba(0, 217, 36, 0.02) 100%); border: 2px solid rgba(0, 217, 36, 0.3); border-radius: 12px; padding: 1.75rem;">' +
      '<h3 style="font-size: 13pt; font-weight: 700; color: #00D924; margin: 0 0 1.25rem 0; display: flex; align-items: center; letter-spacing: -0.01em;">' +
      '<span style="margin-right: 0.75rem; font-size: 16pt;">✓</span> Punti di Forza' +
      '</h3>' +
      '<ul style="margin: 0; padding-left: 1.75rem; list-style: disc; color: #1A1F36;">';

    strengths.forEach(s => {
      html += '<li style="margin-bottom: 0.65rem; line-height: 1.5;">' + s + '</li>';
    });

    html += '</ul></div>';

    // Weaknesses card
    html += '<div style="background: linear-gradient(135deg, rgba(255, 176, 32, 0.08) 0%, rgba(255, 176, 32, 0.02) 100%); border: 2px solid rgba(255, 176, 32, 0.3); border-radius: 12px; padding: 1.75rem;">' +
      '<h3 style="font-size: 13pt; font-weight: 700; color: #FFB020; margin: 0 0 1.25rem 0; display: flex; align-items: center; letter-spacing: -0.01em;">' +
      '<span style="margin-right: 0.75rem; font-size: 16pt;">⚠</span> Aree di Attenzione' +
      '</h3>' +
      '<ul style="margin: 0; padding-left: 1.75rem; list-style: disc; color: #1A1F36;">';

    weaknesses.forEach(w => {
      html += '<li style="margin-bottom: 0.65rem; line-height: 1.5;">' + w + '</li>';
    });

    html += '</ul></div>';

    html += '</div>';
    return html;
  }

  // Generate Conto Economico table
  generateContoEconomicoTable() {
    const ce = this.data.noteTecniche && this.data.noteTecniche.find(n => n.contoEconomico);
    if (!ce || !ce.contoEconomico) return '';

    const contoEconomico = ce.contoEconomico;
    const formatEuro = (val) => {
      if (val === null || val === undefined) return '-';
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(val);
    };

    const calcVariation = (val2024, val2023) => {
      if (!val2023 || val2023 === 0) return '-';
      const variation = ((val2024 - val2023) / Math.abs(val2023)) * 100;
      return (variation > 0 ? '+' : '') + variation.toFixed(1) + '%';
    };

    const getVariationColor = (val2024, val2023) => {
      if (!val2023) return '#697386';
      return val2024 > val2023 ? '#00D924' : '#DF1B41';
    };

    const rows = [
      { label: 'Ricavi', val2023: contoEconomico.ricavi ? contoEconomico.ricavi['2023'] : null, val2024: contoEconomico.ricavi ? contoEconomico.ricavi['2024'] : null },
      { label: 'Costi Operativi', val2023: contoEconomico.costi && contoEconomico.costi.operativi ? contoEconomico.costi.operativi['2023'] : null, val2024: contoEconomico.costi && contoEconomico.costi.operativi ? contoEconomico.costi.operativi['2024'] : null },
      { label: 'EBITDA', val2023: contoEconomico.risultati && contoEconomico.risultati.ebitda ? contoEconomico.risultati.ebitda['2023'] : null, val2024: contoEconomico.risultati && contoEconomico.risultati.ebitda ? contoEconomico.risultati.ebitda['2024'] : null, highlight: true },
      { label: 'Ammortamenti', val2023: contoEconomico.costi && contoEconomico.costi.ammortamenti ? contoEconomico.costi.ammortamenti['2023'] : null, val2024: contoEconomico.costi && contoEconomico.costi.ammortamenti ? contoEconomico.costi.ammortamenti['2024'] : null },
      { label: 'EBIT', val2023: contoEconomico.risultati && contoEconomico.risultati.ebit ? contoEconomico.risultati.ebit['2023'] : null, val2024: contoEconomico.risultati && contoEconomico.risultati.ebit ? contoEconomico.risultati.ebit['2024'] : null },
      { label: 'Oneri Finanziari', val2023: contoEconomico.costi && contoEconomico.costi.finanziari ? contoEconomico.costi.finanziari['2023'] : null, val2024: contoEconomico.costi && contoEconomico.costi.finanziari ? contoEconomico.costi.finanziari['2024'] : null },
      { label: 'Utile Netto', val2023: contoEconomico.risultati && contoEconomico.risultati.utileNetto ? contoEconomico.risultati.utileNetto['2023'] : null, val2024: contoEconomico.risultati && contoEconomico.risultati.utileNetto ? contoEconomico.risultati.utileNetto['2024'] : null, highlight: true }
    ];

    let html = '<div class="table-wrapper no-page-break">' +
      '<div class="table-title">Conto Economico Riclassificato</div>' +
      '<table>' +
      '<thead>' +
      '<tr>' +
      '<th>Voce</th>' +
      '<th class="align-right">2023</th>' +
      '<th class="align-right">2024</th>' +
      '<th class="align-right">Variazione Δ%</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';

    rows.forEach((row) => {
      const variation = calcVariation(row.val2024, row.val2023);
      const varColor = getVariationColor(row.val2024, row.val2023);
      const rowClass = row.highlight ? 'table-highlight' : '';

      html += '<tr class="' + rowClass + '">' +
        '<td style="font-weight: ' + (row.highlight ? '700' : '500') + ';">' + row.label + '</td>' +
        '<td class="align-right" style="font-weight: ' + (row.highlight ? '600' : '400') + ';">' + formatEuro(row.val2023) + '</td>' +
        '<td class="align-right" style="font-weight: ' + (row.highlight ? '600' : '400') + ';">' + formatEuro(row.val2024) + '</td>' +
        '<td class="align-right" style="font-weight: 700; color: ' + varColor + ';">' + variation + '</td>' +
        '</tr>';
    });

    html += '</tbody></table></div>';
    return html;
  }

  // Generate Stato Patrimoniale table
  generateStatoPatrimonialeTable() {
    const sp = this.data.noteTecniche && this.data.noteTecniche.find(n => n.statoPatrimoniale);
    if (!sp || !sp.statoPatrimoniale) return '';

    const statoPatrimoniale = sp.statoPatrimoniale;
    const formatEuro = (val) => {
      if (val === null || val === undefined) return '-';
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(val);
    };

    const attivo = statoPatrimoniale.attivo || {};
    const passivo = statoPatrimoniale.passivo || {};

    const attivoRows = [
      { label: 'Immobilizzazioni', val2023: attivo.immobilizzazioni ? attivo.immobilizzazioni['2023'] : null, val2024: attivo.immobilizzazioni ? attivo.immobilizzazioni['2024'] : null },
      { label: 'Attivo Corrente', val2023: attivo.corrente ? attivo.corrente['2023'] : null, val2024: attivo.corrente ? attivo.corrente['2024'] : null },
      { label: 'Liquidità', val2023: attivo.liquidita ? attivo.liquidita['2023'] : null, val2024: attivo.liquidita ? attivo.liquidita['2024'] : null },
      { label: 'TOTALE ATTIVO', val2023: attivo.totale ? attivo.totale['2023'] : null, val2024: attivo.totale ? attivo.totale['2024'] : null, total: true }
    ];

    const passivoRows = [
      { label: 'Patrimonio Netto', val2023: passivo.patrimonioNetto ? passivo.patrimonioNetto['2023'] : null, val2024: passivo.patrimonioNetto ? passivo.patrimonioNetto['2024'] : null },
      { label: 'Debiti Finanziari', val2023: passivo.debitiFinanziari ? passivo.debitiFinanziari['2023'] : null, val2024: passivo.debitiFinanziari ? passivo.debitiFinanziari['2024'] : null },
      { label: 'Debiti Commerciali', val2023: passivo.debitiCommerciali ? passivo.debitiCommerciali['2023'] : null, val2024: passivo.debitiCommerciali ? passivo.debitiCommerciali['2024'] : null },
      { label: 'TOTALE PASSIVO', val2023: passivo.totale ? passivo.totale['2023'] : null, val2024: passivo.totale ? passivo.totale['2024'] : null, total: true }
    ];

    let html = '<div class="table-wrapper no-page-break">' +
      '<div class="table-title">Stato Patrimoniale Riclassificato</div>' +
      '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">';

    // ATTIVO table
    html += '<table style="font-size: 9pt;">' +
      '<thead>' +
      '<tr style="background: #00D924;">' +
      '<th colspan="3">ATTIVO</th>' +
      '</tr>' +
      '<tr style="background: rgba(0, 217, 36, 0.15); color: #1A1F36;">' +
      '<th>Voce</th>' +
      '<th class="align-right">2023</th>' +
      '<th class="align-right">2024</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';

    attivoRows.forEach((row) => {
      const rowClass = row.total ? 'table-highlight' : '';
      html += '<tr class="' + rowClass + '">' +
        '<td style="font-weight: ' + (row.total ? '700' : '500') + ';">' + row.label + '</td>' +
        '<td class="align-right" style="font-weight: ' + (row.total ? '600' : '400') + ';">' + formatEuro(row.val2023) + '</td>' +
        '<td class="align-right" style="font-weight: ' + (row.total ? '600' : '400') + ';">' + formatEuro(row.val2024) + '</td>' +
        '</tr>';
    });

    html += '</tbody></table>';

    // PASSIVO table
    html += '<table style="font-size: 9pt;">' +
      '<thead>' +
      '<tr style="background: #DF1B41;">' +
      '<th colspan="3">PASSIVO</th>' +
      '</tr>' +
      '<tr style="background: rgba(223, 27, 65, 0.15); color: #1A1F36;">' +
        '<th>Voce</th>' +
        '<th class="align-right">2023</th>' +
        '<th class="align-right">2024</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';

    passivoRows.forEach((row) => {
      const rowClass = row.total ? 'table-highlight' : '';
      html += '<tr class="' + rowClass + '">' +
        '<td style="font-weight: ' + (row.total ? '700' : '500') + ';">' + row.label + '</td>' +
        '<td class="align-right" style="font-weight: ' + (row.total ? '600' : '400') + ';">' + formatEuro(row.val2023) + '</td>' +
        '<td class="align-right" style="font-weight: ' + (row.total ? '600' : '400') + ';">' + formatEuro(row.val2024) + '</td>' +
        '</tr>';
    });

    html += '</tbody></table>';

    html += '</div></div>';
    return html;
  }

  // Generate risk assessment box
  generateRiskBox() {
    const risk = this.data.riskAssessment;
    if (!risk) return '';

    let html = '<div class="no-page-break" style="background: linear-gradient(135deg, #635BFF 0%, #7C73E6 100%); color: white; border-radius: 16px; padding: 2.5rem; margin: 2rem 0; box-shadow: 0 8px 24px rgba(99, 91, 255, 0.35);">' +
      '<h3 style="font-size: 16pt; font-weight: 700; margin: 0 0 2rem 0; letter-spacing: -0.02em;">Valutazione del Rischio</h3>' +
      '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem;">' +
      '<div style="text-align: center;">' +
      '<div style="font-size: 9.5pt; opacity: 0.85; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Rating</div>' +
      '<div style="font-size: 36pt; font-weight: 800; line-height: 1; letter-spacing: -0.02em;">' + risk.rating + '</div>' +
      '</div>' +
      '<div style="text-align: center;">' +
      '<div style="font-size: 9.5pt; opacity: 0.85; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Score</div>' +
      '<div style="font-size: 36pt; font-weight: 800; line-height: 1; letter-spacing: -0.02em;">' + risk.score.toFixed(1) + '</div>' +
      '</div>' +
      '<div style="text-align: center;">' +
      '<div style="font-size: 9.5pt; opacity: 0.85; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Categoria</div>' +
      '<div style="font-size: 18pt; font-weight: 700; line-height: 1.2; margin-top: 0.75rem; letter-spacing: -0.01em;">' + risk.categoryLabel + '</div>' +
      '</div>' +
      '</div>';

    if (risk.description) {
      html += '<div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.25); font-size: 10.5pt; line-height: 1.7; opacity: 0.95;">' +
        risk.description +
        '</div>';
    }

    html += '</div>';
    return html;
  }

  // Generate Risk Profiles with progress bars
  generateRiskProfilesBars() {
    if (!this.data.profiles || this.data.profiles.length === 0) return '';

    let html = '<div class="risk-profiles no-page-break">' +
      '<h3 style="font-size: 14pt; font-weight: 700; color: #1A1F36; margin: 2rem 0 1.5rem 0; letter-spacing: -0.01em;">Profili di Rischio</h3>';

    this.data.profiles.forEach(profile => {
      const percentage = (profile.score / 5) * 100;
      let barClass = 'risk-bar-green';

      if (profile.color === 'light-green') barClass = 'risk-bar-light-green';
      else if (profile.color === 'yellow') barClass = 'risk-bar-yellow';
      else if (profile.color === 'orange') barClass = 'risk-bar-orange';
      else if (profile.color === 'red') barClass = 'risk-bar-red';

      html += '<div class="risk-profile-item">' +
        '<div class="risk-profile-header">' +
        '<div class="risk-profile-name">' + profile.name + '</div>' +
        '<div class="risk-profile-score">' + profile.score + ' / 5</div>' +
        '</div>' +
        '<div class="risk-profile-bar-container">' +
        '<div class="risk-profile-bar ' + barClass + '" style="width: ' + percentage + '%;">' +
        (percentage > 15 ? profile.evaluation : '') +
        '</div>' +
        '</div>' +
        '</div>';
    });

    html += '</div>';
    return html;
  }

  // Generate Codice della Crisi indicators
  generateCodiceCrisiIndicators() {
    const crisi = this.data.codiceCrisi;
    if (!crisi || !crisi.indices) return '';

    let html = '<div class="no-page-break" style="margin: 2rem 0;">';

    html += '<div style="background: ' + (crisi.status === 'OK' ? 'rgba(0, 217, 36, 0.08)' : 'rgba(255, 176, 32, 0.08)') + '; border: 2px solid ' + (crisi.status === 'OK' ? '#00D924' : '#FFB020') + '; border-radius: 12px; padding: 1.75rem; margin-bottom: 1.5rem;">' +
      '<div style="display: flex; align-items: center; justify-content: space-between;">' +
      '<div>' +
      '<div style="font-size: 12pt; font-weight: 700; color: #1A1F36; margin-bottom: 0.4rem; letter-spacing: -0.01em;">Status Codice della Crisi</div>' +
      '<div style="font-size: 9.5pt; color: #697386; font-weight: 500;">Valutazione degli indicatori di allerta</div>' +
      '</div>' +
      '<div style="font-size: 28pt; font-weight: 700; color: ' + (crisi.status === 'OK' ? '#00D924' : '#FFB020') + ';">' +
      (crisi.status === 'OK' ? '✓' : '⚠') +
      '</div>' +
      '</div>' +
      '</div>';

    html += '<div style="background: white; border: 1px solid #E3E8EE; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(50, 50, 93, 0.08);">';

    crisi.indices.forEach((idx, i) => {
      const statusColor = idx.status === 'OK' ? '#00D924' : idx.status === 'WARNING' ? '#FFB020' : '#DF1B41';
      const statusBg = idx.status === 'OK' ? 'rgba(0, 217, 36, 0.12)' : idx.status === 'WARNING' ? 'rgba(255, 176, 32, 0.12)' : 'rgba(223, 27, 65, 0.12)';
      const statusSymbol = idx.status === 'OK' ? '✓' : '⚠';

      html += '<div style="display: flex; align-items: center; padding: 1.25rem; ' + (i > 0 ? 'border-top: 1px solid #E3E8EE;' : '') + '">' +
        '<div style="width: 42px; height: 42px; border-radius: 50%; background: ' + statusBg + '; color: ' + statusColor + '; display: flex; align-items: center; justify-content: center; font-size: 18pt; font-weight: 700; flex-shrink: 0; margin-right: 1.25rem;">' +
        statusSymbol +
        '</div>' +
        '<div style="flex: 1;">' +
        '<div style="font-weight: 600; font-size: 10.5pt; color: #1A1F36; margin-bottom: 0.35rem; letter-spacing: -0.01em;">' + idx.name + '</div>' +
        '<div style="font-size: 9pt; color: #4F566B;">Valore: <strong>' + idx.value + '</strong> | Soglia: <strong>' + idx.soglia + '</strong></div>' +
        '</div>' +
        '<div style="padding: 0.6rem 1.2rem; background: ' + statusBg + '; color: ' + statusColor + '; border-radius: 8px; font-size: 9pt; font-weight: 700; letter-spacing: 0.02em;">' +
        idx.status +
        '</div>' +
        '</div>';
    });

    html += '</div></div>';
    return html;
  }

  // Convert markdown to HTML
  markdownToHTML(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 13pt; font-weight: 700; color: #4F566B; margin: 1.75rem 0 0.9rem 0; letter-spacing: -0.01em;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 15pt; font-weight: 700; color: #635BFF; margin: 2.25rem 0 1.1rem 0; letter-spacing: -0.01em;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 17pt; font-weight: 700; color: #1A1F36; margin: 2.5rem 0 1.25rem 0; letter-spacing: -0.02em;">$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Lists
    const lines = html.split('\n');
    let inList = false;
    let result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^[\-\*]\s+(.+)/)) {
        if (!inList) {
          result.push('<ul style="margin: 1.25rem 0; padding-left: 2rem; list-style: disc; color: #1A1F36; line-height: 1.7;">');
          inList = true;
        }
        result.push('<li style="margin-bottom: 0.6rem;">' + line.replace(/^[\-\*]\s+/, '') + '</li>');
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (line.trim() && !line.startsWith('<')) {
          result.push('<p style="margin: 1.1rem 0; line-height: 1.7; color: #1A1F36; text-align: justify;">' + line + '</p>');
        } else {
          result.push(line);
        }
      }
    }

    if (inList) {
      result.push('</ul>');
    }

    return result.join('\n');
  }

  // Get formatted date (Month Year)
  getFormattedDate() {
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const date = new Date();
    return months[date.getMonth()] + ' ' + date.getFullYear();
  }

  // Get current date for filename
  getCurrentDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }

  // ===========================
  // BACKWARD COMPATIBILITY
  // Legacy method for custom note generation
  // ===========================

  async generateCustomNote(noteContent, title) {
    const noteTitle = title || 'Nota Tecnica';

    try {
      await this.loadLogo();

      let htmlContent = '<html><head>' +
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">' +
        '<style>body { font-family: "Inter", sans-serif; color: #1A1F36; font-size: 10.5pt; line-height: 1.6; padding: 2rem; }</style>' +
        '</head><body>';

      htmlContent += '<div style="text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid #635BFF;">';

      if (this.logoBase64) {
        htmlContent += '<img src="' + this.logoBase64 + '" alt="Logo" style="width: 100px; height: auto; margin-bottom: 1rem;">';
      }

      htmlContent += '<h1 style="font-size: 22pt; font-weight: 700; color: #635BFF; margin: 0; letter-spacing: -0.01em;">' + noteTitle + '</h1>';
      htmlContent += '<div style="font-size: 10pt; color: #697386; margin-top: 0.75rem; font-weight: 500;">' + this.getFormattedDate() + '</div>';
      htmlContent += '</div>';

      htmlContent += this.markdownToHTML(noteContent);
      htmlContent += '</body></html>';

      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = 'position: absolute; left: -9999px; top: 0;';
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      const filename = 'nota-tecnica-' + this.getCurrentDate() + '.pdf';

      const opt = {
        margin: [15, 15, 15, 15],
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(tempDiv.firstChild).save();

      document.body.removeChild(tempDiv);

      console.log('✅ Custom note generated successfully');
    } catch (error) {
      console.error('❌ Error generating custom note:', error);
      throw error;
    }
  }
}

// Expose globally
window.PDFGenerator = PDFGenerator;
