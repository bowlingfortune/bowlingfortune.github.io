(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const Je=new Set([" ","	",",",";"]),fe=new Set("0123456789-".split("")),We=new Set("0123456789-X/".split(""));function ke(e){return Je.has(e)}function F(e){const{line:t}=e;for(;e.index<t.length&&ke(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function D(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function xe(e){return e==="X"||fe.has(e)}function ue(e){return We.has(e)}function M(e,t,o){return{symbol:e,value:t,column:o}}function Le(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&ke(e[o.index]);)o.index+=1};for(let s=0;s<9;s+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${s+1}, but the line ended early`,column:e.length+1};const n=F(o);if(!n)return{kind:"error",message:`Expected frame ${s+1}, but found nothing`,column:e.length+1};const{char:i,column:c}=n;if(!xe(i))return{kind:"error",message:`Invalid roll '${i}' in frame ${s+1}`,column:c};if(i==="X"){t.push({rolls:[M("X",10,c)],isStrike:!0,isSpare:!1});continue}const m=D(i),f=F(o);if(!f)return{kind:"error",message:`Frame ${s+1} is missing a second roll`,column:e.length+1};const{char:l,column:d}=f;if(l==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${s+1}`,column:d};if(l==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${s+1} requires the first roll to be less than 10`,column:d};const $=10-m;t.push({rolls:[M(i,m,c),M("/",$,d)],isStrike:!1,isSpare:!0});continue}if(!fe.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${s+1}`,column:d};const p=D(l);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${s+1}`,column:d};t.push({rolls:[M(i,m,c),M(l,p,d)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=Ze(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function Ze(e,t){const o=F(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!xe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return Qe(e,r);const s=D(a),n=F(e);if(!n)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:i,column:c}=n;if(i==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(i==="/"){if(s>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const f=10-s,l=F(e);if(!l)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:d,column:p}=l;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!ue(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:p};const $=d==="X"?10:D(d);return{kind:"success",frame:{rolls:[M(a,s,r),M("/",f,c),M(d,$,p)],isStrike:!1,isSpare:!0}}}if(!fe.has(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:c};const m=D(i);return s+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[M(a,s,r),M(i,m,c)],isStrike:!1,isSpare:!1}}}function Qe(e,t){const o=F(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!ue(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let s;a==="X"?s=10:s=D(a);const n=F(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:i,column:c}=n;if(!ue(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:c};let m;if(i==="X")m=10;else if(i==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(s>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};m=10-s}else if(m=D(i),a!=="X"&&s+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[M("X",10,t),M(a,s,r),M(i,m,c)],isStrike:!0,isSpare:!1}}}function K(e){const t=[],o=[],a=[];for(const n of e){for(const i of n.rolls)t.push(i.value);o.push(n.isStrike),a.push(n.isSpare)}let r=0,s=0;for(let n=0;n<10;n+=1)o[n]?(r+=10+(t[s+1]??0)+(t[s+2]??0),s+=1):a[n]?(r+=10+(t[s+2]??0),s+=2):(r+=(t[s]??0)+(t[s+1]??0),s+=2);return r}function et(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(s,n){if(n===1){a.push([...s,o]);return}for(let i=0;i<n;i++)r(s,n-1),n%2===0?[s[i],s[n-1]]=[s[n-1],s[i]]:[s[0],s[n-1]]=[s[n-1],s[0]]}return r(t,t.length),a}function tt(e){const t=et(e),o=t.map(h=>K(h)),a=K(e);o.sort((h,y)=>h-y);const r=o[0],s=o[o.length-1],i=o.reduce((h,y)=>h+y,0)/o.length,c=Math.floor(o.length/2),m=o.length%2===0?(o[c-1]+o[c])/2:o[c],f=new Map;for(const h of o)f.set(h,(f.get(h)||0)+1);let l=0;for(const h of f.values())h>l&&(l=h);const d=[];for(const[h,y]of f)y===l&&d.push(h);d.sort((h,y)=>h-y);const p=[];for(const[h,y]of f)p.push({score:h,count:y,frequency:y/o.length});p.sort((h,y)=>h.score-y.score);const $=o.filter(h=>h<=a).length,k=Math.round($/o.length*100*100)/100,w=o.reduce((h,y)=>h+Math.pow(y-i,2),0)/o.length,x=Math.sqrt(w),q=x===0?0:(a-i)/x,E=o.reduce((h,y)=>h+Math.pow((y-i)/x,3),0),T=x===0?0:E/o.length;return{min:r,max:s,mean:Math.round(i*100)/100,median:m,mode:d,permutationCount:t.length,histogram:p,actualPercentile:k,zScore:Math.round(q*100)/100,skewness:Math.round(T*100)/100,standardDeviation:Math.round(x*100)/100}}function J(e){const t=[],o=[],a=[];for(const i of e){for(const c of i.rolls)t.push(c.value);o.push(i.isStrike),a.push(i.isSpare)}const r=[];let s=0,n=0;for(let i=0;i<10;i+=1){const c=e[i];let m=0,f=0,l="";o[i]?(m=10+(t[s+1]??0)+(t[s+2]??0),f=10,i===9?l=c.rolls.map(d=>d.symbol).join(" "):l="X",s+=1):a[i]?(m=10+(t[s+2]??0),f=10,l=c.rolls.map(d=>d.symbol).join(""),s+=2):(m=(t[s]??0)+(t[s+1]??0),f=m,l=c.rolls.map(d=>d.symbol).join(""),s+=2),n+=m,r.push({frameNumber:i+1,pinsKnocked:f,scoreContribution:m,cumulativeScore:n,rollSymbols:l,isStrike:c.isStrike,isSpare:c.isSpare})}return r}function ot(e){if(e.length!==10)return[];const t=e.slice(0,9),o=e[9],a=J(e),r=[];for(let s=0;s<9;s++){const n=t[s],i=a[s].scoreContribution,c=[];for(let d=0;d<9;d++){const p=[...t];[p[s],p[d]]=[p[d],p[s]];const $=[...p,o],w=J($)[d].scoreContribution;c.push(w)}const m=c.reduce((d,p)=>d+p,0)/c.length,f=i-m;let l="";if(n.isStrike)f>5?l=`Lucky placement! Strike got strong bonuses (${Math.round(f)} pins above average for this position)`:f<-5?l=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(f))} pins below average)`:l=`Strike in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else if(n.isSpare)f>3?l=`Great timing! Spare got a strong bonus ball (${Math.round(f)} pins above average)`:f<-3?l=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(f))} pins below average)`:l=`Spare in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else{const d=n.rolls.reduce((p,$)=>p+$.value,0);Math.abs(f)<=.5?l=`Open frame (${d} pins) - position doesn't matter much`:l=`Open frame (${d} pins) - minimal positional impact`}r.push({frameNumber:s+1,actualContribution:i,averageContribution:Math.round(m*10)/10,positionBenefit:Math.round(f*10)/10,rollSymbols:a[s].rollSymbols,isStrike:n.isStrike,isSpare:n.isSpare,explanation:l})}return r}const Me="bowling_fortune_saved_games",pe="bowling_fortune_draft",Se=1e4;function st(e,t,o,a){const r=oe(),s={id:lt(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(n=>n.trim()).length,totalScore:dt(e)};return r.games.unshift(s),r.games.length>Se&&(r.games=r.games.slice(0,Se)),se(r),s}function z(){return oe().games}function nt(e){const t=oe();t.games=t.games.filter(o=>o.id!==e),se(t)}function rt(){se({version:1,games:[]})}function at(){const e=z(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function it(){const e=oe();return JSON.stringify(e,null,2)}function ct(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return se(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function oe(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function se(e){try{localStorage.setItem(Me,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function lt(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function dt(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const r=Le(a);if(r.kind==="error")return;o+=K(r.frames)}return o}catch{return}}function ut(e){try{e.trim()?localStorage.setItem(pe,e):he()}catch(t){console.error("Failed to save draft",t)}}function mt(){try{return localStorage.getItem(pe)}catch(e){return console.error("Failed to load draft",e),null}}function he(){try{localStorage.removeItem(pe)}catch(e){console.error("Failed to clear draft",e)}}function ft(e){const t=[],a=e.split(/<span class="title-headlines">Game \d+<\/span>/).slice(1);if(a.length===0)throw new Error("No games found in LaneTalk HTML");for(const s of a){const n=[],i=s.matchAll(/<div class="frame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/gs);for(const m of i){const f=m[1],l=pt(f);n.push(l)}const c=s.match(/<div class="lastFrame">(.*?)<div class="score">/s);if(c){const m=c[1],f=ht(m);n.push(f)}if(n.length!==10)throw new Error(`Expected 10 frames, found ${n.length}`);t.push({frames:n.join(" ")})}const r=gt(e);return{games:t,metadata:r}}function pt(e){const t=e.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g),o=[];for(const r of t)o.push(r[1]);return e.includes('<div class="triangle"></div>')&&o.length===1&&o.push("/"),o.join("")}function ht(e){const t=[],o=e.matchAll(/<div class="throws">(.*?)<\/div>(?:\s*<\/div>)?/gs);for(const a of o){const r=a[1];if(r.includes('<div class="triangle">'))t.push("/");else{const s=r.match(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/);s&&t.push(s[1])}}return t.join("")}function gt(e){const t={},o=e.match(/<h1>([^<]+)<\/h1>/);o&&(t.bowler=o[1].trim());const a=e.match(/<h2>([^<]*(?:AM|PM)[^<]*)<\/h2>/);a&&(t.date=a[1].trim());const r=e.match(/<h2 class="name">([^<]+)<\/h2>/);r&&(t.location=r[1].trim());const s=e.match(/<span>Total<\/span>\s*<h2>(\d+)<\/h2>/s);s&&(t.total=parseInt(s[1],10));const n=e.match(/<span>Average<\/span>\s*<h2>(\d+)<\/h2>/s);return n&&(t.average=parseInt(n[1],10)),t}function vt(e){try{return new URL(e).hostname==="shared.lanetalk.com"}catch{return!1}}const $e=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],we=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],bt=.001,Te=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
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
          ${Te.map((e,t)=>`
            <button type="button" class="dropdown-item" data-example-index="${t}" role="menuitem">
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
    <p>Build: 2025-11-06 17:16:49 CT</p>
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
`;const S=document.querySelector("#scores-input"),U=document.querySelector("#submit"),Ce=document.querySelector("#clear-btn"),P=document.querySelector("#example-btn"),I=document.querySelector("#example-dropdown"),C=document.querySelector("#feedback"),W=document.querySelector("#lanetalk-url"),Z=document.querySelector("#lanetalk-import-btn"),Y=document.querySelector("#lanetalk-status"),Ae=document.querySelector("#help-icon"),B=document.querySelector("#scores-help"),ne=document.querySelector("#help-dialog-overlay"),Xe=document.querySelector("#help-close-btn"),Ie=document.querySelector("#save-btn"),qe=document.querySelector("#saved-games-btn"),Fe=document.querySelector("#saved-count"),N=document.querySelector("#save-modal-overlay"),De=document.querySelector("#save-form"),Q=document.querySelector("#save-description"),ge=document.querySelector("#save-league"),Be=document.querySelector("#league-list"),ee=document.querySelector("#save-date"),Ne=document.querySelector("#save-cancel-btn"),_=document.querySelector("#saved-games-sidebar"),re=document.querySelector("#sidebar-overlay"),Pe=document.querySelector("#sidebar-close-btn"),ae=document.querySelector("#search-saved-games"),Ge=document.querySelector("#export-btn"),Oe=document.querySelector("#import-btn"),j=document.querySelector("#import-file-input"),Re=document.querySelector("#clear-all-btn"),H=document.querySelector("#saved-games-list"),He=document.querySelector("#sidebar-saved-count");if(!S||!U||!Ce||!P||!I||!C||!W||!Z||!Y||!Ae||!B||!ne||!Xe||!Ie||!qe||!Fe||!N||!De||!Q||!ge||!Be||!ee||!Ne||!_||!re||!Pe||!ae||!Ge||!Oe||!j||!Re||!H||!He)throw new Error("Failed to initialise UI elements");Ce.addEventListener("click",()=>{S.value="",C.innerHTML="",he(),S.focus()});let le;function yt(e){le!==void 0&&clearTimeout(le),le=window.setTimeout(()=>{ut(e)},500)}S.addEventListener("input",()=>{yt(S.value)});let X=!1;function St(){X=!X,I.classList.toggle("show",X),P.setAttribute("aria-expanded",X.toString()),I.setAttribute("aria-hidden",(!X).toString())}function ve(){X=!1,I.classList.remove("show"),P.setAttribute("aria-expanded","false"),I.setAttribute("aria-hidden","true")}P.addEventListener("click",e=>{e.stopPropagation(),St()});const je=I.querySelectorAll(".dropdown-item");je.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);S.value=Te[o].score,ve(),S.focus()})});document.addEventListener("click",e=>{const t=e.target;X&&!P.contains(t)&&!I.contains(t)&&ve()});I.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(je),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});function $t(){B.classList.add("show"),ne.classList.add("show"),B.setAttribute("aria-hidden","false")}function be(){B.classList.remove("show"),ne.classList.remove("show"),B.setAttribute("aria-hidden","true")}Ae.addEventListener("click",e=>{e.preventDefault(),$t()});Xe.addEventListener("click",be);ne.addEventListener("click",be);function R(e,t){Y.textContent=e,Y.className=`lanetalk-status ${t}`}function wt(){Y.textContent="",Y.className="lanetalk-status"}async function Ue(){const e=W.value.trim();if(!e){R("Please enter a LaneTalk URL","error");return}if(!vt(e)){R("Invalid LaneTalk URL. Must be from shared.lanetalk.com","error");return}Z.disabled=!0,R("Fetching games from LaneTalk...","loading");try{const t=`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,o=await fetch(t);if(!o.ok)throw new Error(`Failed to fetch: ${o.status} ${o.statusText}`);const a=await o.text(),r=ft(a);if(r.games.length===0)throw new Error("No games found in LaneTalk data");const s=r.games.map(i=>i.frames).join(`
`);S.value=s;const n=r.games.length===1?"game":"games";R(`✓ Successfully imported ${r.games.length} ${n}!`,"success"),W.value="",setTimeout(()=>{wt(),S.focus()},2e3)}catch(t){console.error("LaneTalk import error:",t);const o=t instanceof Error?t.message:"Unknown error";R(`Error: ${o}`,"error")}finally{Z.disabled=!1}}Z.addEventListener("click",Ue);W.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),Ue())});let de=0;function Ye(){if(Math.random()<bt){const t=Math.floor(Math.random()*we.length);U.textContent=we[t];return}U.textContent=$e[de],de=(de+1)%$e.length}Ye();setInterval(Ye,3e4);let ze="";function te(){if(!S.value.trim()){me("Please provide at least one game.",1,1);return}const e=S.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){me(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=Le(a);if(r.kind==="error"){Tt(r,o,e);return}const s=K(r.frames),n=tt(r.frames);t.push({frames:r.frames,score:s,stats:n})}ze=S.value,Nt(t)}U.addEventListener("click",te);S.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),te())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(B.classList.contains("show")){be();return}if(_.classList.contains("show")){ce();return}if(N.classList.contains("show")){ie();return}if(X){ve(),P.focus();return}C.innerHTML&&(C.innerHTML="",S.focus())}});function V(){const t=z().length;Fe.innerHTML=t>0?`&nbsp;(${t})`:"",He.innerHTML=t>0?`&nbsp;(${t})`:""}function kt(){if(!S.value.trim()){L("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];ee.value=e,Q.value="",ge.value="";const t=at();Be.innerHTML=t.map(o=>`<option value="${o}">`).join(""),N.classList.add("show"),Q.focus()}function ie(){N.classList.remove("show")}function xt(){ae.value="",G(),_.classList.add("show"),re.classList.add("show")}function ce(){_.classList.remove("show"),re.classList.remove("show")}function G(){const e=ae.value.trim().toLowerCase();let t=z();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),r=(o.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),t.length===0){H.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}H.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,r=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",s=o.description||"(No description)",n=o.league?`🏆 ${o.league}`:"";return`
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
    `}).join(""),H.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&Lt(a)})}),H.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&Mt(a)})})}function Lt(e){const o=z().find(a=>a.id===e);o&&(S.value=o.scores,ce(),U.click(),L("Game loaded!"))}function Mt(e){confirm("Delete this saved game?")&&(nt(e),V(),G(),L("Game deleted"))}Ie.addEventListener("click",kt);qe.addEventListener("click",xt);Ne.addEventListener("click",ie);Pe.addEventListener("click",ce);re.addEventListener("click",ce);ae.addEventListener("input",()=>{G()});N.addEventListener("click",e=>{e.target===N&&ie()});De.addEventListener("submit",e=>{e.preventDefault();const t=S.value.trim(),o=Q.value.trim()||void 0,a=ge.value.trim()||void 0;let r=ee.value||void 0;if(r){const s=new Date(r),n=new Date;if(n.setHours(0,0,0,0),s>n){L("Date cannot be in the future"),ee.focus();return}}try{st(t,o,a,r),ie(),he(),V(),_.classList.contains("show")&&G(),L("Game saved!")}catch(s){console.error("Failed to save game",s),L("Failed to save game")}});Re.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(rt(),V(),G(),L("All games deleted"))});Ge.addEventListener("click",()=>{const e=z();if(e.length===0){L("No games to export");return}const t=it(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),L(`Exported ${e.length} game${e.length===1?"":"s"}`)});Oe.addEventListener("click",()=>{j.click()});j.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const r=a.target?.result,s=ct(r);s.success?(V(),G(),L(`Imported ${s.count} game${s.count===1?"":"s"}`)):L(s.error||"Import failed"),j.value=""},o.onerror=()=>{L("Failed to read file"),j.value=""},o.readAsText(t)});V();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);S.value=o,te()}catch(o){console.error("Failed to decode scores from URL",o)}else{const o=mt();o&&(S.value=o,te())}});function Tt(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,s=_e(o,t,e.column);me(r,a,e.column,s)}function _e(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function me(e,t,o,a){if(C.innerHTML="",C.className="error",C.textContent=e,S.focus(),typeof a=="number")S.setSelectionRange(a,a);else{const r=S.value.replace(/\r/g,"").split(`
`),s=_e(r,t-1,o);S.setSelectionRange(s,s)}}function Et(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,s=300,n={top:20,right:20,bottom:40,left:50},i=r-n.left-n.right,c=s-n.top-n.bottom,m=e.stats.min,f=e.stats.max,l=new Map(t.map(b=>[b.score,b])),d=[];for(let b=m;b<=f;b++){const v=l.get(b);d.push({score:b,count:v?.count??0,frequency:v?.frequency??0})}const p=Math.max(...d.map(b=>b.count)),$=Math.max(2,i/d.length),k=d.map((b,v)=>{const u=n.left+v*i/d.length,g=b.count/p*c,O=n.top+c-g,A=b.score===a;return`<rect
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
    </rect>`}).join(""),w=o-m,x=n.left+w*i/d.length+$/2,q=`
    <line x1="${x}" y1="${n.top}" x2="${x}" y2="${n.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,E=5,T=Array.from({length:E+1},(b,v)=>{const u=Math.round(p/E*v),g=n.top+c-v*c/E;return`
      <line x1="${n.left-5}" y1="${g}" x2="${n.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${u.toLocaleString()}</text>
    `}).join(""),h=Math.min(10,Math.ceil((f-m)/10)),y=h===0?`
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:h+1},(b,v)=>{const u=Math.round(m+(f-m)/h*v),g=n.left+v*i/h;return`
        <line x1="${g}" y1="${n.top+c}" x2="${g}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${g}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${u}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${k}
      ${q}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left+i}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${T}
      ${y}
      <text x="${n.left+i/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${n.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${n.top+c/2})">Count</text>
    </svg>
  `}function Ct(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function At(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats,s=e.score-e.stats.median;let i=`${Ct(o,r,e.score)} `;Math.abs(t)<.5?i+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?i+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?i+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?i+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?i+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?i+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":i+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?i+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?i+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?i+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(i+=" You scored in the <strong>bottom quartile</strong> of possible orderings.");const c=s>=0?`+${s}`:`${s}`;return i+=` Your actual score was <strong>${c} pins</strong> from the median.`,i}function Ve(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,s]of t)for(const n of e[o].stats.histogram){const i=r+n.score,c=s*n.count;a.set(i,(a.get(i)||0)+c)}t=a}return t}function Xt(e,t){const o=Ve(e),a=[];for(const[u,g]of o)a.push({score:u,count:g});a.sort((u,g)=>u.score-g.score);const r=600,s=300,n={top:20,right:20,bottom:40,left:50},i=r-n.left-n.right,c=s-n.top-n.bottom,m=a[0].score,f=a[a.length-1].score,l=new Map(a.map(u=>[u.score,u])),d=[];for(let u=m;u<=f;u++){const g=l.get(u);d.push({score:u,count:g?.count??0})}const p=Math.max(...d.map(u=>u.count)),$=Array.from(o.values()).reduce((u,g)=>u+g,0);let k=0,w=0;for(const u of a)if(k+=u.count,k>=$/2){w=u.score;break}const x=Math.max(2,i/d.length),q=d.map((u,g)=>{const O=n.left+g*i/d.length,A=u.count/p*c,Ke=n.top+c-A,ye=u.score===t;return`<rect
      x="${O}"
      y="${Ke}"
      width="${x}"
      height="${A}"
      fill="${ye?"#fbbf24":"#60a5fa"}"
      opacity="${ye?"1":"0.7"}"
    >
      <title>Series Score: ${u.score}
Combinations: ${u.count.toLocaleString()}</title>
    </rect>`}).join(""),E=w-m,T=n.left+E*i/d.length+x/2,h=`
    <line x1="${T}" y1="${n.top}" x2="${T}" y2="${n.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${T}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,y="",b=Math.min(10,Math.ceil((f-m)/20)),v=b===0?`
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:b+1},(u,g)=>{const O=Math.round(m+(f-m)/b*g),A=n.left+g*i/b;return`
        <line x1="${A}" y1="${n.top+c}" x2="${A}" y2="${n.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${A}" y="${n.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${O}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${s}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${s}" fill="rgba(15, 23, 42, 0.5)" />
      ${q}
      ${h}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+c}" x2="${n.left+i}" y2="${n.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${v}
      <text x="${n.left+i/2}" y="${s-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function It(e){if(e.length<2)return"";const t=e.reduce((u,g)=>u+g.score,0),o=Math.round(t/e.length*100)/100,a=Ve(e),r=[];for(const[u,g]of a)r.push({score:u,count:g});r.sort((u,g)=>u.score-g.score);const s=Array.from(a.values()).reduce((u,g)=>u+g,0),n=r[0].score,i=r[r.length-1].score;let c=0;for(const u of r)c+=u.score*u.count;const m=c/s;let f=0,l=0;for(const u of r)if(f+=u.count,f>=s/2){l=u.score;break}const d=r.filter(u=>u.score<=t).reduce((u,g)=>u+g.count,0),p=Math.round(d/s*100*100)/100;let $=0;for(const u of r)$+=Math.pow(u.score-m,2)*u.count;const k=Math.sqrt($/s),w=k===0?0:(t-m)/k;let x=0;for(const u of r)x+=Math.pow((u.score-m)/k,3)*u.count;const q=k===0?0:x/s;let E=0;for(const u of r)u.count>E&&(E=u.count);const T=[];for(const u of r)u.count===E&&T.push(u.score);const h=t-l,y=h>=0?`+${h}`:`${h}`,b=T.length===1?T[0].toString():`${T.join(", ")} (multimodal)`;let v="";return Math.abs(w)<.5?v="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?v="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?v="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?v="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?v="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?v="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":v="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",p>=95?v+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":p>=75?v+=" You scored in the <strong>top quartile</strong> of possible combinations.":p<=5?v+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":p<=25&&(v+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),v+=` Your series total was <strong>${y} pins</strong> from the median.`,`
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
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${y}</dd>

        <dt>Minimum score:</dt>
        <dd>${n}</dd>

        <dt>Maximum score:</dt>
        <dd>${i}</dd>

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
  `}function qt(){const e=btoa(ze),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function Ft(){const e=qt();navigator.clipboard.writeText(e).then(()=>{L("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),L("Failed to copy link")})}function L(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function Dt(e){return`
    <div class="complete-scorecard">
      <div class="scorecard-row">
        ${J(e).map(o=>`
            <div class="scorecard-full-frame ${o.frameNumber===10?"tenth-frame":""}">
              <div class="frame-number-label">${o.frameNumber}</div>
              <div class="frame-rolls-display">${o.rollSymbols}</div>
              <div class="frame-cumulative-score">${o.cumulativeScore}</div>
            </div>
          `).join("")}
      </div>
    </div>
  `}function Bt(e){const t=J(e),o=ot(e),a=3,r=-3,s=o.filter(l=>l.positionBenefit>=a).sort((l,d)=>d.positionBenefit-l.positionBenefit),n=o.filter(l=>l.positionBenefit<=r).sort((l,d)=>l.positionBenefit-d.positionBenefit);function i(){return`
      <div class="complete-scorecard">
        <div class="scorecard-row">
          ${t.map(l=>{const d=o.find(k=>k.frameNumber===l.frameNumber);let p="",$="";return d&&(d.positionBenefit>=a?(p="🍀",$="lucky-frame"):d.positionBenefit<=r&&(p="💔",$="unlucky-frame")),`
              <div class="scorecard-full-frame ${l.frameNumber===10?"tenth-frame":""} ${$}">
                <div class="frame-number-label">${l.frameNumber}</div>
                ${p?`<div class="frame-emoji-indicator">${p}</div>`:""}
                <div class="frame-rolls-display">${l.rollSymbols}</div>
                <div class="frame-cumulative-score">${l.cumulativeScore}</div>
              </div>
            `}).join("")}
        </div>
      </div>
    `}const c=s.length>0?`
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

      ${i()}

      ${c}
      ${m}
      ${f}
    </div>
  `}function Nt(e){if(C.className="output",e.length===0){C.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((s,n)=>{const i=n+1,c=s.stats.mode.length===1?s.stats.mode[0].toString():`${s.stats.mode.join(", ")} (multimodal)`,m=s.score-s.stats.median,f=m>=0?`+${m}`:`${m}`,l=At(s);return`
        <article class="result-card">
          <h2>Game ${i} - Score: ${s.score}</h2>

          <div class="narrative">
            <p>${l}</p>
          </div>

          ${Dt(s.frames)}

          <div class="histogram-container">
            ${Et(s)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <!-- ${Bt(s.frames)} -->

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
            <dd>${c}</dd>
          </dl>
        </article>
      `}).join(""),a=It(e);C.innerHTML=`
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
  `,C.querySelectorAll("[data-copy-link]").forEach(s=>{s.addEventListener("click",Ft)})}
