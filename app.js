// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

const REVUES = [
  { id: 'ws',  label: 'WS',     full: 'Wine Spectator' },
  { id: 'we',  label: 'WE',     full: 'Wine Enthusiast' },
  { id: 'v',   label: 'Vinous', full: 'Vinous' },
  { id: 'js',  label: 'JS',     full: 'James Suckling' },
  { id: 'wa',  label: 'WA',     full: 'Wine Advocate' },
  { id: 'ws2', label: 'W&S',    full: 'Wine & Spirits' },
  { id: 'd',   label: 'Dec.',   full: 'Decanter' },
];

let db;
let wines = [];
let shipments = [];
let shipmentItems = [];
let trackerView = 'table';
let unsubWines, unsubShipments, unsubItems;

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// FIREBASE INIT & REALTIME
// ═══════════════════════════════════════════════════════════

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
    if (loaded.items) { buildFilters(); renderAll(); }
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

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

let modalDirty = false;

function closeModal() {
  document.querySelector('.modal-overlay')?.remove();
  modalDirty = false;
}

function safeCloseModal() {
  if (modalDirty && !confirm('Des modifications non enregistrées seront perdues. Continuer ?')) return;
  closeModal();
}

function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

function fmtDate(d) {
  if (!d) return '—';
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

// ═══════════════════════════════════════════════════════════
// WINE-REVUE STATUS MATRIX
// ═══════════════════════════════════════════════════════════

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

function getAlerts(days) {
  days = days || 30;
  const wrs = getWineRevueStatus();
  const alerts = [];
  wines.forEach(w => {
    REVUES.forEach(r => {
      const info = wrs[w.id] && wrs[w.id][r.id];
      if (!info || !info.deadline || info.statut === 'noté') return;
      const d = daysUntil(info.deadline);
      if (d !== null && (days === 'all' || d <= parseInt(days))) {
        alerts.push({ wine: w, revue: r, days: d, deadline: info.deadline, statut: info.statut });
      }
    });
  });
  return alerts.sort((a, b) => a.days - b.days);
}

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// TRACKER
// ═══════════════════════════════════════════════════════════

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
  const wrs = getWineRevueStatus();
  const alerts30 = getAlerts(30);

  const filtered = wines.filter(w => {
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.domaine || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fRevue && wrs[w.id] && wrs[w.id][fRevue] && wrs[w.id][fRevue].statut === 'pending') return false;
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
  document.getElementById('statAlerts').textContent = alerts30.length;
  ['alert-badge', 'alert-badge-m'].forEach(id => {
    const ab = document.getElementById(id);
    if (ab) { ab.textContent = alerts30.length; ab.style.display = alerts30.length ? 'inline' : 'none'; }
  });

  const c = document.getElementById('trackerContent');
  if (!filtered.length) { c.innerHTML = '<div class="empty">Aucun vin trouvé.</div>'; return; }

  if (window.innerWidth <= 768 && trackerView === 'table') {
    setTrackerView('card');
    return;
  }

  if (trackerView === 'table') {
    c.innerHTML = '<div class="tbl-wrap"><table>' +
      '<thead><tr><th>Pays</th><th>Vin</th><th>Appellation</th><th>Mill.</th><th>Couleur</th>' +
      REVUES.map(r => '<th>' + r.label + '</th>').join('') + '</tr></thead><tbody>' +
      filtered.map(w => {
        const hasAlert = alerts30.some(a => a.wine.id === w.id);
        return '<tr onclick="openWineDetail(\'' + w.id + '\')"' + (hasAlert ? ' style="background:#faeeda22"' : '') + '>' +
          '<td>' + esc(w.pays) + '</td>' +
          '<td><strong>' + esc(w.nom) + '</strong>' + (w.domaine ? '<br><span style="color:var(--text-muted);font-size:11px">' + esc(w.domaine) + '</span>' : '') + '</td>' +
          '<td style="font-size:11px">' + esc(w.appellation) + '</td>' +
          '<td>' + (w.millesime || '') + '</td>' +
          '<td>' + couleurBadge(w.couleur) + '</td>' +
          REVUES.map(r => {
            const info = wrs[w.id] && wrs[w.id][r.id];
            if (!info || info.statut === 'pending') return '<td><span style="color:var(--text-faint)">—</span></td>';
            if (info.note) return '<td>' + statutBadge('noté') + ' <span class="note-pill">' + esc(info.note) + '</span></td>';
            const d = info.deadline ? daysUntil(info.deadline) : null;
            const tag = d !== null && d <= 30 ? '<span class="deadline-tag ' + (d <= 7 ? 'deadline-urgent' : 'deadline-soon') + '">J-' + d + '</span>' : '';
            return '<td>' + statutBadge(info.statut) + ' ' + tag + '</td>';
          }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  } else {
    c.innerHTML = '<div class="card-grid">' + filtered.map(w => {
      const hasAlert = alerts30.some(a => a.wine.id === w.id);
      return '<div class="wine-card' + (hasAlert ? ' alert-card' : '') + '" onclick="openWineDetail(\'' + w.id + '\')">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
        '<div><div class="card-name">' + esc(w.nom) + ' ' + (w.millesime || '') + '</div>' +
        '<div class="card-meta">' + esc(w.appellation) + ' · ' + esc(w.pays) + (w.domaine ? ' · ' + esc(w.domaine) : '') + '</div></div>' +
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

// ═══════════════════════════════════════════════════════════
// WINE DETAIL MODAL
// ═══════════════════════════════════════════════════════════

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
      '<div class="modal-title">' + esc(w.nom) + ' ' + (w.millesime || '') + ' — ' + esc(w.pays) + '</div>' +
      '<button class="btn btn-sm" onclick="closeModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">' +
        couleurBadge(w.couleur) +
        '<span style="font-size:13px;color:var(--text-muted)">' + esc(w.appellation) + '</span>' +
        (w.domaine ? '<span style="font-size:12px;color:var(--text-faint)">' + esc(w.domaine) + '</span>' : '') +
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
              (info && info.statut !== 'pending' && info.itemId ? '<button class="btn btn-sm" onclick="openEditItem(\'' + info.itemId + '\',\'' + wineId + '\')">✏</button>' : '') +
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
            '<span style="font-size:11px;color:var(--text-muted)">' + esc(s.tracking || '') + (s.intermediaire ? ' · ' + esc(s.intermediaire) : '') + '</span>' +
          '</div>' +
          items.map(i => {
            const rev = REVUES.find(r => r.id === i.revueId);
            return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-top:4px;flex-wrap:wrap">' +
              '<span style="color:var(--text-muted);min-width:100px">' + (rev ? rev.full : i.revueId) + '</span>' +
              statutBadge(i.statut) +
              (i.note ? '<span class="note-pill">' + esc(i.note) + '</span>' : '') +
              '<button class="btn btn-sm" onclick="openEditItem(\'' + i.id + '\',\'' + wineId + '\')">✏</button>' +
            '</div>';
          }).join('') +
        '</div>';
      }).join('') : '<div style="color:var(--text-faint);font-size:13px">Aucun envoi enregistré.</div>') +
    '</div>' +
    '<div class="modal-footer" style="flex-wrap:wrap">' +
      '<button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + wineId + '\')">Supprimer</button>' +
      '<button class="btn btn-sm" onclick="closeModal();openEditWineModal(\'' + wineId + '\')">✏ Modifier le vin</button>' +
      '<div style="flex:1"></div>' +
      '<button class="btn btn-sm" onclick="closeModal()">Fermer</button>' +
      '<button class="btn btn-sm btn-primary" onclick="closeModal();openShipmentModal(\'' + wineId + '\')">+ Nouvel envoi</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

// ═══════════════════════════════════════════════════════════
// EDIT SHIPMENT ITEM
// ═══════════════════════════════════════════════════════════

function openEditItem(itemId, wineId) {
  const item = shipmentItems.find(i => i.id === itemId);
  if (!item) return;
  const w = wines.find(x => x.id === item.wineId);
  const r = REVUES.find(x => x.id === item.revueId);
  closeModal();

  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header">' +
      '<div class="modal-title">Modifier — ' + esc(w ? w.nom : '') + ' / ' + (r ? r.full : '') + '</div>' +
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
        '<div class="field"><label>Deadline</label><input type="date" id="ei_deadline" value="' + (item.deadline || '') + '"></div>' +
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
      deadline: document.getElementById('ei_deadline').value || null,
      dateReception: document.getElementById('ei_recep').value || null,
      commentaire: document.getElementById('ei_comment').value || null,
    });
    closeModal();
    toast('Modifications enregistrées');
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    alert('Erreur : ' + e.message);
    btn.disabled = false;
    btn.textContent = 'Enregistrer';
  }
}

// ═══════════════════════════════════════════════════════════
// SHIPMENT MODAL (NOUVEL ENVOI)
// ═══════════════════════════════════════════════════════════

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
      '<div id="sh_deadlines_wrap" style="display:none;margin-top:12px">' +
        '<div class="section-title">Deadlines par revue</div>' +
        '<div id="sh_deadlines" class="grid-2" style="gap:8px"></div>' +
      '</div>' +
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
  renderDeadlines();
}

function renderDeadlines() {
  const wrap = document.getElementById('sh_deadlines_wrap');
  if (!wrap) return;
  if (!selectedRevues.size) { wrap.style.display = 'none'; return; }
  const current = {};
  [...selectedRevues].forEach(rid => {
    const el = document.getElementById('sh_dl_' + rid);
    if (el) current[rid] = el.value;
  });
  wrap.style.display = 'block';
  document.getElementById('sh_deadlines').innerHTML = [...selectedRevues].map(rid => {
    const r = REVUES.find(x => x.id === rid);
    return '<div class="field" style="margin-bottom:8px"><label>' + r.full + '</label>' +
      '<input type="date" id="sh_dl_' + rid + '" value="' + (current[rid] || '') + '"></div>';
  }).join('');
}

function updateShipmentCounts() {
  const wc = document.getElementById('wineCount');
  if (wc) wc.textContent = '(' + selectedWines.size + ' sélectionné' + (selectedWines.size > 1 ? 's' : '') + ')';
  const sm = document.getElementById('shipmentSummary');
  if (sm) sm.textContent = selectedWines.size + ' vin(s) · ' + selectedRevues.size + ' revue(s)';
}

async function saveShipment() {
  if (!selectedWines.size) { alert('Sélectionnez au moins un vin.'); return; }
  if (!selectedRevues.size) { alert('Sélectionnez au moins une revue.'); return; }
  const date = document.getElementById('sh_date').value;
  if (!date) { alert("La date d'envoi est obligatoire."); return; }

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
        const dlEl = document.getElementById('sh_dl_' + rid);
        batch.set(ref, {
          shipmentId: shipRef.id,
          wineId: wid,
          revueId: rid,
          statut: 'envoyé',
          note: null,
          deadline: (dlEl && dlEl.value) || null,
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
    alert('Erreur : ' + e.message);
    btn.disabled = false;
    btn.textContent = "Enregistrer l'envoi";
  }
}

// ═══════════════════════════════════════════════════════════
// CATALOGUE
// ═══════════════════════════════════════════════════════════

function renderCatalogue() {
  const search = (document.getElementById('catSearch').value || '').toLowerCase();
  const fPays = document.getElementById('catFilterPays').value;
  const fCouleur = document.getElementById('catFilterCouleur').value;
  const fSent = (document.getElementById('catFilterSent') || {}).value || '';
  const wrs = getWineRevueStatus();

  const filtered = wines.filter(w => {
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.domaine || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fCouleur && w.couleur !== fCouleur) return false;
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
      ? '<span style="color:var(--text-faint);font-size:11px">—</span>'
      : '<span style="font-size:11px;background:var(--green-bg);color:var(--green-text);padding:2px 7px;border-radius:10px;font-weight:500">' + sent + '/' + REVUES.length + '</span>';
    return '<tr onclick="openEditWineModal(\'' + w.id + '\')">' +
      '<td>' + esc(w.pays) + '</td>' +
      '<td><strong>' + esc(w.nom) + '</strong>' +
        (w.domaine ? '<br><span style="font-size:11px;color:var(--text-muted)">' + esc(w.domaine) + '</span>' : '') +
        (w.lienExterne ? ' <a href="' + esc(w.lienExterne) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="Lien externe" style="margin-left:4px;text-decoration:none;font-size:12px">🔗</a>' : '') +
      '</td>' +
      '<td style="font-size:12px">' + esc(w.appellation) + '</td>' +
      '<td>' + couleurBadge(w.couleur) + '</td>' +
      '<td>' + (w.millesime || '') + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted)">' + esc(w.cepage || '') + '</td>' +
      '<td>' + sentBadge + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted)">' + fmtDate(w.createdAt) + '</td>' +
      '<td onclick="event.stopPropagation()"><button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + w.id + '\')">Supprimer</button></td>' +
    '</tr>';
  }).join('');
}

