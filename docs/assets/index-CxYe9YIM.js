(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Pe=new Set([" ","	",",",";"]),re=new Set("0123456789-".split("")),Ge=new Set("0123456789-X/".split(""));function fe(e){return Pe.has(e)}function F(e){const{line:o}=e;for(;e.index<o.length&&fe(o[e.index]);)e.index+=1;if(e.index>=o.length)return null;const t=e.index+1,a=o[e.index].toUpperCase();return e.index+=1,{char:a,column:t}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const o=Number.parseInt(e,10);if(Number.isNaN(o))throw new Error(`Invalid roll symbol '${e}'`);if(o<0||o>9)throw new Error(`Invalid roll value '${e}'`);return o}function pe(e){return e==="X"||re.has(e)}function oe(e){return Ge.has(e)}function M(e,o,t){return{symbol:e,value:o,column:t}}function he(e){const o=[],t={line:e,index:0},a=()=>{for(;t.index<e.length&&fe(e[t.index]);)t.index+=1};for(let s=0;s<9;s+=1){if(a(),t.index>=e.length)return{kind:"error",message:`Expected frame ${s+1}, but the line ended early`,column:e.length+1};const n=F(t);if(!n)return{kind:"error",message:`Expected frame ${s+1}, but found nothing`,column:e.length+1};const{char:c,column:i}=n;if(!pe(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${s+1}`,column:i};if(c==="X"){o.push({rolls:[M("X",10,i)],isStrike:!0,isSpare:!1});continue}const m=D(c),f=F(t);if(!f)return{kind:"error",message:`Frame ${s+1} is missing a second roll`,column:e.length+1};const{char:l,column:d}=f;if(l==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${s+1}`,column:d};if(l==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${s+1} requires the first roll to be less than 10`,column:d};const $=10-m;o.push({rolls:[M(c,m,i),M("/",$,d)],isStrike:!1,isSpare:!0});continue}if(!re.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${s+1}`,column:d};const p=D(l);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${s+1}`,column:d};o.push({rolls:[M(c,m,i),M(l,p,d)],isStrike:!1,isSpare:!1})}if(a(),t.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Ne(t,e);return r.kind==="error"?r:(o.push(r.frame),a(),t.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:t.index+1}:{kind:"success",frames:o})}function Ne(e,o){const t=F(e);if(!t)return{kind:"error",message:"Frame 10 is missing",column:o.length+1};const{char:a,column:r}=t;if(!pe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Oe(e,r);const s=D(a),n=F(e);if(!n)return{kind:"error",message:"Frame 10 is missing a second roll",column:o.length+1};const{char:c,column:i}=n;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:i};if(c==="/"){if(s>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:i};const f=10-s,l=F(e);if(!l)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:o.length+1};const{char:d,column:p}=l;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!oe(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:p};const $=d==="X"?10:D(d);return{kind:"success",frame:{rolls:[M(a,s,r),M("/",f,i),M(d,$,p)],isStrike:!1,isSpare:!0}}}if(!re.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:i};const m=D(c);return s+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:i}:{kind:"success",frame:{rolls:[M(a,s,r),M(c,m,i)],isStrike:!1,isSpare:!1}}}function Oe(e,o){const t=F(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:o};const{char:a,column:r}=t;if(!oe(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let s;a==="X"?s=10:s=D(a);const n=F(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:c,column:i}=n;if(!oe(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:i};let m;if(c==="X")m=10;else if(c==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:i};if(s>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:i};m=10-s}else if(m=D(c),a!=="X"&&s+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:i};return{kind:"success",frame:{rolls:[M("X",10,o),M(a,s,r),M(c,m,i)],isStrike:!0,isSpare:!1}}}function z(e){const o=[],t=[],a=[];for(const n of e){for(const c of n.rolls)o.push(c.value);t.push(n.isStrike),a.push(n.isSpare)}let r=0,s=0;for(let n=0;n<10;n+=1)t[n]?(r+=10+(o[s+1]??0)+(o[s+2]??0),s+=1):a[n]?(r+=10+(o[s+2]??0),s+=2):(r+=(o[s]??0)+(o[s+1]??0),s+=2);return r}function Re(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const o=e.slice(0,9),t=e[9],a=[];function r(s,n){if(n===1){a.push([...s,t]);return}for(let c=0;c<n;c++)r(s,n-1),n%2===0?[s[c],s[n-1]]=[s[n-1],s[c]]:[s[0],s[n-1]]=[s[n-1],s[0]]}return r(o,o.length),a}function je(e){const o=Re(e),t=o.map(h=>z(h)),a=z(e);t.sort((h,y)=>h-y);const r=t[0],s=t[t.length-1],c=t.reduce((h,y)=>h+y,0)/t.length,i=Math.floor(t.length/2),m=t.length%2===0?(t[i-1]+t[i])/2:t[i],f=new Map;for(const h of t)f.set(h,(f.get(h)||0)+1);let l=0;for(const h of f.values())h>l&&(l=h);const d=[];for(const[h,y]of f)y===l&&d.push(h);d.sort((h,y)=>h-y);const p=[];for(const[h,y]of f)p.push({score:h,count:y,frequency:y/t.length});p.sort((h,y)=>h.score-y.score);const $=t.filter(h=>h<=a).length,w=Math.round($/t.length*100*100)/100,x=t.reduce((h,y)=>h+Math.pow(y-c,2),0)/t.length,k=Math.sqrt(x),T=k===0?0:(a-c)/k,A=t.reduce((h,y)=>h+Math.pow((y-c)/k,3),0),X=k===0?0:A/t.length;return{min:r,max:s,mean:Math.round(c*100)/100,median:m,mode:d,permutationCount:o.length,histogram:p,actualPercentile:w,zScore:Math.round(T*100)/100,skewness:Math.round(X*100)/100,standardDeviation:Math.round(k*100)/100}}function se(e){const o=[],t=[],a=[];for(const c of e){for(const i of c.rolls)o.push(i.value);t.push(c.isStrike),a.push(c.isSpare)}const r=[];let s=0,n=0;for(let c=0;c<10;c+=1){const i=e[c];let m=0,f=0,l="";t[c]?(m=10+(o[s+1]??0)+(o[s+2]??0),f=10,c===9?l=i.rolls.map(d=>d.symbol).join(" "):l="X",s+=1):a[c]?(m=10+(o[s+2]??0),f=10,l=i.rolls.map(d=>d.symbol).join(""),s+=2):(m=(o[s]??0)+(o[s+1]??0),f=m,l=i.rolls.map(d=>d.symbol).join(""),s+=2),n+=m,r.push({frameNumber:c+1,pinsKnocked:f,scoreContribution:m,cumulativeScore:n,rollSymbols:l,isStrike:i.isStrike,isSpare:i.isSpare})}return r}function He(e){if(e.length!==10)return[];const o=e.slice(0,9),t=e[9],a=se(e),r=[];for(let s=0;s<9;s++){const n=o[s],c=a[s].scoreContribution,i=[];for(let d=0;d<9;d++){const p=[...o];[p[s],p[d]]=[p[d],p[s]];const $=[...p,t],x=se($)[d].scoreContribution;i.push(x)}const m=i.reduce((d,p)=>d+p,0)/i.length,f=c-m;let l="";if(n.isStrike)f>5?l=`Lucky placement! Strike got strong bonuses (${Math.round(f)} pins above average for this position)`:f<-5?l=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(f))} pins below average)`:l=`Strike in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else if(n.isSpare)f>3?l=`Great timing! Spare got a strong bonus ball (${Math.round(f)} pins above average)`:f<-3?l=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(f))} pins below average)`:l=`Spare in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else{const d=n.rolls.reduce((p,$)=>p+$.value,0);Math.abs(f)<=.5?l=`Open frame (${d} pins) - position doesn't matter much`:l=`Open frame (${d} pins) - minimal positional impact`}r.push({frameNumber:s+1,actualContribution:c,averageContribution:Math.round(m*10)/10,positionBenefit:Math.round(f*10)/10,rollSymbols:a[s].rollSymbols,isStrike:n.isStrike,isSpare:n.isSpare,explanation:l})}return r}const ge="bowling_fortune_saved_games",de=1e4;function Ue(e,o,t,a){const r=J(),s={id:Ke(),scores:e,description:o,league:t,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(n=>n.trim()).length,totalScore:We(e)};return r.games.unshift(s),r.games.length>de&&(r.games=r.games.slice(0,de)),K(r),s}function H(){return J().games}function Ye(e){const o=J();o.games=o.games.filter(t=>t.id!==e),K(o)}function ze(){K({version:1,games:[]})}function _e(){const e=H(),o=new Set;for(const t of e)t.league&&t.league.trim()&&o.add(t.league.trim());return Array.from(o).sort()}function Ve(){const e=J();return JSON.stringify(e,null,2)}function Je(e){try{const o=JSON.parse(e);if(!o.version||!Array.isArray(o.games))return{success:!1,count:0,error:"Invalid file format"};for(const t of o.games)if(!t.id||!t.scores||typeof t.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return K(o),{success:!0,count:o.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function J(){try{const e=localStorage.getItem(ge);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function K(e){try{localStorage.setItem(ge,JSON.stringify(e))}catch(o){throw o instanceof DOMException&&o.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",o),o}}function Ke(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function We(e){try{const o=e.trim().split(`
`).filter(a=>a.trim());let t=0;for(const a of o){const r=he(a);if(r.kind==="error")return;t+=z(r.frames)}return t}catch{return}}const ue=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],me=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],Ze=.001,ve=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
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
        ${ve.map((e,o)=>`
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
    <p>Build: 2025-10-18 07:32:12 CT</p>
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
`;const S=document.querySelector("#scores-input"),j=document.querySelector("#submit"),ye=document.querySelector("#clear-btn"),P=document.querySelector("#example-btn"),q=document.querySelector("#example-dropdown"),C=document.querySelector("#feedback"),$e=document.querySelector("#save-btn"),Se=document.querySelector("#saved-games-btn"),xe=document.querySelector("#saved-count"),B=document.querySelector("#save-modal-overlay"),we=document.querySelector("#save-form"),_=document.querySelector("#save-description"),ae=document.querySelector("#save-league"),ke=document.querySelector("#league-list"),V=document.querySelector("#save-date"),Le=document.querySelector("#save-cancel-btn"),U=document.querySelector("#saved-games-sidebar"),W=document.querySelector("#sidebar-overlay"),Me=document.querySelector("#sidebar-close-btn"),Z=document.querySelector("#search-saved-games"),Xe=document.querySelector("#export-btn"),Ae=document.querySelector("#import-btn"),R=document.querySelector("#import-file-input"),Ce=document.querySelector("#clear-all-btn"),O=document.querySelector("#saved-games-list"),Ee=document.querySelector("#sidebar-saved-count");if(!S||!j||!ye||!P||!q||!C||!$e||!Se||!xe||!B||!we||!_||!ae||!ke||!V||!Le||!U||!W||!Me||!Z||!Xe||!Ae||!R||!Ce||!O||!Ee)throw new Error("Failed to initialise UI elements");ye.addEventListener("click",()=>{S.value="",C.innerHTML="",S.focus()});let I=!1;function Qe(){I=!I,q.classList.toggle("show",I),P.setAttribute("aria-expanded",I.toString()),q.setAttribute("aria-hidden",(!I).toString())}function ie(){I=!1,q.classList.remove("show"),P.setAttribute("aria-expanded","false"),q.setAttribute("aria-hidden","true")}P.addEventListener("click",e=>{e.stopPropagation(),Qe()});const Ie=q.querySelectorAll(".dropdown-item");Ie.forEach(e=>{e.addEventListener("click",o=>{o.stopPropagation();const t=parseInt(e.getAttribute("data-example-index")||"0",10);S.value=ve[t].score,ie(),S.focus()})});document.addEventListener("click",e=>{const o=e.target;I&&!P.contains(o)&&!q.contains(o)&&ie()});q.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const o=Array.from(Ie),t=o.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=t<o.length-1?t+1:0:a=t>0?t-1:o.length-1,o[a]?.focus()}});let te=0;function qe(){if(Math.random()<Ze){const o=Math.floor(Math.random()*me.length);j.textContent=me[o];return}j.textContent=ue[te],te=(te+1)%ue.length}qe();setInterval(qe,3e4);let Te="";function ce(){if(!S.value.trim()){ne("Please provide at least one game.",1,1);return}const e=S.value.replace(/\r/g,"").split(`
`),o=[];for(let t=0;t<e.length;t+=1){const a=e[t];if(!a.trim()){ne(`Game ${t+1} is empty. Each line must contain exactly ten frames.`,t+1,1);return}const r=he(a);if(r.kind==="error"){nt(r,t,e);return}const s=z(r.frames),n=je(r.frames);o.push({frames:r.frames,score:s,stats:n})}Te=S.value,ft(o)}j.addEventListener("click",ce);S.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),ce())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(U.classList.contains("show")){ee();return}if(B.classList.contains("show")){Q();return}if(I){ie(),P.focus();return}C.innerHTML&&(C.innerHTML="",S.focus())}});function Y(){const o=H().length;xe.innerHTML=o>0?`&nbsp;(${o})`:"",Ee.innerHTML=o>0?`&nbsp;(${o})`:""}function et(){if(!S.value.trim()){L("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];V.value=e,_.value="",ae.value="";const o=_e();ke.innerHTML=o.map(t=>`<option value="${t}">`).join(""),B.classList.add("show"),_.focus()}function Q(){B.classList.remove("show")}function tt(){Z.value="",G(),U.classList.add("show"),W.classList.add("show")}function ee(){U.classList.remove("show"),W.classList.remove("show")}function G(){const e=Z.value.trim().toLowerCase();let o=H();if(e&&(o=o.filter(t=>{const a=(t.description||"").toLowerCase(),r=(t.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),o.length===0){O.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}O.innerHTML=o.map(t=>{const a=t.gameCount===1?"1 game":`${t.gameCount} games`,r=t.totalScore!==void 0?`🎯 ${t.totalScore}`:"⚠️ Invalid",s=t.description||"(No description)",n=t.league?`🏆 ${t.league}`:"";return`
      <div class="saved-game-card" data-game-id="${t.id}">
        <div class="saved-game-info">
          <h3>${s}</h3>
          ${n?`<p class="saved-game-league">${n}</p>`:""}
          <p class="saved-game-meta">
            📅 ${t.date} | 🎳 ${a} | ${r}
          </p>
        </div>
        <div class="saved-game-actions">
          <button class="load-btn" data-load-id="${t.id}">Load</button>
          <button class="delete-btn" data-delete-id="${t.id}">Delete</button>
        </div>
      </div>
    `}).join(""),O.querySelectorAll("[data-load-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-load-id");a&&ot(a)})}),O.querySelectorAll("[data-delete-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-delete-id");a&&st(a)})})}function ot(e){const t=H().find(a=>a.id===e);t&&(S.value=t.scores,ee(),j.click(),L("Game loaded!"))}function st(e){confirm("Delete this saved game?")&&(Ye(e),Y(),G(),L("Game deleted"))}$e.addEventListener("click",et);Se.addEventListener("click",tt);Le.addEventListener("click",Q);Me.addEventListener("click",ee);W.addEventListener("click",ee);Z.addEventListener("input",()=>{G()});B.addEventListener("click",e=>{e.target===B&&Q()});we.addEventListener("submit",e=>{e.preventDefault();const o=S.value.trim(),t=_.value.trim()||void 0,a=ae.value.trim()||void 0;let r=V.value||void 0;if(r){const s=new Date(r),n=new Date;if(n.setHours(0,0,0,0),s>n){L("Date cannot be in the future"),V.focus();return}}try{Ue(o,t,a,r),Q(),Y(),U.classList.contains("show")&&G(),L("Game saved!")}catch(s){console.error("Failed to save game",s),L("Failed to save game")}});Ce.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(ze(),Y(),G(),L("All games deleted"))});Xe.addEventListener("click",()=>{const e=H();if(e.length===0){L("No games to export");return}const o=Ve(),t=new Blob([o],{type:"application/json"}),a=URL.createObjectURL(t),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),L(`Exported ${e.length} game${e.length===1?"":"s"}`)});Ae.addEventListener("click",()=>{R.click()});R.addEventListener("change",e=>{const o=e.target.files?.[0];if(!o)return;const t=new FileReader;t.onload=a=>{const r=a.target?.result,s=Je(r);s.success?(Y(),G(),L(`Imported ${s.count} game${s.count===1?"":"s"}`)):L(s.error||"Import failed"),R.value=""},t.onerror=()=>{L("Failed to read file"),R.value=""},t.readAsText(o)});Y();window.addEventListener("DOMContentLoaded",()=>{const o=new URLSearchParams(window.location.search).get("scores");if(o)try{const t=atob(o);S.value=t,ce()}catch(t){console.error("Failed to decode scores from URL",t)}});function nt(e,o,t){const a=o+1,r=`Row ${a}, column ${e.column}: ${e.message}`,s=Fe(t,o,e.column);ne(r,a,e.column,s)}function Fe(e,o,t){let a=0;for(let r=0;r<o;r+=1)a+=e[r].length+1;return a+(t-1)}function ne(e,o,t,a){if(C.innerHTML="",C.className="error",C.textContent=e,S.focus(),typeof a=="number")S.setSelectionRange(a,a);else{const r=S.value.replace(/\r/g,"").split(`
`),s=Fe(r,o-1,t);S.setSelectionRange(s,s)}}function rt(e){const{histogram:o,median:t}=e.stats,a=e.score,r=600,s=300,n={top:20,right:20,bottom:40,left:50},c=r-n.left-n.right,i=s-n.top-n.bottom,m=e.stats.min,f=e.stats.max,l=new Map(o.map(b=>[b.score,b])),d=[];for(let b=m;b<=f;b++){const v=l.get(b);d.push({score:b,count:v?.count??0,frequency:v?.frequency??0})}const p=Math.max(...d.map(b=>b.count)),$=Math.max(2,c/d.length),w=d.map((b,v)=>{const u=n.left+v*c/d.length,g=b.count/p*i,N=n.top+i-g,E=b.score===a;return`<rect
      x="${u}"
      y="${N}"
      width="${$}"
      height="${g}"
      fill="${E?"#fbbf24":"#60a5fa"}"
      opacity="${E?"1":"0.7"}"
    >
      <title>Score: ${b.score}
Count: ${b.count.toLocaleString()}
Frequency: ${(b.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=t-m,k=n.left+x*c/d.length+$/2,T=`
    <line x1="${k}" y1="${n.top}" x2="${k}" y2="${n.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${k}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,X=Array.from({length:A+1},(b,v)=>{const u=Math.round(p/A*v),g=n.top+i-v*i/A;return`
      <line x1="${n.left-5}" y1="${g}" x2="${n.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${u.toLocaleString()}</text>
    `}).join(""),h=Math.min(10,Math.ceil((f-m)/10)),y=h===0?`
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:h+1},(b,v)=>{const u=Math.round(m+(f-m)/h*v),g=n.left+v*c/h;return`
        <line x1="${g}" y1="${n.top+i}" x2="${g}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${g}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${u}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${w}
      ${T}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left+c}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${X}
      ${y}
      <text x="${n.left+c/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${n.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${n.top+i/2})">Count</text>
    </svg>
  `}function at(e,o,t){return e>=95?"🏆":t===o?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function it(e){const{zScore:o,actualPercentile:t,skewness:a,median:r}=e.stats;e.score-e.stats.median;let n=`${at(t,r,e.score)} `;return Math.abs(o)<.5?n+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":o>=2?n+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":o<=-2?n+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":o>1?n+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":o<-1?n+="Your score was <strong>notably below average</strong> — your frame order worked against you.":o>0?n+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":n+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",t>=95?n+=" You scored in the <strong>top 5%</strong> of all possible orderings.":t>=75?n+=" You scored in the <strong>top quartile</strong> of possible orderings.":t<=5?n+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":t<=25&&(n+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),n}function De(e){let o=new Map;for(const t of e[0].stats.histogram)o.set(t.score,t.count);for(let t=1;t<e.length;t++){const a=new Map;for(const[r,s]of o)for(const n of e[t].stats.histogram){const c=r+n.score,i=s*n.count;a.set(c,(a.get(c)||0)+i)}o=a}return o}function ct(e,o){const t=De(e),a=[];for(const[u,g]of t)a.push({score:u,count:g});a.sort((u,g)=>u.score-g.score);const r=600,s=300,n={top:20,right:20,bottom:40,left:50},c=r-n.left-n.right,i=s-n.top-n.bottom,m=a[0].score,f=a[a.length-1].score,l=new Map(a.map(u=>[u.score,u])),d=[];for(let u=m;u<=f;u++){const g=l.get(u);d.push({score:u,count:g?.count??0})}const p=Math.max(...d.map(u=>u.count)),$=Array.from(t.values()).reduce((u,g)=>u+g,0);let w=0,x=0;for(const u of a)if(w+=u.count,w>=$/2){x=u.score;break}const k=Math.max(2,c/d.length),T=d.map((u,g)=>{const N=n.left+g*c/d.length,E=u.count/p*i,Be=n.top+i-E,le=u.score===o;return`<rect
      x="${N}"
      y="${Be}"
      width="${k}"
      height="${E}"
      fill="${le?"#fbbf24":"#60a5fa"}"
      opacity="${le?"1":"0.7"}"
    >
      <title>Series Score: ${u.score}
Combinations: ${u.count.toLocaleString()}</title>
    </rect>`}).join(""),A=x-m,X=n.left+A*c/d.length+k/2,h=`
    <line x1="${X}" y1="${n.top}" x2="${X}" y2="${n.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${X}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,y="",b=Math.min(10,Math.ceil((f-m)/20)),v=b===0?`
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:b+1},(u,g)=>{const N=Math.round(m+(f-m)/b*g),E=n.left+g*c/b;return`
        <line x1="${E}" y1="${n.top+i}" x2="${E}" y2="${n.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${E}" y="${n.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${N}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${T}
      ${h}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+i}" x2="${n.left+c}" y2="${n.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${v}
      <text x="${n.left+c/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function lt(e){if(e.length<2)return"";const o=e.reduce((u,g)=>u+g.score,0),t=Math.round(o/e.length*100)/100,a=De(e),r=[];for(const[u,g]of a)r.push({score:u,count:g});r.sort((u,g)=>u.score-g.score);const s=Array.from(a.values()).reduce((u,g)=>u+g,0),n=r[0].score,c=r[r.length-1].score;let i=0;for(const u of r)i+=u.score*u.count;const m=i/s;let f=0,l=0;for(const u of r)if(f+=u.count,f>=s/2){l=u.score;break}const d=r.filter(u=>u.score<=o).reduce((u,g)=>u+g.count,0),p=Math.round(d/s*100*100)/100;let $=0;for(const u of r)$+=Math.pow(u.score-m,2)*u.count;const w=Math.sqrt($/s),x=w===0?0:(o-m)/w;let k=0;for(const u of r)k+=Math.pow((u.score-m)/w,3)*u.count;const T=w===0?0:k/s;let A=0;for(const u of r)u.count>A&&(A=u.count);const X=[];for(const u of r)u.count===A&&X.push(u.score);const h=o-l,y=h>=0?`+${h}`:`${h}`,b=X.length===1?X[0].toString():`${X.join(", ")} (multimodal)`;let v="";return Math.abs(x)<.5?v="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":x>=2?v="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":x<=-2?v="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":x>=1?v="Across this series, you had <strong>notably favorable</strong> frame sequences.":x<=-1?v="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":x>0?v="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":v="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",p>=95?v+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":p>=75?v+=" You scored in the <strong>top quartile</strong> of possible combinations.":p<=5?v+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":p<=25&&(v+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${v}</p>
      </div>

      <div class="histogram-container">
        ${ct(e,o)}
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
        <dd>${p}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(x*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${y}</dd>

        <dt>Minimum score:</dt>
        <dd>${n}</dd>

        <dt>Maximum score:</dt>
        <dd>${c}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(m*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${l}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(T*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${b}</dd>
      </dl>
    </article>
  `}function dt(){const e=btoa(Te),o=new URL(window.location.href);return o.search=`?scores=${encodeURIComponent(e)}`,o.toString()}function ut(){const e=dt();navigator.clipboard.writeText(e).then(()=>{L("Link copied!")}).catch(o=>{console.error("Failed to copy link",o),L("Failed to copy link")})}function L(e){const o=document.querySelector(".toast");o&&o.remove();const t=document.createElement("div");t.className="toast",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove()},300)},2e3)}function mt(e){const o=se(e),t=He(e),a=3,r=-3,s=t.filter(l=>l.positionBenefit>=a).sort((l,d)=>d.positionBenefit-l.positionBenefit),n=t.filter(l=>l.positionBenefit<=r).sort((l,d)=>l.positionBenefit-d.positionBenefit);function c(){return`
      <div class="complete-scorecard">
        <div class="scorecard-row">
          ${o.map(l=>{const d=t.find(w=>w.frameNumber===l.frameNumber);let p="",$="";return d&&(d.positionBenefit>=a?(p="🍀",$="lucky-frame"):d.positionBenefit<=r&&(p="💔",$="unlucky-frame")),`
              <div class="scorecard-full-frame ${l.frameNumber===10?"tenth-frame":""} ${$}">
                <div class="frame-number-label">${l.frameNumber}</div>
                ${p?`<div class="frame-emoji-indicator">${p}</div>`:""}
                <div class="frame-rolls-display">${l.rollSymbols}</div>
                <div class="frame-cumulative-score">${l.cumulativeScore}</div>
              </div>
            `}).join("")}
        </div>
      </div>
    `}const i=s.length>0?`
    <div class="impact-list">
      <h4>🍀 Luckiest Frames (${a}+ pins above average)</h4>
      <ul class="impact-bullets">
        ${s.map(l=>{const d=l.positionBenefit>=0?"+":"";return`<li><strong>Frame ${l.frameNumber} (${l.rollSymbols})</strong>: ${l.explanation} <span class="benefit-badge positive">${d}${l.positionBenefit}</span></li>`}).join("")}
      </ul>
    </div>
  `:"",m=n.length>0?`
    <div class="impact-list">
      <h4>💔 Unluckiest Frames (${Math.abs(r)}+ pins below average)</h4>
      <ul class="impact-bullets">
        ${n.map(l=>{const d=l.positionBenefit>=0?"+":"";return`<li><strong>Frame ${l.frameNumber} (${l.rollSymbols})</strong>: ${l.explanation} <span class="benefit-badge negative">${d}${l.positionBenefit}</span></li>`}).join("")}
      </ul>
    </div>
  `:"",f=s.length===0&&n.length===0?`
    <div class="neutral-frames">
      <p class="section-explanation">
        No frames had significant positional impact. All frames scored close to their positional average!
      </p>
    </div>
  `:"";return`
    <div class="frame-impact-section">
      <h3>Frame Impact Analysis</h3>

      ${c()}

      ${i}
      ${m}
      ${f}
    </div>
  `}function ft(e){if(C.className="output",e.length===0){C.innerHTML="";return}const o=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,t=e.map((s,n)=>{const c=n+1,i=s.stats.mode.length===1?s.stats.mode[0].toString():`${s.stats.mode.join(", ")} (multimodal)`,m=s.score-s.stats.median,f=m>=0?`+${m}`:`${m}`,l=it(s);return`
        <article class="result-card">
          <h2>Game ${c}</h2>
          <p><strong>Actual score:</strong> ${s.score}</p>

          <div class="narrative">
            <p>${l}</p>
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
            <dd>${f}</dd>

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
        ${o}
      </div>
      ${t}
      ${a}
      <div class="results-footer">
        ${o}
      </div>
    </section>
  `,C.querySelectorAll("[data-copy-link]").forEach(s=>{s.addEventListener("click",ut)})}
