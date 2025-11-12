# Changelog - Bug Fixes

## Versione 1.4 (11 Novembre 2025) - LOGO PULITO

### 🎨 Logo Horizon - Solo Immagine

#### Modifiche Layout Sidebar ✅
- ✅ Rimosso testo "Financial Report" accanto al logo
- ✅ Rimosso "KITZANOS SOC COOP" sotto il logo
- ✅ Logo Horizon centrato e più grande (48px altezza, max 220px larghezza)
- ✅ Sidebar pulita con solo logo e menu navigazione
- ✅ Applicato a tutte le 6 pagine

**Risultato**: Logo Horizon Financial Monitor standalone in sidebar

---

## Versione 1.3 (11 Novembre 2025) - LOGO HORIZON INSTALLATO

### 🎨 Logo Aziendale Horizon Financial Monitor

#### Logo Reale Installato ✅
- ✅ Logo Horizon caricato e ottimizzato
- ✅ Versione sidebar: 200x120px (13KB)
- ✅ Versione header: 300x180px (22KB)
- ✅ Formato PNG con trasparenza
- ✅ Proporzioni 1.65:1 (orizzontale) mantenute
- ✅ CSS ottimizzato per logo non quadrato
- ✅ Integrato in tutte le 6 pagine

**File**:
- `assets/images/logo.png` - Sidebar (tutte le pagine)
- `assets/images/logo-large.png` - Header aziendale (Profilo Aziendale)

---

## Versione 1.2 (11 Novembre 2025)

### 🎨 Nuove Funzionalità

#### Logo Aziendale
- ✅ Aggiunta cartella `assets/images/` per il logo
- ✅ Logo placeholder SVG incluso (120x120px)
- ✅ Logo integrato in sidebar (tutte le pagine)
- ✅ Logo integrato nell'header aziendale (Profilo Aziendale)
- ✅ Documentazione completa per sostituire il logo
- **File**: `assets/images/README-LOGO.md`

### 🐛 Bug Corretti

#### 3. stato-patrimoniale.html - Calcolo DSCR
**Problema**: Dettaglio calcolo DSCR non visualizzato
- ❌ Cercava `dscrData.components`
- ✅ Corretto in `dscrData.values`
- **Causa**: Nome proprietà JSON errato
- **Effetto**: Ora mostra formula, valori, assunzioni e risultato completo

### 📐 Specifiche Logo

**Dimensioni Consigliate**:
- Formato: PNG con trasparenza (o SVG)
- Dimensioni: 120x120px (quadrato 1:1)
- Alternative: 150x150px o 200x200px
- Risoluzione: 144 DPI per Retina
- Peso: < 100 KB (ideale < 50 KB)

**Posizione File**:
```
assets/images/logo.png  (sostituire questo)
assets/images/logo.svg  (alternativa vettoriale)
```

---

## Versione 1.1 (11 Novembre 2025)

### 🐛 Bug Corretti

#### 1. stato-patrimoniale.html
**Problema**: Pagina non caricava i dati
- ❌ Cercava `report.data.detailedAnalysis` 
- ✅ Corretto in `report.data.noteTecniche`
- **Causa**: Nome chiave JSON errato
- **Effetto**: Ora carica correttamente bilancio e calcolo DSCR

#### 2. profilo-aziendale.html
**Problema**: Pagina non caricava i dati
- ❌ Doppio `forEach` per partecipazioni (linee 277-278)
- ✅ Rimosso duplicato
- **Causa**: Errore di sintassi JavaScript
- **Effetto**: Ora carica correttamente tutti i dati

### ✅ Verifiche Effettuate

- [x] Tutte le 6 pagine caricano correttamente
- [x] Tutti i dati JSON vengono visualizzati
- [x] Nessun errore nella console JavaScript
- [x] Path JSON corretto per fetch
- [x] Configurazione Netlify ottimizzata

### 📦 File Aggiornati

- `pages/stato-patrimoniale.html` - Fix riferimento dati + Fix DSCR
- `pages/profilo-aziendale.html` - Fix forEach duplicato

### 🚀 Deploy

Il pacchetto è ora pronto per il deploy su Netlify senza errori.
Tutti i dati si caricano correttamente su:
- ✅ Netlify
- ✅ Server locale (Python, Node, PHP, ecc.)

---

**Note**: Il file funziona perfettamente su server web. L'apertura diretta tramite `file://` non è supportata per motivi di sicurezza CORS del browser.
