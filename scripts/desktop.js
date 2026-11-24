(() => {
  const apps = {
    welcome:{title:'Welcome to DC256',icon:'folder',template:'welcomeContent',width:650,height:610,x:155,y:58},
    terminal:{title:'user@dc256:~ — Terminal',icon:'terminal',url:'classic.html?desktop=terminal',width:590,height:390,x:765,y:220},
    events:{title:'Events — Community browser',icon:'calendar',url:'events.html',width:820,height:600,x:240,y:70},
    about:{title:'About DC256 — Community browser',icon:'globe',url:'about.html',width:800,height:600,x:280,y:90},
    wardrive:{title:'Wardrive 2026 — Results',icon:'radio',url:'wardrive2026.html',width:880,height:620,x:200,y:60},
    contact:{title:'Contact — Open a connection',icon:'mail',url:'contact.html',width:760,height:580,x:300,y:110},
    links:{title:'Connections — Community links',icon:'globe',template:'linksContent',width:480,height:520,x:600,y:90}
  };
  const layer = document.getElementById('windowLayer');
  const tasks = document.getElementById('taskList');
  const windows = new Map(); let z = 10; let active;
  const mobile = () => matchMedia('(max-width: 700px)').matches;
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const focus = id => {
    const state = windows.get(id); if (!state) return;
    active = id; state.element.hidden = false; state.element.style.zIndex = ++z;
    windows.forEach((item,key) => { item.element.classList.toggle('active',key===id); item.task.setAttribute('aria-pressed',String(key===id)); });
  };
  const minimize = id => { const state=windows.get(id); state.element.hidden=true; state.task.setAttribute('aria-pressed','false'); if(active===id)active=null; };
  const close = id => {const state=windows.get(id);state.element.remove();state.task.remove();windows.delete(id);if(active===id)active=null;};
  const maximize = id => { const state=windows.get(id); const on=state.element.classList.toggle('maximized');state.element.querySelector('[data-action="maximize"]').setAttribute('aria-label',on?'Restore window':'Maximize window');focus(id); };
  const open = id => {
    if (!apps[id]) return;
    if(windows.has(id)){focus(id);return;}
    const app=apps[id];
    const element=document.createElement('section'); element.className='os-window';element.dataset.app=id;
    element.setAttribute('role','region');element.setAttribute('aria-label',app.title);
    const x=Math.min(app.x,Math.max(8,innerWidth-app.width-20));const y=Math.min(app.y,Math.max(8,innerHeight-app.height-100));
    Object.assign(element.style,{left:x+'px',top:y+'px',width:app.width+'px',height:app.height+'px'});
    element.innerHTML=`<div class="os-titlebar"><div class="window-title">${icon(app.icon)}<span>${app.title}</span></div><div class="window-controls"><button data-action="minimize" aria-label="Minimize window">_</button><button data-action="maximize" aria-label="Maximize window">□</button><button data-action="close" aria-label="Close window">×</button></div></div><div class="os-window-body"></div><div class="window-status"><span>${id==='terminal'?'LOCAL SHELL / TYPE HELP TO EXPLORE':'DC256 OS / '+id.toUpperCase()}</span><span>◢</span></div>`;
    const body=element.querySelector('.os-window-body');
    if(app.template)body.append(document.getElementById(app.template).content.cloneNode(true));
    else {
      const frame=document.createElement('iframe');frame.src=app.url;frame.title=app.title;
      frame.addEventListener('load', () => {
        try {
          const frameDocument = frame.contentDocument;
          const homePath = new URL('index.html', document.baseURI).pathname;
          frameDocument.querySelectorAll('header nav a').forEach(link => {
            const url = new URL(link.href, frameDocument.baseURI);
            const isShop = /^(shop\.dc256\.org|dc256\.printify\.me)$/.test(url.hostname) || link.textContent.trim().toLowerCase() === 'shop';
            if ((url.origin === location.origin && url.pathname === homePath) || isShop) link.hidden = true;
          });
          const style = frameDocument.createElement('style');
          style.textContent = 'header nav a[hidden]{display:none!important}';
          frameDocument.head.append(style);
          frame.contentDocument.addEventListener('click', event => {
            const link = event.target.closest('a[href]');
            if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank') return;
            const url = new URL(link.href, frame.contentDocument.baseURI);
            const home = new URL('index.html', document.baseURI);
            const desktop = new URL('desktop.html', document.baseURI);
            const directory = new URL('./', document.baseURI);
            if (url.origin === location.origin && [home.pathname, desktop.pathname, directory.pathname].includes(url.pathname)) {
              event.preventDefault();
              minimize(id);
              open('welcome');
            }
          });
        } catch (_) { /* Cross-origin destinations retain their own navigation. */ }
      });
      body.append(frame);
    }
    const task=document.createElement('button');task.innerHTML=icon(app.icon)+`<span>${id==='welcome'?'Start here':id[0].toUpperCase()+id.slice(1)}</span>`;task.title=app.title;
    task.addEventListener('click',()=>{if(!element.hidden&&active===id)minimize(id);else focus(id);});tasks.append(task);
    windows.set(id,{element,task});layer.append(element);
    element.addEventListener('pointerdown',()=>focus(id));
    element.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>({minimize,maximize,close})[button.dataset.action](id)));
    const bar=element.querySelector('.os-titlebar');
    bar.addEventListener('dblclick',event=>{if(!event.target.closest('button'))maximize(id);});
    bar.addEventListener('pointerdown',event=>{
      if(event.target.closest('button')||mobile()||element.classList.contains('maximized'))return;
      event.preventDefault();bar.setPointerCapture(event.pointerId);
      const startX=event.clientX,startY=event.clientY,left=element.offsetLeft,top=element.offsetTop;
      document.body.classList.add('dragging');
      const move=e=>{element.style.left=Math.max(0,Math.min(innerWidth-120,left+e.clientX-startX))+'px';element.style.top=Math.max(0,Math.min(innerHeight-130,top+e.clientY-startY))+'px';};
      const end=()=>{document.body.classList.remove('dragging');bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',end);bar.removeEventListener('pointercancel',end);};
      bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);
    });
    focus(id);
    document.getElementById('announcement').textContent=app.title+' opened';
  };
  const launcher=document.getElementById('launcher'),start=document.getElementById('startButton');
  const hideLauncher=()=>{launcher.hidden=true;start.setAttribute('aria-expanded','false');};
  start.addEventListener('click',()=>{launcher.hidden=!launcher.hidden;start.setAttribute('aria-expanded',String(!launcher.hidden));});
  document.addEventListener('click',event=>{const button=event.target.closest('button[data-app]');if(button){open(button.dataset.app);hideLauncher();}else if(!launcher.contains(event.target)&&!start.contains(event.target))hideLauncher();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){hideLauncher();start.focus();}});
  document.getElementById('showDesktop').addEventListener('click',()=>{const any=[...windows.values()].some(s=>!s.element.hidden);if(any)windows.forEach((s,id)=>minimize(id));else windows.forEach((s,id)=>focus(id));});
  const clock=()=>{const now=new Date();document.getElementById('clock').textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});document.getElementById('clock').dateTime=now.toISOString();};clock();setInterval(clock,30000);
  window.addEventListener('resize',()=>{if(mobile())return;windows.forEach(({element})=>{element.style.left=Math.max(0,Math.min(element.offsetLeft,innerWidth-120))+'px';element.style.top=Math.max(0,Math.min(element.offsetTop,innerHeight-140))+'px';});});
  open('welcome');if(!mobile())open('terminal');
})();
