(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(t){if(t.ep)return;t.ep=!0;const r=o(t);fetch(t.href,r)}})();const D=new Set([" ","	",",",";"]),R=new Set("0123456789-".split("")),H=new Set("0123456789-X/".split(""));function N(e){return D.has(e)}function w(e){const{line:s}=e;for(;e.index<s.length&&N(s[e.index]);)e.index+=1;if(e.index>=s.length)return null;const o=e.index+1,n=s[e.index].toUpperCase();return e.index+=1,{char:n,column:o}}function k(e){if(e==="X")return 10;if(e==="-")return 0;const s=Number.parseInt(e,10);if(Number.isNaN(s))throw new Error(`Invalid roll symbol '${e}'`);if(s<0||s>9)throw new Error(`Invalid roll value '${e}'`);return s}function Y(e){return e==="X"||R.has(e)}function I(e){return H.has(e)}function g(e,s,o){return{symbol:e,value:s,column:o}}function G(e){const s=[],o={line:e,index:0},n=()=>{for(;o.index<e.length&&N(e[o.index]);)o.index+=1};for(let r=0;r<9;r+=1){if(n(),o.index>=e.length)return{kind:"error",message:`Expected frame ${r+1}, but the line ended early`,column:e.length+1};const a=w(o);if(!a)return{kind:"error",message:`Expected frame ${r+1}, but found nothing`,column:e.length+1};const{char:i,column:c}=a;if(!Y(i))return{kind:"error",message:`Invalid roll '${i}' in frame ${r+1}`,column:c};if(i==="X"){s.push({rolls:[g("X",10,c)],isStrike:!0,isSpare:!1});continue}const m=k(i),f=w(o);if(!f)return{kind:"error",message:`Frame ${r+1} is missing a second roll`,column:e.length+1};const{char:u,column:l}=f;if(u==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${r+1}`,column:l};if(u==="/"){if(m>=10)return{kind:"error",message:`Spare in frame ${r+1} requires the first roll to be less than 10`,column:l};const x=10-m;s.push({rolls:[g(i,m,c),g("/",x,l)],isStrike:!1,isSpare:!0});continue}if(!R.has(u))return{kind:"error",message:`Invalid roll '${u}' in frame ${r+1}`,column:l};const p=k(u);if(m+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${r+1}`,column:l};s.push({rolls:[g(i,m,c),g(u,p,l)],isStrike:!1,isSpare:!1})}if(n(),o.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const t=_(o,e);return t.kind==="error"?t:(s.push(t.frame),n(),o.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:o.index+1}:{kind:"success",frames:s})}function _(e,s){const o=w(e);if(!o)return{kind:"error",message:"Frame 10 is missing",column:s.length+1};const{char:n,column:t}=o;if(!Y(n))return{kind:"error",message:`Invalid roll '${n}' in frame 10`,column:t};if(n==="X")return j(e,t);const r=k(n),a=w(e);if(!a)return{kind:"error",message:"Frame 10 is missing a second roll",column:s.length+1};const{char:i,column:c}=a;if(i==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(i==="/"){if(r>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const f=10-r,u=w(e);if(!u)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:s.length+1};const{char:l,column:p}=u;if(l==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!I(l))return{kind:"error",message:`Invalid fill ball '${l}' in frame 10`,column:p};const x=l==="X"?10:k(l);return{kind:"success",frame:{rolls:[g(n,r,t),g("/",f,c),g(l,x,p)],isStrike:!1,isSpare:!0}}}if(!R.has(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:c};const m=k(i);return r+m>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[g(n,r,t),g(i,m,c)],isStrike:!1,isSpare:!1}}}function j(e,s){const o=w(e);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:n,column:t}=o;if(!I(n)||n==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:t};let r;n==="X"?r=10:r=k(n);const a=w(e);if(!a)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:t};const{char:i,column:c}=a;if(!I(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:c};let m;if(i==="X")m=10;else if(i==="/"){if(n==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(r>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};m=10-r}else if(m=k(i),n!=="X"&&r+m>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[g("X",10,s),g(n,r,t),g(i,m,c)],isStrike:!0,isSpare:!1}}}function q(e){const s=[],o=[],n=[];for(const a of e){for(const i of a.rolls)s.push(i.value);o.push(a.isStrike),n.push(a.isSpare)}let t=0,r=0;for(let a=0;a<10;a+=1)o[a]?(t+=10+(s[r+1]??0)+(s[r+2]??0),r+=1):n[a]?(t+=10+(s[r+2]??0),r+=2):(t+=(s[r]??0)+(s[r+1]??0),r+=2);return t}function U(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const s=e.slice(0,9),o=e[9],n=[];function t(r,a){if(a===1){n.push([...r,o]);return}for(let i=0;i<a;i++)t(r,a-1),a%2===0?[r[i],r[a-1]]=[r[a-1],r[i]]:[r[0],r[a-1]]=[r[a-1],r[0]]}return t(s,s.length),n}function W(e){const s=U(e),o=s.map(d=>q(d)),n=q(e);o.sort((d,h)=>d-h);const t=o[0],r=o[o.length-1],i=o.reduce((d,h)=>d+h,0)/o.length,c=Math.floor(o.length/2),m=o.length%2===0?(o[c-1]+o[c])/2:o[c],f=new Map;for(const d of o)f.set(d,(f.get(d)||0)+1);let u=0;for(const d of f.values())d>u&&(u=d);const l=[];for(const[d,h]of f)h===u&&l.push(d);l.sort((d,h)=>d-h);const p=[];for(const[d,h]of f)p.push({score:d,count:h,frequency:h/o.length});p.sort((d,h)=>d.score-h.score);const x=o.filter(d=>d<=n).length,L=Math.round(x/o.length*100*100)/100,M=o.reduce((d,h)=>d+Math.pow(h-i,2),0)/o.length,v=Math.sqrt(M),A=v===0?0:(n-i)/v,P=o.reduce((d,h)=>d+Math.pow((h-i)/v,3),0),y=v===0?0:P/o.length;return{min:t,max:r,mean:Math.round(i*100)/100,median:m,mode:l,permutationCount:s.length,histogram:p,actualPercentile:L,zScore:Math.round(A*100)/100,skewness:Math.round(y*100)/100,standardDeviation:Math.round(v*100)/100}}const T=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],Z="Tell Me How Bad I Fucked Up",K=.001,V=document.querySelector("#app");if(!V)throw new Error("Failed to find app container");V.innerHTML=`
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
    <p>Build: 2025-10-17 07:19:22 CT</p>
  </footer>
`;const b=document.querySelector("#scores-input"),F=document.querySelector("#submit"),S=document.querySelector("#feedback");if(!b||!F||!S)throw new Error("Failed to initialise UI elements");let C=0;function z(){if(Math.random()<K){F.textContent=Z;return}F.textContent=T[C],C=(C+1)%T.length}z();setInterval(z,3e4);F.addEventListener("click",()=>{if(!b.value.trim()){X("Please provide at least one game.",1,1);return}const e=b.value.replace(/\r/g,"").split(`
`),s=[];for(let o=0;o<e.length;o+=1){const n=e[o];if(!n.trim()){X(`Game ${o+1} is empty. Each line must contain exactly ten frames.`,o+1,1);return}const t=G(n);if(t.kind==="error"){J(t,o,e);return}const r=q(t.frames),a=W(t.frames);s.push({frames:t.frames,score:r,stats:a})}re(s)});function J(e,s,o){const n=s+1,t=`Row ${n}, column ${e.column}: ${e.message}`,r=B(o,s,e.column);X(t,n,e.column,r)}function B(e,s,o){let n=0;for(let t=0;t<s;t+=1)n+=e[t].length+1;return n+(o-1)}function X(e,s,o,n){if(S.innerHTML="",S.className="error",S.textContent=e,b.focus(),typeof n=="number")b.setSelectionRange(n,n);else{const t=b.value.replace(/\r/g,"").split(`
`),r=B(t,s-1,o);b.setSelectionRange(r,r)}}function Q(e){const{histogram:s,median:o}=e.stats,n=e.score,t=600,r=300,a={top:20,right:20,bottom:40,left:50},i=t-a.left-a.right,c=r-a.top-a.bottom,m=Math.max(...s.map(y=>y.count)),f=e.stats.min,u=e.stats.max,l=Math.max(2,i/s.length),p=s.map((y,d)=>{const h=a.left+d*i/s.length,$=y.count/m*c,O=a.top+c-$,E=y.score===n;return`<rect
      x="${h}"
      y="${O}"
      width="${l}"
      height="${$}"
      fill="${E?"#fbbf24":"#60a5fa"}"
      opacity="${E?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=a.left+(o-f)/(u-f)*i,L=`
    <line x1="${x}" y1="${a.top}" x2="${x}" y2="${a.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${a.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,M=5,v=Array.from({length:M+1},(y,d)=>{const h=Math.round(m/M*d),$=a.top+c-d*c/M;return`
      <line x1="${a.left-5}" y1="${$}" x2="${a.left}" y2="${$}" stroke="#94a3b8" stroke-width="1" />
      <text x="${a.left-10}" y="${$+4}" text-anchor="end" font-size="11" fill="#94a3b8">${h.toLocaleString()}</text>
    `}).join(""),A=Math.min(10,Math.ceil((u-f)/10)),P=Array.from({length:A+1},(y,d)=>{const h=Math.round(f+(u-f)/A*d),$=a.left+d*i/A;return`
      <line x1="${$}" y1="${a.top+c}" x2="${$}" y2="${a.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${$}" y="${a.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${h}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${t} ${r}" class="histogram">
      <rect x="0" y="0" width="${t}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${p}
      ${L}
      <line x1="${a.left}" y1="${a.top}" x2="${a.left}" y2="${a.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${a.left}" y1="${a.top+c}" x2="${a.left+i}" y2="${a.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${v}
      ${P}
      <text x="${a.left+i/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${a.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${a.top+c/2})">Count</text>
    </svg>
  `}function ee(e){const{zScore:s,actualPercentile:o,skewness:n}=e.stats;e.score-e.stats.median;let t="";return Math.abs(s)<.5?t="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":s>=2?t="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":s<=-2?t="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":s>1?t="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":s<-1?t="Your score was <strong>notably below average</strong> — your frame order worked against you.":s>0?t="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":t="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",o>=95?t+=" You scored in the <strong>top 5%</strong> of all possible orderings.":o>=75?t+=" You scored in the <strong>top quartile</strong> of possible orderings.":o<=5?t+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":o<=25&&(t+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),t}function te(e){if(e.length<2)return"";const s=e.reduce((u,l)=>u+l.score,0),o=Math.round(s/e.length*100)/100,n=Math.round(e.reduce((u,l)=>u+l.stats.actualPercentile,0)/e.length*100)/100,t=Math.round(e.reduce((u,l)=>u+l.stats.zScore,0)/e.length*100)/100,r=Math.round(e.reduce((u,l)=>u+(l.score-l.stats.median),0)/e.length*100)/100,a=Math.round(e.reduce((u,l)=>u+l.stats.median,0)/e.length*100)/100,i=Math.round(e.reduce((u,l)=>u+l.stats.mean,0)/e.length*100)/100,c=Math.round(e.reduce((u,l)=>u+l.stats.standardDeviation,0)/e.length*100)/100,m=r>=0?`+${r}`:`${r}`;let f="";return Math.abs(t)<.5?f="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":t>=1.5?f="Across this series, you had <strong>notably favorable</strong> frame sequences. Lady Luck was on your side!":t<=-1.5?f="Across this series, you had <strong>notably unfavorable</strong> frame sequences. The odds worked against you.":t>.5?f="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":f="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",n>=70?f+=" You consistently scored in the upper ranges of possible outcomes.":n<=30&&(f+=" You consistently scored in the lower ranges of possible outcomes."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${f}</p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${s}</dd>

        <dt>Average score per game:</dt>
        <dd>${o}</dd>

        <dt>Average percentile:</dt>
        <dd>${n}%</dd>

        <dt>Average z-score:</dt>
        <dd>${t}</dd>

        <dt>Average expected pins +/-:</dt>
        <dd>${m}</dd>

        <dt>Average median:</dt>
        <dd>${a}</dd>

        <dt>Average mean:</dt>
        <dd>${i}</dd>

        <dt>Average std. deviation:</dt>
        <dd>${c}</dd>
      </dl>
    </article>
  `}function re(e){if(S.className="output",e.length===0){S.innerHTML="";return}const s=te(e),o=e.map((n,t)=>{const r=t+1,a=n.stats.mode.length===1?n.stats.mode[0].toString():`${n.stats.mode.join(", ")} (multimodal)`,i=n.score-n.stats.median,c=i>=0?`+${i}`:`${i}`,m=ee(n);return`
        <article class="result-card">
          <h2>Game ${r}</h2>
          <p><strong>Actual score:</strong> ${n.score}</p>

          <div class="narrative">
            <p>${m}</p>
          </div>

          <div class="histogram-container">
            ${Q(n)}
            <p class="histogram-note">
              <span style="color: #fbbf24;">■</span> Your actual score
              <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
            </p>
          </div>

          <dl class="stats">
            <dt>Permutations analyzed:</dt>
            <dd>${n.stats.permutationCount.toLocaleString()}</dd>

            <dt>Percentile:</dt>
            <dd>${n.stats.actualPercentile}%</dd>

            <dt>Z-score:</dt>
            <dd>${n.stats.zScore}</dd>

            <dt>Expected Pins +/-:</dt>
            <dd>${c}</dd>

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
            <dd>${a}</dd>
          </dl>
        </article>
      `}).join("");S.innerHTML=`<section class="results">${s}${o}</section>`}
