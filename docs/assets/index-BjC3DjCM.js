(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const t of o.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const te=new Set([" ","	",",",";"]),Y=new Set("0123456789-".split("")),oe=new Set("0123456789-X/".split(""));function j(e){return te.has(e)}function A(e){const{line:r}=e;for(;e.index<r.length&&j(r[e.index]);)e.index+=1;if(e.index>=r.length)return null;const n=e.index+1,i=r[e.index].toUpperCase();return e.index+=1,{char:i,column:n}}function q(e){if(e==="X")return 10;if(e==="-")return 0;const r=Number.parseInt(e,10);if(Number.isNaN(r))throw new Error(`Invalid roll symbol '${e}'`);if(r<0||r>9)throw new Error(`Invalid roll value '${e}'`);return r}function U(e){return e==="X"||Y.has(e)}function P(e){return oe.has(e)}function M(e,r,n){return{symbol:e,value:r,column:n}}function re(e){const r=[],n={line:e,index:0},i=()=>{for(;n.index<e.length&&j(e[n.index]);)n.index+=1};for(let o=0;o<9;o+=1){if(i(),n.index>=e.length)return{kind:"error",message:`Expected frame ${o+1}, but the line ended early`,column:e.length+1};const t=A(n);if(!t)return{kind:"error",message:`Expected frame ${o+1}, but found nothing`,column:e.length+1};const{char:a,column:c}=t;if(!U(a))return{kind:"error",message:`Invalid roll '${a}' in frame ${o+1}`,column:c};if(a==="X"){r.push({rolls:[M("X",10,c)],isStrike:!0,isSpare:!1});continue}const f=q(a),h=A(n);if(!h)return{kind:"error",message:`Frame ${o+1} is missing a second roll`,column:e.length+1};const{char:g,column:y}=h;if(g==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${o+1}`,column:y};if(g==="/"){if(f>=10)return{kind:"error",message:`Spare in frame ${o+1} requires the first roll to be less than 10`,column:y};const x=10-f;r.push({rolls:[M(a,f,c),M("/",x,y)],isStrike:!1,isSpare:!0});continue}if(!Y.has(g))return{kind:"error",message:`Invalid roll '${g}' in frame ${o+1}`,column:y};const b=q(g);if(f+b>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${o+1}`,column:y};r.push({rolls:[M(a,f,c),M(g,b,y)],isStrike:!1,isSpare:!1})}if(i(),n.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=ne(n,e);return s.kind==="error"?s:(r.push(s.frame),i(),n.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:n.index+1}:{kind:"success",frames:r})}function ne(e,r){const n=A(e);if(!n)return{kind:"error",message:"Frame 10 is missing",column:r.length+1};const{char:i,column:s}=n;if(!U(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:s};if(i==="X")return se(e,s);const o=q(i),t=A(e);if(!t)return{kind:"error",message:"Frame 10 is missing a second roll",column:r.length+1};const{char:a,column:c}=t;if(a==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(a==="/"){if(o>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const h=10-o,g=A(e);if(!g)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:r.length+1};const{char:y,column:b}=g;if(y==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:b};if(!P(y))return{kind:"error",message:`Invalid fill ball '${y}' in frame 10`,column:b};const x=y==="X"?10:q(y);return{kind:"success",frame:{rolls:[M(i,o,s),M("/",h,c),M(y,x,b)],isStrike:!1,isSpare:!0}}}if(!Y.has(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:c};const f=q(a);return o+f>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[M(i,o,s),M(a,f,c)],isStrike:!1,isSpare:!1}}}function se(e,r){const n=A(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:i,column:s}=n;if(!P(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let o;i==="X"?o=10:o=q(i);const t=A(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:a,column:c}=t;if(!P(a))return{kind:"error",message:`Invalid fill ball '${a}' in frame 10`,column:c};let f;if(a==="X")f=10;else if(a==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(o>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};f=10-o}else if(f=q(a),i!=="X"&&o+f>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[M("X",10,r),M(i,o,s),M(a,f,c)],isStrike:!0,isSpare:!1}}}function R(e){const r=[],n=[],i=[];for(const t of e){for(const a of t.rolls)r.push(a.value);n.push(t.isStrike),i.push(t.isSpare)}let s=0,o=0;for(let t=0;t<10;t+=1)n[t]?(s+=10+(r[o+1]??0)+(r[o+2]??0),o+=1):i[t]?(s+=10+(r[o+2]??0),o+=2):(s+=(r[o]??0)+(r[o+1]??0),o+=2);return s}function ie(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const r=e.slice(0,9),n=e[9],i=[];function s(o,t){if(t===1){i.push([...o,n]);return}for(let a=0;a<t;a++)s(o,t-1),t%2===0?[o[a],o[t-1]]=[o[t-1],o[a]]:[o[0],o[t-1]]=[o[t-1],o[0]]}return s(r,r.length),i}function ae(e){const r=ie(e),n=r.map(l=>R(l)),i=R(e);n.sort((l,m)=>l-m);const s=n[0],o=n[n.length-1],a=n.reduce((l,m)=>l+m,0)/n.length,c=Math.floor(n.length/2),f=n.length%2===0?(n[c-1]+n[c])/2:n[c],h=new Map;for(const l of n)h.set(l,(h.get(l)||0)+1);let g=0;for(const l of h.values())l>g&&(g=l);const y=[];for(const[l,m]of h)m===g&&y.push(l);y.sort((l,m)=>l-m);const b=[];for(const[l,m]of h)b.push({score:l,count:m,frequency:m/n.length});b.sort((l,m)=>l.score-m.score);const x=n.filter(l=>l<=i).length,v=Math.round(x/n.length*100*100)/100,S=n.reduce((l,m)=>l+Math.pow(m-a,2),0)/n.length,w=Math.sqrt(S),I=w===0?0:(i-a)/w,X=n.reduce((l,m)=>l+Math.pow((m-a)/w,3),0),C=w===0?0:X/n.length;return{min:s,max:o,mean:Math.round(a*100)/100,median:f,mode:y,permutationCount:r.length,histogram:b,actualPercentile:v,zScore:Math.round(I*100)/100,skewness:Math.round(C*100)/100,standardDeviation:Math.round(w*100)/100}}const N=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?","Is this thing scratch-and-sniff?","Like a 50/50 raffle, but you never win","We lost by 3 pins, but it definitely wasn't my fault... right?"],O=["Tell Me How Bad I Fucked Up","RATE MUH BALLS"],ce=.001,W=document.querySelector("#app");if(!W)throw new Error("Failed to find app container");W.innerHTML=`
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
    <p>Build: 2025-10-17 20:39:33 CT</p>
  </footer>
`;const k=document.querySelector("#scores-input"),T=document.querySelector("#submit"),_=document.querySelector("#clear-btn"),G=document.querySelector("#example-btn"),L=document.querySelector("#feedback");if(!k||!T||!_||!G||!L)throw new Error("Failed to initialise UI elements");const z=["9/ X 81 7/ X X 9- 90 X XX6","X X X X X X X X X XXX","X 9/ 54 X 8/ 9- X 81 9/ X8/",`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`];let E=0;_.addEventListener("click",()=>{k.value="",L.innerHTML="",k.focus()});G.addEventListener("click",()=>{k.value=z[E],E=(E+1)%z.length,k.focus()});let F=0;function K(){if(Math.random()<ce){const r=Math.floor(Math.random()*O.length);T.textContent=O[r];return}T.textContent=N[F],F=(F+1)%N.length}K();setInterval(K,3e4);let Z="";function D(){if(!k.value.trim()){B("Please provide at least one game.",1,1);return}const e=k.value.replace(/\r/g,"").split(`
`),r=[];for(let n=0;n<e.length;n+=1){const i=e[n];if(!i.trim()){B(`Game ${n+1} is empty. Each line must contain exactly ten frames.`,n+1,1);return}const s=re(i);if(s.kind==="error"){le(s,n,e);return}const o=R(s.frames),t=ae(s.frames);r.push({frames:s.frames,score:o,stats:t})}Z=k.value,ye(r)}T.addEventListener("click",D);k.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),D())});document.addEventListener("keydown",e=>{e.key==="Escape"&&L.innerHTML&&(L.innerHTML="",k.focus())});window.addEventListener("DOMContentLoaded",()=>{const r=new URLSearchParams(window.location.search).get("scores");if(r)try{const n=atob(r);k.value=n,D()}catch(n){console.error("Failed to decode scores from URL",n)}});function le(e,r,n){const i=r+1,s=`Row ${i}, column ${e.column}: ${e.message}`,o=J(n,r,e.column);B(s,i,e.column,o)}function J(e,r,n){let i=0;for(let s=0;s<r;s+=1)i+=e[s].length+1;return i+(n-1)}function B(e,r,n,i){if(L.innerHTML="",L.className="error",L.textContent=e,k.focus(),typeof i=="number")k.setSelectionRange(i,i);else{const s=k.value.replace(/\r/g,"").split(`
`),o=J(s,r-1,n);k.setSelectionRange(o,o)}}function de(e){const{histogram:r,median:n}=e.stats,i=e.score,s=600,o=300,t={top:20,right:20,bottom:40,left:50},a=s-t.left-t.right,c=o-t.top-t.bottom,f=Math.max(...r.map(l=>l.count)),h=e.stats.min,g=e.stats.max,y=Math.max(2,a/r.length),b=r.map((l,m)=>{const p=t.left+m*a/r.length,u=l.count/f*c,d=t.top+c-u,$=l.score===i;return`<rect
      x="${p}"
      y="${d}"
      width="${y}"
      height="${u}"
      fill="${$?"#fbbf24":"#60a5fa"}"
      opacity="${$?"1":"0.7"}"
    >
      <title>Score: ${l.score}
Count: ${l.count.toLocaleString()}
Frequency: ${(l.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=r.findIndex(l=>l.score===n),v=x>=0?t.left+x*a/r.length+y/2:t.left+(n-h)/(g-h)*a,S=`
    <line x1="${v}" y1="${t.top}" x2="${v}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${v}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,w=5,I=Array.from({length:w+1},(l,m)=>{const p=Math.round(f/w*m),u=t.top+c-m*c/w;return`
      <line x1="${t.left-5}" y1="${u}" x2="${t.left}" y2="${u}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${u+4}" text-anchor="end" font-size="11" fill="#94a3b8">${p.toLocaleString()}</text>
    `}).join(""),X=Math.min(10,Math.ceil((g-h)/10)),C=Array.from({length:X+1},(l,m)=>{const p=Math.round(h+(g-h)/X*m),u=t.left+m*a/X;return`
      <line x1="${u}" y1="${t.top+c}" x2="${u}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${u}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${p}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${b}
      ${S}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+a}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${I}
      ${C}
      <text x="${t.left+a/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${t.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+c/2})">Count</text>
    </svg>
  `}function ue(e,r,n){return e>=95?"🏆":n===r?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function fe(e){const{zScore:r,actualPercentile:n,skewness:i,median:s}=e.stats;e.score-e.stats.median;let t=`${ue(n,s,e.score)} `;return Math.abs(r)<.5?t+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":r>=2?t+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":r<=-2?t+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":r>1?t+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":r<-1?t+="Your score was <strong>notably below average</strong> — your frame order worked against you.":r>0?t+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":t+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",n>=95?t+=" You scored in the <strong>top 5%</strong> of all possible orderings.":n>=75?t+=" You scored in the <strong>top quartile</strong> of possible orderings.":n<=5?t+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":n<=25&&(t+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),t}function Q(e){let r=new Map;for(const n of e[0].stats.histogram)r.set(n.score,n.count);for(let n=1;n<e.length;n++){const i=new Map;for(const[s,o]of r)for(const t of e[n].stats.histogram){const a=s+t.score,c=o*t.count;i.set(a,(i.get(a)||0)+c)}r=i}return r}function me(e,r){const n=Q(e),i=[];for(const[p,u]of n)i.push({score:p,count:u});i.sort((p,u)=>p.score-u.score);const s=600,o=300,t={top:20,right:20,bottom:40,left:50},a=s-t.left-t.right,c=o-t.top-t.bottom,f=Math.max(...i.map(p=>p.count)),h=i[0].score,g=i[i.length-1].score,y=Array.from(n.values()).reduce((p,u)=>p+u,0);let b=0,x=0;for(const p of i)if(b+=p.count,b>=y/2){x=p.score;break}const v=Math.max(2,a/i.length),S=i.map((p,u)=>{const d=t.left+u*a/i.length,$=p.count/f*c,ee=t.top+c-$,H=p.score===r;return`<rect
      x="${d}"
      y="${ee}"
      width="${v}"
      height="${$}"
      fill="${H?"#fbbf24":"#60a5fa"}"
      opacity="${H?"1":"0.7"}"
    >
      <title>Series Score: ${p.score}
Combinations: ${p.count.toLocaleString()}</title>
    </rect>`}).join(""),w=i.findIndex(p=>p.score===x),I=w>=0?t.left+w*a/i.length+v/2:t.left+(x-h)/(g-h)*a,X=`
    <line x1="${I}" y1="${t.top}" x2="${I}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${I}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,C="",l=Math.min(10,Math.ceil((g-h)/20)),m=Array.from({length:l+1},(p,u)=>{const d=Math.round(h+(g-h)/l*u),$=t.left+u*a/l;return`
      <line x1="${$}" y1="${t.top+c}" x2="${$}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${$}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${S}
      ${X}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+a}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${C}
      ${m}
      <text x="${t.left+a/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function he(e){if(e.length<2)return"";const r=e.reduce((d,$)=>d+$.score,0),n=Math.round(r/e.length*100)/100,i=Q(e),s=[];for(const[d,$]of i)s.push({score:d,count:$});s.sort((d,$)=>d.score-$.score);const o=Array.from(i.values()).reduce((d,$)=>d+$,0),t=s[0].score,a=s[s.length-1].score;let c=0;for(const d of s)c+=d.score*d.count;const f=c/o;let h=0,g=0;for(const d of s)if(h+=d.count,h>=o/2){g=d.score;break}const y=s.filter(d=>d.score<=r).reduce((d,$)=>d+$.count,0),b=Math.round(y/o*100*100)/100;let x=0;for(const d of s)x+=Math.pow(d.score-f,2)*d.count;const v=Math.sqrt(x/o),S=v===0?0:(r-f)/v;let w=0;for(const d of s)w+=Math.pow((d.score-f)/v,3)*d.count;const I=v===0?0:w/o;let X=0;for(const d of s)d.count>X&&(X=d.count);const C=[];for(const d of s)d.count===X&&C.push(d.score);const l=r-g,m=l>=0?`+${l}`:`${l}`,p=C.length===1?C[0].toString():`${C.join(", ")} (multimodal)`;let u="";return Math.abs(S)<.5?u="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":S>=2?u="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":S<=-2?u="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":S>=1?u="Across this series, you had <strong>notably favorable</strong> frame sequences.":S<=-1?u="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":S>0?u="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":u="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",b>=95?u+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":b>=75?u+=" You scored in the <strong>top quartile</strong> of possible combinations.":b<=5?u+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":b<=25&&(u+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${u}</p>
      </div>

      <div class="histogram-container">
        ${me(e,r)}
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
        <dd>${b}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(S*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${m}</dd>

        <dt>Minimum score:</dt>
        <dd>${t}</dd>

        <dt>Maximum score:</dt>
        <dd>${a}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(f*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${g}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(v*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(I*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${p}</dd>
      </dl>
    </article>
  `}function ge(){const e=btoa(Z),r=new URL(window.location.href);return r.search=`?scores=${encodeURIComponent(e)}`,r.toString()}function pe(){const e=ge();navigator.clipboard.writeText(e).then(()=>{V("Link copied!")}).catch(r=>{console.error("Failed to copy link",r),V("Failed to copy link")})}function V(e){const r=document.querySelector(".toast");r&&r.remove();const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.classList.add("show")},10),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>{n.remove()},300)},2e3)}function ye(e){if(L.className="output",e.length===0){L.innerHTML="";return}const r=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,n=e.map((o,t)=>{const a=t+1,c=o.stats.mode.length===1?o.stats.mode[0].toString():`${o.stats.mode.join(", ")} (multimodal)`,f=o.score-o.stats.median,h=f>=0?`+${f}`:`${f}`,g=fe(o);return`
        <article class="result-card">
          <h2>Game ${a}</h2>
          <p><strong>Actual score:</strong> ${o.score}</p>

          <div class="narrative">
            <p>${g}</p>
          </div>

          <div class="histogram-container">
            ${de(o)}
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
            <dd>${h}</dd>

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
      `}).join(""),i=he(e);L.innerHTML=`
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
  `,L.querySelectorAll("[data-copy-link]").forEach(o=>{o.addEventListener("click",pe)})}