// ── ADD WINE ──────────────────────────────────────────────

function openAddWineModal() {
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header"><div class="modal-title">Ajouter un vin</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<div class="grid-2">' +
        '<div class="field"><label>Pays *</label><input id="aw_pays" placeholder="ex: France"></div>' +
        '<div class="field"><label>Couleur *</label><select id="aw_couleur"><option>Rouge</option><option>Blanc</option><option>Rosé</option><option>Orange</option></select></div>' +
        '<div class="field"><label>Nom du vin *</label><input id="aw_nom" placeholder="ex: Château Margaux"></div>' +
        '<div class="field"><label>Millésime *</label><input id="aw_mil" placeholder="ex: 2022" type="number" min="1900" max="2030"></div>' +
        '<div class="field"><label>Appellation *</label><input id="aw_app" placeholder="ex: AOP Bordeaux"></div>' +
        '<div class="field"><label>Domaine / Marque</label><input id="aw_dom" placeholder="Optionnel"></div>' +
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
  if (!pays || !nom || !millesime || !appellation) { alert('Remplissez tous les champs obligatoires.'); return; }

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
      domaine: document.getElementById('aw_dom').value.trim() || null,
      cepage: document.getElementById('aw_cep').value.trim() || null,
      degre: document.getElementById('aw_deg').value.trim() || null,
      lienExterne: document.getElementById('aw_link').value.trim() || null,
      commentaire: document.getElementById('aw_comment').value.trim() || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal();
    toast('Vin ajouté au catalogue');
  } catch (e) {
    alert('Erreur : ' + e.message);
    btn.disabled = false;
    btn.textContent = 'Ajouter';
  }
}

