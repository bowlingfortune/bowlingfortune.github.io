(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const Pe=new Set([" ","	",",",";"]),re=new Set("0123456789-".split("")),Ge=new Set("0123456789-X/".split(""));function fe(e){return Pe.has(e)}function F(e){const{line:t}=e;for(;e.index<t.length&&fe(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function pe(e){return e==="X"||re.has(e)}function oe(e){return Ge.has(e)}function M(e,t,o){return{symbol:e,value:t,column:o}}function he(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&fe(e[o.index]);)o.index+=1};for(let s=0;s<9;s+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${s+1}, but the line ended early`,column:e.length+1};const n=F(o);if(!n)return{kind:"error",message:`Expected frame ${s+1}, but found nothing`,column:e.length+1};const{char:c,column:i}=n;if(!pe(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${s+1}`,column:i};if(c==="X"){t.push({rolls:[M("X",10,i)],isStrike:!0,isSpare:!1});continue}const d=D(c),m=F(o);if(!m)return{kind:"error",message:`Frame ${s+1} is missing a second roll`,column:e.length+1};const{char:f,column:u}=m;if(f==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${s+1}`,column:u};if(f==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${s+1} requires the first roll to be less than 10`,column:u};const S=10-d;t.push({rolls:[M(c,d,i),M("/",S,u)],isStrike:!1,isSpare:!0});continue}if(!re.has(f))return{kind:"error",message:`Invalid roll '${f}' in frame ${s+1}`,column:u};const h=D(f);if(d+h>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${s+1}`,column:u};t.push({rolls:[M(c,d,i),M(f,h,u)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Oe(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function Oe(e,t){const o=F(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!pe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Ne(e,r);const s=D(a),n=F(e);if(!n)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:c,column:i}=n;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:i};if(c==="/"){if(s>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:i};const m=10-s,f=F(e);if(!f)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:u,column:h}=f;if(u==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:h};if(!oe(u))return{kind:"error",message:`Invalid fill ball '${u}' in frame 10`,column:h};const S=u==="X"?10:D(u);return{kind:"success",frame:{rolls:[M(a,s,r),M("/",m,i),M(u,S,h)],isStrike:!1,isSpare:!0}}}if(!re.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:i};const d=D(c);return s+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:i}:{kind:"success",frame:{rolls:[M(a,s,r),M(c,d,i)],isStrike:!1,isSpare:!1}}}function Ne(e,t){const o=F(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!oe(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let s;a==="X"?s=10:s=D(a);const n=F(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:c,column:i}=n;if(!oe(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:i};let d;if(c==="X")d=10;else if(c==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:i};if(s>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:i};d=10-s}else if(d=D(c),a!=="X"&&s+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:i};return{kind:"success",frame:{rolls:[M("X",10,t),M(a,s,r),M(c,d,i)],isStrike:!0,isSpare:!1}}}function z(e){const t=[],o=[],a=[];for(const n of e){for(const c of n.rolls)t.push(c.value);o.push(n.isStrike),a.push(n.isSpare)}let r=0,s=0;for(let n=0;n<10;n+=1)o[n]?(r+=10+(t[s+1]??0)+(t[s+2]??0),s+=1):a[n]?(r+=10+(t[s+2]??0),s+=2):(r+=(t[s]??0)+(t[s+1]??0),s+=2);return r}function Re(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(s,n){if(n===1){a.push([...s,o]);return}for(let c=0;c<n;c++)r(s,n-1),n%2===0?[s[c],s[n-1]]=[s[n-1],s[c]]:[s[0],s[n-1]]=[s[n-1],s[0]]}return r(t,t.length),a}function je(e){const t=Re(e),o=t.map(p=>z(p)),a=z(e);o.sort((p,y)=>p-y);const r=o[0],s=o[o.length-1],c=o.reduce((p,y)=>p+y,0)/o.length,i=Math.floor(o.length/2),d=o.length%2===0?(o[i-1]+o[i])/2:o[i],m=new Map;for(const p of o)m.set(p,(m.get(p)||0)+1);let f=0;for(const p of m.values())p>f&&(f=p);const u=[];for(const[p,y]of m)y===f&&u.push(p);u.sort((p,y)=>p-y);const h=[];for(const[p,y]of m)h.push({score:p,count:y,frequency:y/o.length});h.sort((p,y)=>p.score-y.score);const S=o.filter(p=>p<=a).length,L=Math.round(S/o.length*100*100)/100,x=o.reduce((p,y)=>p+Math.pow(y-c,2),0)/o.length,w=Math.sqrt(x),T=w===0?0:(a-c)/w,A=o.reduce((p,y)=>p+Math.pow((y-c)/w,3),0),X=w===0?0:A/o.length;return{min:r,max:s,mean:Math.round(c*100)/100,median:d,mode:u,permutationCount:t.length,histogram:h,actualPercentile:L,zScore:Math.round(T*100)/100,skewness:Math.round(X*100)/100,standardDeviation:Math.round(w*100)/100}}function se(e){const t=[],o=[],a=[];for(const c of e){for(const i of c.rolls)t.push(i.value);o.push(c.isStrike),a.push(c.isSpare)}const r=[];let s=0,n=0;for(let c=0;c<10;c+=1){const i=e[c];let d=0,m=0,f="";o[c]?(d=10+(t[s+1]??0)+(t[s+2]??0),m=10,c===9?f=i.rolls.map(u=>u.symbol).join(" "):f="X",s+=1):a[c]?(d=10+(t[s+2]??0),m=10,f=i.rolls.map(u=>u.symbol).join(""),s+=2):(d=(t[s]??0)+(t[s+1]??0),m=d,f=i.rolls.map(u=>u.symbol).join(""),s+=2),n+=d,r.push({frameNumber:c+1,pinsKnocked:m,scoreContribution:d,cumulativeScore:n,rollSymbols:f,isStrike:i.isStrike,isSpare:i.isSpare})}return r}function He(e){if(e.length!==10)return[];const t=e.slice(0,9),o=e[9],a=se(e),r=[];for(let s=0;s<9;s++){const n=t[s],c=a[s].scoreContribution,i=[];for(let u=0;u<9;u++){const h=[...t];[h[s],h[u]]=[h[u],h[s]];const S=[...h,o],x=se(S)[u].scoreContribution;i.push(x)}const d=i.reduce((u,h)=>u+h,0)/i.length,m=c-d;let f="";if(n.isStrike)m>5?f=`Lucky placement! Strike got strong bonuses (${Math.round(m)} pins above average for this position)`:m<-5?f=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(m))} pins below average)`:f=`Strike in neutral position (within ${Math.round(Math.abs(m))} pins of average)`;else if(n.isSpare)m>3?f=`Great timing! Spare got a strong bonus ball (${Math.round(m)} pins above average)`:m<-3?f=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(m))} pins below average)`:f=`Spare in neutral position (within ${Math.round(Math.abs(m))} pins of average)`;else{const u=n.rolls.reduce((h,S)=>h+S.value,0);Math.abs(m)<=.5?f=`Open frame (${u} pins) - position doesn't matter much`:f=`Open frame (${u} pins) - minimal positional impact`}r.push({frameNumber:s+1,actualContribution:c,averageContribution:Math.round(d*10)/10,positionBenefit:Math.round(m*10)/10,rollSymbols:a[s].rollSymbols,isStrike:n.isStrike,isSpare:n.isSpare,explanation:f})}return r}const ge="bowling_fortune_saved_games",de=1e4;function Ue(e,t,o,a){const r=J(),s={id:We(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(n=>n.trim()).length,totalScore:Ke(e)};return r.games.unshift(s),r.games.length>de&&(r.games=r.games.slice(0,de)),W(r),s}function H(){return J().games}function Ye(e){const t=J();t.games=t.games.filter(o=>o.id!==e),W(t)}function ze(){W({version:1,games:[]})}function Ve(){const e=H(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function _e(){const e=J();return JSON.stringify(e,null,2)}function Je(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return W(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function J(){try{const e=localStorage.getItem(ge);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function W(e){try{localStorage.setItem(ge,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function We(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function Ke(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const r=he(a);if(r.kind==="error")return;o+=z(r.frames)}return o}catch{return}}const ue=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],me=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],Ze=.001,ve=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],be=document.querySelector("#app");if(!be)throw new Error("Failed to find app container");be.innerHTML=`
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
        ${ve.map((e,t)=>`
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
    <p>Build: 2025-10-18 07:22:55 CT</p>
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
`;const $=document.querySelector("#scores-input"),j=document.querySelector("#submit"),ye=document.querySelector("#clear-btn"),P=document.querySelector("#example-btn"),q=document.querySelector("#example-dropdown"),C=document.querySelector("#feedback"),$e=document.querySelector("#save-btn"),Se=document.querySelector("#saved-games-btn"),xe=document.querySelector("#saved-count"),B=document.querySelector("#save-modal-overlay"),we=document.querySelector("#save-form"),V=document.querySelector("#save-description"),ae=document.querySelector("#save-league"),ke=document.querySelector("#league-list"),_=document.querySelector("#save-date"),Le=document.querySelector("#save-cancel-btn"),U=document.querySelector("#saved-games-sidebar"),K=document.querySelector("#sidebar-overlay"),Me=document.querySelector("#sidebar-close-btn"),Z=document.querySelector("#search-saved-games"),Xe=document.querySelector("#export-btn"),Ae=document.querySelector("#import-btn"),R=document.querySelector("#import-file-input"),Ce=document.querySelector("#clear-all-btn"),N=document.querySelector("#saved-games-list"),Ee=document.querySelector("#sidebar-saved-count");if(!$||!j||!ye||!P||!q||!C||!$e||!Se||!xe||!B||!we||!V||!ae||!ke||!_||!Le||!U||!K||!Me||!Z||!Xe||!Ae||!R||!Ce||!N||!Ee)throw new Error("Failed to initialise UI elements");ye.addEventListener("click",()=>{$.value="",C.innerHTML="",$.focus()});let I=!1;function Qe(){I=!I,q.classList.toggle("show",I),P.setAttribute("aria-expanded",I.toString()),q.setAttribute("aria-hidden",(!I).toString())}function ie(){I=!1,q.classList.remove("show"),P.setAttribute("aria-expanded","false"),q.setAttribute("aria-hidden","true")}P.addEventListener("click",e=>{e.stopPropagation(),Qe()});const Ie=q.querySelectorAll(".dropdown-item");Ie.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);$.value=ve[o].score,ie(),$.focus()})});document.addEventListener("click",e=>{const t=e.target;I&&!P.contains(t)&&!q.contains(t)&&ie()});q.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Ie),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});let te=0;function qe(){if(Math.random()<Ze){const t=Math.floor(Math.random()*me.length);j.textContent=me[t];return}j.textContent=ue[te],te=(te+1)%ue.length}qe();setInterval(qe,3e4);let Te="";function ce(){if(!$.value.trim()){ne("Please provide at least one game.",1,1);return}const e=$.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){ne(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=he(a);if(r.kind==="error"){nt(r,o,e);return}const s=z(r.frames),n=je(r.frames);t.push({frames:r.frames,score:s,stats:n})}Te=$.value,ft(t)}j.addEventListener("click",ce);$.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),ce())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(U.classList.contains("show")){ee();return}if(B.classList.contains("show")){Q();return}if(I){ie(),P.focus();return}C.innerHTML&&(C.innerHTML="",$.focus())}});function Y(){const t=H().length;xe.innerHTML=t>0?`&nbsp;(${t})`:"",Ee.innerHTML=t>0?`&nbsp;(${t})`:""}function et(){if(!$.value.trim()){k("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];_.value=e,V.value="",ae.value="";const t=Ve();ke.innerHTML=t.map(o=>`<option value="${o}">`).join(""),B.classList.add("show"),V.focus()}function Q(){B.classList.remove("show")}function tt(){Z.value="",G(),U.classList.add("show"),K.classList.add("show")}function ee(){U.classList.remove("show"),K.classList.remove("show")}function G(){const e=Z.value.trim().toLowerCase();let t=H();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),r=(o.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),t.length===0){N.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}N.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,r=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",s=o.description||"(No description)",n=o.league?`🏆 ${o.league}`:"";return`
      <div class="saved-game-card" data-game-id="${o.id}">
        <div class="saved-game-info">
          <h3>${s}</h3>
          ${n?`<p class="saved-game-league">${n}</p>`:""}
          <p class="saved-game-meta">
            📅 ${o.date} | 🎳 ${a} | ${r}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${o.id}">Load</button>
          <button class="delete-btn" data-delete-id="${o.id}">Delete</button>
        </div>
      </div>
    `}).join(""),N.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&ot(a)})}),N.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&st(a)})})}function ot(e){const o=H().find(a=>a.id===e);o&&($.value=o.scores,ee(),j.click(),k("Game loaded!"))}function st(e){confirm("Delete this saved game?")&&(Ye(e),Y(),G(),k("Game deleted"))}$e.addEventListener("click",et);Se.addEventListener("click",tt);Le.addEventListener("click",Q);Me.addEventListener("click",ee);K.addEventListener("click",ee);Z.addEventListener("input",()=>{G()});B.addEventListener("click",e=>{e.target===B&&Q()});we.addEventListener("submit",e=>{e.preventDefault();const t=$.value.trim(),o=V.value.trim()||void 0,a=ae.value.trim()||void 0;let r=_.value||void 0;if(r){const s=new Date(r),n=new Date;if(n.setHours(0,0,0,0),s>n){k("Date cannot be in the future"),_.focus();return}}try{Ue(t,o,a,r),Q(),Y(),U.classList.contains("show")&&G(),k("Game saved!")}catch(s){console.error("Failed to save game",s),k("Failed to save game")}});Ce.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(ze(),Y(),G(),k("All games deleted"))});Xe.addEventListener("click",()=>{const e=H();if(e.length===0){k("No games to export");return}const t=_e(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),k(`Exported ${e.length} game${e.length===1?"":"s"}`)});Ae.addEventListener("click",()=>{R.click()});R.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const r=a.target?.result,s=Je(r);s.success?(Y(),G(),k(`Imported ${s.count} game${s.count===1?"":"s"}`)):k(s.error||"Import failed"),R.value=""},o.onerror=()=>{k("Failed to read file"),R.value=""},o.readAsText(t)});Y();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);$.value=o,ce()}catch(o){console.error("Failed to decode scores from URL",o)}});function nt(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,s=Fe(o,t,e.column);ne(r,a,e.column,s)}function Fe(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function ne(e,t,o,a){if(C.innerHTML="",C.className="error",C.textContent=e,$.focus(),typeof a=="number")$.setSelectionRange(a,a);else{const r=$.value.replace(/\r/g,"").split(`
`),s=Fe(r,t-1,o);$.setSelectionRange(s,s)}}function rt(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,s=300,n={top:20,right:20,bottom:40,left:50},c=r-n.left-n.right,i=s-n.top-n.bottom,d=e.stats.min,m=e.stats.max,f=new Map(t.map(b=>[b.score,b])),u=[];for(let b=d;b<=m;b++){const v=f.get(b);u.push({score:b,count:v?.count??0,frequency:v?.frequency??0})}const h=Math.max(...u.map(b=>b.count)),S=Math.max(2,c/u.length),L=u.map((b,v)=>{const l=n.left+v*c/u.length,g=b.count/h*i,O=n.top+i-g,E=b.score===a;return`<rect
      x="${l}"
      y="${O}"
      width="${S}"
      height="${g}"
      fill="${E?"#fbbf24":"#60a5fa"}"
      opacity="${E?"1":"0.7"}"
    >
      <title>Score: ${b.score}
Count: ${b.count.toLocaleString()}
Frequency: ${(b.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=o-d,w=n.left+x*c/u.length+S/2,T=`
    <line x1="${w}" y1="${n.top}" x2="${w}" y2="${n.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${w}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,X=Array.from({length:A+1},(b,v)=>{const l=Math.round(h/A*v),g=n.top+i-v*i/A;return`
      <line x1="${n.left-5}" y1="${g}" x2="${n.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${l.toLocaleString()}</text>
    `}).join(""),p=Math.min(10,Math.ceil((m-d)/10)),y=p===0?`
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:p+1},(b,v)=>{const l=Math.round(d+(m-d)/p*v),g=n.left+v*c/p;return`
        <line x1="${g}" y1="${n.top+i}" x2="${g}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${g}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${l}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${L}
      ${T}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left+c}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${X}
      ${y}
      <text x="${n.left+c/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${n.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${n.top+i/2})">Count</text>
    </svg>
  `}function at(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function it(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats;e.score-e.stats.median;let n=`${at(o,r,e.score)} `;return Math.abs(t)<.5?n+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?n+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?n+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?n+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?n+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?n+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":n+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?n+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?n+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?n+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(n+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),n}function De(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,s]of t)for(const n of e[o].stats.histogram){const c=r+n.score,i=s*n.count;a.set(c,(a.get(c)||0)+i)}t=a}return t}function ct(e,t){const o=De(e),a=[];for(const[l,g]of o)a.push({score:l,count:g});a.sort((l,g)=>l.score-g.score);const r=600,s=300,n={top:20,right:20,bottom:40,left:50},c=r-n.left-n.right,i=s-n.top-n.bottom,d=a[0].score,m=a[a.length-1].score,f=new Map(a.map(l=>[l.score,l])),u=[];for(let l=d;l<=m;l++){const g=f.get(l);u.push({score:l,count:g?.count??0})}const h=Math.max(...u.map(l=>l.count)),S=Array.from(o.values()).reduce((l,g)=>l+g,0);let L=0,x=0;for(const l of a)if(L+=l.count,L>=S/2){x=l.score;break}const w=Math.max(2,c/u.length),T=u.map((l,g)=>{const O=n.left+g*c/u.length,E=l.count/h*i,Be=n.top+i-E,le=l.score===t;return`<rect
      x="${O}"
      y="${Be}"
      width="${w}"
      height="${E}"
      fill="${le?"#fbbf24":"#60a5fa"}"
      opacity="${le?"1":"0.7"}"
    >
      <title>Series Score: ${l.score}
Combinations: ${l.count.toLocaleString()}</title>
    </rect>`}).join(""),A=x-d,X=n.left+A*c/u.length+w/2,p=`
    <line x1="${X}" y1="${n.top}" x2="${X}" y2="${n.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${X}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,y="",b=Math.min(10,Math.ceil((m-d)/20)),v=b===0?`
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:b+1},(l,g)=>{const O=Math.round(d+(m-d)/b*g),E=n.left+g*c/b;return`
        <line x1="${E}" y1="${n.top+i}" x2="${E}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${E}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${O}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${T}
      ${p}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left+c}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${v}
      <text x="${n.left+c/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function lt(e){if(e.length<2)return"";const t=e.reduce((l,g)=>l+g.score,0),o=Math.round(t/e.length*100)/100,a=De(e),r=[];for(const[l,g]of a)r.push({score:l,count:g});r.sort((l,g)=>l.score-g.score);const s=Array.from(a.values()).reduce((l,g)=>l+g,0),n=r[0].score,c=r[r.length-1].score;let i=0;for(const l of r)i+=l.score*l.count;const d=i/s;let m=0,f=0;for(const l of r)if(m+=l.count,m>=s/2){f=l.score;break}const u=r.filter(l=>l.score<=t).reduce((l,g)=>l+g.count,0),h=Math.round(u/s*100*100)/100;let S=0;for(const l of r)S+=Math.pow(l.score-d,2)*l.count;const L=Math.sqrt(S/s),x=L===0?0:(t-d)/L;let w=0;for(const l of r)w+=Math.pow((l.score-d)/L,3)*l.count;const T=L===0?0:w/s;let A=0;for(const l of r)l.count>A&&(A=l.count);const X=[];for(const l of r)l.count===A&&X.push(l.score);const p=t-f,y=p>=0?`+${p}`:`${p}`,b=X.length===1?X[0].toString():`${X.join(", ")} (multimodal)`;let v="";return Math.abs(x)<.5?v="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":x>=2?v="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":x<=-2?v="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":x>=1?v="Across this series, you had <strong>notably favorable</strong> frame sequences.":x<=-1?v="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":x>0?v="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":v="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",h>=95?v+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":h>=75?v+=" You scored in the <strong>top quartile</strong> of possible combinations.":h<=5?v+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":h<=25&&(v+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${v}</p>
      </div>

      <div class="histogram-container">
        ${ct(e,t)}
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
        <dd>${h}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(x*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${y}</dd>

        <dt>Minimum score:</dt>
        <dd>${n}</dd>

        <dt>Maximum score:</dt>
        <dd>${c}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(d*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${f}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(L*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(T*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${b}</dd>
      </dl>
    </article>
  `}function dt(){const e=btoa(Te),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function ut(){const e=dt();navigator.clipboard.writeText(e).then(()=>{k("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),k("Failed to copy link")})}function k(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function mt(e){const t=se(e),a=[...He(e)].sort((i,d)=>d.positionBenefit-i.positionBenefit),r=a.slice(0,3),s=a.slice(-3).reverse();function n(){return`
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
    `}function c(i,d){const m=i.positionBenefit>=0?"+":"",u=t.find(h=>h.frameNumber===i.frameNumber)?.cumulativeScore||0;return`
      <div class="scorecard-frame">
        <div class="frame-emoji">${d}</div>
        <div class="frame-rolls">${i.rollSymbols}</div>
        <div class="frame-score">${u}</div>
        <div class="frame-benefit ${i.positionBenefit>=0?"positive":"negative"}">${m}${i.positionBenefit}</div>
        <div class="frame-number">Frame ${i.frameNumber}</div>
        <div class="frame-explanation">${i.explanation}</div>
      </div>
    `}return`
    <div class="frame-impact-section">
      <h3>Frame Impact Analysis</h3>

      ${n()}

      <div class="hero-frames">
        <h4>🍀 Luckiest Frames (Best Positional Benefit)</h4>
        <p class="section-explanation">These frames scored more than average due to favorable positioning in the game order</p>
        <div class="scorecard-frames">
          ${r.map(i=>c(i,"🍀")).join("")}
        </div>
      </div>

      <div class="villain-frames">
        <h4>💔 Unluckiest Frames (Worst Positional Benefit)</h4>
        <p class="section-explanation">These frames scored less than average due to unfavorable positioning in the game order</p>
        <div class="scorecard-frames">
          ${s.map(i=>c(i,"💔")).join("")}
        </div>
      </div>
    </div>
  `}function ft(e){if(C.className="output",e.length===0){C.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((s,n)=>{const c=n+1,i=s.stats.mode.length===1?s.stats.mode[0].toString():`${s.stats.mode.join(", ")} (multimodal)`,d=s.score-s.stats.median,m=d>=0?`+${d}`:`${d}`,f=it(s);return`
        <article class="result-card">
          <h2>Game ${c}</h2>
          <p><strong>Actual score:</strong> ${s.score}</p>

          <div class="narrative">
            <p>${f}</p>
          </div>

          <div class="histogram-container">
            ${rt(s)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          ${mt(s.frames)}

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${s.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${s.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${s.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${m}</dd>

            <dt>Minimum score:</dt>
            <dd>${s.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${s.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${s.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${s.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${s.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${s.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${i}</dd>
          </dl>
        </article>
      `}).join(""),a=lt(e);C.innerHTML=`
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
  `,C.querySelectorAll("[data-copy-link]").forEach(s=>{s.addEventListener("click",ut)})}
