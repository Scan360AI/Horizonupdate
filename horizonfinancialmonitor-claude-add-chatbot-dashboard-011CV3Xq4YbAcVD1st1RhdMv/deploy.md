# 🚀 Deploy su Netlify - Guida Completa

## Metodo 1: Deploy tramite Drag & Drop (PIÙ SEMPLICE)

### Step by step:

1. **Vai su Netlify**
   - Apri [netlify.com](https://netlify.com)
   - Crea un account gratuito o fai login

2. **Deploy il sito**
   - Nella dashboard, trascina l'intera cartella `financial-report` nell'area "Want to deploy a new site without connecting to Git?"
   - OPPURE clicca su "Add new site" → "Deploy manually"
   - Trascina la cartella o selezionala

3. **Attendi il deploy**
   - Netlify caricherà tutti i file
   - Dopo ~30 secondi il sito sarà online
   - Riceverai un URL tipo: `https://random-name-123456.netlify.app`

4. **Personalizza l'URL (opzionale)**
   - Vai in "Site settings" → "Change site name"
   - Scegli un nome tipo: `kitzanos-financial-report`
   - L'URL diventerà: `https://kitzanos-financial-report.netlify.app`

5. **✅ FATTO!** Il sito è online e funzionante

---

## Metodo 2: Deploy tramite Git (PIÙ PROFESSIONALE)

### Prerequisiti:
- Account GitHub/GitLab/Bitbucket
- Git installato sul computer

### Step by step:

1. **Crea un repository Git**
   ```bash
   cd financial-report
   git init
   git add .
   git commit -m "Initial commit: Kitzanos Financial Report"
   ```

2. **Carica su GitHub**
   - Crea un nuovo repository su GitHub
   - Segui le istruzioni per il push:
   ```bash
   git remote add origin https://github.com/TUO-USERNAME/financial-report.git
   git branch -M main
   git push -u origin main
   ```

3. **Collega Netlify a GitHub**
   - Su Netlify, clicca "Add new site" → "Import an existing project"
   - Seleziona "GitHub"
   - Autorizza Netlify ad accedere ai tuoi repository
   - Seleziona il repository `financial-report`

4. **Configura il deploy**
   - Build command: (lascia vuoto)
   - Publish directory: `.` o `/`
   - Clicca "Deploy site"

5. **Deploy automatici**
   - Ogni push su GitHub triggerà un nuovo deploy automatico
   - Perfetto per aggiornamenti futuri dei dati

---

## Metodo 3: Netlify CLI (PER SVILUPPATORI)

### Installazione:
```bash
npm install -g netlify-cli
```

### Deploy:
```bash
cd financial-report
netlify deploy --prod
```

Segui le istruzioni per:
- Autenticarti con Netlify
- Creare un nuovo sito o usarne uno esistente
- Specificare la directory da pubblicare (`.`)

---

## 🔧 Configurazione Avanzata

Il file `netlify.toml` è già configurato con:
- ✅ Headers ottimizzati per performance
- ✅ Cache control per risorse statiche
- ✅ Headers di sicurezza
- ✅ Content-Type per JSON/CSS/JS

### Custom Domain (opzionale)
1. Vai in "Domain settings"
2. Clicca "Add custom domain"
3. Inserisci il tuo dominio (es: `report.kitzanos.com`)
4. Segui le istruzioni per configurare i DNS

### HTTPS
- ✅ Attivato automaticamente da Netlify
- ✅ Certificato SSL gratuito incluso

---

## 📱 Test Locale con Server

Se vuoi testare in locale PRIMA del deploy:

### Opzione A: Python
```bash
cd financial-report
python3 -m http.server 8000
```
Apri: http://localhost:8000

### Opzione B: Node.js (con npx)
```bash
cd financial-report
npx serve
```

### Opzione C: PHP
```bash
cd financial-report
php -S localhost:8000
```

### Opzione D: VS Code Live Server
- Installa l'estensione "Live Server"
- Click destro su `index.html` → "Open with Live Server"

---

## 🔄 Aggiornare i Dati

### Se hai fatto deploy con Drag & Drop:
1. Modifica `data/kitzanos-data.json` sul tuo computer
2. Vai su Netlify → "Deploys" → "Drag and drop"
3. Trascina di nuovo l'intera cartella

### Se hai fatto deploy con Git:
1. Modifica `data/kitzanos-data.json`
2. Commit e push:
   ```bash
   git add data/kitzanos-data.json
   git commit -m "Update financial data"
   git push
   ```
3. Netlify farà il deploy automaticamente

---

## 🐛 Troubleshooting

### "I dati non si caricano"
- ✅ Funziona su Netlify (server web)
- ❌ NON funziona con `file://` (apertura diretta)
- **Soluzione**: Usa un server locale o carica su Netlify

### "404 Not Found"
- Verifica che la struttura delle cartelle sia corretta
- Controlla che `data/kitzanos-data.json` esista
- Controlla la console del browser per errori

### "CORS Error"
- Non succede su Netlify
- Solo problema locale con `file://`
- **Soluzione**: Usa un server locale

---

## 📊 Analytics (opzionale)

Netlify include analytics gratuiti:
1. Vai in "Analytics"
2. Visualizza visite, performance, browser, dispositivi

---

## 💡 Risorse Utili

- [Documentazione Netlify](https://docs.netlify.com/)
- [Netlify Community](https://answers.netlify.com/)
- [Status Netlify](https://www.netlifystatus.com/)

---

**Supporto**: Per problemi specifici di Netlify, consulta la [documentazione ufficiale](https://docs.netlify.com/) o il [forum della community](https://answers.netlify.com/).
