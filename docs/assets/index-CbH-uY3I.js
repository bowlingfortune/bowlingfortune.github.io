(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const Pe=new Set([" ","	",",",";"]),ne=new Set("0123456789-".split("")),Oe=new Set("0123456789-X/".split(""));function me(e){return Pe.has(e)}function F(e){const{line:t}=e;for(;e.index<t.length&&me(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function fe(e){return e==="X"||ne.has(e)}function oe(e){return Oe.has(e)}function L(e,t,o){return{symbol:e,value:t,column:o}}function pe(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&me(e[o.index]);)o.index+=1};for(let n=0;n<9;n+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const s=F(o);if(!s)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:i,column:c}=s;if(!fe(i))return{kind:"error",message:`Invalid roll '${i}' in frame ${n+1}`,column:c};if(i==="X"){t.push({rolls:[L("X",10,c)],isStrike:!0,isSpare:!1});continue}const d=D(i),h=F(o);if(!h)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:p,column:u}=h;if(p==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:u};if(p==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:u};const k=10-d;t.push({rolls:[L(i,d,c),L("/",k,u)],isStrike:!1,isSpare:!0});continue}if(!ne.has(p))return{kind:"error",message:`Invalid roll '${p}' in frame ${n+1}`,column:u};const y=D(p);if(d+y>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:u};t.push({rolls:[L(i,d,c),L(p,y,u)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Ge(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function Ge(e,t){const o=F(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!fe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Be(e,r);const n=D(a),s=F(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:i,column:c}=s;if(i==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(i==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const h=10-n,p=F(e);if(!p)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:u,column:y}=p;if(u==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:y};if(!oe(u))return{kind:"error",message:`Invalid fill ball '${u}' in frame 10`,column:y};const k=u==="X"?10:D(u);return{kind:"success",frame:{rolls:[L(a,n,r),L("/",h,c),L(u,k,y)],isStrike:!1,isSpare:!0}}}if(!ne.has(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:c};const d=D(i);return n+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[L(a,n,r),L(i,d,c)],isStrike:!1,isSpare:!1}}}function Be(e,t){const o=F(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!oe(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;a==="X"?n=10:n=D(a);const s=F(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:i,column:c}=s;if(!oe(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:c};let d;if(i==="X")d=10;else if(i==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};d=10-n}else if(d=D(i),a!=="X"&&n+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[L("X",10,t),L(a,n,r),L(i,d,c)],isStrike:!0,isSpare:!1}}}function z(e){const t=[],o=[],a=[];for(const s of e){for(const i of s.rolls)t.push(i.value);o.push(s.isStrike),a.push(s.isSpare)}let r=0,n=0;for(let s=0;s<10;s+=1)o[s]?(r+=10+(t[n+1]??0)+(t[n+2]??0),n+=1):a[s]?(r+=10+(t[n+2]??0),n+=2):(r+=(t[n]??0)+(t[n+1]??0),n+=2);return r}function Re(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(n,s){if(s===1){a.push([...n,o]);return}for(let i=0;i<s;i++)r(n,s-1),s%2===0?[n[i],n[s-1]]=[n[s-1],n[i]]:[n[0],n[s-1]]=[n[s-1],n[0]]}return r(t,t.length),a}function Ne(e){const t=Re(e),o=t.map(m=>z(m)),a=z(e);o.sort((m,b)=>m-b);const r=o[0],n=o[o.length-1],i=o.reduce((m,b)=>m+b,0)/o.length,c=Math.floor(o.length/2),d=o.length%2===0?(o[c-1]+o[c])/2:o[c],h=new Map;for(const m of o)h.set(m,(h.get(m)||0)+1);let p=0;for(const m of h.values())m>p&&(p=m);const u=[];for(const[m,b]of h)b===p&&u.push(m);u.sort((m,b)=>m-b);const y=[];for(const[m,b]of h)y.push({score:m,count:b,frequency:b/o.length});y.sort((m,b)=>m.score-b.score);const k=o.filter(m=>m<=a).length,M=Math.round(k/o.length*100*100)/100,w=o.reduce((m,b)=>m+Math.pow(b-i,2),0)/o.length,S=Math.sqrt(w),T=S===0?0:(a-i)/S,X=o.reduce((m,b)=>m+Math.pow((b-i)/S,3),0),C=S===0?0:X/o.length;return{min:r,max:n,mean:Math.round(i*100)/100,median:d,mode:u,permutationCount:t.length,histogram:y,actualPercentile:M,zScore:Math.round(T*100)/100,skewness:Math.round(C*100)/100,standardDeviation:Math.round(S*100)/100}}function je(e){const t=[],o=[],a=[];for(const i of e){for(const c of i.rolls)t.push(c.value);o.push(i.isStrike),a.push(i.isSpare)}const r=[];let n=0,s=0;for(let i=0;i<10;i+=1){const c=e[i];let d=0,h=0,p="";o[i]?(d=10+(t[n+1]??0)+(t[n+2]??0),h=10,i===9?p=c.rolls.map(u=>u.symbol).join(" "):p="X",n+=1):a[i]?(d=10+(t[n+2]??0),h=10,p=c.rolls.map(u=>u.symbol).join(""),n+=2):(d=(t[n]??0)+(t[n+1]??0),h=d,p=c.rolls.map(u=>u.symbol).join(""),n+=2),s+=d,r.push({frameNumber:i+1,pinsKnocked:h,scoreContribution:d,cumulativeScore:s,rollSymbols:p,isStrike:c.isStrike,isSpare:c.isSpare})}return r}const he="bowling_fortune_saved_games",le=1e4;function He(e,t,o,a){const r=J(),n={id:Je(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:We(e)};return r.games.unshift(n),r.games.length>le&&(r.games=r.games.slice(0,le)),W(r),n}function H(){return J().games}function Ye(e){const t=J();t.games=t.games.filter(o=>o.id!==e),W(t)}function Ue(){W({version:1,games:[]})}function ze(){const e=H(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function Ve(){const e=J();return JSON.stringify(e,null,2)}function _e(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return W(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function J(){try{const e=localStorage.getItem(he);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function W(e){try{localStorage.setItem(he,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function Je(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function We(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const r=pe(a);if(r.kind==="error")return;o+=z(r.frames)}return o}catch{return}}const de=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],ue=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],Ke=.001,ge=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
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
        ${ge.map((e,t)=>`
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
    <p>Build: 2025-10-18 07:17:12 CT</p>
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
`;const $=document.querySelector("#scores-input"),j=document.querySelector("#submit"),be=document.querySelector("#clear-btn"),O=document.querySelector("#example-btn"),I=document.querySelector("#example-dropdown"),A=document.querySelector("#feedback"),ye=document.querySelector("#save-btn"),$e=document.querySelector("#saved-games-btn"),Se=document.querySelector("#saved-count"),P=document.querySelector("#save-modal-overlay"),we=document.querySelector("#save-form"),V=document.querySelector("#save-description"),re=document.querySelector("#save-league"),xe=document.querySelector("#league-list"),_=document.querySelector("#save-date"),ke=document.querySelector("#save-cancel-btn"),Y=document.querySelector("#saved-games-sidebar"),K=document.querySelector("#sidebar-overlay"),Le=document.querySelector("#sidebar-close-btn"),Z=document.querySelector("#search-saved-games"),Me=document.querySelector("#export-btn"),Ce=document.querySelector("#import-btn"),N=document.querySelector("#import-file-input"),Xe=document.querySelector("#clear-all-btn"),R=document.querySelector("#saved-games-list"),Ae=document.querySelector("#sidebar-saved-count");if(!$||!j||!be||!O||!I||!A||!ye||!$e||!Se||!P||!we||!V||!re||!xe||!_||!ke||!Y||!K||!Le||!Z||!Me||!Ce||!N||!Xe||!R||!Ae)throw new Error("Failed to initialise UI elements");be.addEventListener("click",()=>{$.value="",A.innerHTML="",$.focus()});let q=!1;function Ze(){q=!q,I.classList.toggle("show",q),O.setAttribute("aria-expanded",q.toString()),I.setAttribute("aria-hidden",(!q).toString())}function ae(){q=!1,I.classList.remove("show"),O.setAttribute("aria-expanded","false"),I.setAttribute("aria-hidden","true")}O.addEventListener("click",e=>{e.stopPropagation(),Ze()});const Ee=I.querySelectorAll(".dropdown-item");Ee.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);$.value=ge[o].score,ae(),$.focus()})});document.addEventListener("click",e=>{const t=e.target;q&&!O.contains(t)&&!I.contains(t)&&ae()});I.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Ee),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});let te=0;function qe(){if(Math.random()<Ke){const t=Math.floor(Math.random()*ue.length);j.textContent=ue[t];return}j.textContent=de[te],te=(te+1)%de.length}qe();setInterval(qe,3e4);let Ie="";function ie(){if(!$.value.trim()){se("Please provide at least one game.",1,1);return}const e=$.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){se(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=pe(a);if(r.kind==="error"){st(r,o,e);return}const n=z(r.frames),s=Ne(r.frames);t.push({frames:r.frames,score:n,stats:s})}Ie=$.value,mt(t)}j.addEventListener("click",ie);$.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),ie())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(Y.classList.contains("show")){ee();return}if(P.classList.contains("show")){Q();return}if(q){ae(),O.focus();return}A.innerHTML&&(A.innerHTML="",$.focus())}});function U(){const t=H().length;Se.innerHTML=t>0?`&nbsp;(${t})`:"",Ae.innerHTML=t>0?`&nbsp;(${t})`:""}function Qe(){if(!$.value.trim()){x("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];_.value=e,V.value="",re.value="";const t=ze();xe.innerHTML=t.map(o=>`<option value="${o}">`).join(""),P.classList.add("show"),V.focus()}function Q(){P.classList.remove("show")}function et(){Z.value="",G(),Y.classList.add("show"),K.classList.add("show")}function ee(){Y.classList.remove("show"),K.classList.remove("show")}function G(){const e=Z.value.trim().toLowerCase();let t=H();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),r=(o.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),t.length===0){R.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}R.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,r=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",n=o.description||"(No description)",s=o.league?`🏆 ${o.league}`:"";return`
      <div class="saved-game-card" data-game-id="${o.id}">
        <div class="saved-game-info">
          <h3>${n}</h3>
          ${s?`<p class="saved-game-league">${s}</p>`:""}
          <p class="saved-game-meta">
            📅 ${o.date} | 🎳 ${a} | ${r}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${o.id}">Load</button>
          <button class="delete-btn" data-delete-id="${o.id}">Delete</button>
        </div>
      </div>
    `}).join(""),R.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&tt(a)})}),R.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&ot(a)})})}function tt(e){const o=H().find(a=>a.id===e);o&&($.value=o.scores,ee(),j.click(),x("Game loaded!"))}function ot(e){confirm("Delete this saved game?")&&(Ye(e),U(),G(),x("Game deleted"))}ye.addEventListener("click",Qe);$e.addEventListener("click",et);ke.addEventListener("click",Q);Le.addEventListener("click",ee);K.addEventListener("click",ee);Z.addEventListener("input",()=>{G()});P.addEventListener("click",e=>{e.target===P&&Q()});we.addEventListener("submit",e=>{e.preventDefault();const t=$.value.trim(),o=V.value.trim()||void 0,a=re.value.trim()||void 0;let r=_.value||void 0;if(r){const n=new Date(r),s=new Date;if(s.setHours(0,0,0,0),n>s){x("Date cannot be in the future"),_.focus();return}}try{He(t,o,a,r),Q(),U(),Y.classList.contains("show")&&G(),x("Game saved!")}catch(n){console.error("Failed to save game",n),x("Failed to save game")}});Xe.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(Ue(),U(),G(),x("All games deleted"))});Me.addEventListener("click",()=>{const e=H();if(e.length===0){x("No games to export");return}const t=Ve(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),x(`Exported ${e.length} game${e.length===1?"":"s"}`)});Ce.addEventListener("click",()=>{N.click()});N.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const r=a.target?.result,n=_e(r);n.success?(U(),G(),x(`Imported ${n.count} game${n.count===1?"":"s"}`)):x(n.error||"Import failed"),N.value=""},o.onerror=()=>{x("Failed to read file"),N.value=""},o.readAsText(t)});U();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);$.value=o,ie()}catch(o){console.error("Failed to decode scores from URL",o)}});function st(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,n=Te(o,t,e.column);se(r,a,e.column,n)}function Te(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function se(e,t,o,a){if(A.innerHTML="",A.className="error",A.textContent=e,$.focus(),typeof a=="number")$.setSelectionRange(a,a);else{const r=$.value.replace(/\r/g,"").split(`
`),n=Te(r,t-1,o);$.setSelectionRange(n,n)}}function nt(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,n=300,s={top:20,right:20,bottom:40,left:50},i=r-s.left-s.right,c=n-s.top-s.bottom,d=e.stats.min,h=e.stats.max,p=new Map(t.map(v=>[v.score,v])),u=[];for(let v=d;v<=h;v++){const g=p.get(v);u.push({score:v,count:g?.count??0,frequency:g?.frequency??0})}const y=Math.max(...u.map(v=>v.count)),k=Math.max(2,i/u.length),M=u.map((v,g)=>{const l=s.left+g*i/u.length,f=v.count/y*c,B=s.top+c-f,E=v.score===a;return`<rect
      x="${l}"
      y="${B}"
      width="${k}"
      height="${f}"
      fill="${E?"#fbbf24":"#60a5fa"}"
      opacity="${E?"1":"0.7"}"
    >
      <title>Score: ${v.score}
Count: ${v.count.toLocaleString()}
Frequency: ${(v.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),w=o-d,S=s.left+w*i/u.length+k/2,T=`
    <line x1="${S}" y1="${s.top}" x2="${S}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${S}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,X=5,C=Array.from({length:X+1},(v,g)=>{const l=Math.round(y/X*g),f=s.top+c-g*c/X;return`
      <line x1="${s.left-5}" y1="${f}" x2="${s.left}" y2="${f}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left-10}" y="${f+4}" text-anchor="end" font-size="11" fill="#94a3b8">${l.toLocaleString()}</text>
    `}).join(""),m=Math.min(10,Math.ceil((h-d)/10)),b=m===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:m+1},(v,g)=>{const l=Math.round(d+(h-d)/m*g),f=s.left+g*i/m;return`
        <line x1="${f}" y1="${s.top+c}" x2="${f}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${f}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${l}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${M}
      ${T}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+i}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${C}
      ${b}
      <text x="${s.left+i/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+c/2})">Count</text>
    </svg>
  `}function rt(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function at(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats;e.score-e.stats.median;let s=`${rt(o,r,e.score)} `;return Math.abs(t)<.5?s+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?s+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?s+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?s+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?s+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?s+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function Fe(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,n]of t)for(const s of e[o].stats.histogram){const i=r+s.score,c=n*s.count;a.set(i,(a.get(i)||0)+c)}t=a}return t}function it(e,t){const o=Fe(e),a=[];for(const[l,f]of o)a.push({score:l,count:f});a.sort((l,f)=>l.score-f.score);const r=600,n=300,s={top:20,right:20,bottom:40,left:50},i=r-s.left-s.right,c=n-s.top-s.bottom,d=a[0].score,h=a[a.length-1].score,p=new Map(a.map(l=>[l.score,l])),u=[];for(let l=d;l<=h;l++){const f=p.get(l);u.push({score:l,count:f?.count??0})}const y=Math.max(...u.map(l=>l.count)),k=Array.from(o.values()).reduce((l,f)=>l+f,0);let M=0,w=0;for(const l of a)if(M+=l.count,M>=k/2){w=l.score;break}const S=Math.max(2,i/u.length),T=u.map((l,f)=>{const B=s.left+f*i/u.length,E=l.count/y*c,De=s.top+c-E,ce=l.score===t;return`<rect
      x="${B}"
      y="${De}"
      width="${S}"
      height="${E}"
      fill="${ce?"#fbbf24":"#60a5fa"}"
      opacity="${ce?"1":"0.7"}"
    >
      <title>Series Score: ${l.score}
Combinations: ${l.count.toLocaleString()}</title>
    </rect>`}).join(""),X=w-d,C=s.left+X*i/u.length+S/2,m=`
    <line x1="${C}" y1="${s.top}" x2="${C}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${C}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,b="",v=Math.min(10,Math.ceil((h-d)/20)),g=v===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:v+1},(l,f)=>{const B=Math.round(d+(h-d)/v*f),E=s.left+f*i/v;return`
        <line x1="${E}" y1="${s.top+c}" x2="${E}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${E}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${B}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${T}
      ${m}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+i}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${b}
      ${g}
      <text x="${s.left+i/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function ct(e){if(e.length<2)return"";const t=e.reduce((l,f)=>l+f.score,0),o=Math.round(t/e.length*100)/100,a=Fe(e),r=[];for(const[l,f]of a)r.push({score:l,count:f});r.sort((l,f)=>l.score-f.score);const n=Array.from(a.values()).reduce((l,f)=>l+f,0),s=r[0].score,i=r[r.length-1].score;let c=0;for(const l of r)c+=l.score*l.count;const d=c/n;let h=0,p=0;for(const l of r)if(h+=l.count,h>=n/2){p=l.score;break}const u=r.filter(l=>l.score<=t).reduce((l,f)=>l+f.count,0),y=Math.round(u/n*100*100)/100;let k=0;for(const l of r)k+=Math.pow(l.score-d,2)*l.count;const M=Math.sqrt(k/n),w=M===0?0:(t-d)/M;let S=0;for(const l of r)S+=Math.pow((l.score-d)/M,3)*l.count;const T=M===0?0:S/n;let X=0;for(const l of r)l.count>X&&(X=l.count);const C=[];for(const l of r)l.count===X&&C.push(l.score);const m=t-p,b=m>=0?`+${m}`:`${m}`,v=C.length===1?C[0].toString():`${C.join(", ")} (multimodal)`;let g="";return Math.abs(w)<.5?g="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?g="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?g="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?g="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?g="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?g="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":g="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",y>=95?g+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":y>=75?g+=" You scored in the <strong>top quartile</strong> of possible combinations.":y<=5?g+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":y<=25&&(g+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${g}</p>
      </div>

      <div class="histogram-container">
        ${it(e,t)}
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
        <dd>${y}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${b}</dd>

        <dt>Minimum score:</dt>
        <dd>${s}</dd>

        <dt>Maximum score:</dt>
        <dd>${i}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(d*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${p}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(T*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${v}</dd>
      </dl>
    </article>
  `}function lt(){const e=btoa(Ie),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function dt(){const e=lt();navigator.clipboard.writeText(e).then(()=>{x("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),x("Failed to copy link")})}function x(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function ut(e){const a=[...je(e).slice(0,9)].sort((i,c)=>c.scoreContribution-i.scoreContribution),r=a.slice(0,3),n=a.slice(-3).reverse();function s(i,c){let d="";return i.isStrike?i.scoreContribution===30?d=`Strike with 2 more strikes for maximum ${i.scoreContribution} points`:i.scoreContribution>=20?d=`Strike with strong follow-ups for ${i.scoreContribution} points`:d=`Strike but weak follow-ups: only ${i.scoreContribution} points`:i.isSpare?i.scoreContribution>=20?d=`Spare with strike bonus for ${i.scoreContribution} points`:i.scoreContribution>=15?d=`Spare with decent bonus for ${i.scoreContribution} points`:d=`Spare with weak bonus: ${i.scoreContribution} points`:i.scoreContribution>=9?d=`Open frame with ${i.scoreContribution} pins`:i.scoreContribution>=5?d=`Open frame with ${i.scoreContribution} pins`:d=`Open frame with only ${i.scoreContribution} pins`,`
      <div class="scorecard-frame">
        <div class="frame-emoji">${c}</div>
        <div class="frame-rolls">${i.rollSymbols}</div>
        <div class="frame-score">${i.cumulativeScore}</div>
        <div class="frame-number">Frame ${i.frameNumber}</div>
        <div class="frame-explanation">${d}</div>
      </div>
    `}return`
    <div class="frame-impact-section">
      <h3>Frame Impact Analysis</h3>

      <div class="hero-frames">
        <h4>🔥 Hero Frames (Best Contributors)</h4>
        <div class="scorecard-frames">
          ${r.map(i=>s(i,"🔥")).join("")}
        </div>
      </div>

      <div class="villain-frames">
        <h4>⚠️ Villain Frames (Worst Contributors)</h4>
        <div class="scorecard-frames">
          ${n.map(i=>s(i,"⚠️")).join("")}
        </div>
      </div>
    </div>
  `}function mt(e){if(A.className="output",e.length===0){A.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((n,s)=>{const i=s+1,c=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,d=n.score-n.stats.median,h=d>=0?`+${d}`:`${d}`,p=at(n);return`
        <article class="result-card">
          <h2>Game ${i}</h2>
          <p><strong>Actual score:</strong> ${n.score}</p>

          <div class="narrative">
            <p>${p}</p>
          </div>

          <div class="histogram-container">
            ${nt(n)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          ${ut(n.frames)}

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${n.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${n.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${n.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${h}</dd>

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
      `}).join(""),a=ct(e);A.innerHTML=`
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
  `,A.querySelectorAll("[data-copy-link]").forEach(n=>{n.addEventListener("click",dt)})}
