/* Shared header + footer injection — keeps every page consistent. */
(function(){
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const active = a => path === a ? 'active' : '';

  const header = `
<header class="header">
  <div class="container-wt">
    <div class="header-row">
      <a class="brand" href="index.html"><span class="brand-dot"></span>WebThangs</a>
      <nav class="nav-desktop" aria-label="Primary">
        <a class="nav-link ${active('index.html')||(path===''?'active':'')}" href="index.html">Home</a>
        <a class="nav-link ${active('teardowns.html')}" href="teardowns.html">Teardowns</a>
        <a class="nav-link ${active('free-review.html')}" href="free-review.html">Free Review</a>
        <a class="nav-link ${active('about.html')}" href="about.html">Studio</a>
      </nav>
      <a class="btn btn-primary btn-sm cta-desktop" href="book.html">Book Call</a>
      <button class="menu-btn" data-menu-toggle aria-label="Menu" aria-expanded="false">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line class="l1" x1="3" y1="6" x2="21" y2="6"/>
          <line class="l2" x1="3" y1="12" x2="21" y2="12"/>
          <line class="l3" x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Site menu">
      <div class="mm-backdrop" data-mm-close aria-hidden="true"></div>
      <div class="mobile-menu-inner">
        <div class="mm-top">
          <span class="mm-eyebrow"><span class="mm-dot"></span>Menu</span>
          <button class="mm-close" data-mm-close aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          </button>
        </div>
        <nav class="mm-nav" aria-label="Mobile primary">
          ${[
            ['index.html','Home','Why your site loses leads'],
            ['teardowns.html','Website Teardowns','Real before & after fixes'],
            ['free-review.html','Free Review','60-second site critique'],
            ['about.html','Studio','How we work, what we ship']
          ].map(([href,label,desc],i)=>`
            <a class="mm-link ${active(href)||(href==='index.html'&&path===''?'active':'')}" href="${href}">
              <span class="mm-num">${String(i+1).padStart(2,'0')}</span>
              <span class="mm-text"><span class="mm-label">${label}</span><span class="mm-desc">${desc}</span></span>
              <svg class="mm-chev" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
            </a>`).join('')}
        </nav>
        <div class="mm-footer">
          <div class="mm-status"><span class="pulse-dot"></span>Studio open · booking June</div>
          <a class="btn btn-primary mm-cta" href="book.html">
            Book Strategy Call
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <div class="mm-meta">
            <a href="mailto:hello@webthangs.co">hello@webthangs.co</a>
            <span>© ${new Date().getFullYear()} WebThangs</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>`;

  const footer = `
<footer class="footer">
  <div class="footer-mark" aria-hidden="true">WebThangs</div>
  <div class="container-wt footer-grid">
    <div>
      <div class="brand"><span class="brand-dot"></span>WebThangs</div>
      <p class="mt-4 body-lg reading" style="max-width:38ch">A conversion growth studio. We turn the traffic you already have into measurable revenue.</p>
      <p class="mt-6 text-sm text-text-muted font-mono shipped"><span class="pulse-dot"></span> Last shipped <span id="shippedDate">today</span></p>
    </div>
    <div>
      <div class="text-xs uppercase tracking-wider text-text-muted font-mono" style="margin-bottom:18px">Explore</div>
      <ul style="display:grid;gap:10px" class="text-sm">
        <li><a class="text-muted-foreground" href="index.html">Home</a></li>
        <li><a class="text-muted-foreground" href="teardowns.html">Website Teardowns</a></li>
        <li><a class="text-muted-foreground" href="free-review.html">Free Website Review</a></li>
        <li><a class="text-muted-foreground" href="about.html">Studio</a></li>
      </ul>
    </div>
    <div>
      <div class="text-xs uppercase tracking-wider text-text-muted font-mono" style="margin-bottom:18px">Start</div>
      <p class="text-sm text-muted-foreground" style="margin-bottom:16px;max-width:30ch">Find out what's holding your website back.</p>
      <a class="btn btn-primary btn-sm" href="book.html">Book Strategy Call</a>
    </div>
  </div>
  <div class="container-wt footer-bottom">
    <div>© 2026 WebThangs — A conversion growth studio</div>
    <div>Conversion growth, not pretty websites.</div>
  </div>
</footer>`;

  // Inject early
  const slotH = document.getElementById('site-header');
  const slotF = document.getElementById('site-footer');
  if(slotH) slotH.outerHTML = header;
  if(slotF) slotF.outerHTML = footer;
})();
