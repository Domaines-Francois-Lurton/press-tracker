// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CONSTANTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const REVUES = [
  { id: 'ws',  label: 'WS',     full: 'Wine Spectator' },
  { id: 'we',  label: 'WE',     full: 'Wine Enthusiast' },
  { id: 'v',   label: 'Vinous', full: 'Vinous' },
  { id: 'js',  label: 'JS',     full: 'James Suckling' },
  { id: 'wa',  label: 'WA',     full: 'Wine Advocate' },
  { id: 'ws2', label: 'W&S',    full: 'Wine & Spirits' },
  { id: 'd',   label: 'Dec.',   full: 'Decanter' },
];


const TRIMESTRES = [
  { id: 'Q1', label: '1er trimestre',  months: 'Jan – Mars',  endMonth: 2,  endDay: 31 },
  { id: 'Q2', label: '2ème trimestre', months: 'Avr – Juin',  endMonth: 5,  endDay: 30 },
  { id: 'Q3', label: '3ème trimestre', months: 'Juil – Sept', endMonth: 8,  endDay: 30 },
  { id: 'Q4', label: '4ème trimestre', months: 'Oct – Déc',   endMonth: 11, endDay: 31 },
];

function getTrimestreEnd(qid) {
  const t = TRIMESTRES.find(x => x.id === qid);
  if (!t) return null;
  return new Date(new Date().getFullYear(), t.endMonth, t.endDay, 23, 59, 59);
}

function getTrimestreState(qid, isSent) {
  if (isSent) return 'sent';
  const end = getTrimestreEnd(qid);
  if (!end) return 'ok';
  const daysLeft = Math.floor((end - new Date()) / 86400000);
  if (daysLeft < 0)  return 'overdue';
  if (daysLeft <= 30) return 'warning';
  return 'ok';
}

function trimBadge(qid) {
  if (!qid) return '';
  const colors = { Q1: '#3b82f6', Q2: '#10b981', Q3: '#f59e0b', Q4: '#8b5cf6' };
  const c = colors[qid] || '#999';
  return '<span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:10px;' +
    'background:' + c + '22;color:' + c + ';border:1px solid ' + c + '44">' + qid + '</span>';
}

function isWineSent(wineId) {
  return shipmentItems.some(i => i.wineId === wineId && ['envoyé','reçu','noté'].includes(i.statut));
}

function getTrimestreAlerts() {
  return wines.filter(w => {
    if (!w.trimestre) return false;
    const st = getTrimestreState(w.trimestre, isWineSent(w.id));
    return st === 'overdue' || st === 'warning';
  }).length;
}

let db;
let wines = [];
let shipments = [];
let shipmentItems = [];
let trackerView = 'table';
let trackerSort = { col: 'pays', dir: 1 };

function setTrackerSort(col) {
  if (trackerSort.col === col) trackerSort.dir *= -1;
  else { trackerSort.col = col; trackerSort.dir = col === 'millesime' ? -1 : 1; }
  renderTracker();
}

function applyTrackerSort(arr, wrs) {
  const { col, dir } = trackerSort;
  return [...arr].sort((a, b) => {
    let va, vb;
    if (col === 'pays')       { va = (a.pays || '').toLowerCase();       vb = (b.pays || '').toLowerCase(); }
    else if (col === 'marque'){ va = (a.appellation || '').toLowerCase(); vb = (b.appellation || '').toLowerCase(); }
    else if (col === 'denom') { va = (a.nom || '').toLowerCase();         vb = (b.nom || '').toLowerCase(); }
    else if (col === 'mil')   { va = parseFloat(a.millesime) || 0;        vb = parseFloat(b.millesime) || 0; }
    else if (col === 'couleur'){ va = (a.couleur || '').toLowerCase();    vb = (b.couleur || '').toLowerCase(); }
    else if (col === 'note') {
      const bestNote = w => Math.max(-1, ...Object.values(wrs[w.id] || {}).map(x => parseFloat(x.note) || -1));
      va = bestNote(a); vb = bestNote(b);
    }
    else return 0;
    return va < vb ? -dir : va > vb ? dir : 0;
  });
}
let unsubWines, unsubShipments, unsubItems;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// AUTH
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function doLogin() {
  const pwd = document.getElementById('pwdInput').value;
  if (pwd !== APP_PASSWORD) {
    document.getElementById('loginError').style.display = 'block';
    return;
  }
  sessionStorage.setItem('pt_auth', '1');
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('theApp').style.display = 'flex';
  initApp();
}

