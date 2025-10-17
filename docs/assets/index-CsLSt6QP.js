(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const t of o.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const ee=new Set([" ","	",",",";"]),Y=new Set("0123456789-".split("")),te=new Set("0123456789-X/".split(""));function j(e){return ee.has(e)}function I(e){const{line:r}=e;for(;e.index<r.length&&j(r[e.index]);)e.index+=1;if(e.index>=r.length)return null;const n=e.index+1,i=r[e.index].toUpperCase();return e.index+=1,{char:i,column:n}}function q(e){if(e==="X")return 10;if(e==="-")return 0;const r=Number.parseInt(e,10);if(Number.isNaN(r))throw new Error(`Invalid roll symbol '${e}'`);if(r<0||r>9)throw new Error(`Invalid roll value '${e}'`);return r}function U(e){return e==="X"||Y.has(e)}function P(e){return te.has(e)}function S(e,r,n){return{symbol:e,value:r,column:n}}function oe(e){const r=[],n={line:e,index:0},i=()=>{for(;n.index<e.length&&j(e[n.index]);)n.index+=1};for(let o=0;o<9;o+=1){if(i(),n.index>=e.length)return{kind:"error",message:`Expected frame ${o+1}, but the line ended early`,column:e.length+1};const t=I(n);if(!t)return{kind:"error",message:`Expected frame ${o+1}, but found nothing`,column:e.length+1};const{char:a,column:c}=t;if(!U(a))return{kind:"error",message:`Invalid roll '${a}' in frame ${o+1}`,column:c};if(a==="X"){r.push({rolls:[S("X",10,c)],isStrike:!0,isSpare:!1});continue}const f=q(a),m=I(n);if(!m)return{kind:"error",message:`Frame ${o+1} is missing a second roll`,column:e.length+1};const{char:h,column:g}=m;if(h==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${o+1}`,column:g};if(h==="/"){if(f>=10)return{kind:"error",message:`Spare in frame ${o+1} requires the first roll to be less than 10`,column:g};const x=10-f;r.push({rolls:[S(a,f,c),S("/",x,g)],isStrike:!1,isSpare:!0});continue}if(!Y.has(h))return{kind:"error",message:`Invalid roll '${h}' in frame ${o+1}`,column:g};const y=q(h);if(f+y>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${o+1}`,column:g};r.push({rolls:[S(a,f,c),S(h,y,g)],isStrike:!1,isSpare:!1})}if(i(),n.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=re(n,e);return s.kind==="error"?s:(r.push(s.frame),i(),n.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:n.index+1}:{kind:"success",frames:r})}function re(e,r){const n=I(e);if(!n)return{kind:"error",message:"Frame 10 is missing",column:r.length+1};const{char:i,column:s}=n;if(!U(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:s};if(i==="X")return ne(e,s);const o=q(i),t=I(e);if(!t)return{kind:"error",message:"Frame 10 is missing a second roll",column:r.length+1};const{char:a,column:c}=t;if(a==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(a==="/"){if(o>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const m=10-o,h=I(e);if(!h)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:r.length+1};const{char:g,column:y}=h;if(g==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:y};if(!P(g))return{kind:"error",message:`Invalid fill ball '${g}' in frame 10`,column:y};const x=g==="X"?10:q(g);return{kind:"success",frame:{rolls:[S(i,o,s),S("/",m,c),S(g,x,y)],isStrike:!1,isSpare:!0}}}if(!Y.has(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:c};const f=q(a);return o+f>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[S(i,o,s),S(a,f,c)],isStrike:!1,isSpare:!1}}}function ne(e,r){const n=I(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:i,column:s}=n;if(!P(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let o;i==="X"?o=10:o=q(i);const t=I(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:a,column:c}=t;if(!P(a))return{kind:"error",message:`Invalid fill ball '${a}' in frame 10`,column:c};let f;if(a==="X")f=10;else if(a==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(o>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};f=10-o}else if(f=q(a),i!=="X"&&o+f>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[S("X",10,r),S(i,o,s),S(a,f,c)],isStrike:!0,isSpare:!1}}}function R(e){const r=[],n=[],i=[];for(const t of e){for(const a of t.rolls)r.push(a.value);n.push(t.isStrike),i.push(t.isSpare)}let s=0,o=0;for(let t=0;t<10;t+=1)n[t]?(s+=10+(r[o+1]??0)+(r[o+2]??0),o+=1):i[t]?(s+=10+(r[o+2]??0),o+=2):(s+=(r[o]??0)+(r[o+1]??0),o+=2);return s}function se(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const r=e.slice(0,9),n=e[9],i=[];function s(o,t){if(t===1){i.push([...o,n]);return}for(let a=0;a<t;a++)s(o,t-1),t%2===0?[o[a],o[t-1]]=[o[t-1],o[a]]:[o[0],o[t-1]]=[o[t-1],o[0]]}return s(r,r.length),i}function ie(e){const r=se(e),n=r.map(d=>R(d)),i=R(e);n.sort((d,l)=>d-l);const s=n[0],o=n[n.length-1],a=n.reduce((d,l)=>d+l,0)/n.length,c=Math.floor(n.length/2),f=n.length%2===0?(n[c-1]+n[c])/2:n[c],m=new Map;for(const d of n)m.set(d,(m.get(d)||0)+1);let h=0;for(const d of m.values())d>h&&(h=d);const g=[];for(const[d,l]of m)l===h&&g.push(d);g.sort((d,l)=>d-l);const y=[];for(const[d,l]of m)y.push({score:d,count:l,frequency:l/n.length});y.sort((d,l)=>d.score-l.score);const x=n.filter(d=>d<=i).length,M=Math.round(x/n.length*100*100)/100,w=n.reduce((d,l)=>d+Math.pow(l-a,2),0)/n.length,v=Math.sqrt(w),C=v===0?0:(i-a)/v,A=n.reduce((d,l)=>d+Math.pow((l-a)/v,3),0),b=v===0?0:A/n.length;return{min:s,max:o,mean:Math.round(a*100)/100,median:f,mode:g,permutationCount:r.length,histogram:y,actualPercentile:M,zScore:Math.round(C*100)/100,skewness:Math.round(b*100)/100,standardDeviation:Math.round(v*100)/100}}const N=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],O=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],ae=.001,W=document.querySelector("#app");if(!W)throw new Error("Failed to find app container");W.innerHTML=`
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
    <p>Build: 2025-10-17 08:11:04 CT</p>
  </footer>
`;const k=document.querySelector("#scores-input"),T=document.querySelector("#submit"),_=document.querySelector("#clear-btn"),G=document.querySelector("#example-btn"),L=document.querySelector("#feedback");if(!k||!T||!_||!G||!L)throw new Error("Failed to initialise UI elements");const z=["9/ X 81 7/ X X 9- 90 X XX6","X X X X X X X X X XXX","X 9/ 54 X 8/ 9- X 81 9/ X8/",`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`];let E=0;_.addEventListener("click",()=>{k.value="",L.innerHTML="",k.focus()});G.addEventListener("click",()=>{k.value=z[E],E=(E+1)%z.length,k.focus()});let F=0;function K(){if(Math.random()<ae){const r=Math.floor(Math.random()*O.length);T.textContent=O[r];return}T.textContent=N[F],F=(F+1)%N.length}K();setInterval(K,3e4);let Z="";function D(){if(!k.value.trim()){B("Please provide at least one game.",1,1);return}const e=k.value.replace(/\r/g,"").split(`
`),r=[];for(let n=0;n<e.length;n+=1){const i=e[n];if(!i.trim()){B(`Game ${n+1} is empty. Each line must contain exactly ten frames.`,n+1,1);return}const s=oe(i);if(s.kind==="error"){ce(s,n,e);return}const o=R(s.frames),t=ie(s.frames);r.push({frames:s.frames,score:o,stats:t})}Z=k.value,pe(r)}T.addEventListener("click",D);k.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),D())});document.addEventListener("keydown",e=>{e.key==="Escape"&&L.innerHTML&&(L.innerHTML="",k.focus())});window.addEventListener("DOMContentLoaded",()=>{const r=new URLSearchParams(window.location.search).get("scores");if(r)try{const n=atob(r);k.value=n,D()}catch(n){console.error("Failed to decode scores from URL",n)}});function ce(e,r,n){const i=r+1,s=`Row ${i}, column ${e.column}: ${e.message}`,o=J(n,r,e.column);B(s,i,e.column,o)}function J(e,r,n){let i=0;for(let s=0;s<r;s+=1)i+=e[s].length+1;return i+(n-1)}function B(e,r,n,i){if(L.innerHTML="",L.className="error",L.textContent=e,k.focus(),typeof i=="number")k.setSelectionRange(i,i);else{const s=k.value.replace(/\r/g,"").split(`
`),o=J(s,r-1,n);k.setSelectionRange(o,o)}}function le(e){const{histogram:r,median:n}=e.stats,i=e.score,s=600,o=300,t={top:20,right:20,bottom:40,left:50},a=s-t.left-t.right,c=o-t.top-t.bottom,f=Math.max(...r.map(b=>b.count)),m=e.stats.min,h=e.stats.max,g=Math.max(2,a/r.length),y=r.map((b,d)=>{const l=t.left+d*a/r.length,p=b.count/f*c,$=t.top+c-p,u=b.score===i;return`<rect
      x="${l}"
      y="${$}"
      width="${g}"
      height="${p}"
      fill="${u?"#fbbf24":"#60a5fa"}"
      opacity="${u?"1":"0.7"}"
    >
      <title>Score: ${b.score}
Count: ${b.count.toLocaleString()}
Frequency: ${(b.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=t.left+(n-m)/(h-m)*a,M=`
    <line x1="${x}" y1="${t.top}" x2="${x}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,w=5,v=Array.from({length:w+1},(b,d)=>{const l=Math.round(f/w*d),p=t.top+c-d*c/w;return`
      <line x1="${t.left-5}" y1="${p}" x2="${t.left}" y2="${p}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${p+4}" text-anchor="end" font-size="11" fill="#94a3b8">${l.toLocaleString()}</text>
    `}).join(""),C=Math.min(10,Math.ceil((h-m)/10)),A=Array.from({length:C+1},(b,d)=>{const l=Math.round(m+(h-m)/C*d),p=t.left+d*a/C;return`
      <line x1="${p}" y1="${t.top+c}" x2="${p}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${p}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${l}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${y}
      ${M}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+a}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${v}
      ${A}
      <text x="${t.left+a/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${t.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+c/2})">Count</text>
    </svg>
  `}function de(e,r,n){return e>=95?"🏆":n===r?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function ue(e){const{zScore:r,actualPercentile:n,skewness:i,median:s}=e.stats;e.score-e.stats.median;let t=`${de(n,s,e.score)} `;return Math.abs(r)<.5?t+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":r>=2?t+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":r<=-2?t+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":r>1?t+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":r<-1?t+="Your score was <strong>notably below average</strong> — your frame order worked against you.":r>0?t+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":t+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",n>=95?t+=" You scored in the <strong>top 5%</strong> of all possible orderings.":n>=75?t+=" You scored in the <strong>top quartile</strong> of possible orderings.":n<=5?t+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":n<=25&&(t+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),t}function Q(e){let r=new Map;for(const n of e[0].stats.histogram)r.set(n.score,n.count);for(let n=1;n<e.length;n++){const i=new Map;for(const[s,o]of r)for(const t of e[n].stats.histogram){const a=s+t.score,c=o*t.count;i.set(a,(i.get(a)||0)+c)}r=i}return r}function fe(e,r){const n=Q(e),i=[];for(const[l,p]of n)i.push({score:l,count:p});i.sort((l,p)=>l.score-p.score);const s=600,o=300,t={top:20,right:20,bottom:40,left:50},a=s-t.left-t.right,c=o-t.top-t.bottom,f=Math.max(...i.map(l=>l.count)),m=i[0].score,h=i[i.length-1].score,g=Array.from(n.values()).reduce((l,p)=>l+p,0);let y=0,x=0;for(const l of i)if(y+=l.count,y>=g/2){x=l.score;break}const M=Math.max(2,a/i.length),w=i.map((l,p)=>{const $=t.left+p*a/i.length,u=l.count/f*c,X=t.top+c-u,H=l.score===r;return`<rect
      x="${$}"
      y="${X}"
      width="${M}"
      height="${u}"
      fill="${H?"#fbbf24":"#60a5fa"}"
      opacity="${H?"1":"0.7"}"
    >
      <title>Series Score: ${l.score}
Combinations: ${l.count.toLocaleString()}</title>
    </rect>`}).join(""),v=t.left+(x-m)/(h-m)*a,C=`
    <line x1="${v}" y1="${t.top}" x2="${v}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${v}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A="",b=Math.min(10,Math.ceil((h-m)/20)),d=Array.from({length:b+1},(l,p)=>{const $=Math.round(m+(h-m)/b*p),u=t.left+p*a/b;return`
      <line x1="${u}" y1="${t.top+c}" x2="${u}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${u}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${$}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${w}
      ${C}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+a}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${A}
      ${d}
      <text x="${t.left+a/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function me(e){if(e.length<2)return"";const r=e.reduce((u,X)=>u+X.score,0),n=Math.round(r/e.length*100)/100,i=Q(e),s=[];for(const[u,X]of i)s.push({score:u,count:X});s.sort((u,X)=>u.score-X.score);const o=Array.from(i.values()).reduce((u,X)=>u+X,0),t=s[0].score,a=s[s.length-1].score;let c=0;for(const u of s)c+=u.score*u.count;const f=c/o;let m=0,h=0;for(const u of s)if(m+=u.count,m>=o/2){h=u.score;break}const g=s.filter(u=>u.score<=r).reduce((u,X)=>u+X.count,0),y=Math.round(g/o*100*100)/100;let x=0;for(const u of s)x+=Math.pow(u.score-f,2)*u.count;const M=Math.sqrt(x/o),w=M===0?0:(r-f)/M;let v=0;for(const u of s)v+=Math.pow((u.score-f)/M,3)*u.count;const C=M===0?0:v/o;let A=0;for(const u of s)u.count>A&&(A=u.count);const b=[];for(const u of s)u.count===A&&b.push(u.score);const d=r-h,l=d>=0?`+${d}`:`${d}`,p=b.length===1?b[0].toString():`${b.join(", ")} (multimodal)`;let $="";return Math.abs(w)<.5?$="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?$="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?$="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?$="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?$="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?$="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":$="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",y>=95?$+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":y>=75?$+=" You scored in the <strong>top quartile</strong> of possible combinations.":y<=5?$+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":y<=25&&($+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${$}</p>
      </div>

      <div class="histogram-container">
        ${fe(e,r)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${r}</dd>

        <dt>Average score per game:</dt>
        <dd>${n}</dd>

        <dt>Percentile:</dt>
        <dd>${y}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${l}</dd>

        <dt>Minimum score:</dt>
        <dd>${t}</dd>

        <dt>Maximum score:</dt>
        <dd>${a}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(f*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${h}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(C*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${p}</dd>
      </dl>
    </article>
  `}function he(){const e=btoa(Z),r=new URL(window.location.href);return r.search=`?scores=${encodeURIComponent(e)}`,r.toString()}function ge(){const e=he();navigator.clipboard.writeText(e).then(()=>{V("Link copied!")}).catch(r=>{console.error("Failed to copy link",r),V("Failed to copy link")})}function V(e){const r=document.querySelector(".toast");r&&r.remove();const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.classList.add("show")},10),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>{n.remove()},300)},2e3)}function pe(e){if(L.className="output",e.length===0){L.innerHTML="";return}const r=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,n=e.map((o,t)=>{const a=t+1,c=o.stats.mode.length===1?o.stats.mode[0].toString():`${o.stats.mode.join(", ")} (multimodal)`,f=o.score-o.stats.median,m=f>=0?`+${f}`:`${f}`,h=ue(o);return`
        <article class="result-card">
          <h2>Game ${a}</h2>
          <p><strong>Actual score:</strong> ${o.score}</p>

          <div class="narrative">
            <p>${h}</p>
          </div>

          <div class="histogram-container">
            ${le(o)}
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
            <dd>${m}</dd>

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
            <dd>${c}</dd>
          </dl>
        </article>
      `}).join(""),i=me(e);L.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${r}
      </div>
      ${n}
      ${i}
      <div class="results-footer">
        ${r}
      </div>
    </section>
  `,L.querySelectorAll("[data-copy-link]").forEach(o=>{o.addEventListener("click",ge)})}
