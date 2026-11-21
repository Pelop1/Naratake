const V='naratake-v7',CORE=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||!q.url.startsWith('http')||q.url.includes('api.anthropic.com'))return;
 const same=new URL(q.url).origin===location.origin;
 const net=()=>fetch(q).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(V).then(c=>c.put(q,cp))}return r});
 e.respondWith(same?net().catch(()=>caches.match(q).then(h=>h||caches.match('./index.html'))):caches.match(q).then(h=>h||net().catch(()=>caches.match('./index.html'))))});
