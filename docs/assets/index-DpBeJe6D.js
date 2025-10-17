(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const a of e.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(n){if(n.ep)return;n.ep=!0;const e=r(n);fetch(n.href,e)}})();const H=new Set([" ","	",",",";"]),X=new Set("0123456789-".split("")),D=new Set("0123456789-X/".split(""));function P(t){return H.has(t)}function S(t){const{line:o}=t;for(;t.index<o.length&&P(o[t.index]);)t.index+=1;if(t.index>=o.length)return null;const r=t.index+1,s=o[t.index].toUpperCase();return t.index+=1,{char:s,column:r}}function k(t){if(t==="X")return 10;if(t==="-")return 0;const o=Number.parseInt(t,10);if(Number.isNaN(o))throw new Error(`Invalid roll symbol '${t}'`);if(o<0||o>9)throw new Error(`Invalid roll value '${t}'`);return o}function q(t){return t==="X"||X.has(t)}function I(t){return D.has(t)}function h(t,o,r){return{symbol:t,value:o,column:r}}function _(t){const o=[],r={line:t,index:0},s=()=>{for(;r.index<t.length&&P(t[r.index]);)r.index+=1};for(let e=0;e<9;e+=1){if(s(),r.index>=t.length)return{kind:"error",message:`Expected frame ${e+1}, but the line ended early`,column:t.length+1};const a=S(r);if(!a)return{kind:"error",message:`Expected frame ${e+1}, but found nothing`,column:t.length+1};const{char:i,column:u}=a;if(!q(i))return{kind:"error",message:`Invalid roll '${i}' in frame ${e+1}`,column:u};if(i==="X"){o.push({rolls:[h("X",10,u)],isStrike:!0,isSpare:!1});continue}const c=k(i),p=S(r);if(!p)return{kind:"error",message:`Frame ${e+1} is missing a second roll`,column:t.length+1};const{char:f,column:d}=p;if(f==="X")return{kind:"error",message:`Strike symbol not allowed in second roll of frame ${e+1}`,column:d};if(f==="/"){if(c>=10)return{kind:"error",message:`Spare in frame ${e+1} requires the first roll to be less than 10`,column:d};const m=10-c;o.push({rolls:[h(i,c,u),h("/",m,d)],isStrike:!1,isSpare:!0});continue}if(!X.has(f))return{kind:"error",message:`Invalid roll '${f}' in frame ${e+1}`,column:d};const l=k(f);if(c+l>10)return{kind:"error",message:`Pins knocked down exceed 10 in frame ${e+1}`,column:d};o.push({rolls:[h(i,c,u),h(f,l,d)],isStrike:!1,isSpare:!1})}if(s(),r.index>=t.length)return{kind:"error",message:"Frame 10 is missing",column:t.length+1};const n=j(r,t);return n.kind==="error"?n:(o.push(n.frame),s(),r.index<t.length?{kind:"error",message:"Too many rolls provided. Expected exactly 10 frames.",column:r.index+1}:{kind:"success",frames:o})}function j(t,o){const r=S(t);if(!r)return{kind:"error",message:"Frame 10 is missing",column:o.length+1};const{char:s,column:n}=r;if(!q(s))return{kind:"error",message:`Invalid roll '${s}' in frame 10`,column:n};if(s==="X")return z(t,n);const e=k(s),a=S(t);if(!a)return{kind:"error",message:"Frame 10 is missing a second roll",column:o.length+1};const{char:i,column:u}=a;if(i==="X")return{kind:"error",message:"Strike symbol not allowed as the second roll unless the first was a strike",column:u};if(i==="/"){if(e>=10)return{kind:"error",message:"Spare in frame 10 requires the first roll to be less than 10",column:u};const p=10-e,f=S(t);if(!f)return{kind:"error",message:"A bonus ball is required after a spare in frame 10",column:o.length+1};const{char:d,column:l}=f;if(d==="/")return{kind:"error",message:"Spare symbol cannot be used for the fill ball after a spare",column:l};if(!I(d))return{kind:"error",message:`Invalid fill ball '${d}' in frame 10`,column:l};const m=d==="X"?10:k(d);return{kind:"success",frame:{rolls:[h(s,e,n),h("/",p,u),h(d,m,l)],isStrike:!1,isSpare:!0}}}if(!X.has(i))return{kind:"error",message:`Invalid roll '${i}' in frame 10`,column:u};const c=k(i);return e+c>10?{kind:"error",message:"Pins knocked down exceed 10 in frame 10",column:u}:{kind:"success",frame:{rolls:[h(s,e,n),h(i,c,u)],isStrike:!1,isSpare:!1}}}function z(t,o){const r=S(t);if(!r)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:o};const{char:s,column:n}=r;if(!I(s)||s==="/")return{kind:"error",message:"Invalid second roll after a strike in frame 10",column:n};let e;s==="X"?e=10:e=k(s);const a=S(t);if(!a)return{kind:"error",message:"A strike in frame 10 requires two additional rolls",column:n};const{char:i,column:u}=a;if(!I(i))return{kind:"error",message:`Invalid fill ball '${i}' in frame 10`,column:u};let c;if(i==="X")c=10;else if(i==="/"){if(s==="X")return{kind:"error",message:"Spare symbol cannot follow a strike in the second roll of frame 10",column:u};if(e>=10)return{kind:"error",message:"Spare symbol invalid because there are no pins remaining",column:u};c=10-e}else if(c=k(i),s!=="X"&&e+c>10)return{kind:"error",message:"Pins knocked down exceed the remaining pins in frame 10",column:u};return{kind:"success",frame:{rolls:[h("X",10,o),h(s,e,n),h(i,c,u)],isStrike:!0,isSpare:!1}}}function E(t){const o=[],r=[],s=[];for(const a of t){for(const i of a.rolls)o.push(i.value);r.push(a.isStrike),s.push(a.isSpare)}let n=0,e=0;for(let a=0;a<10;a+=1)r[a]?(n+=10+(o[e+1]??0)+(o[e+2]??0),e+=1):s[a]?(n+=10+(o[e+2]??0),e+=2):(n+=(o[e]??0)+(o[e+1]??0),e+=2);return n}function G(t){if(t.length!==10)throw new Error("Expected exactly 10 frames");const o=t.slice(0,9),r=t[9],s=[];function n(e,a){if(a===1){s.push([...e,r]);return}for(let i=0;i<a;i++)n(e,a-1),a%2===0?[e[i],e[a-1]]=[e[a-1],e[i]]:[e[0],e[a-1]]=[e[a-1],e[0]]}return n(o,o.length),s}function U(t){const o=G(t),r=o.map(l=>E(l));r.sort((l,m)=>l-m);const s=r[0],n=r[r.length-1],a=r.reduce((l,m)=>l+m,0)/r.length,i=Math.floor(r.length/2),u=r.length%2===0?(r[i-1]+r[i])/2:r[i],c=new Map;for(const l of r)c.set(l,(c.get(l)||0)+1);let p=0;for(const l of c.values())l>p&&(p=l);const f=[];for(const[l,m]of c)m===p&&f.push(l);f.sort((l,m)=>l-m);const d=[];for(const[l,m]of c)d.push({score:l,count:m,frequency:m/r.length});return d.sort((l,m)=>l.score-m.score),{min:s,max:n,mean:Math.round(a*100)/100,median:u,mode:f,permutationCount:o.length,histogram:d}}const T=["Tell My Bowling Fortune","Glimpse Into My Future.. er, Past","Peer Into the Multiverse","Clutch Or Not?","My mom said I'm pretty good.","What oil pattern is this? Badger?"],W="Tell Me How Bad I Fucked Up",Y=.001,A=document.querySelector("#app");if(!A)throw new Error("Failed to find app container");const K=new Date,w=new Date(K.toLocaleString("en-US",{timeZone:"America/Chicago"})),Z=w.getFullYear(),J=String(w.getMonth()+1).padStart(2,"0"),Q=String(w.getDate()).padStart(2,"0"),ee=String(w.getHours()).padStart(2,"0"),te=String(w.getMinutes()).padStart(2,"0"),re=String(w.getSeconds()).padStart(2,"0"),ne=`${Z}-${J}-${Q} ${ee}:${te}:${re}`;A.innerHTML=`
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
    <p>Build: ${ne} CT</p>
  </footer>
`;const x=document.querySelector("#scores-input"),F=document.querySelector("#submit"),b=document.querySelector("#feedback");if(!x||!F||!b)throw new Error("Failed to initialise UI elements");let C=0;function N(){if(Math.random()<Y){F.textContent=W;return}F.textContent=T[C],C=(C+1)%T.length}N();setInterval(N,3e4);F.addEventListener("click",()=>{if(!x.value.trim()){L("Please provide at least one game.",1,1);return}const t=x.value.replace(/\r/g,"").split(`
`),o=[];for(let r=0;r<t.length;r+=1){const s=t[r];if(!s.trim()){L(`Game ${r+1} is empty. Each line must contain exactly ten frames.`,r+1,1);return}const n=_(s);if(n.kind==="error"){oe(n,r,t);return}const e=E(n.frames),a=U(n.frames);o.push({frames:n.frames,score:e,stats:a})}ie(o)});function oe(t,o,r){const s=o+1,n=`Row ${s}, column ${t.column}: ${t.message}`,e=V(r,o,t.column);L(n,s,t.column,e)}function V(t,o,r){let s=0;for(let n=0;n<o;n+=1)s+=t[n].length+1;return s+(r-1)}function L(t,o,r,s){if(b.innerHTML="",b.className="error",b.textContent=t,x.focus(),typeof s=="number")x.setSelectionRange(s,s);else{const n=x.value.replace(/\r/g,"").split(`
`),e=V(n,o-1,r);x.setSelectionRange(e,e)}}function se(t){const{histogram:o}=t.stats,r=t.score,s=600,n=300,e={top:20,right:20,bottom:40,left:50},a=s-e.left-e.right,i=n-e.top-e.bottom,u=Math.max(...o.map($=>$.count)),c=t.stats.min,p=t.stats.max,f=Math.max(2,a/o.length),d=o.map(($,y)=>{const v=e.left+y*a/o.length,g=$.count/u*i,O=e.top+i-g,R=$.score===r;return`<rect
      x="${v}"
      y="${O}"
      width="${f}"
      height="${g}"
      fill="${R?"#fbbf24":"#60a5fa"}"
      opacity="${R?"1":"0.7"}"
    >
      <title>Score: ${$.score}
Count: ${$.count.toLocaleString()}
Frequency: ${($.frequency*100).toFixed(2)}%</title>
    </rect>`}).join(""),l=5,m=Array.from({length:l+1},($,y)=>{const v=Math.round(u/l*y),g=e.top+i-y*i/l;return`
      <line x1="${e.left-5}" y1="${g}" x2="${e.left}" y2="${g}" stroke="#94a3b8" stroke-width="1" />
      <text x="${e.left-10}" y="${g+4}" text-anchor="end" font-size="11" fill="#94a3b8">${v.toLocaleString()}</text>
    `}).join(""),M=Math.min(10,Math.ceil((p-c)/10)),B=Array.from({length:M+1},($,y)=>{const v=Math.round(c+(p-c)/M*y),g=e.left+y*a/M;return`
      <line x1="${g}" y1="${e.top+i}" x2="${g}" y2="${e.top+i+5}" stroke="#94a3b8" stroke-width="1" />
      <text x="${g}" y="${e.top+i+20}" text-anchor="middle" font-size="11" fill="#94a3b8">${v}</text>
    `}).join("");return`
    <svg viewBox="0 0 ${s} ${n}" class="histogram">
      <rect x="0" y="0" width="${s}" height="${n}" fill="rgba(15, 23, 42, 0.5)" />
      ${d}
      <line x1="${e.left}" y1="${e.top}" x2="${e.left}" y2="${e.top+i}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${e.left}" y1="${e.top+i}" x2="${e.left+a}" y2="${e.top+i}" stroke="#94a3b8" stroke-width="2" />
      ${m}
      ${B}
      <text x="${e.left+a/2}" y="${n-5}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600">Score</text>
      <text x="15" y="${e.top+i/2}" text-anchor="middle" font-size="12" fill="#e2e8f0" font-weight="600" transform="rotate(-90, 15, ${e.top+i/2})">Count</text>
    </svg>
  `}function ie(t){if(b.className="output",t.length===0){b.innerHTML="";return}const o=t.map((r,s)=>{const n=s+1,e=r.stats.mode.length===1?r.stats.mode[0].toString():`${r.stats.mode.join(", ")} (multimodal)`;return`
        <article class="result-card">
          <h2>Game ${n}</h2>
          <p><strong>Actual score:</strong> ${r.score}</p>

          <details open>
            <summary>Score Distribution</summary>
            <div class="histogram-container">
              ${se(r)}
              <p class="histogram-note">
                <span style="color: #fbbf24;">■</span> Your actual score
                <span style="color: #60a5fa; margin-left: 1rem;">■</span> Other permutations
              </p>
            </div>
          </details>

          <details>
            <summary>Statistics</summary>
            <dl class="stats">
              <dt>Permutations analyzed:</dt>
              <dd>${r.stats.permutationCount.toLocaleString()}</dd>

              <dt>Minimum score:</dt>
              <dd>${r.stats.min}</dd>

              <dt>Maximum score:</dt>
              <dd>${r.stats.max}</dd>

              <dt>Mean score:</dt>
              <dd>${r.stats.mean}</dd>

              <dt>Median score:</dt>
              <dd>${r.stats.median}</dd>

              <dt>Mode:</dt>
              <dd>${e}</dd>
            </dl>
          </details>
        </article>
      `}).join("");b.innerHTML=`<section class="results">${o}</section>`}
