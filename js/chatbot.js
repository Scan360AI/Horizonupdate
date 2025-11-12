/**
 * Financial Chatbot con Gemini 2.5 Flash
 * Analizza i dati finanziari da kitzanos-data.json e risponde a domande
 */

class FinancialChatbot {
  constructor() {
    this.apiKey = null;
    this.financialData = null;
    this.conversationHistory = [];
    this.isOpen = false;
    this.isLoading = false;
    this.waitingForNoteSpec = false;

    // Elementi UI
    this.chatWidget = null;
    this.chatWindow = null;
    this.messagesContainer = null;
    this.inputField = null;

    this.init();
  }

  async init() {
    // Carica i dati finanziari
    await this.loadFinancialData();

    // Crea l'interfaccia UI
    this.createUI();

    // Bind degli eventi
    this.bindEvents();

    // Mostra messaggio di benvenuto
    this.addMessage(
      'bot',
      'Ciao! 👋 Sono l\'assistente AI per l\'analisi finanziaria di BFLOWS S.R.L. Posso rispondere a domande sull\'andamento dell\'azienda, analizzare i dati di bilancio ed esplorare scenari futuri. Come posso aiutarti?'
    );
  }

  async loadFinancialData() {
    try {
      const response = await fetch('/data/kitzanos-data.json');
      this.financialData = await response.json();
      console.log('✅ Dati finanziari caricati:', this.financialData);
    } catch (error) {
      console.error('❌ Errore nel caricamento dei dati:', error);
      this.financialData = null;
    }
  }

  createUI() {
    // Widget floating button
    this.chatWidget = document.createElement('div');
    this.chatWidget.id = 'chatbot-widget';
    this.chatWidget.className = 'chatbot-widget';
    this.chatWidget.innerHTML = `
      <button class="chatbot-toggle" aria-label="Apri assistente AI">
        <i class="ri-robot-2-line"></i>
      </button>
    `;

    // Finestra chat
    this.chatWindow = document.createElement('div');
    this.chatWindow.id = 'chatbot-window';
    this.chatWindow.className = 'chatbot-window';
    this.chatWindow.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <i class="ri-robot-2-fill"></i>
          <div>
            <h3>Assistente Finanziario AI</h3>
            <p class="chatbot-status">
              <span class="status-dot"></span>
              Gemini 2.5 Flash
            </p>
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button class="chatbot-fullscreen" aria-label="Toggle fullscreen">
            <i class="ri-fullscreen-line"></i>
          </button>
          <button class="chatbot-close" aria-label="Chiudi chat">
            <i class="ri-close-line"></i>
          </button>
        </div>
      </div>

      <div class="chatbot-messages" id="chatbot-messages">
        <!-- Messaggi verranno inseriti qui -->
      </div>

      <div class="chatbot-input-container">
        <div class="chatbot-api-key-setup" id="api-key-setup">
          <p class="api-key-notice">
            <i class="ri-key-2-line"></i>
            Inserisci la tua API key di Gemini (gratuita)
          </p>
          <div class="api-key-input-group">
            <input
              type="password"
              id="gemini-api-key-input"
              placeholder="AIzaSy..."
              class="api-key-input"
            />
            <button id="save-api-key-btn" class="btn-save-key">
              <i class="ri-check-line"></i> Salva
            </button>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            class="api-key-link"
          >
            <i class="ri-external-link-line"></i>
            Ottieni una API key gratuita
          </a>
        </div>

        <div id="chat-controls" style="display: none;">
          <div class="chatbot-pdf-actions">
            <button id="btn-generate-note" class="btn-pdf">
              <i class="ri-file-edit-line"></i>
              Genera Nota
            </button>
            <button id="btn-generate-report" class="btn-pdf secondary">
              <i class="ri-file-chart-line"></i>
              Report Completo
            </button>
          </div>

          <div class="chatbot-input">
            <input
              type="text"
              id="chatbot-input-field"
              placeholder="Chiedi qualcosa sui dati finanziari..."
              autocomplete="off"
            />
            <button id="chatbot-send-btn" class="btn-send" aria-label="Invia messaggio">
              <i class="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Aggiungi al DOM
    document.body.appendChild(this.chatWidget);
    document.body.appendChild(this.chatWindow);

    // Riferimenti agli elementi
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.inputField = document.getElementById('chatbot-input-field');

    // Carica API key dal localStorage
    this.loadApiKey();
  }

