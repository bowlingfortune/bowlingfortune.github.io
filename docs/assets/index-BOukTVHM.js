(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const t of r.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const ie=new Set([" ","	",",",";"]),N=new Set("0123456789-".split("")),ae=new Set("0123456789-X/".split(""));function _(e){return ie.has(e)}function T(e){const{line:o}=e;for(;e.index<o.length&&_(o[e.index]);)e.index+=1;if(e.index>=o.length)return null;const n=e.index+1,i=o[e.index].toUpperCase();return e.index+=1,{char:i,column:n}}function P(e){if(e==="X")return 10;if(e==="-")return 0;const o=Number.parseInt(e,10);if(Number.isNaN(o))throw new Error(`Invalid roll symbol '${e}'`);if(o<0||o>9)throw new Error(`Invalid roll value '${e}'`);return o}function K(e){return e==="X"||N.has(e)}function H(e){return ae.has(e)}function S(e,o,n){return{symbol:e,value:o,column:n}}function ce(e){const o=[],n={line:e,index:0},i=()=>{for(;n.index<e.length&&_(e[n.index]);)n.index+=1};for(let r=0;r<9;r+=1){if(i(),n.index>=e.length)return{kind:"error",message:`Expected frame ${r+1}, but the line ended early`,column:e.length+1};const t=T(n);if(!t)return{kind:"error",message:`Expected frame ${r+1}, but found nothing`,column:e.length+1};const{char:l,column:c}=t;if(!K(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${r+1}`,column:c};if(l==="X"){o.push({rolls:[S("X",10,c)],isStrike:!0,isSpare:!1});continue}const d=P(l),g=T(n);if(!g)return{kind:"error",message:`Frame ${r+1} is missing a second roll`,column:e.length+1};const{char:y,column:f}=g;if(y==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${r+1}`,column:f};if(y==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${r+1} requires the first roll to be less than 10`,column:f};const v=10-d;o.push({rolls:[S(l,d,c),S("/",v,f)],isStrike:!1,isSpare:!0});continue}if(!N.has(y))return{kind:"error",message:`Invalid roll '${y}' in frame ${r+1}`,column:f};const b=P(y);if(d+b>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${r+1}`,column:f};o.push({rolls:[S(l,d,c),S(y,b,f)],isStrike:!1,isSpare:!1})}if(i(),n.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=le(n,e);return s.kind==="error"?s:(o.push(s.frame),i(),n.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:n.index+1}:{kind:"success",frames:o})}function le(e,o){const n=T(e);if(!n)return{kind:"error",message:"Frame 10 is missing",column:o.length+1};const{char:i,column:s}=n;if(!K(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:s};if(i==="X")return de(e,s);const r=P(i),t=T(e);if(!t)return{kind:"error",message:"Frame 10 is missing a second roll",column:o.length+1};const{char:l,column:c}=t;if(l==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(l==="/"){if(r>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const g=10-r,y=T(e);if(!y)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:o.length+1};const{char:f,column:b}=y;if(f==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:b};if(!H(f))return{kind:"error",message:`Invalid fill ball '${f}' in frame 10`,column:b};const v=f==="X"?10:P(f);return{kind:"success",frame:{rolls:[S(i,r,s),S("/",g,c),S(f,v,b)],isStrike:!1,isSpare:!0}}}if(!N.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame 10`,column:c};const d=P(l);return r+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[S(i,r,s),S(l,d,c)],isStrike:!1,isSpare:!1}}}function de(e,o){const n=T(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:o};const{char:i,column:s}=n;if(!H(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let r;i==="X"?r=10:r=P(i);const t=T(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:l,column:c}=t;if(!H(l))return{kind:"error",message:`Invalid fill ball '${l}' in frame 10`,column:c};let d;if(l==="X")d=10;else if(l==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(r>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};d=10-r}else if(d=P(l),i!=="X"&&r+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[S("X",10,o),S(i,r,s),S(l,d,c)],isStrike:!0,isSpare:!1}}}function O(e){const o=[],n=[],i=[];for(const t of e){for(const l of t.rolls)o.push(l.value);n.push(t.isStrike),i.push(t.isSpare)}let s=0,r=0;for(let t=0;t<10;t+=1)n[t]?(s+=10+(o[r+1]??0)+(o[r+2]??0),r+=1):i[t]?(s+=10+(o[r+2]??0),r+=2):(s+=(o[r]??0)+(o[r+1]??0),r+=2);return s}function ue(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const o=e.slice(0,9),n=e[9],i=[];function s(r,t){if(t===1){i.push([...r,n]);return}for(let l=0;l<t;l++)s(r,t-1),t%2===0?[r[l],r[t-1]]=[r[t-1],r[l]]:[r[0],r[t-1]]=[r[t-1],r[0]]}return s(o,o.length),i}function fe(e){const o=ue(e),n=o.map(u=>O(u)),i=O(e);n.sort((u,$)=>u-$);const s=n[0],r=n[n.length-1],l=n.reduce((u,$)=>u+$,0)/n.length,c=Math.floor(n.length/2),d=n.length%2===0?(n[c-1]+n[c])/2:n[c],g=new Map;for(const u of n)g.set(u,(g.get(u)||0)+1);let y=0;for(const u of g.values())u>y&&(y=u);const f=[];for(const[u,$]of g)$===y&&f.push(u);f.sort((u,$)=>u-$);const b=[];for(const[u,$]of g)b.push({score:u,count:$,frequency:$/n.length});b.sort((u,$)=>u.score-$.score);const v=n.filter(u=>u<=i).length,M=Math.round(v/n.length*100*100)/100,k=n.reduce((u,$)=>u+Math.pow($-l,2),0)/n.length,x=Math.sqrt(k),E=x===0?0:(i-l)/x,L=n.reduce((u,$)=>u+Math.pow(($-l)/x,3),0),X=x===0?0:L/n.length;return{min:s,max:r,mean:Math.round(l*100)/100,median:d,mode:f,permutationCount:o.length,histogram:b,actualPercentile:M,zScore:Math.round(E*100)/100,skewness:Math.round(X*100)/100,standardDeviation:Math.round(x*100)/100}}const j=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],U=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],me=.001,Z=[{name:"Perfect Game (300)",description:"The ultimate achievement - 12 strikes in a row",score:"X X X X X X X X X XXX"},{name:"Lucky Game",description:"Actual score much higher than median - very favorable frame order",score:"X X X 9/ X X 81 X X X9/"},{name:"Unlucky Game",description:"Actual score lower than median - unfavorable frame order",score:"9/ 9/ 9/ 9/ 9/ 9/ 9/ 9/ 9/ 9/9"},{name:"Average Game",description:"Typical performance around 150",score:"9/ X 81 7/ X X 9- 90 X XX6"},{name:"Low Score Game",description:"Rough day at the lanes - lots of open frames",score:"52 7- 43 8- 61 72 54 6- 81 7-"},{name:"Multiple Games Series",description:"Three-game series showing different performances",score:`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`},{name:"Clutch Performance",description:"Strong finish with strikes in the 10th",score:"7/ 8/ 81 9- 72 X 9/ 8- X XXX"},{name:"All Spares Game",description:"Consistent spare shooting - no strikes, no open frames",score:"9/ 8/ 7/ 6/ 5/ 4/ 3/ 2/ 1/ 9/9"}],J=document.querySelector("#app");if(!J)throw new Error("Failed to find app container");J.innerHTML=`
  <h1><img src="/logo.png" alt="Pocket Penetration" class="header-logo"> Bowling Fortune Teller 🎳</h1>
  <label for="scores-input">Frame-by-Frame Score(s)</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
  <div class="textarea-footer">
    <div class="example-dropdown-container">
      <button id="example-btn" type="button" class="secondary-btn example-btn" aria-haspopup="true" aria-expanded="false">
        Try an example
        <span class="dropdown-arrow">▼</span>
      </button>
      <div id="example-dropdown" class="example-dropdown" role="menu" aria-hidden="true">
        ${Z.map((e,o)=>`
          <button type="button" class="dropdown-item" data-example-index="${o}" role="menuitem">
            <strong>${e.name}</strong>
            <span class="dropdown-item-desc">${e.description}</span>
          </button>
        `).join("")}
      </div>
    </div>
    <button id="clear-btn" type="button" class="secondary-btn">Clear</button>
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
    <p>Build: 2025-10-18 05:13:41 CT</p>
  </footer>
`;const w=document.querySelector("#scores-input"),D=document.querySelector("#submit"),Q=document.querySelector("#clear-btn"),F=document.querySelector("#example-btn"),q=document.querySelector("#example-dropdown"),A=document.querySelector("#feedback");if(!w||!D||!Q||!F||!q||!A)throw new Error("Failed to initialise UI elements");Q.addEventListener("click",()=>{w.value="",A.innerHTML="",w.focus()});let I=!1;function he(){I=!I,q.classList.toggle("show",I),F.setAttribute("aria-expanded",I.toString()),q.setAttribute("aria-hidden",(!I).toString())}function z(){I=!1,q.classList.remove("show"),F.setAttribute("aria-expanded","false"),q.setAttribute("aria-hidden","true")}F.addEventListener("click",e=>{e.stopPropagation(),he()});const ee=q.querySelectorAll(".dropdown-item");ee.forEach(e=>{e.addEventListener("click",o=>{o.stopPropagation();const n=parseInt(e.getAttribute("data-example-index")||"0",10);w.value=Z[n].score,z(),w.focus()})});document.addEventListener("click",e=>{const o=e.target;I&&!F.contains(o)&&!q.contains(o)&&z()});q.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const o=Array.from(ee),n=o.indexOf(document.activeElement);let i;e.key==="ArrowDown"?i=n<o.length-1?n+1:0:i=n>0?n-1:o.length-1,o[i]?.focus()}});let B=0;function te(){if(Math.random()<me){const o=Math.floor(Math.random()*U.length);D.textContent=U[o];return}D.textContent=j[B],B=(B+1)%j.length}te();setInterval(te,3e4);let oe="";function G(){if(!w.value.trim()){Y("Please provide at least one game.",1,1);return}const e=w.value.replace(/\r/g,"").split(`
`),o=[];for(let n=0;n<e.length;n+=1){const i=e[n];if(!i.trim()){Y(`Game ${n+1} is empty. Each line must contain exactly ten frames.`,n+1,1);return}const s=ce(i);if(s.kind==="error"){pe(s,n,e);return}const r=O(s.frames),t=fe(s.frames);o.push({frames:s.frames,score:r,stats:t})}oe=w.value,ve(o)}D.addEventListener("click",G);w.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),G())});document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(I){z(),F.focus();return}A.innerHTML&&(A.innerHTML="",w.focus())}});window.addEventListener("DOMContentLoaded",()=>{const o=new URLSearchParams(window.location.search).get("scores");if(o)try{const n=atob(o);w.value=n,G()}catch(n){console.error("Failed to decode scores from URL",n)}});function pe(e,o,n){const i=o+1,s=`Row ${i}, column ${e.column}: ${e.message}`,r=re(n,o,e.column);Y(s,i,e.column,r)}function re(e,o,n){let i=0;for(let s=0;s<o;s+=1)i+=e[s].length+1;return i+(n-1)}function Y(e,o,n,i){if(A.innerHTML="",A.className="error",A.textContent=e,w.focus(),typeof i=="number")w.setSelectionRange(i,i);else{const s=w.value.replace(/\r/g,"").split(`
`),r=re(s,o-1,n);w.setSelectionRange(r,r)}}function ge(e){const{histogram:o,median:n}=e.stats,i=e.score,s=600,r=300,t={top:20,right:20,bottom:40,left:50},l=s-t.left-t.right,c=r-t.top-t.bottom,d=e.stats.min,g=e.stats.max,y=new Map(o.map(p=>[p.score,p])),f=[];for(let p=d;p<=g;p++){const h=y.get(p);f.push({score:p,count:h?.count??0,frequency:h?.frequency??0})}const b=Math.max(...f.map(p=>p.count)),v=Math.max(2,l/f.length),M=f.map((p,h)=>{const a=t.left+h*l/f.length,m=p.count/b*c,R=t.top+c-m,C=p.score===i;return`<rect
      x="${a}"
      y="${R}"
      width="${v}"
      height="${m}"
      fill="${C?"#fbbf24":"#60a5fa"}"
      opacity="${C?"1":"0.7"}"
    >
      <title>Score: ${p.score}
Count: ${p.count.toLocaleString()}
Frequency: ${(p.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),k=n-d,x=t.left+k*l/f.length+v/2,E=`
    <line x1="${x}" y1="${t.top}" x2="${x}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,L=5,X=Array.from({length:L+1},(p,h)=>{const a=Math.round(b/L*h),m=t.top+c-h*c/L;return`
      <line x1="${t.left-5}" y1="${m}" x2="${t.left}" y2="${m}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${m+4}" text-anchor="end" font-size="11" fill="#94a3b8">${a.toLocaleString()}</text>
    `}).join(""),u=Math.min(10,Math.ceil((g-d)/10)),$=u===0?`
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:u+1},(p,h)=>{const a=Math.round(d+(g-d)/u*h),m=t.left+h*l/u;return`
        <line x1="${m}" y1="${t.top+c}" x2="${m}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${m}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${a}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${s} ${r}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${M}
      ${E}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+l}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${X}
      ${$}
      <text x="${t.left+l/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${t.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+c/2})">Count</text>
    </svg>
  `}function ye(e,o,n){return e>=95?"🏆":n===o?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function $e(e){const{zScore:o,actualPercentile:n,skewness:i,median:s}=e.stats;e.score-e.stats.median;let t=`${ye(n,s,e.score)} `;return Math.abs(o)<.5?t+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":o>=2?t+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":o<=-2?t+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":o>1?t+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":o<-1?t+="Your score was <strong>notably below average</strong> — your frame order worked against you.":o>0?t+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":t+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",n>=95?t+=" You scored in the <strong>top 5%</strong> of all possible orderings.":n>=75?t+=" You scored in the <strong>top quartile</strong> of possible orderings.":n<=5?t+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":n<=25&&(t+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),t}function ne(e){let o=new Map;for(const n of e[0].stats.histogram)o.set(n.score,n.count);for(let n=1;n<e.length;n++){const i=new Map;for(const[s,r]of o)for(const t of e[n].stats.histogram){const l=s+t.score,c=r*t.count;i.set(l,(i.get(l)||0)+c)}o=i}return o}function be(e,o){const n=ne(e),i=[];for(const[a,m]of n)i.push({score:a,count:m});i.sort((a,m)=>a.score-m.score);const s=600,r=300,t={top:20,right:20,bottom:40,left:50},l=s-t.left-t.right,c=r-t.top-t.bottom,d=i[0].score,g=i[i.length-1].score,y=new Map(i.map(a=>[a.score,a])),f=[];for(let a=d;a<=g;a++){const m=y.get(a);f.push({score:a,count:m?.count??0})}const b=Math.max(...f.map(a=>a.count)),v=Array.from(n.values()).reduce((a,m)=>a+m,0);let M=0,k=0;for(const a of i)if(M+=a.count,M>=v/2){k=a.score;break}const x=Math.max(2,l/f.length),E=f.map((a,m)=>{const R=t.left+m*l/f.length,C=a.count/b*c,se=t.top+c-C,V=a.score===o;return`<rect
      x="${R}"
      y="${se}"
      width="${x}"
      height="${C}"
      fill="${V?"#fbbf24":"#60a5fa"}"
      opacity="${V?"1":"0.7"}"
    >
      <title>Series Score: ${a.score}
Combinations: ${a.count.toLocaleString()}</title>
    </rect>`}).join(""),L=k-d,X=t.left+L*l/f.length+x/2,u=`
    <line x1="${X}" y1="${t.top}" x2="${X}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${X}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,$="",p=Math.min(10,Math.ceil((g-d)/20)),h=p===0?`
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `:Array.from({length:p+1},(a,m)=>{const R=Math.round(d+(g-d)/p*m),C=t.left+m*l/p;return`
        <line x1="${C}" y1="${t.top+c}" x2="${C}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
        <text x="${C}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${R}</text>
      `}).join("");return`
    <svg viewBox="0 0 ${s} ${r}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${E}
      ${u}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+l}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${$}
      ${h}
      <text x="${t.left+l/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function xe(e){if(e.length<2)return"";const o=e.reduce((a,m)=>a+m.score,0),n=Math.round(o/e.length*100)/100,i=ne(e),s=[];for(const[a,m]of i)s.push({score:a,count:m});s.sort((a,m)=>a.score-m.score);const r=Array.from(i.values()).reduce((a,m)=>a+m,0),t=s[0].score,l=s[s.length-1].score;let c=0;for(const a of s)c+=a.score*a.count;const d=c/r;let g=0,y=0;for(const a of s)if(g+=a.count,g>=r/2){y=a.score;break}const f=s.filter(a=>a.score<=o).reduce((a,m)=>a+m.count,0),b=Math.round(f/r*100*100)/100;let v=0;for(const a of s)v+=Math.pow(a.score-d,2)*a.count;const M=Math.sqrt(v/r),k=M===0?0:(o-d)/M;let x=0;for(const a of s)x+=Math.pow((a.score-d)/M,3)*a.count;const E=M===0?0:x/r;let L=0;for(const a of s)a.count>L&&(L=a.count);const X=[];for(const a of s)a.count===L&&X.push(a.score);const u=o-y,$=u>=0?`+${u}`:`${u}`,p=X.length===1?X[0].toString():`${X.join(", ")} (multimodal)`;let h="";return Math.abs(k)<.5?h="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":k>=2?h="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":k<=-2?h="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":k>=1?h="Across this series, you had <strong>notably favorable</strong> frame sequences.":k<=-1?h="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":k>0?h="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":h="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",b>=95?h+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":b>=75?h+=" You scored in the <strong>top quartile</strong> of possible combinations.":b<=5?h+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":b<=25&&(h+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${h}</p>
      </div>

      <div class="histogram-container">
        ${be(e,o)}
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
        <dd>${n}</dd>

        <dt>Percentile:</dt>
        <dd>${b}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(k*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${$}</dd>

        <dt>Minimum score:</dt>
        <dd>${t}</dd>

        <dt>Maximum score:</dt>
        <dd>${l}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(d*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${y}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(E*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${p}</dd>
      </dl>
    </article>
  `}function we(){const e=btoa(oe),o=new URL(window.location.href);return o.search=`?scores=${encodeURIComponent(e)}`,o.toString()}function ke(){const e=we();navigator.clipboard.writeText(e).then(()=>{W("Link copied!")}).catch(o=>{console.error("Failed to copy link",o),W("Failed to copy link")})}function W(e){const o=document.querySelector(".toast");o&&o.remove();const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.classList.add("show")},10),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>{n.remove()},300)},2e3)}function ve(e){if(A.className="output",e.length===0){A.innerHTML="";return}const o=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,n=e.map((r,t)=>{const l=t+1,c=r.stats.mode.length===1?r.stats.mode[0].toString():`${r.stats.mode.join(", ")} (multimodal)`,d=r.score-r.stats.median,g=d>=0?`+${d}`:`${d}`,y=$e(r);return`
        <article class="result-card">
          <h2>Game ${l}</h2>
          <p><strong>Actual score:</strong> ${r.score}</p>

          <div class="narrative">
            <p>${y}</p>
          </div>

          <div class="histogram-container">
            ${ge(r)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${r.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${r.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${r.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${g}</dd>

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
            <dd>${c}</dd>
          </dl>
        </article>
      `}).join(""),i=xe(e);A.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${o}
      </div>
      ${n}
      ${i}
      <div class="results-footer">
        ${o}
      </div>
    </section>
  `,A.querySelectorAll("[data-copy-link]").forEach(r=>{r.addEventListener("click",ke)})}
