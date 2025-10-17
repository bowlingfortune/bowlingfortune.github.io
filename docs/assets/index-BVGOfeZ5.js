(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const t of o.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const Q=new Set([" ","	",",",";"]),Y=new Set("0123456789-".split("")),ee=new Set("0123456789-X/".split(""));function V(e){return Q.has(e)}function A(e){const{line:n}=e;for(;e.index<n.length&&V(n[e.index]);)e.index+=1;if(e.index>=n.length)return null;const r=e.index+1,i=n[e.index].toUpperCase();return e.index+=1,{char:i,column:r}}function F(e){if(e==="X")return 10;if(e==="-")return 0;const n=Number.parseInt(e,10);if(Number.isNaN(n))throw new Error(`Invalid roll symbol '${e}'`);if(n<0||n>9)throw new Error(`Invalid roll value '${e}'`);return n}function j(e){return e==="X"||Y.has(e)}function P(e){return ee.has(e)}function S(e,n,r){return{symbol:e,value:n,column:r}}function te(e){const n=[],r={line:e,index:0},i=()=>{for(;r.index<e.length&&V(e[r.index]);)r.index+=1};for(let o=0;o<9;o+=1){if(i(),r.index>=e.length)return{kind:"error",message:`Expected frame ${o+1}, but the line ended early`,column:e.length+1};const t=A(r);if(!t)return{kind:"error",message:`Expected frame ${o+1}, but found nothing`,column:e.length+1};const{char:a,column:c}=t;if(!j(a))return{kind:"error",message:`Invalid roll '${a}' in frame ${o+1}`,column:c};if(a==="X"){n.push({rolls:[S("X",10,c)],isStrike:!0,isSpare:!1});continue}const f=F(a),m=A(r);if(!m)return{kind:"error",message:`Frame ${o+1} is missing a second roll`,column:e.length+1};const{char:h,column:p}=m;if(h==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${o+1}`,column:p};if(h==="/"){if(f>=10)return{kind:"error",message:`Spare in frame ${o+1} requires the first roll to be less than 10`,column:p};const x=10-f;n.push({rolls:[S(a,f,c),S("/",x,p)],isStrike:!1,isSpare:!0});continue}if(!Y.has(h))return{kind:"error",message:`Invalid roll '${h}' in frame ${o+1}`,column:p};const y=F(h);if(f+y>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${o+1}`,column:p};n.push({rolls:[S(a,f,c),S(h,y,p)],isStrike:!1,isSpare:!1})}if(i(),r.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=oe(r,e);return s.kind==="error"?s:(n.push(s.frame),i(),r.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:r.index+1}:{kind:"success",frames:n})}function oe(e,n){const r=A(e);if(!r)return{kind:"error",message:"Frame 10 is missing",column:n.length+1};const{char:i,column:s}=r;if(!j(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:s};if(i==="X")return re(e,s);const o=F(i),t=A(e);if(!t)return{kind:"error",message:"Frame 10 is missing a second roll",column:n.length+1};const{char:a,column:c}=t;if(a==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:c};if(a==="/"){if(o>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:c};const m=10-o,h=A(e);if(!h)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:n.length+1};const{char:p,column:y}=h;if(p==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:y};if(!P(p))return{kind:"error",message:`Invalid fill ball '${p}' in frame 10`,column:y};const x=p==="X"?10:F(p);return{kind:"success",frame:{rolls:[S(i,o,s),S("/",m,c),S(p,x,y)],isStrike:!1,isSpare:!0}}}if(!Y.has(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:c};const f=F(a);return o+f>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:c}:{kind:"success",frame:{rolls:[S(i,o,s),S(a,f,c)],isStrike:!1,isSpare:!1}}}function re(e,n){const r=A(e);if(!r)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:i,column:s}=r;if(!P(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let o;i==="X"?o=10:o=F(i);const t=A(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:a,column:c}=t;if(!P(a))return{kind:"error",message:`Invalid fill ball '${a}' in frame 10`,column:c};let f;if(a==="X")f=10;else if(a==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:c};if(o>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:c};f=10-o}else if(f=F(a),i!=="X"&&o+f>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:c};return{kind:"success",frame:{rolls:[S("X",10,n),S(i,o,s),S(a,f,c)],isStrike:!0,isSpare:!1}}}function R(e){const n=[],r=[],i=[];for(const t of e){for(const a of t.rolls)n.push(a.value);r.push(t.isStrike),i.push(t.isSpare)}let s=0,o=0;for(let t=0;t<10;t+=1)r[t]?(s+=10+(n[o+1]??0)+(n[o+2]??0),o+=1):i[t]?(s+=10+(n[o+2]??0),o+=2):(s+=(n[o]??0)+(n[o+1]??0),o+=2);return s}function ne(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const n=e.slice(0,9),r=e[9],i=[];function s(o,t){if(t===1){i.push([...o,r]);return}for(let a=0;a<t;a++)s(o,t-1),t%2===0?[o[a],o[t-1]]=[o[t-1],o[a]]:[o[0],o[t-1]]=[o[t-1],o[0]]}return s(n,n.length),i}function se(e){const n=ne(e),r=n.map(d=>R(d)),i=R(e);r.sort((d,l)=>d-l);const s=r[0],o=r[r.length-1],a=r.reduce((d,l)=>d+l,0)/r.length,c=Math.floor(r.length/2),f=r.length%2===0?(r[c-1]+r[c])/2:r[c],m=new Map;for(const d of r)m.set(d,(m.get(d)||0)+1);let h=0;for(const d of m.values())d>h&&(h=d);const p=[];for(const[d,l]of m)l===h&&p.push(d);p.sort((d,l)=>d-l);const y=[];for(const[d,l]of m)y.push({score:d,count:l,frequency:l/r.length});y.sort((d,l)=>d.score-l.score);const x=r.filter(d=>d<=i).length,M=Math.round(x/r.length*100*100)/100,k=r.reduce((d,l)=>d+Math.pow(l-a,2),0)/r.length,v=Math.sqrt(k),C=v===0?0:(i-a)/v,q=r.reduce((d,l)=>d+Math.pow((l-a)/v,3),0),$=v===0?0:q/r.length;return{min:s,max:o,mean:Math.round(a*100)/100,median:f,mode:p,permutationCount:n.length,histogram:y,actualPercentile:M,zScore:Math.round(C*100)/100,skewness:Math.round($*100)/100,standardDeviation:Math.round(v*100)/100}}const H=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?","Calculate my shame","How lucky was I, really?","Did I deserve this score?","Explain my misery","Tell me I'm special","Judge my frame order","Was that skill or luck?"],ie="Tell Me How Bad I Fucked Up",ae=.001,U=document.querySelector("#app");if(!U)throw new Error("Failed to find app container");U.innerHTML=`
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
    <p>Build: 2025-10-17 08:01:11 CT</p>
  </footer>
`;const w=document.querySelector("#scores-input"),I=document.querySelector("#submit"),_=document.querySelector("#clear-btn"),G=document.querySelector("#example-btn"),L=document.querySelector("#feedback");if(!w||!I||!_||!G||!L)throw new Error("Failed to initialise UI elements");const O=["9/ X 81 7/ X X 9- 90 X XX6","X X X X X X X X X XXX","X 9/ 54 X 8/ 9- X 81 9/ X8/",`9/ X 81 7/ X X 9- 90 X XX6
X X X X X X X X X XXX
7/ 6- X 81 9/ X 7- X X X90`];let T=0;_.addEventListener("click",()=>{w.value="",L.innerHTML="",w.focus()});G.addEventListener("click",()=>{w.value=O[T],T=(T+1)%O.length,w.focus()});let E=0;function W(){if(Math.random()<ae){I.textContent=ie;return}I.textContent=H[E],E=(E+1)%H.length}W();setInterval(W,3e4);let K="";function D(){if(!w.value.trim()){B("Please provide at least one game.",1,1);return}const e=w.value.replace(/\r/g,"").split(`
`),n=[];for(let r=0;r<e.length;r+=1){const i=e[r];if(!i.trim()){B(`Game ${r+1} is empty. Each line must contain exactly ten frames.`,r+1,1);return}const s=te(i);if(s.kind==="error"){ce(s,r,e);return}const o=R(s.frames),t=se(s.frames);n.push({frames:s.frames,score:o,stats:t})}K=w.value,ge(n)}I.addEventListener("click",D);w.addEventListener("keydown",e=>{e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&(e.preventDefault(),D())});document.addEventListener("keydown",e=>{e.key==="Escape"&&L.innerHTML&&(L.innerHTML="",w.focus())});window.addEventListener("DOMContentLoaded",()=>{const n=new URLSearchParams(window.location.search).get("scores");if(n)try{const r=atob(n);w.value=r,D()}catch(r){console.error("Failed to decode scores from URL",r)}});function ce(e,n,r){const i=n+1,s=`Row ${i}, column ${e.column}: ${e.message}`,o=Z(r,n,e.column);B(s,i,e.column,o)}function Z(e,n,r){let i=0;for(let s=0;s<n;s+=1)i+=e[s].length+1;return i+(r-1)}function B(e,n,r,i){if(L.innerHTML="",L.className="error",L.textContent=e,w.focus(),typeof i=="number")w.setSelectionRange(i,i);else{const s=w.value.replace(/\r/g,"").split(`
`),o=Z(s,n-1,r);w.setSelectionRange(o,o)}}function le(e){const{histogram:n,median:r}=e.stats,i=e.score,s=600,o=300,t={top:20,right:20,bottom:40,left:50},a=s-t.left-t.right,c=o-t.top-t.bottom,f=Math.max(...n.map($=>$.count)),m=e.stats.min,h=e.stats.max,p=Math.max(2,a/n.length),y=n.map(($,d)=>{const l=t.left+d*a/n.length,g=$.count/f*c,b=t.top+c-g,u=$.score===i;return`<rect
      x="${l}"
      y="${b}"
      width="${p}"
      height="${g}"
      fill="${u?"#fbbf24":"#60a5fa"}"
      opacity="${u?"1":"0.7"}"
    >
      <title>Score: ${$.score}
Count: ${$.count.toLocaleString()}
Frequency: ${($.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=t.left+(r-m)/(h-m)*a,M=`
    <line x1="${x}" y1="${t.top}" x2="${x}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,k=5,v=Array.from({length:k+1},($,d)=>{const l=Math.round(f/k*d),g=t.top+c-d*c/k;return`
      <line x1="${t.left-5}" y1="${g}" x2="${t.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${t.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${l.toLocaleString()}</text>
    `}).join(""),C=Math.min(10,Math.ceil((h-m)/10)),q=Array.from({length:C+1},($,d)=>{const l=Math.round(m+(h-m)/C*d),g=t.left+d*a/C;return`
      <line x1="${g}" y1="${t.top+c}" x2="${g}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${g}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${l}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${y}
      ${M}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+a}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${v}
      ${q}
      <text x="${t.left+a/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${t.top+c/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${t.top+c/2})">Count</text>
    </svg>
  `}function de(e,n,r){return e>=95?"🏆":r===n?"🎯":e<=5?"💀":e>=75?"🍀":e<=25?"😅":"📊"}function ue(e){const{zScore:n,actualPercentile:r,skewness:i,median:s}=e.stats;e.score-e.stats.median;let t=`${de(r,s,e.score)} `;return Math.abs(n)<.5?t+="Your score was <strong>typical</strong> — right in line with what frame order randomness would produce.":n>=2?t+="Your score was <strong>exceptionally high</strong> — you got very lucky with your frame order!":n<=-2?t+="Your score was <strong>exceptionally low</strong> — you got very unlucky with your frame order.":n>1?t+="Your score was <strong>notably above average</strong> — you benefited from a favorable frame sequence.":n<-1?t+="Your score was <strong>notably below average</strong> — your frame order worked against you.":n>0?t+="Your score was <strong>slightly above average</strong> — a bit luckier than typical.":t+="Your score was <strong>slightly below average</strong> — a bit unluckier than typical.",r>=95?t+=" You scored in the <strong>top 5%</strong> of all possible orderings.":r>=75?t+=" You scored in the <strong>top quartile</strong> of possible orderings.":r<=5?t+=" You scored in the <strong>bottom 5%</strong> of all possible orderings.":r<=25&&(t+=" You scored in the <strong>bottom quartile</strong> of possible orderings."),t}function J(e){let n=new Map;for(const r of e[0].stats.histogram)n.set(r.score,r.count);for(let r=1;r<e.length;r++){const i=new Map;for(const[s,o]of n)for(const t of e[r].stats.histogram){const a=s+t.score,c=o*t.count;i.set(a,(i.get(a)||0)+c)}n=i}return n}function fe(e,n){const r=J(e),i=[];for(const[l,g]of r)i.push({score:l,count:g});i.sort((l,g)=>l.score-g.score);const s=600,o=300,t={top:20,right:20,bottom:40,left:50},a=s-t.left-t.right,c=o-t.top-t.bottom,f=Math.max(...i.map(l=>l.count)),m=i[0].score,h=i[i.length-1].score,p=Array.from(r.values()).reduce((l,g)=>l+g,0);let y=0,x=0;for(const l of i)if(y+=l.count,y>=p/2){x=l.score;break}const M=Math.max(2,a/i.length),k=i.map((l,g)=>{const b=t.left+g*a/i.length,u=l.count/f*c,X=t.top+c-u,N=l.score===n;return`<rect
      x="${b}"
      y="${X}"
      width="${M}"
      height="${u}"
      fill="${N?"#fbbf24":"#60a5fa"}"
      opacity="${N?"1":"0.7"}"
    >
      <title>Series Score: ${l.score}
Combinations: ${l.count.toLocaleString()}</title>
    </rect>`}).join(""),v=t.left+(x-m)/(h-m)*a,C=`
    <line x1="${v}" y1="${t.top}" x2="${v}" y2="${t.top+c}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${v}" y="${t.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,q="",$=Math.min(10,Math.ceil((h-m)/20)),d=Array.from({length:$+1},(l,g)=>{const b=Math.round(m+(h-m)/$*g),u=t.left+g*a/$;return`
      <line x1="${u}" y1="${t.top+c}" x2="${u}" y2="${t.top+c+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${u}" y="${t.top+c+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${b}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${o}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${o}" fill="rgba(15, 23, 42, 0.5)" />
      ${k}
      ${C}
      <line x1="${t.left}" y1="${t.top}" x2="${t.left}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${t.left}" y1="${t.top+c}" x2="${t.left+a}" y2="${t.top+c}" stroke="#94a3b8" stroke-width="2" />
      ${q}
      ${d}
      <text x="${t.left+a/2}" y="${o-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Series Score</text>
    </svg>
  `}function me(e){if(e.length<2)return"";const n=e.reduce((u,X)=>u+X.score,0),r=Math.round(n/e.length*100)/100,i=J(e),s=[];for(const[u,X]of i)s.push({score:u,count:X});s.sort((u,X)=>u.score-X.score);const o=Array.from(i.values()).reduce((u,X)=>u+X,0),t=s[0].score,a=s[s.length-1].score;let c=0;for(const u of s)c+=u.score*u.count;const f=c/o;let m=0,h=0;for(const u of s)if(m+=u.count,m>=o/2){h=u.score;break}const p=s.filter(u=>u.score<=n).reduce((u,X)=>u+X.count,0),y=Math.round(p/o*100*100)/100;let x=0;for(const u of s)x+=Math.pow(u.score-f,2)*u.count;const M=Math.sqrt(x/o),k=M===0?0:(n-f)/M;let v=0;for(const u of s)v+=Math.pow((u.score-f)/M,3)*u.count;const C=M===0?0:v/o;let q=0;for(const u of s)u.count>q&&(q=u.count);const $=[];for(const u of s)u.count===q&&$.push(u.score);const d=n-h,l=d>=0?`+${d}`:`${d}`,g=$.length===1?$[0].toString():`${$.join(", ")} (multimodal)`;let b="";return Math.abs(k)<.5?b="Across this series, your frame orders were <strong>typical</strong> — no significant luck or unluck.":k>=2?b="Across this series, you had <strong>exceptionally favorable</strong> frame sequences. Lady Luck was on your side!":k<=-2?b="Across this series, you had <strong>exceptionally unfavorable</strong> frame sequences. The odds worked against you.":k>=1?b="Across this series, you had <strong>notably favorable</strong> frame sequences.":k<=-1?b="Across this series, you had <strong>notably unfavorable</strong> frame sequences.":k>0?b="Across this series, your frame orders were <strong>slightly favorable</strong> overall.":b="Across this series, your frame orders were <strong>slightly unfavorable</strong> overall.",y>=95?b+=" You scored in the <strong>top 5%</strong> of all possible series combinations.":y>=75?b+=" You scored in the <strong>top quartile</strong> of possible combinations.":y<=5?b+=" You scored in the <strong>bottom 5%</strong> of all possible combinations.":y<=25&&(b+=" You scored in the <strong>bottom quartile</strong> of possible combinations."),`
    <article class="result-card series-summary">
      <h2>Series Summary (${e.length} Games)</h2>

      <div class="narrative">
        <p>${b}</p>
      </div>

      <div class="histogram-container">
        ${fe(e,n)}
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
        <dd>${y}%</dd>

        <dt>Z-score:</dt>
        <dd>${Math.round(k*100)/100}</dd>

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
        <dd>${g}</dd>
      </dl>
    </article>
  `}function he(){const e=btoa(K),n=new URL(window.location.href);return n.search=`?scores=${encodeURIComponent(e)}`,n.toString()}function pe(){const e=he();navigator.clipboard.writeText(e).then(()=>{z("Link copied!")}).catch(n=>{console.error("Failed to copy link",n),z("Failed to copy link")})}function z(e){const n=document.querySelector(".toast");n&&n.remove();const r=document.createElement("div");r.className="toast",r.textContent=e,document.body.appendChild(r),setTimeout(()=>{r.classList.add("show")},10),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>{r.remove()},300)},2e3)}function ge(e){if(L.className="output",e.length===0){L.innerHTML="";return}const n=`
    <button type="button" class="copy-link-btn" data-copy-link>
      Copy link 🔗
    </button>
  `,r=e.map((o,t)=>{const a=t+1,c=o.stats.mode.length===1?o.stats.mode[0].toString():`${o.stats.mode.join(", ")} (multimodal)`,f=o.score-o.stats.median,m=f>=0?`+${f}`:`${f}`,h=ue(o);return`
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
        ${n}
      </div>
      ${r}
      ${i}
      <div class="results-footer">
        ${n}
      </div>
    </section>
  `,L.querySelectorAll("[data-copy-link]").forEach(o=>{o.addEventListener("click",pe)})}
