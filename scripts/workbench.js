(() => {
  if (new URLSearchParams(location.search).get('desktop') === 'terminal') document.body.classList.add('desktop-terminal');
  const header = document.querySelector('header');
  const nav = header?.querySelector('nav');
  if (nav) {
    nav.id = 'site-navigation';
    nav.setAttribute('aria-label', 'Main navigation');
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.textContent = 'Menu';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.add('mobile-collapsed');
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(expanded));
      nav.classList.toggle('mobile-collapsed', !expanded);
    });
    header.insertBefore(toggle, nav);
    const normalize = pathname => pathname.replace(/\/$/, '/index.html');
    const page = normalize(location.pathname);
    nav.querySelectorAll('a').forEach(a => {
      const url = new URL(a.href, location.href);
      if (url.origin === location.origin && normalize(url.pathname) === page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    nav.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.add('mobile-collapsed');
        toggle.focus();
      }
    });
  }
  const main = document.querySelector('main') || document.querySelector('body > section');
  if (main) {
    if (!main.id) main.id = 'main-content';
    main.tabIndex = -1;
    const skip = document.createElement('a');
    skip.className = 'skip-link'; skip.href = '#' + main.id; skip.textContent = 'Skip to content';
    document.body.prepend(skip);
  }
  document.querySelectorAll('a[target="_blank"]').forEach(a => a.rel = 'noopener noreferrer');
  document.querySelectorAll('.socials a').forEach(a => {
    const icon = a.querySelector('i');
    if (icon && !a.hasAttribute('aria-label')) a.setAttribute('aria-label', icon.className.replace(/fab|fa-|\s+/g, ' ').trim());
  });
  document.querySelectorAll('iframe:not([title])').forEach(frame => frame.title = 'DC256 meetup location map');
  document.querySelectorAll('.event img, .next-event img, #partners img').forEach(img => img.loading = 'lazy');
  const input = document.getElementById('commandInput');
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.command;
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
    input.focus({preventScroll:true});
  }));
  const boot = document.getElementById('bootScreen');
  let timer;
  let bootRunning = false;
  const scrollShell = () => window.scrollShellToLatest?.();
  document.addEventListener('shell-command', event => {
    clearTimeout(timer);
    if (!boot) return;
    if (event.detail.clear) boot.textContent = '';
    else if (bootRunning) boot.textContent = 'user@dc256:~$ boot\n' + messages.join('\n');
    bootRunning = false;
  });
  const messages = ['Booting DC256 OS v3.1.4...', '[OK] Initializing terminal subsystem...', '[OK] Loading DEF CON protocols...', '[OK] Establishing secure connection...', '[OK] Authenticating node...', '[OK] Mounting /home/dc256/...', '[OK] Launching hacker interface...', 'Welcome to DC256. Engage.'];
  const replay = () => {
    clearTimeout(timer);
    if (!boot) return;
    document.getElementById('terminalOutput').textContent = '';
    boot.textContent = 'user@dc256:~$ boot\n';
    bootRunning = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { boot.textContent += messages.join('\n'); bootRunning = false; scrollShell(); return; }
    let i = 0;
    const step = () => { boot.textContent += (i ? '\n' : '') + messages[i++]; scrollShell(); if (i < messages.length) timer = setTimeout(step, 140); else bootRunning = false; };
    step();
  };
  document.getElementById('replayBoot')?.addEventListener('click', replay);
  replay();
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('motion-paused', document.hidden));
})();
