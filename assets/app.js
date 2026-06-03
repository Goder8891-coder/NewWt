"use strict";
/* WebThangs V-NEXT — motion + interaction engine
   Loads GSAP + ScrollTrigger + Lenis from CDN, then orchestrates every section. */
(function(){
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const onIdle = window.requestIdleCallback || (cb => setTimeout(cb, 200));

  // ─── Local script loader (with timeout so offline never stalls boot) ──
  ;
      const t=setTimeout(()=>finish(()=>rej(new Error('timeout '+src))), timeoutMs||2500);
      s.onload=()=>finish(res);
      s.onerror=()=>finish(()=>rej(new Error('error '+src)));
      document.head.appendChild(s);
    });
  }
  async function boot(){
    try{ initHero(); }catch(e){}
    init();
  }

  // ─── Initialise ───────────────────────────────────────────
  function init(){
    
    initScrollProgress();
    
    
    initStickyMobileBar();
    initHeader();
    initMobileMenu();
    initHero();
    initJourneyRail();
    initFunnel();
    initCalculator();
    initTeardownSeams();
    initMethodTheatre();
    initReceipts();
    initPullQuote();
    initFAQ();
    initFinalRotator();
    
    initRevealOnScroll();
    
    initFooterShipped();
  }

  // Lenis removed — native scroll keeps things fast.
  

  // ─── Scroll progress hairline ─────────────────────────────
  function initScrollProgress(){
    /* Single rAF-driven scroll controller. */
    var rafId=null,pending=false;
    const bar = document.createElement("div"); bar.className="scroll-progress"; document.body.appendChild(bar);
    function upd(){ const h = document.documentElement.scrollHeight - innerHeight; const p = h>0 ? Math.min(1, scrollY/h) : 0; bar.style.width = (p*100).toFixed(1)+"%"; }
    addEventListener("scroll", upd, {passive:true}); upd();
  }

  // ─── Custom cursor — removed (DOM + listeners gone) ──────
  

  // ─── Page-transition curtain — removed; keep initial reveal only ──
  

  // ─── Sticky mobile CTA bar ────────────────────────────────
  function initStickyMobileBar(){
    if(innerWidth >= 900) return;
    const bar = document.createElement('div'); bar.className='mobile-cta-bar';
    bar.innerHTML = '<div class="label">Ready when you are</div><a class="btn btn-primary" href="book.html">Book Call</a>';
    document.body.appendChild(bar);
    addEventListener('scroll',()=>{
      const p = scrollY / (document.documentElement.scrollHeight - innerHeight);
      bar.classList.toggle('show', p > 0.4);
    }, {passive:true});
  }

  // ─── Header behaviour + brand letter fan-in ───────────────
  function initHeader(){
    const h = document.querySelector('.header'); if(!h) return;
    addEventListener('scroll',()=>{ h.classList.toggle('scrolled', scrollY>120); }, {passive:true});

    // Wrap brand letters
    const brand = h.querySelector('.brand');
    if(brand){
      const text = brand.lastChild && brand.lastChild.nodeType===3 ? brand.lastChild.textContent : 'WebThangs';
      if(brand.lastChild && brand.lastChild.nodeType===3) brand.removeChild(brand.lastChild);
      [...text].forEach((ch,i)=>{
        const s=document.createElement('span'); s.className='ltr'; s.textContent=ch;
        s.style.opacity='1'; s.style.transform='none';
        s.style.transition=`opacity 480ms cubic-bezier(.16,1,.3,1) ${i*28}ms, transform 600ms cubic-bezier(.16,1,.3,1) ${i*28}ms`;
        brand.appendChild(s);
      });
    }

    // Nav numeric indices
    h.querySelectorAll('.nav-link').forEach((a,i)=>{
      const idx = document.createElement('span'); idx.className='nav-idx';
      idx.textContent = String(i+1).padStart(2,'0') + ' / ' + (a.textContent||'').toLowerCase();
      a.appendChild(idx);
    });
  }

  // ─── Mobile menu morph + sheet ────────────────────────────
  function initMobileMenu(){
    const btn = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('mobileMenu');
    if(!btn || !menu) return;
    let lastFocus = null;
    const morph = (open)=>{
      const svg = btn.querySelector('svg'); if(!svg) return;
      const l1=svg.querySelector('.l1'), l2=svg.querySelector('.l2'), l3=svg.querySelector('.l3');
      if(open){
        if(l1) l1.setAttribute('transform','translate(0,6) rotate(45 12 6)');
        if(l2) l2.setAttribute('opacity','0');
        if(l3) l3.setAttribute('transform','translate(0,-6) rotate(-45 12 18)');
      }else{
        if(l1) l1.removeAttribute('transform'); if(l2) l2.removeAttribute('opacity'); if(l3) l3.removeAttribute('transform');
      }
    };
    const open = ()=>{
      lastFocus = document.activeElement;
      menu.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      document.body.style.overflow='hidden';
      morph(true);
      // Focus first link after animation has started
      setTimeout(()=>{ const first = menu.querySelector('.mm-link, .mm-close'); if(first) first.focus(); }, 200);
    };
    const close = ()=>{
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.body.style.overflow='';
      morph(false);
      if(lastFocus && lastFocus.focus) lastFocus.focus();
    };
    btn.addEventListener('click',()=>{
      menu.classList.contains('open') ? close() : open();
    });
    // Close interactions
    menu.addEventListener('click', e=>{
      if(e.target.closest('[data-mm-close]')) { close(); return; }
      if(e.target.tagName==='A' && !e.target.closest('[data-mm-close]')) close();
    });
    document.addEventListener('keydown', e=>{
      if(!menu.classList.contains('open')) return;
      if(e.key==='Escape'){ e.preventDefault(); close(); return; }
      if(e.key==='Tab'){
        const focusables = menu.querySelectorAll('a, button');
        if(!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length-1];
        if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
      }
    });
  }



  // ─── Hero choreography ───────────────────────────────────
  function initHero(){
    const h1 = document.querySelector('.h-hero[data-words]');
    if(h1 && !h1.dataset.split){
      h1.dataset.split='1';
      // Walk text nodes, wrap each word with .hero-word > span
      const html = h1.innerHTML;
      // Split preserving inline <span class="hero-accent">…</span>
      const tmp = document.createElement('div'); tmp.innerHTML = html;
      const out = [];
      function walk(node){
        node.childNodes.forEach(n=>{
          if(n.nodeType===3){
            n.textContent.split(/(\s+)/).forEach(part=>{
              if(/^\s+$/.test(part)) out.push(document.createTextNode(' '));
              else if(part){
                const w=document.createElement('span'); w.className='hero-word';
                const inner=document.createElement('span'); inner.textContent=part;
                w.appendChild(inner); out.push(w);
              }
            });
          }else if(n.nodeType===1){
            // For .hero-accent, wrap whole element as a word
            const w=document.createElement('span'); w.className='hero-word';
            const inner=document.createElement('span'); inner.appendChild(n.cloneNode(true));
            w.appendChild(inner); out.push(w);
          }
        });
      }
      walk(tmp);
      h1.innerHTML='';
      out.forEach(n=>h1.appendChild(n));
      // Add the "+" badge to the .hero-accent
      const accent = h1.querySelector('.hero-accent');
      if(accent){
        const b=document.createElement('span'); b.className='more-badge'; b.textContent='+';
        accent.appendChild(b);
      }
      // Trigger
      setTimeout(function(){ h1.classList.add('ready'); }, 0);
    }

    // removed: marching-ants per-button overlay (motion noise on every secondary button)

    // Primary button arrow nudge class
    document.querySelectorAll('.btn .icon').forEach(s=>s.classList.add('icon-arrow'));

    // Audit mock loop
    

    // Dot grid bg
    
  }

  
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  

  // ─── Journey rail ignition ───────────────────────────────
  function initJourneyRail(){
    const nodes = document.querySelectorAll('.journey-node');
    if(!nodes.length) return;
    if(!('IntersectionObserver' in window)){ nodes.forEach(n=>n.classList.add('ignite')); return; }
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('ignite'); });
    },{threshold:0.6});
    nodes.forEach((n,i)=>{ setTimeout(()=>io.observe(n), i*120); });
  }

  // ─── Funnel patches ──────────────────────────────────────
  function initFunnel(){
    const labels = document.querySelectorAll('.funnel-label');
    if(!labels.length) return;
    let patched=0;
    labels.forEach(l=>{
      l.addEventListener('click',()=>{
        if(l.classList.contains('patched')) return;
        const idx = l.dataset.idx;
        const hole = document.querySelector(`.funnel-hole[data-idx="${idx}"]`);
        if(hole){ hole.classList.add('active'); setTimeout(()=>{hole.classList.add('patched');hole.classList.remove('active');},900); }
        l.classList.add('patched');
        patched++;
        if(patched===labels.length){
          // Easter egg pill
          const wrap = document.querySelector('.funnel-wrap');
          if(wrap && !wrap.querySelector('.recovered')){
            const p=document.createElement('div'); p.className='recovered';
            p.style.cssText='position:absolute;left:50%;top:10%;transform:translateX(-50%);padding:8px 14px;border-radius:9999px;background:var(--primary);color:var(--primary-foreground);font-family:var(--font-mono);font-size:12px;font-weight:600;box-shadow:0 0 24px var(--primary-glow);opacity:0;transition:opacity 480ms,transform 480ms cubic-bezier(.16,1,.3,1);';
            p.textContent='+ Leads recovered';
            wrap.style.position='relative'; wrap.appendChild(p);
            requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.opacity='1';p.style.transform='translateX(-50%) translateY(0)';}));
          }
        }
      });
    });
  }

  // ─── Calculator + odometer + gap chart ──────────────────
  function initCalculator(){
    const visitors = document.getElementById('visitors');
    const value = document.getElementById('value');
    if(!visitors || !value) return;
    const visOut = document.getElementById('visitorsOut');
    const valOut = document.getElementById('valueOut');
    const leads = document.getElementById('leadsOut');
    const rev = document.getElementById('revOut');
    const chart = document.getElementById('gapChart');

    function setRangeFill(input){
      const min=+input.min, max=+input.max, v=+input.value;
      input.style.setProperty('--rp', ((v-min)/(max-min)*100)+'%');
    }
    [visitors,value].forEach(r=>{setRangeFill(r); r.addEventListener('input',()=>{setRangeFill(r);update();});});

    function fmt(n){return n.toLocaleString('en-US');}
    function update(){
      const v=+visitors.value, p=+value.value;
      odoText(visOut, fmt(v));
      odoText(valOut, '$'+fmt(p));
      const lo=Math.round(v*0.01), hi=Math.round(v*0.03);
      odoText(leads, fmt(lo)+'–'+fmt(hi));
      odoText(rev, '$'+fmt(lo*p)+'–$'+fmt(hi*p));
      drawChart(v,p);
    }
    function odoText(el, txt){ if(!el) return; el.textContent=txt; el.classList.add('odo-pulse'); setTimeout(()=>el.classList.remove('odo-pulse'),320); }

    function drawChart(v,p){
      if(!chart) return;
      const W=600,H=220;
      const baseLine = [];
      const liftLine = [];
      for(let i=0;i<=20;i++){
        const x = i/20;
        // base: gentle curve ~ low conversion
        baseLine.push([x*W, H - 30 - 20*Math.sin(x*Math.PI)]);
        // lift: higher curve
        liftLine.push([x*W, H - 60 - 80*Math.sin(x*Math.PI) - 20*Math.sin(x*Math.PI*2)]);
      }
      const baseD = 'M'+baseLine.map(p=>p.join(',')).join(' L');
      const liftD = 'M'+liftLine.map(p=>p.join(',')).join(' L');
      const areaD = liftD + ' L'+W+','+H+' L0,'+H+' Z';
      chart.innerHTML = `
        <defs>
          <linearGradient id="gapG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#c7e03e" stop-opacity=".6"/>
            <stop offset="100%" stop-color="#c7e03e" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#gapG)"/>
        <path d="${baseD}" fill="none" stroke="#636363" stroke-width="1.5" stroke-dasharray="3 3"/>
        <path d="${liftD}" fill="none" stroke="#c7e03e" stroke-width="2.5" stroke-linecap="round"/>
        ${[3,8,13,17].map(i=>{const pt=liftLine[i];return `<circle cx="${pt[0]}" cy="${pt[1]}" r="4" fill="#c7e03e"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/></circle>`;}).join('')}
      `;
    }
    update();
  }

  // ─── Teardown seam slider hint + drag ────────────────────
  function initTeardownSeams(){
    document.querySelectorAll('.seam-wrap').forEach(wrap=>{
      let dragging=false;
      const set=(x)=>{
        const r=wrap.getBoundingClientRect();
        const pct=Math.max(0,Math.min(100, ((x-r.left)/r.width)*100));
        wrap.style.setProperty('--seam', pct+'%');
      };
      const start=e=>{dragging=true; set(('touches' in e? e.touches[0].clientX : e.clientX));};
      const move=e=>{if(!dragging) return; set(('touches' in e? e.touches[0].clientX : e.clientX));};
      const end=()=>dragging=false;
      wrap.addEventListener('mousedown',start);
      addEventListener('mousemove',move); addEventListener('mouseup',end);
      wrap.addEventListener('touchstart',start,{passive:true}); wrap.addEventListener('touchmove',move,{passive:true}); wrap.addEventListener('touchend',end);
      // Hint
      const io=new IntersectionObserver(en=>{if(en[0].isIntersecting){wrap.classList.add('hint'); io.disconnect();}},{threshold:.5});
      io.observe(wrap);
    });
    // Severity ladders — convert .sev[data-sev=N] to ladder if not yet
    document.querySelectorAll('.sev').forEach(s=>{
      const n = +(s.dataset.sev||3);
      if(s.querySelector('.sev-ladder')) return;
      s.innerHTML='';
      const lad=document.createElement('div'); lad.className='sev-ladder'+(n>=4?' danger':'');
      for(let i=1;i<=5;i++){const b=document.createElement('span'); b.className='bar'+(i<=n?' lit':''); lad.appendChild(b);}
      s.appendChild(lad);
      const lbl=document.createElement('div'); lbl.className='sev-label'; lbl.textContent='SEV · '+String(n).padStart(2,'0');
      const card = s.closest('.card-wt'); if(card){card.appendChild(lbl); card.classList.add('dossier'); card.dataset.case = (card.dataset.case||(String([...document.querySelectorAll('.teardown-grid .card-wt')].indexOf(card)+1).padStart(2,'0')));}
      const io=new IntersectionObserver(en=>{if(en[0].isIntersecting){lad.classList.add('on');io.disconnect();}},{threshold:.4});
      io.observe(lad);
    });
  }

  // ─── Method theatre (pin + sequence) ─────────────────────
  function initMethodTheatre(){
    const steps = document.querySelectorAll('.method-step');
    if(!steps.length) return;
    const method = steps[0].parentElement;
    // No pinning, no scrub, no motion. Just mark steps live when they enter view.
    const io = new IntersectionObserver(en=>{
      en.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('live'); io.unobserve(e.target); }});
    },{threshold:.25});
    steps.forEach(s=>io.observe(s));
    if(method) method.style.setProperty('--method-progress','100%');
  }

  // ─── Receipts — no tilt, no motion. Static cards only. ─────
  function initReceipts(){
    // Loom static scrubber + waves only (no animation).
    const loom = document.querySelector('.r-loom');
    if(loom){
      const v = loom.querySelector('.video');
      if(v && !v.querySelector('.scrubber')){
        const s=document.createElement('div'); s.className='scrubber'; v.appendChild(s);
        s.style.width='32%';
      }
      if(!loom.querySelector('.waves')){
        const w=document.createElement('div'); w.className='waves';
        w.innerHTML='<i></i>'.repeat(8);
        var loomMeta = loom.querySelector('.meta'); if(loomMeta) loomMeta.appendChild(w);
      }
    }
  }

  // ─── Pull quote — word-by-word scrub reveal ──────────────
  function initPullQuote(){
    const q = document.querySelector('.pull-quote');
    if(!q) return;
    q.querySelectorAll('.mark').forEach((m,i)=>m.classList.add(i===0?'l':'r'));
    q.classList.add('in');
    // No background drift, no scrub. Static composition.
  }

  // ─── FAQ — indices + plus icon (already styled) ──────────
  function initFAQ(){
    const faq = document.querySelector('.faq');
    if(!faq) return;
    const items = faq.querySelectorAll('details');
    items.forEach((d,i)=>{
      const sum = d.querySelector('summary'); if(!sum) return;
      if(!sum.querySelector('.faq-idx')){
        const idx=document.createElement('span'); idx.className='faq-idx';
        idx.textContent = String(i+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
        sum.prepend(idx);
      }
    });
  }

  // ─── Final CTA rotator — blur+mask split-flap (GSAP if available) ─────
  function initFinalRotator(){
    const rot = document.querySelector('.final-rotator');
    if(!rot) return;
    const words = (rot.dataset.words||'more,leads,calls,bookings,revenue').split(',');
    rot.innerHTML = '<span class="rot-word">'+words[0]+'</span>';
    const node = rot.querySelector('.rot-word');
    let i = 0;
    function swap(){
      i = (i+1) % words.length;
      const next = words[i];
      if(window.gsap){
        const tl = window.gsap.timeline();
        tl.to(node,{yPercent:-115, filter:'blur(8px)', opacity:0, duration:.45, ease:'power3.in'})
          .add(()=>{ node.textContent = next; })
          .fromTo(node,{yPercent:115, filter:'blur(8px)', opacity:0},{yPercent:0, filter:'blur(0px)', opacity:1, duration:.65, ease:'power3.out'});
      }else{
        node.style.transition='transform .35s ease, opacity .25s, filter .35s';
        node.style.transform='translateY(-115%)'; node.style.opacity='0'; node.style.filter='blur(8px)';
        setTimeout(()=>{ node.textContent=next; node.style.transition='none'; node.style.transform='translateY(115%)';
          requestAnimationFrame(()=>requestAnimationFrame(()=>{
            node.style.transition='transform .55s cubic-bezier(.2,.7,.2,1), opacity .35s, filter .55s';
            node.style.transform='translateY(0)'; node.style.opacity='1'; node.style.filter='blur(0)';
          }));
        },360);
      }
    }
    setInterval(swap, 3400);
  }

  // ─── Magnetic buttons — gsap.quickTo for buttery smooth ─────
  

  // ─── Reveal: text only, single subtle fade. No card movement. ────
  function initRevealOnScroll(){
    if(reduced) return;
    const els = document.querySelectorAll('section h2, .h-display, .display-md, .eyebrow');
    els.forEach(el=>{el.style.opacity='0';el.style.transition='opacity 500ms ease';});
    const io=new IntersectionObserver(en=>{
      en.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity='1'; io.unobserve(e.target); } });
    },{threshold:.1, rootMargin:'0px 0px -10% 0px'});
    els.forEach(el=>io.observe(el));
  }

  // ─── About display name split ────────────────────────────
  

  // ─── Footer "last shipped" date ──────────────────────────
  function initFooterShipped(){
    const el = document.getElementById('shippedDate'); if(!el) return;
    const d = new Date();
    el.textContent = d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    // Inject live status pill
    const f = document.querySelector('.footer .container-wt');
    if(f && !document.querySelector('.live-pill')){
      const pill=document.createElement('div'); pill.className='live-pill';
      pill.innerHTML='<span class="d"></span>Booking calls · responds in 12h';
      pill.style.marginTop='24px';
      f.appendChild(pill);
    }
  }

  // Signature motion umbrella — removed per user request (cards/sections must not move).
  

  // ── Boot ──
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();

  // ─── Vignette counters (counts up on scroll-in) ───────────
  function initVignetteCounters(){
    const nodes = document.querySelectorAll('[data-count-to]');
    if(!nodes.length) return;
    const animate = (el)=>{
      if(el.dataset.counted) return; el.dataset.counted='1';
      const from = +(el.dataset.countFrom||0);
      const to = +el.dataset.countTo;
      const prefix = (el.textContent.match(/^[^\d-]*/)||[''])[0];
      const suffix = (el.textContent.match(/[^\d]*$/)||[''])[0];
      const dur = 1100; const start = performance.now();
      function tick(now){
        const t = Math.min(1, (now-start)/dur);
        const eased = 1 - Math.pow(1-t, 3);
        const v = Math.round(from + (to-from)*eased);
        el.textContent = prefix + v + suffix;
        if(t<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(en=>{
      en.forEach(e=>{ if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }});
    },{threshold:.4});
    nodes.forEach(n=>io.observe(n));
  }
  // run after DOM is ready
  if(document.readyState!=='loading') initVignetteCounters();
  else document.addEventListener('DOMContentLoaded', initVignetteCounters);