// ── EDIT WINE ─────────────────────────────────────────────

function openEditWineModal(wineId) {
  const w = wines.find(x => x.id === wineId);
  if (!w) return;
  closeModal();

  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header"><div class="modal-title">Modifier — ' + esc(w.nom) + ' ' + (w.millesime || '') + '</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<div class="grid-2">' +
        '<div class="field"><label>Pays *</label><input id="ew_pays" value="' + esc(w.pays || '') + '"></div>' +
        '<div class="field"><label>Couleur *</label><select id="ew_couleur">' +
          ['Rouge','Blanc','Rosé','Orange'].map(c => '<option' + (w.couleur === c ? ' selected' : '') + '>' + c + '</option>').join('') +
        '</select></div>' +
        '<div class="field"><label>Nom du vin *</label><input id="ew_nom" value="' + esc(w.nom || '') + '"></div>' +
        '<div class="field"><label>Millésime *</label><input id="ew_mil" value="' + esc(w.millesime || '') + '" type="number" min="1900" max="2030"></div>' +
        '<div class="field"><label>Appellation *</label><input id="ew_app" value="' + esc(w.appellation || '') + '"></div>' +
        '<div class="field"><label>Domaine / Marque</label><input id="ew_dom" value="' + esc(w.domaine || '') + '"></div>' +
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
  if (!pays || !nom || !millesime || !appellation) { alert('Remplissez tous les champs obligatoires.'); return; }

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
      domaine: document.getElementById('ew_dom').value.trim() || null,
      cepage: document.getElementById('ew_cep').value.trim() || null,
      degre: document.getElementById('ew_deg').value.trim() || null,
      lienExterne: document.getElementById('ew_link').value.trim() || null,
      commentaire: document.getElementById('ew_comment').value.trim() || null,
    });
    closeModal();
    toast('Vin modifié');
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    alert('Erreur : ' + e.message);
    btn.disabled = false;
    btn.textContent = 'Enregistrer';
  }
}

