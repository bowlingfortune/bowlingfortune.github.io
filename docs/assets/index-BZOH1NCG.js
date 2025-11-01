(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const Ve=new Set([" ","	",",",";"]),pe=new Set("0123456789-".split("")),Ke=new Set("0123456789-X/".split(""));function we(e){return Ve.has(e)}function D(e){const{line:t}=e;for(;e.index<t.length&&we(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function B(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function xe(e){return e==="X"||pe.has(e)}function me(e){return Ke.has(e)}function M(e,t,o){return{symbol:e,value:t,column:o}}function Le(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&we(e[o.index]);)o.index+=1};for(let n=0;n<9;n+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const s=D(o);if(!s)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:c,column:i}=s;if(!xe(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${n+1}`,column:i};if(c==="X"){t.push({rolls:[M("X",10,i)],isStrike:!0,isSpare:!1});continue}const m=B(c),f=D(o);if(!f)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:l,column:d}=f;if(l==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:d};if(l==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:d};const $=10-m;t.push({rolls:[M(c,m,i),M("/",$,d)],isStrike:!1,isSpare:!0});continue}if(!pe.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${n+1}`,column:d};const p=B(l);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:d};t.push({rolls:[M(c,m,i),M(l,p,d)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Je(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function Je(e,t){const o=D(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!xe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return We(e,r);const n=B(a),s=D(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:c,column:i}=s;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:i};if(c==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:i};const f=10-n,l=D(e);if(!l)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:d,column:p}=l;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!me(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:p};const $=d==="X"?10:B(d);return{kind:"success",frame:{rolls:[M(a,n,r),M("/",f,i),M(d,$,p)],isStrike:!1,isSpare:!0}}}if(!pe.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:i};const m=B(c);return n+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:i}:{kind:"success",frame:{rolls:[M(a,n,r),M(c,m,i)],isStrike:!1,isSpare:!1}}}function We(e,t){const o=D(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!me(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;a==="X"?n=10:n=B(a);const s=D(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:c,column:i}=s;if(!me(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:i};let m;if(c==="X")m=10;else if(c==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:i};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:i};m=10-n}else if(m=B(c),a!=="X"&&n+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:i};return{kind:"success",frame:{rolls:[M("X",10,t),M(a,n,r),M(c,m,i)],isStrike:!0,isSpare:!1}}}function Z(e){const t=[],o=[],a=[];for(const s of e){for(const c of s.rolls)t.push(c.value);o.push(s.isStrike),a.push(s.isSpare)}let r=0,n=0;for(let s=0;s<10;s+=1)o[s]?(r+=10+(t[n+1]??0)+(t[n+2]??0),n+=1):a[s]?(r+=10+(t[n+2]??0),n+=2):(r+=(t[n]??0)+(t[n+1]??0),n+=2);return r}function Ze(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(n,s){if(s===1){a.push([...n,o]);return}for(let c=0;c<s;c++)r(n,s-1),s%2===0?[n[c],n[s-1]]=[n[s-1],n[c]]:[n[0],n[s-1]]=[n[s-1],n[0]]}return r(t,t.length),a}function Qe(e){const t=Ze(e),o=t.map(h=>Z(h)),a=Z(e);o.sort((h,S)=>h-S);const r=o[0],n=o[o.length-1],c=o.reduce((h,S)=>h+S,0)/o.length,i=Math.floor(o.length/2),m=o.length%2===0?(o[i-1]+o[i])/2:o[i],f=new Map;for(const h of o)f.set(h,(f.get(h)||0)+1);let l=0;for(const h of f.values())h>l&&(l=h);const d=[];for(const[h,S]of f)S===l&&d.push(h);d.sort((h,S)=>h-S);const p=[];for(const[h,S]of f)p.push({score:h,count:S,frequency:S/o.length});p.sort((h,S)=>h.score-S.score);const $=o.filter(h=>h<=a).length,w=Math.round($/o.length*100*100)/100,k=o.reduce((h,S)=>h+Math.pow(S-c,2),0)/o.length,x=Math.sqrt(k),F=x===0?0:(a-c)/x,A=o.reduce((h,S)=>h+Math.pow((S-c)/x,3),0),T=x===0?0:A/o.length;return{min:r,max:n,mean:Math.round(c*100)/100,median:m,mode:d,permutationCount:t.length,histogram:p,actualPercentile:w,zScore:Math.round(F*100)/100,skewness:Math.round(T*100)/100,standardDeviation:Math.round(x*100)/100}}function Q(e){const t=[],o=[],a=[];for(const c of e){for(const i of c.rolls)t.push(i.value);o.push(c.isStrike),a.push(c.isSpare)}const r=[];let n=0,s=0;for(let c=0;c<10;c+=1){const i=e[c];let m=0,f=0,l="";o[c]?(m=10+(t[n+1]??0)+(t[n+2]??0),f=10,c===9?l=i.rolls.map(d=>d.symbol).join(" "):l="X",n+=1):a[c]?(m=10+(t[n+2]??0),f=10,l=i.rolls.map(d=>d.symbol).join(""),n+=2):(m=(t[n]??0)+(t[n+1]??0),f=m,l=i.rolls.map(d=>d.symbol).join(""),n+=2),s+=m,r.push({frameNumber:c+1,pinsKnocked:f,scoreContribution:m,cumulativeScore:s,rollSymbols:l,isStrike:i.isStrike,isSpare:i.isSpare})}return r}function et(e){if(e.length!==10)return[];const t=e.slice(0,9),o=e[9],a=Q(e),r=[];for(let n=0;n<9;n++){const s=t[n],c=a[n].scoreContribution,i=[];for(let d=0;d<9;d++){const p=[...t];[p[n],p[d]]=[p[d],p[n]];const $=[...p,o],k=Q($)[d].scoreContribution;i.push(k)}const m=i.reduce((d,p)=>d+p,0)/i.length,f=c-m;let l="";if(s.isStrike)f>5?l=`Lucky placement! Strike got strong bonuses (${Math.round(f)} pins above average for this position)`:f<-5?l=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(f))} pins below average)`:l=`Strike in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else if(s.isSpare)f>3?l=`Great timing! Spare got a strong bonus ball (${Math.round(f)} pins above average)`:f<-3?l=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(f))} pins below average)`:l=`Spare in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else{const d=s.rolls.reduce((p,$)=>p+$.value,0);Math.abs(f)<=.5?l=`Open frame (${d} pins) - position doesn't matter much`:l=`Open frame (${d} pins) - minimal positional impact`}r.push({frameNumber:n+1,actualContribution:c,averageContribution:Math.round(m*10)/10,positionBenefit:Math.round(f*10)/10,rollSymbols:a[n].rollSymbols,isStrike:s.isStrike,isSpare:s.isSpare,explanation:l})}return r}const Me="bowling_fortune_saved_games",he="bowling_fortune_draft",Se=1e4;function tt(e,t,o,a){const r=ne(),n={id:it(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:ct(e)};return r.games.unshift(n),r.games.length>Se&&(r.games=r.games.slice(0,Se)),re(r),n}function K(){return ne().games}function ot(e){const t=ne();t.games=t.games.filter(o=>o.id!==e),re(t)}function st(){re({version:1,games:[]})}function nt(){const e=K(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function rt(){const e=ne();return JSON.stringify(e,null,2)}function at(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return re(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function ne(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function re(e){try{localStorage.setItem(Me,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function it(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function ct(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const r=Le(a);if(r.kind==="error")return;o+=Z(r.frames)}return o}catch{return}}function lt(e){try{e.trim()?localStorage.setItem(he,e):ge()}catch(t){console.error("Failed to save draft",t)}}function dt(){try{return localStorage.getItem(he)}catch(e){return console.error("Failed to load draft",e),null}}function ge(){try{localStorage.removeItem(he)}catch(e){console.error("Failed to clear draft",e)}}function ut(e){const t=[],a=e.split(/<span class="title-headlines">Game \d+<\/span>/).slice(1);if(a.length===0)throw new Error("No games found in LaneTalk HTML");for(const n of a){const s=[],c=n.matchAll(/<div class="frame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/gs);for(const m of c){const f=m[1],l=mt(f);s.push(l)}const i=n.match(/<div class="lastFrame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/s);if(i){const m=i[1],f=ft(m);s.push(f)}if(s.length!==10)throw new Error(`Expected 10 frames, found ${s.length}`);t.push({frames:s.join(" ")})}const r=pt(e);return{games:t,metadata:r}}function mt(e){const t=e.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g),o=[];for(const r of t)o.push(r[1]);return e.includes('<div class="triangle"></div>')&&o.length===1&&o.push("/"),o.join("")}function ft(e){const t=e.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g),o=[];for(const r of t)o.push(r[1]);const a=(e.match(/<div class="triangle"><\/div>/g)||[]).length;for(let r=0;r<a;r++)o.push("/");return o.join("")}function pt(e){const t={},o=e.match(/<h1>([^<]+)<\/h1>/);o&&(t.bowler=o[1].trim());const a=e.match(/<h2>([^<]*(?:AM|PM)[^<]*)<\/h2>/);a&&(t.date=a[1].trim());const r=e.match(/<h2 class="name">([^<]+)<\/h2>/);r&&(t.location=r[1].trim());const n=e.match(/<span>Total<\/span>\s*<h2>(\d+)<\/h2>/s);n&&(t.total=parseInt(n[1],10));const s=e.match(/<span>Average<\/span>\s*<h2>(\d+)<\/h2>/s);return s&&(t.average=parseInt(s[1],10)),t}function ht(e){try{return new URL(e).hostname==="shared.lanetalk.com"}catch{return!1}}const $e=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],ke=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],gt=.001,Te=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],Ae=document.querySelector("#app");if(!Ae)throw new Error("Failed to find app container");Ae.innerHTML=`
  <h1>Bowling Fortune Teller 🎳</h1>
  <div class="brought-to-you">
    brought to you by <img src="/logo.png" alt="Pocket Penetration" class="sponsor-logo">
  </div>
  <!-- LaneTalk Import Section -->
  <div class="lanetalk-import-section">
    <button type="button" id="lanetalk-toggle" class="lanetalk-toggle" aria-expanded="false">
      Import from LaneTalk (optional)
      <span class="toggle-arrow">▶</span>
    </button>
    <div id="lanetalk-import-content" class="lanetalk-import-content" aria-hidden="true">
      <div class="lanetalk-import-row">
        <label for="lanetalk-url">LaneTalk URL:</label>
        <input
          type="url"
          id="lanetalk-url"
          placeholder="http://shared.lanetalk.com/..."
          aria-describedby="lanetalk-help"
        />
        <button type="button" id="lanetalk-import-btn" class="secondary-btn">Import</button>
      </div>
      <div id="lanetalk-status" class="lanetalk-status" role="status" aria-live="polite"></div>
      <p id="lanetalk-help" class="lanetalk-help">
        Paste a LaneTalk shared link to automatically import game scores
      </p>
    </div>
  </div>

  <label for="scores-input">Or enter frame-by-frame notation:</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
  <div class="textarea-footer">
    <div class="example-dropdown-container">
      <button id="example-btn" type="button" class="secondary-btn example-btn" aria-haspopup="true" aria-expanded="false">
        Try an example
        <span class="dropdown-arrow">▼</span>
      </button>
      <div id="example-dropdown" class="example-dropdown" role="menu" aria-hidden="true">
        ${Te.map((e,t)=>`
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
    <p>Build: 2025-11-01 00:54:18 CT</p>
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
`;const y=document.querySelector("#scores-input"),Y=document.querySelector("#submit"),Ee=document.querySelector("#clear-btn"),R=document.querySelector("#example-btn"),q=document.querySelector("#example-dropdown"),E=document.querySelector("#feedback"),N=document.querySelector("#lanetalk-toggle"),_=document.querySelector("#lanetalk-import-content"),z=document.querySelector("#lanetalk-url"),ee=document.querySelector("#lanetalk-import-btn"),V=document.querySelector("#lanetalk-status"),Xe=document.querySelector("#save-btn"),Ce=document.querySelector("#saved-games-btn"),Ie=document.querySelector("#saved-count"),P=document.querySelector("#save-modal-overlay"),qe=document.querySelector("#save-form"),te=document.querySelector("#save-description"),ve=document.querySelector("#save-league"),Fe=document.querySelector("#league-list"),oe=document.querySelector("#save-date"),De=document.querySelector("#save-cancel-btn"),J=document.querySelector("#saved-games-sidebar"),ae=document.querySelector("#sidebar-overlay"),Be=document.querySelector("#sidebar-close-btn"),ie=document.querySelector("#search-saved-games"),Ne=document.querySelector("#export-btn"),Pe=document.querySelector("#import-btn"),U=document.querySelector("#import-file-input"),Re=document.querySelector("#clear-all-btn"),H=document.querySelector("#saved-games-list"),Ge=document.querySelector("#sidebar-saved-count");if(!y||!Y||!Ee||!R||!q||!E||!N||!_||!z||!ee||!V||!Xe||!Ce||!Ie||!P||!qe||!te||!ve||!Fe||!oe||!De||!J||!ae||!Be||!ie||!Ne||!Pe||!U||!Re||!H||!Ge)throw new Error("Failed to initialise UI elements");Ee.addEventListener("click",()=>{y.value="",E.innerHTML="",ge(),y.focus()});let de;function vt(e){de!==void 0&&clearTimeout(de),de=window.setTimeout(()=>{lt(e)},500)}y.addEventListener("input",()=>{vt(y.value)});let I=!1;function bt(){I=!I,q.classList.toggle("show",I),R.setAttribute("aria-expanded",I.toString()),q.setAttribute("aria-hidden",(!I).toString())}function be(){I=!1,q.classList.remove("show"),R.setAttribute("aria-expanded","false"),q.setAttribute("aria-hidden","true")}R.addEventListener("click",e=>{e.stopPropagation(),bt()});const Oe=q.querySelectorAll(".dropdown-item");Oe.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);y.value=Te[o].score,be(),y.focus()})});document.addEventListener("click",e=>{const t=e.target;I&&!R.contains(t)&&!q.contains(t)&&be()});q.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Oe),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});let C=!1;function yt(){C=!C,_.classList.toggle("show",C),N.setAttribute("aria-expanded",C.toString()),_.setAttribute("aria-hidden",(!C).toString());const e=N.querySelector(".toggle-arrow");e&&(e.textContent=C?"▼":"▶"),C&&z.focus()}function St(){C=!1,_.classList.remove("show"),N.setAttribute("aria-expanded","false"),_.setAttribute("aria-hidden","true");const e=N.querySelector(".toggle-arrow");e&&(e.textContent="▶")}function j(e,t){V.textContent=e,V.className=`lanetalk-status ${t}`}function $t(){V.textContent="",V.className="lanetalk-status"}async function je(){const e=z.value.trim();if(!e){j("Please enter a LaneTalk URL","error");return}if(!ht(e)){j("Invalid LaneTalk URL. Must be from shared.lanetalk.com","error");return}ee.disabled=!0,j("Fetching games from LaneTalk...","loading");try{const t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch: ${t.status} ${t.statusText}`);const o=await t.text(),a=ut(o);if(a.games.length===0)throw new Error("No games found in LaneTalk data");const r=a.games.map(s=>s.frames).join(`
`);y.value=r;const n=a.games.length===1?"game":"games";j(`✓ Successfully imported ${a.games.length} ${n}!`,"success"),z.value="",setTimeout(()=>{St(),$t(),y.focus()},2e3)}catch(t){console.error("LaneTalk import error:",t);const o=t instanceof Error?t.message:"Unknown error";j(`Error: ${o}`,"error")}finally{ee.disabled=!1}}N.addEventListener("click",yt);ee.addEventListener("click",je);z.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),je())});let ue=0;function He(){if(Math.random()<gt){const t=Math.floor(Math.random()*ke.length);Y.textContent=ke[t];return}Y.textContent=$e[ue],ue=(ue+1)%$e.length}He();setInterval(He,3e4);let Ue="";function se(){if(!y.value.trim()){fe("Please provide at least one game.",1,1);return}const e=y.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){fe(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=Le(a);if(r.kind==="error"){Mt(r,o,e);return}const n=Z(r.frames),s=Qe(r.frames);t.push({frames:r.frames,score:n,stats:s})}Ue=y.value,Bt(t)}Y.addEventListener("click",se);y.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),se())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(J.classList.contains("show")){le();return}if(P.classList.contains("show")){ce();return}if(I){be(),R.focus();return}E.innerHTML&&(E.innerHTML="",y.focus())}});function W(){const t=K().length;Ie.innerHTML=t>0?`&nbsp;(${t})`:"",Ge.innerHTML=t>0?`&nbsp;(${t})`:""}function kt(){if(!y.value.trim()){L("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];oe.value=e,te.value="",ve.value="";const t=nt();Fe.innerHTML=t.map(o=>`<option value="${o}">`).join(""),P.classList.add("show"),te.focus()}function ce(){P.classList.remove("show")}function wt(){ie.value="",G(),J.classList.add("show"),ae.classList.add("show")}function le(){J.classList.remove("show"),ae.classList.remove("show")}function G(){const e=ie.value.trim().toLowerCase();let t=K();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),r=(o.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),t.length===0){H.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}H.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,r=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",n=o.description||"(No description)",s=o.league?`🏆 ${o.league}`:"";return`
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
    `}).join(""),H.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&xt(a)})}),H.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&Lt(a)})})}function xt(e){const o=K().find(a=>a.id===e);o&&(y.value=o.scores,le(),Y.click(),L("Game loaded!"))}function Lt(e){confirm("Delete this saved game?")&&(ot(e),W(),G(),L("Game deleted"))}Xe.addEventListener("click",kt);Ce.addEventListener("click",wt);De.addEventListener("click",ce);Be.addEventListener("click",le);ae.addEventListener("click",le);ie.addEventListener("input",()=>{G()});P.addEventListener("click",e=>{e.target===P&&ce()});qe.addEventListener("submit",e=>{e.preventDefault();const t=y.value.trim(),o=te.value.trim()||void 0,a=ve.value.trim()||void 0;let r=oe.value||void 0;if(r){const n=new Date(r),s=new Date;if(s.setHours(0,0,0,0),n>s){L("Date cannot be in the future"),oe.focus();return}}try{tt(t,o,a,r),ce(),ge(),W(),J.classList.contains("show")&&G(),L("Game saved!")}catch(n){console.error("Failed to save game",n),L("Failed to save game")}});Re.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(st(),W(),G(),L("All games deleted"))});Ne.addEventListener("click",()=>{const e=K();if(e.length===0){L("No games to export");return}const t=rt(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),L(`Exported ${e.length} game${e.length===1?"":"s"}`)});Pe.addEventListener("click",()=>{U.click()});U.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const r=a.target?.result,n=at(r);n.success?(W(),G(),L(`Imported ${n.count} game${n.count===1?"":"s"}`)):L(n.error||"Import failed"),U.value=""},o.onerror=()=>{L("Failed to read file"),U.value=""},o.readAsText(t)});W();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);y.value=o,se()}catch(o){console.error("Failed to decode scores from URL",o)}else{const o=dt();o&&(y.value=o,se())}});function Mt(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,n=Ye(o,t,e.column);fe(r,a,e.column,n)}function Ye(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function fe(e,t,o,a){if(E.innerHTML="",E.className="error",E.textContent=e,y.focus(),typeof a=="number")y.setSelectionRange(a,a);else{const r=y.value.replace(/\r/g,"").split(`
`),n=Ye(r,t-1,o);y.setSelectionRange(n,n)}}function Tt(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,n=300,s={top:20,right:20,bottom:40,left:50},c=r-s.left-s.right,i=n-s.top-s.bottom,m=e.stats.min,f=e.stats.max,l=new Map(t.map(b=>[b.score,b])),d=[];for(let b=m;b<=f;b++){const v=l.get(b);d.push({score:b,count:v?.count??0,frequency:v?.frequency??0})}const p=Math.max(...d.map(b=>b.count)),$=Math.max(2,c/d.length),w=d.map((b,v)=>{const u=s.left+v*c/d.length,g=b.count/p*i,O=s.top+i-g,X=b.score===a;return`<rect
      x="${u}"
      y="${O}"
      width="${$}"
      height="${g}"
      fill="${X?"#fbbf24":"#60a5fa"}"
      opacity="${X?"1":"0.7"}"
    >
      <title>Score: ${b.score}
Count: ${b.count.toLocaleString()}
Frequency: ${(b.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),k=o-m,x=s.left+k*c/d.length+$/2,F=`
    <line x1="${x}" y1="${s.top}" x2="${x}" y2="${s.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,T=Array.from({length:A+1},(b,v)=>{const u=Math.round(p/A*v),g=s.top+i-v*i/A;return`
      <line x1="${s.left-5}" y1="${g}" x2="${s.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${u.toLocaleString()}</text>
    `}).join(""),h=Math.min(10,Math.ceil((f-m)/10)),S=h===0?`
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:h+1},(b,v)=>{const u=Math.round(m+(f-m)/h*v),g=s.left+v*c/h;return`
        <line x1="${g}" y1="${s.top+i}" x2="${g}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${g}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${u}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${w}
      ${F}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left+c}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${T}
      ${S}
      <text x="${s.left+c/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+i/2})">Count</text>
    </svg>
  `}function At(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function Et(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats;e.score-e.stats.median;let s=`${At(o,r,e.score)} `;return Math.abs(t)<.5?s+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?s+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?s+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?s+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?s+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?s+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function _e(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,n]of t)for(const s of e[o].stats.histogram){const c=r+s.score,i=n*s.count;a.set(c,(a.get(c)||0)+i)}t=a}return t}function Xt(e,t){const o=_e(e),a=[];for(const[u,g]of o)a.push({score:u,count:g});a.sort((u,g)=>u.score-g.score);const r=600,n=300,s={top:20,right:20,bottom:40,left:50},c=r-s.left-s.right,i=n-s.top-s.bottom,m=a[0].score,f=a[a.length-1].score,l=new Map(a.map(u=>[u.score,u])),d=[];for(let u=m;u<=f;u++){const g=l.get(u);d.push({score:u,count:g?.count??0})}const p=Math.max(...d.map(u=>u.count)),$=Array.from(o.values()).reduce((u,g)=>u+g,0);let w=0,k=0;for(const u of a)if(w+=u.count,w>=$/2){k=u.score;break}const x=Math.max(2,c/d.length),F=d.map((u,g)=>{const O=s.left+g*c/d.length,X=u.count/p*i,ze=s.top+i-X,ye=u.score===t;return`<rect
      x="${O}"
      y="${ze}"
      width="${x}"
      height="${X}"
      fill="${ye?"#fbbf24":"#60a5fa"}"
      opacity="${ye?"1":"0.7"}"
    >
      <title>Series Score: ${u.score}
Combinations: ${u.count.toLocaleString()}</title>
    </rect>`}).join(""),A=k-m,T=s.left+A*c/d.length+x/2,h=`
    <line x1="${T}" y1="${s.top}" x2="${T}" y2="${s.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${T}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,S="",b=Math.min(10,Math.ceil((f-m)/20)),v=b===0?`
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:b+1},(u,g)=>{const O=Math.round(m+(f-m)/b*g),X=s.left+g*c/b;return`
        <line x1="${X}" y1="${s.top+i}" x2="${X}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${X}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${O}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${F}
      ${h}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left+c}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${S}
      ${v}
      <text x="${s.left+c/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function Ct(e){if(e.length<2)return"";const t=e.reduce((u,g)=>u+g.score,0),o=Math.round(t/e.length*100)/100,a=_e(e),r=[];for(const[u,g]of a)r.push({score:u,count:g});r.sort((u,g)=>u.score-g.score);const n=Array.from(a.values()).reduce((u,g)=>u+g,0),s=r[0].score,c=r[r.length-1].score;let i=0;for(const u of r)i+=u.score*u.count;const m=i/n;let f=0,l=0;for(const u of r)if(f+=u.count,f>=n/2){l=u.score;break}const d=r.filter(u=>u.score<=t).reduce((u,g)=>u+g.count,0),p=Math.round(d/n*100*100)/100;let $=0;for(const u of r)$+=Math.pow(u.score-m,2)*u.count;const w=Math.sqrt($/n),k=w===0?0:(t-m)/w;let x=0;for(const u of r)x+=Math.pow((u.score-m)/w,3)*u.count;const F=w===0?0:x/n;let A=0;for(const u of r)u.count>A&&(A=u.count);const T=[];for(const u of r)u.count===A&&T.push(u.score);const h=t-l,S=h>=0?`+${h}`:`${h}`,b=T.length===1?T[0].toString():`${T.join(", ")} (multimodal)`;let v="";return Math.abs(k)<.5?v="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":k>=2?v="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":k<=-2?v="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":k>=1?v="Across this series, you had <strong>notably favorable</strong> frame sequences.":k<=-1?v="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":k>0?v="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":v="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",p>=95?v+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":p>=75?v+=" You scored in the <strong>top quartile</strong> of possible combinations.":p<=5?v+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":p<=25&&(v+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${v}</p>
      </div>

      <div class="histogram-container">
        ${Xt(e,t)}
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
        <dd>${Math.round(k*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${S}</dd>

        <dt>Minimum score:</dt>
        <dd>${s}</dd>

        <dt>Maximum score:</dt>
        <dd>${c}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(m*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${l}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(F*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${b}</dd>
      </dl>
    </article>
  `}function It(){const e=btoa(Ue),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function qt(){const e=It();navigator.clipboard.writeText(e).then(()=>{L("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),L("Failed to copy link")})}function L(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function Ft(e){return`
    <div class="complete-scorecard">
      <div class="scorecard-row">
        ${Q(e).map(o=>`
            <div class="scorecard-full-frame ${o.frameNumber===10?"tenth-frame":""}">
              <div class="frame-number-label">${o.frameNumber}</div>
              <div class="frame-rolls-display">${o.rollSymbols}</div>
              <div class="frame-cumulative-score">${o.cumulativeScore}</div>
            </div>
          `).join("")}
      </div>
    </div>
  `}function Dt(e){const t=Q(e),o=et(e),a=3,r=-3,n=o.filter(l=>l.positionBenefit>=a).sort((l,d)=>d.positionBenefit-l.positionBenefit),s=o.filter(l=>l.positionBenefit<=r).sort((l,d)=>l.positionBenefit-d.positionBenefit);function c(){return`
      <div class="complete-scorecard">
        <div class="scorecard-row">
          ${t.map(l=>{const d=o.find(w=>w.frameNumber===l.frameNumber);let p="",$="";return d&&(d.positionBenefit>=a?(p="🍀",$="lucky-frame"):d.positionBenefit<=r&&(p="💔",$="unlucky-frame")),`
              <div class="scorecard-full-frame ${l.frameNumber===10?"tenth-frame":""} ${$}">
                <div class="frame-number-label">${l.frameNumber}</div>
                ${p?`<div class="frame-emoji-indicator">${p}</div>`:""}
                <div class="frame-rolls-display">${l.rollSymbols}</div>
                <div class="frame-cumulative-score">${l.cumulativeScore}</div>
              </div>
            `}).join("")}
        </div>
      </div>
    `}const i=n.length>0?`
    <div class="impact-list">
      <h4>🍀 Luckiest Frames (${a}+ pins above average)</h4>
      <ul class="impact-bullets">
        ${n.map(l=>{const d=l.positionBenefit>=0?"+":"";return`<li><strong>Frame ${l.frameNumber} (${l.rollSymbols})</strong>: ${l.explanation} <span class="benefit-badge positive">${d}${l.positionBenefit}</span></li>`}).join("")}
      </ul>
    </div>
  `:"",m=s.length>0?`
    <div class="impact-list">
      <h4>💔 Unluckiest Frames (${Math.abs(r)}+ pins below average)</h4>
      <ul class="impact-bullets">
        ${s.map(l=>{const d=l.positionBenefit>=0?"+":"";return`<li><strong>Frame ${l.frameNumber} (${l.rollSymbols})</strong>: ${l.explanation} <span class="benefit-badge negative">${d}${l.positionBenefit}</span></li>`}).join("")}
      </ul>
    </div>
  `:"",f=n.length===0&&s.length===0?`
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
  `}function Bt(e){if(E.className="output",e.length===0){E.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((n,s)=>{const c=s+1,i=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,m=n.score-n.stats.median,f=m>=0?`+${m}`:`${m}`,l=Et(n);return`
        <article class="result-card">
          <h2>Game ${c} - Score: ${n.score}</h2>

          <div class="narrative">
            <p>${l}</p>
          </div>

          ${Ft(n.frames)}

          <div class="histogram-container">
            ${Tt(n)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <!-- ${Dt(n.frames)} -->

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${n.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${n.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${n.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${f}</dd>

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
            <dd>${i}</dd>
          </dl>
        </article>
      `}).join(""),a=Ct(e);E.innerHTML=`
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
  `,E.querySelectorAll("[data-copy-link]").forEach(n=>{n.addEventListener("click",qt)})}
