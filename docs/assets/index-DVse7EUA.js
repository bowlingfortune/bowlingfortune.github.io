(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const t of o.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const re=new Set([" ","	",",",";"]),D=new Set("0123456789-".split("")),ne=new Set("0123456789-X/".split(""));function W(e){return re.has(e)}function A(e){const{line:n}=e;for(;e.index<n.length&&W(n[e.index]);)e.index+=1;if(e.index>=n.length)return null;const r=e.index+1,i=n[e.index].toUpperCase();return e.index+=1,{char:i,column:r}}function T(e){if(e==="X")return 10;if(e==="-")return 0;const n=Number.parseInt(e,10);if(Number.isNaN(n))throw new Error(`Invalid roll symbol '${e}'`);if(n<0||n>9)throw new Error(`Invalid roll value '${e}'`);return n}function _(e){return e==="X"||D.has(e)}function B(e){return ne.has(e)}function S(e,n,r){return{symbol:e,value:n,column:r}}function se(e){const n=[],r={line:e,index:0},i=()=>{for(;r.index<e.length&&W(e[r.index]);)r.index+=1};for(let o=0;o<9;o+=1){if(i(),r.index>=e.length)return{kind:"error",message:`Expected frame ${o+1}, but the line ended early`,column:e.length+1};const t=A(r);if(!t)return{kind:"error",message:`Expected frame ${o+1}, but found nothing`,column:e.length+1};const{char:c,column:l}=t;if(!_(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${o+1}`,column:l};if(c==="X"){n.push({rolls:[S("X",10,l)],isStrike:!0,isSpare:!1});continue}const d=T(c),p=A(r);if(!p)return{kind:"error",message:`Frame ${o+1} is missing a second roll`,column:e.length+1};const{char:g,column:f}=p;if(g==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${o+1}`,column:f};if(g==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${o+1} requires the first roll to be less than 10`,column:f};const v=10-d;n.push({rolls:[S(c,d,l),S("/",v,f)],isStrike:!1,isSpare:!0});continue}if(!D.has(g))return{kind:"error",message:`Invalid roll '${g}' in frame ${o+1}`,column:f};const $=T(g);if(d+$>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${o+1}`,column:f};n.push({rolls:[S(c,d,l),S(g,$,f)],isStrike:!1,isSpare:!1})}if(i(),r.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=ie(r,e);return s.kind==="error"?s:(n.push(s.frame),i(),r.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:r.index+1}:{kind:"success",frames:n})}function ie(e,n){const r=A(e);if(!r)return{kind:"error",message:"Frame 10 is missing",column:n.length+1};const{char:i,column:s}=r;if(!_(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:s};if(i==="X")return ae(e,s);const o=T(i),t=A(e);if(!t)return{kind:"error",message:"Frame 10 is missing a second roll",column:n.length+1};const{char:c,column:l}=t;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:l};if(c==="/"){if(o>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:l};const p=10-o,g=A(e);if(!g)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:n.length+1};const{char:f,column:$}=g;if(f==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:$};if(!B(f))return{kind:"error",message:`Invalid fill ball '${f}' in frame 10`,column:$};const v=f==="X"?10:T(f);return{kind:"success",frame:{rolls:[S(i,o,s),S("/",p,l),S(f,v,$)],isStrike:!1,isSpare:!0}}}if(!D.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:l};const d=T(c);return o+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:l}:{kind:"success",frame:{rolls:[S(i,o,s),S(c,d,l)],isStrike:!1,isSpare:!1}}}function ae(e,n){const r=A(e);if(!r)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:i,column:s}=r;if(!B(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let o;i==="X"?o=10:o=T(i);const t=A(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:c,column:l}=t;if(!B(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:l};let d;if(c==="X")d=10;else if(c==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:l};if(o>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:l};d=10-o}else if(d=T(c),i!=="X"&&o+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:l};return{kind:"success",frame:{rolls:[S("X",10,n),S(i,o,s),S(c,d,l)],isStrike:!0,isSpare:!1}}}function H(e){const n=[],r=[],i=[];for(const t of e){for(const c of t.rolls)n.push(c.value);r.push(t.isStrike),i.push(t.isSpare)}let s=0,o=0;for(let t=0;t<10;t+=1)r[t]?(s+=10+(n[o+1]??0)+(n[o+2]??0),o+=1):i[t]?(s+=10+(n[o+2]??0),o+=2):(s+=(n[o]??0)+(n[o+1]??0),o+=2);return s}function ce(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const n=e.slice(0,9),r=e[9],i=[];function s(o,t){if(t===1){i.push([...o,r]);return}for(let c=0;c<t;c++)s(o,t-1),t%2===0?[o[c],o[t-1]]=[o[t-1],o[c]]:[o[0],o[t-1]]=[o[t-1],o[0]]}return s(n,n.length),i}function le(e){const n=ce(e),r=n.map(u=>H(u)),i=H(e);r.sort((u,b)=>u-b);const s=r[0],o=r[r.length-1],c=r.reduce((u,b)=>u+b,0)/r.length,l=Math.floor(r.length/2),d=r.length%2===0?(r[l-1]+r[l])/2:r[l],p=new Map;for(const u of r)p.set(u,(p.get(u)||0)+1);let g=0;for(const u of p.values())u>g&&(g=u);const f=[];for(const[u,b]of p)b===g&&f.push(u);f.sort((u,b)=>u-b);const $=[];for(const[u,b]of p)$.push({score:u,count:b,frequency:b/r.length});$.sort((u,b)=>u.score-b.score);const v=r.filter(u=>u<=i).length,M=Math.round(v/r.length*100*100)/100,k=r.reduce((u,b)=>u+Math.pow(b-c,2),0)/r.length,x=Math.sqrt(k),q=x===0?0:(i-c)/x,L=r.reduce((u,b)=>u+Math.pow((b-c)/x,3),0),X=x===0?0:L/r.length;return{min:s,max:o,mean:Math.round(c*100)/100,median:d,mode:f,permutationCount:n.length,histogram:$,actualPercentile:M,zScore:Math.round(q*100)/100,skewness:Math.round(X*100)/100,standardDeviation:Math.round(x*100)/100}}const z=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],V=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],de=.001,G=document.querySelector("#app");if(!G)throw new Error("Failed to find app container");G.innerHTML=`
  <h1><img src="/logo.png" alt="Pocket Penetration" class="header-logo"> Bowling Fortune Teller 🎳</h1>
  <label for="scores-input">Frame-by-Frame Score(s)</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
  <div class="textarea-footer">
    <button id="clear-btn" type="button" class="secondary-btn">Clear</button>
    <button id="example-btn" type="button" class="secondary-btn">Try an example</button>
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
    <p>Build: 2025-10-17 20:42:00 CT</p>
  </footer>
`;const w=document.querySelector("#scores-input"),F=document.querySelector("#submit"),K=document.querySelector("#clear-btn"),Z=document.querySelector("#example-btn"),C=document.querySelector("#feedback");if(!w||!F||!K||!Z||!C)throw new Error("Failed to initialise UI elements");const j=["9/ X 81 7/ X X 9- 90 X XX6","X X X X X X X X X XXX","X 9/ 54 X 8/ 9- X 81 9/ X8/",`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`];let P=0;K.addEventListener("click",()=>{w.value="",C.innerHTML="",w.focus()});Z.addEventListener("click",()=>{w.value=j[P],P=(P+1)%j.length,w.focus()});let R=0;function J(){if(Math.random()<de){const n=Math.floor(Math.random()*V.length);F.textContent=V[n];return}F.textContent=z[R],R=(R+1)%z.length}J();setInterval(J,3e4);let Q="";function N(){if(!w.value.trim()){Y("Please provide at least one game.",1,1);return}const e=w.value.replace(/\r/g,"").split(`
`),n=[];for(let r=0;r<e.length;r+=1){const i=e[r];if(!i.trim()){Y(`Game ${r+1} is empty. Each line must contain exactly ten frames.`,r+1,1);return}const s=se(i);if(s.kind==="error"){ue(s,r,e);return}const o=H(s.frames),t=le(s.frames);n.push({frames:s.frames,score:o,stats:t})}Q=w.value,$e(n)}F.addEventListener("click",N);w.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),N())});document.addEventListener("keydown",e=>{e.key==="Escape"&&C.innerHTML&&(C.innerHTML="",w.focus())});window.addEventListener("DOMContentLoaded",()=>{const n=new URLSearchParams(window.location.search).get("scores");if(n)try{const r=atob(n);w.value=r,N()}catch(r){console.error("Failed to decode scores from URL",r)}});function ue(e,n,r){const i=n+1,s=`Row ${i}, column ${e.column}: ${e.message}`,o=ee(r,n,e.column);Y(s,i,e.column,o)}function ee(e,n,r){let i=0;for(let s=0;s<n;s+=1)i+=e[s].length+1;return i+(r-1)}function Y(e,n,r,i){if(C.innerHTML="",C.className="error",C.textContent=e,w.focus(),typeof i=="number")w.setSelectionRange(i,i);else{const s=w.value.replace(/\r/g,"").split(`
`),o=ee(s,n-1,r);w.setSelectionRange(o,o)}}function fe(e){const{histogram:n,median:r}=e.stats,i=e.score,s=600,o=300,t={top:20,right:20,bottom:40,left:50},c=s-t.left-t.right,l=o-t.top-t.bottom,d=e.stats.min,p=e.stats.max,g=new Map(n.map(y=>[y.score,y])),f=[];for(let y=d;y<=p;y++){const h=g.get(y);f.push({score:y,count:h?.count??0,frequency:h?.frequency??0})}const $=Math.max(...f.map(y=>y.count)),v=Math.max(2,c/f.length),M=f.map((y,h)=>{const a=t.left+h*c/f.length,m=y.count/$*l,E=t.top+l-m,I=y.score===i;return`<rect
      x="${a}"
      y="${E}"
      width="${v}"
      height="${m}"
      fill="${I?"#fbbf24":"#60a5fa"}"
      opacity="${I?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),k=r-d,x=t.left+k*c/f.length+v/2,q=`
    <line x1="${x}" y1="${t.top}" x2="${x}" y2="${t.top+l}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,L=5,X=Array.from({length:L+1},(y,h)=>{const a=Math.round($/L*h),m=t.top+l-h*l/L;return`
      <line x1="${t.left-5}" y1="${m}" x2="${t.left}" y2="${m}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${m+4}" text-anchor="end" font-size="11" fill="#94a3b8">${a.toLocaleString()}</text>
    `}).join(""),u=Math.min(10,Math.ceil((p-d)/10)),b=Array.from({length:u+1},(y,h)=>{const a=Math.round(d+(p-d)/u*h),m=t.left+h*c/u;return`
      <line x1="${m}" y1="${t.top+l}" x2="${m}" y2="${t.top+l+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${m}" y="${t.top+l+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${a}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${M}
      ${q}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+l}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+l}" x2="${t.left+c}" y2="${t.top+l}" stroke="#94a3b8" stroke-width="2" />
      ${X}
      ${b}
      <text x="${t.left+c/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${t.top+l/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+l/2})">Count</text>
    </svg>
  `}function me(e,n,r){return e>=95?"🏆":r===n?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function he(e){const{zScore:n,actualPercentile:r,skewness:i,median:s}=e.stats;e.score-e.stats.median;let t=`${me(r,s,e.score)} `;return Math.abs(n)<.5?t+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":n>=2?t+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":n<=-2?t+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":n>1?t+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":n<-1?t+="Your score was <strong>notably below average</strong> — your frame order worked against you.":n>0?t+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":t+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",r>=95?t+=" You scored in the <strong>top 5%</strong> of all possible orderings.":r>=75?t+=" You scored in the <strong>top quartile</strong> of possible orderings.":r<=5?t+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":r<=25&&(t+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),t}function te(e){let n=new Map;for(const r of e[0].stats.histogram)n.set(r.score,r.count);for(let r=1;r<e.length;r++){const i=new Map;for(const[s,o]of n)for(const t of e[r].stats.histogram){const c=s+t.score,l=o*t.count;i.set(c,(i.get(c)||0)+l)}n=i}return n}function pe(e,n){const r=te(e),i=[];for(const[a,m]of r)i.push({score:a,count:m});i.sort((a,m)=>a.score-m.score);const s=600,o=300,t={top:20,right:20,bottom:40,left:50},c=s-t.left-t.right,l=o-t.top-t.bottom,d=i[0].score,p=i[i.length-1].score,g=new Map(i.map(a=>[a.score,a])),f=[];for(let a=d;a<=p;a++){const m=g.get(a);f.push({score:a,count:m?.count??0})}const $=Math.max(...f.map(a=>a.count)),v=Array.from(r.values()).reduce((a,m)=>a+m,0);let M=0,k=0;for(const a of i)if(M+=a.count,M>=v/2){k=a.score;break}const x=Math.max(2,c/f.length),q=f.map((a,m)=>{const E=t.left+m*c/f.length,I=a.count/$*l,oe=t.top+l-I,O=a.score===n;return`<rect
      x="${E}"
      y="${oe}"
      width="${x}"
      height="${I}"
      fill="${O?"#fbbf24":"#60a5fa"}"
      opacity="${O?"1":"0.7"}"
    >
      <title>Series Score: ${a.score}
Combinations: ${a.count.toLocaleString()}</title>
    </rect>`}).join(""),L=k-d,X=t.left+L*c/f.length+x/2,u=`
    <line x1="${X}" y1="${t.top}" x2="${X}" y2="${t.top+l}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${X}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,b="",y=Math.min(10,Math.ceil((p-d)/20)),h=Array.from({length:y+1},(a,m)=>{const E=Math.round(d+(p-d)/y*m),I=t.left+m*c/y;return`
      <line x1="${I}" y1="${t.top+l}" x2="${I}" y2="${t.top+l+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${I}" y="${t.top+l+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${E}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${q}
      ${u}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+l}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+l}" x2="${t.left+c}" y2="${t.top+l}" stroke="#94a3b8" stroke-width="2" />
      ${b}
      ${h}
      <text x="${t.left+c/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function ge(e){if(e.length<2)return"";const n=e.reduce((a,m)=>a+m.score,0),r=Math.round(n/e.length*100)/100,i=te(e),s=[];for(const[a,m]of i)s.push({score:a,count:m});s.sort((a,m)=>a.score-m.score);const o=Array.from(i.values()).reduce((a,m)=>a+m,0),t=s[0].score,c=s[s.length-1].score;let l=0;for(const a of s)l+=a.score*a.count;const d=l/o;let p=0,g=0;for(const a of s)if(p+=a.count,p>=o/2){g=a.score;break}const f=s.filter(a=>a.score<=n).reduce((a,m)=>a+m.count,0),$=Math.round(f/o*100*100)/100;let v=0;for(const a of s)v+=Math.pow(a.score-d,2)*a.count;const M=Math.sqrt(v/o),k=M===0?0:(n-d)/M;let x=0;for(const a of s)x+=Math.pow((a.score-d)/M,3)*a.count;const q=M===0?0:x/o;let L=0;for(const a of s)a.count>L&&(L=a.count);const X=[];for(const a of s)a.count===L&&X.push(a.score);const u=n-g,b=u>=0?`+${u}`:`${u}`,y=X.length===1?X[0].toString():`${X.join(", ")} (multimodal)`;let h="";return Math.abs(k)<.5?h="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":k>=2?h="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":k<=-2?h="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":k>=1?h="Across this series, you had <strong>notably favorable</strong> frame sequences.":k<=-1?h="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":k>0?h="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":h="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",$>=95?h+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":$>=75?h+=" You scored in the <strong>top quartile</strong> of possible combinations.":$<=5?h+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":$<=25&&(h+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${h}</p>
      </div>

      <div class="histogram-container">
        ${pe(e,n)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${n}</dd>

        <dt>Average score per game:</dt>
        <dd>${r}</dd>

        <dt>Percentile:</dt>
        <dd>${$}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(k*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${b}</dd>

        <dt>Minimum score:</dt>
        <dd>${t}</dd>

        <dt>Maximum score:</dt>
        <dd>${c}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(d*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${g}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(q*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${y}</dd>
      </dl>
    </article>
  `}function ye(){const e=btoa(Q),n=new URL(window.location.href);return n.search=`?scores=${encodeURIComponent(e)}`,n.toString()}function be(){const e=ye();navigator.clipboard.writeText(e).then(()=>{U("Link copied!")}).catch(n=>{console.error("Failed to copy link",n),U("Failed to copy link")})}function U(e){const n=document.querySelector(".toast");n&&n.remove();const r=document.createElement("div");r.className="toast",r.textContent=e,document.body.appendChild(r),setTimeout(()=>{r.classList.add("show")},10),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>{r.remove()},300)},2e3)}function $e(e){if(C.className="output",e.length===0){C.innerHTML="";return}const n=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,r=e.map((o,t)=>{const c=t+1,l=o.stats.mode.length===1?o.stats.mode[0].toString():`${o.stats.mode.join(", ")} (multimodal)`,d=o.score-o.stats.median,p=d>=0?`+${d}`:`${d}`,g=he(o);return`
        <article class="result-card">
          <h2>Game ${c}</h2>
          <p><strong>Actual score:</strong> ${o.score}</p>

          <div class="narrative">
            <p>${g}</p>
          </div>

          <div class="histogram-container">
            ${fe(o)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${o.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${o.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${o.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${p}</dd>

            <dt>Minimum score:</dt>
            <dd>${o.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${o.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${o.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${o.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${o.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${o.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${l}</dd>
          </dl>
        </article>
      `}).join(""),i=ge(e);C.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${n}
      </div>
      ${r}
      ${i}
      <div class="results-footer">
        ${n}
      </div>
    </section>
  `,C.querySelectorAll("[data-copy-link]").forEach(o=>{o.addEventListener("click",be)})}
