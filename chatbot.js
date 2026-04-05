/* ─── NEXT LEVEL BARBER SHOP — CHATBOT WIDGET ─── */
(function () {

  // ── Inject styles ──
  const style = document.createElement('style');
  style.textContent = `
  /* Button */
  #chatBtn {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 3000;
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--primary); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 24px rgba(37,150,190,.55);
    transition: transform .25s, box-shadow .25s;
  }
  #chatBtn:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(37,150,190,.7); }
  #chatBtn svg { width: 26px; height: 26px; fill: #fff; transition: opacity .2s; }
  #chatBtn .cb-close { display: none; }
  #chatBtn.open .cb-open { display: none; }
  #chatBtn.open .cb-close { display: block; }

  /* Notification dot */
  #chatDot {
    position: fixed; bottom: calc(1.5rem + 38px); right: 1.5rem; z-index: 3001;
    width: 10px; height: 10px; background: #4ade80; border-radius: 50%;
    border: 2px solid var(--black);
    animation: dotPulse 1.8s ease-in-out infinite;
  }

  /* Panel */
  #chatPanel {
    position: fixed; bottom: calc(1.5rem + 70px); right: 1.5rem; z-index: 2999;
    width: 340px; max-height: 480px;
    background: #141414; border: 1px solid rgba(37,150,190,.25);
    border-radius: 16px; display: flex; flex-direction: column;
    box-shadow: 0 12px 60px rgba(0,0,0,.6);
    transform: translateY(20px) scale(.97); opacity: 0; pointer-events: none;
    transition: all .28s cubic-bezier(.22,1,.36,1);
    font-family: var(--font-body);
  }
  #chatPanel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

  /* Header */
  .cp-header {
    background: linear-gradient(135deg, var(--primary-dark), var(--primary));
    border-radius: 16px 16px 0 0; padding: .85rem 1.1rem;
    display: flex; align-items: center; gap: .7rem; flex-shrink: 0;
  }
  .cp-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cp-avatar svg { width: 20px; height: 20px; fill: #fff; }
  .cp-info { flex: 1; min-width: 0; }
  .cp-name { color: #fff; font-weight: 700; font-size: .88rem; }
  .cp-status { color: rgba(255,255,255,.75); font-size: .7rem; display: flex; align-items: center; gap: 4px; }
  .cp-status::before { content: ''; display: block; width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }

  /* Messages */
  .cp-messages {
    flex: 1; overflow-y: auto; padding: .9rem; display: flex; flex-direction: column; gap: .65rem;
    scroll-behavior: smooth;
  }
  .cp-messages::-webkit-scrollbar { width: 4px; }
  .cp-messages::-webkit-scrollbar-track { background: transparent; }
  .cp-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }

  .cm-bot, .cm-user {
    max-width: 84%; padding: .6rem .9rem; border-radius: 12px;
    font-size: .82rem; line-height: 1.5; animation: msgIn .2s ease;
  }
  @keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .cm-bot { background: #1e1e1e; color: var(--light-gray); border-bottom-left-radius: 4px; align-self: flex-start; border: 1px solid rgba(255,255,255,.06); }
  .cm-user { background: var(--primary); color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
  .cm-bot a { color: var(--primary); text-decoration: none; font-weight: 600; }
  .cm-bot a:hover { text-decoration: underline; }

  /* Language picker buttons */
  .cm-lang-pick { display: flex; gap: .6rem; align-self: flex-start; animation: msgIn .2s ease; }
  .cm-lang-btn {
    display: flex; align-items: center; gap: .45rem;
    background: #1e1e1e; border: 1.5px solid rgba(37,150,190,.35);
    color: var(--light-gray); font-family: var(--font-body); font-size: .82rem;
    font-weight: 600; padding: .55rem 1.1rem; border-radius: 10px; cursor: pointer;
    transition: all .2s; letter-spacing: .3px;
  }
  .cm-lang-btn:hover { border-color: var(--primary); color: var(--white); background: rgba(37,150,190,.12); transform: translateY(-1px); }
  .cm-lang-btn .cm-flag { font-size: 1.1rem; line-height: 1; }

  /* Typing indicator */
  .cm-typing { display: flex; gap: 4px; align-items: center; padding: .6rem .9rem; background: #1e1e1e; border-radius: 12px; border-bottom-left-radius: 4px; align-self: flex-start; border: 1px solid rgba(255,255,255,.06); }
  .cm-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--gray); animation: typingBounce 1.2s infinite; }
  .cm-typing span:nth-child(2) { animation-delay: .2s; }
  .cm-typing span:nth-child(3) { animation-delay: .4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

  /* Quick replies */
  .cp-quick { padding: .5rem .9rem; display: flex; flex-wrap: wrap; gap: .4rem; flex-shrink: 0; border-top: 1px solid rgba(255,255,255,.05); }
  .cq-btn {
    background: rgba(37,150,190,.12); border: 1px solid rgba(37,150,190,.3);
    color: var(--primary); font-family: var(--font-body); font-size: .72rem;
    font-weight: 600; padding: .3rem .75rem; border-radius: 20px; cursor: pointer;
    transition: all .2s; white-space: nowrap;
  }
  .cq-btn:hover { background: rgba(37,150,190,.25); border-color: var(--primary); }

  /* Input */
  .cp-input {
    display: flex; gap: .5rem; padding: .75rem .9rem;
    border-top: 1px solid rgba(255,255,255,.06); flex-shrink: 0;
  }
  .cp-input input {
    flex: 1; background: #1e1e1e; border: 1px solid rgba(255,255,255,.1);
    border-radius: 8px; color: var(--white); font-family: var(--font-body); font-size: .82rem;
    padding: .5rem .8rem; outline: none; transition: border-color .2s;
  }
  .cp-input input:focus { border-color: rgba(37,150,190,.5); }
  .cp-input input::placeholder { color: var(--gray); }
  .cp-send {
    width: 34px; height: 34px; border-radius: 8px; background: var(--primary);
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background .2s;
  }
  .cp-send:hover { background: var(--primary-dark); }
  .cp-send svg { width: 16px; height: 16px; fill: #fff; }

  @media (max-width: 400px) {
    #chatPanel { width: calc(100vw - 2rem); right: 1rem; }
    #chatBtn { right: 1rem; }
    #chatDot { right: 1rem; }
  }
  `;
  document.head.appendChild(style);

  // ── Inject HTML markup ──
  document.body.insertAdjacentHTML('beforeend', `
    <div id="chatDot"></div>
    <button id="chatBtn" aria-label="Chat">
      <svg class="cb-open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      <svg class="cb-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
    <div id="chatPanel">
      <div class="cp-header">
        <div class="cp-avatar">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <div class="cp-info">
          <div class="cp-name">Next Level Barber Shop</div>
          <div class="cp-status" id="cpStatus">Online now</div>
        </div>
      </div>
      <div class="cp-messages" id="cpMsgs"></div>
      <div class="cp-quick" id="cpQuick"></div>
      <div class="cp-input">
        <input type="text" id="cpInput" placeholder="Ask something…" autocomplete="off">
        <button class="cp-send" id="cpSendBtn" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  // ─────────────────────────────────────────────────────────
  //  CONFIG — pega aquí tu Google Apps Script URL para leads
  // ─────────────────────────────────────────────────────────
  const LEAD_WEBHOOK = ''; // ej: 'https://script.google.com/macros/s/XXXXX/exec'
  // ─────────────────────────────────────────────────────────

  const btn     = document.getElementById('chatBtn');
  const dot     = document.getElementById('chatDot');
  const panel   = document.getElementById('chatPanel');
  const msgs    = document.getElementById('cpMsgs');
  const input   = document.getElementById('cpInput');
  const sendBtn = document.getElementById('cpSendBtn');
  const quick   = document.getElementById('cpQuick');
  const cpStatus= document.getElementById('cpStatus');
  let opened = false;

  // ── Conversation state machine ──
  let state    = 'langPick';
  let userName = '';
  let chatLang = null;  // 'es' | 'en'
  let lastTopic = null; // context memory: last topic discussed

  // ── Business data ──
  const biz = {
    phone: '+12393477992',
    phoneDisp: '(239) 347-7992',
    address: '140 Santa Barbara Blvd S, Suite 118, Cape Coral, FL 33991',
    instagram: '@next_level_barber_shop_',
    mapsUrl: 'https://www.google.com/maps/place/Next+Level+Barber+Shop/@26.6484882,-81.9779236,17z/data=!3m1!4b1!4m6!3m5!1s0x88db47fc4572d10d:0xff912e4554887962!8m2!3d26.6484834!4d-81.9753487!16s%2Fg%2F11kqlnl8ps?entry=ttu',
    appleMapsUrl: 'https://maps.apple.com/place?place-id=IF48C5E467DDCBE0D&address=140+Santa+Barbara+Blvd%2C+Unit+118%2C+Cape+Coral%2C+FL++33991%2C+United+States&coordinate=26.648581%2C-81.975678&name=Next+Level+Barber+Shop&_provider=9902',
    reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJDdFyRfxH24gRYnmIVFQuif8',
    website: 'https://nextlevelbarbershopswfl.com'
  };

  // ── Lead capture ──
  function saveLead(name, phone){
    const lead = { name, phone, lang: lang(), time: new Date().toLocaleString('en-US',{timeZone:'America/New_York'}) };
    try {
      const saved = JSON.parse(localStorage.getItem('nlbs_leads')||'[]');
      saved.push(lead);
      localStorage.setItem('nlbs_leads', JSON.stringify(saved));
    } catch(e){}
    if(LEAD_WEBHOOK){
      fetch(LEAD_WEBHOOK, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(lead)
      }).catch(()=>{});
    }
  }

  // ── Restore session from localStorage ──
  try {
    const saved = localStorage.getItem('nlbs_session');
    if(saved){
      const s = JSON.parse(saved);
      if(s.name)     userName = s.name;
      if(s.lang)     chatLang = s.lang;
    }
  } catch(e){}

  function saveSession(){
    try { localStorage.setItem('nlbs_session', JSON.stringify({ name: userName, lang: chatLang })); } catch(e){}
  }

  // ── Hours per day (0=Sun … 6=Sat) ──
  function daySchedule(d){
    if(d===0) return { openMin:10*60,   closeMin:14*60, label_en:'10:00 AM – 2:00 PM', label_es:'10:00 AM – 2:00 PM' };
    if(d===6) return { openMin:9*60,    closeMin:18*60, label_en:'9:00 AM – 6:00 PM',  label_es:'9:00 AM – 6:00 PM'  };
              return { openMin:9*60+30, closeMin:19*60, label_en:'9:30 AM – 7:00 PM',  label_es:'9:30 AM – 7:00 PM'  };
  }

  const DAY_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  function getCCNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'America/New_York'})); }

  function detectDay(t){
    const now = getCCNow();
    if(/ma[nñ]ana|tomorrow/i.test(t)){ const d=new Date(now); d.setDate(d.getDate()+1); return d; }
    if(/hoy|today/i.test(t)) return now;
    const dayNamesEN = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    for(let i=0;i<7;i++){
      if(t.includes(dayNamesEN[i])){ const d=new Date(now); const diff=(i-now.getDay()+7)%7||7; d.setDate(d.getDate()+diff); return d; }
    }
    const dayNamesES = ['domingo','lunes','martes','mi[eé]rcoles','jueves','viernes','s[aá]bado'];
    for(let i=0;i<7;i++){
      if(new RegExp(dayNamesES[i],'i').test(t)){ const d=new Date(now); const diff=(i-now.getDay()+7)%7||7; d.setDate(d.getDate()+diff); return d; }
    }
    return null;
  }

  function timeUntilOpen(esOverride){
    const now=getCCNow(), sch=daySchedule(now.getDay()), curMin=now.getHours()*60+now.getMinutes();
    const es = esOverride !== undefined ? esOverride : lang()==='es';
    if(curMin >= sch.openMin && curMin < sch.closeMin){
      const left=sch.closeMin-curMin, h=Math.floor(left/60), m=left%60;
      return es
        ? `✅ <b>¡Estamos abiertos ahora!</b> Cerramos en ${h>0?h+'h ':''} ${m>0?m+'min':''}.`
        : `✅ <b>We're open right now!</b> We close in ${h>0?h+'h ':''} ${m>0?m+'min':''}.`;
    }
    let minsUntil=0, targetDay=now.getDay();
    if(curMin < sch.openMin){ minsUntil=sch.openMin-curMin; }
    else { const nextDay=(now.getDay()+1)%7; const nextSch=daySchedule(nextDay); minsUntil=(24*60-curMin)+nextSch.openMin; targetDay=nextDay; }
    const hh=Math.floor(minsUntil/60), mm=minsUntil%60;
    const nextSch2=daySchedule(targetDay);
    return es
      ? `⏰ Ahora estamos cerrados. Abrimos el <b>${targetDay===now.getDay()?'hoy':DAY_ES[targetDay]}</b> a las <b>${nextSch2.label_es.split('–')[0].trim()}</b> (en ${hh>0?hh+'h ':''} ${mm>0?mm+'min':''}).`
      : `⏰ We're closed right now. We open on <b>${targetDay===now.getDay()?'today':DAY_EN[targetDay]}</b> at <b>${nextSch2.label_en.split('–')[0].trim()}</b> (in ${hh>0?hh+'h ':''} ${mm>0?mm+'min':''}).`;
  }

  function lang(){ return (typeof currentLang !== 'undefined' ? currentLang : 'en'); }

  // ── Language detection — improved for spanglish ──
  function detectMsgLang(text){
    if(chatLang) return chatLang;
    const esSignals = (text.match(/[áéíóúüñ¿¡]/ig)||[]).length * 2
      + (text.match(/\b(hola|buenos|buenas|gracias|sí|que|como|cuando|donde|cuanto|cuánto|precio|hora|horario|cita|reservar|llamar|abren|cierra|mañana|manana|hoy|quiero|tienes|tienen|puedo|tengo|estoy|abierto|cerrado|falta|corte|barba|servicio|ubicacion|dirección|numero|estacionamiento|niño|niños|tarjeta|efectivo|pago|cuanto|hablan|español|quanto|fades|bajan|cuándo|qué)\b/ig)||[]).length;
    const enSignals = (text.match(/\b(the|is|are|do|does|what|when|where|how|much|open|closed|can|you|have|need|want|book|call|price|cost|kids|children|parking|card|cash|speak|english|time|today|tomorrow|hours|appointment)\b/ig)||[]).length;
    if(esSignals > enSignals) return 'es';
    if(enSignals > esSignals) return 'en';
    return lang();
  }

  function refreshStatus(){
    const open = document.getElementById('statusBadge') && document.getElementById('statusBadge').classList.contains('open');
    cpStatus.textContent = open
      ? (lang()==='es' ? 'En línea · Abierto ahora' : 'Online · Open now')
      : (lang()==='es' ? 'En línea · Cerrado' : 'Online · Closed now');
  }
  refreshStatus();

  // ── Dynamic chips based on context ──
  const chipsDefault = {
    en: ['💈 Prices','⏰ Hours','📍 Location','📞 Call','✂️ Services'],
    es: ['💈 Precios','⏰ Horarios','📍 Ubicación','📞 Llamar','✂️ Servicios']
  };
  const chipsAfterPrice = {
    en: ['📅 Book now','📞 Call us','⏰ Hours','📍 Location'],
    es: ['📅 Reservar','📞 Llamar','⏰ Horarios','📍 Ubicación']
  };
  const chipsAfterHours = {
    en: ['📅 Book now','💈 Prices','📞 Call us','📍 Location'],
    es: ['📅 Reservar','💈 Precios','📞 Llamar','📍 Ubicación']
  };
  const chipsGoodbye = {
    en: ['📞 Call us','⭐ Leave a review','📍 Location'],
    es: ['📞 Llamar','⭐ Dejar reseña','📍 Ubicación']
  };

  function renderChips(set){
    quick.innerHTML = '';
    const l = chatLang || lang();
    const c = (set || chipsDefault)[l] || (set || chipsDefault)['en'];
    c.forEach(label => {
      const b = document.createElement('button');
      b.className = 'cq-btn'; b.textContent = label;
      b.onclick = () => sendMsg(label);
      quick.appendChild(b);
    });
  }

  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = who === 'bot' ? 'cm-bot' : 'cm-user';
    div.innerHTML = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  // ── Typing delay scaled to message length ──
  function showTyping(cb, text){
    const t = document.createElement('div');
    t.className = 'cm-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    const delay = Math.min(400 + (text||'').length * 12, 1400);
    setTimeout(()=>{ t.remove(); cb(); }, delay);
  }

  function showLangPicker(){
    const wrap = document.createElement('div');
    wrap.className = 'cm-lang-pick';
    [['🇪🇸','Español','es'],['🇺🇸','English','en']].forEach(([flag, label, code]) => {
      const b = document.createElement('button');
      b.className = 'cm-lang-btn';
      b.innerHTML = `<span class="cm-flag">${flag}</span>${label}`;
      b.onclick = () => {
        chatLang = code;
        saveSession();
        wrap.querySelectorAll('.cm-lang-btn').forEach(btn => {
          btn.disabled = true;
          btn.style.opacity = btn === b ? '1' : '0.35';
          btn.style.cursor = 'default';
          btn.style.transform = 'none';
        });
        addMsg(`${flag} ${label}`, 'user');
        const now=getCCNow(), sch=daySchedule(now.getDay()), curMin=now.getHours()*60+now.getMinutes();
        const isOpen = curMin >= sch.openMin && curMin < sch.closeMin;
        let statusLine = '';
        if(isOpen){
          const left=sch.closeMin-curMin, h=Math.floor(left/60), m=left%60;
          statusLine = code==='es'
            ? `✅ Estamos <b>abiertos ahora</b> — cerramos en ${h>0?h+'h ':''} ${m}min.`
            : `✅ We're <b>open right now</b> — closing in ${h>0?h+'h ':''} ${m}min.`;
        } else {
          const nextDay=(now.getDay()+1)%7, nextSch=daySchedule(nextDay);
          statusLine = code==='es'
            ? `🕐 Ahora estamos <b>cerrados</b> — abrimos mañana a las <b>${nextSch.label_es.split('–')[0].trim()}</b>.`
            : `🕐 We're <b>closed</b> right now — opening tomorrow at <b>${nextSch.label_en.split('–')[0].trim()}</b>.`;
        }
        const greeting = code==='es'
          ? `${statusLine}<br><br>¡Hola! ¿En qué te puedo ayudar hoy? 💈`
          : `${statusLine}<br><br>Hey! How can I help you today? 💈`;
        showTyping(() => { addMsg(greeting, 'bot'); state = 'idle'; renderChips(); }, greeting);
      };
      wrap.appendChild(b);
    });
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hi(){ return userName ? `, ${userName}` : ''; }

  // ── Response variation pools ──
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  const THANKS_EN = [
    `Anytime${hi()}! Anything else I can help with? 💈`,
    `Happy to help${hi()}! Let me know if you need anything else.`,
    `Of course${hi()}! I'm here if you have more questions. 😊`
  ];
  const THANKS_ES = [
    `¡Con gusto${hi()}! ¿Hay algo más en lo que te pueda ayudar? 💈`,
    `¡Para eso estoy${hi()}! Cualquier otra duda, aquí estoy.`,
    `¡Claro que sí${hi()}! Dime si necesitas algo más. 😊`
  ];
  const GREET_EN = [
    `Hey${hi()}! I'm the Next Level assistant. How can I help you today?`,
    `Hi${hi()}! What can I help you with?`,
    `Hello${hi()}! Need info about cuts, prices, or hours? Just ask! 💈`
  ];
  const GREET_ES = [
    `¡Hola${hi()}! Soy el asistente de Next Level. ¿En qué te ayudo hoy?`,
    `¡Qué tal${hi()}! ¿Precios, horarios, ubicación? Pregúntame lo que quieras.`,
    `¡Buenas${hi()}! ¿En qué te puedo ayudar? 💈`
  ];

  // ── Bot reply ──
  function botReply(text){
    const t = text.toLowerCase().trim();
    const es = detectMsgLang(t) === 'es';

    // ── STATE: lang pick ──
    if(state === 'langPick'){
      return es ? 'Por favor selecciona tu idioma con los botones de arriba. 👆' : 'Please select your language using the buttons above. 👆';
    }

    // ── Goodbye / closing ──
    if(/bye|adios|adiós|chao|chau|hasta luego|see ya|see you|gracias y|thanks bye|that'?s all|eso es todo|ya gracias|ok gracias|all good|ya fue/i.test(t)){
      renderChips(chipsGoodbye);
      return es
        ? `¡Hasta luego${hi()}! 👋 Que tengas un excelente día. Cualquier cosa, aquí estamos.`
        : `Take care${hi()}! 👋 Have a great day. Don't hesitate to reach out anytime.`;
    }

    // ── "How long until open" ──
    if(/cu[aá]nto falta|how long|when do you open|cu[aá]ndo abren|a qu[eé] hora abren|what time.*open|open.*today|abierto.*hoy/i.test(t)){
      return timeUntilOpen(es);
    }

    // ── Hours ──
    if(/hour|hora|horario|open|abierto|cierra|close|schedule|cuando|when|ma[nñ]ana|tomorrow|hoy|today|sunday|domingo|saturday|s[aá]bado|lunes|monday|martes|tuesday|mi[eé]rcoles|wednesday|jueves|thursday|viernes|friday/i.test(t)){
      lastTopic = 'hours';
      const dayDate = detectDay(t);
      if(dayDate){
        const d=dayDate.getDay(), sch=daySchedule(d);
        const dayNameES=DAY_ES[d], dayNameEN=DAY_EN[d];
        const isTomorrow=/ma[nñ]ana|tomorrow/i.test(t), isToday=/hoy|today/i.test(t);
        const dayLabelEN=isTomorrow?'Tomorrow':isToday?'Today':dayNameEN;
        const dayLabelES=isTomorrow?'Mañana':isToday?'Hoy':dayNameES;
        if(sch.openMin===null){
          renderChips(chipsAfterHours);
          return es ? `${dayLabelES} (${dayNameES}) estamos <b>cerrados</b>. 😔` : `${dayLabelEN} (${dayNameEN}) we're <b>closed</b>. 😔`;
        }
        renderChips(chipsAfterHours);
        const showDayES = dayLabelES === dayNameES ? dayNameES : `${dayLabelES} (${dayNameES})`;
        const showDayEN = dayLabelEN === dayNameEN ? dayNameEN : `${dayLabelEN} (${dayNameEN})`;
        return es
          ? `📅 <b>${showDayES}</b> abrimos de <b>${sch.label_es}</b>.`
          : `📅 <b>${showDayEN}</b> we're open <b>${sch.label_en}</b>.`;
      }
      renderChips(chipsAfterHours);
      return es
        ? `⏰ <b>Horario:</b><br>Lun–Vie <b>9:30 AM–7:00 PM</b><br>Sábado <b>9:00 AM–6:00 PM</b><br>Domingo <b>10:00 AM–2:00 PM</b>`
        : `⏰ <b>Hours:</b><br>Mon–Fri <b>9:30 AM–7:00 PM</b><br>Saturday <b>9:00 AM–6:00 PM</b><br>Sunday <b>10:00 AM–2:00 PM</b>`;
    }

    // ── Prices / services ──
    if(/price|precio|cost|costo|cuesta|cu[aá]nto|how much|service|servicio/i.test(t)){
      lastTopic = 'prices';
      renderChips(chipsAfterPrice);

      // Combo service questions (haircut + beard)
      if(/(haircut|corte|fade).*(beard|barba)|(beard|barba).*(haircut|corte|fade)|corte y barba|haircut and beard|fade and beard|fade y barba/i.test(t)){
        return es
          ? `✂️🧔 <b>Corte + barba:</b><br>✂️ Corte desde <b>$28</b> (fade desde $30)<br>🧔 Barba desde <b>$15</b><br>Total estimado: <b>desde $43</b>`
          : `✂️🧔 <b>Haircut + beard:</b><br>✂️ Haircut from <b>$28</b> (fade from $30)<br>🧔 Beard trim from <b>$15</b><br>Estimated total: <b>from $43</b>`;
      }

      // Specific service questions
      if(/fade/i.test(t)){
        return es
          ? `💈 Los fades empiezan desde <b>$30</b>. Hacemos low, mid y high fade. ✂️`
          : `💈 Fades start at <b>$30</b>. We do low, mid, and high fades. ✂️`;
      }
      if(/haircut|corte/i.test(t)){
        return es
          ? `✂️ Cortes de cabello desde <b>$28</b>.`
          : `✂️ Haircuts start at <b>$28</b>.`;
      }
      if(/beard|barba/i.test(t)){
        return es
          ? `🧔 Arreglo de barba desde <b>$15</b>.`
          : `🧔 Beard trim from <b>$15</b>.`;
      }
      return es
        ? `💈 <b>Precios:</b><br>✂️ Corte de cabello — <b>desde $28</b><br>💈 Fade — <b>desde $30</b><br>🧔 Arreglo de barba — <b>desde $15</b>`
        : `💈 <b>Prices:</b><br>✂️ Haircut — <b>from $28</b><br>💈 Fade — <b>from $30</b><br>🧔 Beard trim — <b>from $15</b>`;
    }

    // ── Context follow-up for prices (e.g. "and the beard?" after prices shown) ──
    if(lastTopic === 'prices' && /beard|barba|fade|haircut|corte|y el|and the|what about/i.test(t)){
      if(/beard|barba/i.test(t)) return es ? `🧔 Arreglo de barba desde <b>$15</b>.` : `🧔 Beard trim from <b>$15</b>.`;
      if(/fade/i.test(t)) return es ? `💈 Fades desde <b>$30</b>.` : `💈 Fades from <b>$30</b>.`;
      if(/haircut|corte/i.test(t)) return es ? `✂️ Cortes desde <b>$28</b>.` : `✂️ Haircuts from <b>$28</b>.`;
    }

    // ── Services detail ──
    if(/servic|what do you|qu[eé] hacen|qu[eé] ofrecen|what.*offer|tipos de corte|types of/i.test(t)){
      lastTopic = 'services';
      renderChips(chipsAfterPrice);
      return es
        ? `✂️ <b>Servicios:</b><br>💈 Fades (low, mid, high)<br>✂️ Cortes de caballero<br>🧔 Arreglo de barba<br>👦 Cortes para niños<br><br>Walk-ins bienvenidos todos los días.`
        : `✂️ <b>Services:</b><br>💈 Fades (low, mid, high)<br>✂️ Men's haircuts<br>🧔 Beard trims<br>👦 Kids' haircuts<br><br>Walk-ins welcome every day.`;
    }

    // ── Kids haircuts ──
    if(/kid|ni[ñn]o|child|boy|girl|son|hijo|nene|baby/i.test(t)){
      return es
        ? `👦 ¡Sí, cortamos cabello a niños! Los precios son similares a los de adultos. Solo pasen, walk-ins bienvenidos.`
        : `👦 Yes, we do kids' haircuts! Pricing is similar to adult cuts. Walk-ins are welcome, just come on in.`;
    }

    // ── Payment methods ──
    if(/card|tarjeta|cash|efectivo|pay|pago|accept|credit|debit|venmo|zelle|apple pay/i.test(t)){
      return es
        ? `💳 Aceptamos efectivo y tarjetas de crédito/débito. Para más detalles llámanos: <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `💳 We accept cash and credit/debit cards. For more details give us a call: <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── Parking ──
    if(/park|estaciona|parking|lot/i.test(t)){
      return es
        ? `🅿️ ¡Sí! Hay estacionamiento gratuito frente al local en Santa Barbara Blvd.`
        : `🅿️ Yes! Free parking available right in front of us on Santa Barbara Blvd.`;
    }

    // ── Wait time / how long does it take ──
    if(/how long.*take|cu[aá]nto.*tarda|wait|espera|tiempo|time.*cut|duration/i.test(t)){
      return es
        ? `⏱️ Un corte típico dura entre <b>20 y 40 minutos</b>, dependiendo del servicio. Sin cita, el tiempo de espera varía.`
        : `⏱️ A typical cut takes about <b>20 to 40 minutes</b> depending on the service. Walk-in wait times may vary.`;
    }

    // ── Spanish spoken ──
    if(/speak|hablan|spanish|español|english|inglés|ingles/i.test(t)){
      return es
        ? `✅ ¡Sí, hablamos español! No te preocupes, te atendemos con gusto en tu idioma. 😊`
        : `✅ Yes, we speak Spanish! Our team is fully bilingual — English and Spanish. 😊`;
    }

    // ── Location ──
    if(/location|address|direcci[oó]n|donde|where|map|mapa|ubica|directions|how to get/i.test(t)){
      lastTopic = 'location';
      return es
        ? `📍 <b>${biz.address}</b><br><br><a href="${biz.mapsUrl}" target="_blank" rel="noopener">🗺 Ver en Google Maps →</a><br><a href="${biz.appleMapsUrl}" target="_blank" rel="noopener">🍎 Ver en Apple Maps →</a>`
        : `📍 <b>${biz.address}</b><br><br><a href="${biz.mapsUrl}" target="_blank" rel="noopener">🗺 Open in Google Maps →</a><br><a href="${biz.appleMapsUrl}" target="_blank" rel="noopener">🍎 Open in Apple Maps →</a>`;
    }

    // ── Call / Phone ──
    if(/call|llam|phone|tel[eé]fono|number|n[uú]mero|contact|contacto/i.test(t)){
      return es
        ? `📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a> — ¡Llámanos y te atendemos!`
        : `📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a> — Give us a call!`;
    }

    // ── Book / Appointment ──
    if(/book|reserv|cita|appointment|appoint|agend|schedul/i.test(t)){
      return es
        ? `📅 Para agendar una cita llámanos o mándanos un mensaje al:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a><br><br>¡También aceptamos walk-ins todos los días!`
        : `📅 To book an appointment give us a call or text:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a><br><br>Walk-ins are always welcome too!`;
    }

    // ── Review ──
    if(/review|reseña|resena|google|rating|opinion|feedback|star|estrella/i.test(t)){
      return es
        ? `⭐ ¡Nos encantaría tu opinión!<br><a href="${biz.reviewUrl}" target="_blank" rel="noopener"><b>Dejar reseña en Google →</b></a>`
        : `⭐ We'd love your feedback!<br><a href="${biz.reviewUrl}" target="_blank" rel="noopener"><b>Leave us a Google review →</b></a>`;
    }

    // ── Instagram ──
    if(/instagram|insta|social|ig/i.test(t)){
      return es
        ? `📸 Síguenos en Instagram:<br><a href="https://www.instagram.com/next_level_barber_shop_/" target="_blank" rel="noopener"><b>${biz.instagram}</b></a>`
        : `📸 Follow us on Instagram:<br><a href="https://www.instagram.com/next_level_barber_shop_/" target="_blank" rel="noopener"><b>${biz.instagram}</b></a>`;
    }

    // ── Walk-in ──
    if(/walk.?in|walkin|sin cita|appointment needed|need appointment/i.test(t)){
      return es
        ? `✅ ¡No necesitas cita${hi()}! Walk-ins son bienvenidos todos los días. Solo pasa.`
        : `✅ No appointment needed${hi()}! Walk-ins are welcome every day. Just come on in!`;
    }

    // ── Problem / complaint ──
    if(/problem|problema|complaint|queja|issue|mal|unhappy|bad|wrong|reclamo/i.test(t)){
      return es
        ? `😔 Lo sentimos mucho${hi()}. Por favor llámanos directamente para que podamos resolverlo:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `😔 We're sorry to hear that${hi()}. Please call us directly so we can make it right:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── Tips / gratuity ──
    if(/tip|propina|gratu|tipping/i.test(t)){
      return es
        ? `💵 Las propinas no son obligatorias pero siempre son apreciadas. Aceptamos propinas en efectivo y tarjeta.`
        : `💵 Tips are not required but always appreciated. We accept tips in cash and by card.`;
    }

    // ── Specific barber request ──
    if(/specific barber|barber[oa] espec[ií]fic|who.*cut|qui[eé]n corta|best barber|mejor barber|request.*barber|pedir.*barber|available barber|barber.*disponible/i.test(t)){
      return es
        ? `💈 Todos nuestros barberos son profesionales. Si quieres un barbero específico, llámanos para verificar su disponibilidad:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `💈 All our barbers are skilled pros. If you'd like a specific barber, call us to check availability:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── Group visits ──
    if(/group|grupo|party|fiesta|varios|multiple|wedding|boda|bachelor|groomsmen|equipo|team/i.test(t)){
      return es
        ? `👥 ¡Claro que atendemos grupos! Para coordinar, llámanos con anticipación:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `👥 We welcome groups! To coordinate, give us a heads-up call:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── Senior / Military / Student discounts ──
    if(/discount|descuento|senior|militar|military|student|estudiante|promo|promoci[oó]n|deal|oferta|cupón|coupon|especial|special/i.test(t)){
      return es
        ? `🏷️ Para información sobre descuentos o promociones, llámanos directamente:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `🏷️ For discount or promo info, give us a call:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── Hair type / style advice ──
    if(/hair type|tipo de pelo|cabello|curly|rizado|lacio|straight|thick|grueso|thin|fino|recomed|suggest|suger|qué corte|which cut|what style|qué estilo|best.*for me/i.test(t)){
      return es
        ? `✂️ Nuestros barberos te asesoran en persona según tu tipo de cabello y rostro. ¡Solo pasa o reserva!`
        : `✂️ Our barbers give personalized advice based on your hair type and face shape. Walk in or book a visit!`;
    }

    // ── Products ──
    if(/product|producto|pomade|pomada|gel|wax|cera|shampoo|champ[uú]|aftershave|oil|aceite|sell|venden/i.test(t)){
      return es
        ? `🧴 Para información sobre productos disponibles, pregunta cuando nos visites o llámanos:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `🧴 For product info, ask when you visit or give us a call:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── Wheelchair / accessibility ──
    if(/wheelchair|silla de ruedas|accesib|disab|discapac|ramp|rampa|accessible/i.test(t)){
      return es
        ? `♿ Nuestro local es accesible. Si tienes alguna necesidad especial, llámanos y te ayudamos:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`
        : `♿ Our shop is accessible. If you have any special needs, call us and we'll assist:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a>`;
    }

    // ── WiFi ──
    if(/wifi|wi-fi|internet|conectar/i.test(t)){
      return es
        ? `📶 Para info sobre WiFi, pregunta al llegar. ¡Te esperamos!`
        : `📶 Ask about WiFi when you arrive. See you there!`;
    }

    // ── Website ──
    if(/website|p[aá]gina|sitio web|web|online/i.test(t)){
      return es
        ? `🌐 Visita nuestra página: <a href="${biz.website}" target="_blank" rel="noopener"><b>nextlevelbarbershopswfl.com</b></a>`
        : `🌐 Check out our website: <a href="${biz.website}" target="_blank" rel="noopener"><b>nextlevelbarbershopswfl.com</b></a>`;
    }

    // ── "Are you open right now?" — direct open/closed check ──
    if(/^(are you|est[aá]n|est[aá]s).*(open|abiert)/i.test(t) || /^(open|abiert)\??$/i.test(t)){
      return timeUntilOpen(es);
    }

    // ── Affirmative after context (yes/sí/dale) ──
    if(/^(s[ií]|yes|yeah|sure|dale|ok[aá]y?|claro|va|vamos|let'?s go|yep|yea|of course|por supuesto)\s*[.!]?$/i.test(t)){
      if(lastTopic === 'prices'){
        return es
          ? `📅 ¿Quieres reservar? Llámanos:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a><br>¡O solo pasa, walk-ins bienvenidos!`
          : `📅 Want to book? Call us:<br>📞 <a href="tel:${biz.phone}"><b>${biz.phoneDisp}</b></a><br>Or just walk in — always welcome!`;
      }
      if(lastTopic === 'hours' || lastTopic === 'location'){
        return es
          ? `💈 ¡Te esperamos! Walk-ins bienvenidos todos los días.`
          : `💈 We'll be here! Walk-ins welcome every day.`;
      }
      renderChips();
      return es
        ? `👍 ¡Genial${hi()}! ¿En qué más te puedo ayudar?`
        : `👍 Great${hi()}! What else can I help with?`;
    }

    // ── Negative / "no thanks" ──
    if(/^(no|nah|nope|nel|not really|no thanks|no gracias|est[oá] bien|i'?m good|all good|ya|nada)\s*[.!]?$/i.test(t)){
      renderChips(chipsGoodbye);
      return es
        ? `👋 ¡Perfecto${hi()}! Si necesitas algo más, aquí estoy. ¡Buen día!`
        : `👋 All good${hi()}! If you need anything later, I'm here. Have a great day!`;
    }

    // ── Name introduction ──
    if(/^(me llamo|my name is|i'?m |soy |i am )\s*(\w+)/i.test(t)){
      const nameMatch = t.match(/^(?:me llamo|my name is|i'?m |soy |i am )\s*(\w+)/i);
      if(nameMatch && nameMatch[1]){
        userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
        saveSession();
        return es
          ? `👋 ¡Mucho gusto, <b>${userName}</b>! ¿En qué te puedo ayudar?`
          : `👋 Nice to meet you, <b>${userName}</b>! How can I help?`;
      }
    }

    // ── Greetings — improved pattern ──
    if(/^(hi|hello|hey|hola|buenas|buenos|good\s?(morning|afternoon|evening)|sup|what'?s\s?up|yo|qu[eé] onda|que onda|wassup|howdy|wh?at'?s good|saludos|qu[eé] tal|holi)/i.test(t)){
      renderChips();
      return pick(es ? GREET_ES : GREET_EN);
    }

    // ── Thanks — improved pattern ──
    if(/thank|gracias|perfect|perfecto|great|genial|nice|sounds good|excelente|cool|buen[ií]simo|buenisimo|awesome|increíble|incredible|amazing|chévere|chevere|fire|bet|dope/i.test(t)){
      renderChips(chipsGoodbye);
      return pick(es ? THANKS_ES : THANKS_EN);
    }

    // ── Fallback — smart suggestions instead of dead end ──
    renderChips();
    return es
      ? `Hmm, no tengo esa información exacta${hi()}. ¿Te puedo ayudar con alguna de estas opciones? 👇`
      : `Hmm, I'm not sure about that${hi()}. Can I help you with one of these instead? 👇`;
  }

  // ── Send message ──
  function sendMsg(txt){
    const t = (txt || input.value).trim();
    if(!t) return;
    input.value = '';
    addMsg(t, 'user');
    const reply = botReply(t);
    showTyping(() => addMsg(reply, 'bot'), reply);
  }

  // ── Events ──
  btn.addEventListener('click', () => {
    opened = !opened;
    btn.classList.toggle('open', opened);
    panel.classList.toggle('open', opened);
    dot.style.display = 'none';
    if(opened){
      if(!msgs.children.length){
        // Returning user — skip language picker if lang already set
        if(chatLang){
          addMsg(pick(chatLang==='es' ? GREET_ES : GREET_EN), 'bot');
          state = 'idle';
          renderChips();
        } else {
          addMsg('👋 ¡Hola! / Hi there!<br>Choose your language / Elige tu idioma:', 'bot');
          showLangPicker();
          state = 'langPick';
        }
      }
      refreshStatus();
      setTimeout(() => input.focus(), 300);
    }
  });

  sendBtn.addEventListener('click', () => sendMsg());
  input.addEventListener('keydown', e => { if(e.key === 'Enter') sendMsg(); });

  const origToggle = window.toggleLang;
  window.toggleLang = function(){
    origToggle();
    renderChips();
    refreshStatus();
  };

  setTimeout(() => { if(!opened) dot.style.display = 'block'; }, 3000);

})();