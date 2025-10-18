(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const Pe=new Set([" ","	",",",";"]),re=new Set("0123456789-".split("")),Ge=new Set("0123456789-X/".split(""));function fe(e){return Pe.has(e)}function F(e){const{line:t}=e;for(;e.index<t.length&&fe(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function pe(e){return e==="X"||re.has(e)}function oe(e){return Ge.has(e)}function M(e,t,o){return{symbol:e,value:t,column:o}}function he(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&fe(e[o.index]);)o.index+=1};for(let s=0;s<9;s+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${s+1}, but the line ended early`,column:e.length+1};const n=F(o);if(!n)return{kind:"error",message:`Expected frame ${s+1}, but found nothing`,column:e.length+1};const{char:l,column:c}=n;if(!pe(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${s+1}`,column:c};if(l==="X"){t.push({rolls:[M("X",10,c)],isStrike:!0,isSpare:!1});continue}const u=D(l),m=F(o);if(!m)return{kind:"error",message:`Frame ${s+1} is missing a second roll`,column:e.length+1};const{char:f,column:i}=m;if(f==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${s+1}`,column:i};if(f==="/"){if(u>=10)return{kind:"error",message:`Spare in frame ${s+1} requires the first roll to be less than 10`,column:i};const $=10-u;t.push({rolls:[M(l,u,c),M("/",$,i)],isStrike:!1,isSpare:!0});continue}if(!re.has(f))return{kind:"error",message:`Invalid roll '${f}' in frame ${s+1}`,column:i};const p=D(f);if(u+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${s+1}`,column:i};t.push({rolls:[M(l,u,c),M(f,p,i)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Oe(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function Oe(e,t){const o=F(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!pe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Ne(e,r);const s=D(a),n=F(e);if(!n)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:l,column:c}=n;if(l==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(l==="/"){if(s>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const m=10-s,f=F(e);if(!f)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:i,column:p}=f;if(i==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!oe(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:p};const $=i==="X"?10:D(i);return{kind:"success",frame:{rolls:[M(a,s,r),M("/",m,c),M(i,$,p)],isStrike:!1,isSpare:!0}}}if(!re.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame 10`,column:c};const u=D(l);return s+u>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[M(a,s,r),M(l,u,c)],isStrike:!1,isSpare:!1}}}function Ne(e,t){const o=F(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!oe(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let s;a==="X"?s=10:s=D(a);const n=F(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:l,column:c}=n;if(!oe(l))return{kind:"error",message:`Invalid fill ball '${l}' in frame 10`,column:c};let u;if(l==="X")u=10;else if(l==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(s>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};u=10-s}else if(u=D(l),a!=="X"&&s+u>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[M("X",10,t),M(a,s,r),M(l,u,c)],isStrike:!0,isSpare:!1}}}function z(e){const t=[],o=[],a=[];for(const n of e){for(const l of n.rolls)t.push(l.value);o.push(n.isStrike),a.push(n.isSpare)}let r=0,s=0;for(let n=0;n<10;n+=1)o[n]?(r+=10+(t[s+1]??0)+(t[s+2]??0),s+=1):a[n]?(r+=10+(t[s+2]??0),s+=2):(r+=(t[s]??0)+(t[s+1]??0),s+=2);return r}function Re(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(s,n){if(n===1){a.push([...s,o]);return}for(let l=0;l<n;l++)r(s,n-1),n%2===0?[s[l],s[n-1]]=[s[n-1],s[l]]:[s[0],s[n-1]]=[s[n-1],s[0]]}return r(t,t.length),a}function He(e){const t=Re(e),o=t.map(h=>z(h)),a=z(e);o.sort((h,y)=>h-y);const r=o[0],s=o[o.length-1],l=o.reduce((h,y)=>h+y,0)/o.length,c=Math.floor(o.length/2),u=o.length%2===0?(o[c-1]+o[c])/2:o[c],m=new Map;for(const h of o)m.set(h,(m.get(h)||0)+1);let f=0;for(const h of m.values())h>f&&(f=h);const i=[];for(const[h,y]of m)y===f&&i.push(h);i.sort((h,y)=>h-y);const p=[];for(const[h,y]of m)p.push({score:h,count:y,frequency:y/o.length});p.sort((h,y)=>h.score-y.score);const $=o.filter(h=>h<=a).length,k=Math.round($/o.length*100*100)/100,S=o.reduce((h,y)=>h+Math.pow(y-l,2),0)/o.length,w=Math.sqrt(S),T=w===0?0:(a-l)/w,A=o.reduce((h,y)=>h+Math.pow((y-l)/w,3),0),X=w===0?0:A/o.length;return{min:r,max:s,mean:Math.round(l*100)/100,median:u,mode:i,permutationCount:t.length,histogram:p,actualPercentile:k,zScore:Math.round(T*100)/100,skewness:Math.round(X*100)/100,standardDeviation:Math.round(w*100)/100}}function se(e){const t=[],o=[],a=[];for(const l of e){for(const c of l.rolls)t.push(c.value);o.push(l.isStrike),a.push(l.isSpare)}const r=[];let s=0,n=0;for(let l=0;l<10;l+=1){const c=e[l];let u=0,m=0,f="";o[l]?(u=10+(t[s+1]??0)+(t[s+2]??0),m=10,l===9?f=c.rolls.map(i=>i.symbol).join(" "):f="X",s+=1):a[l]?(u=10+(t[s+2]??0),m=10,f=c.rolls.map(i=>i.symbol).join(""),s+=2):(u=(t[s]??0)+(t[s+1]??0),m=u,f=c.rolls.map(i=>i.symbol).join(""),s+=2),n+=u,r.push({frameNumber:l+1,pinsKnocked:m,scoreContribution:u,cumulativeScore:n,rollSymbols:f,isStrike:c.isStrike,isSpare:c.isSpare})}return r}function je(e){if(e.length!==10)return[];const t=e.slice(0,9),o=e[9],a=se(e),r=[];for(let s=0;s<9;s++){const n=t[s],l=a[s].scoreContribution,c=[];for(let i=0;i<9;i++){const p=[...t];[p[s],p[i]]=[p[i],p[s]];const $=[...p,o],S=se($)[i].scoreContribution;c.push(S)}const u=c.reduce((i,p)=>i+p,0)/c.length,m=l-u;let f="";if(n.isStrike)m>5?f=`Lucky placement! Strike got strong bonuses (${Math.round(m)} pins above average for this position)`:m<-5?f=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(m))} pins below average)`:f=`Strike in neutral position (within ${Math.round(Math.abs(m))} pins of average)`;else if(n.isSpare)m>3?f=`Great timing! Spare got a strong bonus ball (${Math.round(m)} pins above average)`:m<-3?f=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(m))} pins below average)`:f=`Spare in neutral position (within ${Math.round(Math.abs(m))} pins of average)`;else{const i=n.rolls.reduce((p,$)=>p+$.value,0);Math.abs(m)<=.5?f=`Open frame (${i} pins) - position doesn't matter much`:f=`Open frame (${i} pins) - minimal positional impact`}r.push({frameNumber:s+1,actualContribution:l,averageContribution:Math.round(u*10)/10,positionBenefit:Math.round(m*10)/10,rollSymbols:a[s].rollSymbols,isStrike:n.isStrike,isSpare:n.isSpare,explanation:f})}return r}const ge="bowling_fortune_saved_games",de=1e4;function Ue(e,t,o,a){const r=J(),s={id:Ke(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(n=>n.trim()).length,totalScore:We(e)};return r.games.unshift(s),r.games.length>de&&(r.games=r.games.slice(0,de)),K(r),s}function j(){return J().games}function Ye(e){const t=J();t.games=t.games.filter(o=>o.id!==e),K(t)}function ze(){K({version:1,games:[]})}function _e(){const e=j(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function Ve(){const e=J();return JSON.stringify(e,null,2)}function Je(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return K(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function J(){try{const e=localStorage.getItem(ge);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function K(e){try{localStorage.setItem(ge,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function Ke(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function We(e){try{const t=e.trim().split(`
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
    <p>Build: 2025-10-18 07:24:16 CT</p>
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
`;const x=document.querySelector("#scores-input"),H=document.querySelector("#submit"),ye=document.querySelector("#clear-btn"),P=document.querySelector("#example-btn"),q=document.querySelector("#example-dropdown"),C=document.querySelector("#feedback"),$e=document.querySelector("#save-btn"),Se=document.querySelector("#saved-games-btn"),xe=document.querySelector("#saved-count"),B=document.querySelector("#save-modal-overlay"),we=document.querySelector("#save-form"),_=document.querySelector("#save-description"),ae=document.querySelector("#save-league"),ke=document.querySelector("#league-list"),V=document.querySelector("#save-date"),Le=document.querySelector("#save-cancel-btn"),U=document.querySelector("#saved-games-sidebar"),W=document.querySelector("#sidebar-overlay"),Me=document.querySelector("#sidebar-close-btn"),Z=document.querySelector("#search-saved-games"),Xe=document.querySelector("#export-btn"),Ae=document.querySelector("#import-btn"),R=document.querySelector("#import-file-input"),Ce=document.querySelector("#clear-all-btn"),N=document.querySelector("#saved-games-list"),Ee=document.querySelector("#sidebar-saved-count");if(!x||!H||!ye||!P||!q||!C||!$e||!Se||!xe||!B||!we||!_||!ae||!ke||!V||!Le||!U||!W||!Me||!Z||!Xe||!Ae||!R||!Ce||!N||!Ee)throw new Error("Failed to initialise UI elements");ye.addEventListener("click",()=>{x.value="",C.innerHTML="",x.focus()});let I=!1;function Qe(){I=!I,q.classList.toggle("show",I),P.setAttribute("aria-expanded",I.toString()),q.setAttribute("aria-hidden",(!I).toString())}function ie(){I=!1,q.classList.remove("show"),P.setAttribute("aria-expanded","false"),q.setAttribute("aria-hidden","true")}P.addEventListener("click",e=>{e.stopPropagation(),Qe()});const Ie=q.querySelectorAll(".dropdown-item");Ie.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);x.value=ve[o].score,ie(),x.focus()})});document.addEventListener("click",e=>{const t=e.target;I&&!P.contains(t)&&!q.contains(t)&&ie()});q.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Ie),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});let te=0;function qe(){if(Math.random()<Ze){const t=Math.floor(Math.random()*me.length);H.textContent=me[t];return}H.textContent=ue[te],te=(te+1)%ue.length}qe();setInterval(qe,3e4);let Te="";function ce(){if(!x.value.trim()){ne("Please provide at least one game.",1,1);return}const e=x.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){ne(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=he(a);if(r.kind==="error"){nt(r,o,e);return}const s=z(r.frames),n=He(r.frames);t.push({frames:r.frames,score:s,stats:n})}Te=x.value,ft(t)}H.addEventListener("click",ce);x.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),ce())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(U.classList.contains("show")){ee();return}if(B.classList.contains("show")){Q();return}if(I){ie(),P.focus();return}C.innerHTML&&(C.innerHTML="",x.focus())}});function Y(){const t=j().length;xe.innerHTML=t>0?`&nbsp;(${t})`:"",Ee.innerHTML=t>0?`&nbsp;(${t})`:""}function et(){if(!x.value.trim()){L("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];V.value=e,_.value="",ae.value="";const t=_e();ke.innerHTML=t.map(o=>`<option value="${o}">`).join(""),B.classList.add("show"),_.focus()}function Q(){B.classList.remove("show")}function tt(){Z.value="",G(),U.classList.add("show"),W.classList.add("show")}function ee(){U.classList.remove("show"),W.classList.remove("show")}function G(){const e=Z.value.trim().toLowerCase();let t=j();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),r=(o.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),t.length===0){N.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}N.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,r=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",s=o.description||"(No description)",n=o.league?`🏆 ${o.league}`:"";return`
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
    `}).join(""),N.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&ot(a)})}),N.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&st(a)})})}function ot(e){const o=j().find(a=>a.id===e);o&&(x.value=o.scores,ee(),H.click(),L("Game loaded!"))}function st(e){confirm("Delete this saved game?")&&(Ye(e),Y(),G(),L("Game deleted"))}$e.addEventListener("click",et);Se.addEventListener("click",tt);Le.addEventListener("click",Q);Me.addEventListener("click",ee);W.addEventListener("click",ee);Z.addEventListener("input",()=>{G()});B.addEventListener("click",e=>{e.target===B&&Q()});we.addEventListener("submit",e=>{e.preventDefault();const t=x.value.trim(),o=_.value.trim()||void 0,a=ae.value.trim()||void 0;let r=V.value||void 0;if(r){const s=new Date(r),n=new Date;if(n.setHours(0,0,0,0),s>n){L("Date cannot be in the future"),V.focus();return}}try{Ue(t,o,a,r),Q(),Y(),U.classList.contains("show")&&G(),L("Game saved!")}catch(s){console.error("Failed to save game",s),L("Failed to save game")}});Ce.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(ze(),Y(),G(),L("All games deleted"))});Xe.addEventListener("click",()=>{const e=j();if(e.length===0){L("No games to export");return}const t=Ve(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),L(`Exported ${e.length} game${e.length===1?"":"s"}`)});Ae.addEventListener("click",()=>{R.click()});R.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const r=a.target?.result,s=Je(r);s.success?(Y(),G(),L(`Imported ${s.count} game${s.count===1?"":"s"}`)):L(s.error||"Import failed"),R.value=""},o.onerror=()=>{L("Failed to read file"),R.value=""},o.readAsText(t)});Y();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);x.value=o,ce()}catch(o){console.error("Failed to decode scores from URL",o)}});function nt(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,s=Fe(o,t,e.column);ne(r,a,e.column,s)}function Fe(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function ne(e,t,o,a){if(C.innerHTML="",C.className="error",C.textContent=e,x.focus(),typeof a=="number")x.setSelectionRange(a,a);else{const r=x.value.replace(/\r/g,"").split(`
`),s=Fe(r,t-1,o);x.setSelectionRange(s,s)}}function rt(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,s=300,n={top:20,right:20,bottom:40,left:50},l=r-n.left-n.right,c=s-n.top-n.bottom,u=e.stats.min,m=e.stats.max,f=new Map(t.map(b=>[b.score,b])),i=[];for(let b=u;b<=m;b++){const v=f.get(b);i.push({score:b,count:v?.count??0,frequency:v?.frequency??0})}const p=Math.max(...i.map(b=>b.count)),$=Math.max(2,l/i.length),k=i.map((b,v)=>{const d=n.left+v*l/i.length,g=b.count/p*c,O=n.top+c-g,E=b.score===a;return`<rect
      x="${d}"
      y="${O}"
      width="${$}"
      height="${g}"
      fill="${E?"#fbbf24":"#60a5fa"}"
      opacity="${E?"1":"0.7"}"
    >
      <title>Score: ${b.score}
Count: ${b.count.toLocaleString()}
Frequency: ${(b.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),S=o-u,w=n.left+S*l/i.length+$/2,T=`
    <line x1="${w}" y1="${n.top}" x2="${w}" y2="${n.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${w}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,X=Array.from({length:A+1},(b,v)=>{const d=Math.round(p/A*v),g=n.top+c-v*c/A;return`
      <line x1="${n.left-5}" y1="${g}" x2="${n.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${d.toLocaleString()}</text>
    `}).join(""),h=Math.min(10,Math.ceil((m-u)/10)),y=h===0?`
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${u}</text>
    `:Array.from({length:h+1},(b,v)=>{const d=Math.round(u+(m-u)/h*v),g=n.left+v*l/h;return`
        <line x1="${g}" y1="${n.top+c}" x2="${g}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${g}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${k}
      ${T}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left+l}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${X}
      ${y}
      <text x="${n.left+l/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${n.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${n.top+c/2})">Count</text>
    </svg>
  `}function at(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function it(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats;e.score-e.stats.median;let n=`${at(o,r,e.score)} `;return Math.abs(t)<.5?n+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?n+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?n+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?n+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?n+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?n+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":n+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?n+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?n+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?n+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(n+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),n}function De(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,s]of t)for(const n of e[o].stats.histogram){const l=r+n.score,c=s*n.count;a.set(l,(a.get(l)||0)+c)}t=a}return t}function ct(e,t){const o=De(e),a=[];for(const[d,g]of o)a.push({score:d,count:g});a.sort((d,g)=>d.score-g.score);const r=600,s=300,n={top:20,right:20,bottom:40,left:50},l=r-n.left-n.right,c=s-n.top-n.bottom,u=a[0].score,m=a[a.length-1].score,f=new Map(a.map(d=>[d.score,d])),i=[];for(let d=u;d<=m;d++){const g=f.get(d);i.push({score:d,count:g?.count??0})}const p=Math.max(...i.map(d=>d.count)),$=Array.from(o.values()).reduce((d,g)=>d+g,0);let k=0,S=0;for(const d of a)if(k+=d.count,k>=$/2){S=d.score;break}const w=Math.max(2,l/i.length),T=i.map((d,g)=>{const O=n.left+g*l/i.length,E=d.count/p*c,Be=n.top+c-E,le=d.score===t;return`<rect
      x="${O}"
      y="${Be}"
      width="${w}"
      height="${E}"
      fill="${le?"#fbbf24":"#60a5fa"}"
      opacity="${le?"1":"0.7"}"
    >
      <title>Series Score: ${d.score}
Combinations: ${d.count.toLocaleString()}</title>
    </rect>`}).join(""),A=S-u,X=n.left+A*l/i.length+w/2,h=`
    <line x1="${X}" y1="${n.top}" x2="${X}" y2="${n.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${X}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,y="",b=Math.min(10,Math.ceil((m-u)/20)),v=b===0?`
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${u}</text>
    `:Array.from({length:b+1},(d,g)=>{const O=Math.round(u+(m-u)/b*g),E=n.left+g*l/b;return`
        <line x1="${E}" y1="${n.top+c}" x2="${E}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${E}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${O}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${T}
      ${h}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left+l}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${v}
      <text x="${n.left+l/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function lt(e){if(e.length<2)return"";const t=e.reduce((d,g)=>d+g.score,0),o=Math.round(t/e.length*100)/100,a=De(e),r=[];for(const[d,g]of a)r.push({score:d,count:g});r.sort((d,g)=>d.score-g.score);const s=Array.from(a.values()).reduce((d,g)=>d+g,0),n=r[0].score,l=r[r.length-1].score;let c=0;for(const d of r)c+=d.score*d.count;const u=c/s;let m=0,f=0;for(const d of r)if(m+=d.count,m>=s/2){f=d.score;break}const i=r.filter(d=>d.score<=t).reduce((d,g)=>d+g.count,0),p=Math.round(i/s*100*100)/100;let $=0;for(const d of r)$+=Math.pow(d.score-u,2)*d.count;const k=Math.sqrt($/s),S=k===0?0:(t-u)/k;let w=0;for(const d of r)w+=Math.pow((d.score-u)/k,3)*d.count;const T=k===0?0:w/s;let A=0;for(const d of r)d.count>A&&(A=d.count);const X=[];for(const d of r)d.count===A&&X.push(d.score);const h=t-f,y=h>=0?`+${h}`:`${h}`,b=X.length===1?X[0].toString():`${X.join(", ")} (multimodal)`;let v="";return Math.abs(S)<.5?v="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":S>=2?v="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":S<=-2?v="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":S>=1?v="Across this series, you had <strong>notably favorable</strong> frame sequences.":S<=-1?v="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":S>0?v="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":v="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",p>=95?v+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":p>=75?v+=" You scored in the <strong>top quartile</strong> of possible combinations.":p<=5?v+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":p<=25&&(v+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
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
        <dd>${p}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(S*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${y}</dd>

        <dt>Minimum score:</dt>
        <dd>${n}</dd>

        <dt>Maximum score:</dt>
        <dd>${l}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(u*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${f}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(k*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(T*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${b}</dd>
      </dl>
    </article>
  `}function dt(){const e=btoa(Te),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function ut(){const e=dt();navigator.clipboard.writeText(e).then(()=>{L("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),L("Failed to copy link")})}function L(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function mt(e){const t=se(e),o=je(e),a=3,r=-3,s=o.filter(i=>i.positionBenefit>=a).sort((i,p)=>p.positionBenefit-i.positionBenefit),n=o.filter(i=>i.positionBenefit<=r).sort((i,p)=>i.positionBenefit-p.positionBenefit);function l(){return`
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
    `}function c(i,p){const $=i.positionBenefit>=0?"+":"",S=t.find(w=>w.frameNumber===i.frameNumber)?.cumulativeScore||0;return`
      <div class="scorecard-frame">
        <div class="frame-emoji">${p}</div>
        <div class="frame-rolls">${i.rollSymbols}</div>
        <div class="frame-score">${S}</div>
        <div class="frame-benefit ${i.positionBenefit>=0?"positive":"negative"}">${$}${i.positionBenefit}</div>
        <div class="frame-number">Frame ${i.frameNumber}</div>
        <div class="frame-explanation">${i.explanation}</div>
      </div>
    `}const u=s.length>0?`
    <div class="hero-frames">
      <h4>🍀 Luckiest Frames (±${a}+ pins above average)</h4>
      <p class="section-explanation">These frames scored more than average due to favorable positioning in the game order</p>
      <div class="scorecard-frames">
        ${s.map(i=>c(i,"🍀")).join("")}
      </div>
    </div>
  `:"",m=n.length>0?`
    <div class="villain-frames">
      <h4>💔 Unluckiest Frames (±${Math.abs(r)}+ pins below average)</h4>
      <p class="section-explanation">These frames scored less than average due to unfavorable positioning in the game order</p>
      <div class="scorecard-frames">
        ${n.map(i=>c(i,"💔")).join("")}
      </div>
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

      ${l()}

      ${u}
      ${m}
      ${f}
    </div>
  `}function ft(e){if(C.className="output",e.length===0){C.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((s,n)=>{const l=n+1,c=s.stats.mode.length===1?s.stats.mode[0].toString():`${s.stats.mode.join(", ")} (multimodal)`,u=s.score-s.stats.median,m=u>=0?`+${u}`:`${u}`,f=it(s);return`
        <article class="result-card">
          <h2>Game ${l}</h2>
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
            <dd>${c}</dd>
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
