/**
 * Módulo de Mini-Games e Desafios Interativos
 * 1. Jogo da Memória Japonês (Para Iniciantes e Treino Visual)
 * 2. Speed Run / Contra o Tempo (Para quem já sabe o básico e quer agilidade)
 * 3. Construtor de Frases (Para quem quer dominar gramática real)
 * 4. Dojo de Kana (Leitura ativa por digitação)
 * 5. Ninja das Partículas (Gramática aplicada em frases)
 */

class JapaneseGames {
  constructor() {
    this.memoryCards = [];
    this.memoryFlipped = [];
    this.memoryMatched = 0;
    this.memoryMoves = 0;
    this.memoryLocked = false;

    // Speed Run state
    this.speedTimer = null;
    this.speedTimeLeft = 30;
    this.speedScore = 0;
    this.speedCombo = 0;
    this.speedCurrentQuestion = null;

    // Sentence builder state
    this.sentenceIndex = 0;
    this.sentenceSelectedBlocks = [];

    this.kanaMode = "hiragana";
    this.kanaRounds = [];
    this.kanaIndex = 0;
    this.kanaScore = 0;
    this.kanaLocked = false;

    this.particleRounds = [];
    this.particleIndex = 0;
    this.particleScore = 0;
    this.particleLocked = false;
    this.bindChallengeEvents();
  }

  bindChallengeEvents() {
    const kanaForm = document.getElementById("kanaChallengeForm");
    kanaForm?.addEventListener("submit", event => {
      event.preventDefault();
      this.checkKanaAnswer();
    });

    document.getElementById("kanaChallengeRestart")?.addEventListener("click", () => this.startKanaChallenge(this.kanaMode));
    document.getElementById("kanaChallengeAudio")?.addEventListener("click", () => {
      const current = this.kanaRounds[this.kanaIndex];
      if (current) window.app?.speakJapanese(current.char);
    });
    document.querySelectorAll("[data-kana-mode]").forEach(button => {
      button.addEventListener("click", () => this.startKanaChallenge(button.dataset.kanaMode));
    });
    document.getElementById("particleChallengeNext")?.addEventListener("click", () => this.nextParticleQuestion());
    document.getElementById("particleChallengeRestart")?.addEventListener("click", () => this.startParticleChallenge());
  }

  shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  /* ========================================================
     1. DOJO DE KANA (LEITURA DIGITADA)
     ======================================================== */
  startKanaChallenge(mode = "hiragana") {
    this.kanaMode = mode === "katakana" ? "katakana" : "hiragana";
    const pool = JAPANESE_DATA[this.kanaMode].basic.filter(item => item.char && item.romaji);
    if (pool.length === 0) {
      throw new Error(`Não há caracteres disponíveis para o desafio de ${this.kanaMode}.`);
    }

    this.kanaRounds = this.shuffle(pool).slice(0, 10);
    this.kanaIndex = 0;
    this.kanaScore = 0;
    this.kanaLocked = false;
    document.getElementById("kanaChallengeForm").style.display = "";
    document.getElementById("kanaChallengeResult").style.display = "none";
    document.querySelectorAll("[data-kana-mode]").forEach(button => {
      button.classList.toggle("active", button.dataset.kanaMode === this.kanaMode);
    });
    this.renderKanaQuestion();
  }

  renderKanaQuestion() {
    const item = this.kanaRounds[this.kanaIndex];
    const input = document.getElementById("kanaChallengeInput");
    const submit = document.querySelector("#kanaChallengeForm button[type='submit']");
    const feedback = document.getElementById("kanaChallengeFeedback");
    if (!item || !input || !submit || !feedback) return;

    this.kanaLocked = false;
    document.getElementById("kanaChallengeCharacter").textContent = item.char;
    document.getElementById("kanaChallengeGroup").textContent = this.kanaMode.toUpperCase();
    document.getElementById("kanaChallengeCounter").textContent = `${this.kanaIndex + 1} / ${this.kanaRounds.length}`;
    document.getElementById("kanaChallengeProgress").style.width = `${(this.kanaIndex / this.kanaRounds.length) * 100}%`;
    input.value = "";
    input.disabled = false;
    input.focus({ preventScroll: true });
    submit.textContent = "Conferir ↵";
    feedback.textContent = "";
    feedback.className = "game-challenge-feedback";
  }

