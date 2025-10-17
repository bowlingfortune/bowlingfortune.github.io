(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const H=new Set([" ","	",",",";"]),E=new Set("0123456789-".split("")),D=new Set("0123456789-X/".split(""));function N(t){return H.has(t)}function b(t){const{line:s}=t;for(;t.index<s.length&&N(s[t.index]);)t.index+=1;if(t.index>=s.length)return null;const e=t.index+1,i=s[t.index].toUpperCase();return t.index+=1,{char:i,column:e}}function S(t){if(t==="X")return 10;if(t==="-")return 0;const s=Number.parseInt(t,10);if(Number.isNaN(s))throw new Error(`Invalid roll symbol '${t}'`);if(s<0||s>9)throw new Error(`Invalid roll value '${t}'`);return s}function V(t){return t==="X"||E.has(t)}function X(t){return D.has(t)}function g(t,s,e){return{symbol:t,value:s,column:e}}function _(t){const s=[],e={line:t,index:0},i=()=>{for(;e.index<t.length&&N(t[e.index]);)e.index+=1};for(let r=0;r<9;r+=1){if(i(),e.index>=t.length)return{kind:"error",message:`Expected frame ${r+1}, but the line ended early`,column:t.length+1};const o=b(e);if(!o)return{kind:"error",message:`Expected frame ${r+1}, but found nothing`,column:t.length+1};const{char:a,column:l}=o;if(!V(a))return{kind:"error",message:`Invalid roll '${a}' in frame ${r+1}`,column:l};if(a==="X"){s.push({rolls:[g("X",10,l)],isStrike:!0,isSpare:!1});continue}const u=S(a),h=b(e);if(!h)return{kind:"error",message:`Frame ${r+1} is missing a second roll`,column:t.length+1};const{char:m,column:f}=h;if(m==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${r+1}`,column:f};if(m==="/"){if(u>=10)return{kind:"error",message:`Spare in frame ${r+1} requires the first roll to be less than 10`,column:f};const x=10-u;s.push({rolls:[g(a,u,l),g("/",x,f)],isStrike:!1,isSpare:!0});continue}if(!E.has(m))return{kind:"error",message:`Invalid roll '${m}' in frame ${r+1}`,column:f};const p=S(m);if(u+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${r+1}`,column:f};s.push({rolls:[g(a,u,l),g(m,p,f)],isStrike:!1,isSpare:!1})}if(i(),e.index>=t.length)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const n=j(e,t);return n.kind==="error"?n:(s.push(n.frame),i(),e.index<t.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:e.index+1}:{kind:"success",frames:s})}function j(t,s){const e=b(t);if(!e)return{kind:"error",message:"Frame 10 is missing",column:s.length+1};const{char:i,column:n}=e;if(!V(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:n};if(i==="X")return G(t,n);const r=S(i),o=b(t);if(!o)return{kind:"error",message:"Frame 10 is missing a second roll",column:s.length+1};const{char:a,column:l}=o;if(a==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:l};if(a==="/"){if(r>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:l};const h=10-r,m=b(t);if(!m)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:s.length+1};const{char:f,column:p}=m;if(f==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!X(f))return{kind:"error",message:`Invalid fill ball '${f}' in frame 10`,column:p};const x=f==="X"?10:S(f);return{kind:"success",frame:{rolls:[g(i,r,n),g("/",h,l),g(f,x,p)],isStrike:!1,isSpare:!0}}}if(!E.has(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:l};const u=S(a);return r+u>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:l}:{kind:"success",frame:{rolls:[g(i,r,n),g(a,u,l)],isStrike:!1,isSpare:!1}}}function G(t,s){const e=b(t);if(!e)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:i,column:n}=e;if(!X(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:n};let r;i==="X"?r=10:r=S(i);const o=b(t);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:a,column:l}=o;if(!X(a))return{kind:"error",message:`Invalid fill ball '${a}' in frame 10`,column:l};let u;if(a==="X")u=10;else if(a==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:l};if(r>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:l};u=10-r}else if(u=S(a),i!=="X"&&r+u>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:l};return{kind:"success",frame:{rolls:[g("X",10,s),g(i,r,n),g(a,u,l)],isStrike:!0,isSpare:!1}}}function q(t){const s=[],e=[],i=[];for(const o of t){for(const a of o.rolls)s.push(a.value);e.push(o.isStrike),i.push(o.isSpare)}let n=0,r=0;for(let o=0;o<10;o+=1)e[o]?(n+=10+(s[r+1]??0)+(s[r+2]??0),r+=1):i[o]?(n+=10+(s[r+2]??0),r+=2):(n+=(s[r]??0)+(s[r+1]??0),r+=2);return n}function U(t){if(t.length!==10)throw new Error("Expected exactly 10 frames");const s=t.slice(0,9),e=t[9],i=[];function n(r,o){if(o===1){i.push([...r,e]);return}for(let a=0;a<o;a++)n(r,o-1),o%2===0?[r[a],r[o-1]]=[r[o-1],r[a]]:[r[0],r[o-1]]=[r[o-1],r[0]]}return n(s,s.length),i}function W(t){const s=U(t),e=s.map(c=>q(c)),i=q(t);e.sort((c,d)=>c-d);const n=e[0],r=e[e.length-1],a=e.reduce((c,d)=>c+d,0)/e.length,l=Math.floor(e.length/2),u=e.length%2===0?(e[l-1]+e[l])/2:e[l],h=new Map;for(const c of e)h.set(c,(h.get(c)||0)+1);let m=0;for(const c of h.values())c>m&&(m=c);const f=[];for(const[c,d]of h)d===m&&f.push(c);f.sort((c,d)=>c-d);const p=[];for(const[c,d]of h)p.push({score:c,count:d,frequency:d/e.length});p.sort((c,d)=>c.score-d.score);const x=e.filter(c=>c<=i).length,I=Math.round(x/e.length*100*100)/100,M=e.reduce((c,d)=>c+Math.pow(d-a,2),0)/e.length,k=Math.sqrt(M),F=k===0?0:(i-a)/k,L=e.reduce((c,d)=>c+Math.pow((d-a)/k,3),0),y=k===0?0:L/e.length;return{min:n,max:r,mean:Math.round(a*100)/100,median:u,mode:f,permutationCount:s.length,histogram:p,actualPercentile:I,zScore:Math.round(F*100)/100,skewness:Math.round(y*100)/100,standardDeviation:Math.round(k*100)/100}}const A=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],K="Tell Me How Bad I Fucked Up",Z=.001,B=document.querySelector("#app");if(!B)throw new Error("Failed to find app container");B.innerHTML=`
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
    <p>Build: 2025-10-17 07:15:59 CT</p>
  </footer>
`;const w=document.querySelector("#scores-input"),C=document.querySelector("#submit"),v=document.querySelector("#feedback");if(!w||!C||!v)throw new Error("Failed to initialise UI elements");let P=0;function O(){if(Math.random()<Z){C.textContent=K;return}C.textContent=A[P],P=(P+1)%A.length}O();setInterval(O,3e4);C.addEventListener("click",()=>{if(!w.value.trim()){R("Please provide at least one game.",1,1);return}const t=w.value.replace(/\r/g,"").split(`
`),s=[];for(let e=0;e<t.length;e+=1){const i=t[e];if(!i.trim()){R(`Game ${e+1} is empty. Each line must contain exactly ten frames.`,e+1,1);return}const n=_(i);if(n.kind==="error"){J(n,e,t);return}const r=q(n.frames),o=W(n.frames);s.push({frames:n.frames,score:r,stats:o})}te(s)});function J(t,s,e){const i=s+1,n=`Row ${i}, column ${t.column}: ${t.message}`,r=Y(e,s,t.column);R(n,i,t.column,r)}function Y(t,s,e){let i=0;for(let n=0;n<s;n+=1)i+=t[n].length+1;return i+(e-1)}function R(t,s,e,i){if(v.innerHTML="",v.className="error",v.textContent=t,w.focus(),typeof i=="number")w.setSelectionRange(i,i);else{const n=w.value.replace(/\r/g,"").split(`
`),r=Y(n,s-1,e);w.setSelectionRange(r,r)}}function Q(t){const{histogram:s,median:e}=t.stats,i=t.score,n=600,r=300,o={top:20,right:20,bottom:40,left:50},a=n-o.left-o.right,l=r-o.top-o.bottom,u=Math.max(...s.map(y=>y.count)),h=t.stats.min,m=t.stats.max,f=Math.max(2,a/s.length),p=s.map((y,c)=>{const d=o.left+c*a/s.length,$=y.count/u*l,z=o.top+l-$,T=y.score===i;return`<rect
      x="${d}"
      y="${z}"
      width="${f}"
      height="${$}"
      fill="${T?"#fbbf24":"#60a5fa"}"
      opacity="${T?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=o.left+(e-h)/(m-h)*a,I=`
    <line x1="${x}" y1="${o.top}" x2="${x}" y2="${o.top+l}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,M=5,k=Array.from({length:M+1},(y,c)=>{const d=Math.round(u/M*c),$=o.top+l-c*l/M;return`
      <line x1="${o.left-5}" y1="${$}" x2="${o.left}" y2="${$}" stroke="#94a3b8" stroke-width="1" />
      <text x="${o.left-10}" y="${$+4}" text-anchor="end" font-size="11" fill="#94a3b8">${d.toLocaleString()}</text>
    `}).join(""),F=Math.min(10,Math.ceil((m-h)/10)),L=Array.from({length:F+1},(y,c)=>{const d=Math.round(h+(m-h)/F*c),$=o.left+c*a/F;return`
      <line x1="${$}" y1="${o.top+l}" x2="${$}" y2="${o.top+l+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${$}" y="${o.top+l+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${d}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${n} ${r}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${p}
      ${I}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+l}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+l}" x2="${o.left+a}" y2="${o.top+l}" stroke="#94a3b8" stroke-width="2" />
      ${k}
      ${L}
      <text x="${o.left+a/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${o.top+l/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${o.top+l/2})">Count</text>
    </svg>
  `}function ee(t){const{zScore:s,actualPercentile:e,skewness:i}=t.stats;t.score-t.stats.median;let n="";return Math.abs(s)<.5?n="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":s>=2?n="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":s<=-2?n="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":s>1?n="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":s<-1?n="Your score was <strong>notably below average</strong> — your frame order worked against you.":s>0?n="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":n="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",e>=95?n+=" You scored in the <strong>top 5%</strong> of all possible orderings.":e>=75?n+=" You scored in the <strong>top quartile</strong> of possible orderings.":e<=5?n+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":e<=25&&(n+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),n}function te(t){if(v.className="output",t.length===0){v.innerHTML="";return}const s=t.map((e,i)=>{const n=i+1,r=e.stats.mode.length===1?e.stats.mode[0].toString():`${e.stats.mode.join(", ")} (multimodal)`,o=e.score-e.stats.median,a=o>=0?`+${o}`:`${o}`,l=ee(e);return`
        <article class="result-card">
          <h2>Game ${n}</h2>
          <p><strong>Actual score:</strong> ${e.score}</p>

          <div class="narrative">
            <p>${l}</p>
          </div>

          <div class="histogram-container">
            ${Q(e)}
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
            <dd>${a}</dd>

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
            <dd>${r}</dd>
          </dl>
        </article>
      `}).join("");v.innerHTML=`<section class="results">${s}</section>`}
