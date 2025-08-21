// Minimal JS: routing, tabs, sidebar toggle, theme switch, sample data
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));

// Router
const routes = $$('.nav-item').map(btn => btn.dataset.route);
function goto(route){
  // highlight nav
  $$('.nav-item').forEach(n => n.classList.toggle('is-active', n.dataset.route===route));
  // show section
  routes.forEach(r => {
    const el = $('#route-'+r);
    if(el) el.classList.toggle('is-visible', r===route);
    if(el) el.style.display = r===route ? 'block' : 'none';
  });
  // focus title if present
  const title = $('#route-'+route+' .page-header h1');
  if(title) title.setAttribute('tabindex','-1'), title.focus({preventScroll:true});
}

$$('.nav-item').forEach(btn => btn.addEventListener('click', () => goto(btn.dataset.route)));
goto('dashboard');

// Sidebar toggle
$('#btnNav').addEventListener('click', () => $('#sidebar').classList.toggle('is-open'));

// Tabs
$$('.tabs').forEach(tabs => {
  const tabBtns = $$('.tab', tabs);
  tabBtns.forEach(btn => btn.addEventListener('click', () => {
    tabBtns.forEach(x => x.classList.toggle('is-active', x === btn));
    const panelId = 'tab-'+btn.dataset.tab;
    const container = tabs.nextElementSibling;
    $$('.tabpanel', container).forEach(p => p.classList.toggle('is-visible', p.id === panelId));
  }));
});

// Theme toggle
const root = document.documentElement;
$('#btnTheme').addEventListener('click', () => {
  root.classList.toggle('theme-dark');
  localStorage.setItem('themeDark', root.classList.contains('theme-dark') ? '1':'0');
});
if(localStorage.getItem('themeDark')==='1') root.classList.add('theme-dark');

// Sample data (could be replaced by API calls)
const tickets = [
  {id:'T-1012', oggetto:'Errore fatturazione', cliente:'Alfa S.p.A.', stato:'Aperto', assegnatario:'Operatore', scadenza:'2025-08-24', prio:'Alta', desc:'Anomalia su importo fattura luglio.'},
  {id:'T-1001', oggetto:'Incident rete', cliente:'Beta Logistics', stato:'In lavorazione', assegnatario:'Marco R.', scadenza:'2025-08-22', prio:'Critica', desc:'Interruzione servizio area Milano.'},
  {id:'T-0998', oggetto:'Cliente non raggiungibile', cliente:'Gamma Energy', stato:'In attesa', assegnatario:'—', scadenza:'2025-08-27', prio:'Media', desc:'Richiesta info installazione.'},
  {id:'T-0988', oggetto:'Ripristino completato', cliente:'Delta Telco', stato:'Chiuso', assegnatario:'Sara L.', scadenza:'2025-08-18', prio:'Bassa', desc:'Ticket risolto, in validazione.'},
];
function renderTicketRow(t){
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${t.id}</td><td>${t.oggetto}</td><td>${t.cliente}</td><td>${t.stato}</td><td>${t.assegnatario}</td><td>${t.scadenza}</td>`;
  tr.addEventListener('click', () => selectTicket(t));
  return tr;
}
function refreshTicketList(){
  const tbody = $('#ticketList'); tbody.innerHTML=''; tickets.forEach(t => tbody.appendChild(renderTicketRow(t)));
}
function selectTicket(t){
  $('#ticketTitle').textContent = `${t.id} • ${t.oggetto}`;
  $('#f-id').value = t.id;
  $('#f-stato').value = t.stato;
  $('#f-oggetto').value = t.oggetto;
  $('#f-cliente').value = t.cliente;
  $('#f-prio').value = t.prio;
  $('#f-scadenza').value = t.scadenza;
  $('#f-desc').value = t.desc;
  goto('tickets');
}
refreshTicketList();

// Modal helpers
function showModal(id){ const m = document.getElementById(id); if(m){ m.setAttribute('aria-hidden','false'); } }
function hideModal(id){ const m = document.getElementById(id); if(m){ m.setAttribute('aria-hidden','true'); } }
window.showModal = showModal; window.hideModal = hideModal;

function createTicket(){
  const t = {
    id: 'T-'+(1000 + Math.floor(Math.random()*9000)),
    oggetto: document.getElementById('nt-oggetto').value || 'Senza oggetto',
    cliente: document.getElementById('nt-cliente').value || '—',
    stato:'Aperto',
    assegnatario:'Operatore',
    scadenza: document.getElementById('nt-scadenza').value || '',
    prio: document.getElementById('nt-prio').value || 'Media',
    desc: document.getElementById('nt-desc').value || ''
  };
  tickets.unshift(t);
  refreshTicketList();
  hideModal('modalNewTicket');
  selectTicket(t);
}

// Accessibility: keyboard focus ring only when tabbing
(function(){
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();
