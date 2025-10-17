(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const _=new Set([" ","	",",",";"]),E=new Set("0123456789-".split("")),j=new Set("0123456789-X/".split(""));function N(e){return _.has(e)}function b(e){const{line:o}=e;for(;e.index<o.length&&N(o[e.index]);)e.index+=1;if(e.index>=o.length)return null;const t=e.index+1,i=o[e.index].toUpperCase();return e.index+=1,{char:i,column:t}}function w(e){if(e==="X")return 10;if(e==="-")return 0;const o=Number.parseInt(e,10);if(Number.isNaN(o))throw new Error(`Invalid roll symbol '${e}'`);if(o<0||o>9)throw new Error(`Invalid roll value '${e}'`);return o}function V(e){return e==="X"||E.has(e)}function X(e){return j.has(e)}function p(e,o,t){return{symbol:e,value:o,column:t}}function G(e){const o=[],t={line:e,index:0},i=()=>{for(;t.index<e.length&&N(e[t.index]);)t.index+=1};for(let r=0;r<9;r+=1){if(i(),t.index>=e.length)return{kind:"error",message:`Expected frame ${r+1}, but the line ended early`,column:e.length+1};const n=b(t);if(!n)return{kind:"error",message:`Expected frame ${r+1}, but found nothing`,column:e.length+1};const{char:a,column:l}=n;if(!V(a))return{kind:"error",message:`Invalid roll '${a}' in frame ${r+1}`,column:l};if(a==="X"){o.push({rolls:[p("X",10,l)],isStrike:!0,isSpare:!1});continue}const d=w(a),f=b(t);if(!f)return{kind:"error",message:`Frame ${r+1} is missing a second roll`,column:e.length+1};const{char:m,column:u}=f;if(m==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${r+1}`,column:u};if(m==="/"){if(d>=10)return{kind:"error",message:`Spare in frame ${r+1} requires the first roll to be less than 10`,column:u};const x=10-d;o.push({rolls:[p(a,d,l),p("/",x,u)],isStrike:!1,isSpare:!0});continue}if(!E.has(m))return{kind:"error",message:`Invalid roll '${m}' in frame ${r+1}`,column:u};const g=w(m);if(d+g>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${r+1}`,column:u};o.push({rolls:[p(a,d,l),p(m,g,u)],isStrike:!1,isSpare:!1})}if(i(),t.index>=e.length)return{kind:"error",message:"Frame 10 is missing",column:e.length+1};const s=U(t,e);return s.kind==="error"?s:(o.push(s.frame),i(),t.index<e.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:t.index+1}:{kind:"success",frames:o})}function U(e,o){const t=b(e);if(!t)return{kind:"error",message:"Frame 10 is missing",column:o.length+1};const{char:i,column:s}=t;if(!V(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:s};if(i==="X")return W(e,s);const r=w(i),n=b(e);if(!n)return{kind:"error",message:"Frame 10 is missing a second roll",column:o.length+1};const{char:a,column:l}=n;if(a==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:l};if(a==="/"){if(r>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:l};const f=10-r,m=b(e);if(!m)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:o.length+1};const{char:u,column:g}=m;if(u==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:g};if(!X(u))return{kind:"error",message:`Invalid fill ball '${u}' in frame 10`,column:g};const x=u==="X"?10:w(u);return{kind:"success",frame:{rolls:[p(i,r,s),p("/",f,l),p(u,x,g)],isStrike:!1,isSpare:!0}}}if(!E.has(a))return{kind:"error",message:`Invalid roll '${a}' in frame 10`,column:l};const d=w(a);return r+d>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:l}:{kind:"success",frame:{rolls:[p(i,r,s),p(a,d,l)],isStrike:!1,isSpare:!1}}}function W(e,o){const t=b(e);if(!t)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:o};const{char:i,column:s}=t;if(!X(i)||i==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:s};let r;i==="X"?r=10:r=w(i);const n=b(e);if(!n)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:s};const{char:a,column:l}=n;if(!X(a))return{kind:"error",message:`Invalid fill ball '${a}' in frame 10`,column:l};let d;if(a==="X")d=10;else if(a==="/"){if(i==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:l};if(r>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:l};d=10-r}else if(d=w(a),i!=="X"&&r+d>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:l};return{kind:"success",frame:{rolls:[p("X",10,o),p(i,r,s),p(a,d,l)],isStrike:!0,isSpare:!1}}}function R(e){const o=[],t=[],i=[];for(const n of e){for(const a of n.rolls)o.push(a.value);t.push(n.isStrike),i.push(n.isSpare)}let s=0,r=0;for(let n=0;n<10;n+=1)t[n]?(s+=10+(o[r+1]??0)+(o[r+2]??0),r+=1):i[n]?(s+=10+(o[r+2]??0),r+=2):(s+=(o[r]??0)+(o[r+1]??0),r+=2);return s}function Y(e){if(e.length!==10)throw new Error("Expected exactly 10 frames");const o=e.slice(0,9),t=e[9],i=[];function s(r,n){if(n===1){i.push([...r,t]);return}for(let a=0;a<n;a++)s(r,n-1),n%2===0?[r[a],r[n-1]]=[r[n-1],r[a]]:[r[0],r[n-1]]=[r[n-1],r[0]]}return s(o,o.length),i}function K(e){const o=Y(e),t=o.map(c=>R(c)),i=R(e);t.sort((c,h)=>c-h);const s=t[0],r=t[t.length-1],a=t.reduce((c,h)=>c+h,0)/t.length,l=Math.floor(t.length/2),d=t.length%2===0?(t[l-1]+t[l])/2:t[l],f=new Map;for(const c of t)f.set(c,(f.get(c)||0)+1);let m=0;for(const c of f.values())c>m&&(m=c);const u=[];for(const[c,h]of f)h===m&&u.push(c);u.sort((c,h)=>c-h);const g=[];for(const[c,h]of f)g.push({score:c,count:h,frequency:h/t.length});g.sort((c,h)=>c.score-h.score);const x=t.filter(c=>c<=i).length,I=Math.round(x/t.length*100*100)/100;return{min:s,max:r,mean:Math.round(a*100)/100,median:d,mode:u,permutationCount:o.length,histogram:g,actualPercentile:I}}const A=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],Z="Tell Me How Bad I Fucked Up",J=.001,B=document.querySelector("#app");if(!B)throw new Error("Failed to find app container");const Q=new Date,M=new Date(Q.toLocaleString("en-US",{timeZone:"America/Chicago"})),ee=M.getFullYear(),te=String(M.getMonth()+1).padStart(2,"0"),re=String(M.getDate()).padStart(2,"0"),ne=String(M.getHours()).padStart(2,"0"),oe=String(M.getMinutes()).padStart(2,"0"),se=String(M.getSeconds()).padStart(2,"0"),ie=`${ee}-${te}-${re} ${ne}:${oe}:${se}`;B.innerHTML=`
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
    <p>Build: ${ie} CT</p>
  </footer>
`;const S=document.querySelector("#scores-input"),C=document.querySelector("#submit"),v=document.querySelector("#feedback");if(!S||!C||!v)throw new Error("Failed to initialise UI elements");let P=0;function O(){if(Math.random()<J){C.textContent=Z;return}C.textContent=A[P],P=(P+1)%A.length}O();setInterval(O,3e4);C.addEventListener("click",()=>{if(!S.value.trim()){T("Please provide at least one game.",1,1);return}const e=S.value.replace(/\r/g,"").split(`
`),o=[];for(let t=0;t<e.length;t+=1){const i=e[t];if(!i.trim()){T(`Game ${t+1} is empty. Each line must contain exactly ten frames.`,t+1,1);return}const s=G(i);if(s.kind==="error"){ae(s,t,e);return}const r=R(s.frames),n=K(s.frames);o.push({frames:s.frames,score:r,stats:n})}ce(o)});function ae(e,o,t){const i=o+1,s=`Row ${i}, column ${e.column}: ${e.message}`,r=H(t,o,e.column);T(s,i,e.column,r)}function H(e,o,t){let i=0;for(let s=0;s<o;s+=1)i+=e[s].length+1;return i+(t-1)}function T(e,o,t,i){if(v.innerHTML="",v.className="error",v.textContent=e,S.focus(),typeof i=="number")S.setSelectionRange(i,i);else{const s=S.value.replace(/\r/g,"").split(`
`),r=H(s,o-1,t);S.setSelectionRange(r,r)}}function le(e){const{histogram:o,median:t}=e.stats,i=e.score,s=600,r=300,n={top:20,right:20,bottom:40,left:50},a=s-n.left-n.right,l=r-n.top-n.bottom,d=Math.max(...o.map(y=>y.count)),f=e.stats.min,m=e.stats.max,u=Math.max(2,a/o.length),g=o.map((y,k)=>{const F=n.left+k*a/o.length,$=y.count/d*l,z=n.top+l-$,q=y.score===i;return`<rect
      x="${F}"
      y="${z}"
      width="${u}"
      height="${$}"
      fill="${q?"#fbbf24":"#60a5fa"}"
      opacity="${q?"1":"0.7"}"
    >
      <title>Score: ${y.score}
Count: ${y.count.toLocaleString()}
Frequency: ${(y.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),x=n.left+(t-f)/(m-f)*a,I=`
    <line x1="${x}" y1="${n.top}" x2="${x}" y2="${n.top+l}"
          stroke="#ec4899" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${x}" y="${n.top-5}" text-anchor="middle" font-size="11" fill="#ec4899" font-weight="600">Median</text>
  `,c=5,h=Array.from({length:c+1},(y,k)=>{const F=Math.round(d/c*k),$=n.top+l-k*l/c;return`
      <line x1="${n.left-5}" y1="${$}" x2="${n.left}" y2="${$}" stroke="#94a3b8" stroke-width="1" />
      <text x="${n.left-10}" y="${$+4}" text-anchor="end" font-size="11" fill="#94a3b8">${F.toLocaleString()}</text>
    `}).join(""),L=Math.min(10,Math.ceil((m-f)/10)),D=Array.from({length:L+1},(y,k)=>{const F=Math.round(f+(m-f)/L*k),$=n.left+k*a/L;return`
      <line x1="${$}" y1="${n.top+l}" x2="${$}" y2="${n.top+l+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${$}" y="${n.top+l+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${F}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${r}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${r}" fill="rgba(15, 23, 42, 0.5)" />
      ${g}
      ${I}
      <line x1="${n.left}" y1="${n.top}" x2="${n.left}" y2="${n.top+l}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${n.left}" y1="${n.top+l}" x2="${n.left+a}" y2="${n.top+l}" stroke="#94a3b8" stroke-width="2" />
      ${h}
      ${D}
      <text x="${n.left+a/2}" y="${r-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${n.top+l/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${n.top+l/2})">Count</text>
    </svg>
  `}function ce(e){if(v.className="output",e.length===0){v.innerHTML="";return}const o=e.map((t,i)=>{const s=i+1,r=t.stats.mode.length===1?t.stats.mode[0].toString():`${t.stats.mode.join(", ")} (multimodal)`,n=t.score-t.stats.median,a=n>=0?`+${n}`:`${n}`;return`
        <article class="result-card">
          <h2>Game ${s}</h2>
          <p><strong>Actual score:</strong> ${t.score}</p>

          <div class="histogram-container">
            ${le(t)}
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

            <dt>Expected Pins +/-:</dt>
            <dd>${a}</dd>

            <dt>Minimum score:</dt>
            <dd>${t.stats.min}</dd>

            <dt>Maximum score:</dt>
            <dd>${t.stats.max}</dd>

            <dt>Mean score:</dt>
            <dd>${t.stats.mean}</dd>

            <dt>Median score:</dt>
            <dd>${t.stats.median}</dd>

            <dt>Mode:</dt>
            <dd>${r}</dd>
          </dl>
        </article>
      `}).join("");v.innerHTML=`<section class="results">${o}</section>`}
