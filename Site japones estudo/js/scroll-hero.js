/** Paused native video and editorial storytelling share one scroll timeline. */
(() => {
  "use strict";
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mapRange = (value, start, end, from = 0, to = 1) =>
    from + clamp((value - start) / (end - start)) * (to - from);
  const SEEK_THRESHOLD = 0.015;
  const DEBUG_HERO = new URLSearchParams(location.search).get("heroDebug") === "1";
  const POINTER_AXES = ["x", "y"];

  class ScrollVideoHero {
    constructor(home, hero) {
      this.home = home;
      this.hero = hero;
      this.sticky = hero.querySelector(".scroll-hero-sticky");
      this.video = hero.querySelector("#heroScrollVideo");
      this.nav = document.querySelector(".editorial-nav");
      this.title = document.querySelector("#home-title");
      this.percent = hero.querySelector(".hero-progress-percent");
      this.chapter = hero.querySelector(".hero-progress-chapter");
      this.stageStates = [...hero.querySelectorAll(".hero-story-stage")].map(element => ({
        element, style: element.style,
        start: Number(element.dataset.start), end: Number(element.dataset.end),
        visible: null, inert: null, opacity: null, y: null, parallax: null,
      }));
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
      this.mobile = matchMedia("(max-width: 700px)");
      this.pointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px)");
      this.scrollRoot = document.scrollingElement;
      this.scrollPosition = window.scrollY;
      this.progress = this.targetProgress = this.desiredTime = this.duration = 0;
      this.direction = 1;
      this.targetChangedAt = 0;
      this.lastStoryProgress = -1;
      this.frame = this.lastTime = null;
      this.geometryDirty = this.forceSync = true;
      this.inView = this.observedVisible = true;
      this.seeking = this.mediaFailed = this.hasData = false;
      this.currentPointer = { x: 0, y: 0 };
      this.targetPointer = { x: 0, y: 0 };
      this.tick = this.tick.bind(this);
      this.hero.dataset.engine = "scroll-video-v1";
      this.hero.dataset.mediaState = "loading";
      this.hero.classList.add("is-enhanced");
      this.debug = DEBUG_HERO ? { rafs: 0, seeks: 0, lastSeekMs: 0, maxSeekMs: 0, maxMs: 0, lastUpdate: 0 } : null;
      if (this.debug) {
        this.debugOutput = document.createElement("output");
        this.debugOutput.className = "hero-debug";
        this.debugOutput.setAttribute("aria-hidden", "true");
        this.sticky.append(this.debugOutput);
      }
      // No autoplay: native seeks are serialized, coalescing to the latest input.
      this.video.addEventListener("play", () => this.video.pause());
      this.video.addEventListener("loadedmetadata", () => this.metadata());
      this.video.addEventListener("durationchange", () => this.metadata());
      this.video.addEventListener("loadeddata", () => this.mediaReady());
      this.video.addEventListener("canplay", () => this.mediaReady());
      this.video.addEventListener("seeked", () => {
        this.seeking = false;
        if (this.debug && this.seekStartedAt !== undefined) {
          this.debug.lastSeekMs = performance.now() - this.seekStartedAt;
          this.debug.maxSeekMs = Math.max(this.debug.maxSeekMs, this.debug.lastSeekMs);
        }
        this.mediaReady();
      });
      this.video.addEventListener("error", () => this.mediaError());
      this.video.querySelector("source")?.addEventListener("error", () => this.mediaError());
      this.motionMode();
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
        // Only cached geometry and targets here; video writes happen in RAF.
        if (!this.geometryDirty) this.captureTarget(performance.now());
        this.schedule();
      };
      document.addEventListener("scroll", onScroll, { passive: true, capture: true });
      window.visualViewport?.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", () => this.resize(), { passive: true });
      window.visualViewport?.addEventListener("resize", () => this.resize(), { passive: true });
      this.mobile.addEventListener("change", () => this.resize());
      this.reduced.addEventListener("change", () => this.motionMode());
      this.pointer.addEventListener("change", () => this.resetPointer());
      this.sticky.addEventListener("pointermove", event => this.movePointer(event), { passive: true });
      this.sticky.addEventListener("pointerleave", () => this.resetPointer(), { passive: true });
      this.sticky.addEventListener("pointercancel", () => this.resetPointer(), { passive: true });
      window.addEventListener("blur", () => this.resetPointer());
      document.addEventListener("visibilitychange", () => this.lifecycle());
      document.addEventListener("nihongo:screenchange", () => this.lifecycle());
      window.addEventListener("pagehide", () => this.pause());
      window.addEventListener("pageshow", () => this.lifecycle());
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.hero);
      this.resizeObserver.observe(this.sticky);
      this.resizeObserver.observe(this.nav);
      this.intersectionObserver = new IntersectionObserver(entries => {
        this.observedVisible = entries[0].isIntersecting;
        if (!this.observedVisible) this.pause();
        else { this.forceSync = true; this.resize(); }
      });
      this.intersectionObserver.observe(this.hero);
      document.fonts?.ready.then(() => this.resize());
      if (this.video.readyState >= 1) this.metadata();
      if (this.video.readyState >= 2) this.mediaReady();
      // A <source> can fail before DOMContentLoaded without setting video.error.
      if (this.video.error || this.video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)
        this.mediaError();
      this.resize();
    }
    get active() { return this.home.classList.contains("active") && !document.hidden; }
    metadata() {
      if (!Number.isFinite(this.video.duration) || this.video.duration <= 0) return;
      this.duration = this.video.duration;
      this.video.pause();
      this.hero.dataset.duration = String(this.duration);
      this.schedule();
    }
    mediaReady() {
      if (this.mediaFailed || this.video.readyState < 2) return;
      if (!this.reduced.matches && this.video.readyState === 4 && this.duration &&
          (!this.video.seekable.length || this.video.seekable.end(this.video.seekable.length - 1) === 0)) {
        this.mediaError("unseekable");
        return;
      }
      this.hasData = true;
      this.hero.dataset.mediaState = this.reduced.matches ? "reduced-motion" : "ready";
      this.hero.classList.toggle("has-video-frame", !this.reduced.matches);
      this.schedule();
    }
    mediaError(reason = "error") {
      this.mediaFailed = true;
      this.seeking = false;
      this.video.pause();
      this.hero.classList.remove("has-video-frame");
      this.hero.classList.add("is-media-fallback");
      this.hero.dataset.mediaState = "error";
      this.hero.dataset.mediaFailure = reason;
      // A failed video keeps the poster and complete scroll narrative usable.
      this.schedule();
    }
    motionMode() {
      this.video.pause();
      this.video.preload = this.reduced.matches ? "none" : "auto";
      this.hero.classList.toggle("is-reduced-motion", this.reduced.matches);
      this.hero.classList.toggle("has-video-frame", this.hasData && !this.mediaFailed && !this.reduced.matches);
      if (!this.mediaFailed) this.hero.dataset.mediaState = this.reduced.matches ? "reduced-motion" : this.hasData ? "ready" : "loading";
      this.forceSync = true;
      this.lastStoryProgress = -1;
      this.resetPointer();
      this.resize();
    }
    pause() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = this.lastTime = null;
      this.forceSync = true;
      this.video.pause();
      this.currentPointer.x = this.currentPointer.y = 0;
      this.targetPointer.x = this.targetPointer.y = 0;
      this.hero.style.removeProperty("--pointer-x");
      this.hero.style.removeProperty("--pointer-y");
    }
    lifecycle() {
      if (!this.active) {
        this.pause();
        // Existing navigation focuses this heading before announcing its route.
        if (!this.home.classList.contains("active")) {
          const intro = this.stageStates[0].element;
          intro.inert = false;
          intro.setAttribute("aria-hidden", "false");
          intro.classList.add("is-current");
        }
        return;
      }
      this.lastStoryProgress = -1;
      for (const state of this.stageStates) state.visible = state.inert = null;
      this.forceSync = true;
      this.resize();
      if (window.app?.currentScreen === "home" && window.scrollY < 10)
        this.title.focus({ preventScroll: true });
    }
    resize() { this.geometryDirty = true; this.schedule(); }
    readScroll() {
      return this.scrollRoot === document.scrollingElement ? window.scrollY : this.scrollRoot.scrollTop;
    }
    measureGeometry(time) {
      const heroRect = this.hero.getBoundingClientRect();
      const stickyRect = this.sticky.getBoundingClientRect();
      const documentScroll = this.scrollRoot === document.scrollingElement;
      const origin = documentScroll ? 0 : this.scrollRoot.getBoundingClientRect().top + this.scrollRoot.clientTop;
      this.scrollPosition = this.readScroll();
      this.start = heroRect.top - origin + this.scrollPosition;
      this.heroHeight = heroRect.height;
      this.viewportHeight = documentScroll ? innerHeight : this.scrollRoot.clientHeight;
      this.travel = Math.max(1, heroRect.height - stickyRect.height);
      this.geometryDirty = false;
      this.captureTarget(time);
    }
    captureTarget(time) {
      const top = this.start - this.scrollPosition;
      this.inView = top + this.heroHeight > 0 && top < this.viewportHeight;
      const progress = top >= -1 ? 0 : this.travel + top <= 1 ? 1 : clamp(-top / this.travel);
      if (progress === this.targetProgress) return;
      const direction = Math.sign(progress - this.targetProgress);
      if (direction !== this.direction) this.forceSync = true;
      this.direction = direction;
      this.targetProgress = progress;
      this.targetChangedAt = time;
    }
    schedule() {
      if (this.frame !== null || !this.active || !this.observedVisible || !this.inView && !this.geometryDirty) return;
      this.frame = requestAnimationFrame(this.tick);
    }
    seek() {
      if (this.mediaFailed || this.reduced.matches || !this.duration ||
          this.video.readyState < 2 || this.seeking || this.video.seeking ||
          !this.video.seekable.length || this.video.seekable.end(this.video.seekable.length - 1) === 0) return;
      const threshold = this.progress === 0 || this.progress === 1 ? 0.001 : SEEK_THRESHOLD;
      if (Math.abs(this.video.currentTime - this.desiredTime) <= threshold) return;
      try {
        this.seeking = true;
        if (this.debug) this.seekStartedAt = performance.now();
        this.video.currentTime = this.desiredTime;
        if (this.debug) this.debug.seeks++;
      } catch { this.mediaError(); }
    }
    story() {
      if (this.lastStoryProgress === this.progress) return;
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
      if (!this.active || !this.inView || this.reduced.matches || !this.pointer.matches || event.pointerType !== "mouse") return;
      this.targetPointer.x = clamp((event.clientX / innerWidth - 0.5) * 10, -5, 5);
      this.targetPointer.y = clamp((event.clientY / innerHeight - 0.5) * 8, -4, 4);
      this.schedule();
    }
    resetPointer() {
      this.targetPointer.x = this.targetPointer.y = 0;
      if (this.reduced.matches || !this.pointer.matches) {
        this.currentPointer.x = this.currentPointer.y = 0;
        this.hero.style.removeProperty("--pointer-x");
        this.hero.style.removeProperty("--pointer-y");
      } else this.schedule();
    }
    tick(time) {
      const started = DEBUG_HERO ? performance.now() : 0;
      this.frame = null;
      if (!this.active) { this.pause(); return; }
      if (this.geometryDirty) this.measureGeometry(time);
      if (!this.inView || !this.observedVisible) { this.pause(); return; }
      const elapsed = this.lastTime === null ? 1000 / 60 : Math.min(time - this.lastTime, 50);
      this.lastTime = time;
      const difference = this.targetProgress - this.progress;
      // Fine input/reversals/jumps are direct. Wheel filtering lasts <=48ms.
      if (this.forceSync || this.reduced.matches || Math.abs(difference) < 0.002 ||
          Math.abs(difference) > 0.08 || time - this.targetChangedAt >= 48 ||
          this.targetProgress === 0 || this.targetProgress === 1) {
        this.progress = this.targetProgress;
      } else this.progress += difference * (1 - Math.exp(-elapsed / (this.mobile.matches ? 8 : 12)));
      this.forceSync = false;
      this.desiredTime = this.duration ? Math.min(this.progress * this.duration, Math.max(0, this.duration - 0.01)) : 0;
      const targetTime = this.desiredTime.toFixed(4);
      if (this.hero.dataset.targetTime !== targetTime) this.hero.dataset.targetTime = targetTime;
      this.seek();
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
        this.debug.maxMs = Math.max(this.debug.maxMs, performance.now() - started);
        if (time - this.debug.lastUpdate >= 250) {
          this.debug.lastUpdate = time;
          this.debugOutput.textContent = `alvo ${this.desiredTime.toFixed(2)}s / ${this.duration.toFixed(2)}s · seek ${this.debug.lastSeekMs.toFixed(1)}ms · RAF ${this.debug.maxMs.toFixed(2)}ms · seeks ${this.debug.seeks}`;
          this.hero.dataset.rafCount = String(this.debug.rafs);
          this.hero.dataset.seekCount = String(this.debug.seeks);
          this.hero.dataset.maxSeekMs = this.debug.maxSeekMs.toFixed(2);
          this.hero.dataset.maxRafMs = this.debug.maxMs.toFixed(2);
        }
      }
      if (this.progress !== this.targetProgress || pointerMoving) this.schedule();
      else this.lastTime = null;
    }
  }
  function startVideoHero() {
    const home = document.querySelector("#screen-home");
    const hero = home?.querySelector(".scroll-hero");
    if (!hero?.querySelector("#heroScrollVideo")) return;
    new ScrollVideoHero(home, hero);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startVideoHero, { once: true });
  } else startVideoHero();
})();
