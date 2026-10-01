(function(){function e(e){let t=new URL(e).pathname,n=t.match(/^\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)\/?$/);if(n||(n=t.match(/^\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)\/?$/),n))return{contestId:n[1],problemIndex:n[2].toUpperCase()};throw Error(`Invalid Codeforces problem URL`)}function t(){let e=document.querySelectorAll(`a`);for(let t of e)if(t.textContent.trim().toLowerCase().startsWith(`tutorial`))return t.href;return null}async function n(e,t,n){let r=await fetch(e);if(!r.ok)throw Error(`Failed to fetch editorial: ${r.status}`);let i=await r.text(),a=new DOMParser().parseFromString(i,`text/html`).querySelector(`.content`);if(!a)throw Error(`Editorial content container not found`);let o=`${t}${n}`,s=[...a.querySelectorAll(`p`)].find(e=>e.textContent.trim().startsWith(o));if(!s)throw Error(`Editorial section for ${n} not found`);let c=document.createDocumentFragment(),l=s;for(;l;){let e=l.textContent.trim();if(l!==s&&/^\d+[A-Za-z0-9]+\s*[-–—]/.test(e))break;c.appendChild(l.cloneNode(!0)),l=l.nextElementSibling}let u=document.createElement(`div`);return u.appendChild(c),renderMathInElement(u,{delimiters:[{left:`$$$`,right:`$$$`,display:!1},{left:`$$`,right:`$$`,display:!0}],throwOnError:!1}),u.innerHTML}async function r(e){let t=document.getElementById(`cf-editorial-modal`);t&&t.remove();let n=document.createElement(`div`);n.id=`cf-editorial-modal`,n.innerHTML=`
    <div class="cf-editorial-backdrop"></div>

    <div class="cf-editorial-dialog">
      <div class="cf-editorial-header">
        <h2>Editorial Quick View</h2>
        <button class="cf-editorial-close" aria-label="Close">
          ×
        </button>
      </div>

      <div class="cf-editorial-body">
        ${e}
      </div>
    </div>
  `,document.body.appendChild(n),n.querySelectorAll(`.spoiler`).forEach(e=>{let t=e.querySelector(`.spoiler-title`),n=e.querySelector(`.spoiler-content`);t&&n&&(t.style.cursor=`pointer`,t.addEventListener(`click`,()=>{let e=n.style.display===`none`;n.style.display=e?`block`:`none`}))});let r=()=>n.remove();n.querySelector(`.cf-editorial-close`).addEventListener(`click`,r),n.querySelector(`.cf-editorial-backdrop`).addEventListener(`click`,r),document.addEventListener(`keydown`,function e(t){t.key===`Escape`&&(r(),document.removeEventListener(`keydown`,e))})}function i(){let e=document.createElement(`link`);e.rel=`stylesheet`,e.href=chrome.runtime.getURL(`dist/katex/katex.min.css`),document.head.appendChild(e)}i();var a=document.createElement(`button`);a.textContent=`Editorial Quick View`,a.id=`cf-editorial-button`,a.addEventListener(`click`,async()=>{try{let i=e(window.location.href),a=t();if(!a)throw Error(`Tutorial not found`);await r(await n(a,i.contestId,i.problemIndex))}catch(e){console.error(`Editorial error:`,e)}}),document.body.appendChild(a)})();