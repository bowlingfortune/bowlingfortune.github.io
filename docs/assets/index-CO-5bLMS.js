(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(s){if(s.ep)return;s.ep=!0;const t=r(s);fetch(s.href,t)}})();const W=new Set([" ","	",",",";"]),z=new Set("0123456789-".split("")),Z=new Set("0123456789-X/".split(""));function D(e){return W.has(e)}function F(e){const{line:n}=e;for(;e.index<n.length&&D(n[e.index]);)e.index+=1;if(e.index>=n.length)return null;const r=e.index+1,a=n[e.index].toUpperCase();return e.index+=1,{char:a,column:r}}function I(e){if(e==="X")return 10;if(e==="-")return 0;const n=Number.parseInt(e,10);if(Number.isNaN(n))throw new Error(`Invalid roll symbol '${e}'`);if(n<0||n>9)throw new Error(`Invalid roll value '${e}'`);return n}function O(e){return e==="X"||z.has(e)}function R(e){return Z.has(e)}function x(e,n,r){return{symbol:e,value:n,column:r}}function K(e){const n=[],r={line:e,index:0},a=()=>{for(;r.index<e.length&&D(e[r.index]);)r.index+=1};for(let t=0;t<9;t+=1){if(a(),r.index>=e.length)return{kind:"error",message:`Expected frame ${t+1}, but the line ended early`,column:e.length+1};const o=F(r);if(!o)return{kind:"error",message:`Expected frame ${t+1}, but found nothing`,column:e.length+1};const{char:c,column:i}=o;if(!O(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${t+1}`,column:i};if(c==="X"){n.push({rolls:[x("X",10,i)],isStrike:!0,isSpare:!1});continue}const m=I(c),f=F(r);if(!f)return{kind:"error",message:`Frame ${t+1} is missing a second roll`,column:e.length+1};const{char:l,column:u}=f;if(l==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${t+1}`,column:u};if(l==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${t+1} requires the first roll to be less than 10`,column:u};const b=10-m;n.push({rolls:[x(c,m,i),x("/",b,u)],isStrike:!1,isSpare:!0});continue}if(!z.has(l))return{kind:"error",message:`Invalid roll '${l}' in frame ${t+1}`,column:u};const p=I(l);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${t+1}`,column:u};n.push({rolls:[x(c,m,i),x(l,p,u)],isStrike:!1,isSpare:!1})}if(a(),r.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=J(r,e);return s.kind==="error"?s:(n.push(s.frame),a(),r.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:r.index+1}:{kind:"success",frames:n})}function J(e,n){const r=F(e);if(!r)return{kind:"error",message:"Frame 10 is missing",column:n.length+1};const{char:a,column:s}=r;if(!O(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:s};if(a==="X")return Q(e,s);const t=I(a),o=F(e);if(!o)return{kind:"error",message:"Frame 10 is missing a second roll",column:n.length+1};const{char:c,column:i}=o;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:i};if(c==="/"){if(t>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:i};const f=10-t,l=F(e);if(!l)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:n.length+1};const{char:u,column:p}=l;if(u==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!R(u))return{kind:"error",message:`Invalid fill ball '${u}' in frame 10`,column:p};const b=u==="X"?10:I(u);return{kind:"success",frame:{rolls:[x(a,t,s),x("/",f,i),x(u,b,p)],isStrike:!1,isSpare:!0}}}if(!z.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:i};const m=I(c);return t+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:i}:{kind:"success",frame:{rolls:[x(a,t,s),x(c,m,i)],isStrike:!1,isSpare:!1}}}function Q(e,n){const r=F(e);if(!r)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:a,column:s}=r;if(!R(a)||a==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let t;a==="X"?t=10:t=I(a);const o=F(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:c,column:i}=o;if(!R(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:i};let m;if(c==="X")m=10;else if(c==="/"){if(a==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:i};if(t>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:i};m=10-t}else if(m=I(c),a!=="X"&&t+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:i};return{kind:"success",frame:{rolls:[x("X",10,n),x(a,t,s),x(c,m,i)],isStrike:!0,isSpare:!1}}}function E(e){const n=[],r=[],a=[];for(const o of e){for(const c of o.rolls)n.push(c.value);r.push(o.isStrike),a.push(o.isSpare)}let s=0,t=0;for(let o=0;o<10;o+=1)r[o]?(s+=10+(n[t+1]??0)+(n[t+2]??0),t+=1):a[o]?(s+=10+(n[t+2]??0),t+=2):(s+=(n[t]??0)+(n[t+1]??0),t+=2);return s}function ee(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const n=e.slice(0,9),r=e[9],a=[];function s(t,o){if(o===1){a.push([...t,r]);return}for(let c=0;c<o;c++)s(t,o-1),o%2===0?[t[c],t[o-1]]=[t[o-1],t[c]]:[t[0],t[o-1]]=[t[o-1],t[0]]}return s(n,n.length),a}function te(e){const n=ee(e),r=n.map(d=>E(d)),a=E(e);r.sort((d,g)=>d-g);const s=r[0],t=r[r.length-1],c=r.reduce((d,g)=>d+g,0)/r.length,i=Math.floor(r.length/2),m=r.length%2===0?(r[i-1]+r[i])/2:r[i],f=new Map;for(const d of r)f.set(d,(f.get(d)||0)+1);let l=0;for(const d of f.values())d>l&&(l=d);const u=[];for(const[d,g]of f)g===l&&u.push(d);u.sort((d,g)=>d-g);const p=[];for(const[d,g]of f)p.push({score:d,count:g,frequency:g/r.length});p.sort((d,g)=>d.score-g.score);const b=r.filter(d=>d<=a).length,P=Math.round(b/r.length*100*100)/100,L=r.reduce((d,g)=>d+Math.pow(g-c,2),0)/r.length,w=Math.sqrt(L),C=w===0?0:(a-c)/w,A=r.reduce((d,g)=>d+Math.pow((g-c)/w,3),0),y=w===0?0:A/r.length;return{min:s,max:t,mean:Math.round(c*100)/100,median:m,mode:u,permutationCount:n.length,histogram:p,actualPercentile:P,zScore:Math.round(C*100)/100,skewness:Math.round(y*100)/100,standardDeviation:Math.round(w*100)/100}}const N=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],oe="Tell Me How Bad I Fucked Up",re=.001,V=document.querySelector("#app");if(!V)throw new Error("Failed to find app container");V.innerHTML=`
  <h1>Bowling Fortune Teller</h1>
  <label for="scores-input">Frame-by-Frame Score(s)</label>
  <textarea id="scores-input" name="Frame-by-Frame Score(s)" placeholder="9/ X 81 7/ X X 9- 90 X XX6" aria-describedby="scores-help" rows="15" cols="50"></textarea>
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
    <p>Build: 2025-10-17 07:33:07 CT</p>
  </footer>
`;const v=document.querySelector("#scores-input"),T=document.querySelector("#submit"),M=document.querySelector("#feedback");if(!v||!T||!M)throw new Error("Failed to initialise UI elements");let q=0;function H(){if(Math.random()<re){T.textContent=oe;return}T.textContent=N[q],q=(q+1)%N.length}H();setInterval(H,3e4);let j="";function U(){if(!v.value.trim()){X("Please provide at least one game.",1,1);return}const e=v.value.replace(/\r/g,"").split(`
`),n=[];for(let r=0;r<e.length;r+=1){const a=e[r];if(!a.trim()){X(`Game ${r+1} is empty. Each line must contain exactly ten frames.`,r+1,1);return}const s=K(a);if(s.kind==="error"){ne(s,r,e);return}const t=E(s.frames),o=te(s.frames);n.push({frames:s.frames,score:t,stats:o})}j=v.value,fe(n)}T.addEventListener("click",U);window.addEventListener("DOMContentLoaded",()=>{const n=new URLSearchParams(window.location.search).get("scores");if(n)try{const r=atob(n);v.value=r,U()}catch(r){console.error("Failed to decode scores from URL",r)}});function ne(e,n,r){const a=n+1,s=`Row ${a}, column ${e.column}: ${e.message}`,t=_(r,n,e.column);X(s,a,e.column,t)}function _(e,n,r){let a=0;for(let s=0;s<n;s+=1)a+=e[s].length+1;return a+(r-1)}function X(e,n,r,a){if(M.innerHTML="",M.className="error",M.textContent=e,v.focus(),typeof a=="number")v.setSelectionRange(a,a);else{const s=v.value.replace(/\r/g,"").split(`
`),t=_(s,n-1,r);v.setSelectionRange(t,t)}}function se(e){const{histogram:n,median:r}=e.stats,a=e.score,s=600,t=300,o={top:20,right:20,bottom:40,left:50},c=s-o.left-o.right,i=t-o.top-o.bottom,m=Math.max(...n.map(y=>y.count)),f=e.stats.min,l=e.stats.max,u=Math.max(2,c/n.length),p=n.map((y,d)=>{const g=o.left+d*c/n.length,h=y.count/m*i,$=o.top+i-h,S=y.score===a;return`<rect
      x="${g}"
      y="${$}"
      width="${u}"
      height="${h}"
      fill="${S?"#fbbf24":"#60a5fa"}"
      opacity="${S?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),b=o.left+(r-f)/(l-f)*c,P=`
    <line x1="${b}" y1="${o.top}" x2="${b}" y2="${o.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${b}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,L=5,w=Array.from({length:L+1},(y,d)=>{const g=Math.round(m/L*d),h=o.top+i-d*i/L;return`
      <line x1="${o.left-5}" y1="${h}" x2="${o.left}" y2="${h}" stroke="#94a3b8" stroke-width="1" />
      <text x="${o.left-10}" y="${h+4}" text-anchor="end" font-size="11" fill="#94a3b8">${g.toLocaleString()}</text>
    `}).join(""),C=Math.min(10,Math.ceil((l-f)/10)),A=Array.from({length:C+1},(y,d)=>{const g=Math.round(f+(l-f)/C*d),h=o.left+d*c/C;return`
      <line x1="${h}" y1="${o.top+i}" x2="${h}" y2="${o.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${h}" y="${o.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${g}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${t}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${t}" fill="rgba(15, 23, 42, 0.5)" />
      ${p}
      ${P}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+i}" x2="${o.left+c}" y2="${o.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${w}
      ${A}
      <text x="${o.left+c/2}" y="${t-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${o.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${o.top+i/2})">Count</text>
    </svg>
  `}function ae(e){const{zScore:n,actualPercentile:r,skewness:a}=e.stats;e.score-e.stats.median;let s="";return Math.abs(n)<.5?s="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":n>=2?s="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":n<=-2?s="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":n>1?s="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":n<-1?s="Your score was <strong>notably below average</strong> — your frame order worked against you.":n>0?s="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":s="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",r>=95?s+=" You scored in the <strong>top 5%</strong> of all possible orderings.":r>=75?s+=" You scored in the <strong>top quartile</strong> of possible orderings.":r<=5?s+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":r<=25&&(s+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),s}function ie(e){let n=new Map;for(const r of e[0].stats.histogram)n.set(r.score,r.count);for(let r=1;r<e.length;r++){const a=new Map;for(const[s,t]of n)for(const o of e[r].stats.histogram){const c=s+o.score,i=t*o.count;a.set(c,(a.get(c)||0)+i)}n=a}return n}function ce(e,n){const r=ie(e),a=[];for(const[h,$]of r)a.push({score:h,count:$});a.sort((h,$)=>h.score-$.score);const s=600,t=300,o={top:20,right:20,bottom:40,left:50},c=s-o.left-o.right,i=t-o.top-o.bottom,m=Math.max(...a.map(h=>h.count)),f=a[0].score,l=a[a.length-1].score,u=Array.from(r.values()).reduce((h,$)=>h+$,0);let p=0,b=0;for(const h of a)if(p+=h.count,p>=u/2){b=h.score;break}const P=Math.max(2,c/a.length),L=a.map((h,$)=>{const S=o.left+$*c/a.length,k=h.count/m*i,G=o.top+i-k,B=h.score===n;return`<rect
      x="${S}"
      y="${G}"
      width="${P}"
      height="${k}"
      fill="${B?"#fbbf24":"#60a5fa"}"
      opacity="${B?"1":"0.7"}"
    >
      <title>Series Score: ${h.score}
Combinations: ${h.count.toLocaleString()}</title>
    </rect>`}).join(""),w=o.left+(b-f)/(l-f)*c,C=`
    <line x1="${w}" y1="${o.top}" x2="${w}" y2="${o.top+i}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${w}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,y=Array.from({length:A+1},(h,$)=>{const S=Math.round(m/A*$),k=o.top+i-$*i/A;return`
      <line x1="${o.left-5}" y1="${k}" x2="${o.left}" y2="${k}" stroke="#94a3b8" stroke-width="1" />
      <text x="${o.left-10}" y="${k+4}" text-anchor="end" font-size="11" fill="#94a3b8">${S.toLocaleString()}</text>
    `}).join(""),d=Math.min(10,Math.ceil((l-f)/20)),g=Array.from({length:d+1},(h,$)=>{const S=Math.round(f+(l-f)/d*$),k=o.left+$*c/d;return`
      <line x1="${k}" y1="${o.top+i}" x2="${k}" y2="${o.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${k}" y="${o.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${S}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${t}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${t}" fill="rgba(15, 23, 42, 0.5)" />
      ${L}
      ${C}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+i}" x2="${o.left+c}" y2="${o.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${g}
      <text x="${o.left+c/2}" y="${t-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
      <text x="15" y="${o.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${o.top+i/2})">Combinations</text>
    </svg>
  `}function le(e){if(e.length<2)return"";const n=e.reduce((l,u)=>l+u.score,0),r=Math.round(n/e.length*100)/100,a=Math.round(e.reduce((l,u)=>l+u.stats.actualPercentile,0)/e.length*100)/100,s=Math.round(e.reduce((l,u)=>l+u.stats.zScore,0)/e.length*100)/100,t=Math.round(e.reduce((l,u)=>l+(u.score-u.stats.median),0)/e.length*100)/100,o=Math.round(e.reduce((l,u)=>l+u.stats.median,0)/e.length*100)/100,c=Math.round(e.reduce((l,u)=>l+u.stats.mean,0)/e.length*100)/100,i=Math.round(e.reduce((l,u)=>l+u.stats.standardDeviation,0)/e.length*100)/100,m=t>=0?`+${t}`:`${t}`;let f="";return Math.abs(s)<.5?f="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":s>=1.5?f="Across this series, you had <strong>notably favorable</strong> frame sequences. Lady Luck was on your side!":s<=-1.5?f="Across this series, you had <strong>notably unfavorable</strong> frame sequences. The odds worked against you.":s>.5?f="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":f="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",a>=70?f+=" You consistently scored in the upper ranges of possible outcomes.":a<=30&&(f+=" You consistently scored in the lower ranges of possible outcomes."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${f}</p>
      </div>

      <div class="histogram-container">
        ${ce(e,n)}
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

        <dt>Average percentile:</dt>
        <dd>${a}%</dd>

        <dt>Average z-score:</dt>
        <dd>${s}</dd>

        <dt>Average expected pins +/-:</dt>
        <dd>${m}</dd>

        <dt>Average median:</dt>
        <dd>${o}</dd>

        <dt>Average mean:</dt>
        <dd>${c}</dd>

        <dt>Average std. deviation:</dt>
        <dd>${i}</dd>
      </dl>
    </article>
  `}function de(){const e=btoa(j),n=new URL(window.location.href);return n.search=`?scores=${encodeURIComponent(e)}`,n.toString()}function ue(){const e=de();navigator.clipboard.writeText(e).then(()=>{Y("Link copied!")}).catch(n=>{console.error("Failed to copy link",n),Y("Failed to copy link")})}function Y(e){const n=document.querySelector(".toast");n&&n.remove();const r=document.createElement("div");r.className="toast",r.textContent=e,document.body.appendChild(r),setTimeout(()=>{r.classList.add("show")},10),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>{r.remove()},300)},2e3)}function fe(e){if(M.className="output",e.length===0){M.innerHTML="";return}const n=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,r=e.map((t,o)=>{const c=o+1,i=t.stats.mode.length===1?t.stats.mode[0].toString():`${t.stats.mode.join(", ")} (multimodal)`,m=t.score-t.stats.median,f=m>=0?`+${m}`:`${m}`,l=ae(t);return`
        <article class="result-card">
          <h2>Game ${c}</h2>
          <p><strong>Actual score:</strong> ${t.score}</p>

          <div class="narrative">
            <p>${l}</p>
          </div>

          <div class="histogram-container">
            ${se(t)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${t.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${t.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${t.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${f}</dd>

            <dt>Minimum score:</dt>
            <dd>${t.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${t.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${t.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${t.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${t.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${t.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${i}</dd>
          </dl>
        </article>
      `}).join(""),a=le(e);M.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${n}
      </div>
      ${r}
      ${a}
      <div class="results-footer">
        ${n}
      </div>
    </section>
  `,M.querySelectorAll("[data-copy-link]").forEach(t=>{t.addEventListener("click",ue)})}
