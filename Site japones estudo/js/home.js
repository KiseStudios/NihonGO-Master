/** Editorial home and image sequence. Native DOM/Canvas; existing study controllers stay intact. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const mapRange = (value, start, end, from = 0, to = 1) =>
    from + clamp((value - start) / (end - start)) * (to - from);

  // Verified against telainicial/: frame_001.png through frame_240.png, no gaps.
  // Rebuild optimized WebP variants with tools/optimize-hero-frames.py if PNGs change.
  const HERO_FRAME_COUNT = 240;
  const HERO_FIRST_BATCH = 20;
  const heroFrameURL = (index, width) =>
    `telainicial/optimized/${width}/frame_${String(index + 1).padStart(3, "0")}.webp`;

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
      this.blobBytes = 0;
      this.loaded = new Set();
      this.failed = new Set();
      this.rawRequests = new Map();
      this.decoding = new Set();
      this.active = 0;
      this.backgroundActive = 0;
      this.warmIndex = 0;
      this.preloadIndex = HERO_FIRST_BATCH;
      this.variant = hero.assetWidth;
      this.timer = null;
      this.wakeAt = 0;
    }
    get budget() {
      return (this.hero.mobile.matches ? 40 : this.hero.lowPower ? 48 : 96) * 1024 * 1024;
    }
    get limit() {
      const largest = Math.max(this.hero.assetWidth ** 2 * 9 / 16 * 4,
        ...[...this.images.values()].map((entry) => entry.bytes));
      return Math.max(6, Math.min(24, Math.floor(this.budget / largest)));
    }
    priorities() {
      if (this.hero.isStatic) return [HERO_FRAME_COUNT - 1];
      const current = Math.round(this.hero.currentFrame);
      const target = this.hero.targetFrame;
      const direction = target >= current ? 1 : -1;
      const indices = [target, current];
      for (let offset = 1; indices.length < this.limit - 1; offset++) {
        indices.push(current + offset * direction, target + offset * direction,
          target - offset * direction);
      }
      return [...new Set(indices.map((index) => clamp(index, 0, HERO_FRAME_COUNT - 1)))]
        .slice(0, this.limit - 2);
    }
    async raw(index, width = this.hero.assetWidth, urgent = false) {
      const key = `${width}/${index}`;
      if (this.blobs.has(key)) return this.blobs.get(key);
      if (this.rawRequests.has(key)) return this.rawRequests.get(key);
      const request = (async () => {
        // Small compressed frames stay in a bounded RAM cache. Native HTTP cache
        // handles disk persistence, without CacheStorage writes during scrolling.
        const response = await fetch(heroFrameURL(index, width), {
          cache: "force-cache", priority: urgent ? "high" : "low",
        });
        if (!response.ok) throw new Error(`Frame ${index + 1}: HTTP ${response.status}`);
        const blob = await response.blob();
        this.blobs.set(key, blob);
        this.blobBytes += blob.size;
        this.trimBlobs();
        this.loaded.add(index);
        this.hero.hero.dataset.loadedFrames = String(this.loaded.size);
        return blob;
      })();
      this.rawRequests.set(key, request);
      try { return await request; }
      finally { this.rawRequests.delete(key); }
    }
    trimBlobs() {
      const budget = (this.hero.mobile.matches ? 16 : 32) * 1024 * 1024;
      for (const [key, blob] of this.blobs) {
        if (this.blobBytes <= budget) break;
        this.blobs.delete(key);
        this.blobBytes -= blob.size;
      }
      this.hero.hero.dataset.compressedBytes = String(this.blobBytes);
    }
    async decode(index) {
      const width = this.hero.assetWidth;
      const blob = await this.raw(index, width, true);
      let image;
      if (typeof window.createImageBitmap === "function") {
        try { image = await createImageBitmap(blob); }
        catch { /* Image remains available when bitmap decoding is unsupported. */ }
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
        } finally { URL.revokeObjectURL(url); }
      }
      if (width !== this.hero.assetWidth) { image.close?.(); return; }
      this.images.get(index)?.image.close?.();
      this.images.delete(index);
      const imageWidth = image.naturalWidth || image.width;
      const imageHeight = image.naturalHeight || image.height;
      this.images.set(index, { image, resolution: width, bytes: imageWidth * imageHeight * 4 });
      this.trim();
      this.hero.schedule();
    }
    trim() {
      const keep = new Set([0, this.hero.lastDrawn, this.hero.targetFrame, Math.round(this.hero.currentFrame)]);
      let bytes = [...this.images.values()].reduce((sum, entry) => sum + entry.bytes, 0);
      for (const [index, entry] of this.images) {
        if (this.images.size <= this.limit && bytes <= this.budget) break;
        if (keep.has(index)) continue;
        entry.image.close?.();
        this.images.delete(index);
        bytes -= entry.bytes;
      }
      this.hero.hero.dataset.cachedFrames = String(this.images.size);
      this.hero.hero.dataset.decodedBytes = String(bytes);
    }
    get(index) {
      const entry = this.images.get(index);
      if (!entry) return null;
      this.images.delete(index);
      this.images.set(index, entry);
      return entry.image;
    }
    nearest(index, direction = 0) {
      let nearest = null;
      let distance = Infinity;
      for (const loadedIndex of this.images.keys()) {
        if ((direction > 0 && loadedIndex > index) || (direction < 0 && loadedIndex < index)) continue;
        if (Math.abs(loadedIndex - index) < distance) {
          nearest = loadedIndex;
          distance = Math.abs(loadedIndex - index);
        }
      }
      return nearest;
    }
    next() {
      for (const index of this.priorities()) {
        const entry = this.images.get(index);
        if ((!entry || entry.resolution !== this.hero.assetWidth) &&
            !this.failed.has(index) && !this.decoding.has(index)) return { index, decode: true };
      }
      if (this.hero.isStatic || this.backgroundActive || this.hero.isScrolling) return null;
      // Warm the first 20 compressed frames. Only the nearby window is decoded.
      while (this.warmIndex < HERO_FIRST_BATCH) {
        const index = this.warmIndex++;
        if (!this.blobs.has(`${this.hero.assetWidth}/${index}`) &&
            !this.failed.has(index) && !this.decoding.has(index)) return { index, decode: false };
      }
      while (this.preloadIndex < HERO_FRAME_COUNT) {
        const index = this.preloadIndex++;
        if (!this.blobs.has(`${this.hero.assetWidth}/${index}`) &&
            !this.failed.has(index) && !this.decoding.has(index)) return { index, decode: false };
      }
      return null;
    }
    wake(delay = 0) {
      const at = performance.now() + delay;
      if (this.timer !== null && this.wakeAt <= at) return;
      clearTimeout(this.timer);
      this.wakeAt = at;
      this.timer = setTimeout(() => { this.timer = null; this.pump(); }, delay);
    }
    pump() {
      if (!this.hero.canLoad()) return;
      if (this.variant !== this.hero.assetWidth) {
        this.variant = this.hero.assetWidth;
        this.warmIndex = 0;
        this.preloadIndex = HERO_FIRST_BATCH;
        this.trimBlobs();
      }
      const concurrency = this.hero.mobile.matches || this.hero.lowPower ? 2 : 3;
      while (this.active < concurrency) {
        const task = this.next();
        if (!task) break;
        this.active++;
        if (!task.decode) this.backgroundActive++;
        this.decoding.add(task.index);
        const operation = task.decode ? this.decode(task.index) : this.raw(task.index);
        operation.catch(() => {
          this.failed.add(task.index);
          this.hero.hero.dataset.failedFrames = String(this.failed.size);
          if (task.index === 0 && !this.images.size) this.hero.fallback();
          else if (this.failed.size === 1)
            console.warn("NihonGO: um frame da apresentação está indisponível; mantendo o último frame válido.");
        }).finally(() => {
          this.active--;
          if (!task.decode) this.backgroundActive--;
          this.decoding.delete(task.index);
          this.wake(task.decode ? 0 : 40);
        });
      }
      // Idle preloading resumes after the user pauses; it does not compete with scrolling.
      if (this.hero.isScrolling && this.active === 0) this.wake(180);
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
      this.percent = this.hero.querySelector(".hero-progress-percent");
      this.chapter = this.hero.querySelector(".hero-progress-chapter");
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
      this.mobile = matchMedia("(max-width: 700px)");
      this.pointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px)");
      const memory = navigator.deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 4;
      this.lowPower = memory <= 4 || cores <= 4 || Boolean(navigator.connection?.saveData);
      this.hero.dataset.quality = this.lowPower ? "balanced" : "high";
      this.stageStates = new WeakMap();
      this.lastScrollAt = -Infinity;
      this.requestedFrame = -1;
      this.currentFrame = this.targetFrame = 0;
      this.scrollDirection = 1;
      this.progress = 0;
      this.lastDrawn = -1;
      this.lastStoryProgress = -1;
      this.frame = this.lastTime = this.resizeTimer = null;
      this.dirty = this.drawDirty = true;
      this.currentPointer = { x: 0, y: 0 };
      this.targetPointer = { x: 0, y: 0 };
      this.store = new HeroFrameStore(this);
      this.tick = this.tick.bind(this);
      this.failed = !this.context;
      this.setMode();
      if (!this.context) return;
      window.addEventListener("scroll", () => {
        this.lastScrollAt = performance.now();
        this.dirty = true;
        this.schedule();
      }, { passive: true });
      window.addEventListener("resize", () => this.debounceResize(), { passive: true });
      window.visualViewport?.addEventListener("resize", () => this.debounceResize(), { passive: true });
      this.reduced.addEventListener("change", () => { this.setMode(); this.resize(); });
      this.mobile.addEventListener("change", () => this.debounceResize());
      this.pointer.addEventListener("change", () => this.resetPointer());
      this.sticky.addEventListener("pointermove", (event) => this.movePointer(event), { passive: true });
      this.sticky.addEventListener("pointerleave", () => this.resetPointer(), { passive: true });
      window.addEventListener("blur", () => this.resetPointer());
      document.addEventListener("visibilitychange", () => this.lifecycle());
      document.addEventListener("nihongo:screenchange", () => this.lifecycle());
      window.addEventListener("pagehide", () => this.pause());
      window.addEventListener("pageshow", () => this.lifecycle());
      this.resizeObserver = new ResizeObserver(() => this.debounceResize());
      this.resizeObserver.observe(this.sticky);
      this.resizeObserver.observe($(".editorial-nav"));
      this.resize();
    }
    get assetWidth() { return this.mobile.matches || this.lowPower ? 1280 : 1920; }
    get isScrolling() { return performance.now() - this.lastScrollAt < 180; }
    get isStatic() { return this.failed || this.reduced.matches; }
    canLoad() {
      return !this.failed && this.home.classList.contains("active") && !document.hidden &&
        (this.isStatic || this.preloadAllowed !== false);
    }
    setMode() {
      this.hero.classList.toggle("is-static", this.isStatic);
      this.hero.classList.remove("is-ending");
      this.hero.classList.toggle("is-enhanced", !this.isStatic);
      this.lastStoryProgress = -1;
      this.stageStates = new WeakMap();
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
    fallback() {
      this.failed = true;
      this.pause();
      this.setMode();
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
      this.measure();
      this.currentFrame = this.targetFrame;
      this.resize();
      if (window.app?.currentScreen === "home" && window.scrollY < 10)
        $("#home-title").focus({ preventScroll: true });
    }
    debounceResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.resize(), 120);
    }
    resize() {
      if (!this.home.classList.contains("active") || !this.context) return;
      const rect = this.sticky.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, this.mobile.matches ? 2 : 1.5);
      const pixelBudget = this.lowPower || this.mobile.matches ? 2_100_000 : 4_200_000;
      const pixelRatio = Math.min(dpr, Math.sqrt(pixelBudget / (rect.width * rect.height)));
      const width = Math.round(rect.width * pixelRatio);
      const height = Math.round(rect.height * pixelRatio);
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawDirty = true;
      }
      this.store.trim();
      this.dirty = true;
      // Redraw within this task: resizing clears the canvas backing store.
      this.draw();
      this.schedule();
      this.store.wake();
    }
    schedule() {
      if (!this.context || this.frame !== null || document.hidden ||
          !this.home.classList.contains("active")) return;
      this.frame = requestAnimationFrame(this.tick);
    }
    measure() {
      const rect = this.hero.getBoundingClientRect();
      this.inView = rect.bottom > 0 && rect.top < innerHeight;
      this.preloadAllowed = rect.bottom > 0;
      const travel = Math.max(1, rect.height - this.sticky.offsetHeight);
      // Browsers round scrollY to a CSS pixel; snap the subpixel end positions.
      this.progress = this.isStatic || rect.top >= -1 ? 0 :
        travel + rect.top <= 1 ? 1 : clamp(-rect.top / travel);
      const previousTarget = this.targetFrame;
      this.targetFrame = this.isStatic ? HERO_FRAME_COUNT - 1 :
        Math.min(HERO_FRAME_COUNT - 1, Math.floor(this.progress * (HERO_FRAME_COUNT - 1)));
      if (this.targetFrame !== previousTarget)
        this.scrollDirection = Math.sign(this.targetFrame - previousTarget);
      this.hero.dataset.targetFrame = String(this.targetFrame + 1);
      this.hero.dataset.progress = this.progress.toFixed(4);
      this.dirty = false;
      this.store.wake();
    }
    draw() {
      const desired = Math.round(this.currentFrame);
      let index = this.store.images.has(desired) ? desired :
        this.store.nearest(desired, this.scrollDirection);
      if (index === null && this.drawDirty) index = this.store.nearest(desired);
      // Loading a neighboring frame must not make the animation reverse by itself.
      const regresses = this.scrollDirection > 0
        ? index < this.lastDrawn && this.targetFrame >= this.lastDrawn
        : index > this.lastDrawn && this.targetFrame <= this.lastDrawn;
      if (index === null || !this.drawDirty && (index === this.lastDrawn || regresses)) return;
      const image = this.store.get(index);
      if (!image) return;
      drawImageCover(this.context, image, this.canvas.width, this.canvas.height);
      this.lastDrawn = index;
      this.drawDirty = false;
      this.hero.classList.add("has-frame");
      this.hero.dataset.frame = String(index + 1);
    }
    story() {
      if (this.isStatic || this.lastStoryProgress === this.progress) return;
      const progress = this.progress;
      let chapter = 1;
      this.stages.forEach((stage, index) => {
        const start = Number(stage.dataset.start);
        const end = Number(stage.dataset.end);
        const incoming = index === 0 ? 1 : mapRange(progress, start, start + 0.025);
        const outgoing = index === this.stages.length - 1 ? 0 : mapRange(progress, end - 0.025, end);
        const opacity = incoming * (1 - outgoing);
        const visible = opacity > 0.001;
        const inert = opacity < 0.45;
        const previous = this.stageStates.get(stage) || {};
        if (previous.visible !== visible) {
          stage.classList.toggle("is-current", visible);
          stage.setAttribute("aria-hidden", String(!visible));
        }
        if (previous.inert !== inert) stage.inert = inert;
        const values = {
          "--stage-opacity": opacity.toFixed(3),
          "--stage-y": visible ? `${((1 - incoming) * 40 - outgoing * 30).toFixed(2)}px` : "0px",
          "--stage-parallax": visible ? `${mapRange(progress, start, end, 6, -6).toFixed(2)}px` : "0px",
        };
        for (const [property, value] of Object.entries(values)) {
          if (previous[property] !== value) stage.style.setProperty(property, value);
        }
        this.stageStates.set(stage, { ...values, visible, inert });
        if (progress >= start) chapter = index + 1;
      });
      const label = String(chapter).padStart(2, "0");
      if (this.chapter.textContent !== label) this.chapter.textContent = label;
      const percentage = `${String(Math.round(progress * 100)).padStart(2, "0")}%`;
      if (this.percent.textContent !== percentage) this.percent.textContent = percentage;
      this.hero.classList.toggle("is-ending", progress >= 0.98);
      this.hero.style.setProperty("--sequence-progress", progress.toFixed(4));
      this.hero.style.setProperty("--scroll-hint-opacity", (1 - mapRange(progress, 0, 0.09)).toFixed(3));
      this.hero.style.setProperty("--handoff-opacity", mapRange(progress, 0.94, 1).toFixed(3));
      this.lastStoryProgress = progress;
    }
    movePointer(event) {
      if (this.isStatic || !this.pointer.matches || event.pointerType !== "mouse") return;
      this.targetPointer.x = clamp((event.clientX / innerWidth - 0.5) * 10, -5, 5);
      this.targetPointer.y = clamp((event.clientY / innerHeight - 0.5) * 8, -4, 4);
      this.schedule();
    }
    resetPointer() {
      this.targetPointer.x = this.targetPointer.y = 0;
      if (this.isStatic || !this.pointer.matches) {
        this.currentPointer.x = this.currentPointer.y = 0;
        this.hero.style.removeProperty("--pointer-x");
        this.hero.style.removeProperty("--pointer-y");
      } else this.schedule();
    }
    tick(time) {
      this.frame = null;
      if (this.dirty) this.measure();
      if (!this.inView && !this.isStatic) { this.lastTime = null; return; }
      const elapsed = this.lastTime === null ? 1000 / 60 : Math.min(time - this.lastTime, 50);
      this.lastTime = time;
      const easing = 1 - Math.pow(0.88, elapsed / (1000 / 60));
      if (this.isStatic) this.currentFrame = this.targetFrame;
      else this.currentFrame += (this.targetFrame - this.currentFrame) * easing;
      const moving = Math.abs(this.targetFrame - this.currentFrame) > 0.02;
      if (!moving) this.currentFrame = this.targetFrame;
      let pointerMoving = false;
      for (const axis of ["x", "y"]) {
        const difference = this.targetPointer[axis] - this.currentPointer[axis];
        if (Math.abs(difference) > 0.01) {
          this.currentPointer[axis] += difference * easing;
          pointerMoving = true;
          this.hero.style.setProperty(`--pointer-${axis}`, `${this.currentPointer[axis].toFixed(2)}px`);
        }
      }
      this.draw();
      this.story();
      const requested = Math.round(this.currentFrame);
      if (requested !== this.requestedFrame) {
        this.requestedFrame = requested;
        this.store.wake();
      }
      if (moving || pointerMoving) this.schedule();
      else this.lastTime = null;
    }
  }

  class HomeScrollEffects {
    constructor(home) {
      this.home = home;
      this.path = $(".jlpt-stops");
      this.immersion = $(".japan-immersion");
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
      this.desktop = matchMedia("(min-width: 701px)");
      this.frame = null;
      window.addEventListener("scroll", () => this.schedule(), { passive: true });
      window.addEventListener("resize", () => this.schedule(), {
        passive: true,
      });
      document.addEventListener("nihongo:screenchange", () => this.schedule());
      this.reduced.addEventListener("change", () => this.schedule());
      this.desktop.addEventListener("change", () => this.schedule());
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
      $(".editorial-nav").classList.toggle("is-scrolled", window.scrollY > 40);
      if (!this.home.classList.contains("active")) return;
      const height = innerHeight;
      const motion = !this.reduced.matches && this.desktop.matches;
      const pathRect = this.path.getBoundingClientRect();
      const pathProgress = this.reduced.matches
        ? 1
        : clamp((height * 0.72 - pathRect.top) / pathRect.height);
      this.path.style.setProperty("--path-progress", pathProgress);
      $$(".jlpt-stop").forEach((stop, index) =>
        stop.classList.toggle("is-passed", pathProgress >= index / 5),
      );
      const imageRect = this.immersion.getBoundingClientRect();
      if (motion && imageRect.top < height && imageRect.bottom > 0) {
        this.immersion.style.setProperty(
          "--immersion-scale",
          1.01 +
            clamp((height - imageRect.top) / (height + imageRect.height)) *
              0.04,
        );
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
    new ScrollSequenceHero(home);
    new HomeScrollEffects(home);
    new TypographicHero(home);
  });
})();
