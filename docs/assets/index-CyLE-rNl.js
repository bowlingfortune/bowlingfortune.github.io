(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const Pe=new Set([" ","	",",",";"]),ne=new Set("0123456789-".split("")),Ge=new Set("0123456789-X/".split(""));function me(e){return Pe.has(e)}function D(e){const{line:o}=e;for(;e.index<o.length&&me(o[e.index]);)e.index+=1;if(e.index>=o.length)return null;const t=e.index+1,a=o[e.index].toUpperCase();return e.index+=1,{char:a,column:t}}function F(e){if(e==="X")return 10;if(e==="-")return 0;const o=Number.parseInt(e,10);if(Number.isNaN(o))throw new Error(`Invalid roll symbol '${e}'`);if(o<0||o>9)throw new Error(`Invalid roll value '${e}'`);return o}function fe(e){return e==="X"||ne.has(e)}function oe(e){return Ge.has(e)}function L(e,o,t){return{symbol:e,value:o,column:t}}function pe(e){const o=[],t={line:e,index:0},a=()=>{for(;t.index<e.length&&me(e[t.index]);)t.index+=1};for(let n=0;n<9;n+=1){if(a(),t.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const s=D(t);if(!s)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:l,column:c}=s;if(!fe(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${n+1}`,column:c};if(l==="X"){o.push({rolls:[L("X",10,c)],isStrike:!0,isSpare:!1});continue}const d=F(l),g=D(t);if(!g)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:v,column:m}=g;if(v==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:m};if(v==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:m};const k=10-d;o.push({rolls:[L(l,d,c),L("/",k,m)],isStrike:!1,isSpare:!0});continue}if(!ne.has(v))return{kind:"error",message:`Invalid roll '${v}' in frame ${n+1}`,column:m};const b=F(v);if(d+b>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:m};o.push({rolls:[L(l,d,c),L(v,b,m)],isStrike:!1,isSpare:!1})}if(a(),t.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Oe(t,e);return r.kind==="error"?r:(o.push(r.frame),a(),t.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:t.index+1}:{kind:"success",frames:o})}function Oe(e,o){const t=D(e);if(!t)return{kind:"error",message:"Frame 10 is missing",column:o.length+1};const{char:a,column:r}=t;if(!fe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Re(e,r);const n=F(a),s=D(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:o.length+1};const{char:l,column:c}=s;if(l==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(l==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const g=10-n,v=D(e);if(!v)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:o.length+1};const{char:m,column:b}=v;if(m==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:b};if(!oe(m))return{kind:"error",message:`Invalid fill ball '${m}' in frame 10`,column:b};const k=m==="X"?10:F(m);return{kind:"success",frame:{rolls:[L(a,n,r),L("/",g,c),L(m,k,b)],isStrike:!1,isSpare:!0}}}if(!ne.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame 10`,column:c};const d=F(l);return n+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[L(a,n,r),L(l,d,c)],isStrike:!1,isSpare:!1}}}function Re(e,o){const t=D(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:o};const{char:a,column:r}=t;if(!oe(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;a==="X"?n=10:n=F(a);const s=D(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:l,column:c}=s;if(!oe(l))return{kind:"error",message:`Invalid fill ball '${l}' in frame 10`,column:c};let d;if(l==="X")d=10;else if(l==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};d=10-n}else if(d=F(l),a!=="X"&&n+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[L("X",10,o),L(a,n,r),L(l,d,c)],isStrike:!0,isSpare:!1}}}function U(e){const o=[],t=[],a=[];for(const s of e){for(const l of s.rolls)o.push(l.value);t.push(s.isStrike),a.push(s.isSpare)}let r=0,n=0;for(let s=0;s<10;s+=1)t[s]?(r+=10+(o[n+1]??0)+(o[n+2]??0),n+=1):a[s]?(r+=10+(o[n+2]??0),n+=2):(r+=(o[n]??0)+(o[n+1]??0),n+=2);return r}function Be(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const o=e.slice(0,9),t=e[9],a=[];function r(n,s){if(s===1){a.push([...n,t]);return}for(let l=0;l<s;l++)r(n,s-1),s%2===0?[n[l],n[s-1]]=[n[s-1],n[l]]:[n[0],n[s-1]]=[n[s-1],n[0]]}return r(o,o.length),a}function Ne(e){const o=Be(e),t=o.map(u=>U(u)),a=U(e);t.sort((u,y)=>u-y);const r=t[0],n=t[t.length-1],l=t.reduce((u,y)=>u+y,0)/t.length,c=Math.floor(t.length/2),d=t.length%2===0?(t[c-1]+t[c])/2:t[c],g=new Map;for(const u of t)g.set(u,(g.get(u)||0)+1);let v=0;for(const u of g.values())u>v&&(v=u);const m=[];for(const[u,y]of g)y===v&&m.push(u);m.sort((u,y)=>u-y);const b=[];for(const[u,y]of g)b.push({score:u,count:y,frequency:y/t.length});b.sort((u,y)=>u.score-y.score);const k=t.filter(u=>u<=a).length,M=Math.round(k/t.length*100*100)/100,S=t.reduce((u,y)=>u+Math.pow(y-l,2),0)/t.length,x=Math.sqrt(S),T=x===0?0:(a-l)/x,A=t.reduce((u,y)=>u+Math.pow((y-l)/x,3),0),X=x===0?0:A/t.length;return{min:r,max:n,mean:Math.round(l*100)/100,median:d,mode:m,permutationCount:o.length,histogram:b,actualPercentile:M,zScore:Math.round(T*100)/100,skewness:Math.round(X*100)/100,standardDeviation:Math.round(x*100)/100}}const he="bowling_fortune_saved_games",le=1e4;function He(e,o,t,a){const r=J(),n={id:_e(),scores:e,description:o,league:t,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:Je(e)};return r.games.unshift(n),r.games.length>le&&(r.games=r.games.slice(0,le)),W(r),n}function H(){return J().games}function je(e){const o=J();o.games=o.games.filter(t=>t.id!==e),W(o)}function Ye(){W({version:1,games:[]})}function Ue(){const e=H(),o=new Set;for(const t of e)t.league&&t.league.trim()&&o.add(t.league.trim());return Array.from(o).sort()}function ze(){const e=J();return JSON.stringify(e,null,2)}function Ve(e){try{const o=JSON.parse(e);if(!o.version||!Array.isArray(o.games))return{success:!1,count:0,error:"Invalid file format"};for(const t of o.games)if(!t.id||!t.scores||typeof t.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return W(o),{success:!0,count:o.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function J(){try{const e=localStorage.getItem(he);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function W(e){try{localStorage.setItem(he,JSON.stringify(e))}catch(o){throw o instanceof DOMException&&o.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",o),o}}function _e(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function Je(e){try{const o=e.trim().split(`
`).filter(a=>a.trim());let t=0;for(const a of o){const r=pe(a);if(r.kind==="error")return;t+=U(r.frames)}return t}catch{return}}const de=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],ue=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],We=.001,ge=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],ve=document.querySelector("#app");if(!ve)throw new Error("Failed to find app container");ve.innerHTML=`
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
        ${ge.map((e,o)=>`
          <button type="button" class="dropdown-item" data-example-index="${o}" role="menuitem">
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
    <p>Build: 2025-10-18 07:01:39 CT</p>
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

    <div class="sidebar-search">
      <input type="text" id="search-saved-games" placeholder="Search by league or description..." />
    </div>

    <div class="sidebar-actions">
      <div class="action-buttons-row">
        <button id="export-btn" class="secondary-btn">Export JSON</button>
        <button id="import-btn" class="secondary-btn">Import JSON</button>
      </div>
      <button id="clear-all-btn" class="secondary-btn">Clear All</button>
    </div>

    <div id="saved-games-list" class="saved-games-list">
      <!-- Saved games will be rendered here -->
    </div>
  </div>

  <!-- Hidden file input for import -->
  <input type="file" id="import-file-input" accept=".json" style="display: none;" />

  <!-- Sidebar Overlay -->
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
`;const $=document.querySelector("#scores-input"),z=document.querySelector("#submit"),ye=document.querySelector("#clear-btn"),G=document.querySelector("#example-btn"),I=document.querySelector("#example-dropdown"),E=document.querySelector("#feedback"),be=document.querySelector("#save-btn"),$e=document.querySelector("#saved-games-btn"),xe=document.querySelector("#saved-count"),P=document.querySelector("#save-modal-overlay"),Se=document.querySelector("#save-form"),V=document.querySelector("#save-description"),re=document.querySelector("#save-league"),we=document.querySelector("#league-list"),_=document.querySelector("#save-date"),ke=document.querySelector("#save-cancel-btn"),j=document.querySelector("#saved-games-sidebar"),K=document.querySelector("#sidebar-overlay"),Le=document.querySelector("#sidebar-close-btn"),Z=document.querySelector("#search-saved-games"),Me=document.querySelector("#export-btn"),Xe=document.querySelector("#import-btn"),N=document.querySelector("#import-file-input"),Ae=document.querySelector("#clear-all-btn"),B=document.querySelector("#saved-games-list"),Ee=document.querySelector("#sidebar-saved-count");if(!$||!z||!ye||!G||!I||!E||!be||!$e||!xe||!P||!Se||!V||!re||!we||!_||!ke||!j||!K||!Le||!Z||!Me||!Xe||!N||!Ae||!B||!Ee)throw new Error("Failed to initialise UI elements");ye.addEventListener("click",()=>{$.value="",E.innerHTML="",$.focus()});let C=!1;function Ke(){C=!C,I.classList.toggle("show",C),G.setAttribute("aria-expanded",C.toString()),I.setAttribute("aria-hidden",(!C).toString())}function ae(){C=!1,I.classList.remove("show"),G.setAttribute("aria-expanded","false"),I.setAttribute("aria-hidden","true")}G.addEventListener("click",e=>{e.stopPropagation(),Ke()});const qe=I.querySelectorAll(".dropdown-item");qe.forEach(e=>{e.addEventListener("click",o=>{o.stopPropagation();const t=parseInt(e.getAttribute("data-example-index")||"0",10);$.value=ge[t].score,ae(),$.focus()})});document.addEventListener("click",e=>{const o=e.target;C&&!G.contains(o)&&!I.contains(o)&&ae()});I.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const o=Array.from(qe),t=o.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=t<o.length-1?t+1:0:a=t>0?t-1:o.length-1,o[a]?.focus()}});let te=0;function Ce(){if(Math.random()<We){const o=Math.floor(Math.random()*ue.length);z.textContent=ue[o];return}z.textContent=de[te],te=(te+1)%de.length}Ce();setInterval(Ce,3e4);let Ie="";function ie(){if(!$.value.trim()){se("Please provide at least one game.",1,1);return}const e=$.value.replace(/\r/g,"").split(`
`),o=[];for(let t=0;t<e.length;t+=1){const a=e[t];if(!a.trim()){se(`Game ${t+1} is empty. Each line must contain exactly ten frames.`,t+1,1);return}const r=pe(a);if(r.kind==="error"){ot(r,t,e);return}const n=U(r.frames),s=Ne(r.frames);o.push({frames:r.frames,score:n,stats:s})}Ie=$.value,dt(o)}z.addEventListener("click",ie);$.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),ie())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(j.classList.contains("show")){ee();return}if(P.classList.contains("show")){Q();return}if(C){ae(),G.focus();return}E.innerHTML&&(E.innerHTML="",$.focus())}});function Y(){const o=H().length;xe.innerHTML=o>0?`&nbsp;(${o})`:"",Ee.innerHTML=o>0?`&nbsp;(${o})`:""}function Ze(){if(!$.value.trim()){w("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];_.value=e,V.value="",re.value="";const o=Ue();we.innerHTML=o.map(t=>`<option value="${t}">`).join(""),P.classList.add("show"),V.focus()}function Q(){P.classList.remove("show")}function Qe(){Z.value="",O(),j.classList.add("show"),K.classList.add("show")}function ee(){j.classList.remove("show"),K.classList.remove("show")}function O(){const e=Z.value.trim().toLowerCase();let o=H();if(e&&(o=o.filter(t=>{const a=(t.description||"").toLowerCase(),r=(t.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),o.length===0){B.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}B.innerHTML=o.map(t=>{const a=t.gameCount===1?"1 game":`${t.gameCount} games`,r=t.totalScore!==void 0?`🎯 ${t.totalScore}`:"⚠️ Invalid",n=t.description||"(No description)",s=t.league?`🏆 ${t.league}`:"";return`
      <div class="saved-game-card" data-game-id="${t.id}">
        <div class="saved-game-info">
          <h3>${n}</h3>
          ${s?`<p class="saved-game-league">${s}</p>`:""}
          <p class="saved-game-meta">
            📅 ${t.date} | 🎳 ${a} | ${r}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${t.id}">Load</button>
          <button class="delete-btn" data-delete-id="${t.id}">Delete</button>
        </div>
      </div>
    `}).join(""),B.querySelectorAll("[data-load-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-load-id");a&&et(a)})}),B.querySelectorAll("[data-delete-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-delete-id");a&&tt(a)})})}function et(e){const t=H().find(a=>a.id===e);t&&($.value=t.scores,ee(),$.focus(),w("Game loaded!"))}function tt(e){confirm("Delete this saved game?")&&(je(e),Y(),O(),w("Game deleted"))}be.addEventListener("click",Ze);$e.addEventListener("click",Qe);ke.addEventListener("click",Q);Le.addEventListener("click",ee);K.addEventListener("click",ee);Z.addEventListener("input",()=>{O()});P.addEventListener("click",e=>{e.target===P&&Q()});Se.addEventListener("submit",e=>{e.preventDefault();const o=$.value.trim(),t=V.value.trim()||void 0,a=re.value.trim()||void 0;let r=_.value||void 0;if(r){const n=new Date(r),s=new Date;if(s.setHours(0,0,0,0),n>s){w("Date cannot be in the future"),_.focus();return}}try{He(o,t,a,r),Q(),Y(),j.classList.contains("show")&&O(),w("Game saved!")}catch(n){console.error("Failed to save game",n),w("Failed to save game")}});Ae.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(Ye(),Y(),O(),w("All games deleted"))});Me.addEventListener("click",()=>{const e=H();if(e.length===0){w("No games to export");return}const o=ze(),t=new Blob([o],{type:"application/json"}),a=URL.createObjectURL(t),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),w(`Exported ${e.length} game${e.length===1?"":"s"}`)});Xe.addEventListener("click",()=>{N.click()});N.addEventListener("change",e=>{const o=e.target.files?.[0];if(!o)return;const t=new FileReader;t.onload=a=>{const r=a.target?.result,n=Ve(r);n.success?(Y(),O(),w(`Imported ${n.count} game${n.count===1?"":"s"}`)):w(n.error||"Import failed"),N.value=""},t.onerror=()=>{w("Failed to read file"),N.value=""},t.readAsText(o)});Y();window.addEventListener("DOMContentLoaded",()=>{const o=new URLSearchParams(window.location.search).get("scores");if(o)try{const t=atob(o);$.value=t,ie()}catch(t){console.error("Failed to decode scores from URL",t)}});function ot(e,o,t){const a=o+1,r=`Row ${a}, column ${e.column}: ${e.message}`,n=Te(t,o,e.column);se(r,a,e.column,n)}function Te(e,o,t){let a=0;for(let r=0;r<o;r+=1)a+=e[r].length+1;return a+(t-1)}function se(e,o,t,a){if(E.innerHTML="",E.className="error",E.textContent=e,$.focus(),typeof a=="number")$.setSelectionRange(a,a);else{const r=$.value.replace(/\r/g,"").split(`
`),n=Te(r,o-1,t);$.setSelectionRange(n,n)}}function st(e){const{histogram:o,median:t}=e.stats,a=e.score,r=600,n=300,s={top:20,right:20,bottom:40,left:50},l=r-s.left-s.right,c=n-s.top-s.bottom,d=e.stats.min,g=e.stats.max,v=new Map(o.map(h=>[h.score,h])),m=[];for(let h=d;h<=g;h++){const p=v.get(h);m.push({score:h,count:p?.count??0,frequency:p?.frequency??0})}const b=Math.max(...m.map(h=>h.count)),k=Math.max(2,l/m.length),M=m.map((h,p)=>{const i=s.left+p*l/m.length,f=h.count/b*c,R=s.top+c-f,q=h.score===a;return`<rect
      x="${i}"
      y="${R}"
      width="${k}"
      height="${f}"
      fill="${q?"#fbbf24":"#60a5fa"}"
      opacity="${q?"1":"0.7"}"
    >
      <title>Score: ${h.score}
Count: ${h.count.toLocaleString()}
Frequency: ${(h.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),S=t-d,x=s.left+S*l/m.length+k/2,T=`
    <line x1="${x}" y1="${s.top}" x2="${x}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,X=Array.from({length:A+1},(h,p)=>{const i=Math.round(b/A*p),f=s.top+c-p*c/A;return`
      <line x1="${s.left-5}" y1="${f}" x2="${s.left}" y2="${f}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left-10}" y="${f+4}" text-anchor="end" font-size="11" fill="#94a3b8">${i.toLocaleString()}</text>
    `}).join(""),u=Math.min(10,Math.ceil((g-d)/10)),y=u===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:u+1},(h,p)=>{const i=Math.round(d+(g-d)/u*p),f=s.left+p*l/u;return`
        <line x1="${f}" y1="${s.top+c}" x2="${f}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${f}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${i}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${M}
      ${T}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+l}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${X}
      ${y}
      <text x="${s.left+l/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+c/2})">Count</text>
    </svg>
  `}function nt(e,o,t){return e>=95?"🏆":t===o?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function rt(e){const{zScore:o,actualPercentile:t,skewness:a,median:r}=e.stats;e.score-e.stats.median;let s=`${nt(t,r,e.score)} `;return Math.abs(o)<.5?s+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":o>=2?s+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":o<=-2?s+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":o>1?s+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":o<-1?s+="Your score was <strong>notably below average</strong> — your frame order worked against you.":o>0?s+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",t>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":t>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":t<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":t<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function De(e){let o=new Map;for(const t of e[0].stats.histogram)o.set(t.score,t.count);for(let t=1;t<e.length;t++){const a=new Map;for(const[r,n]of o)for(const s of e[t].stats.histogram){const l=r+s.score,c=n*s.count;a.set(l,(a.get(l)||0)+c)}o=a}return o}function at(e,o){const t=De(e),a=[];for(const[i,f]of t)a.push({score:i,count:f});a.sort((i,f)=>i.score-f.score);const r=600,n=300,s={top:20,right:20,bottom:40,left:50},l=r-s.left-s.right,c=n-s.top-s.bottom,d=a[0].score,g=a[a.length-1].score,v=new Map(a.map(i=>[i.score,i])),m=[];for(let i=d;i<=g;i++){const f=v.get(i);m.push({score:i,count:f?.count??0})}const b=Math.max(...m.map(i=>i.count)),k=Array.from(t.values()).reduce((i,f)=>i+f,0);let M=0,S=0;for(const i of a)if(M+=i.count,M>=k/2){S=i.score;break}const x=Math.max(2,l/m.length),T=m.map((i,f)=>{const R=s.left+f*l/m.length,q=i.count/b*c,Fe=s.top+c-q,ce=i.score===o;return`<rect
      x="${R}"
      y="${Fe}"
      width="${x}"
      height="${q}"
      fill="${ce?"#fbbf24":"#60a5fa"}"
      opacity="${ce?"1":"0.7"}"
    >
      <title>Series Score: ${i.score}
Combinations: ${i.count.toLocaleString()}</title>
    </rect>`}).join(""),A=S-d,X=s.left+A*l/m.length+x/2,u=`
    <line x1="${X}" y1="${s.top}" x2="${X}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${X}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,y="",h=Math.min(10,Math.ceil((g-d)/20)),p=h===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:h+1},(i,f)=>{const R=Math.round(d+(g-d)/h*f),q=s.left+f*l/h;return`
        <line x1="${q}" y1="${s.top+c}" x2="${q}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${q}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${R}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${T}
      ${u}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+l}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${p}
      <text x="${s.left+l/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function it(e){if(e.length<2)return"";const o=e.reduce((i,f)=>i+f.score,0),t=Math.round(o/e.length*100)/100,a=De(e),r=[];for(const[i,f]of a)r.push({score:i,count:f});r.sort((i,f)=>i.score-f.score);const n=Array.from(a.values()).reduce((i,f)=>i+f,0),s=r[0].score,l=r[r.length-1].score;let c=0;for(const i of r)c+=i.score*i.count;const d=c/n;let g=0,v=0;for(const i of r)if(g+=i.count,g>=n/2){v=i.score;break}const m=r.filter(i=>i.score<=o).reduce((i,f)=>i+f.count,0),b=Math.round(m/n*100*100)/100;let k=0;for(const i of r)k+=Math.pow(i.score-d,2)*i.count;const M=Math.sqrt(k/n),S=M===0?0:(o-d)/M;let x=0;for(const i of r)x+=Math.pow((i.score-d)/M,3)*i.count;const T=M===0?0:x/n;let A=0;for(const i of r)i.count>A&&(A=i.count);const X=[];for(const i of r)i.count===A&&X.push(i.score);const u=o-v,y=u>=0?`+${u}`:`${u}`,h=X.length===1?X[0].toString():`${X.join(", ")} (multimodal)`;let p="";return Math.abs(S)<.5?p="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":S>=2?p="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":S<=-2?p="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":S>=1?p="Across this series, you had <strong>notably favorable</strong> frame sequences.":S<=-1?p="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":S>0?p="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":p="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",b>=95?p+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":b>=75?p+=" You scored in the <strong>top quartile</strong> of possible combinations.":b<=5?p+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":b<=25&&(p+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${p}</p>
      </div>

      <div class="histogram-container">
        ${at(e,o)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${o}</dd>

        <dt>Average score per game:</dt>
        <dd>${t}</dd>

        <dt>Percentile:</dt>
        <dd>${b}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(S*100)/100}</dd>

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
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(T*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${h}</dd>
      </dl>
    </article>
  `}function ct(){const e=btoa(Ie),o=new URL(window.location.href);return o.search=`?scores=${encodeURIComponent(e)}`,o.toString()}function lt(){const e=ct();navigator.clipboard.writeText(e).then(()=>{w("Link copied!")}).catch(o=>{console.error("Failed to copy link",o),w("Failed to copy link")})}function w(e){const o=document.querySelector(".toast");o&&o.remove();const t=document.createElement("div");t.className="toast",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove()},300)},2e3)}function dt(e){if(E.className="output",e.length===0){E.innerHTML="";return}const o=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,t=e.map((n,s)=>{const l=s+1,c=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,d=n.score-n.stats.median,g=d>=0?`+${d}`:`${d}`,v=rt(n);return`
        <article class="result-card">
          <h2>Game ${l}</h2>
          <p><strong>Actual score:</strong> ${n.score}</p>

          <div class="narrative">
            <p>${v}</p>
          </div>

          <div class="histogram-container">
            ${st(n)}
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
      `}).join(""),a=it(e);E.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${o}
      </div>
      ${t}
      ${a}
      <div class="results-footer">
        ${o}
      </div>
    </section>
  `,E.querySelectorAll("[data-copy-link]").forEach(n=>{n.addEventListener("click",lt)})}
