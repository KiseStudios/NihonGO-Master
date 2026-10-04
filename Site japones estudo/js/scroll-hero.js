/** Two photographs, one native-scroll timeline. No media sequence renderer. */
(() => {
  "use strict";
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const initialState = () => ({
    japanScale: 1.04, japanX: 0, japanY: 0,
    originScale: 1.12, originX: 3, originY: 2,
    clipLeft: 100, clipRight: 100,
    introOpacity: 1, introY: 12, introDetailOpacity: 1, introCtaOpacity: .12,
    originOpacity: 0, originCopyY: 28, originCtaOpacity: 0,
    shadeOpacity: .1, hintOpacity: 1, exitY: 0,
  });
  const properties = {
    japanScale: ["japan-scale", ""], japanX: ["japan-x", "px"], japanY: ["japan-y", "px"],
    originScale: ["origin-scale", ""], originX: ["origin-x", "vw"], originY: ["origin-y", "svh"],
    clipLeft: ["clip-left", "%"], clipRight: ["clip-right", "%"],
    introOpacity: ["intro-opacity", ""], introY: ["intro-y", "px"],
    introDetailOpacity: ["intro-detail-opacity", ""], introCtaOpacity: ["intro-cta-opacity", ""],
    originOpacity: ["origin-opacity", ""], originCopyY: ["origin-copy-y", "px"],
    originCtaOpacity: ["origin-cta-opacity", ""], shadeOpacity: ["shade-opacity", ""],
    hintOpacity: ["hint-opacity", ""], exitY: ["exit-y", "svh"],
  };

  class LayeredHero {
    constructor(root) {
      this.root = root;
      this.stage = root.querySelector(".hero-stage");
      this.home = root.closest(".screen-view");
      this.nav = document.querySelector(".editorial-nav");
      this.intro = root.querySelector(".hero-copy--intro");
      this.origin = root.querySelector(".hero-copy--origin");
      this.currentChapter = root.querySelector(".hero-progress-current");
      this.percent = root.querySelector(".hero-progress-percent");
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
      this.mobile = matchMedia("(max-width: 700px), (max-width: 1100px) and (orientation: portrait)");
      this.pointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px)");
      this.debug = new URLSearchParams(location.search).has("heroDebug");
      this.state = initialState();
      this.target = { x: 0, y: 0, cursorX: 0, cursorY: 0, presence: 0, scale: 1 };
      this.current = { ...this.target };
      this.cache = new Map();
      this.bounds = { left: 0, top: 0, width: innerWidth, height: innerHeight };
      this.frame = this.lastTime = null;
      this.frames = 0;
      this.inView = false;
      this.assetsReady = false;
      this.assetsFailed = false;
      this.active = this.home.classList.contains("active");
      this.scroller = this.findScroller();
      root.dataset.engine = "gsap-layered-v1";
      root.dataset.state = "loading";
      root.dataset.progress = "0.0000";
      root.dataset.phase = "discover";
      if (this.debug) root.dataset.rafCount = "0";
      document.body.classList.add("has-hero-experience");
      this.tick = this.tick.bind(this);
      if (!this.reduced.matches && window.gsap && window.ScrollTrigger) this.expose(this.origin, false);

      // Pointer handlers update targets only; geometry is cached elsewhere.
      this.stage.addEventListener("pointerenter", event => this.move(event), { passive: true });
      this.stage.addEventListener("pointermove", event => this.move(event), { passive: true });
      this.stage.addEventListener("pointerleave", () => this.center(), { passive: true });
      this.stage.addEventListener("pointercancel", () => this.center(), { passive: true });
      window.addEventListener("blur", () => this.resetPointer());
      window.addEventListener("pagehide", () => this.resetPointer());
      document.addEventListener("visibilitychange", () => {
        this.resetPointer();
        if (!document.hidden && this.timeline && this.active) {
          this.timeline.scrollTrigger.update();
          this.schedule();
        }
      });
      document.addEventListener("nihongo:screenchange", event => this.screenChanged(event));
      this.reduced.addEventListener("change", () => this.configure());
      this.mobile.addEventListener("change", () => this.configure());
      this.pointer.addEventListener("change", () => this.resetPointer());
      (this.scroller || window).addEventListener("scroll", () => {
        if (!this.timeline) this.header();
      }, { passive: true });
      window.addEventListener("resize", () => {
        this.geometryDirty = true;
        this.schedule();
      }, { passive: true });
      this.observer = new ResizeObserver(() => {
        this.geometryDirty = true;
        this.schedule();
      });
      this.observer.observe(this.stage);
      this.root.querySelector(".hero-discover").addEventListener("click", event => {
        if (!this.timeline) return;
        event.preventDefault();
        const trigger = this.timeline.scrollTrigger;
        const top = trigger.start + (trigger.end - trigger.start) * .91;
        (this.scroller || window).scrollTo({ top, behavior: "smooth" });
      });
      this.header();
      this.loadAssets();
    }

    findScroller() {
      for (let node = this.root.parentElement; node && node !== document.body; node = node.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight) return node;
      }
      return null;
    }

    async loadAssets() {
      const loaded = [...this.root.querySelectorAll(".hero-image")].map(image => new Promise(resolve => {
        const finish = () => resolve(image.naturalWidth > 0);
        if (image.complete) finish();
        else {
          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
        }
      }));
      // Reduced motion must not wait for networking to enter normal flow.
      if (this.reduced.matches || !window.gsap || !window.ScrollTrigger) this.configure();
      this.assetsFailed = (await Promise.all(loaded)).some(success => !success);
      this.assetsReady = true;
      this.configure();
      document.fonts?.ready.then(() => {
        if (this.timeline && this.active) this.timeline.scrollTrigger.refresh();
      });
    }

    configure() {
      const previousProgress = this.timeline?.progress() || 0;
      this.destroyTimeline();
      this.root.classList.remove("is-static", "is-enhanced", "has-origin");
      this.root.removeAttribute("style");
      this.cache.clear();
      this.state = initialState();
      if (this.reduced.matches || this.assetsFailed || !window.gsap || !window.ScrollTrigger) {
        this.root.classList.add("is-static");
        this.root.dataset.state = this.reduced.matches ? "reduced-motion" : "fallback";
        this.expose(this.intro, true);
        this.expose(this.origin, true);
        this.intro.querySelector(".hero-actions").inert = false;
        this.origin.querySelector(".hero-actions").inert = false;
        this.header();
        return;
      }
      if (!this.assetsReady) return;
      gsap.registerPlugin(ScrollTrigger);
      this.root.classList.add("is-enhanced");
      this.root.dataset.state = "ready";
      this.geometryDirty = true;
      this.measure();
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: () => this.schedule(),
        scrollTrigger: {
          id: "kise-layered-hero", trigger: this.root, scroller: this.scroller || undefined,
          start: "top top", end: () => `+=${Math.max(1, this.root.offsetHeight - this.stage.offsetHeight)}`,
          pin: this.stage, pinSpacing: false, anticipatePin: 1,
          scrub: this.mobile.matches ? .18 : .25,
          onToggle: trigger => {
            this.inView = trigger.isActive;
            if (!trigger.isActive) this.center();
            this.schedule();
          },
          onRefresh: () => { this.geometryDirty = true; this.schedule(); },
        },
      });
      // One 100-unit choreography animates scalar state. CSS composes scroll
      // transforms with pointer transforms instead of either overwriting the other.
      timeline
        .to(this.state, { introY: 0, duration: 15 }, 0)
        .to(this.state, { japanScale: 1.10, japanX: -6, japanY: -4, duration: 30 }, 0)
        .to(this.state, { introCtaOpacity: 1, duration: 15 }, 15)
        .to(this.state, { introY: -32, introDetailOpacity: 0, introCtaOpacity: 0, shadeOpacity: .23, duration: 12 }, 30)
        .to(this.state, { introOpacity: 0, introY: -62, shadeOpacity: .28, duration: 10 }, 42)
        .to(this.state, { clipLeft: 0, duration: 24 }, 52)
        .to(this.state, { clipRight: 0, duration: 26 }, 52)
        .to(this.state, { originScale: 1.02, originX: .4, originY: .3, shadeOpacity: .12, duration: 26 }, 52)
        .to(this.state, { originScale: 1, originX: 0, originY: 0, shadeOpacity: .08, duration: 12 }, 78)
        .to(this.state, { originOpacity: 1, originCopyY: 0, hintOpacity: 0, duration: 10 }, 78)
        .to(this.state, { originCtaOpacity: 1, duration: 6 }, 84)
        .to(this.state, { exitY: -7, duration: 5 }, 95);
      this.timeline = timeline;
      timeline.progress(previousProgress);
      if (!this.active) timeline.scrollTrigger.disable(true);
      else timeline.scrollTrigger.refresh();
      this.schedule();
    }

    destroyTimeline() {
      if (this.timeline) {
        this.timeline.scrollTrigger.kill(true);
        this.timeline.kill();
        this.timeline = null;
      }
      this.resetPointer();
      this.inView = false;
    }

    screenChanged(event) {
      this.active = this.home.classList.contains("active");
      this.resetPointer();
      const focusOpening = this.active && event?.detail?.screenId === "home";
      const navigationFocus = document.activeElement;
      if (this.timeline) {
        if (this.active) {
          this.timeline.scrollTrigger.enable(true, true);
          // App navigation resets scroll and attempts focus before this event.
          // Refresh the restored layout before settling its formerly inert copy.
          requestAnimationFrame(() => {
            if (!this.active || !this.timeline) return;
            const heading = this.intro.querySelector("#home-title");
            const currentFocus = document.activeElement;
            const restoreFocus = (currentFocus === navigationFocus ||
              (navigationFocus === heading && currentFocus === document.body)) && !document.querySelector("dialog[open]");
            const trigger = this.timeline.scrollTrigger;
            trigger.refresh();
            trigger.update();
            if (focusOpening && (this.scroller?.scrollTop ?? window.scrollY) < 10) {
              trigger.getTween()?.progress(1);
              this.timeline.progress(trigger.progress);
              this.render();
              // Keep a newer user action, such as opening search, in control of focus.
              if (restoreFocus) heading?.focus({ preventScroll: true });
            }
            this.schedule();
          });
        } else {
          this.timeline.scrollTrigger.disable(true);
          // app.navigateTo focuses the home heading before its screenchange
          // event, so leave that future focus target outside an inert subtree.
          this.expose(this.intro, true);
        }
      }
      this.header();
    }

    measure() {
      const rect = this.stage.getBoundingClientRect();
      this.bounds = { left: rect.left, top: this.timeline?.scrollTrigger.isActive ? 0 : rect.top, width: rect.width, height: rect.height };
      this.geometryDirty = false;
    }

    move(event) {
      if (!this.timeline || !this.pointer.matches || event.pointerType !== "mouse" || !this.active || document.hidden) return;
      const bounds = this.bounds;
      if (!bounds.width || !bounds.height) return;
      this.inView = true;
      this.target.x = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
      this.target.y = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
      this.target.cursorX = event.clientX;
      this.target.cursorY = event.clientY;
      this.target.presence = 1;
      const overLink = Boolean(event.target.closest("a, button, summary"));
      this.target.scale = overLink ? 2.5 : 1;
      this.root.classList.toggle("is-cursor-over-link", overLink);
      this.schedule();
    }

    center() {
      this.target.x = this.target.y = this.target.presence = 0;
      this.target.scale = 1;
      this.root.classList.remove("is-cursor-over-link");
      this.schedule();
    }

    resetPointer() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = this.lastTime = null;
      this.target.x = this.target.y = this.target.presence = 0;
      this.target.scale = 1;
      Object.assign(this.current, this.target);
      this.root.classList.remove("is-moving", "is-cursor-over-link");
      for (const key of ["mouse-image-x", "mouse-image-y", "mouse-copy-x", "mouse-copy-y"]) this.write(key, "0px");
      for (const key of ["light-opacity", "warm-light-opacity", "cursor-opacity"]) this.write(key, "0");
    }

    schedule() {
      if (this.frame !== null || !this.active || document.hidden) return;
      this.frame = requestAnimationFrame(this.tick);
    }

    tick(time) {
      this.frame = null;
      if (!this.active || document.hidden) return;
      if (this.geometryDirty) this.measure(); // Read before any style writes.
      const elapsed = this.lastTime === null ? 1000 / 60 : Math.min(50, time - this.lastTime);
      this.lastTime = time;
      const alpha = 1 - Math.pow(.92, elapsed / (1000 / 60));
      let moving = false;
      for (const key of Object.keys(this.current)) {
        const distance = this.target[key] - this.current[key];
        const epsilon = key.startsWith("cursor") ? .05 : .0005;
        if (Math.abs(distance) <= epsilon) this.current[key] = this.target[key];
        else { this.current[key] += distance * alpha; moving = true; }
      }
      this.render();
      if (this.debug) this.root.dataset.rafCount = String(++this.frames);
      const scrollMoving = Boolean(this.timeline?.scrollTrigger.getTween()?.isActive());
      this.root.classList.toggle("is-moving", moving || scrollMoving);
      if (this.timeline && (scrollMoving || (moving && this.pointer.matches))) this.schedule();
      else this.lastTime = null;
    }

    write(key, value) {
      if (this.cache.get(key) === value) return;
      this.root.style.setProperty(`--${key}`, value);
      this.cache.set(key, value);
    }

    expose(element, visible) {
      element.inert = !visible;
      if (visible) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", "true");
    }

    render() {
      if (!this.timeline) return;
      for (const [key, [property, unit]] of Object.entries(properties)) this.write(property, this.state[key].toFixed(4) + unit);
      const progress = this.timeline.progress();
      const presence = this.pointer.matches && this.inView ? this.current.presence : 0;
      const originLight = clamp((progress - .52) / .26);
      const reveal = clamp((progress - .45) / .07) * (1 - clamp((progress - .78) / .12));
      const intensity = (1 - reveal * .6) * (progress >= .78 ? .8 : 1);
      this.write("progress", progress.toFixed(5));
      this.write("origin-reveal", clamp((progress - .52) / .26).toFixed(4));
      this.write("mouse-image-x", (this.current.x * 12 * intensity).toFixed(3) + "px");
      this.write("mouse-image-y", (this.current.y * 8 * intensity).toFixed(3) + "px");
      this.write("mouse-copy-x", (this.current.x * -3 * intensity).toFixed(3) + "px");
      this.write("mouse-copy-y", (this.current.y * -2 * intensity).toFixed(3) + "px");
      this.write("mouse-light-x", (50 + this.current.x * 45).toFixed(3) + "%");
      this.write("mouse-light-y", (50 + this.current.y * 45).toFixed(3) + "%");
      this.write("light-opacity", (presence * (1 - originLight)).toFixed(3));
      this.write("warm-light-opacity", (presence * originLight).toFixed(3));
      this.write("cursor-x", this.current.cursorX.toFixed(2) + "px");
      this.write("cursor-y", this.current.cursorY.toFixed(2) + "px");
      this.write("cursor-opacity", presence.toFixed(3));
      this.write("cursor-scale", this.current.scale.toFixed(3));
      this.root.dataset.progress = progress.toFixed(4);
      const phase = progress < .52 ? "discover" : progress < .78 ? "reveal" : "origin";
      if (this.root.dataset.phase !== phase) this.root.dataset.phase = phase;
      this.root.classList.toggle("has-origin", progress >= .78);
      this.currentChapter.textContent = progress < .78 ? "01" : "02";
      this.percent.textContent = `${Math.round(progress * 100).toString().padStart(2, "0")}%`;
      this.expose(this.intro, this.state.introOpacity > .45);
      this.expose(this.origin, this.state.originOpacity > .45);
      this.intro.querySelector(".hero-actions").inert = this.state.introCtaOpacity < .45;
      this.origin.querySelector(".hero-actions").inert = this.state.originCtaOpacity < .45;
      this.header();
    }

    header() {
      const scroll = this.scroller?.scrollTop ?? window.scrollY;
      const clear = this.active && (this.timeline ? this.timeline.progress() < .12 : scroll < 40);
      this.nav.classList.toggle("is-hero-clear", clear);
      this.nav.classList.toggle("is-hero-solid", !clear);
    }
  }

  const start = () => {
    const root = document.querySelector(".hero-experience");
    if (root) new LayeredHero(root);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
