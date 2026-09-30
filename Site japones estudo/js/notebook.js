/**
 * Módulo de Caderno de Estudos Interativo (NihonGo Notebook)
 * Permite criar anotações, categorizar por tags, fixar no topo e anexar imagens locais/URLs
 */

class JapaneseNotebook {
  constructor() {
    this.notes = this.loadNotes();
    this.currentImageBase64 = null;
    this.activeFilter = "all";

    this.init();
  }

  loadNotes() {
    const saved = localStorage.getItem("nihongo_user_notes");
    if (!saved) {
      // Anotação de boas-vindas padrão
      return [
        {
          id: "welcome-note",
          title: "🌸 Bem-vindo ao seu Caderno de Estudos!",
          content: "Use este espaço para anotar regras gramaticais, palavras novas que você aprendeu, dúvidas ou colar imagens de tabelas e fotos para revisar sempre que quiser.\n\nExperimente clicar em 📌 para fixar uma nota no topo!",
          tag: "Dicas",
          isPinned: true,
          image: null,
          date: new Date().toLocaleDateString("pt-BR")
        }
      ];
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }

  saveNotes() {
    try {
      localStorage.setItem("nihongo_user_notes", JSON.stringify(this.notes));
    } catch (e) {
      alert("Aviso: O armazenamento local está cheio. Tente usar imagens menores.");
    }
    this.renderNotes();
  }

  init() {
    this.attachEvents();
    this.renderNotes();
  }

  toggleSidebar() {
    const sidebar = document.getElementById("notebookSidebar");
    const overlay = document.getElementById("notebookOverlay");
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains("open");
    sidebar.classList.toggle("open", !isOpen);
    if (overlay) overlay.classList.toggle("open", !isOpen);
  }

  closeSidebar() {
    const sidebar = document.getElementById("notebookSidebar");
    const overlay = document.getElementById("notebookOverlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

  openSidebar() {
    const sidebar = document.getElementById("notebookSidebar");
    const overlay = document.getElementById("notebookOverlay");
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }

  openNotebook() {
    this.openSidebar();
  }

  attachEvents() {
    // Botão de alternar caderno na barra ou flutuante
    const toggleBtns = document.querySelectorAll(".toggle-notebook-btn");
    toggleBtns.forEach(btn => btn.addEventListener("click", () => this.toggleSidebar()));

    const closeBtn = document.getElementById("closeNotebookBtn");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeSidebar());

    const overlay = document.getElementById("notebookOverlay");
    if (overlay) overlay.addEventListener("click", () => this.closeSidebar());

    // Formulário de Nova Anotação
    const form = document.getElementById("newNoteForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addNote();
      });
    }

    // Upload de Imagem via Arquivo
    const fileInput = document.getElementById("noteImageUpload");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert("Por favor, selecione uma imagem de até 2MB.");
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            this.currentImageBase64 = event.target.result;
            const preview = document.getElementById("noteImagePreview");
            const previewImg = document.getElementById("notePreviewImg");
            if (preview && previewImg) {
              previewImg.src = this.currentImageBase64;
              preview.style.display = "flex";
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Remover imagem antes de salvar
    const removeImgBtn = document.getElementById("removePreviewImgBtn");
    if (removeImgBtn) {
      removeImgBtn.addEventListener("click", () => {
        this.currentImageBase64 = null;
        const preview = document.getElementById("noteImagePreview");
        const fileInput = document.getElementById("noteImageUpload");
        if (preview) preview.style.display = "none";
        if (fileInput) fileInput.value = "";
      });
    }

    // Filtros de Tag
    document.querySelectorAll(".note-filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".note-filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.activeFilter = pill.dataset.tag;
        this.renderNotes();
      });
    });

    // Inserção rápida de caracteres japoneses no campo de texto
    document.querySelectorAll(".quick-insert-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const char = btn.dataset.char;
        const textarea = document.getElementById("noteContentInput");
        if (textarea && char) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const val = textarea.value;
          textarea.value = val.substring(0, start) + char + val.substring(end);
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + char.length;
        }
      });
    });
  }

  addNote() {
    const titleInput = document.getElementById("noteTitleInput");
    const contentInput = document.getElementById("noteContentInput");
    const tagSelect = document.getElementById("noteTagSelect");

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const tag = tagSelect ? tagSelect.value : "Geral";

    if (!title && !content && !this.currentImageBase64) {
      alert("Por favor, preencha o título, o texto ou anexe uma imagem.");
      return;
    }

    const newNote = {
      id: "note-" + Date.now(),
      title: title || "Sem Título",
      content: content,
      tag: tag,
      isPinned: false,
      image: this.currentImageBase64,
      date: new Date().toLocaleDateString("pt-BR")
    };

    this.notes.unshift(newNote);
    this.saveNotes();

    // Resetar formulário
    titleInput.value = "";
    contentInput.value = "";
    this.currentImageBase64 = null;
    const preview = document.getElementById("noteImagePreview");
    const fileInput = document.getElementById("noteImageUpload");
    if (preview) preview.style.display = "none";
    if (fileInput) fileInput.value = "";

    window.japaneseQuiz?.playSound("correct");
    window.app?.unlockAchievement("notebook_used");
  }

  togglePin(id) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.isPinned = !note.isPinned;
      this.saveNotes();
    }
  }

  deleteNote(id) {
    if (confirm("Tem certeza que deseja apagar esta anotação?")) {
      this.notes = this.notes.filter(n => n.id !== id);
      this.saveNotes();
    }
  }

  renderNotes() {
    const container = document.getElementById("notesListContainer");
    if (!container) return;
    container.innerHTML = "";

    let filtered = this.notes;
    if (this.activeFilter !== "all") {
      filtered = filtered.filter(n => n.tag === this.activeFilter);
    }

    // Ordenar: Fixadas primeiro
    filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📝</div>
          <p>Nenhuma anotação nesta categoria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(note => {
      const card = document.createElement("div");
      card.className = `note-card ${note.isPinned ? 'pinned' : ''}`;

      card.innerHTML = `
        <div class="note-card-header">
          <div>
            <span class="note-tag-badge">${note.tag}</span>
            <span class="note-date">${note.date}</span>
          </div>
          <div class="note-actions">
            <button class="note-action-btn ${note.isPinned ? 'active-pin' : ''}" title="${note.isPinned ? 'Desafixar' : 'Fixar no topo'}">
              📌
            </button>
            <button class="note-action-btn delete-btn" title="Excluir anotação">
              🗑️
            </button>
          </div>
        </div>

        <h4 class="note-title">${note.title}</h4>
        ${note.content ? `<p class="note-body">${note.content.replace(/\n/g, '<br>')}</p>` : ''}

        ${note.image ? `
          <div class="note-image-wrapper">
            <img src="${note.image}" alt="Imagem anexada" class="note-attached-img" onclick="window.japaneseNotebook.openImageModal('${note.image}')">
            <span class="note-image-zoom-hint">🔍 Clique para ampliar</span>
          </div>
        ` : ''}
      `;

      // Eventos
      const pinBtn = card.querySelector(".note-action-btn");
      const delBtn = card.querySelector(".delete-btn");

      if (pinBtn) pinBtn.onclick = () => this.togglePin(note.id);
      if (delBtn) delBtn.onclick = () => this.deleteNote(note.id);

      container.appendChild(card);
    });
  }

  openImageModal(imgSrc) {
    const modal = document.getElementById("notebookImageModal");
    const imgEl = document.getElementById("modalEnlargedImg");
    if (modal && imgEl) {
      imgEl.src = imgSrc;
      modal.classList.add("open");
    }
  }

  closeImageModal() {
    const modal = document.getElementById("notebookImageModal");
    if (modal) modal.classList.remove("open");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.japaneseNotebook = new JapaneseNotebook();
});
