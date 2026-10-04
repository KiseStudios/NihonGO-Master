/** Editorial home navigation and supporting interactions. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  class HomeScrollEffects {
    constructor(home) {
      this.home = home;
      this.nav = $(".editorial-nav");
      this.path = $(".jlpt-stops");
      this.stops = $$(".jlpt-stop");
      this.immersion = $(".japan-immersion");
      this.pathProgress = this.immersionScale = this.scrolled = null;
      this.geometryDirty = true;
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
      this.desktop = matchMedia("(min-width: 701px)");
      this.frame = null;
      const invalidate = () => {
        this.geometryDirty = true;
        this.schedule();
      };
      window.addEventListener("scroll", () => this.schedule(), { passive: true });
      window.addEventListener("resize", invalidate, {
        passive: true,
      });
      document.addEventListener("nihongo:screenchange", invalidate);
      this.reduced.addEventListener("change", () => this.schedule());
      this.desktop.addEventListener("change", () => this.schedule());
      this.resizeObserver = new ResizeObserver(invalidate);
      this.resizeObserver.observe(this.home);
      this.resizeObserver.observe(this.nav);
      document.fonts?.ready.then(invalidate);
      this.schedule();
    }
    schedule() {
      if (this.frame !== null) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        this.update();
      });
    }
    update() {
      const scroll = window.scrollY;
      const scrolled = scroll > 40;
      const active = this.home.classList.contains("active");
      const height = innerHeight;
      const motion = !this.reduced.matches && this.desktop.matches;
      // Cache document positions on layout changes. Reading sections below
      // the fold on every scroll would flush the hero's pending style writes.
      if (active && this.geometryDirty) {
        const pathRect = this.path.getBoundingClientRect();
        const imageRect = this.immersion.getBoundingClientRect();
        this.pathTop = pathRect.top + scroll;
        this.pathHeight = pathRect.height;
        this.immersionTop = imageRect.top + scroll;
        this.immersionHeight = imageRect.height;
        this.geometryDirty = false;
      }
      if (this.scrolled !== scrolled) {
        this.nav.classList.toggle("is-scrolled", scrolled);
        this.scrolled = scrolled;
      }
      if (!active) return;
      const pathProgress = this.reduced.matches
        ? 1
        : clamp((height * 0.72 - (this.pathTop - scroll)) / this.pathHeight);
      if (pathProgress !== this.pathProgress) {
        this.path.style.setProperty("--path-progress", pathProgress);
        this.stops.forEach((stop, index) =>
          stop.classList.toggle("is-passed", pathProgress >= index / 5),
        );
        this.pathProgress = pathProgress;
      }
      const imageTop = this.immersionTop - scroll;
      if (motion && imageTop < height && imageTop + this.immersionHeight > 0) {
        const scale = 1.01 + clamp((height - imageTop) / (height + this.immersionHeight)) * 0.04;
        if (scale !== this.immersionScale) {
          this.immersion.style.setProperty("--immersion-scale", scale);
          this.immersionScale = scale;
        }
      }
    }
  }

  // Pointer motion is local to the dark hero. Other sections keep their scroll effects.
  class TypographicHero {
    constructor(home) {
      this.home = home;
      this.hero = $("#reading-story");
      this.layers = [...this.hero.querySelectorAll("[data-depth-x]")];
      this.motion = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)");
      this.tablet = matchMedia("(max-width: 1100px)");
      this.current = { x: 0, y: 0 };
      this.target = { x: 0, y: 0 };
      this.frame = null;
      this.lastTime = null;
      this.bounds = null;
      this.tick = this.tick.bind(this);
      this.hero.addEventListener("pointerenter", (event) => this.move(event), { passive: true });
      this.hero.addEventListener("pointermove", (event) => this.move(event), { passive: true });
      this.hero.addEventListener("pointerleave", () => this.center(), { passive: true });
      this.hero.addEventListener("pointercancel", () => this.center(), { passive: true });
      // Scroll only invalidates geometry: it never drives an animation or a reveal.
      window.addEventListener("scroll", () => { this.bounds = null; }, { passive: true });
      window.addEventListener("resize", () => this.reset(), { passive: true });
      window.addEventListener("blur", () => this.reset());
      window.addEventListener("pagehide", () => this.reset());
      document.addEventListener("visibilitychange", () => this.reset());
      document.addEventListener("nihongo:screenchange", () => this.reset());
      this.motion.addEventListener("change", () => this.reset());
      this.tablet.addEventListener("change", () => this.reset());
      // Also refresh bounds when the existing navigation changes height.
      this.resizeObserver = new ResizeObserver(() => { this.bounds = null; });
      this.resizeObserver.observe(this.hero);
      this.resizeObserver.observe($(".editorial-nav"));
    }
    move(event) {
      if (!this.motion.matches || event.pointerType !== "mouse" || !this.home.classList.contains("active")) return;
      // Read once on entry, and again only after geometry becomes stale.
      this.bounds ??= this.hero.getBoundingClientRect();
      if (!this.bounds.width || !this.bounds.height) return;
      this.target.x = clamp(((event.clientX - this.bounds.left) / this.bounds.width - 0.5) * 2, -1, 1);
      this.target.y = clamp(((event.clientY - this.bounds.top) / this.bounds.height - 0.5) * 2, -1, 1);
      this.schedule();
    }
    center() {
      this.bounds = null;
      this.target.x = this.target.y = 0;
      if (this.motion.matches) this.schedule();
      else this.reset();
    }
    schedule() {
      if (this.frame !== null) return;
      this.hero.classList.add("is-pointer-moving");
      this.frame = requestAnimationFrame(this.tick);
    }
    tick(time) {
      this.frame = null;
      // Time-adjusted lerp keeps the same softness at 60 Hz and 120 Hz.
      const elapsed = this.lastTime === null ? 1000 / 60 : Math.min(time - this.lastTime, 50);
      this.lastTime = time;
      const blend = 1 - Math.pow(0.93, elapsed / (1000 / 60));
      this.current.x += (this.target.x - this.current.x) * blend;
      this.current.y += (this.target.y - this.current.y) * blend;
      const settled = Math.abs(this.target.x - this.current.x) < 0.0005 && Math.abs(this.target.y - this.current.y) < 0.0005;
      if (settled) Object.assign(this.current, this.target);
      const intensity = this.tablet.matches ? 0.6 : 1;
      for (const layer of this.layers) {
        const x = this.current.x * Number(layer.dataset.depthX) * intensity;
        const y = this.current.y * Number(layer.dataset.depthY) * intensity;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (!settled) this.schedule();
      else {
        this.lastTime = null;
        this.hero.classList.remove("is-pointer-moving");
      }
    }
    reset() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = this.lastTime = this.bounds = null;
      this.current.x = this.current.y = this.target.x = this.target.y = 0;
      this.hero.classList.remove("is-pointer-moving");
      this.layers.forEach((layer) => layer.style.removeProperty("transform"));
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const home = $("#screen-home");
    const menu = $("#editorial-menu");
    const toggle = $(".ed-menu-toggle");
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      $$(".ed-nav-group[open]").forEach((group) => {
        group.open = false;
      });
    };
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".ed-nav-group").forEach((group) =>
      group.addEventListener("toggle", () => {
        if (group.open)
          $$(".ed-nav-group")
            .filter((other) => other !== group)
            .forEach((other) => {
              other.open = false;
            });
      }),
    );
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".editorial-nav")) closeMenu();
      const link = event.target.closest("[data-screen]");
      if (!link) return;
      if (link.dataset.advancedTab)
        window.japaneseAdvanced?.switchTab(link.dataset.advancedTab);
      if (link.dataset.jlptLevel)
        window.japaneseAdvanced?.switchJlptLevel(link.dataset.jlptLevel);
      closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const openGroup = $(".ed-nav-group[open]");
      if (openGroup) openGroup.querySelector("summary").focus();
      else if (menu.classList.contains("is-open")) toggle.focus();
      closeMenu();
    });
    // History integration also works for existing programmatic navigation.
    let restoring = false;
    document.addEventListener("nihongo:screenchange", (event) => {
      const screen = event.detail.screenId;
      closeMenu();
      if (!restoring && location.hash !== `#${screen}`)
        history.pushState({ screen }, "", `#${screen}`);
      $$(".editorial-nav [data-screen]").forEach((link) => {
        if (link.dataset.screen === screen)
          link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
    const restoreRoute = () => {
      const id = location.hash.slice(1) || "home";
      if (["journey", "reading-story", "continue-studying"].includes(id)) {
        restoring = true;
        if (window.app.currentScreen !== "home") window.app.navigateTo("home");
        restoring = false;
        requestAnimationFrame(() =>
          document.getElementById(id).scrollIntoView(),
        );
        return;
      }
      const target = document.getElementById(`screen-${id}`);
      if (!target?.classList.contains("screen-view")) return;
      restoring = true;
      if (window.app.currentScreen !== id) window.app.navigateTo(id);
      restoring = false;
    };
    window.addEventListener("popstate", restoreRoute);
    window.addEventListener("hashchange", restoreRoute);
    restoreRoute();

    // Search reuses real application destinations; no remote service required.
    const destinations = [
      ["Hiragana", "ひらがな alfabeto básico sons", "hiragana"],
      ["Katakana", "カタカナ alfabeto estrangeiro", "katakana"],
      ["Kanji", "漢字 ideogramas significados", "kanji"],
      ["Dojo de Caligrafia", "書道 escrita traços prática", "practice"],
      ["Quiz", "練習 teste perguntas", "quiz"],
      ["Desafios", "挑戦 jogos memória", "games"],
      ["Do N5 ao N1 — JLPT", "gramática avançado níveis", "advanced", "jlpt"],
      [
        "Anime & listening",
        "audição shadowing falas imersão",
        "advanced",
        "anime",
      ],
      [
        "Cultura e expressões japonesas",
        "四字熟語 yojijukugo",
        "advanced",
        "yojijukugo",
      ],
      ["Japonês do cotidiano", "gírias conversas slang", "advanced", "slang"],
    ];
    const search = $("#home-search");
    const input = $("#home-search-input");
    const resultList = $("#home-search-results");
    const normalize = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    function searchDestinations() {
      const query = normalize(input.value.trim());
      resultList.replaceChildren();
      destinations
        .filter((item) => normalize(item.slice(0, 2).join(" ")).includes(query))
        .forEach(([title, , screen, tab]) => {
          const button = document.createElement("button");
          button.type = "button";
          const name = document.createElement("span");
          name.textContent = title;
          const arrow = document.createElement("span");
          arrow.textContent = "↗";
          arrow.setAttribute("aria-hidden", "true");
          button.append(name, arrow);
          button.addEventListener("click", () => {
            search.close();
            window.app.navigateTo(screen);
            if (tab) window.japaneseAdvanced.switchTab(tab);
          });
          resultList.append(button);
        });
      if (!resultList.children.length) {
        const empty = document.createElement("p");
        empty.textContent =
          "Nenhum módulo encontrado. Tente “kanji”, “anime” ou “caligrafia”.";
        resultList.append(empty);
      }
    }
    $("#homeSearchBtn").addEventListener("click", () => {
      input.value = "";
      searchDestinations();
      search.showModal();
      input.focus();
    });
    $("[data-close-search]").addEventListener("click", () => search.close());
    search.addEventListener("click", (event) => {
      const bounds = search.getBoundingClientRect();
      if (
        event.target === search &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        search.close();
    });
    input.addEventListener("input", searchDestinations);

    $("#daily-practice").addEventListener("click", () =>
      window.app.openPracticeForChar(
        $("#dailyKanjiChar").textContent,
        "Kanji do dia",
      ),
    );
    $("#home-listen").addEventListener("click", () => {
      const status = $("#listening-status");
      if (!("speechSynthesis" in window)) {
        status.textContent =
          "Áudio indisponível neste navegador. Leia: kikoeru?";
        return;
      }
      const voice = speechSynthesis
        .getVoices()
        .find((item) => item.lang.startsWith("ja"));
      if (!voice) {
        status.textContent =
          "Ative uma voz japonesa no dispositivo para ouvir. Leitura: kikoeru?";
        return;
      }
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("聞こえる？");
      utterance.lang = "ja-JP";
      utterance.voice = voice;
      utterance.rate = window.app.userSettings.voiceRate || 0.85;
      utterance.onstart = () => {
        status.textContent = "Ouvindo: 聞こえる？";
      };
      utterance.onend = () => {
        status.textContent = "Sua vez: kikoeru? — Você consegue ouvir?";
      };
      utterance.onerror = () => {
        status.textContent = "Não foi possível reproduzir. Tente novamente.";
      };
      speechSynthesis.speak(utterance);
      window.app.incrementPracticed();
    });
    $("#home-proverb").addEventListener("click", () =>
      window.app.speakJapanese("七転八起"),
    );
    $("#footer-year").textContent = new Date().getFullYear();
    const preview = $("#learning-preview");
    const photo = $(".learning-photo");
    const previews = {
      kyoto: [
        "assets/images/kyoto-800.webp",
        "Pagode e arquitetura tradicional de Kyoto",
      ],
      street: [
        "assets/images/street-600.webp",
        "Arquitetura e placas em uma rua tranquila de Kyoto",
      ],
    };
    $$(".learning-row").forEach((row) => {
      const showPreview = () => {
        if (!matchMedia("(min-width: 801px)").matches) return;
        const [src, alt] = previews[row.dataset.preview];
        preview.src = src;
        preview.alt = alt;
        photo.style.setProperty("--preview-scale", "1.025");
      };
      row.addEventListener("pointerenter", showPreview);
      row.addEventListener("focus", showPreview);
      row.addEventListener("pointermove", (event) => {
        if (
          !matchMedia(
            "(pointer: fine) and (min-width: 801px) and (prefers-reduced-motion: no-preference)",
          ).matches
        )
          return;
        const rect = row.getBoundingClientRect();
        photo.style.setProperty(
          "--preview-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`,
        );
        photo.style.setProperty(
          "--preview-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`,
        );
      });
      const reset = () => {
        photo.style.removeProperty("--preview-scale");
        photo.style.removeProperty("--preview-x");
        photo.style.removeProperty("--preview-y");
      };
      row.addEventListener("pointerleave", reset);
      row.addEventListener("blur", reset);
    });
    new HomeScrollEffects(home);
    new TypographicHero(home);
  });
})();
