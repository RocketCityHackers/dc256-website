(() => {
  const key = 'dc256:last-fullscreen-boot';
  const cooldown = 30 * 60 * 1000;
  const now = Date.now();
  try {
    const last = Number(localStorage.getItem(key));
    if (last > 0 && now >= last && now - last < cooldown) return;
    localStorage.setItem(key, String(now));
  } catch (_) { /* Still allow entry when browser storage is unavailable. */ }

  const root = document.documentElement;
  let overlay;
  let timer;
  let finished = false;
  const restore = [];
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    root.classList.remove('boot-pending');
    restore.forEach(([element, inert]) => element.inert = inert);
    overlay?.remove();
    document.removeEventListener('keydown', onKey);
    if (overlay) {
      const main = document.querySelector('main');
      if (main) { main.tabIndex = -1; main.focus({preventScroll:true}); }
    }
  };
  const onKey = event => {
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
  };
  // A failed animation must never prevent access to the site.
  const watchdog = setTimeout(finish, 8000);
  root.classList.add('boot-pending');
  document.addEventListener('DOMContentLoaded', () => {
    if (finished) return;
    try {
      overlay = document.createElement('div');
      overlay.className = 'startup-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'startup-title');
      overlay.innerHTML = '<div class="startup-console"><p class="eyebrow">DEF CON GROUP 256 / ROCKET CITY</p><h1 id="startup-title">Initializing DC256<span aria-hidden="true">_</span></h1><pre class="startup-lines" aria-label="Startup sequence"></pre><div class="startup-progress" aria-hidden="true"><span></span></div><button type="button" class="button">Skip intro · Esc</button></div>';
      Array.from(document.body.children).forEach(element => {
        restore.push([element, element.inert]);
        element.inert = true;
      });
      document.body.append(overlay);
      const skip = overlay.querySelector('button');
      skip.addEventListener('click', finish);
      skip.focus({preventScroll:true});
      document.addEventListener('keydown', onKey);
      const lines = overlay.querySelector('pre');
      const progress = overlay.querySelector('.startup-progress span');
      const messages = ['user@dc256:~$ boot', 'Booting DC256 OS v3.1.4...', '[OK] Initializing terminal subsystem...', '[OK] Loading DEF CON protocols...', '[OK] Establishing secure connection...', '[OK] Authenticating node...', '[OK] Mounting /home/dc256/...', '[OK] Launching hacker interface...', 'Welcome to DC256. Engage.'];
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        lines.textContent = messages.join('\n');
        progress.style.width = '100%';
        timer = setTimeout(finish, 700);
      } else {
        let index = 0;
        const step = () => {
          if (finished) return;
          lines.textContent += (index ? '\n' : '') + messages[index++];
          progress.style.width = `${index / messages.length * 100}%`;
          timer = setTimeout(index < messages.length ? step : finish, index < messages.length ? 230 : 650);
        };
        step();
      }
    } catch (_) { finish(); }
  }, {once:true});
  window.addEventListener('pagehide', () => { clearTimeout(watchdog); finish(); }, {once:true});
})();