function doLogout() {
  sessionStorage.removeItem('pt_auth');
  if (unsubWines) unsubWines();
  if (unsubShipments) unsubShipments();
  if (unsubItems) unsubItems();
  location.reload();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FIREBASE INIT & REALTIME
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function initApp() {
  document.getElementById('loadingOverlay').style.display = 'flex';
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();

  const loaded = { wines: false, shipments: false, items: false };

  function checkReady() {
    if (loaded.wines && loaded.shipments && loaded.items) {
      document.getElementById('loadingOverlay').style.display = 'none';
      buildFilters();
      renderAll();
    }
  }

  setTimeout(function () {
    if (document.getElementById('loadingOverlay').style.display !== 'none') {
      loaded.wines = true; loaded.shipments = true; loaded.items = true;
      checkReady();
    }
  }, 8000);

  unsubWines = db.collection('wines').onSnapshot(snap => {
    wines = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    wines.sort((a, b) => (a.pays || '').localeCompare(b.pays || '') || (a.nom || '').localeCompare(b.nom || ''));
    loaded.wines = true;
    checkReady();
    if (loaded.wines && loaded.shipments && loaded.items) { buildFilters(); renderAll(); }
  }, err => { console.error('wines:', err); loaded.wines = true; checkReady(); });

  unsubShipments = db.collection('shipments').onSnapshot(snap => {
    shipments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    shipments.sort((a, b) => (b.dateEnvoi || '').localeCompare(a.dateEnvoi || ''));
    loaded.shipments = true;
    checkReady();
  }, err => { console.error('shipments:', err); loaded.shipments = true; checkReady(); });

  unsubItems = db.collection('shipmentItems').onSnapshot(snap => {
    shipmentItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    loaded.items = true;
    checkReady();
    if (loaded.wines) renderAll();
  }, err => { console.error('items:', err); loaded.items = true; checkReady(); });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// NAVIGATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll(`.nav-tab[data-page="${name}"]`).forEach(t => t.classList.add('active'));
  if (name === 'tracker') renderTracker();
  if (name === 'catalogue') renderCatalogue();
  if (name === 'alerts') renderAlerts();
}

document.addEventListener('click', e => {
  const tab = e.target.closest('.nav-tab[data-page]');
  if (tab) showPage(tab.dataset.page);
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HELPERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function toast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' toast-' + type : '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), type === 'error' ? 4500 : 2500);
}

let _confirmCb = null;
function confirmModal(msg, onConfirm, confirmLabel, confirmClass) {
  _confirmCb = onConfirm;
  const html = '<div class="modal-overlay confirm-overlay" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal" style="max-width:380px;width:90%">' +
      '<div class="modal-body" style="padding:24px 20px 12px">' +
        '<p style="font-size:14px;line-height:1.6;color:var(--text)">' + esc(msg) + '</p>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-sm" onclick="this.closest(\'.confirm-overlay\').remove()">Annuler</button>' +
        '<button class="btn btn-sm ' + (confirmClass || 'btn-danger') + '" onclick="this.closest(\'.confirm-overlay\').remove();const cb=_confirmCb;_confirmCb=null;cb&&cb()">' + (confirmLabel || 'Confirmer') + '</button>' +
      '</div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

let modalDirty = false;

function closeModal() {
  document.querySelector('.modal-overlay')?.remove();
  modalDirty = false;
}

function safeCloseModal() {
  if (!modalDirty) { closeModal(); return; }
  confirmModal('Des modifications non enregistrées seront perdues. Continuer ?', closeModal, 'Quitter', 'btn-primary');
}

function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

function fmtDate(d) {
  if (!d) return '–';
  const dt = d.toDate ? d.toDate() : new Date(d);
  return dt.toLocaleDateString('fr-FR');
}

function daysUntil(d) {
  if (!d) return null;
  const dt = d.toDate ? d.toDate() : new Date(d);
  return Math.round((dt - new Date()) / 86400000);
}

function couleurBadge(c) {
  const cl = (c || '').toLowerCase().replace('é', 'e');
  return '<span class="cl-' + cl + '">' + (c || '') + '</span>';
}

function statutBadge(st) {
  const map = { 'noté': 'badge-noté', 'envoyé': 'badge-envoyé', 'reçu': 'badge-reçu', 'pending': 'badge-pending' };
  const labels = { 'noté': 'Noté', 'envoyé': 'Envoyé', 'reçu': 'Reçu', 'pending': 'En attente' };
  return '<span class="badge ' + (map[st] || 'badge-pending') + '">' + (labels[st] || st) + '</span>';
}

function renderAll() {
  renderTracker();
  renderCatalogue();
  renderAlerts();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// WINE-REVUE STATUS MATRIX
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function getWineRevueStatus() {
  const result = {};
  wines.forEach(w => {
    result[w.id] = {};
    REVUES.forEach(r => {
      result[w.id][r.id] = { statut: 'pending', note: '', deadline: '', commentaire: '', dateReception: '', shipmentId: null, itemId: null };
    });
  });
  const order = ['pending', 'envoyé', 'reçu', 'noté'];
  shipmentItems.forEach(item => {
    const wid = item.wineId;
    const rid = item.revueId;
    if (!result[wid] || !result[wid][rid]) return;
    const cur = result[wid][rid];
    if (order.indexOf(item.statut) >= order.indexOf(cur.statut)) {
      result[wid][rid] = {
        statut: item.statut,
        note: item.note || '',
        deadline: item.deadline || '',
        dateReception: item.dateReception || '',
        commentaire: item.commentaire || '',
        shipmentId: item.shipmentId,
        itemId: item.id
      };
    }
  });
  return result;
}

// getAlerts removed — replaced by getTrimestreAlerts

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FILTERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function buildFilters() {
  const pays = [...new Set(wines.map(w => w.pays).filter(Boolean))].sort();
  ['filterPays', 'catFilterPays'].forEach(id => {
    const sel = document.getElementById(id);
    const cur = sel.value;
    sel.innerHTML = '<option value="">Tous les pays</option>' + pays.map(p => '<option' + (p === cur ? ' selected' : '') + '>' + esc(p) + '</option>').join('');
  });
  const revSel = document.getElementById('filterRevue');
  const curRev = revSel.value;
  revSel.innerHTML = '<option value="">Toutes les revues</option>' + REVUES.map(r => '<option value="' + r.id + '"' + (r.id === curRev ? ' selected' : '') + '>' + r.full + '</option>').join('');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// TRACKER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function wineHasAlert(w) {
  return !!(w.trimestre && ['overdue','warning'].includes(getTrimestreState(w.trimestre, isWineSent(w.id))));
}

function updateAlertBadge() {
  const n = getTrimestreAlerts();
  const d = document.getElementById('alert-badge');
  if (d) { d.textContent = n; d.style.display = n ? 'inline' : 'none'; }
  const m = document.getElementById('alert-badge-m');
  if (m) { m.textContent = n; m.style.display = n ? 'flex' : 'none'; }
  return n;
}

function setTrackerView(v) {
  trackerView = v;
  document.getElementById('vbtnTable').className = 'vbtn' + (v === 'table' ? ' active' : '');
  document.getElementById('vbtnCard').className = 'vbtn' + (v === 'card' ? ' active' : '');
  renderTracker();
}

function renderTracker() {
  const search = (document.getElementById('trackerSearch').value || '').toLowerCase();
  const fPays = document.getElementById('filterPays').value;
  const fRevue = document.getElementById('filterRevue').value;
  const fStatut = document.getElementById('filterStatut').value;
  const fTrimestre = (document.getElementById('filterTrimestre') || {}).value || '';
  const wrs = getWineRevueStatus();

  const filtered = wines.filter(w => {
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.domaine || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fRevue) { const ri = wrs[w.id] && wrs[w.id][fRevue]; if (!ri || ri.statut === 'pending') return false; }
    if (fTrimestre && w.trimestre !== fTrimestre) return false;
    if (fStatut) {
      const statuts = Object.values(wrs[w.id] || {}).map(x => x.statut);
      if (fStatut === 'pending') { if (!statuts.every(s => s === 'pending')) return false; }
      else { if (!statuts.includes(fStatut)) return false; }
    }
    return true;
  });

  document.getElementById('statVins').textContent = wines.length;
  document.getElementById('statEnvois').textContent = shipmentItems.length;
  document.getElementById('statNotes').textContent = shipmentItems.filter(i => i.note).length;
  document.getElementById('statAlerts').textContent = updateAlertBadge();

  const c = document.getElementById('trackerContent');
  if (!filtered.length) { c.innerHTML = '<div class="empty">Aucun vin trouvé.</div>'; return; }

  if (window.innerWidth <= 768 && trackerView === 'table') {
    setTrackerView('card');
    return;
  }

  if (trackerView === 'table') {
    const sorted = applyTrackerSort(filtered, wrs);
    const si = (col, label) => {
      const active = trackerSort.col === col;
      const arrow = active ? (trackerSort.dir === 1 ? ' ↑' : ' ↓') : '';
      return '<th style="cursor:pointer;user-select:none' + (active ? ';color:var(--accent)' : '') + '" onclick="setTrackerSort(\'' + col + '\')">' + label + arrow + '</th>';
    };
    c.innerHTML = '<div class="tbl-wrap"><table>' +
      '<thead><tr>' + si('pays','Pays') + si('marque','Domaine / Marque') + si('denom','Dénomination') + si('mil','Mill.') + si('couleur','Couleur') +
      REVUES.map(r => '<th>' + r.label + '</th>').join('') + '</tr></thead><tbody>' +
      sorted.map(w => {
        const hasAlert = wineHasAlert(w);
        return '<tr onclick="openWineDetail(\'' + w.id + '\')"' + (hasAlert ? ' style="background:#faeeda22"' : '') + '>' +
          '<td>' + esc(w.pays) + '</td>' +
          '<td><strong>' + esc(w.appellation) + '</strong></td>' +
          '<td style="font-size:11px">' + esc(w.nom) + '</td>' +
          '<td>' + (w.millesime || '') + '</td>' +
          '<td>' + couleurBadge(w.couleur) + '</td>' +
          REVUES.map(r => {
            const info = wrs[w.id] && wrs[w.id][r.id];
            if (!info || info.statut === 'pending') return '<td><span style="color:var(--text-faint)">–</span></td>';
            if (info.note) return '<td>' + statutBadge('noté') + ' <span class="note-pill">' + esc(info.note) + '</span></td>';
            const d = info.deadline ? daysUntil(info.deadline) : null;
            const tag = d !== null && d >= 0 && d <= 30 ? '<span class="deadline-tag ' + (d <= 7 ? 'deadline-urgent' : 'deadline-soon') + '">J-' + d + '</span>' : (d !== null && d < 0 ? '<span class="deadline-tag deadline-urgent">Expiré</span>' : '');
            return '<td>' + statutBadge(info.statut) + ' ' + tag + '</td>';
          }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  } else if (trackerView === 'card') {
    c.innerHTML = '<div class="card-grid">' + filtered.map(w => {
      const hasAlert = wineHasAlert(w);
      return '<div class="wine-card' + (hasAlert ? ' alert-card' : '') + '" onclick="openWineDetail(\'' + w.id + '\')">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
        '<div><div class="card-name">' + esc(w.appellation) + ' ' + (w.millesime || '') + '</div>' +
        '<div class="card-meta">' + esc(w.nom) + ' · ' + esc(w.pays) + '</div></div>' +
        couleurBadge(w.couleur) + '</div>' +
        '<div class="card-pills">' + REVUES.map(r => {
          const info = wrs[w.id] && wrs[w.id][r.id];
          const d = info && info.deadline ? daysUntil(info.deadline) : null;
          const isAlert = d !== null && d <= 30 && info && info.statut !== 'noté';
          let cls = 'none';
          if (info && info.note) cls = 'rated';
          else if (info && info.statut === 'reçu') cls = 'recvd';
          else if (info && info.statut === 'envoyé') cls = isAlert ? 'alert' : 'sent';
          return '<span class="revue-pill ' + cls + '">' + r.label + (info && info.note ? ' · ' + esc(info.note) : '') + (isAlert && !(info && info.note) ? ' J-' + d : '') + '</span>';
        }).join('') + '</div></div>';
    }).join('') + '</div>';
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// WINE DETAIL MODAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function openWineDetail(wineId) {
  const w = wines.find(x => x.id === wineId);
  if (!w) return;
  const wrs = getWineRevueStatus();
  const wineItems = shipmentItems.filter(i => i.wineId === wineId);
  const wineShipmentIds = [...new Set(wineItems.map(i => i.shipmentId))];
  const wineShipments = wineShipmentIds.map(sid => shipments.find(s => s.id === sid)).filter(Boolean);

  const html = '<div class="modal-overlay" onclick="if(event.target===this)closeModal()">' +
  '<div class="modal modal-lg">' +
    '<div class="modal-header">' +
      '<div class="modal-title">' + esc(w.appellation) + ' ' + (w.millesime || '') + ' – ' + esc(w.pays) + '</div>' +
      '<button class="btn btn-sm" onclick="closeModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">' +
        couleurBadge(w.couleur) +
        '<span style="font-size:13px;color:var(--text-muted)">' + esc(w.nom) + '</span>' +
        (w.cepage ? '<span style="font-size:12px;color:var(--text-faint)">' + esc(w.cepage) + '</span>' : '') +
        (w.degre ? '<span style="font-size:12px;color:var(--text-faint)">' + esc(w.degre) + '°</span>' : '') +
      '</div>' +
      (w.lienExterne ? '<div style="margin-bottom:10px"><a href="' + esc(w.lienExterne) + '" target="_blank" rel="noopener" class="link-ext">🔗 ' + esc(w.lienExterne) + '</a></div>' : '') +
      (w.commentaire ? '<div style="font-size:12px;color:var(--text-muted);font-style:italic;margin-bottom:14px">' + esc(w.commentaire) + '</div>' : '') +
      '<div class="section-title">Statut par revue</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin-bottom:16px">' +
        REVUES.map(r => {
          const info = wrs[wineId] && wrs[wineId][r.id];
          const d = info && info.deadline ? daysUntil(info.deadline) : null;
          return '<div style="background:var(--bg);border-radius:var(--radius);padding:10px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
              '<span style="font-size:11px;font-weight:600;color:var(--text-muted)">' + r.full + '</span>' +
              (info && info.statut !== 'pending' && info.itemId ? '<button class="btn btn-sm" onclick="openEditItem(\'' + info.itemId + '\',\'' + wineId + '\')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" style="vertical-align:middle" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM22.1213 10.7071C20.9497 9.53553 19.0503 9.53553 17.8787 10.7071L16.1989 12.3869L11.2929 17.2929C11.1647 17.4211 11.0738 17.5816 11.0299 17.7575L10.0299 21.7575C9.94466 22.0982 10.0445 22.4587 10.2929 22.7071C10.5413 22.9555 10.9018 23.0553 11.2425 22.9701L15.2425 21.9701C15.4184 21.9262 15.5789 21.8353 15.7071 21.7071L20.5556 16.8586L22.2929 15.1213C23.4645 13.9497 23.4645 12.0503 22.2929 10.8787L22.1213 10.7071ZM18.3068 13.1074L19.2929 12.1213C19.6834 11.7308 20.3166 11.7308 20.7071 12.1213L20.8787 12.2929C21.2692 12.6834 21.2692 13.3166 20.8787 13.7071L19.8622 14.7236L18.3068 13.1074ZM16.8923 14.5219L18.4477 16.1381L14.4888 20.097L12.3744 20.6256L12.903 18.5112L16.8923 14.5219Z" fill="currentColor"/></svg></button>' : '') +
            '</div>' +
            (info && info.statut && info.statut !== 'pending' ?
              statutBadge(info.statut) +
              (info.note ? ' <span class="note-pill" style="margin-left:4px">' + esc(info.note) + '</span>' : '') +
              (info.deadline ? '<div style="font-size:11px;color:var(--text-muted);margin-top:4px">Deadline : ' + fmtDate(info.deadline) + (d !== null ? ' <span class="deadline-tag ' + (d <= 7 ? 'deadline-urgent' : 'deadline-soon') + '">J-' + d + '</span>' : '') + '</div>' : '') +
              (info.dateReception ? '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">Reçu le : ' + fmtDate(info.dateReception) + '</div>' : '') +
              (info.commentaire ? '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;font-style:italic">' + esc(info.commentaire) + '</div>' : '')
            : '<span style="color:var(--text-faint);font-size:12px">Non soumis</span>') +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="section-title">Envois (' + wineShipments.length + ')</div>' +
      (wineShipments.length ? wineShipments.map(s => {
        const items = shipmentItems.filter(i => i.wineId === wineId && i.shipmentId === s.id);
        return '<div style="background:var(--bg);border-radius:var(--radius);padding:10px;margin-bottom:8px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px">' +
            '<span style="font-size:12px;font-weight:500">Envoi du ' + fmtDate(s.dateEnvoi) + '</span>' +
            '<span style="display:flex;align-items:center;gap:6px">' +
              '<span style="font-size:11px;color:var(--text-muted)">' + esc(s.tracking || '') + (s.intermediaire ? ' · ' + esc(s.intermediaire) : '') + '</span>' +
              '<button class="btn btn-sm btn-danger" style="padding:1px 6px;font-size:11px" onclick="deleteShipment(\'' + s.id + '\',\'' + wineId + '\')">&times;</button>' +
            '</span>' +
          '</div>' +
          items.map(i => {
            const rev = REVUES.find(r => r.id === i.revueId);
            return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-top:4px;flex-wrap:wrap">' +
              '<span style="color:var(--text-muted);min-width:100px">' + (rev ? rev.full : i.revueId) + '</span>' +
              statutBadge(i.statut) +
              (i.note ? '<span class="note-pill">' + esc(i.note) + '</span>' : '') +
              '<button class="btn btn-sm" onclick="openEditItem(\'' + i.id + '\',\'' + wineId + '\')">Modifier</button>' +
              '<button class="btn btn-sm btn-danger" onclick="deleteItem(\'' + i.id + '\',\'' + wineId + '\')">Supprimer</button>' +
            '</div>';
          }).join('') +
        '</div>';
      }).join('') : '<div style="color:var(--text-faint);font-size:13px">Aucun envoi enregistré.</div>') +
    '</div>' +
    '<div class="modal-footer" style="flex-wrap:wrap">' +
      '<button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + wineId + '\')">Supprimer</button>' +
      '<button class="btn btn-sm" onclick="closeModal();openEditWineModal(\'' + wineId + '\')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;margin-right:5px" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM22.1213 10.7071C20.9497 9.53553 19.0503 9.53553 17.8787 10.7071L16.1989 12.3869L11.2929 17.2929C11.1647 17.4211 11.0738 17.5816 11.0299 17.7575L10.0299 21.7575C9.94466 22.0982 10.0445 22.4587 10.2929 22.7071C10.5413 22.9555 10.9018 23.0553 11.2425 22.9701L15.2425 21.9701C15.4184 21.9262 15.5789 21.8353 15.7071 21.7071L20.5556 16.8586L22.2929 15.1213C23.4645 13.9497 23.4645 12.0503 22.2929 10.8787L22.1213 10.7071ZM18.3068 13.1074L19.2929 12.1213C19.6834 11.7308 20.3166 11.7308 20.7071 12.1213L20.8787 12.2929C21.2692 12.6834 21.2692 13.3166 20.8787 13.7071L19.8622 14.7236L18.3068 13.1074ZM16.8923 14.5219L18.4477 16.1381L14.4888 20.097L12.3744 20.6256L12.903 18.5112L16.8923 14.5219Z" fill="currentColor"/></svg>Modifier le vin</button>' +
      '<div style="flex:1"></div>' +
      '<button class="btn btn-sm" onclick="closeModal()">Fermer</button>' +
      '<button class="btn btn-sm btn-primary" onclick="closeModal();openShipmentModal(\'' + wineId + '\')">+ Nouvel envoi</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EDIT SHIPMENT ITEM
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function openEditItem(itemId, wineId) {
  const item = shipmentItems.find(i => i.id === itemId);
  if (!item) return;
  const w = wines.find(x => x.id === item.wineId);
  const r = REVUES.find(x => x.id === item.revueId);
  closeModal();

  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header">' +
      '<div class="modal-title">Modifier – ' + esc(w ? w.nom : '') + ' / ' + (r ? r.full : '') + '</div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="grid-2">' +
        '<div class="field"><label>Statut</label><select id="ei_statut">' +
          '<option value="envoyé"' + (item.statut === 'envoyé' ? ' selected' : '') + '>Envoyé</option>' +
          '<option value="reçu"' + (item.statut === 'reçu' ? ' selected' : '') + '>Reçu</option>' +
          '<option value="noté"' + (item.statut === 'noté' ? ' selected' : '') + '>Noté</option>' +
        '</select></div>' +
        '<div class="field"><label>Note reçue</label><input id="ei_note" value="' + esc(item.note || '') + '" placeholder="ex: 92"></div>' +
        '<div class="field"><label>Date réception</label><input type="date" id="ei_recep" value="' + (item.dateReception || '') + '"></div>' +
      '</div>' +
      '<div class="field"><label>Commentaire</label><textarea id="ei_comment">' + esc(item.commentaire || '') + '</textarea></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">Annuler</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveItem" onclick="saveItem(\'' + itemId + '\',\'' + wineId + '\')">Enregistrer</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function saveItem(itemId, wineId) {
  const btn = document.getElementById('btnSaveItem');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await db.collection('shipmentItems').doc(itemId).update({
      statut: document.getElementById('ei_statut').value,
      note: document.getElementById('ei_note').value || null,
      dateReception: document.getElementById('ei_recep').value || null,
      commentaire: document.getElementById('ei_comment').value || null,
    });
    closeModal();
    toast('Modifications enregistrées');
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Enregistrer';
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SHIPMENT MODAL (NOUVEL ENVOI)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let selectedWines = new Set();
let selectedRevues = new Set();

function openShipmentModal(preselect) {
  selectedWines = new Set(preselect ? [preselect] : []);
  selectedRevues = new Set();
  renderShipmentModal();
}

function renderShipmentModal() {
  const today = new Date().toISOString().split('T')[0];
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal modal-lg">' +
    '<div class="modal-header">' +
      '<div class="modal-title">Nouvel envoi groupé</div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="section-title">1 · Vins à envoyer <span class="selected-count" id="wineCount">(' + selectedWines.size + ' sélectionné' + (selectedWines.size > 1 ? 's' : '') + ')</span></div>' +
      '<div class="wine-selector">' +
        '<input class="search-wines" type="text" placeholder="Filtrer les vins..." oninput="filterWineList(this.value)">' +
        '<div id="wineList">' + renderWineList('') + '</div>' +
      '</div>' +
      '<div class="section-title" style="margin-top:16px">2 · Revues ciblées</div>' +
      '<div class="revue-checkboxes">' + REVUES.map(r =>
        '<div class="revue-check' + (selectedRevues.has(r.id) ? ' active' : '') + '" onclick="toggleRevue(\'' + r.id + '\',this)">' + r.full + '</div>'
      ).join('') + '</div>' +
      '<div class="section-title" style="margin-top:16px">3 · Détails de l\'envoi</div>' +
      '<div class="grid-3">' +
        '<div class="field"><label>Date d\'envoi *</label><input type="date" id="sh_date" value="' + today + '"></div>' +
        '<div class="field"><label>Numéro de tracking</label><input id="sh_tracking" placeholder="ex: FEDEX 1234567890"></div>' +
        '<div class="field"><label>Intermédiaire</label><input id="sh_inter" placeholder="ex: Winesellers"></div>' +
      '</div>' +
      '<div class="field"><label>Commentaire</label><input id="sh_comment" placeholder="Optionnel"></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<div style="font-size:12px;color:var(--text-muted);margin-right:auto" id="shipmentSummary">' + selectedWines.size + ' vin(s) · ' + selectedRevues.size + ' revue(s)</div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">Annuler</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveShipment" onclick="saveShipment()">Enregistrer l\'envoi</button>' +
    '</div>' +
  '</div></div>';
  document.querySelector('.modal-overlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function renderWineList(filter) {
  const f = (filter || '').toLowerCase();
  return wines
    .filter(w => !f || (w.nom || '').toLowerCase().includes(f) || (w.pays || '').toLowerCase().includes(f) || (w.appellation || '').toLowerCase().includes(f))
    .map(w =>
      '<div class="wine-option' + (selectedWines.has(w.id) ? ' selected' : '') + '" onclick="toggleWine(\'' + w.id + '\',this)">' +
        '<input type="checkbox" ' + (selectedWines.has(w.id) ? 'checked' : '') + ' onclick="event.stopPropagation();toggleWine(\'' + w.id + '\',this.closest(\'.wine-option\'))">' +
        '<div><div class="wine-opt-name">' + esc(w.nom) + ' ' + (w.millesime || '') + '</div>' +
        '<div class="wine-opt-meta">' + esc(w.pays) + ' · ' + esc(w.appellation) + ' · ' + couleurBadge(w.couleur) + '</div></div>' +
      '</div>'
    ).join('');
}

function filterWineList(v) {
  document.getElementById('wineList').innerHTML = renderWineList(v);
}

function toggleWine(id, el) {
  if (selectedWines.has(id)) selectedWines.delete(id);
  else selectedWines.add(id);
  el.classList.toggle('selected', selectedWines.has(id));
  const cb = el.querySelector('input');
  if (cb) cb.checked = selectedWines.has(id);
  updateShipmentCounts();
}

function toggleRevue(id, el) {
  if (selectedRevues.has(id)) selectedRevues.delete(id);
  else selectedRevues.add(id);
  el.classList.toggle('active', selectedRevues.has(id));
  updateShipmentCounts();
}



function updateShipmentCounts() {
  const wc = document.getElementById('wineCount');
  if (wc) wc.textContent = '(' + selectedWines.size + ' sélectionné' + (selectedWines.size > 1 ? 's' : '') + ')';
  const sm = document.getElementById('shipmentSummary');
  if (sm) sm.textContent = selectedWines.size + ' vin(s) · ' + selectedRevues.size + ' revue(s)';
}

async function saveShipment() {
  if (!selectedWines.size) { toast('Sélectionnez au moins un vin.', 'warn'); return; }
  if (!selectedRevues.size) { toast('Sélectionnez au moins une revue.', 'warn'); return; }
  const date = document.getElementById('sh_date').value;
  if (!date) { toast("La date d'envoi est obligatoire.", 'warn'); return; }

  const btn = document.getElementById('btnSaveShipment');
  btn.innerHTML = '<span class="spinner"></span> Enregistrement...';
  btn.disabled = true;

  try {
    const shipRef = await db.collection('shipments').add({
      dateEnvoi: date,
      tracking: document.getElementById('sh_tracking').value || null,
      intermediaire: document.getElementById('sh_inter').value || null,
      commentaireGlobal: document.getElementById('sh_comment').value || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const batch = db.batch();
    selectedWines.forEach(wid => {
      selectedRevues.forEach(rid => {
        const ref = db.collection('shipmentItems').doc();
        batch.set(ref, {
          shipmentId: shipRef.id,
          wineId: wid,
          revueId: rid,
          statut: 'envoyé',
          note: null,
          deadline: null,
          dateReception: null,
          commentaire: document.getElementById('sh_comment').value || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    });
    await batch.commit();

    closeModal();
    toast('✓ ' + (selectedWines.size * selectedRevues.size) + ' envoi(s) enregistré(s)');
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = "Enregistrer l'envoi";
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CATALOGUE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let catSelected = new Set();

function updateCatSelectionUI() {
  const btn = document.getElementById('btnDeleteSelected');
  if (!btn) return;
  const btnTag = document.getElementById('btnTagSelected');
  if (catSelected.size > 0) {
    btn.style.display = '';
    btn.textContent = 'Supprimer (' + catSelected.size + ')';
    if (btnTag) { btnTag.style.display = ''; btnTag.textContent = 'Taguer (' + catSelected.size + ')'; }
  } else {
    btn.style.display = 'none';
    if (btnTag) btnTag.style.display = 'none';
  }
  const allCb = document.getElementById('catSelectAll');
  if (allCb) {
    const allRows = document.querySelectorAll('.cat-row-cb');
    allCb.checked = allRows.length > 0 && [...allRows].every(cb => cb.checked);
    allCb.indeterminate = catSelected.size > 0 && !allCb.checked;
  }
}

function toggleCatSelect(id, checked, event) {
  event.stopPropagation();
  if (checked) catSelected.add(id); else catSelected.delete(id);
  updateCatSelectionUI();
}

function toggleSelectAll() {
  const master = document.getElementById('catSelectAll');
  document.querySelectorAll('.cat-row-cb').forEach(cb => {
    cb.checked = master.checked;
    if (master.checked) catSelected.add(cb.dataset.id); else catSelected.delete(cb.dataset.id);
  });
  updateCatSelectionUI();
}

function deleteSelectedWines() {
  const ids = [...catSelected];
  const canDelete = ids.filter(id => !shipmentItems.some(i => i.wineId === id));
  const blocked = ids.length - canDelete.length;
  if (canDelete.length === 0) { toast('Les vins sélectionnés ont des envois et ne peuvent pas être supprimés.', 'error'); return; }
  let msg = 'Supprimer définitivement ' + canDelete.length + ' vin(s) ?';
  if (blocked > 0) msg += ' (' + blocked + ' vin(s) avec envois ignoré(s).)';
  confirmModal(msg, async () => {
    try {
      const batch = db.batch();
      canDelete.forEach(id => batch.delete(db.collection('wines').doc(id)));
      await batch.commit();
      catSelected.clear();
      updateCatSelectionUI();
      toast(canDelete.length + ' vin(s) supprimé(s)');
    } catch (e) { toast('Erreur : ' + e.message, 'error'); }
  }, 'Supprimer', 'btn-danger');
}


function openTagModal() {
  if (!catSelected.size) return;
  const html = '<div class="modal-overlay confirm-overlay" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal" style="max-width:340px;width:90%">' +
      '<div class="modal-body" style="padding:20px 20px 12px">' +
        '<p style="font-size:14px;font-weight:500;margin-bottom:12px">Taguer ' + catSelected.size + ' vin(s) · trimestre d\'envoi</p>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
          TRIMESTRES.map(td =>
            '<button class="btn btn-sm" style="justify-content:center;flex-direction:column;gap:4px;padding:10px 8px" onclick="applyTrimTag(\'' + td.id + '\')">' +
              trimBadge(td.id) +
              '<span style="font-size:10px;color:var(--text-muted)">' + td.months + '</span>' +
            '</button>'
          ).join('') +
        '</div>' +
        '<div style="margin-top:8px">' +
          '<button class="btn btn-sm" style="width:100%;justify-content:center;color:var(--text-muted)" onclick="applyTrimTag(null)">Retirer le tag</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer"><button class="btn btn-sm" onclick="this.closest(\'.confirm-overlay\').remove()">Annuler</button></div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function applyTrimTag(qid) {
  document.querySelector('.confirm-overlay')?.remove();
  const ids = [...catSelected];
  try {
    const batch = db.batch();
    ids.forEach(id => batch.update(db.collection('wines').doc(id), { trimestre: qid || null }));
    await batch.commit();
    catSelected.clear();
    updateCatSelectionUI();
    toast(ids.length + ' vin(s) ' + (qid ? 'tagué(s) ' + qid : 'détagué(s)'));
  } catch (e) { toast('Erreur : ' + e.message, 'error'); }
}

function renderCatalogue() {
  const search = (document.getElementById('catSearch').value || '').toLowerCase();
  const fPays = document.getElementById('catFilterPays').value;
  const fCouleur = document.getElementById('catFilterCouleur').value;
  const fSent = (document.getElementById('catFilterSent') || {}).value || '';
  const fCatTrimestre = (document.getElementById('catFilterTrimestre') || {}).value || '';
  const wrs = getWineRevueStatus();

  const filtered = wines.filter(w => {
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.domaine || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fCouleur && w.couleur !== fCouleur) return false;
    if (fCatTrimestre && w.trimestre !== fCatTrimestre) return false;
    if (fSent) {
      const allPending = Object.values(wrs[w.id] || {}).every(x => x.statut === 'pending');
      if (fSent === 'none' && !allPending) return false;
      if (fSent === 'any' && allPending) return false;
    }
    return true;
  });

  const tbody = document.getElementById('catTableBody');
  document.getElementById('catEmpty').style.display = filtered.length ? 'none' : 'block';
  tbody.innerHTML = filtered.map(w => {
    const sent = Object.values(wrs[w.id] || {}).filter(x => x.statut !== 'pending').length;
    const sentBadge = sent === 0
      ? '<span style="color:var(--text-faint);font-size:11px">–</span>'
      : '<span style="font-size:11px;background:var(--green-bg);color:var(--green-text);padding:2px 7px;border-radius:10px;font-weight:500">' + sent + '/' + REVUES.length + '</span>';
    return '<tr onclick="openEditWineModal(\'' + w.id + '\')">' +
      '<td onclick="event.stopPropagation()"><input type="checkbox" class="cat-row-cb" data-id="' + w.id + '" ' + (catSelected.has(w.id) ? 'checked' : '') + ' onchange="toggleCatSelect(\'' + w.id + '\',this.checked,event)"></td>' +
      '<td>' + esc(w.pays) + '</td>' +
      '<td><strong>' + esc(w.appellation) + '</strong>' +
        (w.lienExterne ? ' <a href="' + esc(w.lienExterne) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="Lien externe" style="margin-left:4px;text-decoration:none;font-size:12px">🔗</a>' : '') +
      '</td>' +
      '<td style="font-size:12px">' + esc(w.nom) + '</td>' +
      '<td>' + couleurBadge(w.couleur) + '</td>' +
      '<td>' + (w.millesime || '') + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted)">' + esc(w.cepage || '') + '</td>' +
      '<td>' + (trimBadge(w.trimestre || '') || '<span style="color:var(--text-faint);font-size:11px">–</span>') + '</td>' +
      '<td>' + sentBadge + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted)">' + fmtDate(w.createdAt) + '</td>' +
      '<td onclick="event.stopPropagation()"><button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + w.id + '\')">Supprimer</button></td>' +
    '</tr>';
  }).join('');
  updateCatSelectionUI();
}

// â”€â”€ ADD WINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function openAddWineModal() {
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header"><div class="modal-title">Ajouter un vin</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<div class="grid-2">' +
        '<div class="field"><label>Pays *</label><input id="aw_pays" placeholder="ex: France"></div>' +
        '<div class="field"><label>Couleur *</label><select id="aw_couleur"><option>Rouge</option><option>Blanc</option><option>Rosé</option><option>Orange</option></select></div>' +
        '<div class="field"><label>Dénomination *</label><input id="aw_nom" placeholder="ex: Alta Colección Cabernet Sauvignon"></div>' +
        '<div class="field"><label>Millésime *</label><input id="aw_mil" placeholder="ex: 2022" type="number" min="1900" max="2030"></div>' +
        '<div class="field"><label>Domaine ou Marque *</label><input id="aw_app" placeholder="ex: Bodega Piedra Negra"></div>' +
        '<div class="field"><label>Cépage</label><input id="aw_cep" placeholder="ex: Cabernet Sauvignon"></div>' +
        '<div class="field"><label>Degré d\'alcool</label><input id="aw_deg" placeholder="ex: 14" type="number" step="0.1" min="0" max="25"></div>' +
      '</div>' +
      '<div class="field"><label>Lien externe</label><input id="aw_link" placeholder="https://... (fiche technique, Dropbox...)"></div>' +
      '<div class="field"><label>Commentaire</label><textarea id="aw_comment" placeholder="Notes internes, observations..."></textarea></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">Annuler</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveWine" onclick="saveWine()">Ajouter</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function saveWine() {
  const pays = document.getElementById('aw_pays').value.trim();
  const nom = document.getElementById('aw_nom').value.trim();
  const millesime = document.getElementById('aw_mil').value.trim();
  const appellation = document.getElementById('aw_app').value.trim();
  if (!pays || !nom || !millesime || !appellation) { toast('Remplissez tous les champs obligatoires.', 'warn'); return; }

  const btn = document.getElementById('btnSaveWine');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  try {
    await db.collection('wines').add({
      pays,
      nom,
      millesime,
      appellation,
      couleur: document.getElementById('aw_couleur').value,
      cepage: document.getElementById('aw_cep').value.trim() || null,
      degre: document.getElementById('aw_deg').value.trim() || null,
      lienExterne: document.getElementById('aw_link').value.trim() || null,
      commentaire: document.getElementById('aw_comment').value.trim() || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal();
    toast('Vin ajouté au catalogue');
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Ajouter';
  }
}

// â”€â”€ EDIT WINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function openEditWineModal(wineId) {
  const w = wines.find(x => x.id === wineId);
  if (!w) return;
  closeModal();

  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header"><div class="modal-title">Modifier – ' + esc(w.nom) + ' ' + (w.millesime || '') + '</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<div class="grid-2">' +
        '<div class="field"><label>Pays *</label><input id="ew_pays" value="' + esc(w.pays || '') + '"></div>' +
        '<div class="field"><label>Couleur *</label><select id="ew_couleur">' +
          ['Rouge','Blanc','Rosé','Orange'].map(c => '<option' + (w.couleur === c ? ' selected' : '') + '>' + c + '</option>').join('') +
        '</select></div>' +
        '<div class="field"><label>Dénomination *</label><input id="ew_nom" value="' + esc(w.nom || '') + '"></div>' +
        '<div class="field"><label>Millésime *</label><input id="ew_mil" value="' + esc(w.millesime || '') + '" type="number" min="1900" max="2030"></div>' +
        '<div class="field"><label>Domaine ou Marque *</label><input id="ew_app" value="' + esc(w.appellation || '') + '"></div>' +
        '<div class="field"><label>Cépage</label><input id="ew_cep" value="' + esc(w.cepage || '') + '"></div>' +
        '<div class="field"><label>Degré d\'alcool</label><input id="ew_deg" value="' + esc(w.degre || '') + '" type="number" step="0.1" min="0" max="25"></div>' +
      '</div>' +
      '<div class="field"><label>Lien externe</label><input id="ew_link" value="' + esc(w.lienExterne || '') + '" placeholder="https://..."></div>' +
      '<div class="field"><label>Commentaire</label><textarea id="ew_comment">' + esc(w.commentaire || '') + '</textarea></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + wineId + '\')">Supprimer</button>' +
      '<div style="flex:1"></div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">Annuler</button>' +
      '<button class="btn btn-sm btn-primary" id="btnUpdateWine" onclick="updateWine(\'' + wineId + '\')">Enregistrer</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function updateWine(wineId) {
  const pays = document.getElementById('ew_pays').value.trim();
  const nom = document.getElementById('ew_nom').value.trim();
  const millesime = document.getElementById('ew_mil').value.trim();
  const appellation = document.getElementById('ew_app').value.trim();
  if (!pays || !nom || !millesime || !appellation) { toast('Remplissez tous les champs obligatoires.', 'warn'); return; }

  const btn = document.getElementById('btnUpdateWine');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  try {
    await db.collection('wines').doc(wineId).update({
      pays,
      nom,
      millesime,
      appellation,
      couleur: document.getElementById('ew_couleur').value,
      cepage: document.getElementById('ew_cep').value.trim() || null,
      degre: document.getElementById('ew_deg').value.trim() || null,
      lienExterne: document.getElementById('ew_link').value.trim() || null,
      commentaire: document.getElementById('ew_comment').value.trim() || null,
    });
    closeModal();
    toast('Vin modifié');
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Enregistrer';
  }
}

function deleteItem(itemId, wineId) {
  confirmModal('Supprimer cet enregistrement ?', async () => {
    try {
      await db.collection('shipmentItems').doc(itemId).delete();
      closeModal();
      setTimeout(() => openWineDetail(wineId), 150);
      toast('Enregistrement supprimé');
    } catch (e) {
      toast('Erreur : ' + e.message, 'error');
    }
  }, 'Supprimer', 'btn-danger');
}

function deleteShipment(shipmentId, wineId) {
  confirmModal('Supprimer cet envoi et tous ses enregistrements ?', async () => {
    try {
      const batch = db.batch();
      shipmentItems.filter(i => i.shipmentId === shipmentId)
        .forEach(i => batch.delete(db.collection('shipmentItems').doc(i.id)));
      batch.delete(db.collection('shipments').doc(shipmentId));
      await batch.commit();
      closeModal();
      setTimeout(() => openWineDetail(wineId), 150);
      toast('Envoi supprimé');
    } catch (e) {
      toast('Erreur : ' + e.message, 'error');
    }
  }, 'Supprimer', 'btn-danger');
}

function deleteWine(id) {
  const hasItems = shipmentItems.some(i => i.wineId === id);
  if (hasItems) { toast('Ce vin a des envois enregistrés et ne peut pas être supprimé.', 'error'); return; }
  confirmModal('Supprimer définitivement ce vin du catalogue ?', async () => {
    try {
      await db.collection('wines').doc(id).delete();
      closeModal();
      toast('Vin supprimé');
    } catch (e) {
      toast('Erreur : ' + e.message, 'error');
    }
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PASTE IMPORT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let parsedPaste = [];

function openPasteModal() {
  parsedPaste = [];
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal modal-lg">' +
    '<div class="modal-header"><div class="modal-title">Import en bloc</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Collez un tableau (Excel ou texte) avec les colonnes :<br>' +
        '<strong>Pays · Domaine ou Marque · Dénomination · Couleur · Millésime · Cépage · Degré · Lien externe · Commentaire</strong><br>' +
        'Séparateur : tabulation ou point-virgule. Une ligne par vin. Les 4 dernières colonnes sont facultatives.</p>' +
      '<div class="field"><textarea class="paste-area" id="pasteInput" rows="7" oninput="parsePaste()" placeholder="France	AOP Bordeaux	Mon Château	Rouge	2022	Merlot	14"></textarea></div>' +
      '<div id="pastePreview"></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">Annuler</button>' +
      '<button class="btn btn-sm btn-primary" id="btnImport" onclick="importPaste()" disabled>Importer</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

function parsePaste() {
  const raw = document.getElementById('pasteInput').value.trim();
  parsedPaste = [];
  if (!raw) { document.getElementById('pastePreview').innerHTML = ''; document.getElementById('btnImport').disabled = true; return; }
  const errors = [];
  raw.split('\n').filter(l => l.trim()).forEach((line, i) => {
    const sep = line.includes('\t') ? '\t' : ';';
    const cols = line.split(sep).map(c => c.trim());
    if (cols.length < 5) { errors.push('Ligne ' + (i + 1) + ' : moins de 5 colonnes'); return; }
    parsedPaste.push({ pays: cols[0], appellation: cols[1], nom: cols[2], couleur: cols[3], millesime: cols[4], cepage: cols[5] || '', degre: cols[6] || '', lienExterne: cols[7] || '', commentaire: cols[8] || '' });
  });
  renderPastePreview(errors);
}

function renderPastePreview(errors) {
  const html = '<div class="paste-preview">' +
    '<div class="paste-row paste-row-header"><span>Pays</span><span>Domaine / Marque</span><span>Dénomination</span><span>Couleur</span><span>Mill.</span><span>Cépage</span><span>Degré</span><span>Lien</span><span>Commentaire</span><span></span></div>' +
    parsedPaste.map((r, i) =>
      '<div class="paste-row">' +
        '<span>' + esc(r.pays) + '</span><span>' + esc(r.appellation) + '</span><span>' + esc(r.nom) + '</span><span>' + couleurBadge(r.couleur) + '</span><span>' + esc(r.millesime) + '</span><span>' + esc(r.cepage) + '</span><span>' + esc(r.degre) + '</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + esc(r.lienExterne) + '">' + esc(r.lienExterne) + '</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + esc(r.commentaire) + '">' + esc(r.commentaire) + '</span>' +
        '<button onclick="parsedPaste.splice(' + i + ',1);renderPastePreview([])" style="background:none;border:none;cursor:pointer;color:var(--text-faint)">&times;</button>' +
      '</div>'
    ).join('') +
    errors.map(e => '<div style="color:var(--red-text);font-size:11px;margin-top:4px">' + e + '</div>').join('') +
    '<div style="font-size:12px;color:var(--text-muted);margin-top:8px">' + parsedPaste.length + ' vin(s) prêt(s) à importer</div>' +
  '</div>';
  document.getElementById('pastePreview').innerHTML = html;
  document.getElementById('btnImport').disabled = parsedPaste.length === 0;
}

async function importPaste() {
  if (!parsedPaste.length) return;
  const btn = document.getElementById('btnImport');
  btn.innerHTML = '<span class="spinner spinner-dark"></span> Import...';
  btn.disabled = true;
  try {
    const batch = db.batch();
    parsedPaste.forEach(r => {
      const ref = db.collection('wines').doc();
      batch.set(ref, {
        pays: r.pays, nom: r.nom, appellation: r.appellation,
        couleur: r.couleur, millesime: r.millesime,
        cepage: r.cepage || null, degre: r.degre || null,
        domaine: null, lienExterne: r.lienExterne || null, commentaire: r.commentaire || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();
    closeModal();
    toast('✓ ' + parsedPaste.length + ' vins importés');
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Importer';
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ALERTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function renderAlerts() {
  updateAlertBadge();

  const list = document.getElementById('alertsList');
  if (!list) return;

  const tagged = wines.filter(w => w.trimestre);
  if (!tagged.length) {
    list.innerHTML = '<div class="empty" style="padding:24px">Aucun vin tagé avec un trimestre d\'envoi.<br>' +
      '<span style="font-size:12px;color:var(--text-faint)">Taguez vos vins depuis l\'onglet Catalogue.</span></div>';
    return;
  }

  let html = '';
  TRIMESTRES.forEach(td => {
    const group = wines.filter(w => w.trimestre === td.id);
    if (!group.length) return;
    html += '<div style="padding:10px 16px 4px;font-weight:600;font-size:11px;color:var(--text-muted);' +
      'text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);' +
      'display:flex;align-items:center;gap:8px">' +
      td.label + ' <span style="font-weight:400;font-size:10px;text-transform:none">(' + td.months + ')</span>' +
      trimBadge(td.id) + '</div>';
    group.forEach(w => {
      const sent = isWineSent(w.id);
      const state = getTrimestreState(td.id, sent);
      const end = getTrimestreEnd(td.id);
      const daysLeft = end ? Math.floor((end - new Date()) / 86400000) : null;
      let rowBg = '', dotColor = 'var(--text-faint)';
      if (state === 'overdue')  { rowBg = '#fee2e214'; dotColor = 'var(--red-text,#ef4444)'; }
      else if (state === 'warning') { rowBg = '#fef3cd14'; dotColor = 'var(--amber-text,#f59e0b)'; }
      else if (state === 'sent') { dotColor = 'var(--green-text,#10b981)'; }
      let tag = '';
      if (state === 'overdue') tag = '<span class="deadline-tag deadline-urgent">Expiré</span>';
      else if (state === 'warning') tag = '<span class="deadline-tag deadline-soon">J-' + daysLeft + '</span>';
      else if (state === 'sent') tag = '<span class="deadline-tag" style="background:var(--green-bg);color:var(--green-text)">Envoyé</span>';
      html += '<div class="alert-item"' + (rowBg ? ' style="background:' + rowBg + '"' : '') +
        ' onclick="openWineDetail(\'' + w.id + '\')">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:' + dotColor + ';flex-shrink:0"></div>' +
          '<div>' +
            '<div style="font-size:13px;font-weight:500">' + esc(w.appellation) + ' ' + (w.millesime || '') + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted)">' + esc(w.pays) + (w.nom ? ' · ' + esc(w.nom) : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div>' + tag + '</div>' +
      '</div>';
    });
  });
  list.innerHTML = html;
}
function openHelpModal() {
  const sections = [
    { num:'1', title:'Connexion', steps:[
      'Saisissez le mot de passe fourni par l\'administrateur. La session reste active dans l\'onglet.',
    ]},
    { num:'2', title:'Navigation — 3 onglets', steps:[
      '<strong>📋 Tracker</strong> — vue principale de tous vos envois : statuts, notes, tri, filtres.',
      '<strong>🍷 Catalogue</strong> — liste de tous vos vins : ajout, import en bloc, suppression, taguage trimestre.',
      '<strong>⚠️ Alertes</strong> — vue par trimestre des vins à envoyer avec code couleur.',
    ]},
    { num:'3', title:'Catalogue — gérer vos vins', steps:[
      '<strong>+ Ajouter un vin</strong> — remplissez Pays, Domaine/Marque, Dénomination, Couleur, Millésime (obligatoires). Champs optionnels : Cépage, Degré, Lien externe, Commentaire.',
      '<strong>📋 Import bloc</strong> — collez un tableau Excel. Ordre : Pays · Domaine · Dénomination · Couleur · Millésime · Cépage · Degré · Lien · Commentaire.',
      '<strong>Sélection groupée</strong> — cochez des vins pour faire apparaître <em>Supprimer (N)</em> et <em>Taguer (N)</em>. La case en en-tête sélectionne tout.',
    ]},
    { num:'4', title:'Trimestres — tagger les vins', steps:[
      'Sélectionnez des vins dans le Catalogue, cliquez <strong>Taguer (N)</strong>, choisissez le trimestre :',
      '<span style="display:inline-flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
        ['Q1 Jan–Mars','Q2 Avr–Juin','Q3 Juil–Sept','Q4 Oct–Déc'].map((l,i) => {
          const c=['#3b82f6','#10b981','#f59e0b','#8b5cf6'][i], q=['Q1','Q2','Q3','Q4'][i];
          return '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:'+c+'22;color:'+c+';border:1px solid '+c+'44"><strong>'+q+'</strong> '+l.slice(3)+'</span>';
        }).join('') +
      '</span>',
      'Fin de trimestre : 31/03 · 30/06 · 30/09 · 31/12. Pour retirer un tag : <em>Retirer le tag</em> dans le modal.',
    ]},
    { num:'5', title:'Créer un envoi', steps:[
      'Dans le Tracker, cliquez <strong>+ Nouvel envoi</strong>.',
      '<strong>Étape 1</strong> — Sélectionnez un ou plusieurs vins (recherche disponible).',
      '<strong>Étape 2</strong> — Cochez les revues ciblées : WS, WE, Vinous, JS, WA, W&S, Decanter.',
      '<strong>Étape 3</strong> — Renseignez la date d\'envoi (obligatoire), tracking et intermédiaire (optionnels).',
    ]},
    { num:'6', title:'Statuts de suivi', steps:[
      'Cliquez sur une ligne du Tracker pour ouvrir la fiche vin, puis sur le crayon d\'un enregistrement.',
      '<span style="display:inline-flex;gap:8px;flex-wrap:wrap;margin-top:2px">' +
        [['envoyé','#eaf3de','#3b6d11'],['reçu','#e6f1fb','#185fa5'],['noté','#eeedfe','#534ab7']].map(([s,bg,c]) =>
          '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:'+bg+';color:'+c+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</span>'
        ).join('') +
      '</span>',
      'Pour <strong>Noté</strong> : saisissez la note reçue (ex: 92). Un vin est "envoyé" dès qu\'un enregistrement a le statut Envoyé, Reçu ou Noté.',
      'Suppression possible : enregistrement individuel (icône poubelle) ou envoi entier depuis la fiche vin.',
    ]},
    { num:'7', title:'Alertes — code couleur', steps:[
      'L\'onglet Alertes affiche les vins tagués organisés par trimestre.',
      '<span style="display:inline-flex;flex-direction:column;gap:5px;margin-top:2px">' +
        [['#9e9890','Normal — plus de 30 jours avant la fin du trimestre'],
         ['#f59e0b','Orange — 30 jours ou moins avant la fin du trimestre'],
         ['#e24b4a','Rouge — trimestre terminé, vin non envoyé'],
         ['#3b6d11','Vert — vin envoyé (Envoyé / Reçu / Noté)']].map(([c,l]) =>
          '<span style="display:flex;align-items:center;gap:8px;font-size:12px"><span style="width:8px;height:8px;border-radius:50%;background:'+c+';flex-shrink:0"></span>'+l+'</span>'
        ).join('') +
      '</span>',
    ]},
    { num:'8', title:'Tracker — tri et filtres', steps:[
      '<strong>Tri</strong> — cliquez sur un en-tête de colonne (Pays, Domaine, Dénomination, Mill., Couleur, Note). Un 2ème clic inverse l\'ordre.',
      '<strong>Filtres</strong> — Recherche texte · Pays · Revue · Statut · Trimestre, tous combinables.',
      '<strong>Vue tableau / cartes</strong> — boutons ▤ / ⊞ en haut à droite de la barre de filtres.',
    ]},
    { num:'9', title:'Export CSV', steps:[
      'Cliquez <strong>⬇ Export CSV</strong> dans le Tracker pour télécharger l\'ensemble des données (catalogue + statuts + notes par revue). Compatible Excel et Google Sheets.',
    ]},
  ];

  const body = sections.map(s =>
    '<div style="margin-bottom:20px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border)">' +
        '<div style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + s.num + '</div>' +
        '<div style="font-size:13px;font-weight:600">' + s.title + '</div>' +
      '</div>' +
      s.steps.map(st =>
        '<div style="display:flex;gap:10px;margin-bottom:7px;align-items:flex-start">' +
          '<div style="width:5px;height:5px;border-radius:50%;background:var(--border-strong,#ccc);margin-top:7px;flex-shrink:0"></div>' +
          '<div style="font-size:12px;color:var(--text-muted);line-height:1.6">' + st + '</div>' +
        '</div>'
      ).join('') +
    '</div>'
  ).join('');

  const html = '<div class="modal-overlay" onclick="if(event.target===this)closeModal()">' +
    '<div class="modal modal-lg">' +
      '<div class="modal-header">' +
        '<div class="modal-title">Guide d\'utilisation — Press Tracker</div>' +
        '<button class="btn btn-sm" onclick="closeModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' + body + '</div>' +
      '<div class="modal-footer"><button class="btn btn-sm btn-primary" onclick="closeModal()">Fermer</button></div>' +
    '</div></div>';
  document.querySelector('.modal-overlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function exportCSV() {
  const wrs = getWineRevueStatus();
  const header = ['Pays','Domaine ou Marque','Dénomination','Millésime','Couleur','Cépage','Degré','Lien externe','Commentaire'].concat(
    REVUES.flatMap(r => [r.full + ' statut', r.full + ' note'])
  );
  const rows = wines.map(w => [
    w.pays, w.nom, w.appellation, w.millesime || '', w.couleur,
    w.cepage || '', w.degre || '', w.lienExterne || '', w.commentaire || ''
  ].concat(
    REVUES.flatMap(r => { const i = wrs[w.id] && wrs[w.id][r.id]; return [i ? i.statut : 'pending', i ? i.note : '']; })
  ));
  const csv = [header, ...rows].map(r => r.map(c => '"' + String(c || '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,ï»¿' + encodeURIComponent(csv);
  a.download = 'press_tracker_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EVENT BINDINGS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

document.getElementById('btnLogin').addEventListener('click', doLogin);
document.getElementById('pwdInput').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('btnLogout').addEventListener('click', doLogout);
document.getElementById('btnExport').addEventListener('click', exportCSV);
document.getElementById('btnNewShipment').addEventListener('click', () => openShipmentModal());
document.getElementById('btnAddWine').addEventListener('click', openAddWineModal);
document.getElementById('btnPaste').addEventListener('click', openPasteModal);
document.getElementById('vbtnTable').addEventListener('click', () => setTrackerView('table'));
document.getElementById('vbtnCard').addEventListener('click', () => setTrackerView('card'));
document.getElementById('trackerSearch').addEventListener('input', renderTracker);
document.getElementById('filterPays').addEventListener('change', renderTracker);
document.getElementById('filterRevue').addEventListener('change', renderTracker);
document.getElementById('filterStatut').addEventListener('change', renderTracker);
document.getElementById('catSearch').addEventListener('input', renderCatalogue);
document.getElementById('catFilterPays').addEventListener('change', renderCatalogue);
document.getElementById('catFilterCouleur').addEventListener('change', renderCatalogue);
document.getElementById('catFilterSent').addEventListener('change', renderCatalogue);
document.getElementById('catFilterTrimestre').addEventListener('change', renderCatalogue);
document.getElementById('filterTrimestre').addEventListener('change', renderTracker);

document.addEventListener('input', e => { if (e.target.closest && e.target.closest('.modal')) modalDirty = true; });
document.addEventListener('change', e => { if (e.target.closest && e.target.closest('.modal')) modalDirty = true; });

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768 && trackerView === 'table') setTrackerView('card');
});

// Auto-login
if (sessionStorage.getItem('pt_auth') === '1') {
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('theApp').style.display = 'flex';
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