  checkKanaAnswer() {
    if (this.kanaLocked) {
      this.nextKanaQuestion();
      return;
    }

    const item = this.kanaRounds[this.kanaIndex];
    const input = document.getElementById("kanaChallengeInput");
    const feedback = document.getElementById("kanaChallengeFeedback");
    const submit = document.querySelector("#kanaChallengeForm button[type='submit']");
    const answer = input.value.trim().toLowerCase();
    if (!answer) {
      input.focus();
      return;
    }

    this.kanaLocked = true;
    input.disabled = true;
    if (answer === item.romaji.toLowerCase()) {
      this.kanaScore++;
      feedback.textContent = `Isso! ${item.char} se lê “${item.romaji}”.`;
      feedback.classList.add("is-correct");
      window.japaneseQuiz?.playSound("correct");
    } else {
      feedback.textContent = `Quase! ${item.char} se lê “${item.romaji}”.`;
      feedback.classList.add("is-wrong");
      window.japaneseQuiz?.playSound("wrong");
    }
    submit.textContent = this.kanaIndex + 1 === this.kanaRounds.length ? "Ver resultado →" : "Próximo kana →";
  }

  nextKanaQuestion() {
    this.kanaIndex++;
    if (this.kanaIndex >= this.kanaRounds.length) {
      this.finishKanaChallenge();
      return;
    }
    this.renderKanaQuestion();
  }

  finishKanaChallenge() {
    document.getElementById("kanaChallengeProgress").style.width = "100%";
    document.getElementById("kanaChallengeForm").style.display = "none";
    document.getElementById("kanaChallengeFeedback").textContent = "";
    document.getElementById("kanaChallengeCounter").textContent = `${this.kanaRounds.length} / ${this.kanaRounds.length}`;
    document.getElementById("kanaChallengeFinalScore").textContent = `Você acertou ${this.kanaScore} de ${this.kanaRounds.length}.`;
    document.getElementById("kanaChallengeResult").style.display = "block";
    if (this.kanaScore === this.kanaRounds.length) window.japaneseQuiz?.triggerConfetti();
  }

  /* ========================================================
     2. NINJA DAS PARTÍCULAS (GRAMÁTICA EM CONTEXTO)
     ======================================================== */
  startParticleChallenge() {
    const questions = [
      { sentence: "わたし__学生です。", translation: "Eu sou estudante.", level: "N5", answer: "は", options: ["は", "を", "で"], note: "は apresenta o tópico da frase: “quanto a mim...”." },
      { sentence: "水__飲みます。", translation: "Bebo água.", level: "N5", answer: "を", options: ["が", "を", "に"], note: "を marca o objeto direto da ação 飲みます (beber)." },
      { sentence: "毎朝六時__起きます。", translation: "Acordo às seis toda manhã.", level: "N5", answer: "に", options: ["で", "に", "と"], note: "に marca um horário específico: 六時に (às seis)." },
      { sentence: "学校__日本語を勉強します。", translation: "Estudo japonês na escola.", level: "N5", answer: "で", options: ["へ", "で", "の"], note: "で indica o local onde uma ação acontece." },
      { sentence: "友達__映画を見ました。", translation: "Assisti a um filme com um amigo.", level: "N5", answer: "と", options: ["と", "が", "を"], note: "と significa “com” quando acompanha outra pessoa." },
      { sentence: "机の上__本があります。", translation: "Há um livro em cima da mesa.", level: "N5", answer: "に", options: ["を", "に", "は"], note: "に marca o local onde algo existe com あります." },
      { sentence: "これは田中さん__かばんです。", translation: "Esta é a bolsa do(a) Tanaka.", level: "N5", answer: "の", options: ["の", "も", "で"], note: "の conecta substantivos e indica posse: Tanaka no kaban." },
      { sentence: "図書館__本を読みます。", translation: "Leio um livro na biblioteca.", level: "N5", answer: "で", options: ["に", "と", "で"], note: "で marca o lugar em que a ação de ler acontece." },
    ];
    this.particleRounds = this.shuffle(questions);
    this.particleIndex = 0;
    this.particleScore = 0;
    this.particleLocked = false;
    document.getElementById("particleChallengeOptions").style.display = "grid";
    document.getElementById("particleChallengeResult").style.display = "none";
    document.getElementById("particleChallengeNext").style.display = "none";
    this.renderParticleQuestion();
  }

