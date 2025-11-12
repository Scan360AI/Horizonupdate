/**
 * PDF Generator for Financial Reports
 * Genera report PDF professionali con pdfmake
 */

class PDFGenerator {
  constructor(financialData) {
    this.data = financialData;
    this.logoBase64 = null;
  }

  /**
   * Carica il logo in formato Base64 per embedding nel PDF
   */
  async loadLogo() {
    try {
      const response = await fetch('/assets/images/logo.png');
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Errore caricamento logo:', error);
      return null;
    }
  }

  /**
   * Genera report completo standard
   */
  async generateFullReport() {
    if (!this.data) {
      alert('Dati finanziari non disponibili');
      return;
    }

    try {
      // Carica logo (opzionale, se fallisce continua)
      try {
        this.logoBase64 = await this.loadLogo();
      } catch (logoError) {
        console.warn('Logo non caricato:', logoError);
        this.logoBase64 = null;
      }

      // Genera grafici come immagini
      const chartImages = await this.generateChartImages();

      // Definizione documento PDF
      const docDefinition = {
        info: {
          title: `Report Finanziario - ${this.data.company.name}`,
          author: 'Horizon Financial Monitor',
          subject: 'Analisi Finanziaria Completa',
          keywords: 'financial report, analisi finanziaria, bilancio',
          creator: 'Horizon Financial Monitor',
          producer: 'pdfmake'
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],

        header: (currentPage, pageCount) => {
          if (currentPage === 1) return null;
          return {
            margin: [40, 20, 40, 0],
            columns: [
              { text: 'Horizon Financial Monitor', style: 'headerText' },
              { text: `Pagina ${currentPage} di ${pageCount}`, style: 'headerText', alignment: 'right' }
            ]
          };
        },

        footer: (currentPage, pageCount) => {
          return {
            margin: [40, 0, 40, 20],
            columns: [
              { text: `Report generato il ${this.data.reportInfo.date}`, fontSize: 8, color: '#64748b' },
              { text: 'Riservato e Confidenziale', fontSize: 8, color: '#64748b', alignment: 'right' }
            ]
          };
        },

        content: [
          ...this.generateCoverPage(),
          { text: '', pageBreak: 'after' },
          ...this.generateTableOfContents(),
          { text: '', pageBreak: 'after' },
          ...this.generateExecutiveSummary(),
          { text: '', pageBreak: 'after' },
          ...this.generateCompanyProfile(),
          { text: '', pageBreak: 'after' },
          ...this.generateEconomicAnalysis(chartImages),
          { text: '', pageBreak: 'after' },
          ...this.generateBalanceSheet(),
          { text: '', pageBreak: 'after' },
          ...this.generateFinancialIndicators(),
          { text: '', pageBreak: 'after' },
          ...this.generateRiskAssessment(chartImages),
          { text: '', pageBreak: 'after' },
          ...this.generateCrisisCode(),
          { text: '', pageBreak: 'after' },
          ...this.generateRecommendations()
        ],

        styles: {
          coverTitle: {
            fontSize: 32,
            bold: true,
            color: '#2f3e9e',
            margin: [0, 20, 0, 10]
          },
          coverSubtitle: {
          fontSize: 18,
          color: '#64748b',
          margin: [0, 0, 0, 40]
        },
        coverInfo: {
          fontSize: 12,
          color: '#475569',
          margin: [0, 5, 0, 5]
        },
        h1: {
          fontSize: 24,
          bold: true,
          color: '#2f3e9e',
          margin: [0, 0, 0, 20]
        },
        h2: {
          fontSize: 18,
          bold: true,
          color: '#2f3e9e',
          margin: [0, 20, 0, 12]
        },
        h3: {
          fontSize: 14,
          bold: true,
          color: '#475569',
          margin: [0, 12, 0, 8]
        },
        normal: {
          fontSize: 10,
          lineHeight: 1.5
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'white',
          fillColor: '#2f3e9e'
        },
        positive: {
          color: '#24b47e',
          bold: true
        },
        negative: {
          color: '#f5365c',
          bold: true
        },
        warning: {
          color: '#f9b115',
          bold: true
        },
        headerText: {
          fontSize: 9,
          color: '#64748b'
        }
      },

      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        lineHeight: 1.6
      }
    };

      // Genera e scarica PDF
      console.log('📄 Generazione PDF in corso...');
      pdfMake.createPdf(docDefinition).download(`report-${this.data.company.name}-${this.getCurrentDate()}.pdf`);
      console.log('✅ PDF generato con successo!');

    } catch (error) {
      console.error('❌ Errore generazione report:', error);
      throw error; // Rilancia l'errore per il chatbot
    }
  }

  /**
   * Genera nota personalizzata basata su conversazione
   */
  async generateCustomNote(noteContent, noteTitle, chartImages = null) {
    if (!this.data) {
      alert('Dati finanziari non disponibili');
      return;
    }

    this.logoBase64 = await this.loadLogo();

    const docDefinition = {
      info: {
        title: noteTitle || 'Nota Finanziaria',
        author: 'Horizon Financial Monitor',
        creator: 'Horizon Financial Monitor - AI Assistant'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      header: (currentPage, pageCount) => {
        if (currentPage === 1) return null;
        return {
          margin: [40, 20, 40, 0],
          text: noteTitle || 'Nota Finanziaria',
          style: 'headerText'
        };
      },

      footer: (currentPage, pageCount) => {
        return {
          margin: [40, 0, 40, 20],
          columns: [
            { text: `Nota generata il ${new Date().toLocaleDateString('it-IT')}`, fontSize: 8, color: '#64748b' },
            { text: `Pagina ${currentPage} di ${pageCount}`, fontSize: 8, color: '#64748b', alignment: 'right' }
          ]
        };
      },

      content: [
        // Cover box elegante
        {
          columns: [
            this.logoBase64 ? { image: this.logoBase64, width: 100 } : {},
            {
              width: '*',
              stack: [
                { text: noteTitle || 'Nota Finanziaria', style: 'h1', margin: [0, 10, 0, 5] },
                { text: this.data.company.name, style: 'coverSubtitle' },
                {
                  text: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
                  fontSize: 10,
                  color: '#94a3b8',
                  margin: [0, 8, 0, 0]
                }
              ]
            }
          ],
          margin: [0, 0, 0, 25]
        },
        // Linea separatore elegante
        {
          canvas: [{
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 3,
            r: 2,
            color: '#3b82f6'
          }],
          margin: [0, 0, 0, 30]
        },

        // Contenuto della nota (convertito da markdown con grafici)
        ...this.parseMarkdownToPDFContent(noteContent, chartImages),

        // Disclaimer elegante
        { text: '', margin: [0, 40, 0, 0] },
        {
          stack: [
            {
              text: [
                { text: '⚠️  ', fontSize: 12 },
                { text: 'Disclaimer', bold: true, fontSize: 10 }
              ],
              margin: [0, 0, 0, 8],
              color: '#64748b'
            },
            {
              text: 'Questo documento è stato generato automaticamente da un assistente AI basato sui dati finanziari disponibili. Le informazioni contenute sono fornite a scopo informativo e non costituiscono consulenza finanziaria professionale.',
              fontSize: 9,
              color: '#64748b',
              italics: true,
              lineHeight: 1.4
            }
          ],
          background: '#f8fafc',
          fillColor: '#f8fafc',
          margin: [0, 0, 0, 0],
          padding: [12, 12, 12, 12]
        }
      ],

      styles: {
        h1: {
          fontSize: 26,
          bold: true,
          color: '#1e293b',
          margin: [0, 0, 0, 16],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: '#3b82f6'
        },
        h2: {
          fontSize: 19,
          bold: true,
          color: '#0f172a',
          margin: [0, 20, 0, 12],
          background: '#f1f5f9',
          fillColor: '#f1f5f9'
        },
        h3: {
          fontSize: 15,
          bold: true,
          color: '#334155',
          margin: [0, 14, 0, 10]
        },
        coverSubtitle: {
          fontSize: 16,
          color: '#64748b',
          margin: [0, 5, 0, 0]
        },
        headerText: {
          fontSize: 9,
          color: '#94a3b8'
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'white',
          fillColor: '#3b82f6',
          alignment: 'left'
        },
        normal: {
          fontSize: 11,
          lineHeight: 1.6,
          color: '#334155'
        }
      },

      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        lineHeight: 1.6,
        color: '#1e293b'
      }
    };

    // Genera filename sicuro
    const safeTitle = (noteTitle || 'nota')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    pdfMake.createPdf(docDefinition).download(`nota-${safeTitle}-${this.getCurrentDate()}.pdf`);
  }

  // ============================================
  // SEZIONI REPORT COMPLETO
  // ============================================

  generateCoverPage() {
    return [
      this.logoBase64 ? { image: this.logoBase64, width: 150, margin: [0, 60, 0, 40] } : {},
      { text: 'REPORT FINANZIARIO', style: 'coverTitle', alignment: 'center' },
      { text: this.data.company.name, style: 'coverSubtitle', alignment: 'center' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#2f3e9e' }], margin: [0, 40, 0, 40] },
      { text: 'ANALISI FINANZIARIA COMPLETA', fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 60] },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Data Report:', style: 'coverInfo', bold: true },
              { text: this.data.reportInfo.date, style: 'coverInfo' },
              { text: '', margin: [0, 10, 0, 0] },
              { text: 'Settore:', style: 'coverInfo', bold: true },
              { text: this.data.company.ateco, style: 'coverInfo' },
              { text: '', margin: [0, 10, 0, 0] },
              { text: 'Rating:', style: 'coverInfo', bold: true },
              { text: `${this.data.riskAssessment.rating} - ${this.data.riskAssessment.categoryLabel}`, style: 'coverInfo', color: this.getRatingColor() }
            ]
          },
          {
            width: '*',
            stack: [
              { text: 'Sede Legale:', style: 'coverInfo', bold: true },
              { text: `${this.data.company.address.city}, ${this.data.company.address.province}`, style: 'coverInfo' },
              { text: '', margin: [0, 10, 0, 0] },
              { text: 'P.IVA:', style: 'coverInfo', bold: true },
              { text: this.data.company.piva, style: 'coverInfo' },
              { text: '', margin: [0, 10, 0, 0] },
              { text: 'Dipendenti:', style: 'coverInfo', bold: true },
              { text: this.data.company.employees.current.toString(), style: 'coverInfo' }
            ]
          }
        ]
      }
    ];
  }

  generateTableOfContents() {
    return [
      { text: 'INDICE', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },
      { text: '1. Executive Summary', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '2. Profilo Aziendale', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '3. Analisi Economica', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '4. Stato Patrimoniale', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '5. Indicatori Finanziari', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '6. Risk Assessment', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '7. Codice della Crisi d\'Impresa', fontSize: 12, margin: [0, 8, 0, 8] },
      { text: '8. Raccomandazioni', fontSize: 12, margin: [0, 8, 0, 8] }
    ];
  }

  generateExecutiveSummary() {
    return [
      { text: '1. EXECUTIVE SUMMARY', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      // Risk Score Box
      {
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              { text: 'INDICE DI RISCHIO', fontSize: 12, bold: true, color: 'white' },
              { text: this.data.riskAssessment.score.toFixed(2), fontSize: 32, bold: true, color: 'white', margin: [0, 10, 0, 0] },
              { text: `${this.data.riskAssessment.rating} - ${this.data.riskAssessment.categoryLabel}`, fontSize: 11, color: 'white', margin: [0, 5, 0, 10] }
            ],
            fillColor: this.getRatingColor(),
            margin: [20, 15, 20, 15],
            alignment: 'center'
          }]]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 20]
      },

      { text: this.data.riskAssessment.description, margin: [0, 0, 0, 20] },

      { text: 'Punti di Forza', style: 'h2' },
      {
        ul: this.data.executiveSummary.strengths.map(s => ({ text: s, margin: [0, 3, 0, 3] })),
        margin: [0, 0, 0, 20]
      },

      { text: 'Aree di Attenzione', style: 'h2' },
      {
        ul: this.data.executiveSummary.weaknesses.map(w => ({ text: w, margin: [0, 3, 0, 3] })),
        margin: [0, 0, 0, 0]
      }
    ];
  }

  generateCompanyProfile() {
    return [
      { text: '2. PROFILO AZIENDALE', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      { text: 'Dati Anagrafici', style: 'h2' },
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            ['Ragione Sociale', this.data.company.fullName],
            ['Forma Giuridica', this.data.company.legalForm],
            ['Data Costituzione', this.data.company.foundedDate],
            ['Codice ATECO', this.data.company.ateco],
            ['P.IVA', this.data.company.piva],
            ['Indirizzo', `${this.data.company.address.street}, ${this.data.company.address.zip} ${this.data.company.address.city} (${this.data.company.address.province})`]
          ]
        },
        margin: [0, 0, 0, 20]
      },

      { text: 'Struttura Organizzativa', style: 'h2' },
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            ['Capitale Sociale', this.formatCurrency(this.data.company.capitaleSociale)],
            ['Dipendenti', `${this.data.company.employees.current} (${this.data.company.employees.trend >= 0 ? '+' : ''}${this.data.company.employees.trend} vs anno precedente)`],
            ['Sedi Operative', this.data.company.locations.toString()],
            ['Email / PEC', `${this.data.company.contacts.email} / ${this.data.company.contacts.pec}`],
            ['Sito Web', this.data.company.contacts.website || 'N/D']
          ]
        },
        margin: [0, 0, 0, 20]
      },

      { text: 'Organi Sociali', style: 'h2' },
      {
        table: {
          widths: ['30%', '40%', '30%'],
          headerRows: 1,
          body: [
            [{ text: 'Nome', style: 'tableHeader' }, { text: 'Ruolo', style: 'tableHeader' }, { text: 'Data Nomina', style: 'tableHeader' }],
            ...this.data.management.map(m => [m.name, m.role, m.appointmentDate])
          ]
        }
      }
    ];
  }

  generateEconomicAnalysis(chartImages) {
    const revenues = this.data.keyMetrics.find(m => m.id === 'revenues');
    const ebitda = this.data.financialData.stats.find(s => s.id === 'ebitda');
    const netIncome = this.data.financialData.stats.find(s => s.id === 'utile');

    return [
      { text: '3. ANALISI ECONOMICA', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      { text: 'Principali Indicatori Economici 2024', style: 'h2' },
      {
        table: {
          widths: ['40%', '30%', '30%'],
          headerRows: 1,
          body: [
            [
              { text: 'Indicatore', style: 'tableHeader' },
              { text: 'Valore', style: 'tableHeader' },
              { text: 'Trend vs 2023', style: 'tableHeader' }
            ],
            [
              'Ricavi delle Vendite',
              revenues?.value || 'N/D',
              { text: `+${revenues?.trend?.value || 0}%`, style: 'positive' }
            ],
            [
              'EBITDA',
              ebitda?.value || 'N/D',
              { text: ebitda?.trend?.value || 'N/D', style: 'positive' }
            ],
            [
              'Utile Netto',
              netIncome?.value || 'N/D',
              { text: netIncome?.trend?.value || 'N/D', style: 'positive' }
            ]
          ]
        },
        margin: [0, 0, 0, 20]
      },

      { text: 'Trend Economico (2022-2024)', style: 'h2' },
      chartImages.economicTrend ?
        { image: chartImages.economicTrend, width: 500, margin: [0, 10, 0, 20] } :
        { text: 'Grafico non disponibile', italics: true, color: '#64748b', margin: [0, 10, 0, 20] }
    ];
  }

  generateBalanceSheet() {
    const sp = this.data.noteTecniche[1]?.statoPatrimoniale;
    if (!sp) return [{ text: 'Dati di bilancio non disponibili', italics: true }];

    return [
      { text: '4. STATO PATRIMONIALE', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      { text: 'Attivo', style: 'h2' },
      {
        table: {
          widths: ['60%', '40%'],
          headerRows: 1,
          body: [
            [{ text: 'Voce', style: 'tableHeader' }, { text: 'Valore 2024', style: 'tableHeader' }],
            ...sp.attivo.immobilizzazioni.map(item => [item.voce, item['2024']]),
            [{ text: 'Totale Immobilizzazioni', bold: true }, { text: sp.attivo.totaleImmobilizzazioni['2024'], bold: true }],
            ...sp.attivo.circolante.map(item => [item.voce, item['2024']]),
            [{ text: 'Totale Attivo Circolante', bold: true }, { text: sp.attivo.totaleCircolante['2024'], bold: true }],
            [{ text: 'TOTALE ATTIVO', bold: true, fillColor: '#f1f5f9' }, { text: sp.attivo.totaleAttivo['2024'], bold: true, fillColor: '#f1f5f9' }]
          ]
        },
        margin: [0, 0, 0, 20]
      },

      { text: 'Passivo', style: 'h2' },
      {
        table: {
          widths: ['60%', '40%'],
          headerRows: 1,
          body: [
            [{ text: 'Voce', style: 'tableHeader' }, { text: 'Valore 2024', style: 'tableHeader' }],
            ...sp.passivo.patrimonioNetto.map(item => [item.voce, item['2024'] || 'N/D']),
            [{ text: 'Totale Patrimonio Netto', bold: true }, { text: sp.passivo.totalePatrimonioNetto['2024'], bold: true }],
            ...sp.passivo.debiti.map(item => [item.voce, item['2024']]),
            [{ text: 'Totale Debiti', bold: true }, { text: sp.passivo.totaleDebiti['2024'], bold: true }],
            [{ text: 'TOTALE PASSIVO', bold: true, fillColor: '#f1f5f9' }, { text: sp.passivo.totalePassivo['2024'], bold: true, fillColor: '#f1f5f9' }]
          ]
        }
      }
    ];
  }

  generateFinancialIndicators() {
    return [
      { text: '5. INDICATORI FINANZIARI', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      {
        table: {
          widths: ['40%', '30%', '30%'],
          headerRows: 1,
          body: [
            [
              { text: 'Indicatore', style: 'tableHeader' },
              { text: 'Valore', style: 'tableHeader' },
              { text: 'Valutazione', style: 'tableHeader' }
            ],
            ...this.data.financialData.stats.filter(s => ['roe', 'roi', 'ros', 'leverage', 'liquidita'].includes(s.id)).map(stat => [
              stat.label,
              stat.value,
              { text: stat.trend.value, style: this.getIndicatorStyle(stat.colorClass) }
            ])
          ]
        }
      }
    ];
  }

  generateRiskAssessment(chartImages) {
    return [
      { text: '6. RISK ASSESSMENT', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      { text: 'Profili di Rischio (scala 1-5)', style: 'h2' },
      {
        table: {
          widths: ['50%', '20%', '30%'],
          headerRows: 1,
          body: [
            [
              { text: 'Profilo', style: 'tableHeader' },
              { text: 'Score', style: 'tableHeader' },
              { text: 'Valutazione', style: 'tableHeader' }
            ],
            ...this.data.profiles.map(p => [
              p.name,
              `${p.score}/5`,
              { text: p.evaluation, color: this.getProfileColor(p.color) }
            ])
          ]
        },
        margin: [0, 0, 0, 20]
      },

      { text: 'Benchmark Settoriale', style: 'h2' },
      chartImages.benchmarkRadar ?
        { image: chartImages.benchmarkRadar, width: 400, alignment: 'center', margin: [0, 10, 0, 0] } :
        { text: 'Grafico non disponibile', italics: true, color: '#64748b', margin: [0, 10, 0, 20] }
    ];
  }

  generateCrisisCode() {
    return [
      { text: '7. CODICE DELLA CRISI D\'IMPRESA', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      {
        text: [
          'Status: ',
          { text: this.data.codiceCrisi.status.overall, bold: true, color: this.data.codiceCrisi.status.overall === 'ALLERTA' ? '#f5365c' : '#24b47e' },
          ` (${this.data.codiceCrisi.status.indiciOk} OK, ${this.data.codiceCrisi.status.indiciAllerta} in allerta su ${this.data.codiceCrisi.status.totale})`
        ],
        margin: [0, 0, 0, 20],
        fontSize: 12
      },

      {
        table: {
          widths: ['5%', '30%', '25%', '20%', '20%'],
          headerRows: 1,
          body: [
            [
              { text: '#', style: 'tableHeader' },
              { text: 'Indice', style: 'tableHeader' },
              { text: 'Valore', style: 'tableHeader' },
              { text: 'Soglia', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' }
            ],
            ...this.data.codiceCrisi.indices.map(idx => [
              idx.number.toString(),
              { text: idx.name, fontSize: 9 },
              idx.value,
              { text: idx.soglia, fontSize: 9 },
              {
                text: idx.status,
                bold: true,
                color: idx.status === 'OK' ? '#24b47e' : idx.status === 'ALLERTA' ? '#f5365c' : '#f9b115'
              }
            ])
          ]
        }
      }
    ];
  }

  generateRecommendations() {
    return [
      { text: '8. RACCOMANDAZIONI', style: 'h1' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }], margin: [0, 0, 0, 20] },

      {
        ul: this.data.outlook.raccomandazioni.map(r => ({ text: r, margin: [0, 5, 0, 5] })),
        margin: [0, 0, 0, 20]
      },

      { text: 'Outlook', style: 'h2' },
      { text: this.data.outlook.outlook, alignment: 'justify' }
    ];
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  async generateChartImages() {
    // Placeholder - i grafici verranno generati dai Chart.js esistenti
    // Per ora ritorniamo oggetto vuoto, implementeremo dopo
    return {
      economicTrend: null,
      benchmarkRadar: null
    };
  }

  parseMarkdownToPDFContent(markdown, chartImages = null) {
    // Parser markdown avanzato -> pdfmake content con formattazione corretta + grafici
    const lines = markdown.split('\n');
    const content = [];
    let inList = false;
    let listItems = [];
    let inTable = false;
    let tableLines = [];
    let lastH2Title = null; // Traccia ultimo H2 per inserire grafici

    const parseInlineFormatting = (text) => {
      // Converti markdown inline in array di text objects pdfmake
      const parts = [];
      let currentPos = 0;

      // Pattern per bold, italic, e testo normale
      const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|([^*]+)/g;
      let match;

      while ((match = pattern.exec(text)) !== null) {
        if (match[2]) {
          // Bold **text**
          parts.push({ text: match[2], bold: true });
        } else if (match[4]) {
          // Italic *text*
          parts.push({ text: match[4], italics: true });
        } else if (match[5]) {
          // Normal text
          parts.push({ text: match[5] });
        }
      }

      return parts.length > 0 ? parts : [{ text: text }];
    };

    const flushList = () => {
      if (listItems.length > 0) {
        content.push({
          ul: listItems,
          margin: [0, 5, 0, 10]
        });
        listItems = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (tableLines.length > 0) {
        // Parse markdown table
        const rows = tableLines.filter(line => !line.match(/^\|[\s-:|]+\|$/)); // Rimuovi separator row

        if (rows.length > 0) {
          const tableBody = rows.map((row, index) => {
            const cells = row
              .split('|')
              .slice(1, -1) // Rimuovi | iniziale e finale
              .map(cell => cell.trim());

            return cells.map(cell => ({
              text: parseInlineFormatting(cell),
              style: index === 0 ? 'tableHeader' : 'normal',
              margin: [5, 5, 5, 5]
            }));
          });

          content.push({
            table: {
              headerRows: 1,
              widths: Array(tableBody[0]?.length || 1).fill('*'),
              body: tableBody
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex === 0 ? '#3b82f6' : (rowIndex % 2 === 0 ? '#f8fafc' : null)),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => '#e2e8f0',
              vLineColor: () => '#e2e8f0'
            },
            margin: [0, 10, 0, 15]
          });
        }

        tableLines = [];
        inTable = false;
      }
    };

    const insertChartIfNeeded = (sectionTitle) => {
      if (!chartImages) return;

      // Mapping sezioni -> grafici
      const chartMapping = {
        'analisi economica': 'economicTrend',
        'economic': 'economicTrend',
        'indicatori finanziari': ['debtSustainability', 'workingCapital'],
        'financial indicators': ['debtSustainability', 'workingCapital'],
        'stato patrimoniale': 'workingCapital',
        'balance sheet': 'workingCapital',
        'risk assessment': 'benchmarkRadar',
        'valutazione rischio': 'benchmarkRadar',
        'profili': 'benchmarkRadar',
        'stress': 'stressTest',
        'scenario': 'stressTest'
      };

      const titleLower = sectionTitle.toLowerCase();

      for (const [key, chartKey] of Object.entries(chartMapping)) {
        if (titleLower.includes(key)) {
          // Se è un array, inserisci tutti i grafici
          if (Array.isArray(chartKey)) {
            chartKey.forEach(ck => {
              if (chartImages[ck]) {
                content.push({
                  image: chartImages[ck],
                  width: 480,
                  alignment: 'center',
                  margin: [0, 15, 0, 20]
                });
              }
            });
          } else {
            // Singolo grafico
            if (chartImages[chartKey]) {
              content.push({
                image: chartImages[chartKey],
                width: chartKey === 'benchmarkRadar' ? 350 : 480,
                alignment: 'center',
                margin: [0, 15, 0, 20]
              });
            }
          }
          break;
        }
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Rileva tabelle markdown (righe che iniziano con |)
      if (trimmed.startsWith('|')) {
        flushList();
        inTable = true;
        tableLines.push(trimmed);
        return;
      }

      // Se eravamo in una tabella e la riga non è una tabella, flush
      if (inTable && !trimmed.startsWith('|')) {
        flushTable();
      }

      // Linea vuota
      if (!trimmed) {
        flushList();
        flushTable();
        if (content.length > 0) {
          content.push({ text: '', margin: [0, 5, 0, 5] });
        }
        return;
      }

      // Headers H1
      if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
        flushList();
        flushTable();
        const headerText = trimmed.replace(/^#\s*/, '');
        content.push({
          text: parseInlineFormatting(headerText),
          style: 'h1'
        });
        return;
      }

      // Headers H2
      if (trimmed.startsWith('## ') && !trimmed.startsWith('###')) {
        flushList();
        flushTable();

        // Se c'era un H2 precedente, inserisci grafico se appropriato
        if (lastH2Title) {
          insertChartIfNeeded(lastH2Title);
        }

        const headerText = trimmed.replace(/^##\s*/, '');
        lastH2Title = headerText; // Traccia per prossimo inserimento

        content.push({
          text: parseInlineFormatting(headerText),
          style: 'h2'
        });
        return;
      }

      // Headers H3
      if (trimmed.startsWith('### ') && !trimmed.startsWith('####')) {
        flushList();
        flushTable();
        const headerText = trimmed.replace(/^###\s*/, '');
        content.push({
          text: parseInlineFormatting(headerText),
          style: 'h3'
        });
        return;
      }

      // Headers H4
      if (trimmed.startsWith('#### ')) {
        flushList();
        flushTable();
        const headerText = trimmed.replace(/^####\s*/, '');
        content.push({
          text: parseInlineFormatting(headerText),
          fontSize: 11,
          bold: true,
          margin: [0, 8, 0, 4]
        });
        return;
      }

      // Liste non ordinate (- o *)
      if (trimmed.match(/^[-*]\s+/)) {
        inList = true;
        const itemText = trimmed.replace(/^[-*]\s+/, '');
        listItems.push(parseInlineFormatting(itemText));
        return;
      }

      // Liste numerate (1. 2. ecc)
      if (trimmed.match(/^\d+\.\s+/)) {
        flushList();
        const itemText = trimmed.replace(/^\d+\.\s+/, '');
        // Per ora tratta come lista non ordinata (TODO: implementare ol)
        if (!inList) {
          inList = true;
        }
        listItems.push(parseInlineFormatting(itemText));
        return;
      }

      // Separatore orizzontale
      if (trimmed.match(/^---+$/) || trimmed.match(/^\*\*\*+$/)) {
        flushList();
        content.push({
          canvas: [{
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: '#e2e8f0'
          }],
          margin: [0, 10, 0, 10]
        });
        return;
      }

      // Paragrafo normale
      flushList();
      flushTable();
      content.push({
        text: parseInlineFormatting(trimmed),
        margin: [0, 3, 0, 3],
        alignment: 'justify'
      });
    });

    // Flush finale se presente
    flushList();
    flushTable();

    // Inserisci grafico dell'ultima sezione se presente
    if (lastH2Title) {
      insertChartIfNeeded(lastH2Title);
    }

    return content;
  }

  getRatingColor() {
    const category = this.data.riskAssessment.category;
    if (category === 'A') return '#24b47e';
    if (category === 'B') return '#f9b115';
    return '#f5365c';
  }

  getProfileColor(colorClass) {
    const colorMap = {
      'green': '#24b47e',
      'light-green': '#5dd39e',
      'yellow': '#f9b115',
      'orange': '#fb8833',
      'red': '#f5365c'
    };
    return colorMap[colorClass] || '#475569';
  }

  getIndicatorStyle(colorClass) {
    if (colorClass === 'positive') return 'positive';
    if (colorClass === 'negative') return 'negative';
    if (colorClass === 'warning') return 'warning';
    return 'normal';
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }
}

// Esponi globalmente
window.PDFGenerator = PDFGenerator;
