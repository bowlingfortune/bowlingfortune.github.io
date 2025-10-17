(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const t of n.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&o(t)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const _=new Set([" ","	",",",";"]),z=new Set("0123456789-".split("")),G=new Set("0123456789-X/".split(""));function B(e){return _.has(e)}function L(e){const{line:a}=e;for(;e.index<a.length&&B(a[e.index]);)e.index+=1;if(e.index>=a.length)return null;const s=e.index+1,o=a[e.index].toUpperCase();return e.index+=1,{char:o,column:s}}function F(e){if(e==="X")return 10;if(e==="-")return 0;const a=Number.parseInt(e,10);if(Number.isNaN(a))throw new Error(`Invalid roll symbol '${e}'`);if(a<0||a>9)throw new Error(`Invalid roll value '${e}'`);return a}function D(e){return e==="X"||z.has(e)}function T(e){return G.has(e)}function x(e,a,s){return{symbol:e,value:a,column:s}}function W(e){const a=[],s={line:e,index:0},o=()=>{for(;s.index<e.length&&B(e[s.index]);)s.index+=1};for(let n=0;n<9;n+=1){if(o(),s.index>=e.length)return{kind:"error",message:`Expected frame ${n+1}, but the line ended early`,column:e.length+1};const t=L(s);if(!t)return{kind:"error",message:`Expected frame ${n+1}, but found nothing`,column:e.length+1};const{char:i,column:c}=t;if(!D(i))return{kind:"error",message:`Invalid roll '${i}' in frame ${n+1}`,column:c};if(i==="X"){a.push({rolls:[x("X",10,c)],isStrike:!0,isSpare:!1});continue}const h=F(i),f=L(s);if(!f)return{kind:"error",message:`Frame ${n+1} is missing a second roll`,column:e.length+1};const{char:u,column:d}=f;if(u==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${n+1}`,column:d};if(u==="/"){if(h>=10)return{kind:"error",message:`Spare in frame ${n+1} requires the first roll to be less than 10`,column:d};const b=10-h;a.push({rolls:[x(i,h,c),x("/",b,d)],isStrike:!1,isSpare:!0});continue}if(!z.has(u))return{kind:"error",message:`Invalid roll '${u}' in frame ${n+1}`,column:d};const p=F(u);if(h+p>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${n+1}`,column:d};a.push({rolls:[x(i,h,c),x(u,p,d)],isStrike:!1,isSpare:!1})}if(o(),s.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const r=U(s,e);return r.kind==="error"?r:(a.push(r.frame),o(),s.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:s.index+1}:{kind:"success",frames:a})}function U(e,a){const s=L(e);if(!s)return{kind:"error",message:"Frame 10 is missing",column:a.length+1};const{char:o,column:r}=s;if(!D(o))return{kind:"error",message:`Invalid roll '${o}' in frame 10`,column:r};if(o==="X")return Z(e,r);const n=F(o),t=L(e);if(!t)return{kind:"error",message:"Frame 10 is missing a second roll",column:a.length+1};const{char:i,column:c}=t;if(i==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(i==="/"){if(n>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const f=10-n,u=L(e);if(!u)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:a.length+1};const{char:d,column:p}=u;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:p};if(!T(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:p};const b=d==="X"?10:F(d);return{kind:"success",frame:{rolls:[x(o,n,r),x("/",f,c),x(d,b,p)],isStrike:!1,isSpare:!0}}}if(!z.has(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:c};const h=F(i);return n+h>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[x(o,n,r),x(i,h,c)],isStrike:!1,isSpare:!1}}}function Z(e,a){const s=L(e);if(!s)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:a};const{char:o,column:r}=s;if(!T(o)||o==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:r};let n;o==="X"?n=10:n=F(o);const t=L(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:r};const{char:i,column:c}=t;if(!T(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:c};let h;if(i==="X")h=10;else if(i==="/"){if(o==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(n>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};h=10-n}else if(h=F(i),o!=="X"&&n+h>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[x("X",10,a),x(o,n,r),x(i,h,c)],isStrike:!0,isSpare:!1}}}function R(e){const a=[],s=[],o=[];for(const t of e){for(const i of t.rolls)a.push(i.value);s.push(t.isStrike),o.push(t.isSpare)}let r=0,n=0;for(let t=0;t<10;t+=1)s[t]?(r+=10+(a[n+1]??0)+(a[n+2]??0),n+=1):o[t]?(r+=10+(a[n+2]??0),n+=2):(r+=(a[n]??0)+(a[n+1]??0),n+=2);return r}function K(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const a=e.slice(0,9),s=e[9],o=[];function r(n,t){if(t===1){o.push([...n,s]);return}for(let i=0;i<t;i++)r(n,t-1),t%2===0?[n[i],n[t-1]]=[n[t-1],n[i]]:[n[0],n[t-1]]=[n[t-1],n[0]]}return r(a,a.length),o}function J(e){const a=K(e),s=a.map(l=>R(l)),o=R(e);s.sort((l,g)=>l-g);const r=s[0],n=s[s.length-1],i=s.reduce((l,g)=>l+g,0)/s.length,c=Math.floor(s.length/2),h=s.length%2===0?(s[c-1]+s[c])/2:s[c],f=new Map;for(const l of s)f.set(l,(f.get(l)||0)+1);let u=0;for(const l of f.values())l>u&&(u=l);const d=[];for(const[l,g]of f)g===u&&d.push(l);d.sort((l,g)=>l-g);const p=[];for(const[l,g]of f)p.push({score:l,count:g,frequency:g/s.length});p.sort((l,g)=>l.score-g.score);const b=s.filter(l=>l<=o).length,I=Math.round(b/s.length*100*100)/100,S=s.reduce((l,g)=>l+Math.pow(g-i,2),0)/s.length,w=Math.sqrt(S),M=w===0?0:(o-i)/w,A=s.reduce((l,g)=>l+Math.pow((g-i)/w,3),0),y=w===0?0:A/s.length;return{min:r,max:n,mean:Math.round(i*100)/100,median:h,mode:d,permutationCount:a.length,histogram:p,actualPercentile:I,zScore:Math.round(M*100)/100,skewness:Math.round(y*100)/100,standardDeviation:Math.round(w*100)/100}}const Y=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],Q="Tell Me How Bad I Fucked Up",ee=.001,O=document.querySelector("#app");if(!O)throw new Error("Failed to find app container");O.innerHTML=`
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
    <p>Build: 2025-10-17 07:22:55 CT</p>
  </footer>
`;const C=document.querySelector("#scores-input"),q=document.querySelector("#submit"),P=document.querySelector("#feedback");if(!C||!q||!P)throw new Error("Failed to initialise UI elements");let X=0;function V(){if(Math.random()<ee){q.textContent=Q;return}q.textContent=Y[X],X=(X+1)%Y.length}V();setInterval(V,3e4);q.addEventListener("click",()=>{if(!C.value.trim()){E("Please provide at least one game.",1,1);return}const e=C.value.replace(/\r/g,"").split(`
`),a=[];for(let s=0;s<e.length;s+=1){const o=e[s];if(!o.trim()){E(`Game ${s+1} is empty. Each line must contain exactly ten frames.`,s+1,1);return}const r=W(o);if(r.kind==="error"){te(r,s,e);return}const n=R(r.frames),t=J(r.frames);a.push({frames:r.frames,score:n,stats:t})}ie(a)});function te(e,a,s){const o=a+1,r=`Row ${o}, column ${e.column}: ${e.message}`,n=H(s,a,e.column);E(r,o,e.column,n)}function H(e,a,s){let o=0;for(let r=0;r<a;r+=1)o+=e[r].length+1;return o+(s-1)}function E(e,a,s,o){if(P.innerHTML="",P.className="error",P.textContent=e,C.focus(),typeof o=="number")C.setSelectionRange(o,o);else{const r=C.value.replace(/\r/g,"").split(`
`),n=H(r,a-1,s);C.setSelectionRange(n,n)}}function oe(e){const{histogram:a,median:s}=e.stats,o=e.score,r=600,n=300,t={top:20,right:20,bottom:40,left:50},i=r-t.left-t.right,c=n-t.top-t.bottom,h=Math.max(...a.map(y=>y.count)),f=e.stats.min,u=e.stats.max,d=Math.max(2,i/a.length),p=a.map((y,l)=>{const g=t.left+l*i/a.length,m=y.count/h*c,$=t.top+c-m,v=y.score===o;return`<rect
      x="${g}"
      y="${$}"
      width="${d}"
      height="${m}"
      fill="${v?"#fbbf24":"#60a5fa"}"
      opacity="${v?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),b=t.left+(s-f)/(u-f)*i,I=`
    <line x1="${b}" y1="${t.top}" x2="${b}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${b}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,S=5,w=Array.from({length:S+1},(y,l)=>{const g=Math.round(h/S*l),m=t.top+c-l*c/S;return`
      <line x1="${t.left-5}" y1="${m}" x2="${t.left}" y2="${m}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${m+4}" text-anchor="end" font-size="11" fill="#94a3b8">${g.toLocaleString()}</text>
    `}).join(""),M=Math.min(10,Math.ceil((u-f)/10)),A=Array.from({length:M+1},(y,l)=>{const g=Math.round(f+(u-f)/M*l),m=t.left+l*i/M;return`
      <line x1="${m}" y1="${t.top+c}" x2="${m}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${m}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${g}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${p}
      ${I}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+i}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${w}
      ${A}
      <text x="${t.left+i/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${t.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+c/2})">Count</text>
    </svg>
  `}function re(e){const{zScore:a,actualPercentile:s,skewness:o}=e.stats;e.score-e.stats.median;let r="";return Math.abs(a)<.5?r="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":a>=2?r="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":a<=-2?r="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":a>1?r="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":a<-1?r="Your score was <strong>notably below average</strong> — your frame order worked against you.":a>0?r="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":r="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",s>=95?r+=" You scored in the <strong>top 5%</strong> of all possible orderings.":s>=75?r+=" You scored in the <strong>top quartile</strong> of possible orderings.":s<=5?r+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":s<=25&&(r+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),r}function ne(e){let a=new Map;for(const s of e[0].stats.histogram)a.set(s.score,s.count);for(let s=1;s<e.length;s++){const o=new Map;for(const[r,n]of a)for(const t of e[s].stats.histogram){const i=r+t.score,c=n*t.count;o.set(i,(o.get(i)||0)+c)}a=o}return a}function se(e,a){const s=ne(e),o=[];for(const[m,$]of s)o.push({score:m,count:$});o.sort((m,$)=>m.score-$.score);const r=600,n=300,t={top:20,right:20,bottom:40,left:50},i=r-t.left-t.right,c=n-t.top-t.bottom,h=Math.max(...o.map(m=>m.count)),f=o[0].score,u=o[o.length-1].score,d=Array.from(s.values()).reduce((m,$)=>m+$,0);let p=0,b=0;for(const m of o)if(p+=m.count,p>=d/2){b=m.score;break}const I=Math.max(2,i/o.length),S=o.map((m,$)=>{const v=t.left+$*i/o.length,k=m.count/h*c,j=t.top+c-k,N=m.score===a;return`<rect
      x="${v}"
      y="${j}"
      width="${I}"
      height="${k}"
      fill="${N?"#fbbf24":"#60a5fa"}"
      opacity="${N?"1":"0.7"}"
    >
      <title>Series Score: ${m.score}
Combinations: ${m.count.toLocaleString()}</title>
    </rect>`}).join(""),w=t.left+(b-f)/(u-f)*i,M=`
    <line x1="${w}" y1="${t.top}" x2="${w}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${w}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,A=5,y=Array.from({length:A+1},(m,$)=>{const v=Math.round(h/A*$),k=t.top+c-$*c/A;return`
      <line x1="${t.left-5}" y1="${k}" x2="${t.left}" y2="${k}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${k+4}" text-anchor="end" font-size="11" fill="#94a3b8">${v.toLocaleString()}</text>
    `}).join(""),l=Math.min(10,Math.ceil((u-f)/20)),g=Array.from({length:l+1},(m,$)=>{const v=Math.round(f+(u-f)/l*$),k=t.left+$*i/l;return`
      <line x1="${k}" y1="${t.top+c}" x2="${k}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${k}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${v}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${r} ${n}" class="histogram">
      <rect x="0" y="0" width="${r}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${S}
      ${M}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+i}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${y}
      ${g}
      <text x="${t.left+i/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
      <text x="15" y="${t.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+c/2})">Combinations</text>
    </svg>
  `}function ae(e){if(e.length<2)return"";const a=e.reduce((u,d)=>u+d.score,0),s=Math.round(a/e.length*100)/100,o=Math.round(e.reduce((u,d)=>u+d.stats.actualPercentile,0)/e.length*100)/100,r=Math.round(e.reduce((u,d)=>u+d.stats.zScore,0)/e.length*100)/100,n=Math.round(e.reduce((u,d)=>u+(d.score-d.stats.median),0)/e.length*100)/100,t=Math.round(e.reduce((u,d)=>u+d.stats.median,0)/e.length*100)/100,i=Math.round(e.reduce((u,d)=>u+d.stats.mean,0)/e.length*100)/100,c=Math.round(e.reduce((u,d)=>u+d.stats.standardDeviation,0)/e.length*100)/100,h=n>=0?`+${n}`:`${n}`;let f="";return Math.abs(r)<.5?f="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":r>=1.5?f="Across this series, you had <strong>notably favorable</strong> frame sequences. Lady Luck was on your side!":r<=-1.5?f="Across this series, you had <strong>notably unfavorable</strong> frame sequences. The odds worked against you.":r>.5?f="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":f="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",o>=70?f+=" You consistently scored in the upper ranges of possible outcomes.":o<=30&&(f+=" You consistently scored in the lower ranges of possible outcomes."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${f}</p>
      </div>

      <div class="histogram-container">
        ${se(e,a)}
        <p class="histogram-note">
          <span style="color: #fbbf24;">■</span> Your actual series score
          <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other combinations
          <span style="color: #ec4899; margin-left: 1rem;">- -</span> Median
        </p>
      </div>

      <dl class="stats">
        <dt>Total score:</dt>
        <dd>${a}</dd>

        <dt>Average score per game:</dt>
        <dd>${s}</dd>

        <dt>Average percentile:</dt>
        <dd>${o}%</dd>

        <dt>Average z-score:</dt>
        <dd>${r}</dd>

        <dt>Average expected pins +/-:</dt>
        <dd>${h}</dd>

        <dt>Average median:</dt>
        <dd>${t}</dd>

        <dt>Average mean:</dt>
        <dd>${i}</dd>

        <dt>Average std. deviation:</dt>
        <dd>${c}</dd>
      </dl>
    </article>
  `}function ie(e){if(P.className="output",e.length===0){P.innerHTML="";return}const a=e.map((o,r)=>{const n=r+1,t=o.stats.mode.length===1?o.stats.mode[0].toString():`${o.stats.mode.join(", ")} (multimodal)`,i=o.score-o.stats.median,c=i>=0?`+${i}`:`${i}`,h=re(o);return`
        <article class="result-card">
          <h2>Game ${n}</h2>
          <p><strong>Actual score:</strong> ${o.score}</p>

          <div class="narrative">
            <p>${h}</p>
          </div>

          <div class="histogram-container">
            ${oe(o)}
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
            <dd>${c}</dd>

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
            <dd>${t}</dd>
          </dl>
        </article>
      `}).join(""),s=ae(e);P.innerHTML=`<section class="results">${a}${s}</section>`}
