# Kitzanos Financial Report

Report finanziario interattivo multi-pagina in stile Stripe per Kitzanos Soc. Coop.

## 📁 Struttura del Progetto

```
financial-report/
├── index.html                  # Overview e Key Metrics
├── pages/
│   ├── analisi-economica.html  # Grafici e trend economici
│   ├── stato-patrimoniale.html # Bilancio dettagliato
│   └── profilo-aziendale.html  # Dati aziendali e partecipazioni
├── data/
│   └── kitzanos-data.json      # Dati finanziari (sorgente separata)
├── css/
│   └── styles.css              # Stili in stile Stripe
└── js/
    ├── main.js                 # Logica principale
    └── charts.js               # Gestione grafici Chart.js
```

## 🎨 Caratteristiche

### Design
- **Stile Stripe-inspired**: Design pulito, moderno e professionale
- **Responsive**: Ottimizzato per desktop, tablet e mobile
- **Navigazione laterale**: Menu fisso per accesso rapido alle sezioni
- **Animazioni sottili**: Transizioni fluide e hover effects
- **Color palette professionale**: Colori neutri con accenti blu/viola

### Pagine

#### 1. Overview (index.html)
- Indice di Rischio Kitzanos (IRP)
- 10 Key Metrics Cards con trend e benchmark
- Executive Summary (Punti di Forza / Aree di Attenzione)

#### 2. Analisi Economica
- Grafico Trend Economico (Ricavi, EBITDA, EBITDA %)
- Grafico Sostenibilità del Debito (PFN/EBITDA, D/E, DSCR)
- Grafico Capitale Circolante (DSO, DIO, DPO)
- Test di Stress - Impatto su DSCR
- Dettaglio Indicatori Economici

#### 3. Stato Patrimoniale
- Stato Patrimoniale completo (Attivo/Passivo)
- Conto Economico con trend Y2Y
- Calcolo dettagliato DSCR con formule e assunzioni

#### 4. Profilo Aziendale
- Dati anagrafici e legali
- Struttura aziendale
- Management e cariche sociali
- Indicatori finanziari principali
- Partecipazioni societarie

#### 5. Codice della Crisi
- 7 Indici di allerta secondo D.Lgs. 14/2019
- Status dettagliato per ogni indice
- Note interpretative normative
- Riferimenti normativi (CNDCEC, Art. 2086 c.c.)

#### 6. Profili di Rischio
- 5 Profili di valutazione (Equilibrio Patrimoniale, Finanziario, Economico, Sostenibilità Debito, Sviluppo)
- Grafico Radar benchmark settoriale
- Evoluzione rating nel tempo
- Outlook e raccomandazioni strategiche

## 🚀 Come Utilizzare

### Deploy su Netlify (RACCOMANDATO)

Il modo più semplice per usare il report:

1. **Drag & Drop su Netlify**
   - Vai su [netlify.com](https://netlify.com) e crea un account gratuito
   - Trascina l'intera cartella `financial-report` nell'area deploy
   - Ricevi un URL pubblico in ~30 secondi
   - ✅ Tutti i dati si caricheranno correttamente

2. **Consulta DEPLOY.md** per istruzioni dettagliate su:
   - Deploy automatico da Git
   - Custom domain
   - Aggiornamento dati
   - Troubleshooting

### Test Locale

⚠️ **IMPORTANTE**: Aprire direttamente `index.html` (file://) NON funzionerà per motivi di sicurezza CORS del browser.

**Usa un server locale:**

```bash
# Opzione 1: Python
cd financial-report
python3 -m http.server 8000
# Apri: http://localhost:8000

# Opzione 2: Node.js
npx serve

# Opzione 3: VS Code Live Server
# Installa l'estensione e click destro > Open with Live Server
```

### Aggiornamento Dati
1. Modificare solo il file `data/kitzanos-data.json`
2. Ricaricare su Netlify o fare push su Git
3. Il report si aggiornerà automaticamente

## 📊 Dipendenze Esterne

- **Chart.js 4.4.0**: Libreria per grafici (via CDN)
- **RemixIcon 3.5.0**: Set di icone (via CDN)

Entrambe caricate via CDN - nessuna installazione richiesta.

## 🎯 Compatibilità Browser

- Chrome/Edge: ✅ Pieno supporto
- Firefox: ✅ Pieno supporto
- Safari: ✅ Pieno supporto
- Mobile: ✅ Responsive design

## 📝 Note Tecniche

### Gestione Dati
- Caricamento asincrono da JSON
- Rendering dinamico delle card metrics
- Formattazione automatica numeri/valute/percentuali

### Grafici
- Chart.js con configurazione personalizzata
- Palette colori coordinata con il design
- Tooltips informativi
- Legende posizionate in alto

### Performance
- CSS ottimizzato con variabili
- JavaScript modulare
- Immagini e risorse minimizzate
- Caricamento veloce

## 🎨 Personalizzazione

### Logo Aziendale

Il report include un logo placeholder che puoi sostituire con il tuo:

**Posizione**: `assets/images/logo.png` o `logo.svg`

**Dimensioni consigliate**:
- Formato: PNG con trasparenza o SVG
- Dimensioni: 120x120px (quadrato 1:1)
- Alternative: 150x150px o 200x200px  
- Risoluzione: 144 DPI per Retina
- Peso: < 100 KB

📖 **Istruzioni complete**: Consulta `assets/images/README-LOGO.md`

### Colori
Modificare le variabili CSS in `css/styles.css`:
```css
:root {
  --primary: #635BFF;
  --success: #00D924;
  --warning: #FFB020;
  --danger: #DF1B41;
  /* ... */
}
```

### Grafici
Modificare configurazioni in `js/charts.js` per:
- Colori dataset
- Stili linee/barre
- Opzioni tooltips
- Scale e assi

---

**Versione**: 1.0  
**Data**: Novembre 2025  
**Sviluppato per**: Kitzanos Soc. Coop.
