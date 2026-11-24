(() => {
  const popup = (id,title,mount,options={}) => window.openDesktopPopup({id,title,mount,...options});
  const documentPopup = (id,title,text,terminal=false) => popup(id,title,body=>{
    body.classList.add(terminal?'program-terminal':'document-viewer');
    const bar=document.createElement('div');bar.className='viewer-toolbar';bar.textContent=terminal?'DC256 Shell / simulation':'File     Edit     View                       UTF-8';
    const content=document.createElement('pre');content.textContent=text;body.append(bar,content);
  },{icon:terminal?'terminal':'folder',height:390});
  const messages={
    final:'#!/usr/bin/env python\n# FINAL. DO NOT TOUCH.\n# TODO: rewrite everything\nprint("It worked on my machine.")\n\nVersions v10 through v42 are still in Downloads.',
    blockchain:'PROPOSAL: Put the coffee machine on the blockchain.\n\nPeer review: what if we just used a button?\n\nStatus: decentralized into the trash.',
    firewall:'user@dc256:~$ ./just_disable_the_firewall.sh\n\n[SIMULATION] Checking script...\n# Step 1: disable firewall\n# Step 2: enjoy the silence\n# Step 3: realize the silence is the monitoring\n\nExecution blocked by common sense.\nExit code: absolutely not.\n\nuser@dc256:~$ _',
    readme:'Congratulations on finding this drive.\n\n1. Do not plug random USB drives into real computers.\n2. This one is fictional. You get a pass.\n3. The raccoon is the system administrator.'
  };
  const scan = () => popup('usb-scan','Raccoon Defender — Simulated virus scan',body=>{
    body.innerHTML='<div class="scan-app"><div class="scan-banner"><span>◈</span><div><strong>Raccoon Defender</strong><small>Interactive simulation · no device files accessed</small></div></div><h2>Scanning removable drive…</h2><div class="scan-progress" role="progressbar" aria-label="Simulated scan progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><div class="scan-metrics"><div><strong data-count>0</strong><span>Files inspected</span></div><div><strong data-threats>0</strong><span>Threats found</span></div><div><strong data-percent>0%</strong><span>Complete</span></div></div><pre class="scan-log" aria-label="Scan activity"></pre><p class="scan-result" role="status">Examining fictional USB contents.</p><button class="fun-button" data-scan-action>Cancel scan</button></div>';
    let timer,index=0,done=false;
    const lines=['Mounting virtual USB drive…','README_FIRST.txt — clean','raccoon.jpg — suspiciously adorable','definitely_not_malware.exe — analyzing…','Detected: Trojan.BadDecision.ParkingLot','Quarantining fictional executable…','Scan complete. No real files were accessed.'];
    const progress=body.querySelector('[role="progressbar"]'),log=body.querySelector('.scan-log'),action=body.querySelector('[data-scan-action]');
    const step=()=>{
      log.textContent+=(index?'\n':'')+lines[index++];log.scrollTop=log.scrollHeight;
      const value=Math.round(index/lines.length*100);progress.setAttribute('aria-valuenow',value);progress.firstElementChild.style.width=value+'%';
      body.querySelector('[data-count]').textContent=Math.min(index,4);body.querySelector('[data-percent]').textContent=value+'%';body.querySelector('[data-threats]').textContent=index>=5?'1':'0';
      if(index===lines.length){done=true;body.querySelector('h2').textContent='Scan complete: 1 bad decision contained.';body.querySelector('.scan-result').textContent='Payload: one teachable moment. Never plug unknown USB drives into real computers.';action.textContent='Run scan again';}
      else timer=setTimeout(step,650);
    };
    action.addEventListener('click',()=>{clearTimeout(timer);if(done){index=0;done=false;log.textContent='';body.querySelector('h2').textContent='Scanning removable drive…';body.querySelector('.scan-result').textContent='Examining fictional USB contents.';action.textContent='Cancel scan';step();}else{done=true;body.querySelector('h2').textContent='Scan cancelled';body.querySelector('.scan-result').textContent='Simulation stopped. Your device was never scanned.';action.textContent='Run scan again';}});
    step();return ()=>clearTimeout(timer);
  },{width:600,height:560,icon:'terminal'});
  const files={trash:[['final','final_final_v9.py','Python source','4.2 KB'],['blockchain','blockchain_everything.txt','Text document','256 B'],['firewall','just_disable_the_firewall.sh','Shell script','404 B']],usb:[['readme','README_FIRST.txt','Text document','1 KB'],['exe','definitely_not_malware.exe','Application','6.66 MB'],['raccoon','raccoon.jpg','JPEG image','1337 KB']]};
  const openFile=(key,name)=>{
    if(key==='exe')return scan();
    if(key==='raccoon')return popup('raccoon','raccoon.jpg — Image Viewer',body=>{body.className+=' image-viewer';const image=document.createElement('img');image.src='images/racoon.webp';image.alt='A dumpster-diving sysadmin raccoon';const caption=document.createElement('p');caption.textContent='Procyon rootus · Access level: trash / read / write';body.append(image,caption);},{width:460,height:560});
    documentPopup(key,name+' — '+(key==='firewall'?'Terminal':'Text Editor'),messages[key],key==='firewall');
  };
  window.initDesktopFun = body => {
    const app=body.querySelector('[data-fun]');if(!app)return;
    const type=app.dataset.fun;
    if(type==='trash'||type==='usb'){
      const list=files[type];let selected=null;
      app.className='explorer-app';
      app.innerHTML='<div class="explorer-menu">File <span>Edit</span> View <span>Help</span></div><div class="explorer-tools"><button class="fun-button" data-open disabled>Open selected</button>'+(type==='trash'?'<button class="fun-button" data-empty>Empty Trash</button>':'<span class="drive-badge">REMOVABLE DRIVE</span>')+'</div><div class="explorer-address"><span>Location</span><code>'+(type==='trash'?'trash:///deleted-ideas':'/media/FOUND_IN_PARKING_LOT')+'</code></div><div class="explorer-layout"><aside><strong>Places</strong><span>▣ Desktop</span><span>▤ Documents</span><span class="selected">'+(type==='trash'?'▧ Deleted Ideas':'▧ USB drive (E:)')+'</span></aside><div class="explorer-file-area"><table><thead><tr><th>Name</th><th>Type</th><th>Size</th></tr></thead><tbody></tbody></table></div></div><div class="explorer-status" role="status">3 items · Select a file, then Open. Double-click also works.</div>';
      const tbody=app.querySelector('tbody'),open=app.querySelector('[data-open]');
      list.forEach(file=>{const row=document.createElement('tr');const cell=document.createElement('td');const button=document.createElement('button');button.className='file-select';button.textContent=(file[0]==='exe'?'▣ ':'▤ ')+file[1];button.setAttribute('aria-label','Select '+file[1]);button.setAttribute('aria-pressed','false');cell.append(button);row.append(cell);file.slice(2).forEach(text=>{const td=document.createElement('td');td.textContent=text;row.append(td);});
        const select=()=>{selected=file;open.disabled=false;tbody.querySelectorAll('tr').forEach(r=>r.classList.remove('selected'));tbody.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));row.classList.add('selected');button.setAttribute('aria-pressed','true');app.querySelector('.explorer-status').textContent=file[1]+' · '+file[2]+' · '+file[3];};
        button.addEventListener('click',select);button.addEventListener('dblclick',()=>openFile(file[0],file[1]));button.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();select();openFile(file[0],file[1]);}});tbody.append(row);
      });
      open.addEventListener('click',()=>{if(selected)openFile(selected[0],selected[1]);});
      app.querySelector('[data-empty]')?.addEventListener('click',()=>documentPopup('trash-denied','Empty Trash — Permission denied','Permission denied: these might be useful someday.\n\n0 bytes reclaimed. 3 bad ideas preserved.',true));return;
    }
    if(type==='tasks'){
      const processes=[{id:'curiosity',name:'curiosityd',pid:256,cpu:64,memory:128,status:'Running'},{id:'imposter',name:'imposter_syndrome.exe',pid:404,cpu:12,memory:512,status:'Running'},{id:'project',name:'one_more_side_project',pid:1337,cpu:18,memory:256,status:'Running'},{id:'caffeine',name:'caffeine.service',pid:8080,cpu:6,memory:64,status:'Running'}];let selected=null;
      app.className='task-manager-app';app.innerHTML='<div class="explorer-menu">File <span>Options</span> View</div><div class="task-tabs"><strong>Processes</strong><span>Human Edition · simulated activity</span></div><div class="task-meters"><div><strong data-total-cpu>100%</strong><span>CPU</span><i><b style="width:100%"></b></i></div><div><strong data-total-memory>960 MB</strong><span>Memory</span><i><b style="width:75%"></b></i></div><div><strong>4</strong><span>Processes</span><i><b style="width:40%"></b></i></div></div><div class="task-table-wrap"><table><thead><tr><th>Process name</th><th>PID</th><th>Status</th><th>CPU</th><th>Memory</th></tr></thead><tbody></tbody></table></div><p class="task-message" role="status">Select a process to inspect or end.</p><div class="task-actions"><button class="fun-button" data-restart>Restart all</button><button class="fun-button" data-end disabled>End task</button></div>';
      const messages={curiosity:'curiosityd respawned immediately. You cannot stop an essential service.',imposter:'Process terminated. You belong here. No prior experience required.',project:'Process suspended. A new side project is already in your mental backlog.',caffeine:'Dependency error: caffeine.service is required by everything. Try water.target first.'};
      const render=()=>{const tbody=app.querySelector('tbody');tbody.replaceChildren();processes.forEach(p=>{const tr=document.createElement('tr');tr.classList.toggle('selected',p.id===selected);const td=document.createElement('td');const button=document.createElement('button');button.className='file-select';button.textContent=p.name;button.setAttribute('aria-pressed',String(p.id===selected));button.addEventListener('click',()=>{selected=p.id;render();});td.append(button);tr.append(td);[p.pid,p.status,p.cpu+'%',p.memory+' MB'].forEach(t=>{const cell=document.createElement('td');cell.textContent=t;tr.append(cell);});tbody.append(tr);});const cpu=processes.reduce((n,p)=>n+p.cpu,0),memory=processes.reduce((n,p)=>n+p.memory,0);app.querySelector('[data-total-cpu]').textContent=cpu+'%';app.querySelector('[data-total-cpu]').parentElement.querySelector('b').style.width=cpu+'%';app.querySelector('[data-total-memory]').textContent=memory+' MB';app.querySelector('[data-total-memory]').parentElement.querySelector('b').style.width=memory/1280*100+'%';app.querySelector('[data-end]').disabled=!selected||processes.find(p=>p.id===selected).status==='Stopped';};
      app.querySelector('[data-end]').addEventListener('click',()=>{const p=processes.find(p=>p.id===selected);if(!p)return;app.querySelector('.task-message').textContent=messages[p.id];if(['imposter','project'].includes(p.id)){p.status='Stopped';p.cpu=0;p.memory=0;}render();});
      app.querySelector('[data-restart]').addEventListener('click',()=>{processes.forEach((p,i)=>{p.status='Running';p.cpu=[64,12,18,6][i];p.memory=[128,512,256,64][i];});app.querySelector('.task-message').textContent='Processes restarted. Fresh start acquired.';render();});render();return;
    }
    const output=app.querySelector('.fun-output');
    const notes=app.querySelector('textarea');
    if(notes){
      const status=app.querySelector('.note-status'),key='dc256:sticky-note';
      try{notes.value=localStorage.getItem(key)??'Remember: the S in IoT stands for security.';status.textContent='Saved only in this browser.';}catch(_){notes.value='Remember: the S in IoT stands for security.';status.textContent='Storage unavailable. Notes will last while this window stays open.';}
      notes.addEventListener('input',()=>{try{localStorage.setItem(key,notes.value);status.textContent='Saved in this browser.';}catch(_){status.textContent='Could not save. Keep this window open to retain your notes.';}});
    }
    let clicks=0;const responses=['The raccoon noticed you.','The raccoon is checking your permissions.','You have been added to /etc/suspicious_humans.','The raccoon offers you a sticker. Trust established.','Achievement: honorary dumpster-diving sysadmin.'];
    app.querySelector('.mascot-button')?.addEventListener('click',()=>{output.textContent=responses[Math.min(clicks++,responses.length-1)];});
  };
})();
