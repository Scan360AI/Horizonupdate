# Setup PDF Service - Istruzioni Rapide

## 🚀 Avvio Locale (Richiesto per generare PDF)

Il sistema PDF ora usa **Puppeteer** per generare PDF di alta qualità invece di html2pdf.js.

### Step 1: Installa dipendenze

```bash
cd pdf-service
npm install
```

### Step 2: Avvia il servizio PDF

```bash
npm start
```

Vedrai questo output:
```
╔════════════════════════════════════════════╗
║   🚀 PDF Service - Puppeteer Server       ║
╚════════════════════════════════════════════╝

📡 Server running on http://localhost:3001
```

### Step 3: Avvia l'applicazione frontend

In un altro terminale:

```bash
cd /home/user/Horizonupdate
# Avvia il tuo server frontend (es. Live Server, http-server, etc.)
```

---

## ✨ Vantaggi Puppeteer vs html2pdf.js

| Caratteristica | html2pdf.js | Puppeteer |
|----------------|-------------|-----------|
| **Qualità** | Bassa (immagine sgranata) | ⭐ Alta (PDF nativo) |
| **Testo** | Non selezionabile | ⭐ Selezionabile |
| **Page breaks** | Problematici | ⭐ Perfetti |
| **Dimensione file** | Grande | ⭐ Ottimizzato |
| **Grafici** | Sgranati | ⭐ Nitidi |
| **Setup** | Browser only | Server Node.js |

---

## 🛠️ Troubleshooting

### Errore: "Servizio PDF non disponibile"

Il servizio Puppeteer non è avviato. Controlla:

1. Sei nella cartella `pdf-service`?
2. Hai fatto `npm install`?
3. Hai avviato `npm start`?
4. Il server gira su porta 3001? (controlla con `lsof -i :3001`)

### Errore: "EADDRINUSE" (porta occupata)

La porta 3001 è già in uso. Opzioni:

1. Chiudi l'altro processo sulla porta 3001
2. Cambia porta nel file `pdf-service/server.js` (linea 5) e `js/pdf-generator.js` (linea 10)

### Puppeteer non si installa

Su Linux potrebbe servire installare dipendenze Chrome:

```bash
# Ubuntu/Debian
sudo apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libasound2

# macOS
# Dovrebbe funzionare out-of-the-box
```

---

## 🔄 Modalità Sviluppo

Per auto-reload durante lo sviluppo:

```bash
cd pdf-service
npm run dev
```

Usa `nodemon` per riavviare automaticamente il server quando modifichi il codice.

---

## 📦 Deploy in Produzione (Opzionale)

### Opzione A: Netlify Functions

Vedi `pdf-service/netlify-function-example.js` (da creare se necessario)

### Opzione B: Servizio Separato

Deploy su Render.com, Railway.app, o Fly.io:

1. Push `pdf-service/` su repo Git
2. Crea nuovo servizio su piattaforma
3. Imposta `npm start` come comando
4. Aggiorna `js/pdf-generator.js` con URL produzione

---

## 🎯 Come Funziona

1. **Frontend** genera HTML completo del report
2. **Frontend** fa POST a `http://localhost:3001/generate-pdf` con l'HTML
3. **Puppeteer Service** apre browser headless e converte HTML → PDF
4. **Service** restituisce PDF binario
5. **Frontend** scarica il file PDF

---

Hai domande? Controlla `pdf-service/README.md` per dettagli completi.
