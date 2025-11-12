# PDF Generation Service - Puppeteer

Servizio locale Node.js per generare PDF di alta qualità usando Puppeteer.

## Installazione

```bash
cd pdf-service
npm install
```

## Avvio

```bash
npm start
```

Oppure in modalità sviluppo (auto-reload):
```bash
npm run dev
```

Il server parte su `http://localhost:3001`

## Utilizzo

### Endpoint: POST /generate-pdf

Genera PDF da contenuto HTML.

**Request:**
```json
{
  "html": "<html>...</html>",
  "filename": "report.pdf",
  "options": {
    "format": "A4",
    "margin": {
      "top": "20mm",
      "right": "15mm",
      "bottom": "20mm",
      "left": "15mm"
    }
  }
}
```

**Response:** File PDF (binary)

### Endpoint: POST /generate-pdf-from-url

Genera PDF da URL.

**Request:**
```json
{
  "url": "https://example.com",
  "filename": "page.pdf",
  "options": {}
}
```

## Caratteristiche

- ✅ Qualità perfetta (PDF nativo browser)
- ✅ Testo selezionabile e vettoriale
- ✅ Supporto immagini base64 (grafici)
- ✅ Page breaks CSS rispettati
- ✅ Font personalizzati (Google Fonts, ecc.)
- ✅ Background colors e gradients
- ✅ Browser riutilizzato per performance

## Note

- Il browser Puppeteer viene avviato al primo utilizzo e mantenuto in memoria
- Timeout default: 30 secondi
- Limite payload: 50MB (per HTML con grafici base64)