  bindEvents() {
    // Toggle chat window
    const toggleBtn = this.chatWidget.querySelector('.chatbot-toggle');
    toggleBtn.addEventListener('click', () => this.toggleChat());

    // Fullscreen button
    const fullscreenBtn = this.chatWindow.querySelector('.chatbot-fullscreen');
    fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    // Close button
    const closeBtn = this.chatWindow.querySelector('.chatbot-close');
    closeBtn.addEventListener('click', () => this.toggleChat());

    // Save API key
    const saveKeyBtn = document.getElementById('save-api-key-btn');
    saveKeyBtn.addEventListener('click', () => this.saveApiKey());

    // Send message
    const sendBtn = document.getElementById('chatbot-send-btn');
    sendBtn.addEventListener('click', () => this.sendMessage());

    // Enter key per inviare
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // API key input - Enter per salvare
    const apiKeyInput = document.getElementById('gemini-api-key-input');
    apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.saveApiKey();
      }
    });

    // PDF buttons
    const generateNoteBtn = document.getElementById('btn-generate-note');
    generateNoteBtn?.addEventListener('click', () => this.initiateNoteGeneration());

    const generateReportBtn = document.getElementById('btn-generate-report');
    generateReportBtn?.addEventListener('click', () => this.generateFullReport());
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.chatWindow.classList.add('open');
      this.chatWidget.classList.add('hidden');
      this.inputField?.focus();
    } else {
      this.chatWindow.classList.remove('open');
      this.chatWidget.classList.remove('hidden');
    }
  }

  toggleFullscreen() {
    const isFullscreen = this.chatWindow.classList.toggle('fullscreen');
    const fullscreenBtn = this.chatWindow.querySelector('.chatbot-fullscreen i');

    // Cambia icona
    if (isFullscreen) {
      fullscreenBtn.className = 'ri-fullscreen-exit-line';
    } else {
      fullscreenBtn.className = 'ri-fullscreen-line';
    }
  }

  loadApiKey() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
      this.showChatInput();
    }
  }

  saveApiKey() {
    const apiKeyInput = document.getElementById('gemini-api-key-input');
    const key = apiKeyInput.value.trim();

    if (!key) {
      alert('Per favore inserisci una API key valida');
      return;
    }

    if (!key.startsWith('AIzaSy')) {
      alert('La API key di Gemini dovrebbe iniziare con "AIzaSy"');
      return;
    }

    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);

    this.showChatInput();
    this.addMessage('bot', 'API key salvata! ✅ Ora puoi farmi domande sui dati finanziari.');
  }

  showChatInput() {
    document.getElementById('api-key-setup').style.display = 'none';
    document.getElementById('chat-controls').style.display = 'block';
    this.inputField?.focus();
  }

  async sendMessage() {
    if (this.isLoading) return;

    const message = this.inputField.value.trim();
    if (!message) return;

    // Aggiungi messaggio utente
    this.addMessage('user', message);
    this.inputField.value = '';

    // Mostra loading
    this.isLoading = true;
    const loadingId = this.addMessage('bot', '<div class="typing-indicator"><span></span><span></span><span></span></div>');

    try {
      // Chiamata a Gemini API
      const response = await this.callGeminiAPI(message);

      // Rimuovi loading
      this.removeMessage(loadingId);

      // Aggiungi risposta
      this.addMessage('bot', response);

      // Se stiamo aspettando spec per nota, genera il PDF
      if (this.waitingForNoteSpec) {
        this.waitingForNoteSpec = false;
        await this.generateNoteFromConversation(message, response);
      }

    } catch (error) {
      console.error('Errore Gemini API:', error);

      // Rimuovi loading
      this.removeMessage(loadingId);

      // Mostra errore
      let errorMessage = '❌ Si è verificato un errore. ';

      if (error.message.includes('API key')) {
        errorMessage += 'Verifica che la tua API key sia corretta.';
      } else if (error.message.includes('429')) {
        errorMessage += 'Hai raggiunto il limite di richieste. Riprova tra qualche minuto.';
      } else if (error.message.includes('quota')) {
        errorMessage += 'Quota API esaurita. Riprova domani o verifica i tuoi limiti su Google AI Studio.';
      } else {
        errorMessage += error.message;
      }

      this.addMessage('bot', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async callGeminiAPI(userMessage) {
    if (!this.apiKey) {
      throw new Error('API key non configurata');
    }

    // Costruisci il system prompt con i dati finanziari
    const systemPrompt = this.buildSystemPrompt();

    // Aggiungi il messaggio alla history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // Prepara il payload per Gemini
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        ...this.conversationHistory
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Chiamata API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Estrai la risposta
    const botResponse = data.candidates[0]?.content?.parts[0]?.text;

    if (!botResponse) {
      throw new Error('Risposta vuota da Gemini API');
    }

    // Aggiungi risposta alla history
    this.conversationHistory.push({
      role: 'model',
      parts: [{ text: botResponse }]
    });

    return botResponse;
  }

  buildSystemPrompt() {
    if (!this.financialData) {
      return 'Sei un assistente AI per analisi finanziarie. I dati non sono disponibili al momento.';
    }

    const data = this.financialData;

    return `Sei un assistente AI esperto in analisi finanziaria che lavora per BFLOWS S.R.L.

Il tuo compito è:
1. Rispondere a domande sull'andamento finanziario dell'azienda
2. Analizzare i dati di bilancio e fornire insights
3. Esplorare scenari "what-if" (es. "cosa succede se i ricavi calano del 20%?")
4. Fornire raccomandazioni basate sui dati

DATI AZIENDALI COMPLETI:

## Informazioni Generali
- Nome: ${data.company.name}
- Settore: ${data.company.ateco}
- Fondata: ${data.company.foundedDate}
- Dipendenti: ${data.company.employees.current}
- Capitale Sociale: €${data.company.capitaleSociale.toLocaleString('it-IT')}

## Risk Assessment
- Indice di Rischio: ${data.riskAssessment.score}/100
- Categoria: ${data.riskAssessment.category} (${data.riskAssessment.categoryLabel})
- Rating: ${data.riskAssessment.rating} (precedente: ${data.riskAssessment.previousRating})
- Descrizione: ${data.riskAssessment.description}

## Dati Finanziari 2024
- Ricavi: €${data.keyMetrics.find(m => m.id === 'revenues')?.value || 'N/D'} (${data.keyMetrics.find(m => m.id === 'revenues')?.trend?.value}% vs 2023)
- EBITDA: €${data.financialData.stats.find(s => s.id === 'ebitda')?.value || 'N/D'} (${data.financialData.stats.find(s => s.id === 'ebitda')?.trend?.value} vs 2023)
- EBITDA Margin: ${data.keyMetrics.find(m => m.id === 'ebitda-margin')?.value || 'N/D'}
- Utile Netto: €${data.financialData.stats.find(s => s.id === 'utile')?.value || 'N/D'} (${data.financialData.stats.find(s => s.id === 'utile')?.trend?.value} vs 2023)
- Cash Flow Operativo: ${data.keyMetrics.find(m => m.id === 'cash-flow')?.value || 'N/D'}

## Stato Patrimoniale
- Patrimonio Netto: €${data.financialData.stats.find(s => s.id === 'patrimonio')?.value || 'N/D'}
- Totale Attivo: €${data.noteTecniche[1]?.statoPatrimoniale?.attivo?.totaleAttivo?.['2024'] || 'N/D'}
- Totale Debiti: €${data.noteTecniche[1]?.statoPatrimoniale?.passivo?.totaleDebiti?.['2024'] || 'N/D'}
- Disponibilità Liquide: €${data.noteTecniche[1]?.statoPatrimoniale?.attivo?.circolante?.find(c => c.voce === 'Disponibilità liquide')?.['2024'] || 'N/D'}

## Indicatori Finanziari
- ROE: ${data.financialData.stats.find(s => s.id === 'roe')?.value || 'N/D'}
- ROI: ${data.financialData.stats.find(s => s.id === 'roi')?.value || 'N/D'}
- ROS: ${data.financialData.stats.find(s => s.id === 'ros')?.value || 'N/D'}
- Liquidità Corrente: ${data.keyMetrics.find(m => m.id === 'liquidity')?.value || 'N/D'}
- Leverage: ${data.financialData.stats.find(s => s.id === 'leverage')?.value || 'N/D'}
- DSCR: ${data.keyMetrics.find(m => m.id === 'dscr')?.value || 'N/D'}
- DSO (Giorni Incasso Clienti): ${data.keyMetrics.find(m => m.id === 'dso')?.value || 'N/D'}

## Profili di Rischio (scala 1-5)
${data.profiles.map(p => `- ${p.name}: ${p.score}/5 (${p.evaluation})`).join('\n')}

## Punti di Forza
${data.executiveSummary.strengths.map(s => `- ${s}`).join('\n')}

## Criticità
${data.executiveSummary.weaknesses.map(w => `- ${w}`).join('\n')}

## Indici Codice della Crisi
Status: ${data.codiceCrisi.status.overall} (${data.codiceCrisi.status.indiciOk} OK, ${data.codiceCrisi.status.indiciAllerta} in allerta)
${data.codiceCrisi.indices.map(i => `- ${i.name}: ${i.value} (${i.status})`).join('\n')}

## Raccomandazioni
${data.outlook.raccomandazioni.map(r => `- ${r}`).join('\n')}

## Outlook
${data.outlook.outlook}

---

ISTRUZIONI PER LE RISPOSTE:
1. Usa sempre i dati sopra riportati per rispondere
2. Formatta le risposte in modo chiaro e leggibile (usa emoji dove appropriato)
3. Per scenari "what-if", calcola gli impatti sui vari indicatori
4. Sii professionale ma amichevole
5. Se una domanda non riguarda i dati disponibili, spiegalo gentilmente
6. Rispondi SEMPRE in italiano
7. Usa formattazione markdown per tabelle e liste quando utile
8. Evidenzia i numeri importanti e i trend
9. Fornisci sempre contesto e interpretazione, non solo numeri secchi

Esempio di risposta ben strutturata:
"📊 Analisi della situazione finanziaria:

**Ricavi 2024**: €197.250 ⬆️ +839% vs 2023
Ottima crescita, ma...

**EBITDA**: -€98.912 (NEGATIVO)
⚠️ L'azienda non sta ancora generando profitto operativo nonostante la crescita dei ricavi.

[... continua con analisi dettagliata ...]"
`;
  }

  addMessage(sender, text) {
    const messageId = `msg-${Date.now()}-${Math.random()}`;
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `chatbot-message ${sender}`;

    if (sender === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="ri-robot-2-fill"></i>
        </div>
        <div class="message-content">${this.parseMarkdown(text)}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">${this.escapeHtml(text)}</div>
        <div class="message-avatar">
          <i class="ri-user-3-fill"></i>
        </div>
      `;
    }

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();

    return messageId;
  }

  removeMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
      message.remove();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }

  // ============================================
  // PDF GENERATION METHODS
  // ============================================

  async initiateNoteGeneration() {
    if (!this.apiKey) {
      alert('Configura prima la tua API key di Gemini');
      return;
    }

    // Chiedi all'utente che tipo di nota vuole
    this.addMessage(
      'bot',
      '📝 **Generazione Nota Personalizzata**\n\nChe tipo di nota vuoi generare? Puoi specificare:\n\n• **Tema specifico** (es. "Analisi della liquidità")\n• **Scenario** (es. "Impatto di un calo ricavi del 15%")\n• **Focus su un indicatore** (es. "Approfondimento sul DSCR")\n• **Raccomandazioni** (es. "Piano per migliorare il cash flow")\n\nDescrivimi cosa ti serve e genererò una nota dettagliata scaricabile in PDF.'
    );

    // Imposta flag per la prossima risposta dell'utente
    this.waitingForNoteSpec = true;
  }

  async generateNoteFromConversation(userSpec, botResponse) {
    try {
      // Mostra feedback utente
      this.addMessage('bot', '📝 **Generazione nota strutturata in corso...**\n\nSto creando una nota professionale multi-capitolo. Questo richiederà qualche secondo...');

      // Step 1: Genera indice
      this.addMessage('bot', '🔍 **Step 1/3:** Creazione indice della nota...');

      const indexPrompt = `Basandoti sulla richiesta dell'utente "${userSpec}" e sui dati finanziari di BFLOWS S.R.L., crea un indice strutturato per una nota professionale.

L'indice deve avere 4-5 sezioni logiche e progressive. Rispondi SOLO con l'indice in questo formato:

1. Titolo Prima Sezione
2. Titolo Seconda Sezione
3. Titolo Terza Sezione
4. Titolo Quarta Sezione
5. Titolo Quinta Sezione (opzionale)

Esempio per "analisi liquidità":
1. Situazione Attuale della Liquidità
2. Analisi dei Flussi di Cassa
3. Confronto con il Settore
4. Criticità e Rischi
5. Raccomandazioni Operative`;

      let indexResponse;
      try {
        indexResponse = await this.callGeminiAPI(indexPrompt);
        console.log('📋 Indice generato:', indexResponse);
      } catch (apiError) {
        console.error('❌ Errore chiamata API per indice:', apiError);
        throw new Error(`Errore API nella generazione dell'indice: ${apiError.message}`);
      }

      if (!indexResponse || typeof indexResponse !== 'string') {
        console.error('❌ Risposta API invalida:', indexResponse);
        throw new Error('Risposta API non valida per la generazione dell\'indice');
      }

      const indexLines = indexResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.match(/^\d+\./));

      console.log('📑 Righe indice estratte:', indexLines);

      if (indexLines.length === 0) {
        throw new Error('L\'AI non ha generato un indice valido. Riprova con una richiesta più specifica.');
      }

      // Step 2: Sviluppa ogni capitolo
      this.addMessage('bot', `✅ Indice creato con ${indexLines.length} sezioni\n\n📖 **Step 2/3:** Sviluppo capitoli...`);

      let fullContent = '';
      const noteTitle = this.extractNoteTitleFromSpec(userSpec);

      for (let i = 0; i < indexLines.length; i++) {
        const chapterTitle = indexLines[i].replace(/^\d+\.\s*/, '').trim();

        if (!chapterTitle) {
          console.warn(`⚠️ Capitolo ${i+1} ha titolo vuoto, skip`);
          continue;
        }

        // Feedback progresso
        this.addMessage('bot', `⏳ Sviluppo capitolo ${i+1}/${indexLines.length}: *${chapterTitle}*`);

        const chapterPrompt = `Sviluppa il seguente capitolo per una nota finanziaria professionale su BFLOWS S.R.L.

**Capitolo:** ${chapterTitle}
**Contesto:** ${userSpec}
**Azienda:** BFLOWS S.R.L. - Settore IT, Ricavi €197.250 (+839% vs 2023), EBITDA negativo -€98.912, Rating C1

Scrivi 2-4 paragrafi dettagliati per questo capitolo. Usa:
- **Grassetti** per evidenziare dati importanti
- Liste puntate per enumerare punti chiave
- Riferimenti specifici ai dati finanziari
- Linguaggio professionale ma chiaro

Usa formato Markdown (##, **, -, ecc.)`;

        let chapterContent;
        try {
          chapterContent = await this.callGeminiAPI(chapterPrompt);
          chapterContent = this.cleanAIResponse(chapterContent); // Pulizia frasi introduttive
          console.log(`✅ Capitolo ${i+1} generato (${chapterContent.length} caratteri)`);
        } catch (chapterError) {
          console.error(`❌ Errore generazione capitolo ${i+1}:`, chapterError);
          chapterContent = `*Errore nella generazione di questo capitolo: ${chapterError.message}*`;
        }

        // Assembla contenuto
        fullContent += `\n\n## ${chapterTitle}\n\n${chapterContent}\n`;

        // Piccola pausa per evitare rate limit
        if (i < indexLines.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (!fullContent || fullContent.trim().length === 0) {
        throw new Error('Nessun contenuto generato per la nota');
      }

      // Step 3: Genera grafici e PDF
      this.addMessage('bot', '📊 **Step 3/4:** Generazione grafici...');
      const chartImages = await this.generateChartImages();

      this.addMessage('bot', '📄 **Step 4/4:** Generazione PDF...');

      const pdfGen = new PDFGenerator(this.financialData);
      await pdfGen.generateCustomNote(fullContent, noteTitle, chartImages);

      this.addMessage('bot', `✅ **Nota completata con successo!**\n\nLa nota "${noteTitle}" è stata generata con ${indexLines.length} capitoli sviluppati e scaricata in formato PDF.`);

    } catch (error) {
      console.error('❌ Errore completo generazione nota:', error);
      console.error('Stack trace:', error.stack);
      this.addMessage('bot', `❌ **Errore durante la generazione della nota**\n\n${error.message}\n\n💡 Suggerimento: Prova a:\n- Richiedere una nota più semplice\n- Verificare la connessione internet\n- Controllare la console del browser (F12) per dettagli`);
    }
  }

  async generateFullReport() {
    if (!this.financialData) {
      alert('Dati finanziari non disponibili');
      return;
    }

    if (!this.apiKey) {
      alert('Configura prima la tua API key di Gemini per generare report AI-powered');
      return;
    }

    try {
      // Mostra feedback iniziale
      this.addMessage('bot', '📊 **Generazione Report Completo AI-Powered in corso...**\n\nSto creando un report finanziario professionale completo con analisi approfondita. Questo richiederà 1-2 minuti...');

      // Indice predefinito (8 sezioni standard)
      const predefinedIndex = [
        'Executive Summary',
        'Profilo Aziendale',
        'Analisi Economica',
        'Stato Patrimoniale',
        'Indicatori Finanziari',
        'Risk Assessment',
        'Codice della Crisi',
        'Raccomandazioni Strategiche'
      ];

      this.addMessage('bot', `📑 **Indice Report:** ${predefinedIndex.length} sezioni predefinite\n\n📖 Sviluppo contenuti...`);

      let fullContent = '';
      const reportTitle = `Report Finanziario Completo - ${this.financialData.company.name}`;

      // Sviluppa ogni sezione con AI
      for (let i = 0; i < predefinedIndex.length; i++) {
        const sectionTitle = predefinedIndex[i];

        // Feedback progresso
        this.addMessage('bot', `⏳ Sviluppo sezione ${i+1}/${predefinedIndex.length}: *${sectionTitle}*`);

        // Prompt specifico per ogni sezione
        const sectionPrompt = this.buildSectionPrompt(sectionTitle);

        let sectionContent;
        try {
          sectionContent = await this.callGeminiAPI(sectionPrompt);
          sectionContent = this.cleanAIResponse(sectionContent); // Pulizia frasi introduttive
          console.log(`✅ Sezione ${i+1} generata: ${sectionTitle} (${sectionContent.length} caratteri)`);
        } catch (sectionError) {
          console.error(`❌ Errore generazione sezione ${i+1}:`, sectionError);
          sectionContent = `*Errore nella generazione di questa sezione: ${sectionError.message}*`;
        }

        // Assembla contenuto
        fullContent += `\n\n## ${sectionTitle}\n\n${sectionContent}\n`;

        // Pausa per rate limiting (tranne all'ultima iterazione)
        if (i < predefinedIndex.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (!fullContent || fullContent.trim().length === 0) {
        throw new Error('Nessun contenuto generato per il report');
      }

      // Genera grafici
      this.addMessage('bot', '📊 **Generazione grafici...**');
      const chartImages = await this.generateChartImages();

      // Genera PDF
      this.addMessage('bot', '📄 **Generazione PDF finale...**');

      const pdfGen = new PDFGenerator(this.financialData);
      await pdfGen.generateProfessionalReport(fullContent, chartImages);

      this.addMessage('bot', `✅ **Report Completo generato con successo!**\n\nIl report AI-powered "${reportTitle}" è stato scaricato con ${predefinedIndex.length} sezioni complete:\n\n${predefinedIndex.map((s, i) => `${i+1}. ${s}`).join('\n')}`);

    } catch (error) {
      console.error('❌ Errore completo generazione report:', error);
      console.error('Stack trace:', error.stack);
      this.addMessage('bot', `❌ **Errore durante la generazione del report**\n\n${error.message}\n\n💡 Suggerimento: Prova a:\n- Verificare la connessione internet\n- Controllare la console del browser (F12) per dettagli\n- Riprovare tra qualche secondo`);
    }
  }

  cleanAIResponse(text) {
    // Rimuove frasi introduttive comuni dall'AI
    const introPatterns = [
      /^Certamente[!.]?\s*/i,
      /^Ecco\s+(la\s+sezione|il\s+capitolo|l'analisi)[^.!?]*[.!?]\s*/i,
      /^Analizziamo\s+[^.!?]*[.!?]\s*/i,
      /^Vediamo\s+[^.!?]*[.!?]\s*/i,
      /^Iniziamo\s+[^.!?]*[.!?]\s*/i,
      /^Procediamo\s+[^.!?]*[.!?]\s*/i,
      /^Perfetto[!.]?\s*/i,
      /^Bene[!.]?\s*/i,
      /^Ok[!.]?\s*/i,
      /^Certo[!.]?\s*/i,
      /^Assolutamente[!.]?\s*/i
    ];

    let cleaned = text.trim();

    // Applica tutti i pattern
    for (const pattern of introPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    // Rimuove riferimenti al titolo della sezione all'inizio
    cleaned = cleaned.replace(/^(La sezione|Il capitolo|Questa sezione)\s+"[^"]+"\s+(analizza|descrive|presenta|illustra)[^.!?]*[.!?]\s*/i, '');

    return cleaned.trim();
  }

  buildSectionPrompt(sectionTitle) {
    const data = this.financialData;

    // Prompt base comune
    const baseInstructions = `Scrivi una sezione professionale e dettagliata per un report finanziario.

**Azienda:** ${data.company.name}
**Settore:** ${data.company.ateco}
**Data Report:** ${data.reportInfo.date}

Usa formato Markdown con:
- **Grassetti** per dati chiave
- Liste puntate per enumerare elementi
- Tabelle markdown per dati comparativi (es: | Anno | Valore | Trend |)
- Linguaggio professionale ma chiaro
- Riferimenti specifici ai dati forniti

IMPORTANTE:
- NON includere frasi introduttive come "Certamente", "Ecco", "Analizziamo", etc.
- Inizia DIRETTAMENTE con il contenuto della sezione
- NON ripetere il titolo della sezione nel testo
- Scrivi 3-5 paragrafi ben strutturati`;

    // Prompt specifici per ogni sezione
    switch(sectionTitle) {
      case 'Executive Summary':
        return `${baseInstructions}

**Sezione:** Executive Summary

Fornisci una sintesi esecutiva del report con:
- Snapshot della situazione finanziaria attuale (Ricavi €${data.keyMetrics.find(m => m.id === 'revenues')?.value}, EBITDA, Rating ${data.riskAssessment.rating})
- Principali punti di forza (es: ${data.executiveSummary.strengths[0]})
- Criticità principali (es: ${data.executiveSummary.weaknesses[0]})
- Valutazione rischio complessivo (Score ${data.riskAssessment.score}/100)
- Outlook e direzione aziendale`;

      case 'Profilo Aziendale':
        return `${baseInstructions}

**Sezione:** Profilo Aziendale

Descrivi il profilo dell'azienda includendo:
- Dati anagrafici: fondata ${data.company.foundedDate}, ${data.company.employees.current} dipendenti
- Capitale sociale: €${data.company.capitaleSociale.toLocaleString('it-IT')}
- Settore di attività: ${data.company.ateco}
- Storia e crescita (dipendenti: ${data.company.employees.previous} → ${data.company.employees.current})
- Posizionamento di mercato`;

      case 'Analisi Economica':
        return `${baseInstructions}

**Sezione:** Analisi Economica

Analizza la performance economica:
- Ricavi 2024: ${data.keyMetrics.find(m => m.id === 'revenues')?.value} (trend: ${data.keyMetrics.find(m => m.id === 'revenues')?.trend?.value}%)
- EBITDA: ${data.financialData.stats.find(s => s.id === 'ebitda')?.value} (Margin: ${data.keyMetrics.find(m => m.id === 'ebitda-margin')?.value})
- Utile Netto: ${data.financialData.stats.find(s => s.id === 'utile')?.value}
- Trend evolutivi e confronti anno su anno
- Analisi della marginalità e redditività`;

      case 'Stato Patrimoniale':
        return `${baseInstructions}

**Sezione:** Stato Patrimoniale

Analizza la struttura patrimoniale:
- Patrimonio Netto: ${data.financialData.stats.find(s => s.id === 'patrimonio')?.value}
- Totale Attivo e composizione
- Disponibilità liquide e attivo circolante
- Struttura del passivo e indebitamento
- Solidità patrimoniale`;

      case 'Indicatori Finanziari':
        return `${baseInstructions}

**Sezione:** Indicatori Finanziari

Analizza i principali indicatori:
- ROE: ${data.financialData.stats.find(s => s.id === 'roe')?.value}
- ROI: ${data.financialData.stats.find(s => s.id === 'roi')?.value}
- ROS: ${data.financialData.stats.find(s => s.id === 'ros')?.value}
- Liquidità Corrente: ${data.keyMetrics.find(m => m.id === 'liquidity')?.value}
- DSCR: ${data.keyMetrics.find(m => m.id === 'dscr')?.value}
- DSO: ${data.keyMetrics.find(m => m.id === 'dso')?.value} giorni
- Interpretazione e benchmark di settore`;

      case 'Risk Assessment':
        return `${baseInstructions}

**Sezione:** Risk Assessment

Valuta il profilo di rischio:
- Indice di Rischio Ponderato: ${data.riskAssessment.score}/100
- Rating: ${data.riskAssessment.rating} (categoria ${data.riskAssessment.categoryLabel})
- Profili di rischio dettagliati: ${data.profiles.map(p => `${p.name} (${p.score}/5)`).join(', ')}
- Fattori di rischio principali
- Mitiganti e elementi positivi`;

      case 'Codice della Crisi':
        return `${baseInstructions}

**Sezione:** Codice della Crisi

Analizza gli indici del Codice della Crisi d'Impresa:
- Status generale: ${data.codiceCrisi.status.overall} (${data.codiceCrisi.status.indiciOk} OK, ${data.codiceCrisi.status.indiciAllerta} in allerta)
- Indici analizzati: ${data.codiceCrisi.indices.map(i => `${i.name}: ${i.value} (${i.status})`).join('; ')}
- Conformità normativa
- Aree di attenzione e monitoraggio`;

      case 'Raccomandazioni Strategiche':
        return `${baseInstructions}

**Sezione:** Raccomandazioni Strategiche

Fornisci raccomandazioni concrete:
- Raccomandazioni principali: ${data.outlook.raccomandazioni.join('; ')}
- Outlook: ${data.outlook.outlook}
- Azioni prioritarie nel breve termine (3-6 mesi)
- Strategie di medio termine (1-2 anni)
- KPI da monitorare costantemente`;

      default:
        return `${baseInstructions}

**Sezione:** ${sectionTitle}

Sviluppa questa sezione in modo professionale e dettagliato basandoti sui dati finanziari disponibili.`;
    }
  }

  extractNoteTitleFromSpec(spec) {
    // Estrai titolo intelligente dalla richiesta
    spec = spec.toLowerCase();

    if (spec.includes('liquidità') || spec.includes('cash')) {
      return 'Analisi della Liquidità';
    }
    if (spec.includes('debito') || spec.includes('dscr')) {
      return 'Analisi della Sostenibilità del Debito';
    }
    if (spec.includes('rischio') || spec.includes('rating')) {
      return 'Valutazione del Rischio';
    }
    if (spec.includes('scenario') || spec.includes('previsione')) {
      return 'Analisi di Scenario';
    }
    if (spec.includes('raccomandazioni') || spec.includes('miglioramento')) {
      return 'Raccomandazioni Strategiche';
    }

    // Default
    return 'Nota Finanziaria';
  }

  async generateChartImages() {
    // Genera grafici come Base64 per inserirli nei PDF
    if (!this.financialData || !this.financialData.charts) {
      console.warn('⚠️ Dati grafici non disponibili');
      return null;
    }

    const charts = {};

    try {
      // 1. Economic Trend Chart (Ricavi/EBITDA)
      if (this.financialData.charts.economicTrend) {
        charts.economicTrend = await this.createChartImage('line', this.financialData.charts.economicTrend, 600, 350);
      }

      // 2. Debt Sustainability Chart
      if (this.financialData.charts.debtSustainability) {
        charts.debtSustainability = await this.createChartImage('bar', this.financialData.charts.debtSustainability, 600, 300);
      }

      // 3. Working Capital Chart
      if (this.financialData.charts.workingCapital) {
        charts.workingCapital = await this.createChartImage('bar', this.financialData.charts.workingCapital, 600, 300);
      }

      // 4. Stress Test Chart
      if (this.financialData.charts.stressTest) {
        charts.stressTest = await this.createChartImage('line', this.financialData.charts.stressTest, 600, 300);
      }

      // 5. Benchmark Radar Chart
      if (this.financialData.charts.benchmarkRadar) {
        charts.benchmarkRadar = await this.createChartImage('radar', this.financialData.charts.benchmarkRadar, 400, 400);
      }

      console.log('📊 Grafici generati:', Object.keys(charts));
      return charts;

    } catch (error) {
      console.error('❌ Errore generazione grafici:', error);
      return null;
    }
  }

  async createChartImage(type, data, width, height) {
    return new Promise((resolve) => {
      // Crea canvas temporaneo invisibile
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.display = 'none';
      document.body.appendChild(canvas);

      // Configurazione base chart
      const config = {
        type: type,
        data: data,
        options: {
          responsive: false,
          animation: false, // No animation per export
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: { size: 11 },
                boxWidth: 12,
                padding: 15
              }
            }
          }
        }
      };

      // Opzioni specifiche per tipo
      if (type === 'line') {
        config.data.datasets = data.datasets.map(ds => ({
          ...ds,
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4
        }));
      }

      if (type === 'radar') {
        config.options.scales = {
          r: {
            beginAtZero: true,
            max: 5,
            ticks: { stepSize: 1, font: { size: 10 } },
            pointLabels: { font: { size: 11 } }
          }
        };
      }

      // Crea chart
      const chart = new Chart(canvas, config);

      // Attendi rendering e converti in Base64
      setTimeout(() => {
        const base64 = canvas.toDataURL('image/png');
        chart.destroy();
        document.body.removeChild(canvas);
        resolve(base64);
      }, 500);
    });
  }

  parseMarkdown(text) {
    // Semplice parser markdown per formattazione base
    return text
      // Code blocks
      .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Headers
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inizializza il chatbot quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  window.financialChatbot = new FinancialChatbot();
});