async function deleteWine(id) {
  const hasItems = shipmentItems.some(i => i.wineId === id);
  if (hasItems) { alert('Ce vin a des envois enregistrés et ne peut pas être supprimé.'); return; }
  if (!confirm('Supprimer ce vin du catalogue ?')) return;
  try {
    await db.collection('wines').doc(id).delete();
    closeModal();
    toast('Vin supprimé');
  } catch (e) {
    alert('Erreur : ' + e.message);
  }
}

// ═══════════════════════════════════════════════════════════
// PASTE IMPORT
// ═══════════════════════════════════════════════════════════

let parsedPaste = [];

function openPasteModal() {
  parsedPaste = [];
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal modal-lg">' +
    '<div class="modal-header"><div class="modal-title">Import en bloc</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Collez un tableau (Excel ou texte) avec les colonnes :<br>' +
        '<strong>Pays · Appellation · Nom · Couleur · Millésime · Cépage · Degré</strong><br>' +
        'Séparateur : tabulation ou point-virgule. Une ligne par vin.</p>' +
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
    parsedPaste.push({ pays: cols[0], appellation: cols[1], nom: cols[2], couleur: cols[3], millesime: cols[4], cepage: cols[5] || '', degre: cols[6] || '' });
  });
  renderPastePreview(errors);
}

