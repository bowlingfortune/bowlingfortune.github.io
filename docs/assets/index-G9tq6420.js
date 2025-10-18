(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const Te=new Set([" ","	",",",";"]),Q=new Set("0123456789-".split("")),Ie=new Set("0123456789-X/".split(""));function de(e){return Te.has(e)}function D(e){const{line:t}=e;for(;e.index<t.length&&de(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function P(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function ue(e){return e==="X"||Q.has(e)}function J(e){return Ie.has(e)}function k(e,t,o){return{symbol:e,value:t,column:o}}function me(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&de(e[o.index]);)o.index+=1};for(let n=0;n<9;n+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const s=D(o);if(!s)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:l,column:c}=s;if(!ue(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${n+1}`,column:c};if(l==="X"){t.push({rolls:[k("X",10,c)],isStrike:!0,isSpare:!1});continue}const d=P(l),g=D(o);if(!g)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:v,column:m}=g;if(v==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:m};if(v==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:m};const S=10-d;t.push({rolls:[k(l,d,c),k("/",S,m)],isStrike:!1,isSpare:!0});continue}if(!Q.has(v))return{kind:"error",message:`Invalid roll '${v}' in frame ${n+1}`,column:m};const b=P(v);if(d+b>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:m};t.push({rolls:[k(l,d,c),k(v,b,m)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=De(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function De(e,t){const o=D(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!ue(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Pe(e,r);const n=P(a),s=D(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:l,column:c}=s;if(l==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(l==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const g=10-n,v=D(e);if(!v)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:m,column:b}=v;if(m==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:b};if(!J(m))return{kind:"error",message:`Invalid fill ball '${m}' in frame 10`,column:b};const S=m==="X"?10:P(m);return{kind:"success",frame:{rolls:[k(a,n,r),k("/",g,c),k(m,S,b)],isStrike:!1,isSpare:!0}}}if(!Q.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame 10`,column:c};const d=P(l);return n+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[k(a,n,r),k(l,d,c)],isStrike:!1,isSpare:!1}}}function Pe(e,t){const o=D(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!J(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;a==="X"?n=10:n=P(a);const s=D(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:l,column:c}=s;if(!J(l))return{kind:"error",message:`Invalid fill ball '${l}' in frame 10`,column:c};let d;if(l==="X")d=10;else if(l==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};d=10-n}else if(d=P(l),a!=="X"&&n+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[k("X",10,t),k(a,n,r),k(l,d,c)],isStrike:!0,isSpare:!1}}}function H(e){const t=[],o=[],a=[];for(const s of e){for(const l of s.rolls)t.push(l.value);o.push(s.isStrike),a.push(s.isSpare)}let r=0,n=0;for(let s=0;s<10;s+=1)o[s]?(r+=10+(t[n+1]??0)+(t[n+2]??0),n+=1):a[s]?(r+=10+(t[n+2]??0),n+=2):(r+=(t[n]??0)+(t[n+1]??0),n+=2);return r}function Fe(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(n,s){if(s===1){a.push([...n,o]);return}for(let l=0;l<s;l++)r(n,s-1),s%2===0?[n[l],n[s-1]]=[n[s-1],n[l]]:[n[0],n[s-1]]=[n[s-1],n[0]]}return r(t,t.length),a}function Ge(e){const t=Fe(e),o=t.map(u=>H(u)),a=H(e);o.sort((u,y)=>u-y);const r=o[0],n=o[o.length-1],l=o.reduce((u,y)=>u+y,0)/o.length,c=Math.floor(o.length/2),d=o.length%2===0?(o[c-1]+o[c])/2:o[c],g=new Map;for(const u of o)g.set(u,(g.get(u)||0)+1);let v=0;for(const u of g.values())u>v&&(v=u);const m=[];for(const[u,y]of g)y===v&&m.push(u);m.sort((u,y)=>u-y);const b=[];for(const[u,y]of g)b.push({score:u,count:y,frequency:y/o.length});b.sort((u,y)=>u.score-y.score);const S=o.filter(u=>u<=a).length,L=Math.round(S/o.length*100*100)/100,w=o.reduce((u,y)=>u+Math.pow(y-l,2),0)/o.length,x=Math.sqrt(w),I=x===0?0:(a-l)/x,X=o.reduce((u,y)=>u+Math.pow((y-l)/x,3),0),M=x===0?0:X/o.length;return{min:r,max:n,mean:Math.round(l*100)/100,median:d,mode:m,permutationCount:t.length,histogram:b,actualPercentile:L,zScore:Math.round(I*100)/100,skewness:Math.round(M*100)/100,standardDeviation:Math.round(x*100)/100}}const fe="bowling_fortune_saved_games",ie=50;function Be(e,t,o,a){const r=ee(),n={id:Ne(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:Ye(e)};return r.games.unshift(n),r.games.length>ie&&(r.games=r.games.slice(0,ie)),te(r),n}function z(){return ee().games}function Re(e){const t=ee();t.games=t.games.filter(o=>o.id!==e),te(t)}function Oe(){te({version:1,games:[]})}function He(){const e=z(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function ee(){try{const e=localStorage.getItem(fe);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function te(e){try{localStorage.setItem(fe,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function Ne(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function Ye(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const r=me(a);if(r.kind==="error")return;o+=H(r.frames)}return o}catch{return}}const ce=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],le=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],ze=.001,he=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],pe=document.querySelector("#app");if(!pe)throw new Error("Failed to find app container");pe.innerHTML=`
  <h1>Bowling Fortune Teller 🎳</h1>
  <div class="brought-to-you">
    brought to you by <img src="/logo.png" alt="Pocket Penetration" class="sponsor-logo">
  </div>
  <label for="scores-input">Frame-by-Frame Score(s)</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
  <div class="textarea-footer">
    <div class="example-dropdown-container">
      <button id="example-btn" type="button" class="secondary-btn example-btn" aria-haspopup="true" aria-expanded="false">
        Try an example
        <span class="dropdown-arrow">▼</span>
      </button>
      <div id="example-dropdown" class="example-dropdown" role="menu" aria-hidden="true">
        ${he.map((e,t)=>`
          <button type="button" class="dropdown-item" data-example-index="${t}" role="menuitem">
            <strong>${e.name}</strong>
            <span class="dropdown-item-desc">${e.description}</span>
          </button>
        `).join("")}
      </div>
    </div>
    <button id="clear-btn" type="button" class="secondary-btn">Clear</button>
    <button id="save-btn" type="button" class="secondary-btn">💾 Save</button>
    <button id="saved-games-btn" type="button" class="secondary-btn">
      📋 Saved Games <span id="saved-count"></span>
    </button>
  </div>
  <div id="scores-help" class="description">
    <p>Enter frame-by-frame scores. Use spaces or commas to separate frames.</p>
    <p>Enter one game per line.</p>
    <p>Valid characters:</p>
    <ul>
      <li>0-9</li>
      <li>/</li>
      <li>X</li>
      <li>- (counts the same as 0)</li>
    </ul>
  </div>
  <button id="submit" type="button">Tell My Bowling Fortune</button>
  <div id="feedback" role="status" aria-live="polite"></div>
  <footer class="version">
    <p>Build: 2025-10-18 06:51:08 CT</p>
  </footer>

  <!-- Save Modal -->
  <div id="save-modal-overlay" class="modal-overlay">
    <div class="save-modal">
      <h2>Save Game</h2>
      <form id="save-form">
        <label for="save-description">Description (optional)</label>
        <input type="text" id="save-description" placeholder="e.g., Practice session" />

        <label for="save-league">League (optional)</label>
        <input type="text" id="save-league" list="league-list" placeholder="e.g., Tuesday Night League" />
        <datalist id="league-list"></datalist>

        <label for="save-date">Date (optional)</label>
        <input type="date" id="save-date" />

        <div class="modal-actions">
          <button type="button" id="save-cancel-btn" class="secondary-btn">Cancel</button>
          <button type="submit" class="primary-btn">Save</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Saved Games Sidebar -->
  <div id="saved-games-sidebar" class="saved-games-sidebar">
    <div class="sidebar-header">
      <h2>📋 Saved Games <span id="sidebar-saved-count"></span></h2>
      <button id="sidebar-close-btn" class="close-btn" aria-label="Close sidebar">×</button>
    </div>

    <div class="sidebar-actions">
      <button id="clear-all-btn" class="secondary-btn">Clear All</button>
    </div>

    <div id="saved-games-list" class="saved-games-list">
      <!-- Saved games will be rendered here -->
    </div>
  </div>

  <!-- Sidebar Overlay -->
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
`;const $=document.querySelector("#scores-input"),N=document.querySelector("#submit"),ge=document.querySelector("#clear-btn"),G=document.querySelector("#example-btn"),E=document.querySelector("#example-dropdown"),A=document.querySelector("#feedback"),ve=document.querySelector("#save-btn"),ye=document.querySelector("#saved-games-btn"),be=document.querySelector("#saved-count"),F=document.querySelector("#save-modal-overlay"),$e=document.querySelector("#save-form"),Y=document.querySelector("#save-description"),oe=document.querySelector("#save-league"),xe=document.querySelector("#league-list"),se=document.querySelector("#save-date"),we=document.querySelector("#save-cancel-btn"),O=document.querySelector("#saved-games-sidebar"),j=document.querySelector("#sidebar-overlay"),Se=document.querySelector("#sidebar-close-btn"),ke=document.querySelector("#clear-all-btn"),R=document.querySelector("#saved-games-list"),Le=document.querySelector("#sidebar-saved-count");if(!$||!N||!ge||!G||!E||!A||!ve||!ye||!be||!F||!$e||!Y||!oe||!xe||!se||!we||!O||!j||!Se||!ke||!R||!Le)throw new Error("Failed to initialise UI elements");ge.addEventListener("click",()=>{$.value="",A.innerHTML="",$.focus()});let C=!1;function je(){C=!C,E.classList.toggle("show",C),G.setAttribute("aria-expanded",C.toString()),E.setAttribute("aria-hidden",(!C).toString())}function ne(){C=!1,E.classList.remove("show"),G.setAttribute("aria-expanded","false"),E.setAttribute("aria-hidden","true")}G.addEventListener("click",e=>{e.stopPropagation(),je()});const Me=E.querySelectorAll(".dropdown-item");Me.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);$.value=he[o].score,ne(),$.focus()})});document.addEventListener("click",e=>{const t=e.target;C&&!G.contains(t)&&!E.contains(t)&&ne()});E.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Me),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});let K=0;function Xe(){if(Math.random()<ze){const t=Math.floor(Math.random()*le.length);N.textContent=le[t];return}N.textContent=ce[K],K=(K+1)%ce.length}Xe();setInterval(Xe,3e4);let Ae="";function re(){if(!$.value.trim()){Z("Please provide at least one game.",1,1);return}const e=$.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){Z(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=me(a);if(r.kind==="error"){Ke(r,o,e);return}const n=H(r.frames),s=Ge(r.frames);t.push({frames:r.frames,score:n,stats:s})}Ae=$.value,nt(t)}N.addEventListener("click",re);$.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),re())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(O.classList.contains("show")){U();return}if(F.classList.contains("show")){_();return}if(C){ne(),G.focus();return}A.innerHTML&&(A.innerHTML="",$.focus())}});function V(){const t=z().length;be.textContent=t>0?` (${t})`:"",Le.textContent=t>0?` (${t})`:""}function Ve(){if(!$.value.trim()){T("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];se.value=e,Y.value="",oe.value="";const t=He();xe.innerHTML=t.map(o=>`<option value="${o}">`).join(""),F.classList.add("show"),Y.focus()}function _(){F.classList.remove("show")}function _e(){W(),O.classList.add("show"),j.classList.add("show")}function U(){O.classList.remove("show"),j.classList.remove("show")}function W(){const e=z();if(e.length===0){R.innerHTML='<p class="empty-state">No saved games yet. Save your first game!</p>';return}R.innerHTML=e.map(t=>{const o=t.gameCount===1?"1 game":`${t.gameCount} games`,a=t.totalScore!==void 0?`🎯 ${t.totalScore}`:"⚠️ Invalid",r=t.description||"(No description)",n=t.league?`🏆 ${t.league}`:"";return`
      <div class="saved-game-card" data-game-id="${t.id}">
        <div class="saved-game-info">
          <h3>${r}</h3>
          ${n?`<p class="saved-game-league">${n}</p>`:""}
          <p class="saved-game-meta">
            📅 ${t.date} | 🎳 ${o} | ${a}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${t.id}">Load</button>
          <button class="delete-btn" data-delete-id="${t.id}">Delete</button>
        </div>
      </div>
    `}).join(""),R.querySelectorAll("[data-load-id]").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("data-load-id");o&&Ue(o)})}),R.querySelectorAll("[data-delete-id]").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("data-delete-id");o&&We(o)})})}function Ue(e){const o=z().find(a=>a.id===e);o&&($.value=o.scores,U(),$.focus(),T("Game loaded!"))}function We(e){confirm("Delete this saved game?")&&(Re(e),V(),W(),T("Game deleted"))}ve.addEventListener("click",Ve);ye.addEventListener("click",_e);we.addEventListener("click",_);Se.addEventListener("click",U);j.addEventListener("click",U);F.addEventListener("click",e=>{e.target===F&&_()});$e.addEventListener("submit",e=>{e.preventDefault();const t=$.value.trim(),o=Y.value.trim()||void 0,a=oe.value.trim()||void 0,r=se.value||void 0;try{Be(t,o,a,r),_(),V(),O.classList.contains("show")&&W(),T("Game saved!")}catch(n){console.error("Failed to save game",n),T("Failed to save game")}});ke.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(Oe(),V(),W(),T("All games deleted"))});V();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);$.value=o,re()}catch(o){console.error("Failed to decode scores from URL",o)}});function Ke(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,n=qe(o,t,e.column);Z(r,a,e.column,n)}function qe(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function Z(e,t,o,a){if(A.innerHTML="",A.className="error",A.textContent=e,$.focus(),typeof a=="number")$.setSelectionRange(a,a);else{const r=$.value.replace(/\r/g,"").split(`
`),n=qe(r,t-1,o);$.setSelectionRange(n,n)}}function Je(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,n=300,s={top:20,right:20,bottom:40,left:50},l=r-s.left-s.right,c=n-s.top-s.bottom,d=e.stats.min,g=e.stats.max,v=new Map(t.map(p=>[p.score,p])),m=[];for(let p=d;p<=g;p++){const h=v.get(p);m.push({score:p,count:h?.count??0,frequency:h?.frequency??0})}const b=Math.max(...m.map(p=>p.count)),S=Math.max(2,l/m.length),L=m.map((p,h)=>{const i=s.left+h*l/m.length,f=p.count/b*c,B=s.top+c-f,q=p.score===a;return`<rect
      x="${i}"
      y="${B}"
      width="${S}"
      height="${f}"
      fill="${q?"#fbbf24":"#60a5fa"}"
      opacity="${q?"1":"0.7"}"
    >
      <title>Score: ${p.score}
Count: ${p.count.toLocaleString()}
Frequency: ${(p.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),w=o-d,x=s.left+w*l/m.length+S/2,I=`
    <line x1="${x}" y1="${s.top}" x2="${x}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,X=5,M=Array.from({length:X+1},(p,h)=>{const i=Math.round(b/X*h),f=s.top+c-h*c/X;return`
      <line x1="${s.left-5}" y1="${f}" x2="${s.left}" y2="${f}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left-10}" y="${f+4}" text-anchor="end" font-size="11" fill="#94a3b8">${i.toLocaleString()}</text>
    `}).join(""),u=Math.min(10,Math.ceil((g-d)/10)),y=u===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:u+1},(p,h)=>{const i=Math.round(d+(g-d)/u*h),f=s.left+h*l/u;return`
        <line x1="${f}" y1="${s.top+c}" x2="${f}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${f}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${i}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${L}
      ${I}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+l}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${M}
      ${y}
      <text x="${s.left+l/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+c/2})">Count</text>
    </svg>
  `}function Ze(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function Qe(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats;e.score-e.stats.median;let s=`${Ze(o,r,e.score)} `;return Math.abs(t)<.5?s+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?s+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?s+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?s+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?s+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?s+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function Ce(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,n]of t)for(const s of e[o].stats.histogram){const l=r+s.score,c=n*s.count;a.set(l,(a.get(l)||0)+c)}t=a}return t}function et(e,t){const o=Ce(e),a=[];for(const[i,f]of o)a.push({score:i,count:f});a.sort((i,f)=>i.score-f.score);const r=600,n=300,s={top:20,right:20,bottom:40,left:50},l=r-s.left-s.right,c=n-s.top-s.bottom,d=a[0].score,g=a[a.length-1].score,v=new Map(a.map(i=>[i.score,i])),m=[];for(let i=d;i<=g;i++){const f=v.get(i);m.push({score:i,count:f?.count??0})}const b=Math.max(...m.map(i=>i.count)),S=Array.from(o.values()).reduce((i,f)=>i+f,0);let L=0,w=0;for(const i of a)if(L+=i.count,L>=S/2){w=i.score;break}const x=Math.max(2,l/m.length),I=m.map((i,f)=>{const B=s.left+f*l/m.length,q=i.count/b*c,Ee=s.top+c-q,ae=i.score===t;return`<rect
      x="${B}"
      y="${Ee}"
      width="${x}"
      height="${q}"
      fill="${ae?"#fbbf24":"#60a5fa"}"
      opacity="${ae?"1":"0.7"}"
    >
      <title>Series Score: ${i.score}
Combinations: ${i.count.toLocaleString()}</title>
    </rect>`}).join(""),X=w-d,M=s.left+X*l/m.length+x/2,u=`
    <line x1="${M}" y1="${s.top}" x2="${M}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${M}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,y="",p=Math.min(10,Math.ceil((g-d)/20)),h=p===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:p+1},(i,f)=>{const B=Math.round(d+(g-d)/p*f),q=s.left+f*l/p;return`
        <line x1="${q}" y1="${s.top+c}" x2="${q}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${q}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${B}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${I}
      ${u}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+l}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${h}
      <text x="${s.left+l/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function tt(e){if(e.length<2)return"";const t=e.reduce((i,f)=>i+f.score,0),o=Math.round(t/e.length*100)/100,a=Ce(e),r=[];for(const[i,f]of a)r.push({score:i,count:f});r.sort((i,f)=>i.score-f.score);const n=Array.from(a.values()).reduce((i,f)=>i+f,0),s=r[0].score,l=r[r.length-1].score;let c=0;for(const i of r)c+=i.score*i.count;const d=c/n;let g=0,v=0;for(const i of r)if(g+=i.count,g>=n/2){v=i.score;break}const m=r.filter(i=>i.score<=t).reduce((i,f)=>i+f.count,0),b=Math.round(m/n*100*100)/100;let S=0;for(const i of r)S+=Math.pow(i.score-d,2)*i.count;const L=Math.sqrt(S/n),w=L===0?0:(t-d)/L;let x=0;for(const i of r)x+=Math.pow((i.score-d)/L,3)*i.count;const I=L===0?0:x/n;let X=0;for(const i of r)i.count>X&&(X=i.count);const M=[];for(const i of r)i.count===X&&M.push(i.score);const u=t-v,y=u>=0?`+${u}`:`${u}`,p=M.length===1?M[0].toString():`${M.join(", ")} (multimodal)`;let h="";return Math.abs(w)<.5?h="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?h="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?h="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?h="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?h="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?h="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":h="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",b>=95?h+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":b>=75?h+=" You scored in the <strong>top quartile</strong> of possible combinations.":b<=5?h+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":b<=25&&(h+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${h}</p>
      </div>

      <div class="histogram-container">
        ${et(e,t)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${t}</dd>

        <dt>Average score per game:</dt>
        <dd>${o}</dd>

        <dt>Percentile:</dt>
        <dd>${b}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${y}</dd>

        <dt>Minimum score:</dt>
        <dd>${s}</dd>

        <dt>Maximum score:</dt>
        <dd>${l}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(d*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${v}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(L*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(I*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${p}</dd>
      </dl>
    </article>
  `}function ot(){const e=btoa(Ae),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function st(){const e=ot();navigator.clipboard.writeText(e).then(()=>{T("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),T("Failed to copy link")})}function T(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function nt(e){if(A.className="output",e.length===0){A.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((n,s)=>{const l=s+1,c=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,d=n.score-n.stats.median,g=d>=0?`+${d}`:`${d}`,v=Qe(n);return`
        <article class="result-card">
          <h2>Game ${l}</h2>
          <p><strong>Actual score:</strong> ${n.score}</p>

          <div class="narrative">
            <p>${v}</p>
          </div>

          <div class="histogram-container">
            ${Je(n)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${n.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${n.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${n.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${g}</dd>

            <dt>Minimum score:</dt>
            <dd>${n.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${n.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${n.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${n.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${n.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${n.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${c}</dd>
          </dl>
        </article>
      `}).join(""),a=tt(e);A.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${t}
      </div>
      ${o}
      ${a}
      <div class="results-footer">
        ${t}
      </div>
    </section>
  `,A.querySelectorAll("[data-copy-link]").forEach(n=>{n.addEventListener("click",st)})}
