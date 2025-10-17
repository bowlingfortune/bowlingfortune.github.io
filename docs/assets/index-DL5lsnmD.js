(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(n){if(n.ep)return;n.ep=!0;const e=r(n);fetch(n.href,e)}})();const Z=new Set([" ","	",",",";"]),B=new Set("0123456789-".split("")),K=new Set("0123456789-X/".split(""));function O(t){return Z.has(t)}function q(t){const{line:s}=t;for(;t.index<s.length&&O(s[t.index]);)t.index+=1;if(t.index>=s.length)return null;const r=t.index+1,i=s[t.index].toUpperCase();return t.index+=1,{char:i,column:r}}function P(t){if(t==="X")return 10;if(t==="-")return 0;const s=Number.parseInt(t,10);if(Number.isNaN(s))throw new Error(`Invalid roll symbol '${t}'`);if(s<0||s>9)throw new Error(`Invalid roll value '${t}'`);return s}function D(t){return t==="X"||B.has(t)}function R(t){return K.has(t)}function S(t,s,r){return{symbol:t,value:s,column:r}}function J(t){const s=[],r={line:t,index:0},i=()=>{for(;r.index<t.length&&O(t[r.index]);)r.index+=1};for(let e=0;e<9;e+=1){if(i(),r.index>=t.length)return{kind:"error",message:`Expected frame ${e+1}, but the line ended early`,column:t.length+1};const o=q(r);if(!o)return{kind:"error",message:`Expected frame ${e+1}, but found nothing`,column:t.length+1};const{char:c,column:a}=o;if(!D(c))return{kind:"error",message:`Invalid roll '${c}' in frame ${e+1}`,column:a};if(c==="X"){s.push({rolls:[S("X",10,a)],isStrike:!0,isSpare:!1});continue}const u=P(c),h=q(r);if(!h)return{kind:"error",message:`Frame ${e+1} is missing a second roll`,column:t.length+1};const{char:g,column:$}=h;if(g==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${e+1}`,column:$};if(g==="/"){if(u>=10)return{kind:"error",message:`Spare in frame ${e+1} requires the first roll to be less than 10`,column:$};const w=10-u;s.push({rolls:[S(c,u,a),S("/",w,$)],isStrike:!1,isSpare:!0});continue}if(!B.has(g))return{kind:"error",message:`Invalid roll '${g}' in frame ${e+1}`,column:$};const y=P(g);if(u+y>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${e+1}`,column:$};s.push({rolls:[S(c,u,a),S(g,y,$)],isStrike:!1,isSpare:!1})}if(i(),r.index>=t.length)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const n=Q(r,t);return n.kind==="error"?n:(s.push(n.frame),i(),r.index<t.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:r.index+1}:{kind:"success",frames:s})}function Q(t,s){const r=q(t);if(!r)return{kind:"error",message:"Frame 10 is missing",column:s.length+1};const{char:i,column:n}=r;if(!D(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:n};if(i==="X")return ee(t,n);const e=P(i),o=q(t);if(!o)return{kind:"error",message:"Frame 10 is missing a second roll",column:s.length+1};const{char:c,column:a}=o;if(c==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:a};if(c==="/"){if(e>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:a};const h=10-e,g=q(t);if(!g)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:s.length+1};const{char:$,column:y}=g;if($==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:y};if(!R($))return{kind:"error",message:`Invalid fill ball '${$}' in frame 10`,column:y};const w=$==="X"?10:P($);return{kind:"success",frame:{rolls:[S(i,e,n),S("/",h,a),S($,w,y)],isStrike:!1,isSpare:!0}}}if(!B.has(c))return{kind:"error",message:`Invalid roll '${c}' in frame 10`,column:a};const u=P(c);return e+u>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:a}:{kind:"success",frame:{rolls:[S(i,e,n),S(c,u,a)],isStrike:!1,isSpare:!1}}}function ee(t,s){const r=q(t);if(!r)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:i,column:n}=r;if(!R(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:n};let e;i==="X"?e=10:e=P(i);const o=q(t);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:c,column:a}=o;if(!R(c))return{kind:"error",message:`Invalid fill ball '${c}' in frame 10`,column:a};let u;if(c==="X")u=10;else if(c==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:a};if(e>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:a};u=10-e}else if(u=P(c),i!=="X"&&e+u>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:a};return{kind:"success",frame:{rolls:[S("X",10,s),S(i,e,n),S(c,u,a)],isStrike:!0,isSpare:!1}}}function E(t){const s=[],r=[],i=[];for(const o of t){for(const c of o.rolls)s.push(c.value);r.push(o.isStrike),i.push(o.isSpare)}let n=0,e=0;for(let o=0;o<10;o+=1)r[o]?(n+=10+(s[e+1]??0)+(s[e+2]??0),e+=1):i[o]?(n+=10+(s[e+2]??0),e+=2):(n+=(s[e]??0)+(s[e+1]??0),e+=2);return n}function te(t){if(t.length!==10)throw new Error("Expected exactly 10 frames");const s=t.slice(0,9),r=t[9],i=[];function n(e,o){if(o===1){i.push([...e,r]);return}for(let c=0;c<o;c++)n(e,o-1),o%2===0?[e[c],e[o-1]]=[e[o-1],e[c]]:[e[0],e[o-1]]=[e[o-1],e[0]]}return n(s,s.length),i}function oe(t){const s=te(t),r=s.map(l=>E(l)),i=E(t);r.sort((l,p)=>l-p);const n=r[0],e=r[r.length-1],c=r.reduce((l,p)=>l+p,0)/r.length,a=Math.floor(r.length/2),u=r.length%2===0?(r[a-1]+r[a])/2:r[a],h=new Map;for(const l of r)h.set(l,(h.get(l)||0)+1);let g=0;for(const l of h.values())l>g&&(g=l);const $=[];for(const[l,p]of h)p===g&&$.push(l);$.sort((l,p)=>l-p);const y=[];for(const[l,p]of h)y.push({score:l,count:p,frequency:p/r.length});y.sort((l,p)=>l.score-p.score);const w=r.filter(l=>l<=i).length,M=Math.round(w/r.length*100*100)/100,k=r.reduce((l,p)=>l+Math.pow(p-c,2),0)/r.length,v=Math.sqrt(k),C=v===0?0:(i-c)/v,L=r.reduce((l,p)=>l+Math.pow((p-c)/v,3),0),x=v===0?0:L/r.length;return{min:n,max:e,mean:Math.round(c*100)/100,median:u,mode:$,permutationCount:s.length,histogram:y,actualPercentile:M,zScore:Math.round(C*100)/100,skewness:Math.round(x*100)/100,standardDeviation:Math.round(v*100)/100}}const N=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],re="Tell Me How Bad I Fucked Up",se=.001,V=document.querySelector("#app");if(!V)throw new Error("Failed to find app container");V.innerHTML=`
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
    <p>Build: 2025-10-17 07:37:37 CT</p>
  </footer>
`;const A=document.querySelector("#scores-input"),I=document.querySelector("#submit"),F=document.querySelector("#feedback");if(!A||!I||!F)throw new Error("Failed to initialise UI elements");let T=0;function H(){if(Math.random()<se){I.textContent=re;return}I.textContent=N[T],T=(T+1)%N.length}H();setInterval(H,3e4);let j="";function U(){if(!A.value.trim()){X("Please provide at least one game.",1,1);return}const t=A.value.replace(/\r/g,"").split(`
`),s=[];for(let r=0;r<t.length;r+=1){const i=t[r];if(!i.trim()){X(`Game ${r+1} is empty. Each line must contain exactly ten frames.`,r+1,1);return}const n=J(i);if(n.kind==="error"){ne(n,r,t);return}const e=E(n.frames),o=oe(n.frames);s.push({frames:n.frames,score:e,stats:o})}j=A.value,fe(s)}I.addEventListener("click",U);window.addEventListener("DOMContentLoaded",()=>{const s=new URLSearchParams(window.location.search).get("scores");if(s)try{const r=atob(s);A.value=r,U()}catch(r){console.error("Failed to decode scores from URL",r)}});function ne(t,s,r){const i=s+1,n=`Row ${i}, column ${t.column}: ${t.message}`,e=_(r,s,t.column);X(n,i,t.column,e)}function _(t,s,r){let i=0;for(let n=0;n<s;n+=1)i+=t[n].length+1;return i+(r-1)}function X(t,s,r,i){if(F.innerHTML="",F.className="error",F.textContent=t,A.focus(),typeof i=="number")A.setSelectionRange(i,i);else{const n=A.value.replace(/\r/g,"").split(`
`),e=_(n,s-1,r);A.setSelectionRange(e,e)}}function ie(t){const{histogram:s,median:r}=t.stats,i=t.score,n=600,e=300,o={top:20,right:20,bottom:40,left:50},c=n-o.left-o.right,a=e-o.top-o.bottom,u=Math.max(...s.map(x=>x.count)),h=t.stats.min,g=t.stats.max,$=Math.max(2,c/s.length),y=s.map((x,l)=>{const p=o.left+l*c/s.length,f=x.count/u*a,m=o.top+a-f,d=x.score===i;return`<rect
      x="${p}"
      y="${m}"
      width="${$}"
      height="${f}"
      fill="${d?"#fbbf24":"#60a5fa"}"
      opacity="${d?"1":"0.7"}"
    >
      <title>Score: ${x.score}
Count: ${x.count.toLocaleString()}
Frequency: ${(x.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),w=o.left+(r-h)/(g-h)*c,M=`
    <line x1="${w}" y1="${o.top}" x2="${w}" y2="${o.top+a}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${w}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,k=5,v=Array.from({length:k+1},(x,l)=>{const p=Math.round(u/k*l),f=o.top+a-l*a/k;return`
      <line x1="${o.left-5}" y1="${f}" x2="${o.left}" y2="${f}" stroke="#94a3b8" stroke-width="1" />
      <text x="${o.left-10}" y="${f+4}" text-anchor="end" font-size="11" fill="#94a3b8">${p.toLocaleString()}</text>
    `}).join(""),C=Math.min(10,Math.ceil((g-h)/10)),L=Array.from({length:C+1},(x,l)=>{const p=Math.round(h+(g-h)/C*l),f=o.left+l*c/C;return`
      <line x1="${f}" y1="${o.top+a}" x2="${f}" y2="${o.top+a+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${f}" y="${o.top+a+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${p}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${n} ${e}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${e}" fill="rgba(15, 23, 42, 0.5)" />
      ${y}
      ${M}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+a}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+a}" x2="${o.left+c}" y2="${o.top+a}" stroke="#94a3b8" stroke-width="2" />
      ${v}
      ${L}
      <text x="${o.left+c/2}" y="${e-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${o.top+a/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${o.top+a/2})">Count</text>
    </svg>
  `}function ae(t){const{zScore:s,actualPercentile:r,skewness:i}=t.stats;t.score-t.stats.median;let n="";return Math.abs(s)<.5?n="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":s>=2?n="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":s<=-2?n="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":s>1?n="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":s<-1?n="Your score was <strong>notably below average</strong> — your frame order worked against you.":s>0?n="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":n="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",r>=95?n+=" You scored in the <strong>top 5%</strong> of all possible orderings.":r>=75?n+=" You scored in the <strong>top quartile</strong> of possible orderings.":r<=5?n+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":r<=25&&(n+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),n}function G(t){let s=new Map;for(const r of t[0].stats.histogram)s.set(r.score,r.count);for(let r=1;r<t.length;r++){const i=new Map;for(const[n,e]of s)for(const o of t[r].stats.histogram){const c=n+o.score,a=e*o.count;i.set(c,(i.get(c)||0)+a)}s=i}return s}function ce(t,s){const r=G(t),i=[];for(const[f,m]of r)i.push({score:f,count:m});i.sort((f,m)=>f.score-m.score);const n=600,e=300,o={top:20,right:20,bottom:40,left:50},c=n-o.left-o.right,a=e-o.top-o.bottom,u=Math.max(...i.map(f=>f.count)),h=i[0].score,g=i[i.length-1].score,$=Array.from(r.values()).reduce((f,m)=>f+m,0);let y=0,w=0;for(const f of i)if(y+=f.count,y>=$/2){w=f.score;break}const M=Math.max(2,c/i.length),k=i.map((f,m)=>{const d=o.left+m*c/i.length,b=f.count/u*a,W=o.top+a-b,Y=f.score===s;return`<rect
      x="${d}"
      y="${W}"
      width="${M}"
      height="${b}"
      fill="${Y?"#fbbf24":"#60a5fa"}"
      opacity="${Y?"1":"0.7"}"
    >
      <title>Series Score: ${f.score}
Combinations: ${f.count.toLocaleString()}</title>
    </rect>`}).join(""),v=o.left+(w-h)/(g-h)*c,C=`
    <line x1="${v}" y1="${o.top}" x2="${v}" y2="${o.top+a}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${v}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,L=5,x=Array.from({length:L+1},(f,m)=>{const d=Math.round(u/L*m),b=o.top+a-m*a/L;return`
      <line x1="${o.left-5}" y1="${b}" x2="${o.left}" y2="${b}" stroke="#94a3b8" stroke-width="1" />
      <text x="${o.left-10}" y="${b+4}" text-anchor="end" font-size="11" fill="#94a3b8">${d.toLocaleString()}</text>
    `}).join(""),l=Math.min(10,Math.ceil((g-h)/20)),p=Array.from({length:l+1},(f,m)=>{const d=Math.round(h+(g-h)/l*m),b=o.left+m*c/l;return`
      <line x1="${b}" y1="${o.top+a}" x2="${b}" y2="${o.top+a+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${b}" y="${o.top+a+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${n} ${e}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${e}" fill="rgba(15, 23, 42, 0.5)" />
      ${k}
      ${C}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+a}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+a}" x2="${o.left+c}" y2="${o.top+a}" stroke="#94a3b8" stroke-width="2" />
      ${x}
      ${p}
      <text x="${o.left+c/2}" y="${e-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
      <text x="15" y="${o.top+a/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${o.top+a/2})">Combinations</text>
    </svg>
  `}function le(t){if(t.length<2)return"";const s=t.reduce((d,b)=>d+b.score,0),r=Math.round(s/t.length*100)/100,i=G(t),n=[];for(const[d,b]of i)n.push({score:d,count:b});n.sort((d,b)=>d.score-b.score);const e=Array.from(i.values()).reduce((d,b)=>d+b,0),o=n[0].score,c=n[n.length-1].score;let a=0;for(const d of n)a+=d.score*d.count;const u=a/e;let h=0,g=0;for(const d of n)if(h+=d.count,h>=e/2){g=d.score;break}const $=n.filter(d=>d.score<=s).reduce((d,b)=>d+b.count,0),y=Math.round($/e*100*100)/100;let w=0;for(const d of n)w+=Math.pow(d.score-u,2)*d.count;const M=Math.sqrt(w/e),k=M===0?0:(s-u)/M;let v=0;for(const d of n)v+=Math.pow((d.score-u)/M,3)*d.count;const C=M===0?0:v/e;let L=0;for(const d of n)d.count>L&&(L=d.count);const x=[];for(const d of n)d.count===L&&x.push(d.score);const l=s-g,p=l>=0?`+${l}`:`${l}`,f=x.length===1?x[0].toString():`${x.join(", ")} (multimodal)`;let m="";return Math.abs(k)<.5?m="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":k>=2?m="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":k<=-2?m="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":k>=1?m="Across this series, you had <strong>notably favorable</strong> frame sequences.":k<=-1?m="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":k>0?m="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":m="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",y>=95?m+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":y>=75?m+=" You scored in the <strong>top quartile</strong> of possible combinations.":y<=5?m+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":y<=25&&(m+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${t.length} Games)</h2>

      <div class="narrative">
        <p>${m}</p>
      </div>

      <div class="histogram-container">
        ${ce(t,s)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${s}</dd>

        <dt>Average score per game:</dt>
        <dd>${r}</dd>

        <dt>Percentile:</dt>
        <dd>${y}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(k*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${p}</dd>

        <dt>Minimum score:</dt>
        <dd>${o}</dd>

        <dt>Maximum score:</dt>
        <dd>${c}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(u*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${g}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(M*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(C*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${f}</dd>
      </dl>
    </article>
  `}function de(){const t=btoa(j),s=new URL(window.location.href);return s.search=`?scores=${encodeURIComponent(t)}`,s.toString()}function ue(){const t=de();navigator.clipboard.writeText(t).then(()=>{z("Link copied!")}).catch(s=>{console.error("Failed to copy link",s),z("Failed to copy link")})}function z(t){const s=document.querySelector(".toast");s&&s.remove();const r=document.createElement("div");r.className="toast",r.textContent=t,document.body.appendChild(r),setTimeout(()=>{r.classList.add("show")},10),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>{r.remove()},300)},2e3)}function fe(t){if(F.className="output",t.length===0){F.innerHTML="";return}const s=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,r=t.map((e,o)=>{const c=o+1,a=e.stats.mode.length===1?e.stats.mode[0].toString():`${e.stats.mode.join(", ")} (multimodal)`,u=e.score-e.stats.median,h=u>=0?`+${u}`:`${u}`,g=ae(e);return`
        <article class="result-card">
          <h2>Game ${c}</h2>
          <p><strong>Actual score:</strong> ${e.score}</p>

          <div class="narrative">
            <p>${g}</p>
          </div>

          <div class="histogram-container">
            ${ie(e)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${e.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${e.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${e.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${h}</dd>

            <dt>Minimum score:</dt>
            <dd>${e.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${e.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${e.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${e.stats.median}</dd>

            <dt>Standard deviation:</dt>
            <dd>${e.stats.standardDeviation}</dd>

            <dt>Skewness:</dt>
            <dd>${e.stats.skewness}</dd>

            <dt>Mode:</dt>
            <dd>${a}</dd>
          </dl>
        </article>
      `}).join(""),i=le(t);F.innerHTML=`
    <section class="results">
      <div class="results-header">
        ${s}
      </div>
      ${r}
      ${i}
      <div class="results-footer">
        ${s}
      </div>
    </section>
  `,F.querySelectorAll("[data-copy-link]").forEach(e=>{e.addEventListener("click",ue)})}