function renderPastePreview(errors) {
  const html = '<div class="paste-preview">' +
    '<div class="paste-row paste-row-header"><span>Pays</span><span>Appellation</span><span>Nom</span><span>Couleur</span><span>Mill.</span><span>Cépage</span><span>Degré</span><span></span></div>' +
    parsedPaste.map((r, i) =>
      '<div class="paste-row">' +
        '<span>' + esc(r.pays) + '</span><span>' + esc(r.appellation) + '</span><span>' + esc(r.nom) + '</span><span>' + couleurBadge(r.couleur) + '</span><span>' + esc(r.millesime) + '</span><span>' + esc(r.cepage) + '</span><span>' + esc(r.degre) + '</span>' +
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
        domaine: null, lienExterne: null, commentaire: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();
    closeModal();
    toast('✓ ' + parsedPaste.length + ' vins importés');
  } catch (e) {
    alert('Erreur : ' + e.message);
    btn.disabled = false;
    btn.textContent = 'Importer';
  }
}

// ═══════════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════════

function renderAlerts() {
  const days = (document.getElementById('alertFilter') || {}).value || '30';
  const alerts = getAlerts(days);
  const c30 = getAlerts(30).length;

  ['alert-badge', 'alert-badge-m'].forEach(id => {
    const ab = document.getElementById(id);
    if (ab) { ab.textContent = c30; ab.style.display = c30 ? 'inline' : 'none'; }
  });

  const list = document.getElementById('alertsList');
  if (!list) return;

  if (!alerts.length) {
    list.innerHTML = '<div class="empty">Aucune deadline dans la période sélectionnée.</div>';
    return;
  }
  list.innerHTML = alerts.map(a => {
    const isOver = a.days < 0;
    const isUrgent = a.days >= 0 && a.days <= 7;
    const dot = isOver ? 'urgency-red' : isUrgent ? 'urgency-amber' : 'urgency-green';
    const tag = isOver ? 'deadline-urgent' : isUrgent ? 'deadline-soon' : 'deadline-ok';
    const label = isOver ? 'Expirée' : a.days === 0 ? 'Auj.' : 'J-' + a.days;
    return '<div class="alert-item" onclick="openWineDetail(\'' + a.wine.id + '\')">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<div class="urgency-dot ' + dot + '"></div>' +
        '<div>' +
          '<div style="font-size:13px;font-weight:500">' + esc(a.wine.nom) + ' ' + (a.wine.millesime || '') + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted)">' + esc(a.wine.pays) + ' · ' + a.revue.full + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        statutBadge(a.statut) +
        '<span style="font-size:12px;color:var(--text-muted)">' + fmtDate(a.deadline) + '</span>' +
        '<span class="deadline-tag ' + tag + '">' + label + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ═══════════════════════════════════════════════════════════
// EXPORT CSV
// ═══════════════════════════════════════════════════════════

function exportCSV() {
  const wrs = getWineRevueStatus();
  const header = ['Pays','Domaine','Nom','Appellation','Millésime','Couleur','Cépage','Degré','Lien externe','Commentaire'].concat(
    REVUES.flatMap(r => [r.full + ' statut', r.full + ' note', r.full + ' deadline'])
  );
  const rows = wines.map(w => [
    w.pays, w.domaine || '', w.nom, w.appellation, w.millesime || '', w.couleur,
    w.cepage || '', w.degre || '', w.lienExterne || '', w.commentaire || ''
  ].concat(
    REVUES.flatMap(r => { const i = wrs[w.id] && wrs[w.id][r.id]; return [i ? i.statut : 'pending', i ? i.note : '', i ? i.deadline : '']; })
  ));
  const csv = [header, ...rows].map(r => r.map(c => '"' + String(c || '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = 'press_tracker_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}

// ═══════════════════════════════════════════════════════════
// EVENT BINDINGS
// ═══════════════════════════════════════════════════════════

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
document.getElementById('alertFilter').addEventListener('change', renderAlerts);

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
