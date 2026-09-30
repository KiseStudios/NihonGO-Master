/**
 * Sistema de Quiz e Avaliação Interativa
 * Suporta Hiragana, Katakana, Kanji e Teste de Áudio
 */

class JapaneseQuiz {
  constructor() {
    this.currentMode = "hiragana"; // hiragana, katakana, kanji, audio
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.totalQuestions = 10;
    this.streak = 0;
    this.bestStreak = 0;
    this.audioContext = null;

    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {
      console.warn("AudioContext não suportado neste navegador.");
    }
  }

  // Sons Sintetizados via Web Audio API (100% offline e sem arquivos externos)
  playSound(type) {
    if (window.app && window.app.userSettings && window.app.userSettings.soundEffects === false) return;
    if (!this.audioContext) return;
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;

    if (type === "correct") {
      // Tom agudo alegre (arpeggio de vitória)
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "wrong") {
      // Tom baixo de erro
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  startQuiz(mode = "hiragana", count = 10) {
    this.currentMode = mode;
    this.totalQuestions = count;
    this.currentIndex = 0;
    this.score = 0;
    this.questions = this.generateQuestions(mode, count);

    const container = document.getElementById("quizPlayArea");
    const resultBox = document.getElementById("quizResultBox");
    if (container) container.style.display = "block";
    if (resultBox) resultBox.style.display = "none";

    // Destacar o botão de modo selecionado
    document.querySelectorAll("#screen-quiz [data-quiz-mode]").forEach(btn => {
      if (btn.getAttribute("data-quiz-mode") === mode) {
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-outline");
      } else {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
      }
    });

    this.renderQuestion();
  }

  generateQuestions(mode, count) {
    let pool = [];

    if (mode === "hiragana" || mode === "audio") {
      pool = JAPANESE_DATA.hiragana.basic.filter(item => item.char !== "");
    } else if (mode === "katakana") {
      pool = JAPANESE_DATA.katakana.basic.filter(item => item.char !== "");
    } else if (mode === "kanji") {
      pool = JAPANESE_DATA.kanji;
    }

    // Embaralhar o pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map(item => {
      let questionText, prompt, correctAnswer, options;

      if (mode === "kanji") {
        questionText = item.kanji;
        prompt = `Qual o significado deste Kanji?`;
        correctAnswer = item.meaning;

        // Pegar 3 alternativas erradas
        const distractors = pool
          .filter(k => k.meaning !== item.meaning)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(k => k.meaning);

        options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
      } else if (mode === "audio") {
        questionText = "🔊 Clique para ouvir";
        prompt = "Qual caractere corresponde ao som reproduzido?";
        correctAnswer = item.char;

        const distractors = pool
          .filter(k => k.char !== item.char)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(k => k.char);

        options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
      } else {
        // Hiragana ou Katakana regular
        questionText = item.char;
        prompt = `Qual a leitura em Romaji de:`;
        correctAnswer = item.romaji;

        const distractors = pool
          .filter(k => k.romaji !== item.romaji)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(k => k.romaji);

        options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
      }

      return {
        item,
        questionText,
        prompt,
        correctAnswer,
        options
      };
    });
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    const q = this.questions[this.currentIndex];

    // Atualizar Barra de Progresso
    const progressFill = document.getElementById("quizProgressFill");
    const progressLabel = document.getElementById("quizProgressText");
    const pct = ((this.currentIndex) / this.totalQuestions) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressLabel) progressLabel.textContent = `Pergunta ${this.currentIndex + 1} de ${this.totalQuestions}`;

    // Atualizar Pergunta
    const promptEl = document.getElementById("quizPromptText");
    const charEl = document.getElementById("quizCharDisplay");
    if (promptEl) promptEl.textContent = q.prompt;
    if (charEl) {
      charEl.textContent = q.questionText;
      charEl.onclick = () => {
        if (this.currentMode === "audio") {
          window.app?.speakJapanese(q.item.char);
        } else {
          window.app?.speakJapanese(q.item.char || q.item.kanji);
        }
      };

      // Se for áudio, tocar automaticamente
      if (this.currentMode === "audio") {
        setTimeout(() => {
          window.app?.speakJapanese(q.item.char);
        }, 200);
      }
    }

    // Renderizar Opções
    const optionsGrid = document.getElementById("quizOptionsContainer");
    if (optionsGrid) {
      optionsGrid.innerHTML = "";
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = opt;
        btn.onclick = () => this.handleAnswer(opt, btn, q.correctAnswer);
        optionsGrid.appendChild(btn);
      });
    }
  }

  handleAnswer(selected, buttonEl, correct) {
    const allButtons = document.querySelectorAll(".quiz-option-btn");
    allButtons.forEach(btn => btn.disabled = true);

    const isCorrect = selected === correct;

    if (isCorrect) {
      buttonEl.classList.add("correct");
      this.score++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.playSound("correct");
    } else {
      buttonEl.classList.add("wrong");
      this.streak = 0;
      this.playSound("wrong");

      // Destacar a alternativa certa
      allButtons.forEach(btn => {
        if (btn.textContent === correct) {
          btn.classList.add("correct");
        }
      });
    }

    // Próxima pergunta após 1 segundo
    setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 1100);
  }

  finishQuiz() {
    const progressFill = document.getElementById("quizProgressFill");
    if (progressFill) progressFill.style.width = `100%`;

    const container = document.getElementById("quizPlayArea");
    const resultBox = document.getElementById("quizResultBox");
    if (container) container.style.display = "none";
    if (resultBox) resultBox.style.display = "block";

    const scoreDisplay = document.getElementById("quizFinalScore");
    const scoreMessage = document.getElementById("quizScoreMessage");
    const percentage = Math.round((this.score / this.totalQuestions) * 100);

    if (scoreDisplay) scoreDisplay.textContent = `${this.score} / ${this.totalQuestions}`;
    if (scoreMessage) {
      if (percentage === 100) {
        scoreMessage.textContent = "🏆 Perfeito! Parabéns, você gabaritou!";
        this.triggerConfetti();
      } else if (percentage >= 70) {
        scoreMessage.textContent = "✨ Muito bom! Você está evoluindo rápido no Japonês!";
        this.triggerConfetti();
      } else {
        scoreMessage.textContent = "💪 Continue praticando! A repetição é a chave do japonês!";
      }
    }

    // Salvar estatísticas no localStorage
    if (window.app) {
      window.app.recordQuizResult(this.score, this.totalQuestions);
    }
  }

  // Efeito de Confete festivo em Canvas
  triggerConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#e11d48", "#fb7185", "#0284c7", "#10b981", "#fbbf24", "#8b5cf6"];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // Gravidade
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    };

    render();
  }
}

window.japaneseQuiz = new JapaneseQuiz();
