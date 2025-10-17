(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(n){if(n.ep)return;n.ep=!0;const e=r(n);fetch(n.href,e)}})();const W=new Set([" ","	",",",";"]),B=new Set("0123456789-".split("")),Z=new Set("0123456789-X/".split(""));function D(t){return W.has(t)}function A(t){const{line:s}=t;for(;t.index<s.length&&D(s[t.index]);)t.index+=1;if(t.index>=s.length)return null;const r=t.index+1,i=s[t.index].toUpperCase();return t.index+=1,{char:i,column:r}}function P(t){if(t==="X")return 10;if(t==="-")return 0;const s=Number.parseInt(t,10);if(Number.isNaN(s))throw new Error(`Invalid roll symbol '${t}'`);if(s<0||s>9)throw new Error(`Invalid roll value '${t}'`);return s}function z(t){return t==="X"||B.has(t)}function R(t){return Z.has(t)}function v(t,s,r){return{symbol:t,value:s,column:r}}function K(t){const s=[],r={line:t,index:0},i=()=>{for(;r.index<t.length&&D(t[r.index]);)r.index+=1};for(let e=0;e<9;e+=1){if(i(),r.index>=t.length)return{kind:"error",message:`Expected frame ${e+1}, but the line ended early`,column:t.length+1};const o=A(r);if(!o)return{kind:"error",message:`Expected frame ${e+1}, but found nothing`,column:t.length+1};const{char:a,column:c}=o;if(!z(a))return{kind:"error",message:`Invalid roll '${a}' in frame ${e+1}`,column:c};if(a==="X"){s.push({rolls:[v("X",10,c)],isStrike:!0,isSpare:!1});continue}const f=P(a),m=A(r);if(!m)return{kind:"error",message:`Frame ${e+1} is missing a second roll`,column:t.length+1};const{char:h,column:g}=m;if(h==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${e+1}`,column:g};if(h==="/"){if(f>=10)return{kind:"error",message:`Spare in frame ${e+1} requires the first roll to be less than 10`,column:g};const x=10-f;s.push({rolls:[v(a,f,c),v("/",x,g)],isStrike:!1,isSpare:!0});continue}if(!B.has(h))return{kind:"error",message:`Invalid roll '${h}' in frame ${e+1}`,column:g};const y=P(h);if(f+y>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${e+1}`,column:g};s.push({rolls:[v(a,f,c),v(h,y,g)],isStrike:!1,isSpare:!1})}if(i(),r.index>=t.length)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const n=J(r,t);return n.kind==="error"?n:(s.push(n.frame),i(),r.index<t.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:r.index+1}:{kind:"success",frames:s})}function J(t,s){const r=A(t);if(!r)return{kind:"error",message:"Frame 10 is missing",column:s.length+1};const{char:i,column:n}=r;if(!z(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:n};if(i==="X")return Q(t,n);const e=P(i),o=A(t);if(!o)return{kind:"error",message:"Frame 10 is missing a second roll",column:s.length+1};const{char:a,column:c}=o;if(a==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(a==="/"){if(e>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const m=10-e,h=A(t);if(!h)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:s.length+1};const{char:g,column:y}=h;if(g==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:y};if(!R(g))return{kind:"error",message:`Invalid fill ball '${g}' in frame 10`,column:y};const x=g==="X"?10:P(g);return{kind:"success",frame:{rolls:[v(i,e,n),v("/",m,c),v(g,x,y)],isStrike:!1,isSpare:!0}}}if(!B.has(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:c};const f=P(a);return e+f>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[v(i,e,n),v(a,f,c)],isStrike:!1,isSpare:!1}}}function Q(t,s){const r=A(t);if(!r)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:i,column:n}=r;if(!R(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:n};let e;i==="X"?e=10:e=P(i);const o=A(t);if(!o)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:a,column:c}=o;if(!R(a))return{kind:"error",message:`Invalid fill ball '${a}' in frame 10`,column:c};let f;if(a==="X")f=10;else if(a==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(e>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};f=10-e}else if(f=P(a),i!=="X"&&e+f>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[v("X",10,s),v(i,e,n),v(a,f,c)],isStrike:!0,isSpare:!1}}}function E(t){const s=[],r=[],i=[];for(const o of t){for(const a of o.rolls)s.push(a.value);r.push(o.isStrike),i.push(o.isSpare)}let n=0,e=0;for(let o=0;o<10;o+=1)r[o]?(n+=10+(s[e+1]??0)+(s[e+2]??0),e+=1):i[o]?(n+=10+(s[e+2]??0),e+=2):(n+=(s[e]??0)+(s[e+1]??0),e+=2);return n}function ee(t){if(t.length!==10)throw new Error("Expected exactly 10 frames");const s=t.slice(0,9),r=t[9],i=[];function n(e,o){if(o===1){i.push([...e,r]);return}for(let a=0;a<o;a++)n(e,o-1),o%2===0?[e[a],e[o-1]]=[e[o-1],e[a]]:[e[0],e[o-1]]=[e[o-1],e[0]]}return n(s,s.length),i}function te(t){const s=ee(t),r=s.map(d=>E(d)),i=E(t);r.sort((d,l)=>d-l);const n=r[0],e=r[r.length-1],a=r.reduce((d,l)=>d+l,0)/r.length,c=Math.floor(r.length/2),f=r.length%2===0?(r[c-1]+r[c])/2:r[c],m=new Map;for(const d of r)m.set(d,(m.get(d)||0)+1);let h=0;for(const d of m.values())d>h&&(h=d);const g=[];for(const[d,l]of m)l===h&&g.push(d);g.sort((d,l)=>d-l);const y=[];for(const[d,l]of m)y.push({score:d,count:l,frequency:l/r.length});y.sort((d,l)=>d.score-l.score);const x=r.filter(d=>d<=i).length,S=Math.round(x/r.length*100*100)/100,w=r.reduce((d,l)=>d+Math.pow(l-a,2),0)/r.length,k=Math.sqrt(w),L=k===0?0:(i-a)/k,C=r.reduce((d,l)=>d+Math.pow((l-a)/k,3),0),$=k===0?0:C/r.length;return{min:n,max:e,mean:Math.round(a*100)/100,median:f,mode:g,permutationCount:s.length,histogram:y,actualPercentile:S,zScore:Math.round(L*100)/100,skewness:Math.round($*100)/100,standardDeviation:Math.round(k*100)/100}}const N=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],oe="Tell Me How Bad I Fucked Up",re=.001,V=document.querySelector("#app");if(!V)throw new Error("Failed to find app container");V.innerHTML=`
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
    <p>Build: 2025-10-17 07:39:00 CT</p>
  </footer>
`;const F=document.querySelector("#scores-input"),I=document.querySelector("#submit"),q=document.querySelector("#feedback");if(!F||!I||!q)throw new Error("Failed to initialise UI elements");let T=0;function H(){if(Math.random()<re){I.textContent=oe;return}I.textContent=N[T],T=(T+1)%N.length}H();setInterval(H,3e4);let j="";function U(){if(!F.value.trim()){X("Please provide at least one game.",1,1);return}const t=F.value.replace(/\r/g,"").split(`
`),s=[];for(let r=0;r<t.length;r+=1){const i=t[r];if(!i.trim()){X(`Game ${r+1} is empty. Each line must contain exactly ten frames.`,r+1,1);return}const n=K(i);if(n.kind==="error"){se(n,r,t);return}const e=E(n.frames),o=te(n.frames);s.push({frames:n.frames,score:e,stats:o})}j=F.value,ue(s)}I.addEventListener("click",U);window.addEventListener("DOMContentLoaded",()=>{const s=new URLSearchParams(window.location.search).get("scores");if(s)try{const r=atob(s);F.value=r,U()}catch(r){console.error("Failed to decode scores from URL",r)}});function se(t,s,r){const i=s+1,n=`Row ${i}, column ${t.column}: ${t.message}`,e=_(r,s,t.column);X(n,i,t.column,e)}function _(t,s,r){let i=0;for(let n=0;n<s;n+=1)i+=t[n].length+1;return i+(r-1)}function X(t,s,r,i){if(q.innerHTML="",q.className="error",q.textContent=t,F.focus(),typeof i=="number")F.setSelectionRange(i,i);else{const n=F.value.replace(/\r/g,"").split(`
`),e=_(n,s-1,r);F.setSelectionRange(e,e)}}function ne(t){const{histogram:s,median:r}=t.stats,i=t.score,n=600,e=300,o={top:20,right:20,bottom:40,left:50},a=n-o.left-o.right,c=e-o.top-o.bottom,f=Math.max(...s.map($=>$.count)),m=t.stats.min,h=t.stats.max,g=Math.max(2,a/s.length),y=s.map(($,d)=>{const l=o.left+d*a/s.length,p=$.count/f*c,b=o.top+c-p,u=$.score===i;return`<rect
      x="${l}"
      y="${b}"
      width="${g}"
      height="${p}"
      fill="${u?"#fbbf24":"#60a5fa"}"
      opacity="${u?"1":"0.7"}"
    >
      <title>Score: ${$.score}
Count: ${$.count.toLocaleString()}
Frequency: ${($.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=o.left+(r-m)/(h-m)*a,S=`
    <line x1="${x}" y1="${o.top}" x2="${x}" y2="${o.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,w=5,k=Array.from({length:w+1},($,d)=>{const l=Math.round(f/w*d),p=o.top+c-d*c/w;return`
      <line x1="${o.left-5}" y1="${p}" x2="${o.left}" y2="${p}" stroke="#94a3b8" stroke-width="1" />
      <text x="${o.left-10}" y="${p+4}" text-anchor="end" font-size="11" fill="#94a3b8">${l.toLocaleString()}</text>
    `}).join(""),L=Math.min(10,Math.ceil((h-m)/10)),C=Array.from({length:L+1},($,d)=>{const l=Math.round(m+(h-m)/L*d),p=o.left+d*a/L;return`
      <line x1="${p}" y1="${o.top+c}" x2="${p}" y2="${o.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${p}" y="${o.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${l}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${n} ${e}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${e}" fill="rgba(15, 23, 42, 0.5)" />
      ${y}
      ${S}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+c}" x2="${o.left+a}" y2="${o.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${k}
      ${C}
      <text x="${o.left+a/2}" y="${e-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${o.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${o.top+c/2})">Count</text>
    </svg>
  `}function ie(t){const{zScore:s,actualPercentile:r,skewness:i}=t.stats;t.score-t.stats.median;let n="";return Math.abs(s)<.5?n="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":s>=2?n="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":s<=-2?n="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":s>1?n="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":s<-1?n="Your score was <strong>notably below average</strong> — your frame order worked against you.":s>0?n="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":n="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",r>=95?n+=" You scored in the <strong>top 5%</strong> of all possible orderings.":r>=75?n+=" You scored in the <strong>top quartile</strong> of possible orderings.":r<=5?n+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":r<=25&&(n+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),n}function G(t){let s=new Map;for(const r of t[0].stats.histogram)s.set(r.score,r.count);for(let r=1;r<t.length;r++){const i=new Map;for(const[n,e]of s)for(const o of t[r].stats.histogram){const a=n+o.score,c=e*o.count;i.set(a,(i.get(a)||0)+c)}s=i}return s}function ae(t,s){const r=G(t),i=[];for(const[l,p]of r)i.push({score:l,count:p});i.sort((l,p)=>l.score-p.score);const n=600,e=300,o={top:20,right:20,bottom:40,left:50},a=n-o.left-o.right,c=e-o.top-o.bottom,f=Math.max(...i.map(l=>l.count)),m=i[0].score,h=i[i.length-1].score,g=Array.from(r.values()).reduce((l,p)=>l+p,0);let y=0,x=0;for(const l of i)if(y+=l.count,y>=g/2){x=l.score;break}const S=Math.max(2,a/i.length),w=i.map((l,p)=>{const b=o.left+p*a/i.length,u=l.count/f*c,M=o.top+c-u,Y=l.score===s;return`<rect
      x="${b}"
      y="${M}"
      width="${S}"
      height="${u}"
      fill="${Y?"#fbbf24":"#60a5fa"}"
      opacity="${Y?"1":"0.7"}"
    >
      <title>Series Score: ${l.score}
Combinations: ${l.count.toLocaleString()}</title>
    </rect>`}).join(""),k=o.left+(x-m)/(h-m)*a,L=`
    <line x1="${k}" y1="${o.top}" x2="${k}" y2="${o.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${k}" y="${o.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,C="",$=Math.min(10,Math.ceil((h-m)/20)),d=Array.from({length:$+1},(l,p)=>{const b=Math.round(m+(h-m)/$*p),u=o.left+p*a/$;return`
      <line x1="${u}" y1="${o.top+c}" x2="${u}" y2="${o.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${u}" y="${o.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${b}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${n} ${e}" class="histogram">
      <rect x="0" y="0" width="${n}" height="${e}" fill="rgba(15, 23, 42, 0.5)" />
      ${w}
      ${L}
      <line x1="${o.left}" y1="${o.top}" x2="${o.left}" y2="${o.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${o.left}" y1="${o.top+c}" x2="${o.left+a}" y2="${o.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${C}
      ${d}
      <text x="${o.left+a/2}" y="${e-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function ce(t){if(t.length<2)return"";const s=t.reduce((u,M)=>u+M.score,0),r=Math.round(s/t.length*100)/100,i=G(t),n=[];for(const[u,M]of i)n.push({score:u,count:M});n.sort((u,M)=>u.score-M.score);const e=Array.from(i.values()).reduce((u,M)=>u+M,0),o=n[0].score,a=n[n.length-1].score;let c=0;for(const u of n)c+=u.score*u.count;const f=c/e;let m=0,h=0;for(const u of n)if(m+=u.count,m>=e/2){h=u.score;break}const g=n.filter(u=>u.score<=s).reduce((u,M)=>u+M.count,0),y=Math.round(g/e*100*100)/100;let x=0;for(const u of n)x+=Math.pow(u.score-f,2)*u.count;const S=Math.sqrt(x/e),w=S===0?0:(s-f)/S;let k=0;for(const u of n)k+=Math.pow((u.score-f)/S,3)*u.count;const L=S===0?0:k/e;let C=0;for(const u of n)u.count>C&&(C=u.count);const $=[];for(const u of n)u.count===C&&$.push(u.score);const d=s-h,l=d>=0?`+${d}`:`${d}`,p=$.length===1?$[0].toString():`${$.join(", ")} (multimodal)`;let b="";return Math.abs(w)<.5?b="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":w>=2?b="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":w<=-2?b="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":w>=1?b="Across this series, you had <strong>notably favorable</strong> frame sequences.":w<=-1?b="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":w>0?b="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":b="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",y>=95?b+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":y>=75?b+=" You scored in the <strong>top quartile</strong> of possible combinations.":y<=5?b+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":y<=25&&(b+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${t.length} Games)</h2>

      <div class="narrative">
        <p>${b}</p>
      </div>

      <div class="histogram-container">
        ${ae(t,s)}
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
        <dd>${Math.round(w*100)/100}</dd>

        <dt>Expected Pins +/-:</dt>
        <dd>${l}</dd>

        <dt>Minimum score:</dt>
        <dd>${o}</dd>

        <dt>Maximum score:</dt>
        <dd>${a}</dd>

        <dt>Mean score:</dt>
        <dd>${Math.round(f*100)/100}</dd>

        <dt>Median score:</dt>
        <dd>${h}</dd>

        <dt>Standard deviation:</dt>
        <dd>${Math.round(S*100)/100}</dd>

        <dt>Skewness:</dt>
        <dd>${Math.round(L*100)/100}</dd>

        <dt>Mode:</dt>
        <dd>${p}</dd>
      </dl>
    </article>
  `}function le(){const t=btoa(j),s=new URL(window.location.href);return s.search=`?scores=${encodeURIComponent(t)}`,s.toString()}function de(){const t=le();navigator.clipboard.writeText(t).then(()=>{O("Link copied!")}).catch(s=>{console.error("Failed to copy link",s),O("Failed to copy link")})}function O(t){const s=document.querySelector(".toast");s&&s.remove();const r=document.createElement("div");r.className="toast",r.textContent=t,document.body.appendChild(r),setTimeout(()=>{r.classList.add("show")},10),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>{r.remove()},300)},2e3)}function ue(t){if(q.className="output",t.length===0){q.innerHTML="";return}const s=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,r=t.map((e,o)=>{const a=o+1,c=e.stats.mode.length===1?e.stats.mode[0].toString():`${e.stats.mode.join(", ")} (multimodal)`,f=e.score-e.stats.median,m=f>=0?`+${f}`:`${f}`,h=ie(e);return`
        <article class="result-card">
          <h2>Game ${a}</h2>
          <p><strong>Actual score:</strong> ${e.score}</p>

          <div class="narrative">
            <p>${h}</p>
          </div>

          <div class="histogram-container">
            ${ne(e)}
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
            <dd>${m}</dd>

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
            <dd>${c}</dd>
          </dl>
        </article>
      `}).join(""),i=ce(t);q.innerHTML=`
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
  `,q.querySelectorAll("[data-copy-link]").forEach(e=>{e.addEventListener("click",de)})}