  renderParticleQuestion() {
    const question = this.particleRounds[this.particleIndex];
    if (!question) return;
    this.particleLocked = false;
    document.getElementById("particleChallengeCounter").textContent = `${this.particleIndex + 1} / ${this.particleRounds.length}`;
    document.getElementById("particleChallengeProgress").style.width = `${(this.particleIndex / this.particleRounds.length) * 100}%`;
    document.getElementById("particleChallengeLevel").textContent = `JLPT ${question.level}`;
    const sentence = document.getElementById("particleChallengeSentence");
    const [beforeBlank, afterBlank] = question.sentence.split("__");
    sentence.replaceChildren(document.createTextNode(beforeBlank));
    if (afterBlank !== undefined) {
      const blank = document.createElement("span");
      blank.className = "particle-blank";
      blank.setAttribute("role", "img");
      blank.setAttribute("aria-label", "espaço para a partícula");
      sentence.append(blank, document.createTextNode(afterBlank));
    }
    document.getElementById("particleChallengeTranslation").textContent = question.translation;
    document.getElementById("particleChallengeFeedback").textContent = "";
    document.getElementById("particleChallengeFeedback").className = "game-challenge-feedback particle-feedback";
    document.getElementById("particleChallengeNext").style.display = "none";
    const options = document.getElementById("particleChallengeOptions");
    options.innerHTML = "";
    this.shuffle(question.options).forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "particle-option";
      button.textContent = option;
      button.addEventListener("click", () => this.checkParticleAnswer(option));
      options.appendChild(button);
    });
  }

  checkParticleAnswer(answer) {
    if (this.particleLocked) return;
    this.particleLocked = true;
    const question = this.particleRounds[this.particleIndex];
    const isCorrect = answer === question.answer;
    const feedback = document.getElementById("particleChallengeFeedback");
    document.querySelectorAll("#particleChallengeOptions .particle-option").forEach(button => {
      button.disabled = true;
      if (button.textContent === question.answer) button.classList.add("is-answer");
      else if (button.textContent === answer) button.classList.add("is-incorrect");
    });
    if (isCorrect) {
      this.particleScore++;
      feedback.textContent = `Acertou! ${question.note}`;
      feedback.classList.add("is-correct");
      window.japaneseQuiz?.playSound("correct");
    } else {
      feedback.textContent = `A partícula certa é ${question.answer}. ${question.note}`;
      feedback.classList.add("is-wrong");
      window.japaneseQuiz?.playSound("wrong");
    }
    document.getElementById("particleChallengeNext").textContent =
      this.particleIndex + 1 === this.particleRounds.length ? "Ver resultado →" : "Próxima frase →";
    document.getElementById("particleChallengeNext").style.display = "inline-flex";
  }

  nextParticleQuestion() {
    this.particleIndex++;
    if (this.particleIndex >= this.particleRounds.length) {
      this.finishParticleChallenge();
      return;
    }
    this.renderParticleQuestion();
  }

  finishParticleChallenge() {
    document.getElementById("particleChallengeProgress").style.width = "100%";
    document.getElementById("particleChallengeOptions").style.display = "none";
    document.getElementById("particleChallengeFeedback").textContent = "";
    document.getElementById("particleChallengeNext").style.display = "none";
    document.getElementById("particleChallengeCounter").textContent = `${this.particleRounds.length} / ${this.particleRounds.length}`;
    document.getElementById("particleChallengeFinalScore").textContent = `Você acertou ${this.particleScore} de ${this.particleRounds.length} frases.`;
    document.getElementById("particleChallengeResult").style.display = "block";
    if (this.particleScore === this.particleRounds.length) window.japaneseQuiz?.triggerConfetti();
  }

  /* ========================================================
     3. JOGO DA MEMÓRIA JAPONÊS (MEMORY GAME)
     ======================================================== */
  startMemoryGame(mode = "hiragana") {
    const grid = document.getElementById("memoryGameGrid");
    const movesEl = document.getElementById("memoryMovesCounter");
    const resultBox = document.getElementById("memoryResultBox");
    if (!grid) return;

    if (resultBox) resultBox.style.display = "none";
    grid.style.display = "grid";

    this.memoryMoves = 0;
    this.memoryMatched = 0;
    this.memoryFlipped = [];
    this.memoryLocked = false;
    if (movesEl) movesEl.textContent = "0";

    document.querySelectorAll(".memory-mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    // Selecionar 6 itens aleatórios
    let pool = [];
    if (mode === "katakana") {
      pool = JAPANESE_DATA.katakana.basic.filter(i => i.char !== "");
    } else if (mode === "kanji") {
      pool = JAPANESE_DATA.kanji;
    } else {
      pool = JAPANESE_DATA.hiragana.basic.filter(i => i.char !== "");
    }

    const shuffledItems = [...pool].sort(() => 0.5 - Math.random()).slice(0, 6);

    // Criar pares: [Card com Caractere] e [Card com Romaji/Significado]
    let cards = [];
    shuffledItems.forEach((item, idx) => {
      const charVal = item.char || item.kanji;
      const textVal = item.romaji || item.meaning;

      // Carta A: Caractere Japonês
      cards.push({
        id: `pair-${idx}-a`,
        pairId: idx,
        type: "char",
        display: charVal,
        speechText: charVal
      });

      // Carta B: Tradução / Romaji
      cards.push({
        id: `pair-${idx}-b`,
        pairId: idx,
        type: "text",
        display: textVal,
        speechText: charVal
      });
    });

    // Embaralhar as 12 cartas
    this.memoryCards = cards.sort(() => 0.5 - Math.random());
    grid.innerHTML = "";

    this.memoryCards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "memory-card";
      cardEl.dataset.index = index;

      cardEl.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">
            <span>🌸</span>
          </div>
          <div class="memory-card-back ${card.type === 'char' ? 'char-font' : ''}">
            <span>${card.display}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener("click", () => this.handleCardClick(cardEl, index));
      grid.appendChild(cardEl);
    });
  }

  handleCardClick(cardEl, index) {
    if (this.memoryLocked) return;
    if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;

    cardEl.classList.add("flipped");
    this.memoryFlipped.push({ cardEl, data: this.memoryCards[index] });

    if (this.memoryFlipped.length === 2) {
      this.memoryMoves++;
      const movesEl = document.getElementById("memoryMovesCounter");
      if (movesEl) movesEl.textContent = this.memoryMoves;

      const [first, second] = this.memoryFlipped;
      if (first.data.pairId === second.data.pairId) {
        // Acertou o par!
        this.memoryMatched++;
        first.cardEl.classList.add("matched");
        second.cardEl.classList.add("matched");
        window.japaneseQuiz?.playSound("correct");
        window.app?.speakJapanese(first.data.speechText);

        this.memoryFlipped = [];

        if (this.memoryMatched === 6) {
          setTimeout(() => this.finishMemoryGame(), 600);
        }
      } else {
        // Errou o par
        this.memoryLocked = true;
        window.japaneseQuiz?.playSound("wrong");

        setTimeout(() => {
          first.cardEl.classList.remove("flipped");
          second.cardEl.classList.remove("flipped");
          this.memoryFlipped = [];
          this.memoryLocked = false;
        }, 900);
      }
    }
  }

  finishMemoryGame() {
    const grid = document.getElementById("memoryGameGrid");
    const resultBox = document.getElementById("memoryResultBox");
    const resultMoves = document.getElementById("memoryFinalMoves");

    if (grid) grid.style.display = "none";
    if (resultBox) resultBox.style.display = "block";
    if (resultMoves) resultMoves.textContent = this.memoryMoves;

    window.japaneseQuiz?.triggerConfetti();
    window.app?.unlockAchievement("memory_winner");
  }

  /* ========================================================
     2. SPEED RUN / CONTRA O TEMPO (30 SEGUNDOS)
     ======================================================== */
  startSpeedRun(mode = "hiragana") {
    this.speedScore = 0;
    this.speedCombo = 0;
    this.speedTimeLeft = 30;
    clearInterval(this.speedTimer);

    const playArea = document.getElementById("speedPlayArea");
    const finishArea = document.getElementById("speedFinishArea");
    const startBanner = document.getElementById("speedStartBanner");
    const scoreEl = document.getElementById("speedScoreDisplay");
    const timerBar = document.getElementById("speedTimerBar");

    if (startBanner) startBanner.style.display = "none";
    if (finishArea) finishArea.style.display = "none";
    if (playArea) playArea.style.display = "block";
    if (scoreEl) scoreEl.textContent = "0";

    this.nextSpeedQuestion(mode);

    this.speedTimer = setInterval(() => {
      this.speedTimeLeft--;
      const timeDisplay = document.getElementById("speedTimeDisplay");
      if (timeDisplay) timeDisplay.textContent = `${this.speedTimeLeft}s`;
      if (timerBar) timerBar.style.width = `${(this.speedTimeLeft / 30) * 100}%`;

      if (this.speedTimeLeft <= 5 && timerBar) {
        timerBar.style.background = "#ef4444";
      }

      if (this.speedTimeLeft <= 0) {
        clearInterval(this.speedTimer);
        this.finishSpeedRun();
      }
    }, 1000);
  }

  nextSpeedQuestion(mode) {
    let pool = [];
    if (mode === "katakana") pool = JAPANESE_DATA.katakana.basic.filter(i => i.char !== "");
    else if (mode === "kanji") pool = JAPANESE_DATA.kanji;
    else pool = JAPANESE_DATA.hiragana.basic.filter(i => i.char !== "");

    const item = pool[Math.floor(Math.random() * pool.length)];
    const isKanji = mode === "kanji";

    const questionChar = isKanji ? item.kanji : item.char;
    const correct = isKanji ? item.meaning : item.romaji;

    const distractors = pool
      .filter(i => (isKanji ? i.meaning : i.romaji) !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(i => isKanji ? i.meaning : i.romaji);

    const options = [...distractors, correct].sort(() => 0.5 - Math.random());

    this.speedCurrentQuestion = { questionChar, correct, options, mode };

    const charEl = document.getElementById("speedCharDisplay");
    const optionsGrid = document.getElementById("speedOptionsGrid");
    if (charEl) charEl.textContent = questionChar;

    if (optionsGrid) {
      optionsGrid.innerHTML = "";
      options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = opt;
        btn.onclick = () => this.handleSpeedAnswer(opt, correct, mode);
        optionsGrid.appendChild(btn);
      });
    }
  }

  handleSpeedAnswer(selected, correct, mode) {
    const isCorrect = selected === correct;
    const scoreEl = document.getElementById("speedScoreDisplay");
    const comboEl = document.getElementById("speedComboDisplay");

    if (isCorrect) {
      this.speedCombo++;
      const multiplier = this.speedCombo >= 3 ? 2 : 1;
      this.speedScore += (10 * multiplier);
      window.japaneseQuiz?.playSound("correct");
      if (comboEl) {
        comboEl.textContent = this.speedCombo >= 3 ? `🔥 Combo x${multiplier}!` : "";
      }
    } else {
      this.speedCombo = 0;
      window.japaneseQuiz?.playSound("wrong");
      if (comboEl) comboEl.textContent = "";
    }

    if (scoreEl) scoreEl.textContent = this.speedScore;
    this.nextSpeedQuestion(mode);
  }

  finishSpeedRun() {
    const playArea = document.getElementById("speedPlayArea");
    const finishArea = document.getElementById("speedFinishArea");
    const finalScoreEl = document.getElementById("speedFinalScore");
    const praiseEl = document.getElementById("speedPraiseText");

    if (playArea) playArea.style.display = "none";
    if (finishArea) finishArea.style.display = "block";
    if (finalScoreEl) finalScoreEl.textContent = `${this.speedScore} pts`;

    if (praiseEl) {
      if (this.speedScore >= 120) {
        praiseEl.textContent = "⚡ Impressionante! Seus reflexos estão afiados!";
        window.japaneseQuiz?.triggerConfetti();
        window.app?.unlockAchievement("speed_runner");
      } else if (this.speedScore >= 60) {
        praiseEl.textContent = "👏 Muito bom! Você já reconhece os caracteres com agilidade!";
      } else {
        praiseEl.textContent = "💪 Bom treino! Quanto mais você praticar, mais rápido fica!";
      }
    }
  }

  /* ========================================================
     3. CONSTRUTOR DE FRASES (SENTENCE BUILDER)
     ======================================================== */
  initSentenceBuilder() {
    this.sentenceIndex = 0;
    this.renderSentence();
  }

  renderSentence() {
    const sentences = JAPANESE_DATA.sentences;
    if (!sentences || sentences.length === 0) return;
    const s = sentences[this.sentenceIndex];

    const ptEl = document.getElementById("sbPortuguesePrompt");
    const explanationEl = document.getElementById("sbGrammarExplanation");
    const targetArea = document.getElementById("sbTargetSlots");
    const sourceArea = document.getElementById("sbSourceBlocks");
    const checkBtn = document.getElementById("sbCheckBtn");
    const counterEl = document.getElementById("sbCounter");

    if (ptEl) ptEl.textContent = `"${s.pt}"`;
    if (counterEl) counterEl.textContent = `Frase ${this.sentenceIndex + 1} de ${sentences.length} (${s.level})`;
    if (explanationEl) explanationEl.style.display = "none";

    this.sentenceSelectedBlocks = [];
    if (targetArea) {
      targetArea.innerHTML = '<span class="sb-placeholder">Toque nos blocos abaixo para montar a frase aqui...</span>';
    }

    if (sourceArea) {
      sourceArea.innerHTML = "";
      // Embaralhar os blocos
      const shuffledBlocks = [...s.blocks].sort(() => 0.5 - Math.random());
      shuffledBlocks.forEach((blockText, idx) => {
        const chip = document.createElement("button");
        chip.className = "sb-chip";
        chip.textContent = blockText;
        chip.onclick = () => this.selectSentenceBlock(chip, blockText);
        sourceArea.appendChild(chip);
      });
    }

    if (checkBtn) {
      checkBtn.textContent = "🔍 Verificar Frase";
      checkBtn.className = "btn-primary";
      checkBtn.onclick = () => this.checkSentence();
    }
  }

  selectSentenceBlock(chipEl, text) {
    const targetArea = document.getElementById("sbTargetSlots");
    const placeholder = targetArea.querySelector(".sb-placeholder");
    if (placeholder) placeholder.remove();

    chipEl.classList.add("used");
    chipEl.disabled = true;

    const block = document.createElement("button");
    block.className = "sb-chip active-slot";
    block.textContent = text;
    block.onclick = () => {
      // Remover do alvo e reabilitar na origem
      block.remove();
      chipEl.classList.remove("used");
      chipEl.disabled = false;
      this.sentenceSelectedBlocks = this.sentenceSelectedBlocks.filter(b => b !== text);

      if (targetArea.children.length === 0) {
        targetArea.innerHTML = '<span class="sb-placeholder">Toque nos blocos abaixo para montar a frase aqui...</span>';
      }
    };

    targetArea.appendChild(block);
    this.sentenceSelectedBlocks.push(text);
  }

  checkSentence() {
    const s = JAPANESE_DATA.sentences[this.sentenceIndex];
    const isCorrect = JSON.stringify(this.sentenceSelectedBlocks) === JSON.stringify(s.blocks);

    const explanationEl = document.getElementById("sbGrammarExplanation");
    const checkBtn = document.getElementById("sbCheckBtn");

    if (isCorrect) {
      window.japaneseQuiz?.playSound("correct");
      window.app?.speakJapanese(s.audio);
      window.app?.unlockAchievement("sentence_builder");

      if (explanationEl) {
        explanationEl.style.display = "block";
        explanationEl.innerHTML = `
          <div style="color: #10b981; font-weight: bold; margin-bottom: 0.35rem;">🎉 Frase Correta!</div>
          <div style="font-family: var(--font-jp); font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.25rem;">${s.audio}</div>
          <div style="color: var(--primary); font-size: 0.9rem; margin-bottom: 0.5rem;">${s.romaji}</div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${s.explanation}</p>
        `;
      }

      if (checkBtn) {
        checkBtn.textContent = "➡️ Próxima Frase";
        checkBtn.className = "btn-primary";
        checkBtn.onclick = () => {
          this.sentenceIndex = (this.sentenceIndex + 1) % JAPANESE_DATA.sentences.length;
          this.renderSentence();
        };
      }
    } else {
      window.japaneseQuiz?.playSound("wrong");
      if (explanationEl) {
        explanationEl.style.display = "block";
        explanationEl.innerHTML = `
          <div style="color: #ef4444; font-weight: bold;">❌ Ordem incorreta. Lembre-se: em japonês, o verbo vai no final!</div>
        `;
      }
    }
  }
}

window.japaneseGames = new JapaneseGames();
