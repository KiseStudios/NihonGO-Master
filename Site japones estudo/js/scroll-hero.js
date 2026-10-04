/** Scroll-controlled opening: independently initialized from the study application. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const mapRange = (value, start, end, from = 0, to = 1) =>
    from + clamp((value - start) / (end - start)) * (to - from);

  // Sample the existing optimized files, without re-encoding or deleting sources.
  // Inclusive endpoints: logical 1 -> source 1, logical 120 -> source 240.
  const HERO_SOURCE_COUNT = 240;
  const HERO_FRAME_COUNT = 120;
  const HERO_FIRST_BATCH = 16;
  const HERO_SOURCES = Array.from({ length: HERO_FRAME_COUNT }, (_, index) =>
    Math.round(index * (HERO_SOURCE_COUNT - 1) / (HERO_FRAME_COUNT - 1)) + 1);
  const heroFrameURL = (index, width) =>
    `telainicial/optimized/${width}/frame_${String(HERO_SOURCES[index]).padStart(3, "0")}.webp`;
  const DEBUG_HERO = new URLSearchParams(location.search).get("heroDebug") === "1";
  const POINTER_AXES = ["x", "y"];

  function drawImageCover(context, image, width, height) {
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const scale = Math.max(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    // Opaque images cover every pixel. No clearRect between frames = no white flash.
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2,
      drawWidth, drawHeight);
  }

  class HeroFrameStore {
    constructor(hero) {
      this.hero = hero;
      this.images = new Map();
      this.blobs = new Map();
      this.rawRequests = new Map();
      this.decoding = new Set();
      this.failed = new Set();
      this.loaded = new Set();
      this.blobBytes = this.decodedBytes = 0;
      this.decodeActive = this.backgroundActive = 0;
      this.priority = new Int16Array(24);
      this.priorityCount = 0;
      this.current = this.target = -1;
      this.direction = 1;
      this.preloadIndex = 0;
      this.timer = null;
      this.wakeAt = 0;
      this.configure();
    }
    configure() {
      const width = this.hero.assetWidth;
      this.budget = (this.hero.mobile.matches ? 40 : this.hero.lowPower ? 48 : 96) * 1024 * 1024;
      this.blobBudget = (this.hero.mobile.matches ? 16 : 32) * 1024 * 1024;
      this.limit = Math.max(6, Math.min(24, Math.floor(this.budget / (width * width * 9 / 16 * 4))));
      if (this.variant !== width) {
        this.variant = width;
        this.preloadIndex = 0;
        this.loaded.clear();
        for (let index = 0; index < HERO_FRAME_COUNT; index++) {
          if (this.blobs.has(`${width}/${index}`)) this.loaded.add(index);
        }
        this.hero.hero.dataset.loadedFrames = String(this.loaded.size);
      }
      this.current = -1;
      this.trim();
    }
    rank(index) {
      for (let rank = 0; rank < this.priorityCount; rank++) {
        if (this.priority[rank] === index) return rank;
      }
      return 100 + Math.abs(index - this.hero.currentFrame);
    }
    addPriority(index) {
      if (index < 0 || index >= HERO_FRAME_COUNT || this.priorityCount >= this.limit - 1) return;
      for (let i = 0; i < this.priorityCount; i++) if (this.priority[i] === index) return;
      this.priority[this.priorityCount++] = index;
    }
    aim(current, target, direction) {
      if (current === this.current && target === this.target && direction === this.direction) return;
      this.current = current;
      this.target = target;
      this.direction = direction;
      this.priorityCount = 0;
      this.addPriority(current);
      this.addPriority(target);
      // Reserve roughly 3/4 of the window for frames ahead of the movement.
      const ahead = Math.max(4, Math.floor((this.limit - 2) * 0.75));
      for (let offset = 1; offset <= ahead; offset++) this.addPriority(current + direction * offset);
      for (let offset = 1; offset < this.limit && this.priorityCount < this.limit - 1; offset++) {
        this.addPriority(current - direction * offset);
        this.addPriority(current + direction * (ahead + offset));
      }
      this.wake();
    }
    async raw(index, width = this.variant, urgent = false) {
      const key = `${width}/${index}`;
      if (this.blobs.has(key)) return this.blobs.get(key);
      if (this.rawRequests.has(key)) return this.rawRequests.get(key);
      const request = (async () => {
        const attempts = urgent ? 3 : 2;
        let blob;
        for (let attempt = 0; attempt < attempts; attempt++) {
          try {
            const response = await fetch(heroFrameURL(index, width), {
              cache: attempt === 0 ? "force-cache" : "reload",
              priority: urgent || index < HERO_FIRST_BATCH ? "high" : "low",
            });
            if (!response.ok) throw new Error(`Frame ${index + 1}: HTTP ${response.status}`);
            blob = await response.blob();
            break;
          } catch (error) {
            if (attempt === attempts - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 150 : 400));
          }
        }
        this.blobs.set(key, blob);
        this.blobBytes += blob.size;
        if (width === this.variant) this.loaded.add(index);
        for (const [oldKey, oldBlob] of this.blobs) {
          if (this.blobBytes <= this.blobBudget) break;
          this.blobs.delete(oldKey);
          this.blobBytes -= oldBlob.size;
        }
        this.hero.hero.dataset.loadedFrames = String(this.loaded.size);
        this.hero.hero.dataset.compressedBytes = String(this.blobBytes);
        return blob;
      })();
      this.rawRequests.set(key, request);
      try { return await request; }
      finally { this.rawRequests.delete(key); }
    }
    async decode(index, width) {
      // Only ready compressed files enter the decoder. Slow downloads must not
      // occupy its slots, and stale windows must not spend time decoding.
      const blob = this.blobs.get(`${width}/${index}`);
      if (!blob || width !== this.variant || this.rank(index) >= 100) return;
      let image;
      if (typeof window.createImageBitmap === "function") {
        try { image = await createImageBitmap(blob); }
        catch { /* Fall back to native Image decoding. */ }
      }
      if (!image) {
        const url = URL.createObjectURL(blob);
        try {
          image = await new Promise((resolve, reject) => {
            const fallback = new Image();
            fallback.decoding = "async";
            fallback.onload = () => resolve(fallback);
            fallback.onerror = reject;
            fallback.src = url;
          });
          // onload alone does not guarantee a decoded image in every browser.
          await image.decode();
        } finally { URL.revokeObjectURL(url); }
      }
      // Old requests may finish after a reversal or a resolution change.
      if (width !== this.variant || this.rank(index) >= 100 && index !== this.hero.lastDrawn) {
        image.close?.();
        return;
      }
      const previous = this.images.get(index);
      if (previous) { previous.image.close?.(); this.decodedBytes -= previous.bytes; }
      const bytes = (image.naturalWidth || image.width) * (image.naturalHeight || image.height) * 4;
      this.images.set(index, { image, resolution: width, bytes });
      this.decodedBytes += bytes;
      this.trim();
      // Neighbor decoding must not start redundant animation frames.
      if (index === this.hero.currentFrame || this.hero.drawDirty) this.hero.schedule();
    }
    trim() {
      while (this.images.size > this.limit || this.decodedBytes > this.budget) {
        let victim = -1;
        let worst = -1;
        for (const [index] of this.images) {
          if (index === this.hero.lastDrawn || index === this.hero.currentFrame || index === this.hero.targetFrame) continue;
          const rank = this.rank(index);
          if (rank > worst) { worst = rank; victim = index; }
        }
        if (victim < 0) break;
        const entry = this.images.get(victim);
        entry.image.close?.();
        this.decodedBytes -= entry.bytes;
        this.images.delete(victim);
      }
      this.hero.hero.dataset.cachedFrames = String(this.images.size);
      this.hero.hero.dataset.decodedBytes = String(this.decodedBytes);
    }
    get(index) { return this.images.get(index)?.image; }
    nextDecode() {
      for (let i = 0; i < this.priorityCount; i++) {
        const index = this.priority[i];
        const key = `${this.variant}/${index}`;
        const entry = this.images.get(index);
        if (this.blobs.has(key) && (!entry || entry.resolution !== this.variant) &&
            !this.decoding.has(key) && !this.failed.has(key)) return index;
      }
      return -1;
    }
    nextPreload() {
      // Warm the opening batch first, then visit every remaining compressed file.
      while (this.preloadIndex < HERO_FRAME_COUNT) {
        const index = this.preloadIndex++;
        const key = `${this.variant}/${index}`;
        if (!this.blobs.has(key) && !this.rawRequests.has(key) && !this.failed.has(key)) return index;
      }
      return -1;
    }
    markFailed(key) {
      this.failed.add(key);
      this.hero.hero.dataset.failedFrames = String(this.failed.size);
      // A missing frame must not disable the rest of an otherwise valid sequence.
      if (this.failed.size === 1) console.warn("NihonGO: frame indisponível; preservando a última imagem válida.");
    }
    wake(delay = 0) {
      const at = performance.now() + delay;
      if (this.timer !== null && this.wakeAt <= at) return;
      clearTimeout(this.timer);
      this.wakeAt = at;
      this.timer = setTimeout(() => { this.timer = null; this.pump(); }, delay);
    }
    request(index, urgent = false, background = false) {
      const width = this.variant;
      const key = `${width}/${index}`;
      if (index < 0 || this.blobs.has(key) || this.rawRequests.has(key) || this.failed.has(key)) return;
      if (background) this.backgroundActive++;
      this.raw(index, width, urgent).catch(() => this.markFailed(key)).finally(() => {
        if (background) this.backgroundActive--;
        this.wake();
      });
    }
    pump() {
      if (!this.hero.canLoad()) return;
      const concurrency = this.hero.mobile.matches || this.hero.lowPower ? 2 : 3;
      const fetchLimit = concurrency + 2;
      // Reserve one extra network slot for the exact frame after a jump or
      // reversal. Neighbor downloads never block the actual decoder.
      if (this.hero.inView && this.rawRequests.size < fetchLimit + 1) this.request(this.current, true);
      while (this.hero.inView && this.decodeActive < concurrency) {
        const index = this.nextDecode();
        if (index < 0) break;
        const width = this.variant;
        const key = `${width}/${index}`;
        this.decodeActive++;
        this.decoding.add(key);
        this.decode(index, width).catch(() => this.markFailed(key)).finally(() => {
          this.decodeActive--;
          this.decoding.delete(key);
          this.wake();
        });
      }
      // Keep at least one background slot alive, including outside the hero.
      // Only decoded neighbors pause there; compressed preload finishes all 120.
      const backgroundSlots = this.hero.isScrolling ? 1 : 2;
      while (this.backgroundActive < backgroundSlots && this.rawRequests.size < fetchLimit) {
        const index = this.nextPreload();
        if (index < 0) break;
        this.request(index, false, true);
      }
      if (this.hero.inView) {
        for (let rank = 0; rank < this.priorityCount && this.rawRequests.size < fetchLimit; rank++) {
          this.request(this.priority[rank], true);
        }
      }
    }
    pause() { clearTimeout(this.timer); this.timer = null; }
  }

  class ScrollSequenceHero {
    constructor(home) {
      this.home = home;
      this.hero = $(".scroll-hero");
      this.sticky = this.hero.querySelector(".scroll-hero-sticky");
      this.canvas = $("#heroSequenceCanvas");
      this.context = this.canvas.getContext("2d", { alpha: false });
      this.stages = [...this.hero.querySelectorAll(".hero-story-stage")];
      this.stageStates = this.stages.map(element => ({
        element, style: element.style,
        start: Number(element.dataset.start), end: Number(element.dataset.end),
        visible: null, inert: null, opacity: null, y: null, parallax: null,
      }));
      this.nav = $(".editorial-nav");
      this.title = $("#home-title");
      this.percent = this.hero.querySelector(".hero-progress-percent");
      this.chapter = this.hero.querySelector(".hero-progress-chapter");
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
      this.mobile = matchMedia("(max-width: 700px)");
      this.pointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px)");
      const memory = navigator.deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 4;
      this.lowPower = memory <= 4 || cores <= 4 || Boolean(navigator.connection?.saveData);
      this.hero.dataset.quality = this.lowPower ? "balanced" : "high";
      this.hero.dataset.engine = "scroll-v6";
      this.hero.dataset.frameCount = String(HERO_FRAME_COUNT);
      this.lastScrollAt = -Infinity;
      this.requestedFrame = -1;
      this.currentFrame = this.targetFrame = 0;
      this.scrollDirection = 1;
      this.progress = this.targetProgress = 0;
      this.targetChangedAt = 0;
      this.scrollRoot = document.scrollingElement;
      this.scrollPosition = window.scrollY;
      this.geometryDirty = this.sizeDirty = this.forceSync = true;
      this.lastDrawn = -1;
      this.lastStoryProgress = -1;
      this.frame = this.lastTime = null;
      this.dirty = this.drawDirty = true;
      this.currentPointer = { x: 0, y: 0 };
      this.targetPointer = { x: 0, y: 0 };
      this.store = new HeroFrameStore(this);
      this.tick = this.tick.bind(this);
      this.failed = !this.context;
      this.debug = DEBUG_HERO ? { rafs: 0, misses: 0, draws: 0, maxMs: 0, lastUpdate: 0 } : null;
      if (this.debug) {
        this.debugOutput = document.createElement("output");
        this.debugOutput.className = "hero-debug";
        this.debugOutput.setAttribute("aria-hidden", "true");
        this.sticky.append(this.debugOutput);
      }
      this.setMode();
      if (!this.context) return;
      const onScroll = (event) => {
        const source = event.target;
        if (source instanceof Element) {
          if (!source.contains(this.hero)) return;
          if (this.scrollRoot !== source) { this.scrollRoot = source; this.geometryDirty = true; }
        } else if (source === document && this.scrollRoot !== document.scrollingElement) {
          this.scrollRoot = document.scrollingElement;
          this.geometryDirty = true;
        }
        this.scrollPosition = this.readScroll();
        this.lastScrollAt = performance.now();
        this.dirty = true;
        this.schedule();
      };
      // Capture also observes scrolling inside an ancestor container or preview.
      document.addEventListener("scroll", onScroll, { passive: true, capture: true });
      window.visualViewport?.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", () => this.resize(), { passive: true });
      window.visualViewport?.addEventListener("resize", () => this.resize(), { passive: true });
      this.reduced.addEventListener("change", () => {
        this.resetPointer();
        this.lastStoryProgress = -1;
        this.schedule();
      });
      this.mobile.addEventListener("change", () => this.resize());
      this.pointer.addEventListener("change", () => this.resetPointer());
      this.sticky.addEventListener("pointermove", (event) => this.movePointer(event), { passive: true });
      this.sticky.addEventListener("pointerleave", () => this.resetPointer(), { passive: true });
      window.addEventListener("blur", () => this.resetPointer());
      document.addEventListener("visibilitychange", () => this.lifecycle());
      document.addEventListener("nihongo:screenchange", () => this.lifecycle());
      window.addEventListener("pagehide", () => this.pause());
      window.addEventListener("pageshow", () => this.lifecycle());
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.sticky);
      this.resizeObserver.observe(this.hero);
      this.resizeObserver.observe(this.nav);
      document.fonts?.ready.then(() => this.resize());
      this.resize();
      // Opening/reloading below the hero still warms its compressed sequence.
      this.store.wake();
    }
    get assetWidth() { return this.mobile.matches || this.lowPower ? 1280 : 1920; }
    get isScrolling() { return performance.now() - this.lastScrollAt < 180; }
    // Scrolling always controls the sequence. Reduced motion only removes the
    // extra pointer/parallax movement; it must not freeze the requested effect.
    get isStatic() { return this.failed; }
    canLoad() {
      return !this.failed && this.home.classList.contains("active") && !document.hidden;
    }
    setMode() {
      this.hero.classList.toggle("is-static", this.isStatic);
      this.hero.classList.remove("is-ending");
      this.hero.classList.toggle("is-enhanced", !this.isStatic);
      this.lastStoryProgress = -1;
      for (const state of this.stageStates) state.visible = state.inert = null;
      if (this.isStatic) {
        this.stages.forEach((stage, index) => {
          const visible = index === 0 || index === this.stages.length - 1;
          stage.inert = !visible;
          stage.setAttribute("aria-hidden", String(!visible));
          stage.classList.toggle("is-current", visible);
          stage.style.cssText = "";
        });
        this.resetPointer();
      }
    }
    pause() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = this.lastTime = null;
      this.store.pause();
      this.targetPointer.x = this.targetPointer.y = 0;
    }
    lifecycle() {
      if (!this.home.classList.contains("active") || document.hidden) {
        this.pause();
        // The app focuses #home-title before announcing a return to this screen.
        if (!this.home.classList.contains("active")) {
          this.stages[0].inert = false;
          this.stages[0].setAttribute("aria-hidden", "false");
          this.stages[0].classList.add("is-current");
        }
        return;
      }
      this.lastStoryProgress = -1;
      for (const state of this.stageStates) state.visible = state.inert = null;
      this.forceSync = true;
      this.resize();
      // The render RAF may return immediately outside the scene. Resume the
      // compressed preload independently when the home/visible tab returns.
      this.store.wake();
      if (window.app?.currentScreen === "home" && window.scrollY < 10)
        this.title.focus({ preventScroll: true });
    }
    resize() {
      this.geometryDirty = this.sizeDirty = this.dirty = true;
      this.schedule();
    }
    readScroll() {
      return this.scrollRoot === document.scrollingElement ? window.scrollY : this.scrollRoot.scrollTop;
    }
    measureGeometry() {
      if (!this.home.classList.contains("active") || !this.context) return;
      const heroRect = this.hero.getBoundingClientRect();
      const rect = this.sticky.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const documentScroll = this.scrollRoot === document.scrollingElement;
      const origin = documentScroll ? 0 : this.scrollRoot.getBoundingClientRect().top + this.scrollRoot.clientTop;
      this.scrollPosition = this.readScroll();
      this.start = heroRect.top - origin + this.scrollPosition;
      this.heroHeight = heroRect.height;
      this.viewportHeight = documentScroll ? innerHeight : this.scrollRoot.clientHeight;
      this.travel = Math.max(1, heroRect.height - rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, this.mobile.matches ? 2 : 1.5);
      const pixelBudget = this.lowPower || this.mobile.matches ? 2_100_000 : 4_200_000;
      // Cover crops the source; drawing more pixels than that source supplies
      // only adds CPU/raster work. Let the compositor scale the finished canvas,
      // while the HTML text keeps the device's full resolution.
      const sourceRatio = Math.min(this.assetWidth / rect.width, (this.assetWidth * 9 / 16) / rect.height);
      const pixelRatio = Math.min(dpr, sourceRatio, Math.sqrt(pixelBudget / (rect.width * rect.height)));
      const width = Math.round(rect.width * pixelRatio);
      const height = Math.round(rect.height * pixelRatio);
      if (this.canvas.width !== width || this.canvas.height !== height) {
        // This method runs only inside RAF; resize and redraw share one paint.
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawDirty = true;
      }
      this.store.configure();
      this.geometryDirty = this.sizeDirty = false;
      this.dirty = true;
    }
    schedule() {
      if (!this.context || this.frame !== null || document.hidden ||
          !this.home.classList.contains("active")) return;
      this.frame = requestAnimationFrame(this.tick);
    }
    measure(time) {
      const top = this.start - this.scrollPosition;
      this.inView = top + this.heroHeight > 0 && top < this.viewportHeight;
      const progress = top >= -1 ? 0 : this.travel + top <= 1 ? 1 : clamp(-top / this.travel);
      if (progress !== this.targetProgress) {
        const delta = progress - this.targetProgress;
        const direction = Math.sign(delta) || this.scrollDirection;
        // A new reverse target can still be ahead of the filtered position.
        // Snap on reversal rather than briefly drawing in the wrong direction.
        if (direction !== this.scrollDirection) this.forceSync = true;
        this.scrollDirection = direction;
        this.targetProgress = progress;
        this.targetChangedAt = time;
      }
      this.targetFrame = Math.round(this.targetProgress * (HERO_FRAME_COUNT - 1));
      if (this.requestedFrame !== this.targetFrame) {
        this.hero.dataset.targetFrame = String(this.targetFrame + 1);
        this.requestedFrame = this.targetFrame;
      }
      this.dirty = false;
    }
    draw() {
      const desired = this.currentFrame;
      const image = this.store.get(desired);
      if (!image) {
        if (this.debug) this.debug.misses++;
        // On resize only, redraw the same last valid frame into the new backing
        // store. Never replace a missing target with an arbitrary nearby frame.
        if (this.drawDirty) {
          const last = this.store.get(this.lastDrawn);
          if (last) {
            drawImageCover(this.context, last, this.canvas.width, this.canvas.height);
            this.drawDirty = false;
          } else this.hero.classList.remove("has-frame");
        }
        return;
      }
      if (desired === this.lastDrawn && !this.drawDirty) return;
      drawImageCover(this.context, image, this.canvas.width, this.canvas.height);
      this.lastDrawn = desired;
      this.drawDirty = false;
      if (!this.hero.classList.contains("has-frame")) this.hero.classList.add("has-frame");
      this.hero.dataset.frame = String(desired + 1);
      this.hero.dataset.sourceFrame = String(HERO_SOURCES[desired]);
      if (this.debug) this.debug.draws++;
    }
    story() {
      if (this.isStatic || this.lastStoryProgress === this.progress) return;
      const progress = this.progress;
      let chapter = 1;
      for (let index = 0; index < this.stageStates.length; index++) {
        const state = this.stageStates[index];
        if (progress >= state.start) chapter = index + 1;
        const incoming = index === 0 ? 1 : mapRange(progress, state.start, state.start + 0.025);
        const outgoing = index === this.stageStates.length - 1 ? 0 : mapRange(progress, state.end - 0.025, state.end);
        const opacity = incoming * (1 - outgoing);
        const visible = opacity > 0.001;
        const inert = opacity < 0.45;
        if (state.visible !== visible) {
          state.element.classList.toggle("is-current", visible);
          state.element.setAttribute("aria-hidden", String(!visible));
          state.visible = visible;
        }
        if (state.inert !== inert) { state.element.inert = inert; state.inert = inert; }
        if (!visible && state.opacity === "0.000") continue;
        const value = opacity.toFixed(3);
        const y = visible && !this.reduced.matches ? `${((1 - incoming) * 40 - outgoing * 30).toFixed(2)}px` : "0px";
        const parallax = visible && !this.reduced.matches ? `${mapRange(progress, state.start, state.end, 6, -6).toFixed(2)}px` : "0px";
        if (state.opacity !== value) { state.style.setProperty("--stage-opacity", value); state.opacity = value; }
        if (state.y !== y) { state.style.setProperty("--stage-y", y); state.y = y; }
        if (state.parallax !== parallax) { state.style.setProperty("--stage-parallax", parallax); state.parallax = parallax; }
      }
      const label = String(chapter).padStart(2, "0");
      if (this.chapter.textContent !== label) this.chapter.textContent = label;
      const percentage = `${String(Math.round(progress * 100)).padStart(2, "0")}%`;
      if (this.percent.textContent !== percentage) this.percent.textContent = percentage;
      this.hero.classList.toggle("is-ending", progress >= 0.98);
      const value = progress.toFixed(4);
      const hint = (1 - mapRange(progress, 0, 0.09)).toFixed(3);
      const handoff = mapRange(progress, 0.94, 1).toFixed(3);
      if (this.progressValue !== value) {
        this.hero.style.setProperty("--sequence-progress", value);
        this.hero.dataset.progress = value;
        this.progressValue = value;
      }
      if (this.hintValue !== hint) {
        this.hero.style.setProperty("--scroll-hint-opacity", hint);
        this.hintValue = hint;
      }
      if (this.handoffValue !== handoff) {
        this.hero.style.setProperty("--handoff-opacity", handoff);
        this.handoffValue = handoff;
      }
      this.lastStoryProgress = progress;
    }
    movePointer(event) {
      if (this.isStatic || this.reduced.matches || !this.pointer.matches || event.pointerType !== "mouse") return;
      this.targetPointer.x = clamp((event.clientX / innerWidth - 0.5) * 10, -5, 5);
      this.targetPointer.y = clamp((event.clientY / innerHeight - 0.5) * 8, -4, 4);
      this.schedule();
    }
    resetPointer() {
      this.targetPointer.x = this.targetPointer.y = 0;
      if (this.isStatic || this.reduced.matches || !this.pointer.matches) {
        this.currentPointer.x = this.currentPointer.y = 0;
        this.hero.style.removeProperty("--pointer-x");
        this.hero.style.removeProperty("--pointer-y");
      } else this.schedule();
    }
    tick(time) {
      const started = DEBUG_HERO ? performance.now() : 0;
      this.frame = null;
      if (this.geometryDirty) this.measureGeometry();
      if (this.dirty) this.measure(time);
      if (!this.inView && !this.isStatic) { this.lastTime = null; return; }
      const elapsed = this.lastTime === null ? 1000 / 60 : Math.min(time - this.lastTime, 50);
      this.lastTime = time;
      const difference = this.targetProgress - this.progress;
      // A short, time-based progress filter absorbs wheel notches. Fine input,
      // large jumps and endpoints are direct; after release the tail is <=70ms.
      if (this.forceSync || this.reduced.matches || Math.abs(difference) > 0.12 ||
          Math.abs(difference) < 0.5 / (HERO_FRAME_COUNT - 1) ||
          time - this.targetChangedAt >= 70 || this.targetProgress === 0 || this.targetProgress === 1) {
        this.progress = this.targetProgress;
      } else this.progress += difference * (1 - Math.exp(-elapsed / 18));
      this.forceSync = false;
      const moving = this.progress !== this.targetProgress;
      this.currentFrame = Math.round(this.progress * (HERO_FRAME_COUNT - 1));
      this.store.aim(this.currentFrame, this.targetFrame, this.scrollDirection);
      this.draw();
      const easing = 1 - Math.pow(0.88, elapsed / (1000 / 60));
      let pointerMoving = false;
      for (const axis of POINTER_AXES) {
        const delta = this.targetPointer[axis] - this.currentPointer[axis];
        if (Math.abs(delta) > 0.01) {
          this.currentPointer[axis] += delta * easing;
          pointerMoving = true;
          this.hero.style.setProperty(`--pointer-${axis}`, `${this.currentPointer[axis].toFixed(2)}px`);
        }
      }
      this.story();
      if (this.debug) {
        this.debug.rafs++;
        const cost = performance.now() - started;
        this.debug.maxMs = Math.max(this.debug.maxMs, cost);
        if (time - this.debug.lastUpdate >= 250) {
          this.debug.lastUpdate = time;
          this.debugOutput.textContent = `RAF ${elapsed.toFixed(1)}ms · custo ${cost.toFixed(2)}ms · frame ${this.lastDrawn + 1}/${HERO_FRAME_COUNT} · alvo ${this.targetFrame + 1} · cache ${this.store.images.size} · carregados ${this.store.loaded.size} · espera ${this.debug.misses}`;
          this.hero.dataset.rafCount = String(this.debug.rafs);
          this.hero.dataset.renderMisses = String(this.debug.misses);
          this.hero.dataset.maxRafMs = this.debug.maxMs.toFixed(2);
          this.hero.dataset.renderCount = String(this.debug.draws);
        }
      }
      if (moving || pointerMoving) this.schedule();
      else this.lastTime = null;
    }
  }

  function startSequence() {
    const home = $("#screen-home");
    if (!home || !home.querySelector(".scroll-hero")) return;
    new ScrollSequenceHero(home);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSequence, { once: true });
  } else startSequence();
})();
