// Logique pure des campagnes annuelles : aucun accès au DOM ni à Firebase (testable avec Node).
// Chargé avant app.js ; dans le navigateur, ces fonctions sont globales.

const LEGACY_CAMPAGNE = 2026;

// Année (campagne) d'un vin. Un vin sans champ `campagne` compte comme 2026.
function wineCampagne(w) {
  return Number(w && w.campagne) || LEGACY_CAMPAGNE;
}

// Années proposées dans le sélecteur : années des vins + année en cours + suivante.
function campagnesDisponibles(allWines, nowYear) {
  const years = new Set([nowYear, nowYear + 1]);
  allWines.forEach(w => years.add(wineCampagne(w)));
  return [...years].sort((a, b) => a - b);
}

// Année à ouvrir : le choix mémorisé s'il existe encore et n'est pas une année déjà passée
// (une archive ne doit pas devenir l'année par défaut), sinon l'année en cours.
function chooseInitialCampagne(stored, available, nowYear) {
  const n = Number(stored);
  return available.includes(n) && n >= nowYear ? n : nowYear;
}

// Vues de l'année : les envois suivent leur vin ; items orphelins et envois vides sont ignorés.
function filterByCampagne(allWines, allShipments, allItems, year) {
  const wines = allWines.filter(w => wineCampagne(w) === year);
  const wineIds = new Set(wines.map(w => w.id));
  const shipmentItems = allItems.filter(i => wineIds.has(i.wineId));
  const shipmentIds = new Set(shipmentItems.map(i => i.shipmentId));
  const shipments = allShipments.filter(s => shipmentIds.has(s.id));
  return { wines, shipments, shipmentItems };
}

// Fin d'un trimestre (t = { endMonth, endDay }) pour l'année de la campagne.
function trimestreEndDate(t, year) {
  return new Date(year, t.endMonth, t.endDay, 23, 59, 59);
}

// 'sent' : envoyé · 'closed' : année passée, non envoyé (archive, sans alerte)
// 'overdue' : trimestre terminé · 'warning' : 30 jours ou moins · 'ok' : sinon
function trimestreStateFor(t, isSent, year, now) {
  if (isSent) return 'sent';
  if (year < now.getFullYear()) return 'closed';
  const daysLeft = Math.floor((trimestreEndDate(t, year) - now) / 86400000);
  if (daysLeft < 0) return 'overdue';
  if (daysLeft <= 30) return 'warning';
  return 'ok';
}

// Critiques ciblés qui n'ont pas encore reçu le vin (statut d'envoi réel : pas « soumis »).
function remainingRevues(w, items, sentStatuts) {
  const sent = new Set(items.filter(i => i.wineId === w.id && sentStatuts.includes(i.statut)).map(i => i.revueId));
  return (w.cibleRevues || []).filter(rid => !sent.has(rid));
}

// Terminé : tous les critiques ciblés sont servis ; sans critique ciblé, dès qu'un envoi est parti.
function isWineDone(w, items, sentStatuts) {
  if ((w.cibleRevues || []).length) return remainingRevues(w, items, sentStatuts).length === 0;
  return items.some(i => i.wineId === w.id && sentStatuts.includes(i.statut));
}

// Début d'un trimestre (le 1er du mois de son premier mois).
function trimestreStartDate(t, year) {
  return new Date(year, t.endMonth - 2, 1);
}

