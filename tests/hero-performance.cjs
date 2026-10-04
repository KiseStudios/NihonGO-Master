const { chromium } = require('playwright');
const { mkdir, writeFile, readFile } = require('node:fs/promises');
const path = require('node:path');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const label = process.env.HERO_RUN || 'after';
const output = `/tmp/nihongo-hero-performance/${label}`;
const percentile = (values, fraction) => {
  const sorted = [...values].sort((a,b) => a-b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))] || 0;
};
(async () => {
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const viewport of [{width:1366,height:768},{width:1920,height:1080}]) {
      const context = await browser.newContext({viewport});
      const page = await context.newPage();
      await page.route('https://fonts.googleapis.com/**', route => route.abort());
      if (label === 'before') {
        await page.route('**/js/scroll-hero.js*', route => route.fulfill({contentType:'application/javascript',path:'/tmp/nihongo-hero-before.js'}));
        await page.route('**/css/home.css*', route => route.fulfill({contentType:'text/css',path:'/tmp/nihongo-hero-before.css'}));
      }
      await page.addInitScript(() => {
        const originalRAF = window.requestAnimationFrame.bind(window);
        window.__heroPerf = {costs:[], gaps:[], samples:[], running:false};
        window.requestAnimationFrame = callback => originalRAF(time => {
          const start = performance.now();
          callback(time);
          if (window.__heroPerf.running && callback.name === 'bound tick') window.__heroPerf.costs.push(performance.now()-start);
        });
        let previous = 0;
        function sample(time) {
          const hero = document.querySelector('.scroll-hero');
          if (window.__heroPerf.running && hero) {
            if(previous) window.__heroPerf.gaps.push(time-previous);
            window.__heroPerf.samples.push({time,scroll:scrollY,frame:Number(hero.dataset.frame),target:Number(hero.dataset.targetFrame),progress:Number(hero.dataset.progress),loaded:Number(hero.dataset.loadedFrames)});
          }
          previous = time;
          originalRAF(sample);
        }
        originalRAF(sample);
      });
      await page.goto(`${base}/?heroDebug=1`, {waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.querySelector('.scroll-hero').dataset.frame==='1');
      await page.mouse.move(viewport.width/2,viewport.height/2);
      await page.waitForTimeout(250);
      const startTime = Date.now();
      await page.evaluate(()=>window.__heroPerf.running=true);
      // Coarse wheel, quick wheel/reversal and fine trackpad-style deltas.
      for(const [steps,delta,interval] of [[10,100,60],[4,320,65],[4,-320,65],[35,12,16],[35,-12,16]]) {
        for(let i=0;i<steps;i++){await page.mouse.wheel(0,delta);await page.waitForTimeout(interval);}

      }
      await page.waitForTimeout(250);
      const raw=await page.evaluate(()=>{window.__heroPerf.running=false;return window.__heroPerf;});
      const state=await page.locator('.scroll-hero').evaluate(h=>({...h.dataset}));
      const count=Number(state.frameCount)||240;
      let wrongDirection=0,changing=0,heldWhileMoving=0;
      for(let i=1;i<raw.samples.length;i++) {
        const a=raw.samples[i-1],b=raw.samples[i];
        if(b.scroll!==a.scroll) {changing++;if(b.frame===a.frame && b.target!==b.frame)heldWhileMoving++;}
        if(Math.sign(b.frame-a.frame) && Math.sign(b.target-a.target) && Math.sign(b.frame-a.frame)!==Math.sign(b.target-a.target))wrongDirection++;
      }
      const result={viewport,frameCount:count,elapsedMs:Date.now()-startTime,rafCostP95:percentile(raw.costs,.95),rafCostMax:Math.max(0,...raw.costs),rafDeltaP95:percentile(raw.gaps,.95),normalizedLagP95:percentile(raw.samples.map(s=>Math.abs(s.target-s.frame)/(count-1)),.95),heldWhileMoving,changing,wrongDirection,loaded:Number(state.loadedFrames),cached:Number(state.cachedFrames),decodedMiB:Number(state.decodedBytes)/1024/1024,compressedMiB:Number(state.compressedBytes)/1024/1024};
      results.push(result);
      console.log(JSON.stringify(result));
      await writeFile(path.join(output,`${viewport.width}-samples.json`),JSON.stringify(raw));
      await context.close();
    }
  } finally {await browser.close();}
  await writeFile(path.join(output,'summary.json'),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
