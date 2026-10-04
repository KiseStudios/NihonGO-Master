/**
 * Aplicação Principal - NihonGo Master
 * Gerenciador de Telas, Áudio, Filtros e Estatísticas
 */

class JapaneseApp {
  constructor() {
    this.currentScreen = "home";
    this.currentTheme = localStorage.getItem("nihongo_theme") || "light";
    this.stats = this.loadStats();
    this.userSettings = this.loadSettings();
    this.voices = [];
    this.dailyKanji = null;
    this.flashcards = {
      type: "hiragana",
      list: [],
      currentIndex: 0,
      isFlipped: false
    };

    this.initTheme();
    this.initAudioVoices();
    this.initScreens();
    this.initDailyKanji();
    this.renderAllData();
    this.initFlashcards("hiragana");
    this.initTokyoClock();
    this.initSettings();
    this.setUserLevel(this.stats.userLevel || "iniciante");
    this.attachEventListeners();
    this.updateStatsDisplay();
  }

  loadStats() {
    const defaultStats = {
      streak: 1,
      lastDate: new Date().toDateString(),
      practicedChars: 0,
      quizzesTaken: 0,
      totalScore: 0,
      totalPossibleScore: 0,
      favorites: [],
      achievements: [],
      userLevel: localStorage.getItem("nihongo_user_level") || "iniciante"
    };

    const saved = localStorage.getItem("nihongo_user_stats");
    if (!saved) return defaultStats;

    try {
      const parsed = JSON.parse(saved);
      if (!parsed.achievements) parsed.achievements = [];
      if (!parsed.userLevel) parsed.userLevel = localStorage.getItem("nihongo_user_level") || "iniciante";

      // Checar se a sequência (streak) continua
      const today = new Date().toDateString();
      const last = new Date(parsed.lastDate);
      const diffDays = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        parsed.streak += 1;
        parsed.lastDate = today;
      } else if (diffDays > 1) {
        parsed.streak = 1;
        parsed.lastDate = today;
      }

      return parsed;
    } catch (e) {
      return defaultStats;
    }
  }

  saveStats() {
    localStorage.setItem("nihongo_user_stats", JSON.stringify(this.stats));
    this.updateStatsDisplay();
  }

  loadSettings() {
    const defaultSettings = {
      theme: localStorage.getItem("nihongo_theme") || "light",
      voiceRate: 1.0,
      voicePitch: 1.0,
      showFurigana: true,
      showRomaji: true,
      soundEffects: true,
      dailyGoal: 20
    };
    try {
      const saved = localStorage.getItem("nihongo_settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  }

  saveSettings() {
    try {
      localStorage.setItem("nihongo_settings", JSON.stringify(this.userSettings));
    } catch (e) {
      console.error("Erro ao salvar configurações", e);
    }
  }

  updateStatsDisplay() {
    const streakEl = document.getElementById("statStreak");
    const practicedEl = document.getElementById("statPracticed");
    const quizAccuracyEl = document.getElementById("statQuizAccuracy");
    const kanjiCountEl = document.getElementById("statKanjiCount");

    if (streakEl) streakEl.textContent = `${this.stats.streak} dias`;
    if (practicedEl) practicedEl.textContent = this.stats.practicedChars;
    if (kanjiCountEl) kanjiCountEl.textContent = JAPANESE_DATA.kanji.length;

    if (quizAccuracyEl) {
      if (this.stats.totalPossibleScore > 0) {
        const pct = Math.round((this.stats.totalScore / this.stats.totalPossibleScore) * 100);
        quizAccuracyEl.textContent = `${pct}%`;
      } else {
        quizAccuracyEl.textContent = "--";
      }
    }
  }

  recordQuizResult(score, total) {
    this.stats.quizzesTaken++;
    this.stats.totalScore += score;
    this.stats.totalPossibleScore += total;
    this.saveStats();

    this.unlockAchievement("quiz_completed");
    if (score === total && total >= 10) {
      this.unlockAchievement("perfect_quiz");
    }
  }

  incrementPracticed() {
    this.stats.practicedChars++;
    this.saveStats();
  }

  /* Gerenciador de Telas (Navegação SPA) */
  navigateTo(screenId) {
    if (!document.getElementById(`screen-${screenId}`)) return;
    const screens = document.querySelectorAll(".screen-view");
    screens.forEach(screen => screen.classList.remove("active"));

    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add("active");
      this.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: "instant" });
      const heading = target.querySelector("h1, h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }

      if (screenId === "quiz" && window.japaneseQuiz && (!window.japaneseQuiz.questions || window.japaneseQuiz.questions.length === 0)) {
        window.japaneseQuiz.startQuiz("hiragana", 10);
      } else if (screenId === "games") {
        this.switchGameTab("memory");
      } else if (screenId === "advanced" && window.japaneseAdvanced) {
        window.japaneseAdvanced.renderAnimeScenes();
      }
    }

    // Atualizar links da navbar
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-screen") === screenId);
    });

    document.querySelectorAll(".mobile-item").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-screen") === screenId);
    });

    document.dispatchEvent(new CustomEvent("nihongo:screenchange", { detail: { screenId } }));
  }

  /* Modo Claro / Escuro */
  initTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    this.updateThemeButton();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.userSettings.theme = this.currentTheme;
    this.saveSettings();
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    localStorage.setItem("nihongo_theme", this.currentTheme);
    this.updateThemeButton();

    // Sincroniza seleção visual dos cards de tema
    document.querySelectorAll(".theme-card").forEach(c => {
      c.classList.toggle("active", c.getAttribute("data-set-theme") === this.currentTheme);
    });
  }

  updateThemeButton() {
    const isLight = (this.currentTheme || "light") === "light";
    const iconEl = document.getElementById("settingsThemeIcon");
    const textEl = document.getElementById("settingsThemeText");
    const quickBtn = document.getElementById("settingsThemeToggleBtn");

    if (iconEl) iconEl.textContent = isLight ? "🌙" : "☀️";
    if (textEl) textEl.textContent = isLight ? "Modo Escuro" : "Modo Claro";
    if (quickBtn) {
      quickBtn.title = isLight ? "Ativar Modo Escuro" : "Ativar Modo Claro";
      quickBtn.classList.toggle("is-dark", !isLight);
    }

    const legacyBtn = document.getElementById("themeToggleBtn");
    if (legacyBtn) {
      legacyBtn.innerHTML = isLight ? "🌙" : "☀️";
      legacyBtn.title = isLight ? "Mudar para Modo Escuro" : "Mudar para Modo Claro";
    }
  }

  /* Síntese de Voz Nativa em Japonês (Web Speech API) */
  initAudioVoices() {
    if ("speechSynthesis" in window) {
      const load = () => {
        this.voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("ja"));
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  speakJapanese(text, customRate = null, customPitch = null) {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz nativa.");
      return;
    }

    window.speechSynthesis.cancel(); // Parar fala anterior

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = customRate || (this.userSettings && this.userSettings.voiceRate) || 0.85;
    utterance.pitch = customPitch || (this.userSettings && this.userSettings.voicePitch) || 1.0;

    if (this.voices.length > 0) {
      utterance.voice = this.voices[0];
    }

    window.speechSynthesis.speak(utterance);
    this.incrementPracticed();
    this.unlockAchievement("first_audio");
  }

  /* Kanji do Dia */
  initDailyKanji() {
    const kanjiList = JAPANESE_DATA.kanji;
    // Selecionar kanji baseado no dia do ano
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % kanjiList.length;
    this.dailyKanji = kanjiList[index];
    this.renderDailyKanji();
  }

  renderDailyKanji() {
    if (!this.dailyKanji) return;
    const k = this.dailyKanji;

    const displayEl = document.getElementById("dailyKanjiChar");
    const meaningEl = document.getElementById("dailyKanjiMeaning");
    const onEl = document.getElementById("dailyKanjiOnyomi");
    const kunEl = document.getElementById("dailyKanjiKunyomi");
    const exampleEl = document.getElementById("dailyKanjiExample");

    if (displayEl) {
      displayEl.textContent = k.kanji;
      displayEl.onclick = () => this.speakJapanese(k.kanji);
    }
    if (meaningEl) meaningEl.textContent = `${k.meaning} (${k.level})`;
    if (onEl) onEl.textContent = k.onyomi;
    if (kunEl) kunEl.textContent = k.kunyomi;
    if (exampleEl && k.examples.length > 0) {
      exampleEl.textContent = `${k.examples[0].word} - ${k.examples[0].meaning}`;
    }
  }

  /* Renderizar Tabelas e Grades */
  renderAllData() {
    this.renderHiraganaTable("basic");
    this.renderKatakanaTable("basic");
    this.renderKanjiGrid();
    this.renderPhrases();
    this.renderBeginnerGuides();
    this.renderConfusingKana();
    this.renderBeginnerVocab();
    this.renderJukugoList();
    this.renderVerbForms();
    this.renderCounters();
    this.renderDialogues();
  }

  renderHiraganaTable(type = "basic") {
    const container = document.getElementById("hiraganaGrid");
    if (!container) return;
    container.innerHTML = "";

    const items = JAPANESE_DATA.hiragana[type] || JAPANESE_DATA.hiragana.basic;

    items.forEach(item => {
      const card = document.createElement("div");
      if (!item.char) {
        card.className = "kana-card empty-cell";
        container.appendChild(card);
        return;
      }

      card.className = "kana-card";
      card.innerHTML = `
        <span class="audio-indicator">🔊</span>
        <span class="char">${item.char}</span>
        <span class="romaji">${item.romaji}</span>
      `;

      card.onclick = () => {
        this.speakJapanese(item.char);
      };

      // Clique duplo ou botão direito leva ao Dojo de Prática
      card.oncontextmenu = (e) => {
        e.preventDefault();
        this.openPracticeForChar(item.char, `Hiragana "${item.char}" (${item.romaji})`);
      };

      container.appendChild(card);
    });
  }

  renderKatakanaTable(type = "basic") {
    const container = document.getElementById("katakanaGrid");
    if (!container) return;
    container.innerHTML = "";

    const items = JAPANESE_DATA.katakana[type] || JAPANESE_DATA.katakana.basic;

    items.forEach(item => {
      const card = document.createElement("div");
      if (!item.char) {
        card.className = "kana-card empty-cell";
        container.appendChild(card);
        return;
      }

      card.className = "kana-card";
      card.innerHTML = `
        <span class="audio-indicator">🔊</span>
        <span class="char">${item.char}</span>
        <span class="romaji">${item.romaji}</span>
      `;

      card.onclick = () => {
        this.speakJapanese(item.char);
      };

      card.oncontextmenu = (e) => {
        e.preventDefault();
        this.openPracticeForChar(item.char, `Katakana "${item.char}" (${item.romaji})`);
      };

      container.appendChild(card);
    });
  }

  renderKanjiGrid(category = "all", searchQuery = "") {
    const container = document.getElementById("kanjiGridContainer");
    if (!container) return;
    container.innerHTML = "";

    let filtered = JAPANESE_DATA.kanji;

    if (category !== "all") {
      filtered = filtered.filter(k => k.category === category);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(k => 
        k.kanji.includes(q) ||
        k.meaning.toLowerCase().includes(q) ||
        k.onyomi.toLowerCase().includes(q) ||
        k.kunyomi.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="font-size: 1.25rem;">Nenhum Kanji encontrado para essa busca.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(k => {
      const card = document.createElement("div");
      card.className = "kanji-card-item";
      card.innerHTML = `
        <span class="kanji-badge-n">${k.level}</span>
        <div class="kanji-symbol">${k.kanji}</div>
        <div class="kanji-pt">${k.meaning}</div>
        <div class="kanji-onkun">
          <div><strong style="color:var(--primary)">On:</strong> ${k.onyomi.split(" ")[0]}</div>
          <div><strong style="color:var(--secondary)">Kun:</strong> ${k.kunyomi.split(" ")[0]}</div>
        </div>
      `;

      card.onclick = () => this.openKanjiModal(k);
      container.appendChild(card);
    });
  }

  renderPhrases() {
    const container = document.getElementById("phrasesList");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.phrases.forEach(p => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <div class="stat-icon pink">💬</div>
        <div style="flex: 1;">
          <div style="font-size: 1.25rem; font-weight: 700; font-family: var(--font-jp);">${p.jp}</div>
          <div style="font-size: 0.875rem; color: var(--primary); font-weight: 600;">${p.romaji}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${p.pt}</div>
        </div>
        <button class="icon-btn" title="Ouvir">🔊</button>
      `;
      card.onclick = () => this.speakJapanese(p.jp);
      container.appendChild(card);
    });
  }

  /* Modal de Detalhes do Kanji */
  openKanjiModal(kanjiObj) {
    const modal = document.getElementById("kanjiDetailModal");
    if (!modal) return;

    document.getElementById("modalKanjiSymbol").textContent = kanjiObj.kanji;
    document.getElementById("modalKanjiMeaning").textContent = kanjiObj.meaning;
    document.getElementById("modalKanjiLevel").textContent = kanjiObj.level;
    document.getElementById("modalKanjiStrokes").textContent = `${kanjiObj.strokes} traços`;
    document.getElementById("modalKanjiCategory").textContent = kanjiObj.category;
    document.getElementById("modalKanjiOnyomi").textContent = kanjiObj.onyomi;
    document.getElementById("modalKanjiKunyomi").textContent = kanjiObj.kunyomi;

    // Exemplos de palavras
    const examplesContainer = document.getElementById("modalKanjiExamples");
    if (examplesContainer) {
      examplesContainer.innerHTML = "";
      kanjiObj.examples.forEach(ex => {
        const item = document.createElement("div");
        item.style.padding = "0.75rem";
        item.style.borderBottom = "1px solid var(--border-color)";
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "space-between";
        item.style.cursor = "pointer";
        item.innerHTML = `
          <div>
            <span style="font-family: var(--font-jp); font-weight: 700; font-size: 1.1rem; color: var(--text-main);">${ex.word}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">[${ex.reading}]</span>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${ex.meaning}</div>
          </div>
          <span style="color: var(--primary);">🔊</span>
        `;
        item.onclick = () => this.speakJapanese(ex.word);
        examplesContainer.appendChild(item);
      });
    }

    // Botão de Praticar este Kanji no Dojo
    const practiceBtn = document.getElementById("modalPracticeKanjiBtn");
    if (practiceBtn) {
      practiceBtn.onclick = () => {
        this.closeKanjiModal();
        this.openPracticeForChar(kanjiObj.kanji, `Kanji: ${kanjiObj.meaning} (${kanjiObj.strokes} traços)`);
      };
    }

    // Botão de Áudio
    const audioBtn = document.getElementById("modalKanjiAudioBtn");
    if (audioBtn) {
      audioBtn.onclick = () => this.speakJapanese(kanjiObj.kanji);
    }

    modal.classList.add("open");
  }

  closeKanjiModal() {
    const modal = document.getElementById("kanjiDetailModal");
    if (modal) modal.classList.remove("open");
  }

  openPracticeForChar(char, info = "") {
    this.navigateTo("practice");
    if (window.calligraphyDojo) {
      window.calligraphyDojo.setCharacter(char, info);
    }
  }

  /* Flashcards Engine */
  initFlashcards(type = "hiragana") {
    this.flashcards.type = type;
    const pool = type === "hiragana"
      ? JAPANESE_DATA.hiragana.basic.filter(item => item.char !== "")
      : JAPANESE_DATA.katakana.basic.filter(item => item.char !== "");
    this.flashcards.list = [...pool].sort(() => 0.5 - Math.random());
    this.flashcards.currentIndex = 0;
    this.flashcards.isFlipped = false;
    this.renderCurrentFlashcard();
  }

  renderCurrentFlashcard() {
    const fc = this.flashcards;
    if (!fc.list || fc.list.length === 0) return;
    const item = fc.list[fc.currentIndex];

    const prefix = fc.type;
    const cardInner = document.getElementById(`${prefix}FlashcardInner`);
    const frontChar = document.getElementById(`${prefix}FcChar`);
    const backRomaji = document.getElementById(`${prefix}FcRomaji`);
    const backExample = document.getElementById(`${prefix}FcExample`);
    const counter = document.getElementById(`${prefix}FcCounter`);

    if (cardInner) {
      cardInner.classList.remove("flipped");
      fc.isFlipped = false;
    }
    if (frontChar) frontChar.textContent = item.char;
    if (backRomaji) backRomaji.textContent = item.romaji;
    if (backExample) backExample.textContent = item.example || "";
    if (counter) counter.textContent = `${fc.currentIndex + 1} / ${fc.list.length}`;
  }

  flipFlashcard(type) {
    if (this.flashcards.type !== type) {
      this.initFlashcards(type);
    }
    const cardInner = document.getElementById(`${type}FlashcardInner`);
    if (cardInner) {
      this.flashcards.isFlipped = !this.flashcards.isFlipped;
      cardInner.classList.toggle("flipped", this.flashcards.isFlipped);
      if (this.flashcards.isFlipped) {
        const item = this.flashcards.list[this.flashcards.currentIndex];
        this.speakJapanese(item.char);
      }
    }
  }

  nextFlashcard(type) {
    if (this.flashcards.type !== type) {
      this.initFlashcards(type);
    }
    if (this.flashcards.currentIndex < this.flashcards.list.length - 1) {
      this.flashcards.currentIndex++;
    } else {
      this.flashcards.currentIndex = 0;
    }
    this.renderCurrentFlashcard();
  }

  prevFlashcard(type) {
    if (this.flashcards.type !== type) {
      this.initFlashcards(type);
    }
    if (this.flashcards.currentIndex > 0) {
      this.flashcards.currentIndex--;
    } else {
      this.flashcards.currentIndex = this.flashcards.list.length - 1;
    }
    this.renderCurrentFlashcard();
  }

  setFlashcardMode(type, isCardsMode) {
    const tableEl = document.getElementById(`${type}Grid`);
    const cardsEl = document.getElementById(`${type}FlashcardSection`);
    const tableBtn = document.getElementById(`${type}ViewTableBtn`);
    const cardsBtn = document.getElementById(`${type}ViewCardsBtn`);

    if (isCardsMode) {
      if (tableEl) tableEl.style.display = "none";
      if (cardsEl) cardsEl.style.display = "block";
      if (tableBtn) {
        tableBtn.classList.remove("btn-primary");
        tableBtn.classList.add("btn-outline");
      }
      if (cardsBtn) {
        cardsBtn.classList.add("btn-primary");
        cardsBtn.classList.remove("btn-outline");
      }
      this.initFlashcards(type);
    } else {
      if (tableEl) tableEl.style.display = "grid";
      if (cardsEl) cardsEl.style.display = "none";
      if (tableBtn) {
        tableBtn.classList.add("btn-primary");
        tableBtn.classList.remove("btn-outline");
      }
      if (cardsBtn) {
        cardsBtn.classList.remove("btn-primary");
        cardsBtn.classList.add("btn-outline");
      }
    }
  }

  /* Guias para Iniciantes */
  renderBeginnerGuides() {
    const container = document.getElementById("beginnerGuidesContainer");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.beginnerGuide.forEach(g => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.style.flexDirection = "column";
      card.style.alignItems = "flex-start";
      card.innerHTML = `
        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary); margin-bottom: 0.4rem;">
          ${g.title}
        </h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
          ${g.desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </p>
      `;
      container.appendChild(card);
    });
  }

  /* Kanjis Compostos (Jukugo) para Intermediários */
  renderJukugoList() {
    const container = document.getElementById("jukugoContainer");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.compoundKanji.forEach(item => {
      const card = document.createElement("div");
      card.className = "jukugo-card";
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <div style="font-size: 2.2rem; font-family: var(--font-jp); font-weight: 800; color: var(--text-main); line-height: 1.1;">
              ${item.kanji}
            </div>
            <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">
              ${item.kana}
            </div>
          </div>
          <button class="icon-btn" title="Ouvir">🔊</button>
        </div>
        <div>
          <div style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.25rem;">
            ${item.pt}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
            ${item.breakdown}
          </div>
        </div>
      `;
      card.onclick = () => this.speakJapanese(item.kanji);
      container.appendChild(card);
    });
  }

  /* Caracteres Confusos (Gêmeos) */
  renderConfusingKana() {
    const container = document.getElementById("confusingKanaContainer");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.confusingKana.forEach(item => {
      const card = document.createElement("div");
      card.className = "confusing-card";
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <div class="confusing-pair-title">${item.pair}</div>
          <span class="section-badge" style="background:#ffedd5; color:#c2410c;">${item.type}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${item.tip}</p>
      `;
      container.appendChild(card);
    });
  }

  /* Primeiras Palavras do Vocabulário */
  renderBeginnerVocab() {
    const container = document.getElementById("beginnerVocabContainer");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.beginnerVocab.forEach(v => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.style.cursor = "pointer";
      card.style.padding = "1rem 1.15rem";
      card.innerHTML = `
        <div style="flex: 1;">
          <div style="font-size: 1.25rem; font-family: var(--font-jp); font-weight: 800; color: var(--text-main);">${v.jp}</div>
          <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${v.romaji}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${v.pt}</div>
        </div>
        <button class="icon-btn" title="Ouvir">🔊</button>
      `;
      card.onclick = () => this.speakJapanese(v.jp.split(" ")[0]);
      container.appendChild(card);
    });
  }

  /* Tabela de Formas Verbais JLPT N5/N4 */
  renderVerbForms() {
    const container = document.getElementById("verbFormsContainer");
    if (!container) return;

    let html = `
      <table class="verbs-table">
        <thead>
          <tr>
            <th>Verbo & Significado</th>
            <th>Grupo</th>
            <th>Forma -Masu (Formal)</th>
            <th>Forma -Te (Conexão/Pedido)</th>
            <th>Forma -Nai (Negativa)</th>
            <th>Forma -Ta (Passado)</th>
          </tr>
        </thead>
        <tbody>
    `;

    JAPANESE_DATA.verbForms.forEach(v => {
      html += `
        <tr>
          <td><strong>${v.verb}</strong></td>
          <td><span class="section-badge" style="margin:0; font-size:0.75rem;">${v.group}</span></td>
          <td style="cursor:pointer;" onclick="window.app.speakJapanese('${v.masu.split(' ')[0]}')" title="Clique para ouvir">
            ${v.masu} 🔊
          </td>
          <td style="cursor:pointer;" onclick="window.app.speakJapanese('${v.te.split(' ')[0]}')" title="Clique para ouvir">
            ${v.te} 🔊
          </td>
          <td style="cursor:pointer;" onclick="window.app.speakJapanese('${v.nai.split(' ')[0]}')" title="Clique para ouvir">
            ${v.nai} 🔊
          </td>
          <td style="cursor:pointer;" onclick="window.app.speakJapanese('${v.ta.split(' ')[0]}')" title="Clique para ouvir">
            ${v.ta} 🔊
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  /* Contadores Japoneses */
  renderCounters() {
    const container = document.getElementById("countersContainer");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.counters.forEach(c => {
      const card = document.createElement("div");
      card.className = "counter-box";
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h4 style="font-size: 1.15rem; font-family: var(--font-jp); font-weight: 800; color: var(--primary);">${c.name}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Contador</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-main); font-weight: 600; margin-bottom: 0.5rem;">${c.usage}</p>
        <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; background: var(--bg-primary); padding: 0.5rem 0.75rem; border-radius: 8px; font-family: var(--font-jp);">
          ${c.items}
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* Diálogos Reais com Áudio */
  renderDialogues() {
    const container = document.getElementById("dialoguesContainer");
    if (!container) return;
    container.innerHTML = "";

    JAPANESE_DATA.dialogues.forEach(d => {
      const card = document.createElement("div");
      card.className = "dialogue-card";

      let linesHtml = "";
      d.lines.forEach(l => {
        linesHtml += `
          <div class="dialogue-line" onclick="window.app.speakJapanese('${l.jp}')">
            <span class="dialogue-speaker">${l.speaker}</span>
            <div style="flex: 1;">
              <div style="font-size: 1.05rem; font-family: var(--font-jp); font-weight: 700; color: var(--text-main);">${l.jp}</div>
              <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${l.romaji}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${l.pt}</div>
            </div>
            <span style="color: var(--primary); font-size: 0.9rem;">🔊</span>
          </div>
        `;
      });

      card.innerHTML = `
        <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main);">${d.title}</h4>
        ${linesHtml}
      `;

      container.appendChild(card);
    });
  }

  /* Seletor de Nível */
  setUserLevel(level) {
    this.stats.userLevel = level;
    this.saveStats();
    localStorage.setItem("nihongo_user_level", level);

    document.querySelectorAll(".level-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.level === level);
    });

    const begSec = document.getElementById("beginnerContentSection");
    const intSec = document.getElementById("intermediateContentSection");

    if (begSec && intSec) {
      if (level === "iniciante") {
        begSec.style.display = "block";
        intSec.style.display = "none";
      } else if (level === "intermediario") {
        begSec.style.display = "none";
        intSec.style.display = "block";
      } else if (level === "avancado") {
        this.navigateTo("advanced");
      }
    }
  }

  /* Horário ao Vivo de Tóquio (JST) */
  initTokyoClock() {
    const el = document.getElementById("liveTokyoClock");
    if (!el) return;

    const updateClock = () => {
      try {
        const now = new Date();
        const timeOptions = {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        };
        const tokyoTime = now.toLocaleTimeString("pt-BR", timeOptions);
        const dateOptions = {
          timeZone: "Asia/Tokyo",
          weekday: "short",
          month: "short",
          day: "numeric"
        };
        const tokyoDate = now.toLocaleDateString("ja-JP", dateOptions);
        el.innerHTML = `🇯🇵 Tóquio: <strong>${tokyoTime}</strong> <small style="opacity:0.85; margin-left: 4px;">(${tokyoDate})</small>`;
      } catch (e) {
        el.textContent = "🇯🇵 Tóquio (JST)";
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  /* Painel Lateral de Configurações & Preferências */
  initSettings() {
    if (this.userSettings.theme) {
      this.applyTheme(this.userSettings.theme);
    }

    const rateInput = document.getElementById("settingVoiceRate");
    const pitchInput = document.getElementById("settingVoicePitch");
    const furiganaCheck = document.getElementById("settingShowFurigana");
    const romajiCheck = document.getElementById("settingShowRomaji");
    const soundsCheck = document.getElementById("settingSoundEffects");
    const goalSelect = document.getElementById("settingDailyGoal");
    const speedLabel = document.getElementById("speedValueLabel");
    const pitchLabel = document.getElementById("pitchValueLabel");

    if (rateInput) rateInput.value = this.userSettings.voiceRate || 1.0;
    if (pitchInput) pitchInput.value = this.userSettings.voicePitch || 1.0;
    if (furiganaCheck) furiganaCheck.checked = this.userSettings.showFurigana !== false;
    if (romajiCheck) romajiCheck.checked = this.userSettings.showRomaji !== false;
    if (soundsCheck) soundsCheck.checked = this.userSettings.soundEffects !== false;
    if (goalSelect) goalSelect.value = this.userSettings.dailyGoal || 20;

    if (speedLabel) speedLabel.textContent = `${this.userSettings.voiceRate || 1.0}x`;
    if (pitchLabel) pitchLabel.textContent = `${this.userSettings.voicePitch || 1.0}`;

    // Seletor de Tema Visual
    document.querySelectorAll(".theme-card").forEach(card => {
      const t = card.getAttribute("data-set-theme");
      if (t === this.userSettings.theme) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
      card.onclick = () => {
        this.setTheme(t);
        document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      };
    });

    // Sliders de Velocidade e Tom de Voz
    if (rateInput) {
      rateInput.oninput = (e) => {
        this.userSettings.voiceRate = parseFloat(e.target.value);
        if (speedLabel) speedLabel.textContent = `${this.userSettings.voiceRate}x`;
        this.saveSettings();
      };
    }

    if (pitchInput) {
      pitchInput.oninput = (e) => {
        this.userSettings.voicePitch = parseFloat(e.target.value);
        if (pitchLabel) pitchLabel.textContent = `${this.userSettings.voicePitch}`;
        this.saveSettings();
      };
    }

    if (furiganaCheck) {
      furiganaCheck.onchange = (e) => {
        this.userSettings.showFurigana = e.target.checked;
        this.saveSettings();
        document.body.classList.toggle("hide-furigana", !e.target.checked);
      };
    }

    if (romajiCheck) {
      romajiCheck.onchange = (e) => {
        this.userSettings.showRomaji = e.target.checked;
        this.saveSettings();
        document.body.classList.toggle("hide-romaji", !e.target.checked);
      };
    }

    if (soundsCheck) {
      soundsCheck.onchange = (e) => {
        this.userSettings.soundEffects = e.target.checked;
        this.saveSettings();
      };
    }

    if (goalSelect) {
      goalSelect.onchange = (e) => {
        this.userSettings.dailyGoal = parseInt(e.target.value, 10);
        this.saveSettings();
        this.showToast(`🎯 Meta diária ajustada para ${this.userSettings.dailyGoal} itens!`, "info");
      };
    }

    const testBtn = document.getElementById("testVoiceBtn");
    if (testBtn) {
      testBtn.onclick = () => {
        this.speakJapanese("こんにちは、日本語マスター！いっしょにがんばりましょう！");
      };
    }

    const exportBtn = document.getElementById("exportDataBtn");
    if (exportBtn) {
      exportBtn.onclick = () => this.exportUserData();
    }

    const resetBtn = document.getElementById("resetDataBtn");
    if (resetBtn) {
      resetBtn.onclick = () => this.resetUserData();
    }

    // Botão de Conquistas dentro das Configurações
    const setAchBtn = document.getElementById("settingsAchievementsBtn");
    if (setAchBtn) {
      setAchBtn.onclick = () => {
        this.closeSettingsSidebar();
        this.openAchievementsModal();
      };
    }

    // Alternador Rápido de Tema Claro / Escuro dentro das Configurações
    const setThemeToggle = document.getElementById("settingsThemeToggleBtn");
    if (setThemeToggle) {
      setThemeToggle.onclick = () => this.toggleTheme();
    }

    // Abertura e Fechamento da Barra Lateral de Configurações
    const navBtn = document.getElementById("settingsToggleNavBtn");
    if (navBtn) navBtn.onclick = () => this.openSettingsSidebar();

    const closeBtn = document.getElementById("closeSettingsBtn");
    if (closeBtn) closeBtn.onclick = () => this.closeSettingsSidebar();

    const overlay = document.getElementById("settingsOverlay");
    if (overlay) overlay.onclick = () => this.closeSettingsSidebar();
  }

  openSettingsSidebar() {
    const sidebar = document.getElementById("settingsSidebar");
    const overlay = document.getElementById("settingsOverlay");
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
  }

  closeSettingsSidebar() {
    const sidebar = document.getElementById("settingsSidebar");
    const overlay = document.getElementById("settingsOverlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    this.userSettings.theme = themeName;
    this.saveSettings();
    localStorage.setItem("nihongo_theme", themeName);
    this.applyTheme(themeName);
    this.updateThemeButton();
  }

  applyTheme(themeName) {
    this.currentTheme = themeName;
    document.documentElement.setAttribute("data-theme", themeName);
    this.updateThemeButton();
  }

  exportUserData() {
    const data = {
      app: "Kise Japan",
      version: "2.5",
      exportedAt: new Date().toISOString(),
      stats: this.stats,
      settings: this.userSettings,
      notes: window.japaneseNotebook ? window.japaneseNotebook.notes : []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kise_japan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast?.("📤 Backup baixado com sucesso!", "success");
  }

  resetUserData() {
    if (confirm("⚠️ Tem certeza que deseja resetar todo o seu progresso e limpar anotações? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("nihongo_user_stats");
      localStorage.removeItem("nihongo_notes");
      localStorage.removeItem("nihongo_settings");
      location.reload();
    }
  }

  /* Conquistas (Gamificação) */
  unlockAchievement(id) {
    if (!this.stats.achievements) this.stats.achievements = [];
    if (this.stats.achievements.includes(id)) return;

    this.stats.achievements.push(id);
    this.saveStats();

    const ach = JAPANESE_DATA.achievementsList.find(a => a.id === id);
    if (!ach) return;

    const toast = document.getElementById("achievementToast");
    const titleEl = document.getElementById("toastAchTitle");
    const descEl = document.getElementById("toastAchDesc");
    const iconEl = document.getElementById("toastAchIcon");

    if (toast && titleEl && descEl && iconEl) {
      titleEl.textContent = ach.title;
      descEl.textContent = ach.desc;
      iconEl.textContent = ach.icon;

      toast.classList.add("show");
      window.japaneseQuiz?.playSound("correct");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3500);
    }
  }

  openAchievementsModal() {
    const modal = document.getElementById("achievementsModal");
    const container = document.getElementById("achievementsListContainer");
    if (!modal || !container) return;

    container.innerHTML = "";
    const unlocked = this.stats.achievements || [];

    JAPANESE_DATA.achievementsList.forEach(a => {
      const isUnlocked = unlocked.includes(a.id);
      const item = document.createElement("div");
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "1rem";
      item.style.padding = "0.85rem 1rem";
      item.style.background = isUnlocked ? "var(--bg-primary)" : "var(--bg-card)";
      item.style.borderRadius = "14px";
      item.style.border = `1px solid ${isUnlocked ? '#10b981' : 'var(--border-color)'}`;
      item.style.opacity = isUnlocked ? "1" : "0.55";

      item.innerHTML = `
        <div style="font-size: 2.2rem; filter: ${isUnlocked ? 'none' : 'grayscale(1)'};">${a.icon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${a.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${a.desc}</div>
        </div>
        <div>
          ${isUnlocked ? '<span class="section-badge" style="background:#dcfce7; color:#10b981;">✓ Conquistado</span>' : '<span style="font-size:1.1rem; color:var(--text-muted);">🔒</span>'}
        </div>
      `;
      container.appendChild(item);
    });

    modal.classList.add("open");
  }

  closeAchievementsModal() {
    const modal = document.getElementById("achievementsModal");
    if (modal) modal.classList.remove("open");
  }

  /* Alternador de Abas de Jogos */
  switchGameTab(tabName) {
    const memorySec = document.getElementById("gameMemorySection");
    const speedSec = document.getElementById("gameSpeedSection");
    const sentenceSec = document.getElementById("gameSentenceSection");

    const tabMem = document.getElementById("tabGameMemory");
    const tabSpd = document.getElementById("tabGameSpeed");
    const tabSent = document.getElementById("tabGameSentence");

    const tabs = [tabMem, tabSpd, tabSent];
    tabs.forEach(t => {
      if (t) {
        t.classList.remove("btn-primary");
        t.classList.add("btn-outline");
      }
    });

    if (memorySec) memorySec.style.display = "none";
    if (speedSec) speedSec.style.display = "none";
    if (sentenceSec) sentenceSec.style.display = "none";

    if (tabName === "memory") {
      if (memorySec) memorySec.style.display = "block";
      if (tabMem) {
        tabMem.classList.add("btn-primary");
        tabMem.classList.remove("btn-outline");
      }
      if (window.japaneseGames) window.japaneseGames.startMemoryGame("hiragana");
    } else if (tabName === "speed") {
      if (speedSec) speedSec.style.display = "block";
      if (tabSpd) {
        tabSpd.classList.add("btn-primary");
        tabSpd.classList.remove("btn-outline");
      }
      const banner = document.getElementById("speedStartBanner");
      const playArea = document.getElementById("speedPlayArea");
      const finishArea = document.getElementById("speedFinishArea");
      if (banner) banner.style.display = "block";
      if (playArea) playArea.style.display = "none";
      if (finishArea) finishArea.style.display = "none";
    } else if (tabName === "sentence") {
      if (sentenceSec) sentenceSec.style.display = "block";
      if (tabSent) {
        tabSent.classList.add("btn-primary");
        tabSent.classList.remove("btn-outline");
      }
      if (window.japaneseGames) window.japaneseGames.initSentenceBuilder();
    }
  }

  /* Eventos e Cliques */
  attachEventListeners() {
    // Links de navegação
    document.querySelectorAll("[data-screen]").forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = link.getAttribute("data-screen");
        this.navigateTo(target);
      });
    });

    // Alternador de Tema
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) themeBtn.addEventListener("click", () => this.toggleTheme());

    // Fechar Modal ao clicar fora ou no X
    const modalClose = document.getElementById("closeModalBtn");
    if (modalClose) modalClose.addEventListener("click", () => this.closeKanjiModal());

    const modalOverlay = document.getElementById("kanjiDetailModal");
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeKanjiModal();
      });
    }

    // Filtros de Hiragana (Básico, Dakuon, Yōon)
    document.querySelectorAll(".hiragana-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".hiragana-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-type");
        this.renderHiraganaTable(type);
      });
    });

    // Alternar Visualização Hiragana (Tabela vs Flashcards)
    const hiraTableBtn = document.getElementById("hiraganaViewTableBtn");
    const hiraCardsBtn = document.getElementById("hiraganaViewCardsBtn");
    if (hiraTableBtn) hiraTableBtn.addEventListener("click", () => this.setFlashcardMode("hiragana", false));
    if (hiraCardsBtn) hiraCardsBtn.addEventListener("click", () => this.setFlashcardMode("hiragana", true));

    // Filtros de Katakana
    document.querySelectorAll(".katakana-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".katakana-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-type");
        this.renderKatakanaTable(type);
      });
    });

    // Alternar Visualização Katakana (Tabela vs Flashcards)
    const kataTableBtn = document.getElementById("katakanaViewTableBtn");
    const kataCardsBtn = document.getElementById("katakanaViewCardsBtn");
    if (kataTableBtn) kataTableBtn.addEventListener("click", () => this.setFlashcardMode("katakana", false));
    if (kataCardsBtn) kataCardsBtn.addEventListener("click", () => this.setFlashcardMode("katakana", true));

    // Filtros de Kanji por Categoria
    const kanjiCategorySelect = document.getElementById("kanjiCategoryFilter");
    const kanjiSearchInput = document.getElementById("kanjiSearchInput");

    const handleKanjiFilter = () => {
      const cat = kanjiCategorySelect ? kanjiCategorySelect.value : "all";
      const query = kanjiSearchInput ? kanjiSearchInput.value : "";
      this.renderKanjiGrid(cat, query);
    };

    if (kanjiCategorySelect) kanjiCategorySelect.addEventListener("change", handleKanjiFilter);
    if (kanjiSearchInput) kanjiSearchInput.addEventListener("input", handleKanjiFilter);

    // Botões de Iniciar Quiz
    document.querySelectorAll("[data-quiz-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-quiz-mode");
        this.navigateTo("quiz");
        if (window.japaneseQuiz) {
          window.japaneseQuiz.startQuiz(mode, 10);
        }
      });
    });

    // Botão de Reiniciar Quiz
    const restartQuizBtn = document.getElementById("restartQuizBtn");
    if (restartQuizBtn) {
      restartQuizBtn.addEventListener("click", () => {
        if (window.japaneseQuiz) {
          window.japaneseQuiz.startQuiz(window.japaneseQuiz.currentMode, 10);
        }
      });
    }

    // Seletores rápidos do Dojo de Caligrafia
    const practiceSelect = document.getElementById("practiceCharSelect");
    if (practiceSelect) {
      practiceSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val) {
          this.openPracticeForChar(val, `Caractere: ${val}`);
        }
      });
    }

    // Os botões do caderno são registrados uma única vez em notebook.js.

    // Modal de Conquistas
    const achBtn = document.getElementById("achievementsBtn");
    if (achBtn) achBtn.addEventListener("click", () => this.openAchievementsModal());

    const closeAchBtn = document.getElementById("closeAchModalBtn");
    if (closeAchBtn) closeAchBtn.addEventListener("click", () => this.closeAchievementsModal());

    const achModal = document.getElementById("achievementsModal");
    if (achModal) {
      achModal.addEventListener("click", (e) => {
        if (e.target === achModal) this.closeAchievementsModal();
      });
    }
  }

  initScreens() {
    // Começar na tela Home
    this.navigateTo("home");
  }
}

// Inicializar aplicativo
window.addEventListener("DOMContentLoaded", () => {
  window.app = new JapaneseApp();
  window.japaneseApp = window.app;
});
