# 🎨 Logo Aziendale

## 📁 Posizione File

Sostituisci il file placeholder con il tuo logo:
```
assets/images/logo.png
```

## 📐 Specifiche Tecniche

### Formato Consigliato
- **Formato**: PNG con sfondo trasparente
- **Alternativa**: SVG (vettoriale - migliore per qualità)

### Dimensioni Consigliate

#### Logo Principale (Sidebar)
- **Dimensioni**: 120x120 px (quadrato)
- **Dimensioni alternative**: 150x150 px o 200x200 px
- **Proporzioni**: 1:1 (quadrato) o al massimo 3:2 (orizzontale)
- **Risoluzione**: 144 DPI per schermi Retina
- **Peso file**: < 100 KB (preferibile < 50 KB)

#### Logo Header Azienda (Profilo Aziendale)
- **Dimensioni**: 120x120 px (quadrato)
- **Stesse specifiche del logo sidebar**

### Varianti Supportate

Il report supporta entrambi i formati:

1. **logo.png** - Per loghi raster (più comune)
2. **logo.svg** - Per loghi vettoriali (qualità perfetta a qualsiasi dimensione)

## 🎨 Linee Guida Design

### Colori
- Se possibile, usa una versione monocromatica o con pochi colori
- Ottimale: sfondo trasparente con logo in un colore principale
- Evita: troppi gradienti complessi (aumentano peso file)

### Contenuto
- **Simbolo/Icona**: Preferibile per spazi piccoli
- **Logo completo**: OK se leggibile a 120x120px
- **Solo testo**: Sconsigliato per dimensioni così piccole

### Esempi di Cosa Funziona Bene
✅ Simbolo aziendale semplice e riconoscibile
✅ Iniziali aziendali stilizzate
✅ Icona distintiva del brand
✅ Logo compatto e proporzionato

### Da Evitare
❌ Logo con testo lungo difficile da leggere
❌ Immagini fotografiche complesse
❌ File troppo pesanti (> 200 KB)

## 🔧 Come Sostituire il Logo

### Metodo 1: Nome File Identico (PIÙ SEMPLICE)
1. Rinomina il tuo logo in `logo.png`
2. Sostituisci il file in `assets/images/logo.png`
3. ✅ Fatto! Il logo apparirà automaticamente

### Metodo 2: Nome File Diverso
Se vuoi usare un nome diverso (es. `kitzanos-logo.png`):

1. Carica il file in `assets/images/`
2. Modifica questi file:

**index.html** (linea ~28):
```html
<!-- Cambia da: -->
<img src="assets/images/logo.png" alt="Logo">

<!-- A: -->
<img src="assets/images/kitzanos-logo.png" alt="Kitzanos Logo">
```

**Stessa modifica in tutte le pagine:**
- `pages/analisi-economica.html`
- `pages/stato-patrimoniale.html`
- `pages/profilo-aziendale.html`
- `pages/codice-crisi.html`
- `pages/profili-rischio.html`

## 🖼️ Formati Supportati

| Formato | Pro | Contro | Consigliato |
|---------|-----|--------|-------------|
| **PNG** | Trasparenza, universale | Peso file maggiore | ✅ Sì |
| **SVG** | Vettoriale, leggero | Complesso da creare | ✅ Ideale |
| **JPG** | Leggero | No trasparenza | ❌ No |
| **WebP** | Ottimo rapporto qualità/peso | Compatibilità | ⚠️ OK ma non necessario |

## 📱 Test del Logo

Dopo aver sostituito il logo, verifica che:
- [ ] Sia visibile nella sidebar (angolo in alto a sinistra)
- [ ] Sia visibile nella pagina Profilo Aziendale
- [ ] Sia nitido e leggibile
- [ ] Sfondo trasparente funzioni correttamente
- [ ] Dimensioni siano appropriate (né troppo grande né troppo piccolo)

## 🎯 Ottimizzazione File

### Per PNG
Usa tool come:
- [TinyPNG](https://tinypng.com/) - Online, gratuito
- [ImageOptim](https://imageoptim.com/) - Mac
- [PNGGauntlet](https://pnggauntlet.com/) - Windows

### Per SVG
Usa tool come:
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Online
- Esporta da Illustrator con opzioni ottimizzate

## 💡 Consigli Pratici

1. **Esporta a 2x**: Crea il logo a 240x240px e ridimensionalo via CSS per schermi Retina
2. **Testa su sfondo scuro/chiaro**: Verifica che il logo sia visibile su entrambi
3. **Mantieni proporzioni**: Non distorcere il logo, meglio lasciare spazio bianco
4. **Versione semplificata**: Per spazi piccoli usa versione senza dettagli minuti

## 📞 Supporto

Se hai problemi con il logo o le dimensioni non sono corrette, modifica il CSS in `css/styles.css` alla sezione `.logo img`.

---

**File Placeholder Incluso**: `logo.svg` (120x120px con gradiente blu/viola e lettera "K")  
**Pronto per essere sostituito** con il tuo logo aziendale!
