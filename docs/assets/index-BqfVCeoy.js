(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const Qe=new Set([" ","	",",",";"]),fe=new Set("0123456789-".split("")),et=new Set("0123456789-X/".split(""));function ke(e){return Qe.has(e)}function D(e){const{line:t}=e;for(;e.index<t.length&&ke(t[e.index]);)e.index+=1;if(e.index>=t.length)return null;const o=e.index+1,a=t[e.index].toUpperCase();return e.index+=1,{char:a,column:o}}function F(e){if(e==="X")return 10;if(e==="-")return 0;const t=Number.parseInt(e,10);if(Number.isNaN(t))throw new Error(`Invalid roll symbol '${e}'`);if(t<0||t>9)throw new Error(`Invalid roll value '${e}'`);return t}function xe(e){return e==="X"||fe.has(e)}function ue(e){return et.has(e)}function M(e,t,o){return{symbol:e,value:t,column:o}}function Le(e){const t=[],o={line:e,index:0},a=()=>{for(;o.index<e.length&&ke(e[o.index]);)o.index+=1};for(let n=0;n<9;n+=1){if(a(),o.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const s=D(o);if(!s)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:i,column:c}=s;if(!xe(i))return{kind:"error",message:`Invalid roll '${i}' in frame ${n+1}`,column:c};if(i==="X"){t.push({rolls:[M("X",10,c)],isStrike:!0,isSpare:!1});continue}const m=F(i),f=D(o);if(!f)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:l,column:d}=f;if(l==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:d};if(l==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:d};const v=10-m;t.push({rolls:[M(i,m,c),M("/",v,d)],isStrike:!1,isSpare:!0});continue}if(!fe.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${n+1}`,column:d};const p=F(l);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:d};t.push({rolls:[M(i,m,c),M(l,p,d)],isStrike:!1,isSpare:!1})}if(a(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=tt(o,e);return r.kind==="error"?r:(t.push(r.frame),a(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:t})}function tt(e,t){const o=D(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const{char:a,column:r}=o;if(!xe(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:r};if(a==="X")return ot(e,r);const n=F(a),s=D(e);if(!s)return{kind:"error",message:"Frame 10 is missing a second roll",column:t.length+1};const{char:i,column:c}=s;if(i==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(i==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const f=10-n,l=D(e);if(!l)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:t.length+1};const{char:d,column:p}=l;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!ue(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:p};const v=d==="X"?10:F(d);return{kind:"success",frame:{rolls:[M(a,n,r),M("/",f,c),M(d,v,p)],isStrike:!1,isSpare:!0}}}if(!fe.has(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:c};const m=F(i);return n+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[M(a,n,r),M(i,m,c)],isStrike:!1,isSpare:!1}}}function ot(e,t){const o=D(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:a,column:r}=o;if(!ue(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;a==="X"?n=10:n=F(a);const s=D(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:i,column:c}=s;if(!ue(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:c};let m;if(i==="X")m=10;else if(i==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};m=10-n}else if(m=F(i),a!=="X"&&n+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[M("X",10,t),M(a,n,r),M(i,m,c)],isStrike:!0,isSpare:!1}}}function J(e){const t=[],o=[],a=[];for(const s of e){for(const i of s.rolls)t.push(i.value);o.push(s.isStrike),a.push(s.isSpare)}let r=0,n=0;for(let s=0;s<10;s+=1)o[s]?(r+=10+(t[n+1]??0)+(t[n+2]??0),n+=1):a[s]?(r+=10+(t[n+2]??0),n+=2):(r+=(t[n]??0)+(t[n+1]??0),n+=2);return r}function nt(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const t=e.slice(0,9),o=e[9],a=[];function r(n,s){if(s===1){a.push([...n,o]);return}for(let i=0;i<s;i++)r(n,s-1),s%2===0?[n[i],n[s-1]]=[n[s-1],n[i]]:[n[0],n[s-1]]=[n[s-1],n[0]]}return r(t,t.length),a}function st(e){const t=nt(e),o=t.map(h=>J(h)),a=J(e);o.sort((h,S)=>h-S);const r=o[0],n=o[o.length-1],i=o.reduce((h,S)=>h+S,0)/o.length,c=Math.floor(o.length/2),m=o.length%2===0?(o[c-1]+o[c])/2:o[c],f=new Map;for(const h of o)f.set(h,(f.get(h)||0)+1);let l=0;for(const h of f.values())h>l&&(l=h);const d=[];for(const[h,S]of f)S===l&&d.push(h);d.sort((h,S)=>h-S);const p=[];for(const[h,S]of f)p.push({score:h,count:S,frequency:S/o.length});p.sort((h,S)=>h.score-S.score);const v=o.filter(h=>h<=a).length,w=Math.round(v/o.length*100*100)/100,k=o.reduce((h,S)=>h+Math.pow(S-i,2),0)/o.length,x=Math.sqrt(k),q=x===0?0:(a-i)/x,E=o.reduce((h,S)=>h+Math.pow((S-i)/x,3),0),T=x===0?0:E/o.length;return{min:r,max:n,mean:Math.round(i*100)/100,median:m,mode:d,permutationCount:t.length,histogram:p,actualPercentile:w,zScore:Math.round(q*100)/100,skewness:Math.round(T*100)/100,standardDeviation:Math.round(x*100)/100}}function W(e){const t=[],o=[],a=[];for(const i of e){for(const c of i.rolls)t.push(c.value);o.push(i.isStrike),a.push(i.isSpare)}const r=[];let n=0,s=0;for(let i=0;i<10;i+=1){const c=e[i];let m=0,f=0,l="";o[i]?(m=10+(t[n+1]??0)+(t[n+2]??0),f=10,i===9?l=c.rolls.map(d=>d.symbol).join(" "):l="X",n+=1):a[i]?(m=10+(t[n+2]??0),f=10,l=c.rolls.map(d=>d.symbol).join(""),n+=2):(m=(t[n]??0)+(t[n+1]??0),f=m,l=c.rolls.map(d=>d.symbol).join(""),n+=2),s+=m,r.push({frameNumber:i+1,pinsKnocked:f,scoreContribution:m,cumulativeScore:s,rollSymbols:l,isStrike:c.isStrike,isSpare:c.isSpare})}return r}function rt(e){if(e.length!==10)return[];const t=e.slice(0,9),o=e[9],a=W(e),r=[];for(let n=0;n<9;n++){const s=t[n],i=a[n].scoreContribution,c=[];for(let d=0;d<9;d++){const p=[...t];[p[n],p[d]]=[p[d],p[n]];const v=[...p,o],k=W(v)[d].scoreContribution;c.push(k)}const m=c.reduce((d,p)=>d+p,0)/c.length,f=i-m;let l="";if(s.isStrike)f>5?l=`Lucky placement! Strike got strong bonuses (${Math.round(f)} pins above average for this position)`:f<-5?l=`Unlucky placement! Strike got weak bonuses (${Math.round(Math.abs(f))} pins below average)`:l=`Strike in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else if(s.isSpare)f>3?l=`Great timing! Spare got a strong bonus ball (${Math.round(f)} pins above average)`:f<-3?l=`Bad timing! Spare got a weak bonus ball (${Math.round(Math.abs(f))} pins below average)`:l=`Spare in neutral position (within ${Math.round(Math.abs(f))} pins of average)`;else{const d=s.rolls.reduce((p,v)=>p+v.value,0);Math.abs(f)<=.5?l=`Open frame (${d} pins) - position doesn't matter much`:l=`Open frame (${d} pins) - minimal positional impact`}r.push({frameNumber:n+1,actualContribution:i,averageContribution:Math.round(m*10)/10,positionBenefit:Math.round(f*10)/10,rollSymbols:a[n].rollSymbols,isStrike:s.isStrike,isSpare:s.isSpare,explanation:l})}return r}const Me="bowling_fortune_saved_games",pe="bowling_fortune_draft",Se=1e4;function at(e,t,o,a){const r=oe(),n={id:mt(),scores:e,description:t,league:o,date:a||new Date().toISOString().split("T")[0],savedAt:Date.now(),gameCount:e.trim().split(`
`).filter(s=>s.trim()).length,totalScore:ft(e)};return r.games.unshift(n),r.games.length>Se&&(r.games=r.games.slice(0,Se)),ne(r),n}function z(){return oe().games}function it(e){const t=oe();t.games=t.games.filter(o=>o.id!==e),ne(t)}function ct(){ne({version:1,games:[]})}function lt(){const e=z(),t=new Set;for(const o of e)o.league&&o.league.trim()&&t.add(o.league.trim());return Array.from(t).sort()}function dt(){const e=oe();return JSON.stringify(e,null,2)}function ut(e){try{const t=JSON.parse(e);if(!t.version||!Array.isArray(t.games))return{success:!1,count:0,error:"Invalid file format"};for(const o of t.games)if(!o.id||!o.scores||typeof o.savedAt!="number")return{success:!1,count:0,error:"Invalid game data in file"};return ne(t),{success:!0,count:t.games.length}}catch{return{success:!1,count:0,error:"Failed to parse JSON file"}}}function oe(){try{const e=localStorage.getItem(Me);return e?JSON.parse(e):{version:1,games:[]}}catch(e){return console.error("Failed to load saved games",e),{version:1,games:[]}}}function ne(e){try{localStorage.setItem(Me,JSON.stringify(e))}catch(t){throw t instanceof DOMException&&t.name==="QuotaExceededError"&&alert("Storage quota exceeded. Please delete some saved games."),console.error("Failed to save games",t),t}}function mt(){return`${Date.now()}_${Math.random().toString(36).substr(2,4)}`}function ft(e){try{const t=e.trim().split(`
`).filter(a=>a.trim());let o=0;for(const a of t){const r=Le(a);if(r.kind==="error")return;o+=J(r.frames)}return o}catch{return}}function pt(e){try{e.trim()?localStorage.setItem(pe,e):he()}catch(t){console.error("Failed to save draft",t)}}function ht(){try{return localStorage.getItem(pe)}catch(e){return console.error("Failed to load draft",e),null}}function he(){try{localStorage.removeItem(pe)}catch(e){console.error("Failed to clear draft",e)}}function gt(e){const t=[],a=e.split(/<span class="title-headlines">Game \d+<\/span>/).slice(1);if(a.length===0)throw new Error("No games found in LaneTalk HTML");for(const n of a){const s=[],i=n.matchAll(/<div class="frame">.*?<div class="throws">(.*?)<\/div>\s*<div class="score">/gs);for(const m of i){const f=m[1],l=vt(f);s.push(l)}const c=n.match(/<div class="lastFrame">(.*?)<div class="score">/s);if(c){const m=c[1],f=bt(m);s.push(f)}if(s.length!==10)throw new Error(`Expected 10 frames, found ${s.length}`);t.push({frames:s.join(" ")})}const r=yt(e);return{games:t,metadata:r}}function vt(e){const t=e.matchAll(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/g),o=[];for(const r of t)o.push(r[1]);return e.includes('<div class="triangle"></div>')&&o.length===1&&o.push("/"),o.join("")}function bt(e){const t=[],o=e.matchAll(/<div class="throws">(.*?)<\/div>(?:\s*<\/div>)?/gs);for(const a of o){const r=a[1];if(r.includes('<div class="triangle">'))t.push("/");else{const n=r.match(/font-size: 20px[^>]*>\s*([XxX\-0-9]+)\s*<\/span>/);n&&t.push(n[1])}}return t.join("")}function yt(e){const t={},o=e.match(/<h1>([^<]+)<\/h1>/);o&&(t.bowler=o[1].trim());const a=e.match(/<h2>([^<]*(?:AM|PM)[^<]*)<\/h2>/);a&&(t.date=a[1].trim());const r=e.match(/<h2 class="name">([^<]+)<\/h2>/);r&&(t.location=r[1].trim());const n=e.match(/<span>Total<\/span>\s*<h2>(\d+)<\/h2>/s);n&&(t.total=parseInt(n[1],10));const s=e.match(/<span>Average<\/span>\s*<h2>(\d+)<\/h2>/s);return s&&(t.average=parseInt(s[1],10)),t}function Te(e){const t=e.match(/https?:\/\/shared\.lanetalk\.com\/[^\s<>"'()]*/i);if(!t)return null;const o=t[0].replace(/[.,;:!?]+$/,"");return Ee(o)?o:null}function Ee(e){try{return new URL(e).hostname==="shared.lanetalk.com"}catch{return!1}}const St=[{buildUrl:e=>`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,extract:e=>e},{buildUrl:e=>`https://api.allorigins.win/get?url=${encodeURIComponent(e)}`,extract:e=>{const t=JSON.parse(e);if(!t.contents)throw new Error("proxy returned no contents");return t.contents}},{buildUrl:e=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(e)}`,extract:e=>e},{buildUrl:e=>`https://corsproxy.io/?url=${encodeURIComponent(e)}`,extract:e=>e}],$t=1e3;function wt(e){return e.trim().length>=$t&&/lanetalk/i.test(e)}async function kt(e,t={}){const{attempts:o=5,timeoutMs:a=9e3,retryDelayMs:r=500,onAttempt:n,fetchImpl:s=fetch,sleep:i=f=>new Promise(l=>setTimeout(l,f)),proxies:c=St}=t;let m="unknown error";for(let f=0;f<o;f++){const l=c[f%c.length];n?.(f,o);const d=new AbortController,p=setTimeout(()=>d.abort(),a);try{const v=await s(l.buildUrl(e),{signal:d.signal});if(!v.ok)throw new Error(`proxy returned ${v.status}`);const w=l.extract(await v.text());if(!wt(w))throw new Error("proxy returned an error page instead of LaneTalk content");return w}catch(v){v instanceof Error&&(m=v.name==="AbortError"?`timed out after ${a/1e3}s`:v.message),f<o-1&&await i(r)}finally{clearTimeout(p)}}throw new Error(`Could not reach LaneTalk after ${o} tries (${m}). The public CORS proxy is having trouble — please try again in a moment.`)}const $e=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],we=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],xt=.001,Ce=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"81 72 63 54 9/ X X X X XXX"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"2/ 1/ 35 X 34 62 4/ 45 8/ 60"},{name:"Average Game",description:"Typical performance - score close to median",score:"9/ 45 03 7/ 40 90 09 9/ X 04"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],Ae=document.querySelector("#app");if(!Ae)throw new Error("Failed to find app container");Ae.innerHTML=`
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
          ${Ce.map((e,t)=>`
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
    <p>Build: 2026-09-19 11:27:33 CT</p>
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
`;const $=document.querySelector("#scores-input"),Y=document.querySelector("#submit"),Ie=document.querySelector("#clear-btn"),O=document.querySelector("#example-btn"),X=document.querySelector("#example-dropdown"),C=document.querySelector("#feedback"),B=document.querySelector("#lanetalk-url"),Z=document.querySelector("#lanetalk-import-btn"),_=document.querySelector("#lanetalk-status"),Xe=document.querySelector("#help-icon"),P=document.querySelector("#scores-help"),se=document.querySelector("#help-dialog-overlay"),qe=document.querySelector("#help-close-btn"),De=document.querySelector("#save-btn"),Fe=document.querySelector("#saved-games-btn"),Be=document.querySelector("#saved-count"),R=document.querySelector("#save-modal-overlay"),Ne=document.querySelector("#save-form"),Q=document.querySelector("#save-description"),ge=document.querySelector("#save-league"),Pe=document.querySelector("#league-list"),ee=document.querySelector("#save-date"),Re=document.querySelector("#save-cancel-btn"),V=document.querySelector("#saved-games-sidebar"),re=document.querySelector("#sidebar-overlay"),Oe=document.querySelector("#sidebar-close-btn"),ae=document.querySelector("#search-saved-games"),Ge=document.querySelector("#export-btn"),He=document.querySelector("#import-btn"),j=document.querySelector("#import-file-input"),Ue=document.querySelector("#clear-all-btn"),U=document.querySelector("#saved-games-list"),je=document.querySelector("#sidebar-saved-count");if(!$||!Y||!Ie||!O||!X||!C||!B||!Z||!_||!Xe||!P||!se||!qe||!De||!Fe||!Be||!R||!Ne||!Q||!ge||!Pe||!ee||!Re||!V||!re||!Oe||!ae||!Ge||!He||!j||!Ue||!U||!je)throw new Error("Failed to initialise UI elements");Ie.addEventListener("click",()=>{$.value="",C.innerHTML="",he(),$.focus()});let le;function Lt(e){le!==void 0&&clearTimeout(le),le=window.setTimeout(()=>{pt(e)},500)}$.addEventListener("input",()=>{Lt($.value)});let I=!1;function Mt(){I=!I,X.classList.toggle("show",I),O.setAttribute("aria-expanded",I.toString()),X.setAttribute("aria-hidden",(!I).toString())}function ve(){I=!1,X.classList.remove("show"),O.setAttribute("aria-expanded","false"),X.setAttribute("aria-hidden","true")}O.addEventListener("click",e=>{e.stopPropagation(),Mt()});const Ye=X.querySelectorAll(".dropdown-item");Ye.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const o=parseInt(e.getAttribute("data-example-index")||"0",10);$.value=Ce[o].score,ve(),$.focus()})});document.addEventListener("click",e=>{const t=e.target;I&&!O.contains(t)&&!X.contains(t)&&ve()});X.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=Array.from(Ye),o=t.indexOf(document.activeElement);let a;e.key==="ArrowDown"?a=o<t.length-1?o+1:0:a=o>0?o-1:t.length-1,t[a]?.focus()}});function Tt(){P.classList.add("show"),se.classList.add("show"),P.setAttribute("aria-hidden","false")}function be(){P.classList.remove("show"),se.classList.remove("show"),P.setAttribute("aria-hidden","true")}Xe.addEventListener("click",e=>{e.preventDefault(),Tt()});qe.addEventListener("click",be);se.addEventListener("click",be);function N(e,t){_.textContent=e,_.className=`lanetalk-status ${t}`}function _e(){_.textContent="",_.className="lanetalk-status"}function Et(e,t){N(e===0?"Fetching games from LaneTalk...":`Proxy was slow — retrying (${e+1} of ${t})...`,"loading")}async function ze(){const e=B.value.trim();if(!e){N("Please enter a LaneTalk URL","error");return}const t=Te(e)??e;if(t!==e&&(B.value=t),!Ee(t)){N("Invalid LaneTalk URL. Must be from shared.lanetalk.com","error");return}Z.disabled=!0,N("Fetching games from LaneTalk...","loading");try{const o=await kt(t,{onAttempt:Et}),a=gt(o);if(a.games.length===0)throw new Error("No games found in LaneTalk data");const r=a.games.map(s=>s.frames).join(`
`);$.value=r;const n=a.games.length===1?"game":"games";N(`✓ Successfully imported ${a.games.length} ${n}!`,"success"),B.value="",setTimeout(()=>{_e(),$.focus()},2e3)}catch(o){console.error("LaneTalk import error:",o);const a=o instanceof Error?o.message:"Unknown error";N(`Error: ${a}`,"error")}finally{Z.disabled=!1}}Z.addEventListener("click",ze);B.addEventListener("paste",e=>{const t=e.clipboardData?.getData("text");if(!t)return;const o=Te(t);o&&o!==t.trim()&&(e.preventDefault(),B.value=o,_e())});B.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),ze())});let de=0;function Ve(){if(Math.random()<xt){const t=Math.floor(Math.random()*we.length);Y.textContent=we[t];return}Y.textContent=$e[de],de=(de+1)%$e.length}Ve();setInterval(Ve,3e4);let Ke="";function te(){if(!$.value.trim()){me("Please provide at least one game.",1,1);return}const e=$.value.replace(/\r/g,"").split(`
`),t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(!a.trim()){me(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const r=Le(a);if(r.kind==="error"){qt(r,o,e);return}const n=J(r.frames),s=st(r.frames);t.push({frames:r.frames,score:n,stats:s})}Ke=$.value,Ut(t)}Y.addEventListener("click",te);$.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),te())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(P.classList.contains("show")){be();return}if(V.classList.contains("show")){ce();return}if(R.classList.contains("show")){ie();return}if(I){ve(),O.focus();return}C.innerHTML&&(C.innerHTML="",$.focus())}});function K(){const t=z().length;Be.innerHTML=t>0?`&nbsp;(${t})`:"",je.innerHTML=t>0?`&nbsp;(${t})`:""}function Ct(){if(!$.value.trim()){L("Please enter some scores first");return}const e=new Date().toISOString().split("T")[0];ee.value=e,Q.value="",ge.value="";const t=lt();Pe.innerHTML=t.map(o=>`<option value="${o}">`).join(""),R.classList.add("show"),Q.focus()}function ie(){R.classList.remove("show")}function At(){ae.value="",G(),V.classList.add("show"),re.classList.add("show")}function ce(){V.classList.remove("show"),re.classList.remove("show")}function G(){const e=ae.value.trim().toLowerCase();let t=z();if(e&&(t=t.filter(o=>{const a=(o.description||"").toLowerCase(),r=(o.league||"").toLowerCase();return a.includes(e)||r.includes(e)})),t.length===0){U.innerHTML=e?'<p class="empty-state">No games match your search.</p>':'<p class="empty-state">No saved games yet. Save your first game!</p>';return}U.innerHTML=t.map(o=>{const a=o.gameCount===1?"1 game":`${o.gameCount} games`,r=o.totalScore!==void 0?`🎯 ${o.totalScore}`:"⚠️ Invalid",n=o.description||"(No description)",s=o.league?`🏆 ${o.league}`:"";return`
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
    `}).join(""),U.querySelectorAll("[data-load-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-load-id");a&&It(a)})}),U.querySelectorAll("[data-delete-id]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-id");a&&Xt(a)})})}function It(e){const o=z().find(a=>a.id===e);o&&($.value=o.scores,ce(),Y.click(),L("Game loaded!"))}function Xt(e){confirm("Delete this saved game?")&&(it(e),K(),G(),L("Game deleted"))}De.addEventListener("click",Ct);Fe.addEventListener("click",At);Re.addEventListener("click",ie);Oe.addEventListener("click",ce);re.addEventListener("click",ce);ae.addEventListener("input",()=>{G()});R.addEventListener("click",e=>{e.target===R&&ie()});Ne.addEventListener("submit",e=>{e.preventDefault();const t=$.value.trim(),o=Q.value.trim()||void 0,a=ge.value.trim()||void 0;let r=ee.value||void 0;if(r){const n=new Date(r),s=new Date;if(s.setHours(0,0,0,0),n>s){L("Date cannot be in the future"),ee.focus();return}}try{at(t,o,a,r),ie(),he(),K(),V.classList.contains("show")&&G(),L("Game saved!")}catch(n){console.error("Failed to save game",n),L("Failed to save game")}});Ue.addEventListener("click",()=>{confirm("Delete ALL saved games? This cannot be undone.")&&(ct(),K(),G(),L("All games deleted"))});Ge.addEventListener("click",()=>{const e=z();if(e.length===0){L("No games to export");return}const t=dt(),o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download=`bowling-games-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a),L(`Exported ${e.length} game${e.length===1?"":"s"}`)});He.addEventListener("click",()=>{j.click()});j.addEventListener("change",e=>{const t=e.target.files?.[0];if(!t)return;const o=new FileReader;o.onload=a=>{const r=a.target?.result,n=ut(r);n.success?(K(),G(),L(`Imported ${n.count} game${n.count===1?"":"s"}`)):L(n.error||"Import failed"),j.value=""},o.onerror=()=>{L("Failed to read file"),j.value=""},o.readAsText(t)});K();window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).get("scores");if(t)try{const o=atob(t);$.value=o,te()}catch(o){console.error("Failed to decode scores from URL",o)}else{const o=ht();o&&($.value=o,te())}});function qt(e,t,o){const a=t+1,r=`Row ${a}, column ${e.column}: ${e.message}`,n=Je(o,t,e.column);me(r,a,e.column,n)}function Je(e,t,o){let a=0;for(let r=0;r<t;r+=1)a+=e[r].length+1;return a+(o-1)}function me(e,t,o,a){if(C.innerHTML="",C.className="error",C.textContent=e,$.focus(),typeof a=="number")$.setSelectionRange(a,a);else{const r=$.value.replace(/\r/g,"").split(`
`),n=Je(r,t-1,o);$.setSelectionRange(n,n)}}function Dt(e){const{histogram:t,median:o}=e.stats,a=e.score,r=600,n=300,s={top:20,right:20,bottom:40,left:50},i=r-s.left-s.right,c=n-s.top-s.bottom,m=e.stats.min,f=e.stats.max,l=new Map(t.map(y=>[y.score,y])),d=[];for(let y=m;y<=f;y++){const b=l.get(y);d.push({score:y,count:b?.count??0,frequency:b?.frequency??0})}const p=Math.max(...d.map(y=>y.count)),v=Math.max(2,i/d.length),w=d.map((y,b)=>{const u=s.left+b*i/d.length,g=y.count/p*c,H=s.top+c-g,A=y.score===a;return`<rect
      x="${u}"
      y="${H}"
      width="${v}"
      height="${g}"
      fill="${A?"#fbbf24":"#60a5fa"}"
      opacity="${A?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),k=o-m,x=s.left+k*i/d.length+v/2,q=`
    <line x1="${x}" y1="${s.top}" x2="${x}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,E=5,T=Array.from({length:E+1},(y,b)=>{const u=Math.round(p/E*b),g=s.top+c-b*c/E;return`
      <line x1="${s.left-5}" y1="${g}" x2="${s.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${u.toLocaleString()}</text>
    `}).join(""),h=Math.min(10,Math.ceil((f-m)/10)),S=h===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:h+1},(y,b)=>{const u=Math.round(m+(f-m)/h*b),g=s.left+b*i/h;return`
        <line x1="${g}" y1="${s.top+c}" x2="${g}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${g}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${u}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${w}
      ${q}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+i}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${T}
      ${S}
      <text x="${s.left+i/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${s.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${s.top+c/2})">Count</text>
    </svg>
  `}function Ft(e,t,o){return e>=95?"🏆":o===t?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function Bt(e){const{zScore:t,actualPercentile:o,skewness:a,median:r}=e.stats,n=e.score-e.stats.median;let i=`${Ft(o,r,e.score)} `;Math.abs(t)<.5?i+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":t>=2?i+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":t<=-2?i+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":t>1?i+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":t<-1?i+="Your score was <strong>notably below average</strong> — your frame order worked against you.":t>0?i+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":i+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?i+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?i+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?i+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(i+=" You scored in the <strong>bottom quartile</strong> of possible orderings.");const c=n>=0?`+${n}`:`${n}`;return i+=` Your actual score was <strong>${c} pins</strong> from the median.`,i}function We(e){let t=new Map;for(const o of e[0].stats.histogram)t.set(o.score,o.count);for(let o=1;o<e.length;o++){const a=new Map;for(const[r,n]of t)for(const s of e[o].stats.histogram){const i=r+s.score,c=n*s.count;a.set(i,(a.get(i)||0)+c)}t=a}return t}function Nt(e,t){const o=We(e),a=[];for(const[u,g]of o)a.push({score:u,count:g});a.sort((u,g)=>u.score-g.score);const r=600,n=300,s={top:20,right:20,bottom:40,left:50},i=r-s.left-s.right,c=n-s.top-s.bottom,m=a[0].score,f=a[a.length-1].score,l=new Map(a.map(u=>[u.score,u])),d=[];for(let u=m;u<=f;u++){const g=l.get(u);d.push({score:u,count:g?.count??0})}const p=Math.max(...d.map(u=>u.count)),v=Array.from(o.values()).reduce((u,g)=>u+g,0);let w=0,k=0;for(const u of a)if(w+=u.count,w>=v/2){k=u.score;break}const x=Math.max(2,i/d.length),q=d.map((u,g)=>{const H=s.left+g*i/d.length,A=u.count/p*c,Ze=s.top+c-A,ye=u.score===t;return`<rect
      x="${H}"
      y="${Ze}"
      width="${x}"
      height="${A}"
      fill="${ye?"#fbbf24":"#60a5fa"}"
      opacity="${ye?"1":"0.7"}"
    >
      <title>Series Score: ${u.score}
Combinations: ${u.count.toLocaleString()}</title>
    </rect>`}).join(""),E=k-m,T=s.left+E*i/d.length+x/2,h=`
    <line x1="${T}" y1="${s.top}" x2="${T}" y2="${s.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${T}" y="${s.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,S="",y=Math.min(10,Math.ceil((f-m)/20)),b=y===0?`
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${s.left}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${m}</text>
    `:Array.from({length:y+1},(u,g)=>{const H=Math.round(m+(f-m)/y*g),A=s.left+g*i/y;return`
        <line x1="${A}" y1="${s.top+c}" x2="${A}" y2="${s.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${A}" y="${s.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${H}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${q}
      ${h}
      <line x1="${s.left}" y1="${s.top}" x2="${s.left}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${s.left}" y1="${s.top+c}" x2="${s.left+i}" y2="${s.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${S}
      ${b}
      <text x="${s.left+i/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function Pt(e){if(e.length<2)return"";const t=e.reduce((u,g)=>u+g.score,0),o=Math.round(t/e.length*100)/100,a=We(e),r=[];for(const[u,g]of a)r.push({score:u,count:g});r.sort((u,g)=>u.score-g.score);const n=Array.from(a.values()).reduce((u,g)=>u+g,0),s=r[0].score,i=r[r.length-1].score;let c=0;for(const u of r)c+=u.score*u.count;const m=c/n;let f=0,l=0;for(const u of r)if(f+=u.count,f>=n/2){l=u.score;break}const d=r.filter(u=>u.score<=t).reduce((u,g)=>u+g.count,0),p=Math.round(d/n*100*100)/100;let v=0;for(const u of r)v+=Math.pow(u.score-m,2)*u.count;const w=Math.sqrt(v/n),k=w===0?0:(t-m)/w;let x=0;for(const u of r)x+=Math.pow((u.score-m)/w,3)*u.count;const q=w===0?0:x/n;let E=0;for(const u of r)u.count>E&&(E=u.count);const T=[];for(const u of r)u.count===E&&T.push(u.score);const h=t-l,S=h>=0?`+${h}`:`${h}`,y=T.length===1?T[0].toString():`${T.join(", ")} (multimodal)`;let b="";return Math.abs(k)<.5?b="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":k>=2?b="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":k<=-2?b="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":k>=1?b="Across this series, you had <strong>notably favorable</strong> frame sequences.":k<=-1?b="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":k>0?b="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":b="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",p>=95?b+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":p>=75?b+=" You scored in the <strong>top quartile</strong> of possible combinations.":p<=5?b+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":p<=25&&(b+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),b+=` Your series total was <strong>${S} pins</strong> from the median.`,`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${b}</p>
      </div>

      <div class="histogram-container">
        ${Nt(e,t)}
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
        <dd>${i}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(m*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${l}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(q*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${y}</dd>
      </dl>
    </article>
  `}function Rt(){const e=btoa(Ke),t=new URL(window.location.href);return t.search=`?scores=${encodeURIComponent(e)}`,t.toString()}function Ot(){const e=Rt();navigator.clipboard.writeText(e).then(()=>{L("Link copied!")}).catch(t=>{console.error("Failed to copy link",t),L("Failed to copy link")})}function L(e){const t=document.querySelector(".toast");t&&t.remove();const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.classList.add("show")},10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove()},300)},2e3)}function Gt(e){return`
    <div class="complete-scorecard">
      <div class="scorecard-row">
        ${W(e).map(o=>`
            <div class="scorecard-full-frame ${o.frameNumber===10?"tenth-frame":""}">
              <div class="frame-number-label">${o.frameNumber}</div>
              <div class="frame-rolls-display">${o.rollSymbols}</div>
              <div class="frame-cumulative-score">${o.cumulativeScore}</div>
            </div>
          `).join("")}
      </div>
    </div>
  `}function Ht(e){const t=W(e),o=rt(e),a=3,r=-3,n=o.filter(l=>l.positionBenefit>=a).sort((l,d)=>d.positionBenefit-l.positionBenefit),s=o.filter(l=>l.positionBenefit<=r).sort((l,d)=>l.positionBenefit-d.positionBenefit);function i(){return`
      <div class="complete-scorecard">
        <div class="scorecard-row">
          ${t.map(l=>{const d=o.find(w=>w.frameNumber===l.frameNumber);let p="",v="";return d&&(d.positionBenefit>=a?(p="🍀",v="lucky-frame"):d.positionBenefit<=r&&(p="💔",v="unlucky-frame")),`
              <div class="scorecard-full-frame ${l.frameNumber===10?"tenth-frame":""} ${v}">
                <div class="frame-number-label">${l.frameNumber}</div>
                ${p?`<div class="frame-emoji-indicator">${p}</div>`:""}
                <div class="frame-rolls-display">${l.rollSymbols}</div>
                <div class="frame-cumulative-score">${l.cumulativeScore}</div>
              </div>
            `}).join("")}
        </div>
      </div>
    `}const c=n.length>0?`
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

      ${i()}

      ${c}
      ${m}
      ${f}
    </div>
  `}function Ut(e){if(C.className="output",e.length===0){C.innerHTML="";return}const t=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,o=e.map((n,s)=>{const i=s+1,c=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,m=n.score-n.stats.median,f=m>=0?`+${m}`:`${m}`,l=Bt(n);return`
        <article class="result-card">
          <h2>Game ${i} - Score: ${n.score}</h2>

          <div class="narrative">
            <p>${l}</p>
          </div>

          ${Gt(n.frames)}

          <div class="histogram-container">
            ${Dt(n)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <!-- ${Ht(n.frames)} -->

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
            <dd>${c}</dd>
          </dl>
        </article>
      `}).join(""),a=Pt(e);C.innerHTML=`
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
  `,C.querySelectorAll("[data-copy-link]").forEach(n=>{n.addEventListener("click",Ot)})}
