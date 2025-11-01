(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const Je=new Set([" ","	",",",";"]),fe=new Set("0123456789-".split("")),We=new Set("0123456789-X/".split(""));function ke(e){return Je.has(e)}function F(e){const{line:o}=e;for(;e.index<o.length&&ke(o[e.index]);)e.index+=1;if(e.index>=o.length)return null;const t=e.index+1,a=o[e.index].toUpperCase();return e.index+=1,{char:a,column:t}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const o=Number.parseInt(e,10);if(Number.isNaN(o))throw new Error(`Invalid roll symbol '${e}'`);if(o<0||o>9)throw new Error(`Invalid roll value '${e}'`);return o}function xe(e){return e==="X"||fe.has(e)}function ue(e){return We.has(e)}function M(e,o,t){return{symbol:e,value:o,column:t}}function Le(e){const o=[],t={line:e,index:0},a=()=>{for(;t.index<e.length&&ke(e[t.index]);)t.index+=1};for(let n=0;n<9;n+=1){if(a(),t.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const s=F(t);if(!s)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:c,column:i}=s;if(!xe(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${n+1}`,column:i};if(c==="X"){o.push({rolls:[M("X",10,i)],isStrike:!0,isSpare:!1});continue}const m=D(c),f=F(t);if(!f)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:l,column:d}=f;if(l==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:d};if(l==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:d};const $=10-m;o.push({rolls:[M(c,m,i),M("/",$,d)],isStrike:!1,isSpare:!0});continue}if(!fe.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${n+1}`,column:d};const p=D(l);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:d};o.push({rolls:[M(c,m,i),M(l,p,d)],isStrike:!1,isSpare:!1})}if(a(),t.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Ze(t,e);return r.kind==="error"?r:(o.push(r.frame),a(),t.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:t.index+1}:{kind:"success",frames:o})}function Ze(e,o){const t=F(e);if(!t)return{kind:"error",message:"Frame 10 is missing",column:o.length+1};const{char:a,column:r}=t;if(!xe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Qe(e,r);const n=D(a),s=F(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:o.length+1};const{char:c,column:i}=s;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:i};if(c==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:i};const f=10-n,l=F(e);if(!l)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:o.length+1};const{char:d,column:p}=l;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!ue(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:p};const $=d==="X"?10:D(d);return{kind:"success",frame:{rolls:[M(a,n,r),M("/",f,i),M(d,$,p)],isStrike:!1,isSpare:!0}}}if(!fe.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:i};const m=D(c);return n+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:i}:{kind:"success",frame:{rolls:[M(a,n,r),M(c,m,i)],isStrike:!1,isSpare:!1}}}function Qe(e,o){const t=F(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:o};const{char:a,column:r}=t;if(!ue(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;a==="X"?n=10:n=D(a);const s=F(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:c,column:i}=s;if(!ue(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:i};let m;if(c==="X")m=10;else if(c==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:i};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:i};m=10-n}else if(m=D(c),a!=="X"&&n+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:i};return{kind:"success",frame:{rolls:[M("X",10,o),M(a,n,r),M(c,m,i)],isStrike:!0,isSpare:!1}}}function K(e){const o=[],t=[],a=[];for(const s of e){for(const c of s.rolls)o.push(c.value);t.push(s.isStrike),a.push(s.isSpare)}let r=0,n=0;for(let s=0;s<10;s+=1)t[s]?(r+=10+(o[n+1]??0)+(o[n+2]??0),n+=1):a[s]?(r+=10+(o[n+2]??0),n+=2):(r+=(o[n]??0)+(o[n+1]??0),n+=2);return r}function et(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const o=e.slice(0,9),t=e[9],a=[];function r(n,s){if(s===1){a.push([...n,t]);return}for(let c=0;c<s;c++)r(n,s-1),s%2===0?[n[c],n[s-1]]=[n[s-1],n[c]]:[n[0],n[s-1]]=[n[s-1],n[0]]}return r(o,o.length),a}function tt(e){const o=et(e),t=o.map(h=>K(h)),a=K(e);t.sort((h,S)=>h-S);const r=t[0],n=t[t.length-1],c=t.reduce((h,S)=>h+S,0)/t.length,i=Math.floor(t.length/2),m=t.length%2===0?(t[i-1]+t[i])/2:t[i],f=new Map;for(const h of t)f.set(h,(f.get(h)||0)+1);let l=0;for(const h of f.values())h>l&&(l=h);const d=[];for(const[h,S]of f)S===l&&d.push(h);d.sort((h,S)=>h-S);const p=[];for(const[h,S]of f)p.push({score:h,count:S,frequency:S/t.length});p.sort((h,S)=>h.score-S.score);const $=t.filter(h=>h<=a).length,k=Math.round($/t.length*100*100)/100,w=t.reduce((h,S)=>h+Math.pow(S-c,2),0)/t.length,x=Math.sqrt(w),q=x===0?0:(a-c)/x,E=t.reduce((h,S)=>h+Math.pow((S-c)/x,3),0),T=x===0?0:E/t.length;return{min:r,max:n,mean:Math.round(c*100)/100,median:m,mode:d,permutationCount:o.length,histogram:p,actualPercentile:k,zScore:Math.round(q*100)/100,skewness:Math.round(T*100)/100,standardDeviation:Math.round(x*100)/100}}function J(e){const o=[],t=[],a=[];for(const c of e){for(const i of c.rolls)o.push(i.value);t.push(c.isStrike),a.push(c.isSpare)}const r=[];let n=0,s=0;for(let c=0;c<10;c+=1){const i=e[c];let m=0,f=0,l="";t[c]?(m=10+(o[n+1]??0)+(o[n+2]??0),f=10,c===9?l=i.rolls.map(d=>d.symbol).join(" "):l="X",n+=1):a[c]?(m=10+(o[n+2]??0),f=10,l=i.rolls.map(d=>d.symbol).join(""),n+=2):(m=(o[n]??0)+(o[n+1]??0),f=m,l=i.rolls.map(d=>d.symbol).join(""),n+=2),s+=m,r.push({frameNumber:c+1,pinsKnocked:f,scoreContribution:m,cumulativeScore:s,rollSymbols:l,isStrike:i.isStrike,isSpare:i.isSpare})}return r}function ot(e){if(e.length!==10)return[];const o=e.slice(0,9),t=e[9],a=J(e),r=[];for(let n=0;n<9;n++){const s=o[n],c=a[n].scoreContribution,i=[];for(let d=0;d<9;d++){const p=[...o];[p[n],p[d]]=[p[d],p[n]];const $=[...p,t],w=J($)[d].scoreContribution;i.push(w)}const m=i.reduce((d,p)=>d+p,0)/i.length,f=c-m;let l="";if(s.isStrike)f>5?l=`Lucky placement! Strike got strong bonuses (${Math.round(f)} pins above average for this position)`:f<-5?l=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(f))} pins below average)`:l=`Strike in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else if(s.isSpare)f>3?l=`Great timing! Spare got a strong bonus ball (${Math.round(f)} pins above average)`:f<-3?l=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(f))} pins below average)`:l=`Spare in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else{const d=s.rolls.reduce((p,$)=>p+$.value,0);Math.abs(f)<=.5?l=`Open frame (${d} pins) - position doesn't matter much`:l=`Open frame (${d} pins) - minimal positional impact`}r.push({frameNumber:n+1,actualContribution:c,averageContribution:Math.round(m*10)/10,positionBenefit:Math.round(f*10)/10,rollSymbols:a[n].rollSymbols,isStrike:s.isStrike,isSpare:s.isSpare,explanation:l})}return r}const Me="bowling_fortune_saved_games",pe="bowling_fortune_draft",Se=1e4;function st(e,o,t,a){const r=oe(),n={id:lt(),scores:e,description:o,league:t,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:dt(e)};return r.games.unshift(n),r.games.length>Se&&(r.games=r.games.slice(0,Se)),se(r),n}function z(){return oe().games}function nt(e){const o=oe();o.games=o.games.filter(t=>t.id!==e),se(o)}function rt(){se({version:1,games:[]})}function at(){const e=z(),o=new Set;for(const t of e)t.league&&t.league.trim()&&o.add(t.league.trim());return Array.from(o).sort()}function it(){const e=oe();return JSON.stringify(e,null,2)}function ct(e){try{const o=JSON.parse(e);if(!o.version||!Array.isArray(o.games))return{success:!1,count:0,error:"Invalid file format"};for(const t of o.games)if(!t.id||!t.scores||typeof t.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return se(o),{success:!0,count:o.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function oe(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function se(e){try{localStorage.setItem(Me,JSON.stringify(e))}catch(o){throw o instanceof DOMException&&o.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",o),o}}function lt(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function dt(e){try{const o=e.trim().split(`
`).filter(a=>a.trim());let t=0;for(const a of o){const r=Le(a);if(r.kind==="error")return;t+=K(r.frames)}return t}catch{return}}function ut(e){try{e.trim()?localStorage.setItem(pe,e):he()}catch(o){console.error("Failed to save draft",o)}}function mt(){try{return localStorage.getItem(pe)}catch(e){return console.error("Failed to load draft",e),null}}function he(){try{localStorage.removeItem(pe)}catch(e){console.error("Failed to clear draft",e)}}function ft(e){const o=[],a=e.split(/<span class="title-headlines">Game \d+<\/span>/).slice(1);if(a.length===0)throw new Error("No games found in LaneTalk HTML");for(const n of a){const s=[],c=n.matchAll(/<div class="frame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/gs);for(const m of c){const f=m[1],l=pt(f);s.push(l)}const i=n.match(/<div class="lastFrame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/s);if(i){const m=i[1],f=ht(m);s.push(f)}if(s.length!==10)throw new Error(`Expected 10 frames, found ${s.length}`);o.push({frames:s.join(" ")})}const r=gt(e);return{games:o,metadata:r}}function pt(e){const o=e.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g),t=[];for(const r of o)t.push(r[1]);return e.includes('<div class="triangle"></div>')&&t.length===1&&t.push("/"),t.join("")}function ht(e){const o=e.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g),t=[];for(const r of o)t.push(r[1]);const a=(e.match(/<div class="triangle"><\/div>/g)||[]).length;for(let r=0;r<a;r++)t.push("/");return t.join("")}function gt(e){const o={},t=e.match(/<h1>([^<]+)<\/h1>/);t&&(o.bowler=t[1].trim());const a=e.match(/<h2>([^<]*(?:AM|PM)[^<]*)<\/h2>/);a&&(o.date=a[1].trim());const r=e.match(/<h2 class="name">([^<]+)<\/h2>/);r&&(o.location=r[1].trim());const n=e.match(/<span>Total<\/span>\s*<h2>(\d+)<\/h2>/s);n&&(o.total=parseInt(n[1],10));const s=e.match(/<span>Average<\/span>\s*<h2>(\d+)<\/h2>/s);return s&&(o.average=parseInt(s[1],10)),o}function vt(e){try{return new URL(e).hostname==="shared.lanetalk.com"}catch{return!1}}const $e=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],we=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],bt=.001,Te=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],Ee=document.querySelector("#app");if(!Ee)throw new Error("Failed to find app container");Ee.innerHTML=`
  <h1>Bowling Fortune Teller 🎳</h1>
  <div class="brought-to-you">
    brought to you by <img src="/logo.png" alt="Pocket Penetration" class="sponsor-logo">
  </div>
  <!-- LaneTalk Import Section -->
  <div class="lanetalk-import-section">
    <div class="lanetalk-import-row">
      <input
        type="url"
        id="lanetalk-url"
        placeholder="http://shared.lanetalk.com/7c733....."
      />
      <button type="button" id="lanetalk-import-btn" class="secondary-btn">Import from LaneTalk</button>
    </div>
    <div id="lanetalk-status" class="lanetalk-status" role="status" aria-live="polite"></div>
  </div>

  <label for="scores-input">
    Or enter frame-by-frame notation:
    <button type="button" id="help-icon" class="help-icon" aria-label="Show help" title="Show valid characters">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <text x="8" y="12" text-anchor="middle" font-size="11" font-weight="bold">?</text>
      </svg>
    </button>
  </label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="7" cols="50"></textarea>
  <div class="textarea-footer">
    <div class="left-buttons">
      <div class="example-dropdown-container">
        <button id="example-btn" type="button" class="secondary-btn example-btn" aria-haspopup="true" aria-expanded="false">
          Try an example
          <span class="dropdown-arrow">▼</span>
        </button>
        <div id="example-dropdown" class="example-dropdown" role="menu" aria-hidden="true">
          ${Te.map((e,o)=>`
            <button type="button" class="dropdown-item" data-example-index="${o}" role="menuitem">
              <strong>${e.name}</strong>
              <span class="dropdown-item-desc">${e.description}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <button id="clear-btn" type="button" class="secondary-btn">Clear</button>
    </div>
    <div class="right-buttons">
      <button id="save-btn" type="button" class="secondary-btn">💾 Save</button>
      <button id="saved-games-btn" type="button" class="secondary-btn">
        📋 Saved Games <span id="saved-count"></span>
      </button>
    </div>
  </div>
  <div id="scores-help" class="help-dialog" role="dialog" aria-labelledby="help-dialog-title" aria-hidden="true">
    <div class="help-dialog-content">
      <div class="help-dialog-header">
        <h3 id="help-dialog-title">Valid Characters</h3>
        <button type="button" id="help-close-btn" class="help-close-btn" aria-label="Close help">&times;</button>
      </div>
      <div class="help-dialog-body">
        <p>Enter frame-by-frame scores. Use spaces or commas to separate frames.</p>
        <p>Enter one game per line.</p>
        <p><strong>Valid characters:</strong></p>
        <ul>
          <li><strong>0-9</strong> - Number of pins knocked down</li>
          <li><strong>/</strong> - Spare (knocked down remaining pins)</li>
          <li><strong>X</strong> - Strike (knocked down all 10 pins)</li>
          <li><strong>-</strong> - Gutter ball (counts the same as 0)</li>
        </ul>
      </div>
    </div>
  </div>
  <div id="help-dialog-overlay" class="help-dialog-overlay"></div>
  <button id="submit" type="button">Tell My Bowling Fortune</button>
  <div id="feedback" role="status" aria-live="polite"></div>
  <footer class="version">
    <p>Build: 2025-11-01 02:00:29 CT</p>
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
`;const y=document.querySelector("#scores-input"),U=document.querySelector("#submit"),Ce=document.querySelector("#clear-btn"),P=document.querySelector("#example-btn"),I=document.querySelector("#example-dropdown"),C=document.querySelector("#feedback"),W=document.querySelector("#lanetalk-url"),Z=document.querySelector("#lanetalk-import-btn"),Y=document.querySelector("#lanetalk-status"),Ae=document.querySelector("#help-icon"),B=document.querySelector("#scores-help"),ne=document.querySelector("#help-dialog-overlay"),Xe=document.querySelector("#help-close-btn"),Ie=document.querySelector("#save-btn"),qe=document.querySelector("#saved-games-btn"),Fe=document.querySelector("#saved-count"),N=document.querySelector("#save-modal-overlay"),De=document.querySelector("#save-form"),Q=document.querySelector("#save-description"),ge=document.querySelector("#save-league"),Be=document.querySelector("#league-list"),ee=document.querySelector("#save-date"),Ne=document.querySelector("#save-cancel-btn"),_=document.querySelector("#saved-games-sidebar"),re=document.querySelector("#sidebar-overlay"),Pe=document.querySelector("#sidebar-close-btn"),ae=document.querySelector("#search-saved-games"),Ge=document.querySelector("#export-btn"),Oe=document.querySelector("#import-btn"),j=document.querySelector("#import-file-input"),Re=document.querySelector("#clear-all-btn"),H=document.querySelector("#saved-games-list"),He=document.querySelector("#sidebar-saved-count");if(!y||!U||!Ce||!P||!I||!C||!W||!Z||!Y||!Ae||!B||!ne||!Xe||!Ie||!qe||!Fe||!N||!De||!Q||!ge||!Be||!ee||!Ne||!_||!re||!Pe||!ae||!Ge||!Oe||!j||!Re||!H||!He)throw new Error("Failed to initialise UI elements");Ce.addEventListener("click",()=>{y.value="",C.innerHTML="",he(),y.focus()});let le;function yt(e){le!==void 0&&clearTimeout(le),le=window.setTimeout(()=>{ut(e)},500)}y.addEventListener("input",()=>{yt(y.value)});let X=!1;function St(){X=!X,I.classList.toggle("show",X),P.setAttribute("aria-expanded",X.toString()),I.setAttribute("aria-hidden",(!X).toString())}function ve(){X=!1,I.classList.remove("show"),P.setAttribute("aria-expanded","false"),I.setAttribute("aria-hidden","true")}P.addEventListener("click",e=>{e.stopPropagation(),St()});const je=I.querySelectorAll(".dropdown-item");je.forEach(e=>{e.addEventListener("click",o=>{o.stopPropagation();const t=parseInt(e.getAttribute("data-example-index")||"0",10);y.value=Te[t].score,ve(),y.focus()})});document.addEventListener("click",e=>{const o=e.target;X&&!P.contains(o)&&!I.contains(o)&&ve()});I.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const o=Array.from(je),t=o.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=t<o.length-1?t+1:0:a=t>0?t-1:o.length-1,o[a]?.focus()}});function $t(){B.classList.add("show"),ne.classList.add("show"),B.setAttribute("aria-hidden","false")}function be(){B.classList.remove("show"),ne.classList.remove("show"),B.setAttribute("aria-hidden","true")}Ae.addEventListener("click",e=>{e.preventDefault(),$t()});Xe.addEventListener("click",be);ne.addEventListener("click",be);function R(e,o){Y.textContent=e,Y.className=`lanetalk-status ${o}`}function wt(){Y.textContent="",Y.className="lanetalk-status"}async function Ue(){const e=W.value.trim();if(!e){R("Please enter a LaneTalk URL","error");return}if(!vt(e)){R("Invalid LaneTalk URL. Must be from shared.lanetalk.com","error");return}Z.disabled=!0,R("Fetching games from LaneTalk...","loading");try{const o=`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,t=await fetch(o);if(!t.ok)throw new Error(`Failed to fetch: ${t.status} ${t.statusText}`);const a=await t.text(),r=ft(a);if(r.games.length===0)throw new Error("No games found in LaneTalk data");const n=r.games.map(c=>c.frames).join(`
`);y.value=n;const s=r.games.length===1?"game":"games";R(`✓ Successfully imported ${r.games.length} ${s}!`,"success"),W.value="",setTimeout(()=>{wt(),y.focus()},2e3)}catch(o){console.error("LaneTalk import error:",o);const t=o instanceof Error?o.message:"Unknown error";R(`Error: ${t}`,"error")}finally{Z.disabled=!1}}Z.addEventListener("click",Ue);W.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),Ue())});let de=0;function Ye(){if(Math.random()<bt){const o=Math.floor(Math.random()*we.length);U.textContent=we[o];return}U.textContent=$e[de],de=(de+1)%$e.length}Ye();setInterval(Ye,3e4);let ze="";function te(){if(!y.value.trim()){me("Please provide at least one game.",1,1);return}const e=y.value.replace(/\r/g,"").split(`
`),o=[];for(let t=0;t<e.length;t+=1){const a=e[t];if(!a.trim()){me(`Game ${t+1} is empty. Each line must contain exactly ten frames.`,t+1,1);return}const r=Le(a);if(r.kind==="error"){Tt(r,t,e);return}const n=K(r.frames),s=tt(r.frames);o.push({frames:r.frames,score:n,stats:s})}ze=y.value,Nt(o)}U.addEventListener("click",te);y.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),te())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(B.classList.contains("show")){be();return}if(_.classList.contains("show")){ce();return}if(N.classList.contains("show")){ie();return}if(X){ve(),P.focus();return}C.innerHTML&&(C.innerHTML="",y.focus())}});function V(){const o=z().length;Fe.innerHTML=o>0?`&nbsp;(${o})`:"",He.innerHTML=o>0?`&nbsp;(${o})`:""}function kt(){if(!y.value.trim()){L("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];ee.value=e,Q.value="",ge.value="";const o=at();Be.innerHTML=o.map(t=>`<option value="${t}">`).join(""),N.classList.add("show"),Q.focus()}function ie(){N.classList.remove("show")}function xt(){ae.value="",G(),_.classList.add("show"),re.classList.add("show")}function ce(){_.classList.remove("show"),re.classList.remove("show")}function G(){const e=ae.value.trim().toLowerCase();let o=z();if(e&&(o=o.filter(t=>{const a=(t.description||"").toLowerCase(),r=(t.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),o.length===0){H.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}H.innerHTML=o.map(t=>{const a=t.gameCount===1?"1 game":`${t.gameCount} games`,r=t.totalScore!==void 0?`🎯 ${t.totalScore}`:"⚠️ Invalid",n=t.description||"(No description)",s=t.league?`🏆 ${t.league}`:"";return`
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
    `}).join(""),H.querySelectorAll("[data-load-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-load-id");a&&Lt(a)})}),H.querySelectorAll("[data-delete-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-delete-id");a&&Mt(a)})})}function Lt(e){const t=z().find(a=>a.id===e);t&&(y.value=t.scores,ce(),U.click(),L("Game loaded!"))}function Mt(e){confirm("Delete this saved game?")&&(nt(e),V(),G(),L("Game deleted"))}Ie.addEventListener("click",kt);qe.addEventListener("click",xt);Ne.addEventListener("click",ie);Pe.addEventListener("click",ce);re.addEventListener("click",ce);ae.addEventListener("input",()=>{G()});N.addEventListener("click",e=>{e.target===N&&ie()});De.addEventListener("submit",e=>{e.preventDefault();const o=y.value.trim(),t=Q.value.trim()||void 0,a=ge.value.trim()||void 0;let r=ee.value||void 0;if(r){const n=new Date(r),s=new Date;if(s.setHours(0,0,0,0),n>s){L("Date cannot be in the future"),ee.focus();return}}try{st(o,t,a,r),ie(),he(),V(),_.classList.contains("show")&&G(),L("Game saved!")}catch(n){console.error("Failed to save game",n),L("Failed to save game")}});Re.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(rt(),V(),G(),L("All games deleted"))});Ge.addEventListener("click",()=>{const e=z();if(e.length===0){L("No games to export");return}const o=it(),t=new Blob([o],{type:"application/json"}),a=URL.createObjectURL(t),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),L(`Exported ${e.length} game${e.length===1?"":"s"}`)});Oe.addEventListener("click",()=>{j.click()});j.addEventListener("change",e=>{const o=e.target.files?.[0];if(!o)return;const t=new FileReader;t.onload=a=>{const r=a.target?.result,n=ct(r);n.success?(V(),G(),L(`Imported ${n.count} game${n.count===1?"":"s"}`)):L(n.error||"Import failed"),j.value=""},t.onerror=()=>{L("Failed to read file"),j.value=""},t.readAsText(o)});V();window.addEventListener("DOMContentLoaded",()=>{const o=new URLSearchParams(window.location.search).get("scores");if(o)try{const t=atob(o);y.value=t,te()}catch(t){console.error("Failed to decode scores from URL",t)}else{const t=mt();t&&(y.value=t,te())}});function Tt(e,o,t){const a=o+1,r=`Row ${a}, column ${e.column}: ${e.message}`,n=_e(t,o,e.column);me(r,a,e.column,n)}function _e(e,o,t){let a=0;for(let r=0;r<o;r+=1)a+=e[r].length+1;return a+(t-1)}function me(e,o,t,a){if(C.innerHTML="",C.className="error",C.textContent=e,y.focus(),typeof a=="number")y.setSelectionRange(a,a);else{const r=y.value.replace(/\r/g,"").split(`
`),n=_e(r,o-1,t);y.setSelectionRange(n,n)}}function Et(e){const{histogram:o,median:t}=e.stats,a=e.score,r=600,n=300,s={top:20,right:20,bottom:40,left:50},c=r-s.left-s.right,i=n-s.top-s.bottom,m=e.stats.min,f=e.stats.max,l=new Map(o.map(b=>[b.score,b])),d=[];for(let b=m;b<=f;b++){const v=l.get(b);d.push({score:b,count:v?.count??0,frequency:v?.frequency??0})}const p=Math.max(...d.map(b=>b.count)),$=Math.max(2,c/d.length),k=d.map((b,v)=>{const u=s.left+v*c/d.length,g=b.count/p*i,O=s.top+i-g,A=b.score===a;return`<rect
      x="${u}"
      y="${O}"
      width="${$}"
      height="${g}"
      fill="${A?"#fbbf24":"#60a5fa"}"
      opacity="${A?"1":"0.7"}"
    >
      <title>Score: ${b.score}
Count: ${b.count.toLocaleString()}
Frequency: ${(b.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),w=t-m,x=s.left+w*c/d.length+$/2,q=`
    <line x1="${x}" y1="${s.top}" x2="${x}" y2="${s.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,E=5,T=Array.from({length:E+1},(b,v)=>{const u=Math.round(p/E*v),g=s.top+i-v*i/E;return`
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
      ${k}
      ${q}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left+c}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${T}
      ${S}
      <text x="${s.left+c/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+i/2})">Count</text>
    </svg>
  `}function Ct(e,o,t){return e>=95?"🏆":t===o?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function At(e){const{zScore:o,actualPercentile:t,skewness:a,median:r}=e.stats;e.score-e.stats.median;let s=`${Ct(t,r,e.score)} `;return Math.abs(o)<.5?s+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":o>=2?s+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":o<=-2?s+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":o>1?s+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":o<-1?s+="Your score was <strong>notably below average</strong> — your frame order worked against you.":o>0?s+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",t>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":t>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":t<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":t<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function Ve(e){let o=new Map;for(const t of e[0].stats.histogram)o.set(t.score,t.count);for(let t=1;t<e.length;t++){const a=new Map;for(const[r,n]of o)for(const s of e[t].stats.histogram){const c=r+s.score,i=n*s.count;a.set(c,(a.get(c)||0)+i)}o=a}return o}function Xt(e,o){const t=Ve(e),a=[];for(const[u,g]of t)a.push({score:u,count:g});a.sort((u,g)=>u.score-g.score);const r=600,n=300,s={top:20,right:20,bottom:40,left:50},c=r-s.left-s.right,i=n-s.top-s.bottom,m=a[0].score,f=a[a.length-1].score,l=new Map(a.map(u=>[u.score,u])),d=[];for(let u=m;u<=f;u++){const g=l.get(u);d.push({score:u,count:g?.count??0})}const p=Math.max(...d.map(u=>u.count)),$=Array.from(t.values()).reduce((u,g)=>u+g,0);let k=0,w=0;for(const u of a)if(k+=u.count,k>=$/2){w=u.score;break}const x=Math.max(2,c/d.length),q=d.map((u,g)=>{const O=s.left+g*c/d.length,A=u.count/p*i,Ke=s.top+i-A,ye=u.score===o;return`<rect
      x="${O}"
      y="${Ke}"
      width="${x}"
      height="${A}"
      fill="${ye?"#fbbf24":"#60a5fa"}"
      opacity="${ye?"1":"0.7"}"
    >
      <title>Series Score: ${u.score}
Combinations: ${u.count.toLocaleString()}</title>
    </rect>`}).join(""),E=w-m,T=s.left+E*c/d.length+x/2,h=`
    <line x1="${T}" y1="${s.top}" x2="${T}" y2="${s.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${T}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,S="",b=Math.min(10,Math.ceil((f-m)/20)),v=b===0?`
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:b+1},(u,g)=>{const O=Math.round(m+(f-m)/b*g),A=s.left+g*c/b;return`
        <line x1="${A}" y1="${s.top+i}" x2="${A}" y2="${s.top+i+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${A}" y="${s.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${O}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${q}
      ${h}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+i}" x2="${s.left+c}" y2="${s.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${S}
      ${v}
      <text x="${s.left+c/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function It(e){if(e.length<2)return"";const o=e.reduce((u,g)=>u+g.score,0),t=Math.round(o/e.length*100)/100,a=Ve(e),r=[];for(const[u,g]of a)r.push({score:u,count:g});r.sort((u,g)=>u.score-g.score);const n=Array.from(a.values()).reduce((u,g)=>u+g,0),s=r[0].score,c=r[r.length-1].score;let i=0;for(const u of r)i+=u.score*u.count;const m=i/n;let f=0,l=0;for(const u of r)if(f+=u.count,f>=n/2){l=u.score;break}const d=r.filter(u=>u.score<=o).reduce((u,g)=>u+g.count,0),p=Math.round(d/n*100*100)/100;let $=0;for(const u of r)$+=Math.pow(u.score-m,2)*u.count;const k=Math.sqrt($/n),w=k===0?0:(o-m)/k;let x=0;for(const u of r)x+=Math.pow((u.score-m)/k,3)*u.count;const q=k===0?0:x/n;let E=0;for(const u of r)u.count>E&&(E=u.count);const T=[];for(const u of r)u.count===E&&T.push(u.score);const h=o-l,S=h>=0?`+${h}`:`${h}`,b=T.length===1?T[0].toString():`${T.join(", ")} (multimodal)`;let v="";return Math.abs(w)<.5?v="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?v="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?v="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?v="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?v="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?v="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":v="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",p>=95?v+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":p>=75?v+=" You scored in the <strong>top quartile</strong> of possible combinations.":p<=5?v+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":p<=25&&(v+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${v}</p>
      </div>

      <div class="histogram-container">
        ${Xt(e,o)}
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
        <dd>${Math.round(w*100)/100}</dd>

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
        <dd>${Math.round(k*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(q*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${b}</dd>
      </dl>
    </article>
  `}function qt(){const e=btoa(ze),o=new URL(window.location.href);return o.search=`?scores=${encodeURIComponent(e)}`,o.toString()}function Ft(){const e=qt();navigator.clipboard.writeText(e).then(()=>{L("Link copied!")}).catch(o=>{console.error("Failed to copy link",o),L("Failed to copy link")})}function L(e){const o=document.querySelector(".toast");o&&o.remove();const t=document.createElement("div");t.className="toast",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.remove()},300)},2e3)}function Dt(e){return`
    <div class="complete-scorecard">
      <div class="scorecard-row">
        ${J(e).map(t=>`
            <div class="scorecard-full-frame ${t.frameNumber===10?"tenth-frame":""}">
              <div class="frame-number-label">${t.frameNumber}</div>
              <div class="frame-rolls-display">${t.rollSymbols}</div>
              <div class="frame-cumulative-score">${t.cumulativeScore}</div>
            </div>
          `).join("")}
      </div>
    </div>
  `}function Bt(e){const o=J(e),t=ot(e),a=3,r=-3,n=t.filter(l=>l.positionBenefit>=a).sort((l,d)=>d.positionBenefit-l.positionBenefit),s=t.filter(l=>l.positionBenefit<=r).sort((l,d)=>l.positionBenefit-d.positionBenefit);function c(){return`
      <div class="complete-scorecard">
        <div class="scorecard-row">
          ${o.map(l=>{const d=t.find(k=>k.frameNumber===l.frameNumber);let p="",$="";return d&&(d.positionBenefit>=a?(p="🍀",$="lucky-frame"):d.positionBenefit<=r&&(p="💔",$="unlucky-frame")),`
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
  `}function Nt(e){if(C.className="output",e.length===0){C.innerHTML="";return}const o=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,t=e.map((n,s)=>{const c=s+1,i=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,m=n.score-n.stats.median,f=m>=0?`+${m}`:`${m}`,l=At(n);return`
        <article class="result-card">
          <h2>Game ${c} - Score: ${n.score}</h2>

          <div class="narrative">
            <p>${l}</p>
          </div>

          ${Dt(n.frames)}

          <div class="histogram-container">
            ${Et(n)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <!-- ${Bt(n.frames)} -->

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
      `}).join(""),a=It(e);C.innerHTML=`
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
  `,C.querySelectorAll("[data-copy-link]").forEach(n=>{n.addEventListener("click",Ft)})}
