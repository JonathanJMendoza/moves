const storageKey = 'moves-prototype-v1';
const now = Date.now();
const minute = 60000;
const samples = [
  { id:'guitar', person:'Alex Morgan', initials:'AM', color:'peach', category:'SOUNDS LIKE A GOOD TIME', emoji:'♫', title:'A few chords & good company', description:'Playing some guitar in the living room. Come jam or just hang. Absolutely no talent required.', location:'Alex’s place', start:now-15*minute, end:now+105*minute, guests:'Just you · no plus ones', people:2 },
  { id:'coffee', person:'Sofia Chen', initials:'SC', color:'green', category:'A LITTLE PICK-ME-UP', emoji:'☕', title:'Coffee with no agenda', description:'Taking a break from my laptop. Down for a walk, a good chat, or comfortable silence.', location:'The corner café', start:now-10*minute, end:now+50*minute, guests:'Bring a friend · +1 welcome', people:3 },
  { id:'park', person:'Jamie Rivera', initials:'JR', color:'lavender', category:'SOME FRESH AIR', emoji:'☀', title:'An extremely casual park hang', description:'A blanket, a few snacks, and nowhere to be. Bring something to read or just yourself.', location:'Dolores Park', start:now+30*minute, end:now+150*minute, guests:'The more the merrier', people:4 }
];
let moves = samples;
try { const saved=JSON.parse(localStorage.getItem(storageKey)); if(Array.isArray(saved) && saved.every(m=>typeof m.id==='string' && typeof m.title==='string' && Number.isFinite(m.start) && Number.isFinite(m.end))) moves=saved; } catch {}
let filter='all';
const feed=document.querySelector('#feed');
const escape = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(storageKey,JSON.stringify(moves));}catch{notify('Browser storage is unavailable. Changes will last for this visit.');}}
function notify(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('visible'),3500);}
function render(){
 const time=Date.now();
 const active=moves.filter(m=>m.end>time);
 const visible=active.filter(m=>filter==='all'||(filter==='now'?m.start<=time:m.joined||m.own));
 document.querySelector('#count').textContent=active.length;
 feed.innerHTML=visible.length?visible.map(m=>{
 const happening=m.start<=time;
 const remaining=Math.max(1,Math.ceil((m.end-time)/minute));
 const clock=t=>new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 return `<article class="card ${escape(m.color)}"><div class="card-art"><span class="art-label">${escape(m.category)}</span><span class="illustration" aria-hidden="true">${escape(m.emoji)}</span><span class="live ${happening?'':'later'}">${happening?'● Happening now':'◷ In '+Math.ceil((m.start-time)/minute)+' min'}</span></div><div class="card-body"><div class="host"><span class="avatar ${escape(m.color)}">${escape(m.initials)}</span><span>${escape(m.person)}<small>${m.own?'Your open invite':'Has a little time to spare'}</small></span></div><h3>${escape(m.title)}</h3><p class="description">${escape(m.description)}</p><div class="details"><span>⌖ <span>${escape(m.location)}</span></span><span>◷ <span>${clock(m.start)} – ${clock(m.end)} <small>· ${remaining>=60?Math.floor(remaining/60)+'h '+remaining%60+'m':remaining+'m'} left</small></span></span><span>♧ <span>${escape(m.guests)}</span></span></div><div class="card-bottom"><span class="attendees"><span class="tiny-avatar">${escape(m.initials)}</span> ${Number(m.people)+(m.joined?1:0)} ${m.own?'invited':'going'}</span><button class="join ${m.joined?'joined':''}" data-id="${escape(m.id)}">${m.own?'End move':m.joined?'✓ You’re going':'I’m in ↗'}</button></div></div></article>`;
 }).join(''):`<div class="empty"><span>✳</span><h3>${filter==='joined'?'Your next good time is out there.':'A little quiet around here.'}</h3><p>${filter==='joined'?'Join a friend’s move and it’ll show up here.':'Post a move and get something started.'}</p></div>`;
}
feed.addEventListener('click',e=>{const button=e.target.closest('[data-id]');if(!button)return;const move=moves.find(m=>m.id===button.dataset.id);if(move.own){move.end=Date.now();notify('Your move has ended.');}else{move.joined=!move.joined;notify(move.joined?'You’re in! Your response is saved on this device.':'You’ve left this move.');}save();render();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});render();}));
const dialog=document.querySelector('#create-dialog');
document.querySelector('#open-create').addEventListener('click',()=>dialog.showModal());
document.querySelector('#close-create').addEventListener('click',()=>dialog.close());
document.querySelector('#create-form').addEventListener('submit',e=>{e.preventDefault();const form=e.target;const data=new FormData(form);const title=data.get('title').trim(),location=data.get('location').trim();if(!title||!location){notify('Add an activity and a location to post your move.');return;}const start=Date.now()+(data.get('start')==='soon'?30*minute:0);moves.unshift({id:crypto.randomUUID(),person:'You',initials:'YO',color:'peach',category:'A SPONTANEOUS LITTLE PLAN',emoji:'✳',title,location,start,end:start+Number(data.get('duration'))*minute,guests:data.get('guests'),description:data.get('description').trim()||'A little free time. Come join me.',people:0,own:true});save();form.reset();dialog.close();document.querySelector('[data-filter="all"]').click();notify('Your move is live in this demo.');});
render();setInterval(render,30000);
