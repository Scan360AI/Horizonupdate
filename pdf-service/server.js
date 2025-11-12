const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Per gestire HTML grandi con grafici base64
app.use(express.text({ limit: '50mb', type: 'text/html' }));

// Variabile per riutilizzare il browser
let browser = null;

// Inizializza browser Puppeteer
async function getBrowser() {
  if (!browser) {
    console.log('🚀 Avvio browser Puppeteer...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    console.log('✅ Browser Puppeteer avviato');
  }
  return browser;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PDF Generation Service' });
});

// Endpoint principale per generare PDF
app.post('/generate-pdf', async (req, res) => {
  const startTime = Date.now();
  console.log('📄 Richiesta generazione PDF ricevuta');

  try {
    const { html, filename = 'document.pdf', options = {} } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('📝 HTML length:', html.length);

    // Ottieni browser
    const browserInstance = await getBrowser();
    const page = await browserInstance.newPage();

    // Configurazione viewport
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2 // Per alta qualità
    });

    // Carica HTML
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 30000
    });

    // Configurazione PDF con defaults intelligenti
    const pdfOptions = {
      format: options.format || 'A4',
      margin: options.margin || {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      ...options
    };

    console.log('🎨 Generazione PDF con opzioni:', pdfOptions);

    // Genera PDF
    const pdf = await page.pdf(pdfOptions);

    await page.close();

    const duration = Date.now() - startTime;
    console.log(`✅ PDF generato in ${duration}ms - Size: ${(pdf.length / 1024).toFixed(2)}KB`);

    // Invia PDF come response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length
    });

    res.send(pdf);

  } catch (error) {
    console.error('❌ Errore generazione PDF:', error);
    res.status(500).json({
      error: 'PDF generation failed',
      message: error.message
    });
  }
});

// Endpoint per generare PDF da URL (opzionale)
app.post('/generate-pdf-from-url', async (req, res) => {
  try {
    const { url, filename = 'document.pdf', options = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🌐 Generazione PDF da URL:', url);

    const browserInstance = await getBrowser();
    const page = await browserInstance.newPage();

    await page.goto(url, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 30000
    });

    const pdfOptions = {
      format: options.format || 'A4',
      margin: options.margin || {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: false,
      ...options
    };

    const pdf = await page.pdf(pdfOptions);
    await page.close();

    console.log(`✅ PDF generato da URL - Size: ${(pdf.length / 1024).toFixed(2)}KB`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length
    });

    res.send(pdf);

  } catch (error) {
    console.error('❌ Errore generazione PDF da URL:', error);
    res.status(500).json({
      error: 'PDF generation from URL failed',
      message: error.message
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutdown richiesto...');
  if (browser) {
    await browser.close();
    console.log('✅ Browser chiuso');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutdown richiesto...');
  if (browser) {
    await browser.close();
    console.log('✅ Browser chiuso');
  }
  process.exit(0);
});

// Avvio server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 PDF Service - Puppeteer Server       ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  POST /generate-pdf           - Generate PDF from HTML`);
  console.log(`  POST /generate-pdf-from-url  - Generate PDF from URL`);
  console.log('');
});