// Répartition des vins tagués de l'année pour la page Planning :
// now = à envoyer maintenant (retards + trimestre en cours), upcoming = trimestres futurs,
// done = terminés, closed = année passée non envoyée. Chaque entrée : { w, t, state, daysLeft, remaining }.
function planningSections(wines, items, year, now, trimestres, sentStatuts) {
  const out = { now: [], upcoming: [], done: [], closed: [] };
  wines.forEach(w => {
    const t = trimestres.find(x => x.id === w.trimestre);
    if (!t) return;
    const done = isWineDone(w, items, sentStatuts);
    const state = trimestreStateFor(t, done, year, now);
    const entry = {
      w, t, state,
      daysLeft: Math.floor((trimestreEndDate(t, year) - now) / 86400000),
      remaining: remainingRevues(w, items, sentStatuts),
    };
    if (done) out.done.push(entry);
    else if (state === 'closed') out.closed.push(entry);
    else if (state === 'overdue' || state === 'warning' || now >= trimestreStartDate(t, year)) out.now.push(entry);
    else out.upcoming.push(entry);
  });
  const rank = e => trimestres.indexOf(e.t);
  const label = e => ((e.w.appellation || '') + ' ' + (e.w.nom || '')).toLowerCase();
  const cmp = (a, b) => rank(a) - rank(b) || label(a).localeCompare(label(b));
  Object.keys(out).forEach(k => out[k].sort(cmp));
  return out;
}

// Un retard est « récent » pendant 15 jours après la fin du trimestre, « ancien » ensuite.
const LATE_WINDOW_DAYS = 15;

// Compteurs d'alerte d'une année : late = retards récents, soon = échéance sous 30 jours,
// old = retards anciens (affichés mais hors alerte). total = late + soon.
// lateQ / soonQ / oldQ : trimestres concernés, dans l'ordre du calendrier.
function trimestreCounts(wines, items, year, now, trimestres, sentStatuts, windowDays) {
  const win = windowDays == null ? LATE_WINDOW_DAYS : windowDays;
  const count = { late: 0, soon: 0, old: 0 };
  const qids = { late: new Set(), soon: new Set(), old: new Set() };
  wines.forEach(w => {
    if (!w.trimestre) return;
    const t = trimestres.find(x => x.id === w.trimestre);
    if (!t) return;
    const st = trimestreStateFor(t, isWineDone(w, items, sentStatuts), year, now);
    let kind = null;
    if (st === 'warning') kind = 'soon';
    else if (st === 'overdue') kind = (now - trimestreEndDate(t, year)) / 86400000 <= win ? 'late' : 'old';
    if (!kind) return;
    count[kind]++;
    qids[kind].add(t.id);
  });
  const rank = id => trimestres.findIndex(x => x.id === id);
  const list = k => [...qids[k]].sort((x, y) => rank(x) - rank(y));
  return {
    late: count.late, soon: count.soon, old: count.old, total: count.late + count.soon,
    lateQ: list('late'), soonQ: list('soon'), oldQ: list('old'),
  };
}

// Une note saisie vaut « noté » (sauf si l'envoi est refusé).
function effectiveStatut(statut, note) {
  return String(note == null ? '' : note).trim() && statut !== 'refusé' ? 'noté' : statut;
}

// Copie de l'item avec son statut cohérent avec sa note (l'item d'origine n'est pas modifié).
function withEffectiveStatut(item) {
  const statut = effectiveStatut(item.statut, item.note);
  return statut === item.statut ? item : Object.assign({}, item, { statut });
}

// Filtres Revue + Statut du Tracker. statuts = { revueId: statut } pour un vin.
// Avec une revue choisie, le statut s'applique à cette revue seulement ;
// « never_sent » = aucun envoi réel (envoyé / reçu / noté / refusé), « soumis » compris.
function matchesRevueStatut(statuts, fRevue, fStatut, sentStatuts) {
  if (fRevue && !fStatut) return (statuts[fRevue] || 'pending') !== 'pending';
  if (!fStatut) return true;
  const scope = fRevue ? [statuts[fRevue] || 'pending'] : Object.values(statuts);
  if (fStatut === 'never_sent') return scope.every(st => !sentStatuts.includes(st));
  return scope.includes(fStatut);
}

if (typeof module !== 'undefined') {
  module.exports = {
    LEGACY_CAMPAGNE, wineCampagne, campagnesDisponibles, chooseInitialCampagne,
    filterByCampagne, trimestreEndDate, trimestreStateFor, trimestreCounts,
    remainingRevues, isWineDone, trimestreStartDate, planningSections,
    LATE_WINDOW_DAYS, effectiveStatut, withEffectiveStatut, matchesRevueStatut,
  };
}
