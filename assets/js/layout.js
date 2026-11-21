/* ============================================================
   CENTRUM MĄDREJ NAUKI — Shared Layout (Header + Footer)
   ============================================================ */

(function () {
  'use strict';

  /* ---- Helpers ---- */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ---- Detect current page for active-link highlighting ---- */
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  function isActive(href) {
    const h = href.replace(/\/$/, '') || '/';
    if (h === '/') return path === '/';
    return path === h || path.startsWith(h + '/');
  }

  /* ---- Header HTML ---- */
  function headerHTML() {
    const navLinks = [
      { label: 'O nas',        href: '/o-nas' },
      {
        label: 'Oferta',       href: '/oferta',
        children: [
          { label: 'Język angielski',        href: '/oferta/angielski' },
          { label: 'Laboratorium pomysłów',  href: '/oferta/laboratorium' },
          { label: 'Zajęcia kreatywne',      href: '/oferta/kreatywne' },
        ]
      },
      { label: 'Matlandoo',    href: '/matlandoo' },
      { label: 'Urodziny',     href: '/urodziny' },
      { label: 'Galeria',      href: '/galeria' },
      { label: 'Wydarzenia',   href: '/wydarzenia' },
      { label: 'Kontakt',      href: '/kontakt' },
    ];

    const desktopLinks = navLinks.map(item => {
      if (item.children) {
        const active = isActive(item.href) ? ' aria-current="page"' : '';
        const sub = item.children.map(c =>
          `<a href="${c.href}"${isActive(c.href) ? ' aria-current="page"' : ''}>${c.label}</a>`
        ).join('');
        return `
          <li class="nav-item" role="none">
            <a href="${item.href}" class="nav-link"${active} role="menuitem">
              ${item.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <div class="dropdown" role="menu" aria-label="Podmenu Oferta">${sub}</div>
          </li>`;
      }
      const active = isActive(item.href) ? ' aria-current="page"' : '';
      return `<li class="nav-item" role="none"><a href="${item.href}" class="nav-link"${active} role="menuitem">${item.label}</a></li>`;
    }).join('');

    const drawerLinks = navLinks.map(item => {
      if (item.children) {
        const sub = item.children.map(c =>
          `<a href="${c.href}"${isActive(c.href) ? ' aria-current="page"' : ''}>${c.label}</a>`
        ).join('');
        return `
          <div class="drawer-accordion">
            <button class="drawer-accordion-btn" aria-expanded="false" aria-controls="drawer-sub-oferta">
              Oferta
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="drawer-submenu" id="drawer-sub-oferta" role="list">${sub}</div>
          </div>`;
      }
      const active = isActive(item.href) ? ' aria-current="page"' : '';
      return `<a href="${item.href}" class="drawer-link"${active}>${item.label}</a>`;
    }).join('');

    return `
<header class="site-header" role="banner">
  <div class="container header-inner">
    <a href="/" class="header-logo" aria-label="Centrum Mądrej Nauki — Strona główna">
      <span class="header-logo__name">Centrum Mądrej Nauki<span>Olkusz · ul. Legionów Polskich 14</span></span>
    </a>

    <nav class="site-nav" role="navigation" aria-label="Nawigacja główna">
      <ul role="menubar" style="display:flex;align-items:center;gap:0.25rem;list-style:none;">${desktopLinks}</ul>
    </nav>

    <a href="/kontakt" class="btn btn--primary header-cta" aria-label="Zapisz dziecko na zajęcia">
      Zapisz dziecko
    </a>

    <button class="hamburger" id="hamburger-btn" aria-expanded="false" aria-controls="nav-drawer" aria-label="Otwórz menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<nav class="nav-drawer" id="nav-drawer" role="navigation" aria-label="Menu mobilne" aria-hidden="true">
  <div class="drawer-nav">
    ${drawerLinks}
    <div class="drawer-cta">
      <a href="/kontakt" class="btn btn--primary" style="width:100%;justify-content:center;">Zapisz dziecko</a>
    </div>
  </div>
</nav>`;
  }

  /* ---- Footer HTML ---- */
  function footerHTML() {
    return `
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">

      <div class="footer-brand">
        <div class="logo-wrap">
          <img src="/assets/images/Logo_transparent.png" alt="Logo Centrum Mądrej Nauki" width="44" height="44" loading="lazy">
          <div class="footer-brand-name">
            Centrum Mądrej Nauki
            <small>Miejsce, w którym dzieci chcą się uczyć</small>
          </div>
        </div>
        <p>Oferujemy zajęcia z języka angielskiego, matematyki, kreatywne warsztaty i niesamowite urodziny dla dzieci w Olkuszu.</p>
        <div class="footer-social">
          <a href="https://facebook.com/centrumMadrejNauki" target="_blank" rel="noopener noreferrer" aria-label="Facebook Centrum Mądrej Nauki">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Oferta</h4>
        <ul>
          <li><a href="/oferta">Przegląd oferty</a></li>
          <li><a href="/oferta/angielski">Język angielski</a></li>
          <li><a href="/oferta/laboratorium">Laboratorium pomysłów</a></li>
          <li><a href="/oferta/kreatywne">Zajęcia kreatywne</a></li>
          <li><a href="/matlandoo">Matlandoo</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Centrum</h4>
        <ul>
          <li><a href="/">Strona główna</a></li>
          <li><a href="/o-nas">O nas</a></li>
          <li><a href="/urodziny">Urodziny</a></li>
          <li><a href="/galeria">Galeria</a></li>
          <li><a href="/wydarzenia">Wydarzenia</a></li>
          <li><a href="/kontakt">Kontakt</a></li>
          <li><a href="/polityka-prywatnosci">Polityka prywatności</a></li>
        </ul>
      </div>

      <div class="footer-col footer-contact">
        <h4>Kontakt</h4>
        <p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ul. Legionów Polskich 14,<br>32-300 Olkusz
        </p>
        <p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.74a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <a href="tel:+48538956998">538 956 998</a>
        </p>
        <p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:kolekcjepolekcjach@gmail.com">kolekcjepolekcjach<br>@gmail.com</a>
        </p>
      </div>

    </div>

    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} Centrum Mądrej Nauki. Wszelkie prawa zastrzeżone.</p>
      <div style="display:flex;gap:1.5rem;">
        <a href="/polityka-prywatnosci">Polityka prywatności</a>
        <a href="/kontakt">Kontakt</a>
      </div>
    </div>
  </div>
</footer>`;
  }

  /* ---- Inject into DOM ---- */
  function inject() {
    const main = $('main');
    if (!main) return;

    // Wrap header+drawer in a fragment and insert before <main>
    const wrap = document.createElement('div');
    wrap.innerHTML = headerHTML();
    // insertBefore moves children one by one (they must exist as Elements)
    while (wrap.firstElementChild) {
      document.body.insertBefore(wrap.firstElementChild, main);
    }

    const footerWrap = document.createElement('div');
    footerWrap.innerHTML = footerHTML();
    while (footerWrap.firstElementChild) {
      document.body.appendChild(footerWrap.firstElementChild);
    }
  }

  /* ---- Hamburger & Drawer ---- */
  function initMobileMenu() {
    const btn    = $('#hamburger-btn');
    const drawer = $('#nav-drawer');
    if (!btn || !drawer) return;

    function toggleDrawer(open) {
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
      drawer.setAttribute('aria-hidden', !open);
      drawer.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      toggleDrawer(!isOpen);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (
        btn.getAttribute('aria-expanded') === 'true' &&
        !drawer.contains(e.target) &&
        !btn.contains(e.target)
      ) toggleDrawer(false);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        toggleDrawer(false);
        btn.focus();
      }
    });

    // Accordion in drawer
    $$('.drawer-accordion-btn').forEach(accBtn => {
      accBtn.addEventListener('click', () => {
        const expanded = accBtn.getAttribute('aria-expanded') === 'true';
        accBtn.setAttribute('aria-expanded', !expanded);
        const submenu = $('#' + accBtn.getAttribute('aria-controls'));
        if (submenu) submenu.classList.toggle('is-open', !expanded);
      });
    });
  }

  /* ---- Run ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { inject(); initMobileMenu(); });
  } else {
    inject();
    initMobileMenu();
  }
})();
