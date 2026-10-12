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

// ---- Import groupé : colonnes Q et Revues ciblées, doublons ----

// Texte comparable : sans accents, sans casse, espaces réduits.
function normalizeText(s) {
  return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// 'Q1'..'Q4' (Q, T ou chiffre seul acceptés) ; '' si vide ; null si invalide.
function normalizeQ(raw) {
  const t = String(raw == null ? '' : raw).trim();
  if (!t) return '';
  const m = /^[QT]?\s*([1-4])$/i.exec(t);
  return m ? 'Q' + m[1] : null;
}

// Critiques d'une cellule (libellé, identifiant ou nom complet ; séparateurs ; , / +).
// Renvoie les identifiants reconnus (sans doublon) et les noms inconnus.
function parseRevues(raw, revues) {
  const compact = s => normalizeText(s).replace(/[\s.]/g, '');
  const ids = [], unknown = [];
  String(raw == null ? '' : raw).split(/[;,\/+]+/).map(t => t.trim()).filter(Boolean).forEach(tok => {
    const k = compact(tok);
    const r = revues.find(x => compact(x.id) === k || compact(x.label) === k || compact(x.full) === k);
    if (!r) unknown.push(tok);
    else if (!ids.includes(r.id)) ids.push(r.id);
  });
  return { ids, unknown };
}

// Nombre positif tolérant : « 24 », « 24,50 », « $24.50 », « 1 200 », « 1,200 », « 1.200,50 ».
// Renvoie le nombre, '' si vide, null si invalide (texte, négatif).
function parseAmount(raw) {
  if (typeof raw === 'number') return isFinite(raw) && raw >= 0 ? raw : null;
  let t = String(raw == null ? '' : raw).replace(/[\s\u00a0$]/g, '');
  if (!t) return '';
  if (!/^[0-9.,]+$/.test(t)) return null;
  const lastDot = t.lastIndexOf('.'), lastComma = t.lastIndexOf(',');
  if (lastDot >= 0 && lastComma >= 0) {
    const dec = lastDot > lastComma ? '.' : ',';
    const thou = dec === '.' ? ',' : '.';
    t = t.split(thou).join('').replace(dec, '.');
  } else if (lastDot >= 0 || lastComma >= 0) {
    const sep = lastComma >= 0 ? ',' : '.';
    const parts = t.split(sep);
    if (parts.length > 2) {
      if (!parts.slice(1).every(p => p.length === 3)) return null;
      t = parts.join('');
    } else if (sep === ',' && parts[1].length === 3 && parts[0].length >= 1 && parts[0].length <= 3 && parts[0] !== '0') {
      t = parts.join('');
    } else {
      t = parts.join('.');
    }
  }
  const v = Number(t);
  return isNaN(v) ? null : v;
}

// COLA : 'oui' / 'non' ; '' si vide ; null si invalide.
function parseCola(raw) {
  const t = normalizeText(raw);
  if (!t) return '';
  if (['oui', 'o', 'yes', 'y', 'si', '1', 'true', 'vrai', 'x'].includes(t)) return 'oui';
  if (['non', 'n', 'no', '0', 'false', 'faux'].includes(t)) return 'non';
  return null;
}

function formatUsPrice(v, locale) {
  if (v == null || v === '') return '';
  const x = Number(v);
  return '$' + x.toLocaleString(locale, { minimumFractionDigits: Number.isInteger(x) ? 0 : 2, maximumFractionDigits: 2 });
}

function formatCount(v, locale) {
  if (v == null || v === '') return '';
  return Number(v).toLocaleString(locale);
}

// Analyse une ligne d'import déjà découpée en colonnes :
// Pays · Domaine · Dénomination · Couleur · Millésime · Cépage · Degré · Lien · Commentaire · Importateur US ·
// U.S. Price · Case Production (9L) · Cases Imported (9L) · COLA · Q · Revues ciblées.
// Renvoie { row } ou { error: { code, value? } } (few_cols, us_price_invalid, case_prod_invalid, cases_imp_invalid,
// cola_invalid, q_invalid, revue_unknown, revues_without_q).
function parseImportLine(cols, revues) {
  if (cols.length < 5) return { error: { code: 'few_cols' } };
  const price = parseAmount(cols[10]);
  if (price === null) return { error: { code: 'us_price_invalid', value: cols[10] } };
  const caseProd = parseAmount(cols[11]);
  if (caseProd === null) return { error: { code: 'case_prod_invalid', value: cols[11] } };
  const casesImp = parseAmount(cols[12]);
  if (casesImp === null) return { error: { code: 'cases_imp_invalid', value: cols[12] } };
  const cola = parseCola(cols[13]);
  if (cola === null) return { error: { code: 'cola_invalid', value: cols[13] } };
  const trimestre = normalizeQ(cols[14]);
  if (trimestre === null) return { error: { code: 'q_invalid', value: cols[14] } };
  // en mode point-virgule, une cellule « WS;WE » est découpée : on recolle toutes les colonnes restantes
  const revuesParsed = parseRevues(cols.slice(15).join(';'), revues);
  if (revuesParsed.unknown.length) return { error: { code: 'revue_unknown', value: revuesParsed.unknown.join(', ') } };
  if (revuesParsed.ids.length && !trimestre) return { error: { code: 'revues_without_q' } };
  return {
    row: {
      pays: cols[0], appellation: cols[1], nom: cols[2], couleur: cols[3], millesime: cols[4],
      cepage: cols[5] || '', degre: cols[6] || '', lienExterne: cols[7] || '', commentaire: cols[8] || '',
      importateurUS: cols[9] || '',
      prixUS: price === '' ? null : price, caseProduction: caseProd === '' ? null : caseProd,
      casesImported: casesImp === '' ? null : casesImp, cola,
      trimestre, cibleRevues: revuesParsed.ids,
    },
  };
}

// Identité d'un vin dans une campagne : Domaine/Marque + Dénomination + Millésime.
function wineKey(w) {
  return [w.appellation, w.nom, w.millesime].map(normalizeText).join('|');
}

// Vin du catalogue qui a la même identité que le candidat ; `exceptId` ignore un vin (celui qu'on modifie).
function findDuplicateWine(candidate, existingWines, exceptId) {
  const k = wineKey(candidate);
  return existingWines.find(w => w.id !== exceptId && wineKey(w) === k);
}

// À la modification d'un vin : un doublon n'est signalé que si l'identité (Domaine + Dénomination + Millésime)
// a changé ET tombe sur un autre vin. Un vin déjà en doublon dans les données reste modifiable.
function findDuplicateOnEdit(current, edited, existingWines) {
  if (wineKey(edited) === wineKey(current)) return undefined;
  return findDuplicateWine(edited, existingWines, current.id);
}

// Champs comparés à l'import : texte, nombres (U.S. Price, caisses), COLA, trimestre et revues ciblées.
const IMPORT_TEXT_FIELDS = ['pays', 'couleur', 'cepage', 'degre', 'lienExterne', 'commentaire', 'importateurUS'];
const IMPORT_NUMBER_FIELDS = ['prixUS', 'caseProduction', 'casesImported'];

// Changements qu'une ligne d'import apporte à un vin déjà présent : { field, from, to }.
// Une cellule remplie et différente remplace la valeur existante ; une cellule vide ne supprime jamais rien.
// Le Domaine/Marque, la Dénomination et le Millésime (clé du vin) ne sont jamais modifiés.
function importChanges(existing, row) {
  const out = [];
  const txt = v => String(v == null ? '' : v).trim();
  const has = v => v != null && v !== '';
  IMPORT_TEXT_FIELDS.forEach(f => {
    const to = txt(row[f]);
    if (to && to !== txt(existing[f])) out.push({ field: f, from: txt(existing[f]), to });
  });
  IMPORT_NUMBER_FIELDS.forEach(f => {
    if (has(row[f]) && (!has(existing[f]) || Number(existing[f]) !== row[f])) {
      out.push({ field: f, from: has(existing[f]) ? Number(existing[f]) : null, to: row[f] });
    }
  });
  if (row.cola && row.cola !== (existing.cola || '')) out.push({ field: 'cola', from: existing.cola || '', to: row.cola });
  if (row.trimestre && row.trimestre !== (existing.trimestre || '')) out.push({ field: 'trimestre', from: existing.trimestre || '', to: row.trimestre });
  if ((row.cibleRevues || []).length) {
    const key = list => [...(list || [])].sort().join(',');
    if (key(row.cibleRevues) !== key(existing.cibleRevues)) out.push({ field: 'cibleRevues', from: existing.cibleRevues || [], to: row.cibleRevues });
  }
  return out;
}

// Champs à écrire dans Firestore pour mettre un vin existant à jour d'après une ligne d'import.
function importPatch(existing, row) {
  const patch = {};
  importChanges(existing, row).forEach(c => { patch[c.field] = c.to; });
  return patch;
}

// Plan d'import : 'new' (à créer), 'exists' (déjà dans le catalogue, avec un éventuel patch de tag),
// 'repeat' (déjà vu plus haut dans la même liste). Un vin existant porte ses `changes` et le `patch` à écrire.
function classifyImport(rows, existingWines) {
  const byKey = new Map();
  existingWines.forEach(w => { const k = wineKey(w); if (!byKey.has(k)) byKey.set(k, w); });
  const seen = new Set();
  return rows.map(row => {
    const k = wineKey(row);
    if (seen.has(k)) return { row, status: 'repeat', existing: null, patch: {}, changes: [] };
    seen.add(k);
    const existing = byKey.get(k);
    if (existing) {
      const changes = importChanges(existing, row);
      const patch = {};
      changes.forEach(c => { patch[c.field] = c.to; });
      return { row, status: 'exists', existing, patch, changes };
    }
    return { row, status: 'new', existing: null, patch: {}, changes: [] };
  });
}

// ---- Export du Catalogue ----

// En-tête de l'export : les 16 colonnes de l'import (même ordre), puis MAD et Envois.
const CATALOGUE_EXPORT_HEADER = ['Pays', 'Domaine ou Marque', 'Dénomination', 'Couleur', 'Millésime', 'Cépage', 'Degré',
  'Lien externe', 'Commentaire', 'Importateur US', 'U.S. Price', 'Case Production (9L)', 'Cases Imported (9L)', 'COLA',
  'Q', 'Revues ciblées', 'MAD', 'Envois'];

// Ligne d'export d'un vin. statuts = { revueId: statut } ; Envois = « servis/ciblés » ou le nombre d'envois sans cible.
function catalogueExportRow(w, statuts, revues, sentStatuts) {
  const cibles = w.cibleRevues || [];
  const label = id => { const r = revues.find(x => x.id === id); return r ? r.label : id; };
  const sentIds = Object.keys(statuts || {}).filter(id => sentStatuts.includes(statuts[id]));
  const envois = cibles.length
    ? cibles.filter(id => sentIds.includes(id)).length + '/' + cibles.length
    : (sentIds.length ? String(sentIds.length) : '');
  return [w.pays || '', w.appellation || '', w.nom || '', w.couleur || '', w.millesime || '', w.cepage || '', w.degre || '',
    w.lienExterne || '', w.commentaire || '', w.importateurUS || '',
    w.prixUS == null ? '' : w.prixUS, w.caseProduction == null ? '' : w.caseProduction, w.casesImported == null ? '' : w.casesImported,
    w.cola === 'oui' ? 'Oui' : w.cola === 'non' ? 'Non' : '',
    w.trimestre || '', cibles.map(label).join(', '), w.mad || '', envois];
}

if (typeof module !== 'undefined') {
  module.exports = {
    LEGACY_CAMPAGNE, wineCampagne, campagnesDisponibles, chooseInitialCampagne,
    filterByCampagne, trimestreEndDate, trimestreStateFor, trimestreCounts,
    remainingRevues, isWineDone, trimestreStartDate, planningSections,
    LATE_WINDOW_DAYS, effectiveStatut, withEffectiveStatut, matchesRevueStatut,
    normalizeText, normalizeQ, parseRevues, parseAmount, parseCola, formatUsPrice, formatCount,
    parseImportLine, wineKey, findDuplicateWine, findDuplicateOnEdit, importChanges, importPatch, classifyImport,
    CATALOGUE_EXPORT_HEADER, catalogueExportRow,
  };
}
