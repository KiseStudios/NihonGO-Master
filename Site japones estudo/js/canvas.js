/**
 * Dojo de Caligrafia - Lógica do Quadro de Prática Interativa
 * Permite desenhar com toque/mouse, ativar guia fantasma e limpar o canvas
 */

class CalligraphyDojo {
  constructor() {
    this.canvas = document.getElementById("strokeCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.ghost = document.getElementById("ghostCharacter");
    this.isDrawing = false;
    this.currentColor = "#1e293b";
    this.lineWidth = 10;
    this.currentChar = "あ";

    this.initCanvasSize();
    this.attachEvents();
  }

  initCanvasSize() {
    // Definir resolução real do canvas
    this.canvas.width = 300;
    this.canvas.height = 300;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.lineWidth;
  }

  attachEvents() {
    // Eventos de Mouse
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    window.addEventListener("mouseup", () => this.stopDrawing());

    // Eventos de Toque (Mobile & Tablets)
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.startDrawing(touch);
    }, { passive: false });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.draw(touch);
    }, { passive: false });

    window.addEventListener("touchend", () => this.stopDrawing());

    // Botões de Ação
    const clearBtn = document.getElementById("clearCanvasBtn");
    if (clearBtn) clearBtn.addEventListener("click", () => this.clear());

    const toggleGhostBtn = document.getElementById("toggleGhostBtn");
    if (toggleGhostBtn) {
      toggleGhostBtn.addEventListener("click", () => {
        if (this.ghost) {
          const isHidden = this.ghost.style.opacity === "0";
          this.ghost.style.opacity = isHidden ? "0.7" : "0";
          toggleGhostBtn.classList.toggle("active", !isHidden);
        }
      });
    }
  }

  getCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  startDrawing(e) {
    this.isDrawing = true;
    const coords = this.getCoordinates(e);
    this.ctx.beginPath();
    this.ctx.moveTo(coords.x, coords.y);
    window.app?.unlockAchievement("calligraphy_master");
  }

  draw(e) {
    if (!this.isDrawing) return;
    const coords = this.getCoordinates(e);
    
    // Suavização do traço estilo pincel japonês
    this.ctx.lineTo(coords.x, coords.y);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setCharacter(char, info = "") {
    this.currentChar = char;
    this.clear();
    if (this.ghost) {
      this.ghost.textContent = char;
      this.ghost.style.opacity = "0.7";
    }

    const titleEl = document.getElementById("practiceCharTitle");
    const descEl = document.getElementById("practiceCharDesc");
    if (titleEl) titleEl.textContent = char;
    if (descEl) descEl.textContent = info;
  }
}

// Inicializar quando o DOM estiver pronto
window.addEventListener("DOMContentLoaded", () => {
  window.calligraphyDojo = new CalligraphyDojo();
});
