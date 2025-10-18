(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const Pe=new Set([" ","	",",",";"]),re=new Set("0123456789-".split("")),Oe=new Set("0123456789-X/".split(""));function me(e){return Pe.has(e)}function F(e){const{line:t}=e;for(;e.index<t.length&&me(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function fe(e){return e==="X"||re.has(e)}function oe(e){return Oe.has(e)}function L(e,t,o){return{symbol:e,value:t,column:o}}function pe(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&me(e[o.index]);)o.index+=1};for(let r=0;r<9;r+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${r+1}, but the line ended early`,column:e.length+1};const s=F(o);if(!s)return{kind:"error",message:`Expected frame ${r+1}, but found nothing`,column:e.length+1};const{char:c,column:i}=s;if(!fe(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${r+1}`,column:i};if(c==="X"){t.push({rolls:[L("X",10,i)],isStrike:!0,isSpare:!1});continue}const d=D(c),u=F(o);if(!u)return{kind:"error",message:`Frame ${r+1} is missing a second roll`,column:e.length+1};const{char:h,column:m}=u;if(h==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${r+1}`,column:m};if(h==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${r+1} requires the first roll to be less than 10`,column:m};const k=10-d;t.push({rolls:[L(c,d,i),L("/",k,m)],isStrike:!1,isSpare:!0});continue}if(!re.has(h))return{kind:"error",message:`Invalid roll '${h}' in frame ${r+1}`,column:m};const y=D(h);if(d+y>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${r+1}`,column:m};t.push({rolls:[L(c,d,i),L(h,y,m)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const n=Ge(o,e);return n.kind==="error"?n:(t.push(n.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function Ge(e,t){const o=F(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:n}=o;if(!fe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:n};if(a==="X")return Be(e,n);const r=D(a),s=F(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:c,column:i}=s;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:i};if(c==="/"){if(r>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:i};const u=10-r,h=F(e);if(!h)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:m,column:y}=h;if(m==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:y};if(!oe(m))return{kind:"error",message:`Invalid fill ball '${m}' in frame 10`,column:y};const k=m==="X"?10:D(m);return{kind:"success",frame:{rolls:[L(a,r,n),L("/",u,i),L(m,k,y)],isStrike:!1,isSpare:!0}}}if(!re.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:i};const d=D(c);return r+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:i}:{kind:"success",frame:{rolls:[L(a,r,n),L(c,d,i)],isStrike:!1,isSpare:!1}}}function Be(e,t){const o=F(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:n}=o;if(!oe(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:n};let r;a==="X"?r=10:r=D(a);const s=F(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:c,column:i}=s;if(!oe(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:i};let d;if(c==="X")d=10;else if(c==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:i};if(r>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:i};d=10-r}else if(d=D(c),a!=="X"&&r+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:i};return{kind:"success",frame:{rolls:[L("X",10,t),L(a,r,n),L(c,d,i)],isStrike:!0,isSpare:!1}}}function z(e){const t=[],o=[],a=[];for(const s of e){for(const c of s.rolls)t.push(c.value);o.push(s.isStrike),a.push(s.isSpare)}let n=0,r=0;for(let s=0;s<10;s+=1)o[s]?(n+=10+(t[r+1]??0)+(t[r+2]??0),r+=1):a[s]?(n+=10+(t[r+2]??0),r+=2):(n+=(t[r]??0)+(t[r+1]??0),r+=2);return n}function Ne(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function n(r,s){if(s===1){a.push([...r,o]);return}for(let c=0;c<s;c++)n(r,s-1),s%2===0?[r[c],r[s-1]]=[r[s-1],r[c]]:[r[0],r[s-1]]=[r[s-1],r[0]]}return n(t,t.length),a}function Re(e){const t=Ne(e),o=t.map(f=>z(f)),a=z(e);o.sort((f,b)=>f-b);const n=o[0],r=o[o.length-1],c=o.reduce((f,b)=>f+b,0)/o.length,i=Math.floor(o.length/2),d=o.length%2===0?(o[i-1]+o[i])/2:o[i],u=new Map;for(const f of o)u.set(f,(u.get(f)||0)+1);let h=0;for(const f of u.values())f>h&&(h=f);const m=[];for(const[f,b]of u)b===h&&m.push(f);m.sort((f,b)=>f-b);const y=[];for(const[f,b]of u)y.push({score:f,count:b,frequency:b/o.length});y.sort((f,b)=>f.score-b.score);const k=o.filter(f=>f<=a).length,M=Math.round(k/o.length*100*100)/100,w=o.reduce((f,b)=>f+Math.pow(b-c,2),0)/o.length,S=Math.sqrt(w),T=S===0?0:(a-c)/S,X=o.reduce((f,b)=>f+Math.pow((b-c)/S,3),0),C=S===0?0:X/o.length;return{min:n,max:r,mean:Math.round(c*100)/100,median:d,mode:m,permutationCount:t.length,histogram:y,actualPercentile:M,zScore:Math.round(T*100)/100,skewness:Math.round(C*100)/100,standardDeviation:Math.round(S*100)/100}}function je(e){const t=[],o=[],a=[];for(const c of e){for(const i of c.rolls)t.push(i.value);o.push(c.isStrike),a.push(c.isSpare)}const n=[];let r=0,s=0;for(let c=0;c<10;c+=1){const i=e[c];let d=0,u=0,h="";o[c]?(d=10+(t[r+1]??0)+(t[r+2]??0),u=10,c===9?h=i.rolls.map(m=>m.symbol).join(" "):h="X",r+=1):a[c]?(d=10+(t[r+2]??0),u=10,h=i.rolls.map(m=>m.symbol).join(""),r+=2):(d=(t[r]??0)+(t[r+1]??0),u=d,h=i.rolls.map(m=>m.symbol).join(""),r+=2),s+=d,n.push({frameNumber:c+1,pinsKnocked:u,scoreContribution:d,cumulativeScore:s,rollSymbols:h,isStrike:i.isStrike,isSpare:i.isSpare})}return n}const he="bowling_fortune_saved_games",le=1e4;function He(e,t,o,a){const n=J(),r={id:Je(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:We(e)};return n.games.unshift(r),n.games.length>le&&(n.games=n.games.slice(0,le)),W(n),r}function H(){return J().games}function Ye(e){const t=J();t.games=t.games.filter(o=>o.id!==e),W(t)}function Ue(){W({version:1,games:[]})}function ze(){const e=H(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function Ve(){const e=J();return JSON.stringify(e,null,2)}function _e(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return W(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function J(){try{const e=localStorage.getItem(he);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function W(e){try{localStorage.setItem(he,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function Je(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function We(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const n=pe(a);if(n.kind==="error")return;o+=z(n.frames)}return o}catch{return}}const de=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],ue=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],Ke=.001,ge=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
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
    <p>Build: 2025-10-18 07:18:42 CT</p>
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
`;const $=document.querySelector("#scores-input"),j=document.querySelector("#submit"),be=document.querySelector("#clear-btn"),O=document.querySelector("#example-btn"),I=document.querySelector("#example-dropdown"),A=document.querySelector("#feedback"),ye=document.querySelector("#save-btn"),$e=document.querySelector("#saved-games-btn"),Se=document.querySelector("#saved-count"),P=document.querySelector("#save-modal-overlay"),we=document.querySelector("#save-form"),V=document.querySelector("#save-description"),ne=document.querySelector("#save-league"),xe=document.querySelector("#league-list"),_=document.querySelector("#save-date"),ke=document.querySelector("#save-cancel-btn"),Y=document.querySelector("#saved-games-sidebar"),K=document.querySelector("#sidebar-overlay"),Le=document.querySelector("#sidebar-close-btn"),Z=document.querySelector("#search-saved-games"),Me=document.querySelector("#export-btn"),Ce=document.querySelector("#import-btn"),R=document.querySelector("#import-file-input"),Xe=document.querySelector("#clear-all-btn"),N=document.querySelector("#saved-games-list"),Ae=document.querySelector("#sidebar-saved-count");if(!$||!j||!be||!O||!I||!A||!ye||!$e||!Se||!P||!we||!V||!ne||!xe||!_||!ke||!Y||!K||!Le||!Z||!Me||!Ce||!R||!Xe||!N||!Ae)throw new Error("Failed to initialise UI elements");be.addEventListener("click",()=>{$.value="",A.innerHTML="",$.focus()});let q=!1;function Ze(){q=!q,I.classList.toggle("show",q),O.setAttribute("aria-expanded",q.toString()),I.setAttribute("aria-hidden",(!q).toString())}function ae(){q=!1,I.classList.remove("show"),O.setAttribute("aria-expanded","false"),I.setAttribute("aria-hidden","true")}O.addEventListener("click",e=>{e.stopPropagation(),Ze()});const Ee=I.querySelectorAll(".dropdown-item");Ee.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);$.value=ge[o].score,ae(),$.focus()})});document.addEventListener("click",e=>{const t=e.target;q&&!O.contains(t)&&!I.contains(t)&&ae()});I.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Ee),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});let te=0;function qe(){if(Math.random()<Ke){const t=Math.floor(Math.random()*ue.length);j.textContent=ue[t];return}j.textContent=de[te],te=(te+1)%de.length}qe();setInterval(qe,3e4);let Ie="";function ie(){if(!$.value.trim()){se("Please provide at least one game.",1,1);return}const e=$.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){se(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const n=pe(a);if(n.kind==="error"){st(n,o,e);return}const r=z(n.frames),s=Re(n.frames);t.push({frames:n.frames,score:r,stats:s})}Ie=$.value,mt(t)}j.addEventListener("click",ie);$.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),ie())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(Y.classList.contains("show")){ee();return}if(P.classList.contains("show")){Q();return}if(q){ae(),O.focus();return}A.innerHTML&&(A.innerHTML="",$.focus())}});function U(){const t=H().length;Se.innerHTML=t>0?`&nbsp;(${t})`:"",Ae.innerHTML=t>0?`&nbsp;(${t})`:""}function Qe(){if(!$.value.trim()){x("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];_.value=e,V.value="",ne.value="";const t=ze();xe.innerHTML=t.map(o=>`<option value="${o}">`).join(""),P.classList.add("show"),V.focus()}function Q(){P.classList.remove("show")}function et(){Z.value="",G(),Y.classList.add("show"),K.classList.add("show")}function ee(){Y.classList.remove("show"),K.classList.remove("show")}function G(){const e=Z.value.trim().toLowerCase();let t=H();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),n=(o.league||"").toLowerCase();return a.includes(e)||n.includes(e)})),t.length===0){N.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}N.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,n=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",r=o.description||"(No description)",s=o.league?`🏆 ${o.league}`:"";return`
      <div class="saved-game-card" data-game-id="${o.id}">
        <div class="saved-game-info">
          <h3>${r}</h3>
          ${s?`<p class="saved-game-league">${s}</p>`:""}
          <p class="saved-game-meta">
            📅 ${o.date} | 🎳 ${a} | ${n}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${o.id}">Load</button>
          <button class="delete-btn" data-delete-id="${o.id}">Delete</button>
        </div>
      </div>
    `}).join(""),N.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&tt(a)})}),N.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&ot(a)})})}function tt(e){const o=H().find(a=>a.id===e);o&&($.value=o.scores,ee(),j.click(),x("Game loaded!"))}function ot(e){confirm("Delete this saved game?")&&(Ye(e),U(),G(),x("Game deleted"))}ye.addEventListener("click",Qe);$e.addEventListener("click",et);ke.addEventListener("click",Q);Le.addEventListener("click",ee);K.addEventListener("click",ee);Z.addEventListener("input",()=>{G()});P.addEventListener("click",e=>{e.target===P&&Q()});we.addEventListener("submit",e=>{e.preventDefault();const t=$.value.trim(),o=V.value.trim()||void 0,a=ne.value.trim()||void 0;let n=_.value||void 0;if(n){const r=new Date(n),s=new Date;if(s.setHours(0,0,0,0),r>s){x("Date cannot be in the future"),_.focus();return}}try{He(t,o,a,n),Q(),U(),Y.classList.contains("show")&&G(),x("Game saved!")}catch(r){console.error("Failed to save game",r),x("Failed to save game")}});Xe.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(Ue(),U(),G(),x("All games deleted"))});Me.addEventListener("click",()=>{const e=H();if(e.length===0){x("No games to export");return}const t=Ve(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),n=document.createElement("a");n.href=a,n.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a),x(`Exported ${e.length} game${e.length===1?"":"s"}`)});Ce.addEventListener("click",()=>{R.click()});R.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const n=a.target?.result,r=_e(n);r.success?(U(),G(),x(`Imported ${r.count} game${r.count===1?"":"s"}`)):x(r.error||"Import failed"),R.value=""},o.onerror=()=>{x("Failed to read file"),R.value=""},o.readAsText(t)});U();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);$.value=o,ie()}catch(o){console.error("Failed to decode scores from URL",o)}});function st(e,t,o){const a=t+1,n=`Row ${a}, column ${e.column}: ${e.message}`,r=Te(o,t,e.column);se(n,a,e.column,r)}function Te(e,t,o){let a=0;for(let n=0;n<t;n+=1)a+=e[n].length+1;return a+(o-1)}function se(e,t,o,a){if(A.innerHTML="",A.className="error",A.textContent=e,$.focus(),typeof a=="number")$.setSelectionRange(a,a);else{const n=$.value.replace(/\r/g,"").split(`
`),r=Te(n,t-1,o);$.setSelectionRange(r,r)}}function rt(e){const{histogram:t,median:o}=e.stats,a=e.score,n=600,r=300,s={top:20,right:20,bottom:40,left:50},c=n-s.left-s.right,i=r-s.top-s.bottom,d=e.stats.min,u=e.stats.max,h=new Map(t.map(v=>[v.score,v])),m=[];for(let v=d;v<=u;v++){const g=h.get(v);m.push({score:v,count:g?.count??0,frequency:g?.frequency??0})}const y=Math.max(...m.map(v=>v.count)),k=Math.max(2,c/m.length),M=m.map((v,g)=>{const l=s.left+g*c/m.length,p=v.count/y*i,B=s.top+i-p,E=v.score===a;return`<rect
      x="${l}"
      y="${B}"
      width="${k}"
      height="${p}"
      fill="${E?"#fbbf24":"#60a5fa"}"
      opacity="${E?"1":"0.7"}"
    >
      <title>Score: ${v.score}
Count: ${v.count.toLocaleString()}
Frequency: ${(v.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),w=o-d,S=s.left+w*c/m.length+k/2,T=`
    <line x1="${S}" y1="${s.top}" x2="${S}" y2="${s.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${S}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,X=5,C=Array.from({length:X+1},(v,g)=>{const l=Math.round(y/X*g),p=s.top+i-g*i/X;return`
      <line x1="${s.left-5}" y1="${p}" x2="${s.left}" y2="${p}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left-10}" y="${p+4}" text-anchor="end" font-size="11" fill="#94a3b8">${l.toLocaleString()}</text>
    `}).join(""),f=Math.min(10,Math.ceil((u-d)/10)),b=f===0?`
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:f+1},(v,g)=>{const l=Math.round(d+(u-d)/f*g),p=s.left+g*c/f;return`
        <line x1="${p}" y1="${s.top+i}" x2="${p}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${p}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${l}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${n} ${r}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${M}
      ${T}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left+c}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${C}
      ${b}
      <text x="${s.left+c/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+i/2})">Count</text>
    </svg>
  `}function nt(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function at(e){const{zScore:t,actualPercentile:o,skewness:a,median:n}=e.stats;e.score-e.stats.median;let s=`${nt(o,n,e.score)} `;return Math.abs(t)<.5?s+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?s+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?s+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?s+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?s+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?s+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function Fe(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[n,r]of t)for(const s of e[o].stats.histogram){const c=n+s.score,i=r*s.count;a.set(c,(a.get(c)||0)+i)}t=a}return t}function it(e,t){const o=Fe(e),a=[];for(const[l,p]of o)a.push({score:l,count:p});a.sort((l,p)=>l.score-p.score);const n=600,r=300,s={top:20,right:20,bottom:40,left:50},c=n-s.left-s.right,i=r-s.top-s.bottom,d=a[0].score,u=a[a.length-1].score,h=new Map(a.map(l=>[l.score,l])),m=[];for(let l=d;l<=u;l++){const p=h.get(l);m.push({score:l,count:p?.count??0})}const y=Math.max(...m.map(l=>l.count)),k=Array.from(o.values()).reduce((l,p)=>l+p,0);let M=0,w=0;for(const l of a)if(M+=l.count,M>=k/2){w=l.score;break}const S=Math.max(2,c/m.length),T=m.map((l,p)=>{const B=s.left+p*c/m.length,E=l.count/y*i,De=s.top+i-E,ce=l.score===t;return`<rect
      x="${B}"
      y="${De}"
      width="${S}"
      height="${E}"
      fill="${ce?"#fbbf24":"#60a5fa"}"
      opacity="${ce?"1":"0.7"}"
    >
      <title>Series Score: ${l.score}
Combinations: ${l.count.toLocaleString()}</title>
    </rect>`}).join(""),X=w-d,C=s.left+X*c/m.length+S/2,f=`
    <line x1="${C}" y1="${s.top}" x2="${C}" y2="${s.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${C}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,b="",v=Math.min(10,Math.ceil((u-d)/20)),g=v===0?`
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:v+1},(l,p)=>{const B=Math.round(d+(u-d)/v*p),E=s.left+p*c/v;return`
        <line x1="${E}" y1="${s.top+i}" x2="${E}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${E}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${B}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${n} ${r}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${T}
      ${f}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left+c}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${b}
      ${g}
      <text x="${s.left+c/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function ct(e){if(e.length<2)return"";const t=e.reduce((l,p)=>l+p.score,0),o=Math.round(t/e.length*100)/100,a=Fe(e),n=[];for(const[l,p]of a)n.push({score:l,count:p});n.sort((l,p)=>l.score-p.score);const r=Array.from(a.values()).reduce((l,p)=>l+p,0),s=n[0].score,c=n[n.length-1].score;let i=0;for(const l of n)i+=l.score*l.count;const d=i/r;let u=0,h=0;for(const l of n)if(u+=l.count,u>=r/2){h=l.score;break}const m=n.filter(l=>l.score<=t).reduce((l,p)=>l+p.count,0),y=Math.round(m/r*100*100)/100;let k=0;for(const l of n)k+=Math.pow(l.score-d,2)*l.count;const M=Math.sqrt(k/r),w=M===0?0:(t-d)/M;let S=0;for(const l of n)S+=Math.pow((l.score-d)/M,3)*l.count;const T=M===0?0:S/r;let X=0;for(const l of n)l.count>X&&(X=l.count);const C=[];for(const l of n)l.count===X&&C.push(l.score);const f=t-h,b=f>=0?`+${f}`:`${f}`,v=C.length===1?C[0].toString():`${C.join(", ")} (multimodal)`;let g="";return Math.abs(w)<.5?g="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?g="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?g="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?g="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?g="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?g="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":g="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",y>=95?g+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":y>=75?g+=" You scored in the <strong>top quartile</strong> of possible combinations.":y<=5?g+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":y<=25&&(g+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
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
        <dd>${c}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(d*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${h}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(T*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${v}</dd>
      </dl>
    </article>
  `}function lt(){const e=btoa(Ie),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function dt(){const e=lt();navigator.clipboard.writeText(e).then(()=>{x("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),x("Failed to copy link")})}function x(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function ut(e){const t=je(e),a=[...t.slice(0,9)].sort((i,d)=>d.scoreContribution-i.scoreContribution),n=a.slice(0,3),r=a.slice(-3).reverse();function s(){return`
      <div class="complete-scorecard">
        <div class="scorecard-row">
          ${t.map(i=>`
            <div class="scorecard-full-frame ${i.frameNumber===10?"tenth-frame":""}">
              <div class="frame-number-label">${i.frameNumber}</div>
              <div class="frame-rolls-display">${i.rollSymbols}</div>
              <div class="frame-cumulative-score">${i.cumulativeScore}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function c(i,d){let u="";return i.isStrike?i.scoreContribution===30?u=`Strike with 2 more strikes for maximum ${i.scoreContribution} points`:i.scoreContribution>=20?u=`Strike with strong follow-ups for ${i.scoreContribution} points`:u=`Strike but weak follow-ups: only ${i.scoreContribution} points`:i.isSpare?i.scoreContribution>=20?u=`Spare with strike bonus for ${i.scoreContribution} points`:i.scoreContribution>=15?u=`Spare with decent bonus for ${i.scoreContribution} points`:u=`Spare with weak bonus: ${i.scoreContribution} points`:i.scoreContribution>=9?u=`Open frame with ${i.scoreContribution} pins`:i.scoreContribution>=5?u=`Open frame with ${i.scoreContribution} pins`:u=`Open frame with only ${i.scoreContribution} pins`,`
      <div class="scorecard-frame">
        <div class="frame-emoji">${d}</div>
        <div class="frame-rolls">${i.rollSymbols}</div>
        <div class="frame-score">${i.cumulativeScore}</div>
        <div class="frame-number">Frame ${i.frameNumber}</div>
        <div class="frame-explanation">${u}</div>
      </div>
    `}return`
    <div class="frame-impact-section">
      <h3>Frame Impact Analysis</h3>

      ${s()}

      <div class="hero-frames">
        <h4>🔥 Hero Frames (Best Contributors)</h4>
        <div class="scorecard-frames">
          ${n.map(i=>c(i,"🔥")).join("")}
        </div>
      </div>

      <div class="villain-frames">
        <h4>⚠️ Villain Frames (Worst Contributors)</h4>
        <div class="scorecard-frames">
          ${r.map(i=>c(i,"⚠️")).join("")}
        </div>
      </div>
    </div>
  `}function mt(e){if(A.className="output",e.length===0){A.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((r,s)=>{const c=s+1,i=r.stats.mode.length===1?r.stats.mode[0].toString():`${r.stats.mode.join(", ")} (multimodal)`,d=r.score-r.stats.median,u=d>=0?`+${d}`:`${d}`,h=at(r);return`
        <article class="result-card">
          <h2>Game ${c}</h2>
          <p><strong>Actual score:</strong> ${r.score}</p>

          <div class="narrative">
            <p>${h}</p>
          </div>

          <div class="histogram-container">
            ${rt(r)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          ${ut(r.frames)}

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${r.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${r.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${r.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${u}</dd>

            <dt>Minimum score:</dt>
            <dd>${r.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${r.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${r.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${r.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${r.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${r.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${i}</dd>
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
  `,A.querySelectorAll("[data-copy-link]").forEach(r=>{r.addEventListener("click",dt)})}
