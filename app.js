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

const TRIMESTRES = [
  { id: 'Q1', label: '1er trimestre',  months: 'Jan - Mars',  endMonth: 2,  endDay: 31 },
  { id: 'Q2', label: '2ème trimestre', months: 'Avr - Juin',  endMonth: 5,  endDay: 30 },
  { id: 'Q3', label: '3ème trimestre', months: 'Juil - Sept', endMonth: 8,  endDay: 30 },
  { id: 'Q4', label: '4ème trimestre', months: 'Oct - Déc',   endMonth: 11, endDay: 31 },
];

// ═══════════════════════════════════════════════════════════════════════════
// INTERNATIONALISATION (FR / ES)
// ═══════════════════════════════════════════════════════════════════════════

let LANG = localStorage.getItem('pt_lang') || 'fr';

const TRANSLATIONS = {
fr: {
  login_sub:'Suivi des envois presse', login_label:'Mot de passe', login_btn:'Connexion',
  login_error:'Mot de passe incorrect.', loading:'Chargement des données...', logout:'Déconnexion',
  nav_tracker:'📋 Tracker', nav_catalogue:'🍷 Catalogue', nav_alertes:'📅 Planning',
  page_tracker:'Envois presse', page_catalogue:'Catalogue des vins', page_alertes:'Planning d\'envoi',
  stat_vins:'Vins suivis', stat_vins_envoyes:'Vins envoyés', stat_envois:'Tous les envois', stat_notes:'Notes reçues', stat_deadlines:'⚠ Échéances proches',
  stat_of_catalogue:'du catalogue', stat_never_sent:'jamais envoyé(s)', stat_show_never_sent:'Afficher les vins jamais envoyés', stat_all_sent:'Tous envoyés', filter_never_sent:'Non envoyé', stat_avg:'Moyenne', stat_best:'Meilleure', stat_late:'en retard', stat_old:'retards anciens', stat_soon:'≤ 30 j', stat_none_alert:'Rien à signaler',
  stat_pl_envoye:'Envoyé(s)', stat_pl_recu:'Reçu(s)', stat_pl_soumis:'Soumis', stat_pl_note:'Noté(s)', stat_pl_refuse:'Refusé(s)', stat_goto_alerts:'Voir le planning',
  btn_export:'⬇ Export CSV', btn_new_shipment:'+ Nouvel envoi', btn_add_wine:'+ Ajouter un vin',
  btn_import:'📋 Import groupé', btn_cancel:'Annuler', btn_save:'Enregistrer', btn_add:'Ajouter',
  btn_close:'Fermer', btn_delete:'Supprimer', btn_duplicate:'Dupliquer', btn_edit_wine:'Modifier le vin', btn_modify:'Modifier',
  filter_all_pays:'Tous les pays', filter_all_revues:'Toutes les revues', filter_all_statuts:'Tous statuts',
  filter_all_trim:'Tous trimestres', filter_all_couleurs:'Toutes couleurs', filter_all:'Tous',
  filter_non_soumis:'Jamais envoyé', filter_soumis:'Envoyé',
  filter_search:'Rechercher un vin...', filter_search_cat:'Rechercher...', filter_wines:'Filtrer les vins...',
  statut_note:'Noté', statut_recu:'Reçu', statut_envoye:'Envoyé', statut_pending:'En attente', statut_soumis:'Soumis', statut_refuse:'Refusé',
  st_letter_envoye:'E', st_letter_recu:'R', st_letter_soumis:'S', st_letter_refuse:'X', st_letter_note:'N',
  legend_note:'Note',
  color_rouge:'Rouge', color_blanc:'Blanc', color_rose:'Rosé', color_orange:'Orange',
  lbl_pays:'Pays *', lbl_couleur:'Couleur *', lbl_denom:'Dénomination *', lbl_millesime:'Millésime *',
  lbl_marque:'Domaine ou Marque *', lbl_cepage:'Cépage', lbl_degre:"Degré d'alcool",
  lbl_mad:'MAD (mise à disposition)', lbl_lien:'Lien externe', lbl_comment:'Commentaire', lbl_importateur_us:'Importateur US',
  lbl_statut:'Statut', lbl_note:'Note reçue', lbl_date_recep:'Date réception',
  lbl_date_envoi:"Date d'envoi *", lbl_inter:'Intermédiaire',
  lbl_date_envoi_opt:"Date d'envoi", lbl_date_soumission:'Date de soumission',
  hint_one_date:"Renseignez soit la date d'envoi, soit la date de soumission (une seule des deux, obligatoire).",
  detail_soumis_le:'Soumis le',
  modal_add_wine:'Ajouter un vin', modal_import:'Import groupé', modal_shipment:'Nouvel envoi groupé',
  col_pays:'Pays', col_marque:'Domaine / Marque', col_denom:'Dénomination',
  col_mil:'Mill.', col_couleur:'Couleur', col_millesime:'Millésime', col_cepage:'Cépage',
  detail_statut_revue:'Statut par revue', detail_envois:'Envois',
  detail_recu_le:'Reçu le',
  detail_non_soumis:'Pas encore envoyé', detail_no_envoi:'Aucun envoi enregistré.', detail_envoi_du:'Envoi du',
  alert_empty:"Aucun vin tagé avec un trimestre d'envoi.",
  alert_empty_hint:"Taguez vos vins depuis l'onglet Catalogue.",
  tag_remove:'Retirer le tag',
  legend_title:'Légende', legend_warning:'≤ 30 jours',
  legend_overdue:'Trimestre terminé, non envoyé', legend_sent:'Envoyé / Reçu / Noté', alert_closed:'Clôturé', legend_todo:'À faire', plan_todo:'À faire', plan_now:'À envoyer maintenant', plan_upcoming:'À venir', plan_upcoming_short:'à venir', plan_done:'Terminés', plan_closed:'Non envoyés (année clôturée)', plan_closed_short:'non envoyé(s)', plan_late:'En retard', plan_send:'Envoyer', plan_until:'jusqu\'au', plan_to_send:'à envoyer', plan_n_done:'terminé(s)', plan_nothing:'Rien à envoyer pour le moment.', plan_no_target:'Aucun critique ciblé',
  tag_revues_label:'Critiques ciblés (optionnel)', camp_title:'Campagne (année)', camp_alerts_hint:'alerte(s) sur l\'année en cours', add_into:'Ajout dans la campagne', importing:'Import...', toast_imported:'vin importé|vins importés', import_cols:'Pays · Domaine ou Marque · Dénomination · Couleur · Millésime · Cépage · Degré · Lien externe · Commentaire · Importateur US · U.S. Price · Case Production (9L) · Cases Imported (9L) · COLA · Q · Revues ciblées', import_err_few:'Ligne {n} : moins de 5 colonnes', import_err_q:'Ligne {n} : trimestre « {v} » invalide (attendu Q1 à Q4)', import_err_revue:'Ligne {n} : critique inconnu « {v} » (WS, WE, Vinous, JS, WA, W&S, Dec.)', import_err_revues_q:'Ligne {n} : critiques ciblés sans trimestre (renseignez la colonne Q)', import_col_state:'État', import_state_new:'Nouveau', import_state_fields:'champ modifié|champs modifiés', import_state_same:'identique', import_state_exists:'Déjà présent', import_state_repeat:'Doublon dans la liste', import_rule_us:'U.S. Price en dollars ; caisses en nombre ; COLA : Oui ou Non.', import_rule_imp:'Importateur US automatique d’après le pays si la cellule est vide : France et Argentine → PARDELA USA, Chili → WINESELLERS, Espagne → PARDELA USA (Contracorriente, Harmonia et Campo Eliseo → VINAMERICAS).', import_err_us_price:'Ligne {n} : U.S. Price « {v} » invalide (attendu un nombre positif)', import_err_case_prod:'Ligne {n} : Case Production « {v} » invalide (attendu un nombre positif)', import_err_cases_imp:'Ligne {n} : Cases Imported « {v} » invalide (attendu un nombre positif)', import_err_cola:'Ligne {n} : COLA « {v} » invalide (attendu Oui ou Non)', lbl_us_price:'U.S. Price', lbl_case_prod:'Case Production (9L)', lbl_cases_imp:'Cases Imported (9L)', lbl_cola:'COLA', cola_yes:'Oui', cola_no:'Non', section_us:'Marché US', toast_us_invalid:'U.S. Price et caisses : saisissez un nombre positif.', import_campagne:'Campagne', import_step1:'1. Préparez votre liste', import_step2:'2. Collez vos lignes', import_step3:'3. Vérifiez avant d’importer', import_legend_req:'Trait plein : obligatoire.', import_legend_opt:'Pointillé : facultatif.', import_legend_tag:'Violet : pose les tags automatiquement.', import_rule_q:'Q va de Q1 à Q4. Les revues se séparent par une virgule (WS, WE) et demandent un Q.', import_rule_dup:'Un vin déjà présent dans l’année n’est pas recréé : les cellules remplies remplacent ses valeurs, une cellule vide ne supprime rien.', import_paste_hint:'Collez ici vos lignes depuis Excel (Ctrl+V)', import_lines_pasted:'ligne collée|lignes collées', import_edit:'Modifier', import_chip_new:'nouveau|nouveaux', import_chip_tag:'à mettre à jour', import_chip_skip:'ignoré (déjà présent)|ignorés (déjà présents)', import_status_empty:'Collez au moins une ligne.', import_status_lines:'ligne lue|lignes lues', import_status_errors:'erreur à corriger|erreurs à corriger', import_hover_hint:'Cépage, degré, lien, commentaire et importateur sont importés aussi : survolez une ligne pour les voir.', import_col_wine:'Vin', import_col_revues_short:'Revues', import_wines:'vin|vins', import_and_tag:'et mettre à jour', import_tag_only:'Mettre à jour', import_nothing:'Rien à importer : tous ces vins sont déjà présents et identiques.', toast_import_tagged:'vin mis à jour|vins mis à jour', toast_exported:'vin(s) exporté(s)', toast_import_skipped:'doublon ignoré|doublons ignorés', toast_wine_exists:'Ce vin existe déjà (campagne {y}).',
  edit_sent_summary_title:'Envoyé à',
  tracker_empty:'Aucun vin trouvé.',
  q1_label:'1er trimestre', q2_label:'2ème trimestre', q3_label:'3ème trimestre', q4_label:'4ème trimestre',
  q1_months:'Jan - Mars', q2_months:'Avr - Juin', q3_months:'Juil - Sept', q4_months:'Oct - Déc',
  toast_saved:'Modifications enregistrées', toast_wine_added:'Vin ajouté au catalogue',
  toast_wine_updated:'Vin modifié', toast_wine_deleted:'Vin supprimé', toast_wine_duplicated:'Vin dupliqué', modal_dup_wine:'Dupliquer un vin', dup_from:'Copie de', toast_dup_same:'Cette copie est identique au vin d’origine : modifiez le domaine, la dénomination ou le millésime.', toast_wine_exists_edit:'Un autre vin a déjà ce domaine, cette dénomination et ce millésime (campagne {y}).', toast_select_wine:'Sélectionnez au moins un vin.', toast_select_revue:'Sélectionnez au moins une revue.', saving:'Enregistrement...',
  toast_item_deleted:'Enregistrement supprimé', toast_shipment_deleted:'Envoi supprimé',
  toast_fill_required:'Remplissez tous les champs obligatoires.',
  toast_wine_has_items:'Ce vin a des envois enregistrés et ne peut pas être supprimé.', toast_blocked:'vin(s) avec envois ignoré(s)',
  confirm_unsaved:'Des modifications non enregistrées seront perdues. Continuer ?',
  confirm_delete_item:'Supprimer cet enregistrement ?',
  confirm_delete_shipment:'Supprimer cet envoi et tous ses enregistrements ?',
  confirm_delete_wine:'Supprimer définitivement ce vin du catalogue ?',
  confirm_quit:'Quitter',
  section_wines:'1 · Vins à envoyer', section_revues:'2 · Revues ciblées',
  section_details:"3 · Détails de l'envoi",
  import_btn:'Importer', btn_download_template:'⬇ Télécharger le template Excel',
  guide_title:"Guide d'utilisation - Press Tracker",
  btn_reset_filters:'↺ Réinitialiser', btn_export_xlsx:'⬇ Export Excel',
  modal_edit_shipment:"Modifier l'envoi", toast_shipment_updated:'Envoi modifié',
  lbl_tracking_prefix:'Tracking',
},
es: {
  login_sub:'Seguimiento de envíos de prensa', login_label:'Contraseña', login_btn:'Entrar',
  login_error:'Contraseña incorrecta.', loading:'Cargando datos...', logout:'Cerrar sesión',
  nav_tracker:'📋 Tracker', nav_catalogue:'🍷 Catálogo', nav_alertes:'📅 Planificación',
  page_tracker:'Envíos de prensa', page_catalogue:'Catálogo de vinos', page_alertes:'Planificación de envíos',
  stat_vins:'Vinos seguidos', stat_vins_envoyes:'Vinos enviados', stat_envois:'Todos los envíos', stat_notes:'Notas recibidas', stat_deadlines:'⚠ Plazos próximos',
  stat_of_catalogue:'del catálogo', stat_never_sent:'nunca enviado(s)', stat_show_never_sent:'Mostrar los vinos nunca enviados', stat_all_sent:'Todos enviados', filter_never_sent:'No enviado', stat_avg:'Media', stat_best:'Mejor', stat_late:'atrasado(s)', stat_old:'atrasos antiguos', stat_soon:'≤ 30 d', stat_none_alert:'Nada que señalar',
  stat_pl_envoye:'Enviado(s)', stat_pl_recu:'Recibido(s)', stat_pl_soumis:'Presentado(s)', stat_pl_note:'Evaluado(s)', stat_pl_refuse:'Rechazado(s)', stat_goto_alerts:'Ver la planificación',
  btn_export:'⬇ Exportar CSV', btn_new_shipment:'+ Nuevo envío', btn_add_wine:'+ Añadir un vino',
  btn_import:'📋 Importación agrupada', btn_cancel:'Cancelar', btn_save:'Guardar', btn_add:'Añadir',
  btn_close:'Cerrar', btn_delete:'Eliminar', btn_duplicate:'Duplicar', btn_edit_wine:'Modificar el vino', btn_modify:'Modificar',
  filter_all_pays:'Todos los países', filter_all_revues:'Todas las revistas', filter_all_statuts:'Todos los estados',
  filter_all_trim:'Todos los trimestres', filter_all_couleurs:'Todos los colores', filter_all:'Todos',
  filter_non_soumis:'Nunca enviado', filter_soumis:'Enviado',
  filter_search:'Buscar un vino...', filter_search_cat:'Buscar...', filter_wines:'Filtrar los vinos...',
  statut_note:'Evaluado', statut_recu:'Recibido', statut_envoye:'Enviado', statut_pending:'Pendiente', statut_soumis:'Presentado', statut_refuse:'Rechazado',
  st_letter_envoye:'E', st_letter_recu:'R', st_letter_soumis:'P', st_letter_refuse:'X', st_letter_note:'N',
  legend_note:'Nota',
  color_rouge:'Tinto', color_blanc:'Blanco', color_rose:'Rosado', color_orange:'Naranja',
  lbl_pays:'País *', lbl_couleur:'Color *', lbl_denom:'Denominación *', lbl_millesime:'Añada *',
  lbl_marque:'Dominio o Marca *', lbl_cepage:'Variedad', lbl_degre:'Grado de alcohol',
  lbl_mad:'MAD (puesta a disposición)', lbl_lien:'Enlace externo', lbl_comment:'Comentario', lbl_importateur_us:'Importador EE. UU.',
  lbl_statut:'Estado', lbl_note:'Nota recibida', lbl_date_recep:'Fecha de recepción',
  lbl_date_envoi:'Fecha de envío *', lbl_inter:'Intermediario',
  lbl_date_envoi_opt:'Fecha de envío', lbl_date_soumission:'Fecha de presentación',
  hint_one_date:'Indique la fecha de envío o la fecha de presentación (solo una de las dos, obligatoria).',
  detail_soumis_le:'Presentado el',
  modal_add_wine:'Añadir un vino', modal_import:'Importación agrupada', modal_shipment:'Nuevo envío agrupado',
  col_pays:'País', col_marque:'Dominio / Marca', col_denom:'Denominación',
  col_mil:'Añada', col_couleur:'Color', col_millesime:'Añada', col_cepage:'Variedad',
  detail_statut_revue:'Estado por revista', detail_envois:'Envíos',
  detail_recu_le:'Recibido el',
  detail_non_soumis:'Aún no enviado', detail_no_envoi:'Ningún envío registrado.', detail_envoi_du:'Envío del',
  alert_empty:'Ningún vino etiquetado con un trimestre de envío.',
  alert_empty_hint:'Etiqueta tus vinos desde la pestaña Catálogo.',
  tag_remove:'Quitar etiqueta',
  legend_title:'Leyenda', legend_warning:'≤ 30 días',
  legend_overdue:'Trimestre terminado, no enviado', legend_sent:'Enviado / Recibido / Evaluado', alert_closed:'Cerrado', legend_todo:'Por hacer', plan_todo:'Por hacer', plan_now:'Por enviar ahora', plan_upcoming:'Próximos', plan_upcoming_short:'próximos', plan_done:'Terminados', plan_closed:'No enviados (año cerrado)', plan_closed_short:'no enviado(s)', plan_late:'Atrasado', plan_send:'Enviar', plan_until:'hasta el', plan_to_send:'por enviar', plan_n_done:'terminado(s)', plan_nothing:'Nada que enviar por ahora.', plan_no_target:'Sin crítico objetivo',
  tag_revues_label:'Críticos objetivo (opcional)', camp_title:'Campaña (año)', camp_alerts_hint:'alerta(s) en el año en curso', add_into:'Alta en la campaña', importing:'Importando...', toast_imported:'vino importado|vinos importados', import_cols:'País · Dominio o Marca · Denominación · Color · Añada · Variedad · Grado · Enlace externo · Comentario · Importador EE. UU. · U.S. Price · Case Production (9L) · Cases Imported (9L) · COLA · Q · Revistas objetivo', import_err_few:'Línea {n}: menos de 5 columnas', import_err_q:'Línea {n}: trimestre «{v}» no válido (se espera Q1 a Q4)', import_err_revue:'Línea {n}: crítico desconocido «{v}» (WS, WE, Vinous, JS, WA, W&S, Dec.)', import_err_revues_q:'Línea {n}: críticos objetivo sin trimestre (rellene la columna Q)', import_col_state:'Estado', import_state_new:'Nuevo', import_state_fields:'campo modificado|campos modificados', import_state_same:'idéntico', import_state_exists:'Ya existe', import_state_repeat:'Duplicado en la lista', import_rule_us:'U.S. Price en dólares; cajas en número; COLA: Sí o No.', import_rule_imp:'Importador US automático según el país si la celda está vacía: Francia y Argentina → PARDELA USA, Chile → WINESELLERS, España → PARDELA USA (Contracorriente, Harmonia y Campo Eliseo → VINAMERICAS).', import_err_us_price:'Línea {n}: U.S. Price «{v}» no válido (se espera un número positivo)', import_err_case_prod:'Línea {n}: Case Production «{v}» no válido (se espera un número positivo)', import_err_cases_imp:'Línea {n}: Cases Imported «{v}» no válido (se espera un número positivo)', import_err_cola:'Línea {n}: COLA «{v}» no válido (se espera Sí o No)', lbl_us_price:'U.S. Price', lbl_case_prod:'Case Production (9L)', lbl_cases_imp:'Cases Imported (9L)', lbl_cola:'COLA', cola_yes:'Sí', cola_no:'No', section_us:'Mercado EE. UU.', toast_us_invalid:'U.S. Price y cajas: introduzca un número positivo.', import_campagne:'Campaña', import_step1:'1. Prepare su lista', import_step2:'2. Pegue sus líneas', import_step3:'3. Revise antes de importar', import_legend_req:'Trazo continuo: obligatorio.', import_legend_opt:'Punteado: opcional.', import_legend_tag:'Violeta: aplica las etiquetas automáticamente.', import_rule_q:'Q va de Q1 a Q4. Las revistas se separan con una coma (WS, WE) y requieren un Q.', import_rule_dup:'Un vino ya presente en el año no se vuelve a crear: las celdas rellenas sustituyen sus valores, una celda vacía no borra nada.', import_paste_hint:'Pegue aquí sus líneas desde Excel (Ctrl+V)', import_lines_pasted:'línea pegada|líneas pegadas', import_edit:'Modificar', import_chip_new:'nuevo|nuevos', import_chip_tag:'por actualizar', import_chip_skip:'ignorado (ya existe)|ignorados (ya existen)', import_status_empty:'Pegue al menos una línea.', import_status_lines:'línea leída|líneas leídas', import_status_errors:'error por corregir|errores por corregir', import_hover_hint:'Variedad, grado, enlace, comentario e importador también se importan: pase el cursor sobre una línea para verlos.', import_col_wine:'Vino', import_col_revues_short:'Revistas', import_wines:'vino|vinos', import_and_tag:'y actualizar', import_tag_only:'Actualizar', import_nothing:'Nada que importar: todos estos vinos ya existen y son idénticos.', toast_import_tagged:'vino actualizado|vinos actualizados', toast_exported:'vino(s) exportado(s)', toast_import_skipped:'duplicado ignorado|duplicados ignorados', toast_wine_exists:'Este vino ya existe (campaña {y}).',
  edit_sent_summary_title:'Enviado a',
  tracker_empty:'Ningún vino encontrado.',
  q1_label:'1er trimestre', q2_label:'2º trimestre', q3_label:'3er trimestre', q4_label:'4º trimestre',
  q1_months:'Ene - Mar', q2_months:'Abr - Jun', q3_months:'Jul - Sep', q4_months:'Oct - Dic',
  toast_saved:'Cambios guardados', toast_wine_added:'Vino añadido al catálogo',
  toast_wine_updated:'Vino modificado', toast_wine_deleted:'Vino eliminado', toast_wine_duplicated:'Vino duplicado', modal_dup_wine:'Duplicar un vino', dup_from:'Copia de', toast_dup_same:'Esta copia es idéntica al vino original: cambie el dominio, la denominación o la añada.', toast_wine_exists_edit:'Otro vino ya tiene este dominio, esta denominación y esta añada (campaña {y}).', toast_select_wine:'Seleccione al menos un vino.', toast_select_revue:'Seleccione al menos una revista.', saving:'Guardando...',
  toast_item_deleted:'Registro eliminado', toast_shipment_deleted:'Envío eliminado',
  toast_fill_required:'Complete todos los campos obligatorios.',
  toast_wine_has_items:'Este vino tiene envíos registrados y no se puede eliminar.', toast_blocked:'vino(s) con envíos ignorado(s)',
  confirm_unsaved:'Los cambios no guardados se perderán. ¿Continuar?',
  confirm_delete_item:'¿Eliminar este registro?',
  confirm_delete_shipment:'¿Eliminar este envío y todos sus registros?',
  confirm_delete_wine:'¿Eliminar definitivamente este vino del catálogo?',
  confirm_quit:'Salir',
  section_wines:'1 · Vinos a enviar', section_revues:'2 · Revistas objetivo',
  section_details:'3 · Detalles del envío',
  import_btn:'Importar', btn_download_template:'⬇ Descargar la plantilla Excel',
  guide_title:'Guía de uso - Press Tracker',
  btn_reset_filters:'↺ Restablecer', btn_export_xlsx:'⬇ Exportar Excel',
  modal_edit_shipment:'Modificar el envío', toast_shipment_updated:'Envío modificado',
  lbl_tracking_prefix:'Seguimiento',
},
};

function T(k) { return (TRANSLATIONS[LANG]||TRANSLATIONS.fr)[k] || TRANSLATIONS.fr[k] || k; }

function setLang(l) {
  LANG = l;
  localStorage.setItem('pt_lang', l);
  applyStaticI18n();
  buildFilters();
  renderAll();
}

function applyStaticI18n() {
  const $ = id => document.getElementById(id);
  const setText = (el,t) => { if (el) el.textContent = t; };
  // Login
  setText(document.querySelector('.login-sub'), T('login_sub'));
  setText($('loginError'), T('login_error'));
  const pwdLabel = document.querySelector('.login-box .field label');
  setText(pwdLabel, T('login_label'));
  setText($('btnLogin'), T('login_btn'));
  setText(document.querySelector('#loadingOverlay div:last-child'), T('loading'));
  // Topbar
  setText($('btnLogout'), T('logout'));
  // Desktop nav
  const dNav = $('desktopNav');
  if (dNav) dNav.querySelectorAll('[data-page]').forEach(tab => {
    const p = tab.dataset.page, badge = tab.querySelector('#alert-badge');
    if (p==='tracker') tab.textContent = T('nav_tracker');
    else if (p==='catalogue') tab.textContent = T('nav_catalogue');
    else if (p==='alerts') { tab.textContent = T('nav_alertes') + ' '; if (badge) tab.appendChild(badge); }
  });
  // Mobile nav
  const mNav = $('mobileNav');
  if (mNav) mNav.querySelectorAll('[data-page]').forEach(tab => {
    const p = tab.dataset.page;
    const icon = tab.querySelector('.nav-icon, .nav-alert-icon');
    const nodes = tab.childNodes;
    const last = nodes[nodes.length-1];
    if (last && last.nodeType === 3) {
      if (p==='tracker') last.textContent = 'Tracker';
      else if (p==='catalogue') last.textContent = LANG==='es' ? 'Catálogo' : 'Catalogue';
      else if (p==='alerts') last.textContent = LANG==='es' ? 'Planificación' : 'Planning';
    }
  });
  // Page titles
  setText(document.querySelector('#page-tracker .page-title'), T('page_tracker'));
  setText(document.querySelector('#page-catalogue .page-title'), T('page_catalogue'));
  setText(document.querySelector('#page-alerts .page-title'), T('page_alertes'));
  // Stats labels
  const statKeys = ['stat_vins','stat_vins_envoyes','stat_envois','stat_notes','stat_deadlines'];
  document.querySelectorAll('.stat-label').forEach((el,i) => { if (statKeys[i]) el.innerHTML = T(statKeys[i]); });
  // Buttons
  setText($('btnExport'), T('btn_export'));
  setText($('btnExportXlsx'), T('btn_export_xlsx'));
  setText($('btnExportCatalogue'), T('btn_export_xlsx'));
  setText($('btnNewShipment'), T('btn_new_shipment'));
  setText($('btnAddWine'), T('btn_add_wine'));
  setText($('btnPaste'), T('btn_import'));
  setText($('btnResetTracker'), T('btn_reset_filters'));
  setText($('btnResetCatalogue'), T('btn_reset_filters'));
  // Search placeholders
  const ts = $('trackerSearch'); if (ts) ts.placeholder = T('filter_search');
  const cs = $('catSearch'); if (cs) cs.placeholder = T('filter_search_cat');
  const as = $('alertSearch'); if (as) as.placeholder = T('filter_search');
  // Color filter
  const cSel = $('catFilterCouleur');
  if (cSel && cSel.options.length >= 5) {
    cSel.options[0].text = T('filter_all_couleurs');
    cSel.options[1].text = T('color_rouge');
    cSel.options[2].text = T('color_blanc');
    cSel.options[3].text = T('color_rose');
    cSel.options[4].text = T('color_orange');
  }
  // Statut filter
  const sSel = $('filterStatut');
  if (sSel && sSel.options.length >= 7) {
    sSel.options[0].text = T('filter_all_statuts');
    sSel.options[1].text = T('statut_note');
    sSel.options[2].text = T('statut_recu');
    sSel.options[3].text = T('statut_envoye');
    sSel.options[4].text = T('statut_soumis');
    sSel.options[5].text = T('statut_refuse');
    sSel.options[6].text = T('filter_never_sent');
  }
  // Sent filter
  const sentSel = $('catFilterSent');
  if (sentSel && sentSel.options.length >= 3) {
    sentSel.options[0].text = T('filter_all');
    sentSel.options[1].text = T('filter_non_soumis');
    sentSel.options[2].text = T('filter_soumis');
  }
  // Catalogue table headers
  const catHead = document.querySelector('.cat-table thead tr');
  if (catHead) {
    const ths = catHead.querySelectorAll('th');
    if (ths.length >= 16) {
      ths[1].textContent = T('col_pays');
      ths[2].textContent = T('col_marque');
      ths[3].textContent = T('col_denom');
      ths[4].textContent = T('col_couleur');
      ths[5].textContent = T('col_millesime');
      ths[6].textContent = T('col_cepage');
      ths[7].textContent = 'MAD';
      ths[8].textContent = T('lbl_importateur_us');
      ths[9].textContent = T('lbl_us_price');
      ths[10].textContent = 'Case Prod. (9L)'; ths[10].title = T('lbl_case_prod');
      ths[11].textContent = 'Cases Imp. (9L)'; ths[11].title = T('lbl_cases_imp');
      ths[12].textContent = T('lbl_cola');
      ths[13].textContent = 'Trim.';
      ths[14].textContent = T('detail_envois');
    }
  }
  // Trimestre filters (static options, not built by buildFilters)
  const trimMonths = LANG==='es'
    ? ['Ene-Mar','Abr-Jun','Jul-Sep','Oct-Dic']
    : ['Jan-Mars','Avr-Juin','Juil-Sept','Oct-Déc'];
  [$('filterTrimestre'), $('catFilterTrimestre'), $('alertFilterTrimestre')].forEach(sel => {
    if (!sel || sel.options.length < 5) return;
    sel.options[0].text = T('filter_all_trim');
    ['Q1','Q2','Q3','Q4'].forEach((q,i) => {
      sel.options[i+1].text = q + (sel.id==='catFilterTrimestre' ? ' ('+trimMonths[i]+')' : '');
    });
  });
  const btnResetAlerts = $('btnResetAlerts'); if (btnResetAlerts) btnResetAlerts.textContent = T('btn_reset_filters');
  // Lang toggle active state
  const btnFr = $('btnLangFr'), btnEs = $('btnLangEs');
  if (btnFr) { btnFr.classList.toggle('active', LANG==='fr'); btnFr.style.opacity=''; btnFr.style.fontWeight=''; }
  if (btnEs) { btnEs.classList.toggle('active', LANG==='es'); btnEs.style.opacity=''; btnEs.style.fontWeight=''; }
}



function getTrimestreEnd(qid, year) {
  const t = TRIMESTRES.find(x => x.id === qid);
  if (!t) return null;
  return trimestreEndDate(t, year || currentCampagne);
}

function getTrimestreState(qid, isSent, year) {
  const t = TRIMESTRES.find(x => x.id === qid);
  if (!t) return isSent ? 'sent' : 'ok';
  return trimestreStateFor(t, isSent, year || currentCampagne, new Date());
}

function trimBadge(qid) {
  if (!qid) return '';
  const colors = { Q1: '#3b82f6', Q2: '#10b981', Q3: '#f59e0b', Q4: '#8b5cf6' };
  const c = colors[qid] || '#999';
  return '<span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:10px;' +
    'background:' + c + '22;color:' + c + ';border:1px solid ' + c + '44">' + qid + '</span>';
}

const SENT_STATUTS = ['envoyé','reçu','noté','refusé'];

function isWineSent(wineId) {
  return shipmentItems.some(i => i.wineId === wineId && SENT_STATUTS.includes(i.statut));
}

function getTrimestreAlerts() {
  return trimestreCounts(wines, shipmentItems, currentCampagne, new Date(), TRIMESTRES, SENT_STATUTS).total;
}

let db;
// Données brutes de Firestore, toutes années confondues.
let allWines = [];
let allShipments = [];
let allItems = [];
// Vues de la campagne affichée : tout le reste de l'app lit ces trois variables.
let wines = [];
let shipments = [];
let shipmentItems = [];
let currentCampagne = new Date().getFullYear();
let campagneChosen = false;
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
    else if (col === 'trimestre') { va = a.trimestre || 'Z';              vb = b.trimestre || 'Z'; }
    else if (col === 'importateur'){ va = (a.importateurUS || '').toLowerCase(); vb = (b.importateurUS || '').toLowerCase(); }
    else if (col === 'note') {
      const bestNote = w => Math.max(-1, ...Object.values(wrs[w.id] || {}).map(x => parseFloat(x.note) || -1));
      va = bestNote(a); vb = bestNote(b);
    }
    else return 0;
    return va < vb ? -dir : va > vb ? dir : 0;
  });
}
const CAMPAGNE_STORAGE_KEY = 'pt_campagne';

function storedCampagne() {
  try { return localStorage.getItem(CAMPAGNE_STORAGE_KEY); } catch (e) { return null; }
}

// Recalcule les vues de la campagne affichée à partir des données brutes (sans rendu).
function recomputeCampagneData() {
  const f = filterByCampagne(allWines, allShipments, allItems, currentCampagne);
  wines = f.wines;
  shipments = f.shipments;
  shipmentItems = f.shipmentItems.map(withEffectiveStatut);
}

// Change l'année affichée : mémorise le choix, vide les sélections et ferme les fenêtres
// pour qu'une action de masse ne vise jamais l'autre année.
function setCampagne(year) {
  if (year === currentCampagne) return;
  currentCampagne = year;
  try { localStorage.setItem(CAMPAGNE_STORAGE_KEY, String(year)); } catch (e) {}
  catSelected.clear();
  selectedWines.clear();
  document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
  modalDirty = false;
  recomputeCampagneData();
  buildFilters();
  renderAll();
}

// Boutons d'année ; pastille ambre sur l'année en cours si elle a des alertes pendant qu'on regarde une autre année.
function renderCampagneSwitch() {
  const el = document.getElementById('campagneSwitch');
  if (!el) return;
  const nowYear = new Date().getFullYear();
  const years = campagnesDisponibles(allWines, nowYear);
  const alertsNow = currentCampagne !== nowYear
    ? trimestreCounts(allWines.filter(w => wineCampagne(w) === nowYear), allItems, nowYear, new Date(), TRIMESTRES, SENT_STATUTS).total
    : 0;
  el.title = T('camp_title');
  const select = '<select class="camp-select" aria-label="' + esc(T('camp_title')) + '" onchange="setCampagne(Number(this.value))">' +
    years.map(y => '<option value="' + y + '"' + (y === currentCampagne ? ' selected' : '') + '>' + y + (y === nowYear && alertsNow ? ' ⚠' : '') + '</option>').join('') + '</select>';
  el.innerHTML = years.map(y =>
    '<button class="lang-btn camp-btn' + (y === currentCampagne ? ' active' : '') + '" onclick="setCampagne(' + y + ')">' + y +
    (y === nowYear && alertsNow ? '<span class="camp-dot" title="' + alertsNow + ' ' + esc(T('camp_alerts_hint')) + '"></span>' : '') +
    '</button>'
  ).join('') + select;
}

let unsubWines, unsubShipments, unsubItems;

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();

async function doLogin() {
  const pwd = document.getElementById('pwdInput').value;
  const btn = document.getElementById('btnLogin');
  document.getElementById('loginError').style.display = 'none';
  btn.disabled = true;
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    await auth.signInWithEmailAndPassword(AUTH_EMAIL, pwd);
  } catch (e) {
    document.getElementById('loginError').style.display = 'block';
    btn.disabled = false;
  }
}

function doLogout() {
  if (unsubWines) unsubWines();
  if (unsubShipments) unsubShipments();
  if (unsubItems) unsubItems();
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  const btn = document.getElementById('btnLogin');
  if (btn) btn.disabled = false;
  if (user) {
    document.getElementById('loginWrap').style.display = 'none';
    document.getElementById('theApp').style.display = 'flex';
    initApp();
  } else {
    document.getElementById('loginWrap').style.display = 'flex';
    document.getElementById('theApp').style.display = 'none';
  }
});

// ═══════════════════════════════════════════════════════════
// FIREBASE INIT & REALTIME
// ═══════════════════════════════════════════════════════════

function initApp() {
  document.getElementById('loadingOverlay').style.display = 'flex';
  db = firebase.firestore();

  const loaded = { wines: false, shipments: false, items: false };
  campagneChosen = false;

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
    allWines = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    allWines.sort((a, b) => (a.pays || '').localeCompare(b.pays || '') || (a.nom || '').localeCompare(b.nom || ''));
    if (!campagneChosen) {
      const nowYear = new Date().getFullYear();
      currentCampagne = chooseInitialCampagne(storedCampagne(), campagnesDisponibles(allWines, nowYear), nowYear);
      campagneChosen = true;
    }
    recomputeCampagneData();
    loaded.wines = true;
    checkReady();
    if (loaded.wines && loaded.shipments && loaded.items) { buildFilters(); renderAll(); }
  }, err => { console.error('wines:', err); loaded.wines = true; checkReady(); });

  unsubShipments = db.collection('shipments').onSnapshot(snap => {
    allShipments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    allShipments.sort((a, b) => (b.dateEnvoi || b.dateSoumission || '').localeCompare(a.dateEnvoi || a.dateSoumission || ''));
    recomputeCampagneData();
    loaded.shipments = true;
    checkReady();
  }, err => { console.error('shipments:', err); loaded.shipments = true; checkReady(); });

  unsubItems = db.collection('shipmentItems').onSnapshot(snap => {
    allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    recomputeCampagneData();
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
        '<button class="btn btn-sm" onclick="this.closest(\'.confirm-overlay\').remove()">' + T('btn_cancel') + '</button>' +
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
  confirmModal(T('confirm_unsaved'), closeModal, T('confirm_quit'), 'btn-primary');
}

function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

function fmtDate(d) {
  if (!d) return '-';
  const dt = d.toDate ? d.toDate() : new Date(d);
  return dt.toLocaleDateString(LANG === 'es' ? 'es-ES' : 'fr-FR');
}

function locale() { return LANG === 'es' ? 'es-ES' : 'fr-FR'; }

// Pastille COLA : Oui (vert), Non (gris), vide = tiret.
function colaBadge(v) {
  if (v === 'oui') return '<span class="cola-pill is-yes">' + T('cola_yes') + '</span>';
  if (v === 'non') return '<span class="cola-pill is-no">' + T('cola_no') + '</span>';
  return '<span style="color:var(--text-faint)">-</span>';
}

// Champ numérique de formulaire : null si vide.
function numField(id) {
  const v = document.getElementById(id).value.trim();
  return v === '' ? null : Number(v);
}

// Les quatre champs Marché US de la fiche d'un vin (préfixe aw / ew), valeurs optionnelles.
function usFieldsHTML(prefix, w) {
  w = w || {};
  const val = v => (v == null ? '' : esc(String(v)));
  return '<div class="section-title" style="margin-top:6px">' + T('section_us') + '</div>' +
    '<div class="grid-2">' +
      '<div class="field"><label>' + T('lbl_us_price') + '</label><input id="' + prefix + '_price" type="number" step="0.01" min="0" value="' + val(w.prixUS) + '" placeholder="ex: 24.50"></div>' +
      '<div class="field"><label>' + T('lbl_case_prod') + '</label><input id="' + prefix + '_cprod" type="number" step="1" min="0" value="' + val(w.caseProduction) + '" placeholder="ex: 1200"></div>' +
      '<div class="field"><label>' + T('lbl_cases_imp') + '</label><input id="' + prefix + '_cimp" type="number" step="1" min="0" value="' + val(w.casesImported) + '" placeholder="ex: 300"></div>' +
      '<div class="field"><label>' + T('lbl_cola') + '</label><select id="' + prefix + '_cola"><option value="">-</option>' +
        '<option value="oui"' + (w.cola === 'oui' ? ' selected' : '') + '>' + T('cola_yes') + '</option>' +
        '<option value="non"' + (w.cola === 'non' ? ' selected' : '') + '>' + T('cola_no') + '</option></select></div>' +
    '</div>';
}

// Valeurs Marché US d'un formulaire ; null si une valeur est invalide.
function readUsFields(prefix) {
  const out = {
    prixUS: numField(prefix + '_price'), caseProduction: numField(prefix + '_cprod'), casesImported: numField(prefix + '_cimp'),
    cola: document.getElementById(prefix + '_cola').value || null,
  };
  const bad = ['prixUS', 'caseProduction', 'casesImported'].some(k => out[k] !== null && (isNaN(out[k]) || out[k] < 0));
  return bad ? null : out;
}

function couleurBadge(c) {
  const cl = (c || '').toLowerCase().replace('é', 'e');
  const cm = { 'Rouge': T('color_rouge'), 'Blanc': T('color_blanc'), 'Rosé': T('color_rose'), 'Orange': T('color_orange') };
  return '<span class="cl-' + cl + '">' + (cm[c] || c || '') + '</span>';
}

// Tableau Tracker : statut affiché en bulle (lettre ou note), détail au survol.
const ST_BUBBLE = {
  'envoyé': { key: 'statut_envoye', letter: 'st_letter_envoye' },
  'reçu':   { key: 'statut_recu',   letter: 'st_letter_recu' },
  'soumis': { key: 'statut_soumis', letter: 'st_letter_soumis' },
  'refusé': { key: 'statut_refuse', letter: 'st_letter_refuse' },
  'noté':   { key: 'statut_note',   letter: 'st_letter_note' }
};

function statutBubble(info, revueName) {
  if (!info || info.statut === 'pending') return '<span style="color:var(--text-faint)">-</span>';
  if (info.note) {
    return '<span class="st-bubble badge-noté" title="' + esc(revueName + ' - ' + T('statut_note') + ' : ' + info.note) + '">' + esc(info.note) + '</span>';
  }
  const cfg = ST_BUBBLE[info.statut];
  if (!cfg) return statutBadge(info.statut);
  const title = revueName + ' - ' + T(cfg.key);
  return '<span class="st-bubble badge-' + info.statut + '" title="' + esc(title) + '">' + T(cfg.letter) + '</span>';
}

function trackerLegendHTML() {
  const item = (inner, label) => '<span class="lg-item">' + inner + label + '</span>';
  const bubble = (st, txt) => '<span class="st-bubble badge-' + st + '">' + txt + '</span>';
  return '<div class="tracker-legend">' +
    ['envoyé', 'reçu', 'soumis', 'refusé'].map(st => item(bubble(st, T(ST_BUBBLE[st].letter)), T(ST_BUBBLE[st].key))).join('') +
    item(bubble('noté', '94'), T('legend_note')) +
  '</div>';
}

function statutBadge(st) {
  const map = { 'noté': 'badge-noté', 'envoyé': 'badge-envoyé', 'reçu': 'badge-reçu', 'soumis': 'badge-soumis', 'pending': 'badge-pending', 'refusé': 'badge-refusé' };
  const labels = { 'noté': T('statut_note'), 'envoyé': T('statut_envoye'), 'reçu': T('statut_recu'), 'soumis': T('statut_soumis'), 'pending': T('statut_pending'), 'refusé': T('statut_refuse') };
  return '<span class="badge ' + (map[st] || 'badge-pending') + '">' + (labels[st] || st) + '</span>';
}

function renderAll() {
  renderCampagneSwitch();
  renderTracker();
  renderCatalogue();
  renderAlerts();
  applyStaticI18n();
}

// ═══════════════════════════════════════════════════════════
// WINE-REVUE STATUS MATRIX
// ═══════════════════════════════════════════════════════════

function getWineRevueStatus() {
  const result = {};
  wines.forEach(w => {
    result[w.id] = {};
    REVUES.forEach(r => {
      result[w.id][r.id] = { statut: 'pending', note: '', commentaire: '', dateReception: '', shipmentId: null, itemId: null };
    });
  });
  const order = ['pending', 'soumis', 'envoyé', 'reçu', 'noté', 'refusé'];
  shipmentItems.forEach(item => {
    const wid = item.wineId;
    const rid = item.revueId;
    if (!result[wid] || !result[wid][rid]) return;
    const cur = result[wid][rid];
    if (order.indexOf(item.statut) >= order.indexOf(cur.statut)) {
      result[wid][rid] = {
        statut: item.statut,
        note: item.note || '',
        dateReception: item.dateReception || '',
        commentaire: item.commentaire || '',
        shipmentId: item.shipmentId,
        itemId: item.id
      };
    }
  });
  return result;
}

// getAlerts removed - replaced by getTrimestreAlerts

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════

function buildFilters() {
  const pays = [...new Set(wines.map(w => w.pays).filter(Boolean))].sort();
  ['filterPays', 'catFilterPays', 'alertFilterPays'].forEach(id => {
    const sel = document.getElementById(id);
    const cur = sel.value;
    sel.innerHTML = '<option value="">' + T('filter_all_pays') + '</option>' + pays.map(p => '<option' + (p === cur ? ' selected' : '') + '>' + esc(p) + '</option>').join('');
  });
  ['filterRevue', 'alertFilterCritique'].forEach(id => {
    const revSel = document.getElementById(id);
    const curRev = revSel.value;
    revSel.innerHTML = '<option value="">' + T('filter_all_revues') + '</option>' + REVUES.map(r => '<option value="' + r.id + '"' + (r.id === curRev ? ' selected' : '') + '>' + r.full + '</option>').join('');
  });
}

function resetTrackerFilters() {
  document.getElementById('trackerSearch').value = '';
  document.getElementById('filterPays').value = '';
  document.getElementById('filterRevue').value = '';
  document.getElementById('filterStatut').value = '';
  const ft = document.getElementById('filterTrimestre'); if (ft) ft.value = '';
  renderTracker();
}

function resetCatalogueFilters() {
  document.getElementById('catSearch').value = '';
  document.getElementById('catFilterPays').value = '';
  document.getElementById('catFilterCouleur').value = '';
  const fs = document.getElementById('catFilterSent'); if (fs) fs.value = '';
  const ft = document.getElementById('catFilterTrimestre'); if (ft) ft.value = '';
  renderCatalogue();
}

function resetAlertsFilters() {
  document.getElementById('alertSearch').value = '';
  document.getElementById('alertFilterPays').value = '';
  document.getElementById('alertFilterTrimestre').value = '';
  document.getElementById('alertFilterCritique').value = '';
  renderAlerts();
}

// ═══════════════════════════════════════════════════════════
// TRACKER
// ═══════════════════════════════════════════════════════════

function wineHasAlert(w) {
  return !!(w.trimestre && ['overdue','warning'].includes(getTrimestreState(w.trimestre, isWineDone(w, shipmentItems, SENT_STATUTS))));
}

function updateAlertBadge() {
  const n = getTrimestreAlerts();
  const d = document.getElementById('alert-badge');
  if (d) { d.textContent = n; d.style.display = n ? 'inline' : 'none'; }
  const m = document.getElementById('alert-badge-m');
  if (m) { m.textContent = n; m.style.display = n ? 'flex' : 'none'; }
  return n;
}

// Couleurs des statuts (mêmes teintes que les bulles, validées daltonisme via le skill dataviz)
const STAT_COLORS = { 'envoyé': '#3b6d11', 'reçu': '#185fa5', 'soumis': '#b86e00', 'noté': '#534ab7', 'refusé': '#a32d2d' };

function statPct(n, total) { return total ? Math.round(n / total * 100) : 0; }

function statBar(segments, total) {
  return '<div class="stat-bar">' + segments.filter(s => s.n > 0).map(s =>
    '<span style="flex:' + s.n + ' 0 0;background:' + s.color + '" title="' + esc(s.label + ' : ' + s.n + ' (' + statPct(s.n, total) + ' %)') + '"></span>'
  ).join('') + '</div>';
}

function statKeys(items) {
  return '<div class="stat-keys">' + items.map(it =>
    '<span class="stat-key' + (it.muted ? ' is-muted' : '') + '">' + (it.color ? '<i style="background:' + it.color + '"></i>' : '') + '<b>' + it.n + '</b> ' + it.label + '</span>'
  ).join('') + '</div>';
}

function showNeverSentWines() {
  resetTrackerFilters();
  document.getElementById('filterStatut').value = 'never_sent';
  showPage('tracker');
  document.getElementById('trackerContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderStats() {
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const nbVins = wines.length;
  const nbSent = wines.filter(w => isWineSent(w.id)).length;

  // 1 · Vins suivis
  // "Jamais envoyé(s)" = en attente + soumis sans envoi (même règle que le filtre Statut > Jamais envoyé)
  set('statVins', nbVins);
  set('statVinsSub', nbVins - nbSent > 0
    ? '<span class="stat-link" onclick="showNeverSentWines()" title="' + esc(T('stat_show_never_sent')) + '">' +
        statKeys([{ n: nbVins - nbSent, label: T('stat_never_sent'), color: 'var(--border-strong)' }]) + '</span>'
    : T('stat_all_sent'));

  // 2 · Vins envoyés : % du catalogue + jauge
  set('statVinsEnvoyes', nbSent);
  set('statVinsEnvoyesSub', '<div class="stat-bar"><span style="width:' + statPct(nbSent, nbVins) + '%;background:' + STAT_COLORS['envoyé'] + '" title="' + esc(nbSent + ' / ' + nbVins) + '"></span></div>' +
    '<b class="stat-strong">' + statPct(nbSent, nbVins) + '%</b> ' + T('stat_of_catalogue'));

  // 3 · Tous les envois : répartition par statut
  const byStatut = {};
  shipmentItems.forEach(i => { const st = i.note ? 'noté' : i.statut; byStatut[st] = (byStatut[st] || 0) + 1; });
  const order = [['envoyé', 'stat_pl_envoye'], ['reçu', 'stat_pl_recu'], ['soumis', 'stat_pl_soumis'], ['noté', 'stat_pl_note'], ['refusé', 'stat_pl_refuse']];
  const segs = order.map(([st, key]) => ({ n: byStatut[st] || 0, color: STAT_COLORS[st], label: T(key) }));
  set('statEnvois', shipmentItems.length);
  set('statEnvoisSub', statBar(segs, shipmentItems.length) + statKeys(segs.filter(s => s.n > 0)));

  // 4 · Notes reçues : % des envois, moyenne, meilleure
  const notes = shipmentItems.map(i => parseFloat(String(i.note || '').replace(',', '.'))).filter(n => !isNaN(n));
  const nbNotes = shipmentItems.filter(i => i.note).length;
  const avg = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length) : null;
  set('statNotes', nbNotes);
  set('statNotesSub', avg !== null
    ? '<div class="stat-keys"><span class="stat-key"><b>' + statPct(nbNotes, shipmentItems.length) + '%</b></span><span class="stat-key">' + T('stat_avg') + ' <b>' + avg.toFixed(1).replace('.', ',') + '</b></span><span class="stat-key">' + T('stat_best') + ' <b>' + Math.max(...notes) + '</b></span></div>'
    : '');

  // 5 · Alertes trimestre : retards récents (15 jours après la fin du trimestre) / ≤ 30 j ; retards anciens en gris, hors alerte
  const { late, soon, old, lateQ, soonQ, oldQ } = trimestreCounts(wines, shipmentItems, currentCampagne, new Date(), TRIMESTRES, SENT_STATUTS);
  const qLabel = qs => (qs.length ? ' · ' + qs.join(', ') : '');
  const total = updateAlertBadge();
  set('statAlerts', total);
  const card = document.getElementById('statAlertsCard');
  if (card) {
    card.classList.toggle('is-alert', total > 0);
    card.title = T('stat_goto_alerts');
  }
  const alertKeys = [
    { n: late, label: T('stat_late') + qLabel(lateQ), color: '#ef4444' },
    { n: soon, label: T('stat_soon') + qLabel(soonQ), color: '#f59e0b' },
    { n: old, label: T('stat_old') + qLabel(oldQ), color: '#9ca3af', muted: true },
  ].filter(k => k.n > 0);
  set('statAlertsSub', alertKeys.length ? statKeys(alertKeys) : T('stat_none_alert'));
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
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.domaine || '').toLowerCase().includes(search) && !(w.importateurUS || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fTrimestre && w.trimestre !== fTrimestre) return false;
    const statuts = {};
    Object.entries(wrs[w.id] || {}).forEach(([rid, info]) => { statuts[rid] = info.statut; });
    return matchesRevueStatut(statuts, fRevue, fStatut, SENT_STATUTS);
  });

  renderStats();

  const c = document.getElementById('trackerContent');
  if (!filtered.length) { c.innerHTML = '<div class="empty">' + T('tracker_empty') + '</div>'; return; }

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
    c.innerHTML = '<div class="tbl-wrap tbl-card"><table>' +
      '<thead><tr>' + si('pays',T('col_pays')) + si('marque',T('col_marque')) + si('denom',T('col_denom')) + si('mil',T('col_mil')) + si('couleur',T('col_couleur')) + si('trimestre','Q') + si('importateur',T('lbl_importateur_us')) +
      REVUES.map(r => '<th>' + r.label + '</th>').join('') + '</tr></thead><tbody>' +
      sorted.map(w => {
        const hasAlert = wineHasAlert(w);
        return '<tr onclick="openWineDetail(\'' + w.id + '\')"' + (hasAlert ? ' style="background:#faeeda22"' : '') + '>' +
          '<td>' + esc(w.pays) + '</td>' +
          '<td><strong>' + esc(w.appellation) + '</strong></td>' +
          '<td style="font-size:11px">' + esc(w.nom) + '</td>' +
          '<td>' + (w.millesime || '') + '</td>' +
          '<td>' + couleurBadge(w.couleur) + '</td>' +
          '<td>' + (trimBadge(w.trimestre || '') || '<span style="color:var(--text-faint)">-</span>') + '</td>' +
          '<td style="font-size:11px">' + (w.importateurUS ? esc(w.importateurUS) : '<span style="color:var(--text-faint)">-</span>') + '</td>' +
          REVUES.map(r => '<td>' + statutBubble(wrs[w.id] && wrs[w.id][r.id], r.full) + '</td>').join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    c.insertAdjacentHTML('afterbegin', trackerLegendHTML());
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
          let cls = 'none';
          if (info && info.note) cls = 'rated';
          else if (info && info.statut === 'refusé') cls = 'refused';
          else if (info && info.statut === 'reçu') cls = 'recvd';
          else if (info && info.statut === 'envoyé') cls = 'sent';
          return '<span class="revue-pill ' + cls + '">' + r.label + (info && info.note ? ' · ' + esc(info.note) : '') + '</span>';
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
      '<div class="modal-title">' + esc(w.appellation) + ' ' + (w.millesime || '') + ' - ' + esc(w.pays) + '</div>' +
      '<button class="btn btn-sm" onclick="closeModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">' +
        couleurBadge(w.couleur) +
        '<span style="font-size:13px;color:var(--text-muted)">' + esc(w.nom) + '</span>' +
        (w.cepage ? '<span style="font-size:12px;color:var(--text-faint)">' + esc(w.cepage) + '</span>' : '') +
        (w.degre ? '<span style="font-size:12px;color:var(--text-faint)">' + esc(w.degre) + '°</span>' : '') +
        (w.importateurUS ? '<span style="font-size:12px;color:var(--text-muted)">' + T('lbl_importateur_us') + ' : ' + esc(w.importateurUS) + '</span>' : '') +
        (w.prixUS != null ? '<span style="font-size:12px;color:var(--text-muted)">' + T('lbl_us_price') + ' : ' + esc(formatUsPrice(w.prixUS, locale())) + '</span>' : '') +
        (w.caseProduction != null ? '<span style="font-size:12px;color:var(--text-muted)">' + T('lbl_case_prod') + ' : ' + esc(formatCount(w.caseProduction, locale())) + '</span>' : '') +
        (w.casesImported != null ? '<span style="font-size:12px;color:var(--text-muted)">' + T('lbl_cases_imp') + ' : ' + esc(formatCount(w.casesImported, locale())) + '</span>' : '') +
        (w.cola ? '<span style="font-size:12px;color:var(--text-muted)">' + T('lbl_cola') + ' : ' + colaBadge(w.cola) + '</span>' : '') +
      '</div>' +
      (w.lienExterne ? '<div style="margin-bottom:10px"><a href="' + esc(w.lienExterne) + '" target="_blank" rel="noopener" class="link-ext">🔗 ' + esc(w.lienExterne) + '</a></div>' : '') +
      (w.commentaire ? '<div style="font-size:13px;color:var(--text);line-height:1.6;white-space:pre-wrap;background:var(--bg);border-radius:var(--radius);padding:8px 10px;margin-bottom:14px">' + esc(w.commentaire) + '</div>' : '') +
      '<div class="section-title">' + T('detail_statut_revue') + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin-bottom:16px">' +
        REVUES.map(r => {
          const info = wrs[wineId] && wrs[wineId][r.id];
          return '<div style="background:var(--bg);border-radius:var(--radius);padding:10px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
              '<span style="font-size:11px;font-weight:600;color:var(--text-muted)">' + r.full + '</span>' +
              (info && info.statut !== 'pending' && info.itemId ? '<button class="btn btn-sm" onclick="openEditItem(\'' + info.itemId + '\',\'' + wineId + '\')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" style="vertical-align:middle" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM22.1213 10.7071C20.9497 9.53553 19.0503 9.53553 17.8787 10.7071L16.1989 12.3869L11.2929 17.2929C11.1647 17.4211 11.0738 17.5816 11.0299 17.7575L10.0299 21.7575C9.94466 22.0982 10.0445 22.4587 10.2929 22.7071C10.5413 22.9555 10.9018 23.0553 11.2425 22.9701L15.2425 21.9701C15.4184 21.9262 15.5789 21.8353 15.7071 21.7071L20.5556 16.8586L22.2929 15.1213C23.4645 13.9497 23.4645 12.0503 22.2929 10.8787L22.1213 10.7071ZM18.3068 13.1074L19.2929 12.1213C19.6834 11.7308 20.3166 11.7308 20.7071 12.1213L20.8787 12.2929C21.2692 12.6834 21.2692 13.3166 20.8787 13.7071L19.8622 14.7236L18.3068 13.1074ZM16.8923 14.5219L18.4477 16.1381L14.4888 20.097L12.3744 20.6256L12.903 18.5112L16.8923 14.5219Z" fill="currentColor"/></svg></button>' : '') +
            '</div>' +
            (info && info.statut && info.statut !== 'pending' ?
              statutBadge(info.statut) +
              (info.note ? ' <span class="note-pill" style="margin-left:4px">' + esc(info.note) + '</span>' : '') +
              (info.dateReception ? '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + T('detail_recu_le') + ' : ' + fmtDate(info.dateReception) + '</div>' : '') +
              (info.commentaire ? '<div style="font-size:12px;color:var(--text);line-height:1.5;white-space:pre-wrap;margin-top:6px;padding-top:6px;border-top:1px dashed var(--border)">' + esc(info.commentaire) + '</div>' : '')
            : '<span style="color:var(--text-faint);font-size:12px">' + T('detail_non_soumis') + '</span>') +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="section-title">' + T('detail_envois') + ' (' + wineShipments.length + ')</div>' +
      (wineShipments.length ? wineShipments.map(s => {
        const items = shipmentItems.filter(i => i.wineId === wineId && i.shipmentId === s.id);
        return '<div style="background:var(--bg);border-radius:var(--radius);padding:10px;margin-bottom:8px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px">' +
            '<span style="font-size:12px;font-weight:500">' + (s.dateEnvoi ? T('detail_envoi_du') + ' ' + fmtDate(s.dateEnvoi) : T('detail_soumis_le') + ' ' + fmtDate(s.dateSoumission)) + '</span>' +
            '<span style="display:flex;align-items:center;gap:6px">' +
              (s.intermediaire ? '<span style="font-size:11px;color:var(--text-muted)">' + esc(s.intermediaire) + '</span>' : '') +
              '<button class="btn btn-sm" style="padding:1px 6px;font-size:11px" onclick="openEditShipmentModal(\'' + s.id + '\',\'' + wineId + '\')" title="' + T('btn_modify') + '">✎</button>' +
              '<button class="btn btn-sm btn-danger" style="padding:1px 6px;font-size:11px" onclick="deleteShipment(\'' + s.id + '\',\'' + wineId + '\')">&times;</button>' +
            '</span>' +
          '</div>' +
          items.map(i => {
            const rev = REVUES.find(r => r.id === i.revueId);
            return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-top:4px;flex-wrap:wrap">' +
              '<span style="color:var(--text-muted);min-width:100px">' + (rev ? rev.full : i.revueId) + '</span>' +
              statutBadge(i.statut) +
              (i.tracking ? '<span style="font-size:11px;color:var(--text-faint)">📦 ' + esc(i.tracking) + '</span>' : '') +
              (i.note ? '<span class="note-pill">' + esc(i.note) + '</span>' : '') +
              '<button class="btn btn-sm" onclick="openEditItem(\'' + i.id + '\',\'' + wineId + '\')">' + T('btn_modify') + '</button>' +
              '<button class="btn btn-sm btn-danger" onclick="deleteItem(\'' + i.id + '\',\'' + wineId + '\')">' + T('btn_delete') + '</button>' +
            '</div>';
          }).join('') +
        '</div>';
      }).join('') : '<div style="color:var(--text-faint);font-size:13px">' + T('detail_no_envoi') + '</div>') +
    '</div>' +
    '<div class="modal-footer" style="flex-wrap:wrap">' +
      '<button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + wineId + '\')">' + T('btn_delete') + '</button>' +
      '<button class="btn btn-sm" onclick="closeModal();openEditWineModal(\'' + wineId + '\')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;margin-right:5px" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM22.1213 10.7071C20.9497 9.53553 19.0503 9.53553 17.8787 10.7071L16.1989 12.3869L11.2929 17.2929C11.1647 17.4211 11.0738 17.5816 11.0299 17.7575L10.0299 21.7575C9.94466 22.0982 10.0445 22.4587 10.2929 22.7071C10.5413 22.9555 10.9018 23.0553 11.2425 22.9701L15.2425 21.9701C15.4184 21.9262 15.5789 21.8353 15.7071 21.7071L20.5556 16.8586L22.2929 15.1213C23.4645 13.9497 23.4645 12.0503 22.2929 10.8787L22.1213 10.7071ZM18.3068 13.1074L19.2929 12.1213C19.6834 11.7308 20.3166 11.7308 20.7071 12.1213L20.8787 12.2929C21.2692 12.6834 21.2692 13.3166 20.8787 13.7071L19.8622 14.7236L18.3068 13.1074ZM16.8923 14.5219L18.4477 16.1381L14.4888 20.097L12.3744 20.6256L12.903 18.5112L16.8923 14.5219Z" fill="currentColor"/></svg>' + T('btn_edit_wine') + '</button>' +
      '<div style="flex:1"></div>' +
      '<button class="btn btn-sm" onclick="closeModal()">' + T('btn_close') + '</button>' +
      '<button class="btn btn-sm btn-primary" onclick="closeModal();openShipmentModal(\'' + wineId + '\')">' + T('btn_new_shipment') + '</button>' +
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
      '<div class="modal-title">' + T('btn_modify') + ' - ' + esc(w ? w.nom : '') + ' / ' + (r ? r.full : '') + '</div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="grid-2">' +
        '<div class="field"><label>'+T('lbl_statut')+'</label><select id="ei_statut">' +
          '<option value="soumis"' + (item.statut === 'soumis' ? ' selected' : '') + '>'+T('statut_soumis')+'</option>' +
          '<option value="envoyé"' + (item.statut === 'envoyé' ? ' selected' : '') + '>'+T('statut_envoye')+'</option>' +
          '<option value="reçu"' + (item.statut === 'reçu' ? ' selected' : '') + '>'+T('statut_recu')+'</option>' +
          '<option value="noté"' + (item.statut === 'noté' ? ' selected' : '') + '>'+T('statut_note')+'</option>' +
          '<option value="refusé"' + (item.statut === 'refusé' ? ' selected' : '') + '>'+T('statut_refuse')+'</option>' +
        '</select></div>' +
        '<div class="field"><label>'+T('lbl_note')+'</label><input id="ei_note" value="' + esc(item.note || '') + '" placeholder="ex: 92" oninput="noteToStatut()"></div>' +
        '<div class="field"><label>'+T('lbl_date_recep')+'</label><input type="date" id="ei_recep" value="' + (item.dateReception || '') + '"></div>' +
      '</div>' +
      '<div class="field"><label>'+T('lbl_comment')+'</label><textarea id="ei_comment">' + esc(item.commentaire || '') + '</textarea></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">' + T('btn_cancel') + '</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveItem" onclick="saveItem(\'' + itemId + '\',\'' + wineId + '\')">' + T('btn_save') + '</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

// Saisir une note passe le statut à « Noté » (sauf « Refusé »).
function noteToStatut() {
  const st = document.getElementById('ei_statut');
  st.value = effectiveStatut(st.value, document.getElementById('ei_note').value);
}

async function saveItem(itemId, wineId) {
  const btn = document.getElementById('btnSaveItem');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await db.collection('shipmentItems').doc(itemId).update({
      statut: effectiveStatut(document.getElementById('ei_statut').value, document.getElementById('ei_note').value),
      note: document.getElementById('ei_note').value || null,
      dateReception: document.getElementById('ei_recep').value || null,
      commentaire: document.getElementById('ei_comment').value || null,
    });
    closeModal();
    toast(T('toast_saved'));
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = T('btn_save');
  }
}

// ═══════════════════════════════════════════════════════════
// SHIPMENT MODAL (NOUVEL ENVOI)
// ═══════════════════════════════════════════════════════════

let selectedWines = new Set();
let selectedRevues = new Set();
let trackingValues = {};

function openShipmentModal(preselect, revues) {
  selectedWines = new Set(preselect ? [preselect] : []);
  selectedRevues = new Set(revues || []);
  trackingValues = {};
  renderShipmentModal();
}

function renderTrackingFields() {
  if (!selectedRevues.size) return '';
  return '<div class="grid-3" style="margin-top:8px">' +
    REVUES.filter(r => selectedRevues.has(r.id)).map(r =>
      '<div class="field"><label>' + T('lbl_tracking_prefix') + ' - ' + r.full + '</label>' +
      '<input value="' + esc(trackingValues[r.id] || '') + '" oninput="trackingValues[\'' + r.id + '\']=this.value" placeholder="ex: FEDEX 1234567890"></div>'
    ).join('') +
  '</div>';
}

function renderShipmentModal() {
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal modal-lg">' +
    '<div class="modal-header">' +
      '<div class="modal-title">' + T('modal_shipment') + '</div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="section-title">' + T('section_wines') + ' <span class="selected-count" id="wineCount">(' + selectedWines.size + ' sélectionné' + (selectedWines.size > 1 ? 's' : '') + ')</span></div>' +
      '<div class="wine-selector">' +
        '<input class="search-wines" type="text" placeholder="' + T('filter_wines') + '" oninput="filterWineList(this.value)">' +
        '<div id="wineList">' + renderWineList('') + '</div>' +
      '</div>' +
      '<div class="section-title" style="margin-top:16px">' + T('section_revues') + '</div>' +
      '<div class="revue-checkboxes">' + REVUES.map(r =>
        '<div class="revue-check' + (selectedRevues.has(r.id) ? ' active' : '') + '" onclick="toggleRevue(\'' + r.id + '\',this)">' + r.full + '</div>'
      ).join('') + '</div>' +
      '<div class="section-title" style="margin-top:16px">' + T('section_details') + '</div>' +
      '<div class="grid-3">' +
        '<div class="field"><label>'+T('lbl_date_envoi_opt')+'</label><input type="date" id="sh_date" value="' + todayISO() + '" oninput="if(this.value)document.getElementById(\'sh_date_soumission\').value=\'\'"></div>' +
        '<div class="field"><label>'+T('lbl_date_soumission')+'</label><input type="date" id="sh_date_soumission" oninput="if(this.value)document.getElementById(\'sh_date\').value=\'\'"></div>' +
        '<div class="field"><label>'+T('lbl_inter')+'</label><input id="sh_inter" placeholder="ex: Winesellers"></div>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-faint);margin:-4px 0 8px">' + T('hint_one_date') + '</div>' +
      '<div id="trackingFieldsWrap">' + renderTrackingFields() + '</div>' +
      '<div class="field"><label>'+T('lbl_comment')+'</label><input id="sh_comment" placeholder="Optionnel"></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<div style="font-size:12px;color:var(--text-muted);margin-right:auto" id="shipmentSummary">' + selectedWines.size + (LANG==='es' ? ' vino(s) · ' : ' vin(s) · ') + selectedRevues.size + (LANG==='es' ? ' revista(s)' : ' revue(s)') + '</div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">' + T('btn_cancel') + '</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveShipment" onclick="saveShipment()">' + T('btn_save') + '</button>' +
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
  const tfw = document.getElementById('trackingFieldsWrap');
  if (tfw) tfw.innerHTML = renderTrackingFields();
  updateShipmentCounts();
}



function updateShipmentCounts() {
  const wc = document.getElementById('wineCount');
  if (wc) wc.textContent = '(' + selectedWines.size + ' ' + (LANG==='es' ? (selectedWines.size > 1 ? 'seleccionados' : 'seleccionado') : ('sélectionné' + (selectedWines.size > 1 ? 's' : ''))) + ')';
  const sm = document.getElementById('shipmentSummary');
  if (sm) sm.textContent = selectedWines.size + ' vin(s) · ' + selectedRevues.size + ' revue(s)';
}

async function saveShipment() {
  if (!selectedWines.size) { toast(T('toast_select_wine'), 'warn'); return; }
  if (!selectedRevues.size) { toast(T('toast_select_revue'), 'warn'); return; }
  const dateEnvoi = document.getElementById('sh_date').value;
  const dateSoumission = document.getElementById('sh_date_soumission').value;
  if (dateEnvoi && dateSoumission) { toast(T('hint_one_date'), 'warn'); return; }
  if (!dateEnvoi && !dateSoumission) { toast(T('hint_one_date'), 'warn'); return; }
  const statutInit = dateSoumission ? 'soumis' : 'envoyé';

  const btn = document.getElementById('btnSaveShipment');
  btn.innerHTML = '<span class="spinner"></span> ' + T('saving');
  btn.disabled = true;

  try {
    const trackingByRevue = {};
    selectedRevues.forEach(rid => { if (trackingValues[rid]) trackingByRevue[rid] = trackingValues[rid]; });

    const shipRef = await db.collection('shipments').add({
      dateEnvoi: dateEnvoi || null,
      dateSoumission: dateSoumission || null,
      trackingByRevue,
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
          statut: statutInit,
          note: null,
          dateReception: null,
          tracking: trackingValues[rid] || null,
          commentaire: document.getElementById('sh_comment').value || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    });
    await batch.commit();

    closeModal();
    toast('✓ ' + (selectedWines.size * selectedRevues.size) + (LANG==='es'?' envío(s) registrado(s)':' envoi(s) enregistré(s)'));
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = T('btn_save');
  }
}

// ═══════════════════════════════════════════════════════════
// CATALOGUE
// ═══════════════════════════════════════════════════════════

let catSelected = new Set();

function updateCatSelectionUI() {
  const btn = document.getElementById('btnDeleteSelected');
  if (!btn) return;
  const btnTag = document.getElementById('btnTagSelected');
  if (catSelected.size > 0) {
    btn.style.display = '';
    btn.textContent = T('btn_delete') + ' (' + catSelected.size + ')';
    if (btnTag) { btnTag.style.display = ''; btnTag.textContent = (LANG==='es'?'Etiquetar':'Taguer') + ' (' + catSelected.size + ')'; }
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
  let msg = (LANG==='es'?'¿Eliminar definitivamente ':'Supprimer définitivement ') + canDelete.length + (LANG==='es'?' vino(s)?':' vin(s) ?');
  if (blocked > 0) msg += ' (' + blocked + ' ' + T('toast_blocked') + ')';
  confirmModal(msg, async () => {
    try {
      const batch = db.batch();
      canDelete.forEach(id => batch.delete(db.collection('wines').doc(id)));
      await batch.commit();
      catSelected.clear();
      updateCatSelectionUI();
      toast(canDelete.length + (LANG==='es'?' vino(s) eliminado(s)':(" vin(s) supprimé(s)")));
    } catch (e) { toast('Erreur : ' + e.message, 'error'); }
  }, 'Supprimer', 'btn-danger');
}


let tagSelectedRevues = new Set();

function toggleTagRevue(id, el) {
  if (tagSelectedRevues.has(id)) tagSelectedRevues.delete(id);
  else tagSelectedRevues.add(id);
  el.classList.toggle('active', tagSelectedRevues.has(id));
}

function openTagModal() {
  if (!catSelected.size) return;
  const single = catSelected.size === 1 ? wines.find(w => w.id === [...catSelected][0]) : null;
  tagSelectedRevues = new Set(single && single.cibleRevues ? single.cibleRevues : []);
  const currentTrimestre = single ? single.trimestre : null;
  const html = '<div class="modal-overlay confirm-overlay" onclick="if(event.target===this)this.remove()">' +
    '<div class="modal" style="max-width:380px;width:90%">' +
      '<div class="modal-body" style="padding:20px 20px 12px">' +
        '<p style="font-size:14px;font-weight:500;margin-bottom:12px">' + (LANG==='es'?'Etiquetar':'Taguer') + ' ' + catSelected.size + ' ' + (LANG==='es'?'vino(s)':'vin(s)') + ' · ' + (LANG==='es'?"trimestre de envío":"trimestre d\'envoi") + '</p>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">' + T('tag_revues_label') + '</div>' +
        '<div class="revue-checkboxes" style="margin-bottom:14px">' + REVUES.map(r =>
          '<div class="revue-check' + (tagSelectedRevues.has(r.id) ? ' active' : '') + '" onclick="toggleTagRevue(\'' + r.id + '\',this)">' + r.full + '</div>'
        ).join('') + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
          TRIMESTRES.map(td =>
            '<button class="btn btn-sm" style="justify-content:center;flex-direction:column;gap:4px;padding:10px 8px' + (currentTrimestre === td.id ? ';border-color:var(--accent);border-width:2px' : '') + '" onclick="applyTrimTag(\'' + td.id + '\')">' +
              trimBadge(td.id) +
              '<span style="font-size:10px;color:var(--text-muted)">' + T(td.id.toLowerCase()+'_months') + '</span>' +
            '</button>'
          ).join('') +
        '</div>' +
        '<div style="margin-top:8px">' +
          '<button class="btn btn-sm" style="width:100%;justify-content:center;color:var(--text-muted)" onclick="applyTrimTag(null)">' + T('tag_remove') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer"><button class="btn btn-sm" onclick="this.closest(\'.confirm-overlay\').remove()">' + T('btn_cancel') + '</button></div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function applyTrimTag(qid) {
  document.querySelector('.confirm-overlay')?.remove();
  const ids = [...catSelected];
  try {
    const batch = db.batch();
    if (qid && ids.length > 1) {
      // Sélection multiple : le trimestre remplace, les critiques s'ajoutent à ceux déjà présents sur chaque vin.
      ids.forEach(id => {
        const w = wines.find(x => x.id === id);
        const merged = [...new Set([...(w && w.cibleRevues || []), ...tagSelectedRevues])];
        batch.update(db.collection('wines').doc(id), { trimestre: qid, cibleRevues: merged.length ? merged : null });
      });
    } else {
      const cibleRevues = qid && tagSelectedRevues.size ? [...tagSelectedRevues] : null;
      ids.forEach(id => batch.update(db.collection('wines').doc(id), { trimestre: qid || null, cibleRevues }));
    }
    await batch.commit();
    catSelected.clear();
    tagSelectedRevues.clear();
    updateCatSelectionUI();
    toast(ids.length + (LANG==='es'?' vino(s) ':(" vin(s) ")) + (qid ? (LANG==='es'?'etiquetado(s) ':'tagué(s) ') + qid : (LANG==='es'?'sin etiqueta':'détagué(s)')));
  } catch (e) { toast('Erreur : ' + e.message, 'error'); }
}

// Vins du Catalogue après filtres (liste affichée, reprise telle quelle par l'export).
function getCatalogueFiltered(wrs) {
  const search = (document.getElementById('catSearch').value || '').toLowerCase();
  const fPays = document.getElementById('catFilterPays').value;
  const fCouleur = document.getElementById('catFilterCouleur').value;
  const fSent = (document.getElementById('catFilterSent') || {}).value || '';
  const fCatTrimestre = (document.getElementById('catFilterTrimestre') || {}).value || '';

  return wines.filter(w => {
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.domaine || '').toLowerCase().includes(search) && !(w.importateurUS || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fCouleur && w.couleur !== fCouleur) return false;
    if (fCatTrimestre && w.trimestre !== fCatTrimestre) return false;
    if (fSent) {
      const allPending = Object.values(wrs[w.id] || {}).every(x => !SENT_STATUTS.includes(x.statut));
      if (fSent === 'none' && !allPending) return false;
      if (fSent === 'any' && allPending) return false;
    }
    return true;
  });
}

function renderCatalogue() {
  const wrs = getWineRevueStatus();
  const filtered = getCatalogueFiltered(wrs);

  const tbody = document.getElementById('catTableBody');
  document.getElementById('catEmpty').style.display = filtered.length ? 'none' : 'block';
  tbody.innerHTML = filtered.map(w => {
    const cibles = w.cibleRevues || [];
    const sentIds = Object.keys(wrs[w.id] || {}).filter(rid => SENT_STATUTS.includes(wrs[w.id][rid].statut));
    const pillCss = 'font-size:11px;padding:2px 7px;border-radius:10px;font-weight:500;';
    let sentBadge = '<span style="color:var(--text-faint);font-size:11px">-</span>';
    if (cibles.length) {
      const doneCibles = cibles.filter(rid => sentIds.includes(rid)).length;
      const tone = doneCibles === cibles.length ? 'background:var(--green-bg);color:var(--green-text)'
        : doneCibles ? 'background:var(--amber-bg);color:var(--amber-text)' : 'background:var(--gray-bg);color:var(--gray-text)';
      sentBadge = '<span style="' + pillCss + tone + '">' + doneCibles + '/' + cibles.length + '</span>';
    } else if (sentIds.length) {
      sentBadge = '<span style="' + pillCss + 'background:var(--green-bg);color:var(--green-text)">' + sentIds.length + '</span>';
    }
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
      '<td style="font-size:11px;color:var(--text-muted)">' + (w.mad ? fmtDate(w.mad) : '<span style="color:var(--text-faint)">-</span>') + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted)" title="' + esc(w.importateurUS || '') + '">' + (w.importateurUS ? esc(w.importateurUS) : '<span style="color:var(--text-faint)">-</span>') + '</td>' +
      '<td style="font-size:12px;white-space:nowrap">' + (w.prixUS != null ? esc(formatUsPrice(w.prixUS, locale())) : '<span style="color:var(--text-faint)">-</span>') + '</td>' +
      '<td style="font-size:12px">' + (w.caseProduction != null ? esc(formatCount(w.caseProduction, locale())) : '<span style="color:var(--text-faint)">-</span>') + '</td>' +
      '<td style="font-size:12px">' + (w.casesImported != null ? esc(formatCount(w.casesImported, locale())) : '<span style="color:var(--text-faint)">-</span>') + '</td>' +
      '<td>' + colaBadge(w.cola) + '</td>' +
      '<td>' + (trimBadge(w.trimestre || '') || '<span style="color:var(--text-faint);font-size:11px">-</span>') + '</td>' +
      '<td>' + sentBadge + '</td>' +
      '<td onclick="event.stopPropagation()" style="display:flex;gap:4px"><button class="btn btn-sm" title="' + T('btn_duplicate') + '" onclick="duplicateWine(\'' + w.id + '\')">⧉</button><button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + w.id + '\')">' + T('btn_delete') + '</button></td>' +
    '</tr>';
  }).join('');
  updateCatSelectionUI();
}

// ── ADD WINE ──────────────────────────────────────────────

function uniqueVals(field) {
  return [...new Set(allWines.map(w => w[field]).filter(Boolean))].sort();
}

function datalistsHTML(suffix) {
  const opts = arr => arr.map(v => '<option value="' + esc(v) + '">').join('');
  return '<datalist id="dl_pays_' + suffix + '">' + opts(uniqueVals('pays')) + '</datalist>' +
    '<datalist id="dl_domaine_' + suffix + '">' + opts(uniqueVals('appellation')) + '</datalist>' +
    '<datalist id="dl_cepage_' + suffix + '">' + opts(uniqueVals('cepage')) + '</datalist>' +
    '<datalist id="dl_importateur_' + suffix + '">' + opts(uniqueVals('importateurUS')) + '</datalist>';
}

// Vin dont on prépare une copie (« Dupliquer ») ; null pour un ajout classique.
let addPrefill = null;

function openAddWineModal() {
  addPrefill = null;
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header"><div class="modal-title">' + T('modal_add_wine') + '</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<div class="campagne-note">' + T('add_into') + ' ' + currentCampagne + '</div>' +
      '<div class="grid-2">' +
        '<div class="field"><label>'+T('lbl_pays')+'</label><input id="aw_pays" list="dl_pays_aw" placeholder="ex: France"></div>' +
        '<div class="field"><label>'+T('lbl_couleur')+'</label><select id="aw_couleur"><option>Rouge</option><option>Blanc</option><option>Rosé</option><option>Orange</option></select></div>' +
        '<div class="field"><label>'+T('lbl_denom')+'</label><input id="aw_nom" placeholder="ex: Alta Colección Cabernet Sauvignon"></div>' +
        '<div class="field"><label>'+T('lbl_millesime')+'</label><input id="aw_mil" placeholder="ex: 2022" type="number" min="1900" max="2030"></div>' +
        '<div class="field"><label>'+T('lbl_marque')+'</label><input id="aw_app" list="dl_domaine_aw" placeholder="ex: Bodega Piedra Negra"></div>' +
        '<div class="field"><label>'+T('lbl_cepage')+'</label><input id="aw_cep" list="dl_cepage_aw" placeholder="ex: Cabernet Sauvignon"></div>' +
        '<div class="field"><label>'+T('lbl_degre')+'</label><input id="aw_deg" placeholder="ex: 14" type="number" step="0.1" min="0" max="25"></div>' +
        '<div class="field"><label>'+T('lbl_mad')+'</label><input id="aw_mad" type="date"></div>' +
      '</div>' +
      '<div class="field"><label>'+T('lbl_importateur_us')+'</label><input id="aw_imp" list="dl_importateur_aw" placeholder="ex: Kobrand Wine & Spirits"></div>' +
      usFieldsHTML('aw') +
      '<div class="field"><label>'+T('lbl_lien')+'</label><input id="aw_link" placeholder="https://... (fiche technique, Dropbox...)"></div>' +
      '<div class="field"><label>'+T('lbl_comment')+'</label><textarea id="aw_comment" placeholder=""></textarea></div>' +
      datalistsHTML('aw') +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">' + T('btn_cancel') + '</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveWine" onclick="saveWine()">' + T('btn_add') + '</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function saveWine() {
  const pays = document.getElementById('aw_pays').value.trim();
  const nom = document.getElementById('aw_nom').value.trim();
  const millesime = document.getElementById('aw_mil').value.trim();
  const appellation = document.getElementById('aw_app').value.trim();
  if (!pays || !nom || !millesime || !appellation) { toast(T('toast_fill_required'), 'warn'); return; }
  const us = readUsFields('aw');
  if (!us) { toast(T('toast_us_invalid'), 'warn'); return; }
  const candidate = { appellation, nom, millesime };
  if (findDuplicateWine(candidate, wines)) {
    toast(addPrefill && wineKey(candidate) === wineKey(addPrefill) ? T('toast_dup_same') : T('toast_wine_exists').replace('{y}', currentCampagne), 'warn');
    return;
  }

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
      mad: document.getElementById('aw_mad').value || null,
      importateurUS: document.getElementById('aw_imp').value.trim() || null,
      ...us,
      ...(addPrefill ? { trimestre: addPrefill.trimestre || null, cibleRevues: addPrefill.cibleRevues || null } : {}),
      campagne: currentCampagne,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal();
    toast(T(addPrefill ? 'toast_wine_duplicated' : 'toast_wine_added'));
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = T('btn_add');
  }
}

// ── EDIT WINE ─────────────────────────────────────────────

function openEditWineModal(wineId) {
  const w = wines.find(x => x.id === wineId);
  if (!w) return;
  closeModal();

  const wrs = getWineRevueStatus();
  const sentRows = REVUES.map(r => {
    const info = wrs[wineId] && wrs[wineId][r.id];
    if (!info || info.statut === 'pending') return null;
    const ship = shipments.find(s => s.id === info.shipmentId);
    const dateStr = ship ? fmtDate(ship.dateEnvoi || ship.dateSoumission) : '';
    return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:4px">' +
      '<span style="min-width:110px">' + r.full + '</span>' + statutBadge(info.statut) +
      (dateStr ? '<span style="color:var(--text-muted)">' + dateStr + '</span>' : '') +
    '</div>';
  }).filter(Boolean).join('');
  const sentSummaryHTML = sentRows ? (
    '<div style="background:var(--bg);border-radius:var(--radius);padding:10px;margin-bottom:14px">' +
      '<div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">' + T('edit_sent_summary_title') + '</div>' +
      sentRows +
    '</div>'
  ) : '';

  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal">' +
    '<div class="modal-header"><div class="modal-title">' + T('btn_modify') + ' - ' + esc(w.nom) + ' ' + (w.millesime || '') + '</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      sentSummaryHTML +
      '<div class="grid-2">' +
        '<div class="field"><label>'+T('lbl_pays')+'</label><input id="ew_pays" list="dl_pays_ew" value="' + esc(w.pays || '') + '"></div>' +
        '<div class="field"><label>'+T('lbl_couleur')+'</label><select id="ew_couleur">' +
          ['Rouge','Blanc','Rosé','Orange'].map(c => '<option' + (w.couleur === c ? ' selected' : '') + '>' + c + '</option>').join('') +
        '</select></div>' +
        '<div class="field"><label>'+T('lbl_denom')+'</label><input id="ew_nom" value="' + esc(w.nom || '') + '"></div>' +
        '<div class="field"><label>'+T('lbl_millesime')+'</label><input id="ew_mil" value="' + esc(w.millesime || '') + '" type="number" min="1900" max="2030"></div>' +
        '<div class="field"><label>'+T('lbl_marque')+'</label><input id="ew_app" list="dl_domaine_ew" value="' + esc(w.appellation || '') + '"></div>' +
        '<div class="field"><label>'+T('lbl_cepage')+'</label><input id="ew_cep" list="dl_cepage_ew" value="' + esc(w.cepage || '') + '"></div>' +
        '<div class="field"><label>'+T('lbl_degre')+'</label><input id="ew_deg" value="' + esc(w.degre || '') + '" type="number" step="0.1" min="0" max="25"></div>' +
        '<div class="field"><label>'+T('lbl_mad')+'</label><input id="ew_mad" type="date" value="' + (w.mad || '') + '"></div>' +
      '</div>' +
      '<div class="field"><label>'+T('lbl_importateur_us')+'</label><input id="ew_imp" list="dl_importateur_ew" value="' + esc(w.importateurUS || '') + '"></div>' +
      usFieldsHTML('ew', w) +
      '<div class="field"><label>'+T('lbl_lien')+'</label><input id="ew_link" value="' + esc(w.lienExterne || '') + '" placeholder="https://..."></div>' +
      '<div class="field"><label>'+T('lbl_comment')+'</label><textarea id="ew_comment">' + esc(w.commentaire || '') + '</textarea></div>' +
      datalistsHTML('ew') +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm btn-danger" onclick="deleteWine(\'' + wineId + '\')">' + T('btn_delete') + '</button>' +
      '<div style="flex:1"></div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">' + T('btn_cancel') + '</button>' +
      '<button class="btn btn-sm btn-primary" id="btnUpdateWine" onclick="updateWine(\'' + wineId + '\')">' + T('btn_save') + '</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function updateWine(wineId) {
  const pays = document.getElementById('ew_pays').value.trim();
  const nom = document.getElementById('ew_nom').value.trim();
  const millesime = document.getElementById('ew_mil').value.trim();
  const appellation = document.getElementById('ew_app').value.trim();
  if (!pays || !nom || !millesime || !appellation) { toast(T('toast_fill_required'), 'warn'); return; }

  const us = readUsFields('ew');
  if (!us) { toast(T('toast_us_invalid'), 'warn'); return; }
  const current = wines.find(x => x.id === wineId);
  if (current && findDuplicateOnEdit(current, { appellation, nom, millesime }, wines)) {
    toast(T('toast_wine_exists_edit').replace('{y}', currentCampagne), 'warn');
    return;
  }

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
      mad: document.getElementById('ew_mad').value || null,
      importateurUS: document.getElementById('ew_imp').value.trim() || null,
      ...us,
    });
    closeModal();
    toast(T('toast_wine_updated'));
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = T('btn_save');
  }
}

function deleteItem(itemId, wineId) {
  confirmModal(T('confirm_delete_item'), async () => {
    try {
      await db.collection('shipmentItems').doc(itemId).delete();
      closeModal();
      setTimeout(() => openWineDetail(wineId), 150);
      toast(T('toast_item_deleted'));
    } catch (e) {
      toast('Erreur : ' + e.message, 'error');
    }
  }, 'Supprimer', 'btn-danger');
}

function deleteShipment(shipmentId, wineId) {
  confirmModal(T('confirm_delete_shipment'), async () => {
    try {
      const batch = db.batch();
      shipmentItems.filter(i => i.shipmentId === shipmentId)
        .forEach(i => batch.delete(db.collection('shipmentItems').doc(i.id)));
      batch.delete(db.collection('shipments').doc(shipmentId));
      await batch.commit();
      closeModal();
      setTimeout(() => openWineDetail(wineId), 150);
      toast(T('toast_shipment_deleted'));
    } catch (e) {
      toast('Erreur : ' + e.message, 'error');
    }
  }, 'Supprimer', 'btn-danger');
}

function openEditShipmentModal(shipmentId, wineId) {
  const s = shipments.find(x => x.id === shipmentId);
  if (!s) return;
  closeModal();
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal" style="max-width:360px">' +
    '<div class="modal-header"><div class="modal-title">' + T('modal_edit_shipment') + '</div><button class="btn btn-sm" onclick="safeCloseModal()">&times;</button></div>' +
    '<div class="modal-body">' +
      '<div class="field"><label>' + (s.dateSoumission ? T('lbl_date_soumission') : T('lbl_date_envoi')) + '</label><input type="date" id="esh_date" value="' + (s.dateEnvoi || s.dateSoumission || '') + '"></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">' + T('btn_cancel') + '</button>' +
      '<button class="btn btn-sm btn-primary" id="btnSaveShipmentDate" onclick="updateShipmentDate(\'' + shipmentId + '\',\'' + wineId + '\')">' + T('btn_save') + '</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function updateShipmentDate(shipmentId, wineId) {
  const date = document.getElementById('esh_date').value;
  if (!date) { toast(T('toast_fill_required'), 'warn'); return; }
  const s = shipments.find(x => x.id === shipmentId);
  const field = s && s.dateSoumission ? 'dateSoumission' : 'dateEnvoi';
  const btn = document.getElementById('btnSaveShipmentDate');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await db.collection('shipments').doc(shipmentId).update({ [field]: date });
    closeModal();
    toast(T('toast_shipment_updated'));
    setTimeout(() => openWineDetail(wineId), 200);
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = T('btn_save');
  }
}

// « Dupliquer » ouvre un nouveau vin prérempli : rien n'est créé tant que l'identité (Domaine + Dénomination + Millésime)
// est identique à l'original. Le trimestre et les revues ciblées sont repris à l'enregistrement.
function duplicateWine(id) {
  const w = wines.find(x => x.id === id);
  if (!w) return;
  openAddWineModal();
  addPrefill = w;
  const set = (field, v) => { document.getElementById(field).value = v == null ? '' : v; };
  set('aw_pays', w.pays); set('aw_couleur', w.couleur); set('aw_nom', w.nom); set('aw_mil', w.millesime); set('aw_app', w.appellation);
  set('aw_cep', w.cepage); set('aw_deg', w.degre); set('aw_mad', w.mad); set('aw_imp', w.importateurUS); set('aw_link', w.lienExterne);
  set('aw_comment', w.commentaire); set('aw_price', w.prixUS); set('aw_cprod', w.caseProduction); set('aw_cimp', w.casesImported); set('aw_cola', w.cola);
  document.querySelector('.modal-title').textContent = T('modal_dup_wine');
  document.querySelector('.campagne-note').textContent = T('dup_from') + ' ' + [w.appellation, w.nom, w.millesime].filter(Boolean).join(' · ');
  const mil = document.getElementById('aw_mil');
  mil.focus(); mil.select();
}

function deleteWine(id) {
  const hasItems = shipmentItems.some(i => i.wineId === id);
  if (hasItems) { toast(T('toast_wine_has_items'), 'error'); return; }
  confirmModal(T('confirm_delete_wine'), async () => {
    try {
      await db.collection('wines').doc(id).delete();
      closeModal();
      toast(T('toast_wine_deleted'));
    } catch (e) {
      toast('Erreur : ' + e.message, 'error');
    }
  });
}

// ═══════════════════════════════════════════════════════════
// PASTE IMPORT
// ═══════════════════════════════════════════════════════════

// Ligne d'exemple de l'onglet « Exemple » du modèle Excel.
const IMPORT_EXAMPLE_ROW = ['France', 'Château Exemple', 'AOP Bordeaux', 'Rouge', '2022', 'Merlot, Cabernet Sauvignon', '14', 'https://www.exemple.com/fiche-vin', 'Échantillon presse', 'Kobrand Wine & Spirits', '24.50', '1200', '300', 'Oui', 'Q3', 'WS, WE'];

let parsedPaste = [];
let pasteErrors = [];

function openPasteModal() {
  parsedPaste = [];
  pasteErrors = [];
  // noms des colonnes, dans l'ordre : 5 obligatoires, 5 facultatives, puis Q et Revues ciblées (tags automatiques)
  const chip = (label, i) => '<span class="imp-col' + (i >= 14 ? ' is-tag' : i >= 5 ? ' is-opt' : '') + '">' + esc(label) + '</span>';
  const html = '<div class="modal-overlay" onclick="if(event.target===this)safeCloseModal()">' +
  '<div class="modal modal-lg">' +
    '<div class="modal-header">' +
      '<div class="imp-head"><div class="modal-title">' + T('modal_import') + '</div><span class="imp-campagne">' + T('import_campagne') + ' ' + currentCampagne + '</span></div>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="imp-step"><span>' + T('import_step1') + '</span><button class="btn btn-sm" onclick="downloadImportTemplate()">' + T('btn_download_template') + '</button></div>' +
      '<div class="imp-cols">' + T('import_cols').split(' · ').map(chip).join('') + '</div>' +
      '<div class="imp-legend"><span>' + T('import_legend_req') + ' ' + T('import_legend_opt') + '</span><span class="is-tag">' + T('import_legend_tag') + '</span></div>' +
      '<div class="imp-rule">' + T('import_rule_q') + '</div>' +
      '<div class="imp-rule">' + T('import_rule_us') + '</div>' +
      '<div class="imp-rule">' + T('import_rule_imp') + '</div>' +
      '<div class="imp-rule">' + T('import_rule_dup') + '</div>' +
      '<div class="imp-step is-later"><span>' + T('import_step2') + '</span></div>' +
      '<div class="field" id="pasteField"><textarea class="paste-area" id="pasteInput" rows="5" oninput="parsePaste()" onpaste="afterPaste()" onblur="collapsePaste()" placeholder="' + esc(T('import_paste_hint')) + '"></textarea></div>' +
      '<div class="imp-drop" id="pasteDone" style="display:none"><span id="pasteDoneText"></span><span class="imp-edit" onclick="expandPaste()">' + T('import_edit') + '</span></div>' +
      '<div id="pastePreview"></div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<span class="imp-status" id="importStatus">' + T('import_status_empty') + '</span>' +
      '<button class="btn btn-sm" onclick="safeCloseModal()">' + T('btn_cancel') + '</button>' +
      '<button class="btn btn-sm btn-primary" id="btnImport" onclick="importPaste()">' + T('import_btn') + '</button>' +
    '</div>' +
  '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

// La zone de collage se replie en « N lignes collées » une fois remplie, pour laisser la place à la vérification.
function afterPaste() {
  setTimeout(() => { parsePaste(); collapsePaste(); }, 0);
}

function collapsePaste() {
  const ta = document.getElementById('pasteInput');
  if (!ta || !ta.value.trim()) return;
  document.getElementById('pasteField').style.display = 'none';
  document.getElementById('pasteDone').style.display = '';
}

function expandPaste() {
  document.getElementById('pasteDone').style.display = 'none';
  document.getElementById('pasteField').style.display = '';
  document.getElementById('pasteInput').focus();
}

function downloadImportTemplate() {
  const header = ['Pays', 'Domaine ou Marque', 'Dénomination', 'Couleur', 'Millésime', 'Cépage', 'Degré', 'Lien externe', 'Commentaire', 'Importateur US', 'U.S. Price', 'Case Production (9L)', 'Cases Imported (9L)', 'COLA', 'Q', 'Revues ciblées'];
  const cols = [14, 26, 26, 12, 11, 22, 8, 36, 36, 26, 12, 20, 20, 8, 6, 24].map(wch => ({ wch }));

  const wsVins = XLSX.utils.aoa_to_sheet([header]);
  wsVins['!cols'] = cols;
  wsVins['!autofilter'] = { ref: 'A1:P1' };

  const wsEx = XLSX.utils.aoa_to_sheet([
    header,
    IMPORT_EXAMPLE_ROW
  ]);
  wsEx['!cols'] = cols;

  const wsHelp = XLSX.utils.aoa_to_sheet([
    ["Mode d'emploi - Import groupé"],
    [],
    ["1. Remplissez l'onglet « Vins » : une ligne par vin, sans modifier l'ordre des colonnes."],
    ['2. Colonnes obligatoires : Pays · Domaine ou Marque · Dénomination · Couleur · Millésime.'],
    ['3. Colonnes facultatives : Cépage · Degré · Lien externe · Commentaire · Importateur US · U.S. Price · Case Production (9L) · Cases Imported (9L) · COLA · Q · Revues ciblées.'],
    ['4. Couleur : Rouge, Blanc, Rosé ou Orange (orthographe exacte, avec majuscule).'],
    ["5. Sélectionnez les lignes remplies (l'en-tête peut être inclus, il est ignoré), copiez (Ctrl+C)"],
    ["   puis collez-les (Ctrl+V) dans la zone de texte de la fenêtre « Import groupé »."],
    [],
    ["6. Q : Q1 à Q4 (trimestre d'envoi, tag automatique). Revues ciblées : WS, WE, Vinous, JS, WA, W&S, Dec., séparées par une virgule (nécessite un Q)."],
    ["7. U.S. Price : montant en dollars (24 ou 24,50). Case Production et Cases Imported : nombre de caisses de 9 L. COLA : Oui ou Non."],
    ["8. Un vin déjà présent dans l'année (même Domaine, Dénomination et Millésime) n'est pas recréé : les cellules remplies remplacent ses valeurs (par exemple un nouveau U.S. Price) ; une cellule vide ne supprime rien."],
    ["9. Importateur US : s'il est laissé vide, il est rempli automatiquement d'après le pays (France et Argentine : PARDELA USA ; Chili : WINESELLERS ; Espagne : PARDELA USA, sauf Contracorriente, Harmonia et Campo Eliseo : VINAMERICAS). Un importateur saisi dans la cellule est conservé."],
    [],
    ["L'onglet « Exemple » montre le format attendu : ne le collez pas."]
  ]);
  wsHelp['!cols'] = [{ wch: 100 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsVins, 'Vins');
  XLSX.utils.book_append_sheet(wb, wsEx, 'Exemple');
  XLSX.utils.book_append_sheet(wb, wsHelp, "Mode d'emploi");
  XLSX.writeFile(wb, 'template_import_vins.xlsx');
}

function importErrorText(err, lineNo) {
  const key = { few_cols: 'import_err_few', us_price_invalid: 'import_err_us_price', case_prod_invalid: 'import_err_case_prod', cases_imp_invalid: 'import_err_cases_imp', cola_invalid: 'import_err_cola', q_invalid: 'import_err_q', revue_unknown: 'import_err_revue', revues_without_q: 'import_err_revues_q' }[err.code];
  return esc(T(key).replace('{n}', lineNo).replace('{v}', err.value == null ? '' : err.value));
}

function parsePaste() {
  const raw = document.getElementById('pasteInput').value.trim();
  parsedPaste = [];
  pasteErrors = [];
  raw.split('\n').filter(l => l.trim()).forEach((line, i) => {
    const sep = line.includes('\t') ? '\t' : ';';
    const cols = line.split(sep).map(c => c.trim());
    if (/^(pays|país)$/i.test(cols[0])) return; // ligne d'en-tête du template
    const res = parseImportLine(cols, REVUES);
    if (res.error) { pasteErrors.push(importErrorText(res.error, i + 1)); return; }
    parsedPaste.push(res.row);
  });
  renderPastePreview();
}

// « 2 vins », « 1 vin » : la clé de traduction contient « singulier|pluriel ».
function pl(n, key) {
  const [one, many] = T(key).split('|');
  return n + ' ' + (n > 1 ? (many || one) : one);
}

// Étape 3 : synthèse, erreurs, tableau de vérification, texte du pied et libellé du bouton.
function renderPastePreview() {
  const plan = classifyImport(parsedPaste, wines);
  const hasPatch = p => Object.keys(p.patch).length > 0;
  const nNew = plan.filter(p => p.status === 'new').length;
  const nTag = plan.filter(p => p.status === 'exists' && hasPatch(p)).length;
  const nSkip = plan.length - nNew - nTag;
  const nLines = parsedPaste.length + pasteErrors.length;
  const cols = T('import_cols').split(' · ');
  const revLabels = ids => ids.map(id => { const rv = REVUES.find(x => x.id === id); return rv ? rv.label : id; }).join(', ');
  const detail = r => [['lbl_cepage', r.cepage], ['lbl_degre', r.degre], ['lbl_lien', r.lienExterne], ['lbl_comment', r.commentaire], ['lbl_importateur_us', r.importateurUS],
    ['lbl_us_price', r.prixUS == null ? '' : formatUsPrice(r.prixUS, locale())], ['lbl_case_prod', r.caseProduction == null ? '' : formatCount(r.caseProduction, locale())],
    ['lbl_cases_imp', r.casesImported == null ? '' : formatCount(r.casesImported, locale())], ['lbl_cola', r.cola ? (r.cola === 'oui' ? T('cola_yes') : T('cola_no')) : '']]
    .filter(([, v]) => v).map(([k, v]) => T(k) + ' : ' + v).join('\n');
  // « U.S. Price : $24 → $26 » : libellé de la colonne, ancienne et nouvelle valeur
  const fieldCol = { pays: 0, couleur: 3, cepage: 5, degre: 6, lienExterne: 7, commentaire: 8, importateurUS: 9, prixUS: 10, caseProduction: 11, casesImported: 12, cola: 13, trimestre: 14, cibleRevues: 15 };
  const showVal = (field, v) => {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) return '∅';
    if (field === 'prixUS') return formatUsPrice(v, locale());
    if (field === 'caseProduction' || field === 'casesImported') return formatCount(v, locale());
    if (field === 'cola') return v === 'oui' ? T('cola_yes') : T('cola_no');
    if (field === 'cibleRevues') return revLabels(v);
    const t = String(v); return t.length > 28 ? t.slice(0, 27) + '…' : t;
  };
  const changeText = c => cols[fieldCol[c.field]] + ' : ' + showVal(c.field, c.from) + ' → ' + showVal(c.field, c.to);
  const stateHTML = p => {
    if (p.status === 'new') return '<span class="imp-state is-new">● ' + esc(T('import_state_new')) + '</span>';
    if (p.status === 'exists' && hasPatch(p)) return '<span class="imp-state is-tag">● ' + esc(T('import_state_exists') + ' · ' + pl(p.changes.length, 'import_state_fields')) + '</span>';
    return '<span class="imp-state is-skip">● ' + esc(p.status === 'repeat' ? T('import_state_repeat') : T('import_state_exists') + ' · ' + T('import_state_same')) + '</span>';
  };
  const none = '<span class="imp-none">-</span>';
  const head = '<div class="imp-grid is-head"><span>' + T('import_col_state') + '</span><span>' + T('import_col_wine') + '</span><span>' + esc(cols[0]) + '</span><span>' + esc(cols[14]) + '</span><span>' + T('import_col_revues_short') + '</span><span></span></div>';
  const rows = parsedPaste.map((r, i) =>
    '<div class="imp-grid' + (plan[i].status === 'new' ? '' : hasPatch(plan[i]) ? ' is-tag' : ' is-skip') + '" title="' + esc((plan[i].changes.length ? plan[i].changes.map(changeText).join('\n') + '\n\n' : '') + detail(r)) + '">' +
      stateHTML(plan[i]) +
      '<span><b>' + esc(r.appellation) + '</b><br><span class="imp-sub">' + esc([r.nom, r.millesime, r.couleur].filter(Boolean).join(' · ')) + '</span>' +
        (plan[i].changes.length ? '<br><span class="imp-diff">' + esc(plan[i].changes.slice(0, 2).map(changeText).join(' · ') + (plan[i].changes.length > 2 ? ' · +' + (plan[i].changes.length - 2) : '')) + '</span>' : '') + '</span>' +
      '<span>' + esc(r.pays) + '</span>' +
      '<span>' + (r.trimestre ? trimBadge(r.trimestre) : none) + '</span>' +
      '<span>' + (r.cibleRevues.length ? esc(revLabels(r.cibleRevues)) : none) + '</span>' +
      '<button class="imp-x" onclick="parsedPaste.splice(' + i + ',1);renderPastePreview()" aria-label="' + esc(T('btn_delete')) + '">&times;</button>' +
    '</div>'
  ).join('');
  const pill = (n, cls, key) => n ? '<span class="imp-pill ' + cls + '">' + pl(n, key) + '</span>' : '';

  document.getElementById('pastePreview').innerHTML = nLines ?
    '<div class="imp-step is-later"><span>' + T('import_step3') + '</span></div>' +
    '<div class="imp-chips">' + pill(nNew, 'is-new', 'import_chip_new') + pill(nTag, 'is-tag', 'import_chip_tag') + pill(nSkip, 'is-skip', 'import_chip_skip') + '</div>' +
    (pasteErrors.length ? '<div class="imp-errors">' + pasteErrors.map(e => '<div>' + e + '</div>').join('') + '</div>' : '') +
    (parsedPaste.length ? '<div class="imp-table-wrap">' + head + rows + '</div><div class="imp-hint">' + T('import_hover_hint') + '</div>' : '')
    : '';

  const done = document.getElementById('pasteDoneText');
  if (done) done.textContent = pl(nLines, 'import_lines_pasted');
  document.getElementById('importStatus').textContent = nLines
    ? pl(nLines, 'import_status_lines') + (pasteErrors.length ? ', ' + pl(pasteErrors.length, 'import_status_errors') : '')
    : T('import_status_empty');
  const btn = document.getElementById('btnImport');
  btn.disabled = false;
  btn.textContent = nNew
    ? T('import_btn') + ' ' + pl(nNew, 'import_wines') + (nTag ? ' ' + T('import_and_tag') + ' ' + nTag : '')
    : nTag ? T('import_tag_only') + ' ' + pl(nTag, 'import_wines') : T('import_btn');
}

async function importPaste() {
  const plan = classifyImport(parsedPaste, wines);
  const toCreate = plan.filter(p => p.status === 'new');
  const toTag = plan.filter(p => p.status === 'exists' && Object.keys(p.patch).length);
  const skipped = plan.length - toCreate.length - toTag.length;
  if (!toCreate.length && !toTag.length) {
    toast(parsedPaste.length ? T('import_nothing') : T('import_status_empty'), 'warn');
    return;
  }
  const btn = document.getElementById('btnImport');
  btn.innerHTML = '<span class="spinner spinner-dark"></span> ' + T('importing');
  btn.disabled = true;
  try {
    const batch = db.batch();
    toCreate.forEach(({ row: r }) => {
      const ref = db.collection('wines').doc();
      batch.set(ref, {
        pays: r.pays, nom: r.nom, appellation: r.appellation,
        couleur: r.couleur, millesime: r.millesime,
        cepage: r.cepage || null, degre: r.degre || null,
        domaine: null, lienExterne: r.lienExterne || null, commentaire: r.commentaire || null,
        importateurUS: r.importateurUS || null,
        prixUS: r.prixUS, caseProduction: r.caseProduction, casesImported: r.casesImported, cola: r.cola || null,
        campagne: currentCampagne,
        trimestre: r.trimestre || null,
        cibleRevues: r.cibleRevues.length ? r.cibleRevues : null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    toTag.forEach(p => batch.update(db.collection('wines').doc(p.existing.id), p.patch));
    await batch.commit();
    closeModal();
    toast('✓ ' + [toCreate.length ? pl(toCreate.length, 'toast_imported') : '', toTag.length ? pl(toTag.length, 'toast_import_tagged') : '', skipped ? pl(skipped, 'toast_import_skipped') : ''].filter(Boolean).join(' · '));
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
    renderPastePreview();
  }
}

// ═══════════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════════

function renderAlertsLegend() {
  const legend = document.getElementById('alertsLegend');
  if (!legend) return;
  const bar = c => '<span style="width:3px;height:12px;border-radius:2px;background:' + c + ';flex-shrink:0"></span>';
  const pill = (cls, mark) => '<span class="plan-pill ' + cls + '">' + mark + '</span>';
  const items = [
    [bar('#ef4444'), T('legend_overdue')],
    [bar('#f59e0b'), T('legend_warning')],
    [pill('p-sent', '✓'), T('legend_sent')],
    [pill('p-todo', '○'), T('legend_todo')],
    [pill('p-soumis', '↗'), T('statut_soumis')],
    [pill('p-refuse', '✕'), T('statut_refuse')],
  ];
  legend.innerHTML = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:10px 14px;margin-bottom:0.75rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);font-size:12px">' +
    '<span style="font-weight:600;color:var(--text-muted);text-transform:uppercase;font-size:11px;letter-spacing:.05em">' + T('legend_title') + '</span>' +
    items.map(([mark, label]) => '<span style="display:flex;align-items:center;gap:6px">' + mark + label + '</span>').join('') +
  '</div>';
}

// Sections repliables du Planning : l'état ouvert/fermé survit aux rafraîchissements en direct.
const planOpen = { done: false, closed: true };

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Pastilles critiques d'un vin : une par critique ciblé (✓ servi, ○ à faire, ↗ soumis, ✕ refusé),
// plus les critiques non ciblés qui ont reçu le vin (précédés de « + »).
function planPillsHTML(w, wrs) {
  const cibles = w.cibleRevues || [];
  const statutOf = rid => ((wrs[w.id] && wrs[w.id][rid]) || { statut: 'pending' }).statut;
  const labels = { 'noté': T('statut_note'), 'envoyé': T('statut_envoye'), 'reçu': T('statut_recu'), 'soumis': T('statut_soumis'), 'refusé': T('statut_refuse'), 'pending': T('plan_todo') };
  const pill = (rid, plus) => {
    const r = REVUES.find(x => x.id === rid);
    const st = statutOf(rid);
    let cls = 'p-todo', mark = '○';
    if (st === 'refusé') { cls = 'p-refuse'; mark = '✕'; }
    else if (st === 'soumis') { cls = 'p-soumis'; mark = '↗'; }
    else if (SENT_STATUTS.includes(st)) { cls = 'p-sent'; mark = '✓'; }
    return '<span class="plan-pill ' + cls + '" title="' + esc((r ? r.full : rid) + ' - ' + (labels[st] || st)) + '">' +
      (plus ? '+' : '') + esc(r ? r.label : rid) + ' ' + mark + '</span>';
  };
  const extras = REVUES.filter(r => !cibles.includes(r.id) && statutOf(r.id) !== 'pending').map(r => r.id);
  return cibles.map(rid => pill(rid, false)).join('') + extras.map(rid => pill(rid, cibles.length > 0)).join('');
}

function planTagHTML(e) {
  if (e.state === 'overdue') return '<span class="deadline-tag deadline-urgent">' + T('plan_late') + ' · ' + e.t.id + '</span>';
  if (e.state === 'warning') return '<span class="deadline-tag deadline-soon">J-' + e.daysLeft + ' · ' + e.t.id + '</span>';
  if (e.state === 'sent') return '<span class="deadline-tag deadline-ok">' + e.t.id + ' ✓</span>';
  if (e.state === 'closed') return '<span class="deadline-tag" style="background:var(--gray-bg);color:var(--gray-text)">' + T('alert_closed') + ' · ' + e.t.id + '</span>';
  return '<span class="deadline-tag" style="background:var(--gray-bg);color:var(--gray-text)">' + e.t.id + ' · J-' + e.daysLeft + '</span>';
}

function planRowHTML(e, wrs, withTag) {
  const w = e.w;
  const cibles = w.cibleRevues || [];
  const cls = e.state === 'overdue' ? ' is-overdue' : e.state === 'warning' ? ' is-warning' : e.state === 'sent' ? ' is-done' : '';
  const pills = planPillsHTML(w, wrs);
  const count = cibles.length > 1 ? '<span class="plan-count">' + (cibles.length - e.remaining.length) + '/' + cibles.length + '</span>' : '';
  const pillsRow = pills
    ? '<div class="plan-pills">' + pills + count + '</div>'
    : '<div class="plan-pills"><span class="plan-count">' + esc(T('plan_no_target')) + '</span></div>';
  const btn = e.state === 'sent' ? '' :
    '<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();sendFromPlanning(\'' + w.id + '\')">' + T('plan_send') + '</button>';
  return '<div class="plan-row' + cls + '" onclick="openWineDetail(\'' + w.id + '\')">' +
    '<div class="plan-main">' +
      '<div class="plan-name">' + esc(w.appellation) + ' ' + (w.millesime || '') + '</div>' +
      '<div class="plan-sub">' + esc(w.pays) + (w.nom ? ' · ' + esc(w.nom) : '') + '</div>' +
      pillsRow +
    '</div>' +
    '<div class="plan-side">' + (withTag ? planTagHTML(e) : '') + btn + '</div>' +
  '</div>';
}

function planFoldHTML(key, title, count, inner) {
  return '<details class="plan-fold"' + (planOpen[key] ? ' open' : '') + ' ontoggle="planOpen.' + key + '=this.open">' +
    '<summary>' + title + ' (' + count + ')</summary>' + inner + '</details>';
}

function planSummaryHTML(sec) {
  const late = sec.now.filter(e => e.state === 'overdue').length;
  const soon = sec.now.filter(e => e.state === 'warning').length;
  const part = (n, label, cls) => '<span' + (cls ? ' class="' + cls + '"' : '') + '><b>' + n + '</b> ' + label + '</span>';
  const parts = [];
  if (sec.closed.length) {
    parts.push(part(sec.closed.length, T('plan_closed_short')));
  } else {
    parts.push(part(sec.now.length, T('plan_to_send')));
    if (late) parts.push(part(late, T('stat_late'), 'is-late'));
    if (soon) parts.push(part(soon, T('stat_soon'), 'is-soon'));
    if (sec.upcoming.length) parts.push(part(sec.upcoming.length, T('plan_upcoming_short')));
  }
  parts.push(part(sec.done.length, T('plan_n_done')));
  return '<div class="plan-summary">' + parts.join('') + '</div>';
}

function sendFromPlanning(wineId) {
  const w = wines.find(x => x.id === wineId);
  openShipmentModal(wineId, w ? remainingRevues(w, shipmentItems, SENT_STATUTS) : []);
}

function renderAlerts() {
  updateAlertBadge();
  renderAlertsLegend();

  const list = document.getElementById('alertsList');
  if (!list) return;

  const searchEl = document.getElementById('alertSearch');
  const fPaysEl = document.getElementById('alertFilterPays');
  const fTrimEl = document.getElementById('alertFilterTrimestre');
  const fCritEl = document.getElementById('alertFilterCritique');
  const search = searchEl ? (searchEl.value || '').toLowerCase() : '';
  const fPays = fPaysEl ? fPaysEl.value : '';
  const fTrim = fTrimEl ? fTrimEl.value : '';
  const fCrit = fCritEl ? fCritEl.value : '';

  const tagged = wines.filter(w => w.trimestre);
  if (!tagged.length) {
    list.innerHTML = '<div class="empty" style="padding:24px">' + T('alert_empty') + '<br>' +
      '<span style="font-size:12px;color:var(--text-faint)">' + T('alert_empty_hint') + '</span></div>';
    return;
  }

  const filtered = tagged.filter(w => {
    if (fTrim && w.trimestre !== fTrim) return false;
    if (search && !(w.nom || '').toLowerCase().includes(search) && !(w.appellation || '').toLowerCase().includes(search) && !(w.pays || '').toLowerCase().includes(search)) return false;
    if (fPays && w.pays !== fPays) return false;
    if (fCrit && !(w.cibleRevues || []).includes(fCrit)) return false;
    return true;
  });
  if (!filtered.length) {
    list.innerHTML = '<div class="empty" style="padding:24px">' + T('tracker_empty') + '</div>';
    return;
  }

  const wrs = getWineRevueStatus();
  const sec = planningSections(filtered, shipmentItems, currentCampagne, new Date(), TRIMESTRES, SENT_STATUTS);
  const head = title => '<div class="plan-section-head">' + title + '</div>';
  const rows = (entries, withTag) => entries.map(e => planRowHTML(e, wrs, withTag)).join('');
  const locale = LANG === 'es' ? 'es-ES' : 'fr-FR';

  let html = planSummaryHTML(sec);

  if (sec.now.length) {
    html += head(T('plan_now') + ' (' + sec.now.length + ')') + rows(sec.now, true);
  } else if (!sec.closed.length) {
    html += '<div class="plan-empty">' + T('plan_nothing') + '</div>';
  }

  if (sec.upcoming.length) {
    html += head(T('plan_upcoming') + ' (' + sec.upcoming.length + ')');
    TRIMESTRES.forEach(t => {
      const group = sec.upcoming.filter(e => e.t.id === t.id);
      if (!group.length) return;
      const end = getTrimestreEnd(t.id).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
      html += '<div class="plan-qhead">' + trimBadge(t.id) + ' ' + T(t.id.toLowerCase() + '_label') +
        ' <span class="plan-qdate">' + T('plan_until') + ' ' + end + '</span></div>' + rows(group, false);
    });
  }

  if (sec.closed.length) html += planFoldHTML('closed', T('plan_closed'), sec.closed.length, rows(sec.closed, true));
  if (sec.done.length) html += planFoldHTML('done', T('plan_done'), sec.done.length, rows(sec.done, true));

  list.innerHTML = html;
}
function openHelpModal() {
  const sectionsAll = {
fr: [
    { num:'1', title:'Connexion', steps:[
      'Saisissez le mot de passe fourni par l\'administrateur. La session reste active dans l\'onglet.',
    ]},
    { num:'2', title:'Navigation - 3 onglets', steps:[
      '<strong>📋 Tracker</strong> - vue principale de tous vos envois : statuts, notes, tri, filtres.',
      '<strong>🍷 Catalogue</strong> - liste de tous vos vins : ajout, import groupé, suppression, taguage trimestre.',
      '<strong>📅 Planning</strong> - vue par trimestre des vins à envoyer avec code couleur.',
      '<strong>Année (en haut)</strong> - chaque année est une campagne séparée : vins, envois, planning et exports. Une année passée devient une archive : modifiable, mais sans alerte.',
    ]},
    { num:'3', title:'Catalogue - gérer vos vins', steps:[
      '<strong>+ Ajouter un vin</strong> - remplissez Pays, Domaine/Marque, Dénomination, Couleur, Millésime (obligatoires). Champs optionnels : Cépage, Degré, MAD, Importateur US, Marché US (U.S. Price, Case Production, Cases Imported, COLA), Lien externe, Commentaire.',
      '<strong>MAD (mise à disposition)</strong> - date à laquelle le vin est disponible pour envoi. Visible dans le tableau du Catalogue. Uniquement présent dans Ajouter/Modifier, pas dans l\'import groupé.',
      '<strong>📋 Import groupé</strong> - téléchargez le template Excel, remplissez-le puis collez les lignes. Ordre : Pays · Domaine · Dénomination · Couleur · Millésime · Cépage · Degré · Lien · Commentaire · Importateur US · U.S. Price · Case Production (9L) · Cases Imported (9L) · COLA · Q · Revues ciblées (ces deux dernières posent les tags automatiquement).',
      '<strong>Doublons</strong> - un vin déjà présent dans l\'année (même Domaine + Dénomination + Millésime) n\'est jamais recréé : ni à l\'import, ni à l\'ajout, ni à la duplication, ni à la modification (« Dupliquer » ouvre une copie à modifier : changez le domaine, la dénomination ou le millésime avant d\'enregistrer). À l\'import, il est signalé « Déjà présent » et mis à jour : les cellules remplies remplacent ses valeurs (par exemple un nouveau U.S. Price), une cellule vide ne supprime rien. L\'aperçu montre chaque changement avant l\'import.',
      '<strong>Sélection groupée</strong> - cochez des vins pour faire apparaître <em>Supprimer (N)</em> et <em>Taguer (N)</em>. La case en en-tête sélectionne tout.',
    ]},
    { num:'4', title:'Trimestres - tagger les vins', steps:[
      'Sélectionnez des vins dans le Catalogue, cliquez <strong>Taguer (N)</strong>, choisissez le trimestre :',
      '<span style="display:inline-flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
        ['Q1 Jan-Mars','Q2 Avr-Juin','Q3 Juil-Sept','Q4 Oct-Déc'].map((l,i) => {
          const c=['#3b82f6','#10b981','#f59e0b','#8b5cf6'][i], q=['Q1','Q2','Q3','Q4'][i];
          return '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:'+c+'22;color:'+c+';border:1px solid '+c+'44"><strong>'+q+'</strong> '+l.slice(3)+'</span>';
        }).join('') +
      '</span>',
      'Fin de trimestre : 31/03 · 30/06 · 30/09 · 31/12. Pour retirer un tag : <em>Retirer le tag</em> dans le modal.',
    ]},
    { num:'5', title:'Créer un envoi', steps:[
      'Dans le Tracker, cliquez <strong>+ Nouvel envoi</strong>.',
      '<strong>Étape 1</strong> - Sélectionnez un ou plusieurs vins (recherche disponible).',
      '<strong>Étape 2</strong> - Cochez les revues ciblées : WS, WE, Vinous, JS, WA, W&S, Decanter.',
      '<strong>Étape 3</strong> - Renseignez soit la date d\'envoi, soit la date de soumission (une seule des deux, obligatoire), et l\'intermédiaire (optionnel). Un champ tracking distinct apparaît pour chaque revue cochée.',
    ]},
    { num:'6', title:'Statuts de suivi', steps:[
      'Cliquez sur une ligne du Tracker pour ouvrir la fiche vin, puis sur le crayon d\'un enregistrement.',
      '<span style="display:inline-flex;gap:8px;flex-wrap:wrap;margin-top:2px">' +
        [['soumis','#faeeda','#633806'],['envoyé','#eaf3de','#3b6d11'],['reçu','#e6f1fb','#185fa5'],['noté','#eeedfe','#534ab7'],['refusé','#fcebeb','#a32d2d']].map(([s,bg,c]) =>
          '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:'+bg+';color:'+c+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</span>'
        ).join('') +
      '</span>',
      '<strong>Soumis</strong> : le vin a été soumis (ex : à un intermédiaire) mais pas encore réellement expédié au critique - il reste considéré comme non envoyé pour les alertes de trimestre et le filtre Catalogue.',
      'Pour <strong>Noté</strong> : saisissez la note reçue (ex: 92). Un vin est "envoyé" dès qu\'un enregistrement a le statut Envoyé, Reçu, Noté ou Refusé.',
      '<strong>Refusé</strong> : le critique a décliné la dégustation/publication de ce vin.',
      'Suppression possible : enregistrement individuel (icône poubelle) ou envoi entier depuis la fiche vin. Le crayon à côté de la date d\'un envoi permet de la modifier après coup.',
    ]},
        { num:'7', title:'Planning - que dois-je envoyer ?', steps:[
      'L\'onglet Planning répond à « que dois-je envoyer maintenant ? ». Il liste d\'abord <strong>À envoyer maintenant</strong> (vins en retard et vins du trimestre en cours), puis <strong>À venir</strong> (trimestres futurs, avec leur date limite), puis <strong>Terminés</strong> (replié).',
      'Un vin est <strong>terminé</strong> quand tous ses critiques ciblés ont reçu l\'envoi (Envoyé, Reçu, Noté ou Refusé). Un vin à 1/2 reste donc à envoyer, avec le critique restant en pointillé.',
      '<strong>Envoyer</strong> ouvre un nouvel envoi avec le vin et les critiques restants déjà cochés, et la date du jour.',
      '<span style="display:inline-flex;flex-direction:column;gap:5px;margin-top:2px">' +
        [['#ef4444','Filet rouge - trimestre terminé, vin pas encore servi à tous les critiques ciblés'],
         ['#f59e0b','Filet orange - 30 jours ou moins avant la fin du trimestre'],
         ['#3b6d11','✓ vert - envoyé (Envoyé / Reçu / Noté)'],
         ['#9e9890','○ pointillé - à faire ; ↗ ambre - soumis ; ✕ rouge - refusé'],
         ['#6b7280','Gris « Clôturé » - année terminée, vin non envoyé : le 1er janvier, un vin non envoyé passe directement de l\'orange au gris, sans passer par le rouge']].map(([c,l]) =>
          '<span style="display:flex;align-items:center;gap:8px;font-size:12px"><span style="width:8px;height:8px;border-radius:50%;background:'+c+';flex-shrink:0"></span>'+l+'</span>'
        ).join('') +
      '</span>',
    ]},
    { num:'8', title:'Tracker - tri et filtres', steps:[
      '<strong>Tri</strong> - cliquez sur un en-tête de colonne (Pays, Domaine, Dénomination, Mill., Couleur, Q, Note). Un 2ème clic inverse l\'ordre.',
      '<strong>Filtres</strong> - Recherche texte · Pays · Revue · Statut · Trimestre, tous combinables. Quand une revue est choisie, le statut s\'applique à cette revue : par exemple WS + Non envoyé = ce qu\'il reste à envoyer à WS.',
      '<strong>Vue tableau / cartes</strong> - boutons ▤ / ⊞ en haut à droite de la barre de filtres.',
      '<strong>↺ Réinitialiser</strong> - efface tous les filtres actifs, dans le Tracker comme dans le Catalogue.',
    ]},
    { num:'9', title:'Export des données', steps:[
      'Cliquez <strong>⬇ Export CSV</strong> ou <strong>⬇ Export Excel</strong> dans le Tracker pour télécharger les données de l\'année affichée (catalogue + statuts + notes par revue).',
      'Dans le Catalogue, <strong>⬇ Export Excel</strong> télécharge la liste affichée (filtres compris) : les colonnes de l\'import groupé (Q et Revues ciblées comprises), puis MAD, Envois et la date d\'ajout.',
    ]},
    { num:'10', title:'Saisie assistée', steps:[
      'Dans <strong>Ajouter un vin</strong>, les champs Pays, Domaine/Marque et Cépage proposent une saisie prédictive basée sur les valeurs déjà présentes dans le catalogue.',
    ]},
  ],
es: [
    { num:'1', title:'Inicio de sesión', steps:[
      'Introduzca la contraseña proporcionada por el administrador. La sesión permanece activa en la pestaña.',
    ]},
    { num:'2', title:'Navegación - 3 pestañas', steps:[
      '<strong>📋 Tracker</strong> - vista principal de todos sus envíos: estados, notas, orden, filtros.',
      '<strong>🍷 Catálogo</strong> - lista de todos sus vinos: añadir, importación agrupada, eliminar, etiquetar por trimestre.',
      '<strong>📅 Planificación</strong> - vista por trimestre de los vinos por enviar con código de color.',
      '<strong>Año (arriba)</strong> - cada año es una campaña separada: vinos, envíos, planificación y exportaciones. Un año pasado pasa a ser un archivo: se puede modificar, pero sin alertas.',
    ]},
    { num:'3', title:'Catálogo - gestionar sus vinos', steps:[
      '<strong>+ Añadir un vino</strong> - complete País, Dominio/Marca, Denominación, Color, Añada (obligatorios). Campos opcionales: Variedad, Grado, MAD, Importador EE. UU., Mercado EE. UU. (U.S. Price, Case Production, Cases Imported, COLA), Enlace externo, Comentario.',
      '<strong>MAD (puesta a disposición)</strong> - fecha en que el vino está disponible para envío. Visible en la tabla del Catálogo. Solo aparece en Añadir/Modificar, no en la importación en bloque.',
      '<strong>📋 Importación agrupada</strong> - descargue la plantilla Excel, rellénela y pegue las filas. Orden: País · Dominio · Denominación · Color · Añada · Variedad · Grado · Enlace · Comentario · Importador EE. UU. · U.S. Price · Case Production (9L) · Cases Imported (9L) · COLA · Q · Revistas objetivo (estas dos últimas aplican las etiquetas automáticamente).',
      '<strong>Duplicados</strong> - un vino ya presente en el año (mismo Dominio + Denominación + Añada) nunca se vuelve a crear: ni al importar, ni al añadir, ni al duplicar, ni al modificar («Duplicar» abre una copia que hay que modificar: cambie el dominio, la denominación o la añada antes de guardar). Al importar se marca «Ya existe» y se actualiza: las celdas rellenas sustituyen sus valores (por ejemplo un nuevo U.S. Price), una celda vacía no borra nada. La vista previa muestra cada cambio antes de importar.',
      '<strong>Selección múltiple</strong> - marque vinos para ver <em>Eliminar (N)</em> y <em>Etiquetar (N)</em>. La casilla del encabezado selecciona todo.',
    ]},
    { num:'4', title:'Trimestres - etiquetar los vinos', steps:[
      'Seleccione vinos en el Catálogo, haga clic en <strong>Etiquetar (N)</strong>, elija el trimestre:',
      '<span style="display:inline-flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
        ['Q1 Ene-Mar','Q2 Abr-Jun','Q3 Jul-Sep','Q4 Oct-Dic'].map((l,i) => {
          const c=['#3b82f6','#10b981','#f59e0b','#8b5cf6'][i], q=['Q1','Q2','Q3','Q4'][i];
          return '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:'+c+'22;color:'+c+';border:1px solid '+c+'44"><strong>'+q+'</strong> '+l.slice(3)+'</span>';
        }).join('') +
      '</span>',
      'Fin de trimestre: 31/03 · 30/06 · 30/09 · 31/12. Para quitar etiqueta: <em>Quitar etiqueta</em> en el modal.',
    ]},
    { num:'5', title:'Crear un envío', steps:[
      'En el Tracker, haga clic en <strong>+ Nuevo envío</strong>.',
      '<strong>Paso 1</strong> - Seleccione uno o varios vinos (búsqueda disponible).',
      '<strong>Paso 2</strong> - Marque las revistas objetivo: WS, WE, Vinous, JS, WA, W&S, Decanter.',
      '<strong>Paso 3</strong> - Indique la fecha de envío o la fecha de presentación (solo una de las dos, obligatoria), y el intermediario (opcional). Aparece un campo de seguimiento independiente para cada revista marcada.',
    ]},
    { num:'6', title:'Estados de seguimiento', steps:[
      'Haga clic en una línea del Tracker para abrir la ficha del vino, luego en el lápiz de un registro.',
      '<span style="display:inline-flex;gap:8px;flex-wrap:wrap;margin-top:2px">' +
        [['Presentado','#faeeda','#633806'],['Enviado','#eaf3de','#3b6d11'],['Recibido','#e6f1fb','#185fa5'],['Evaluado','#eeedfe','#534ab7'],['Rechazado','#fcebeb','#a32d2d']].map(([s,bg,c]) =>
          '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:'+bg+';color:'+c+'">'+s+'</span>'
        ).join('') +
      '</span>',
      '<strong>Presentado</strong>: el vino ha sido presentado (ej: a un intermediario) pero aún no enviado realmente al crítico - sigue considerado como no enviado para las alertas de trimestre y el filtro del Catálogo.',
      'Para <strong>Evaluado</strong>: introduzca la nota recibida (ej: 92). Un vino está "enviado" en cuanto un registro tiene estado Enviado, Recibido, Evaluado o Rechazado.',
      '<strong>Rechazado</strong>: el crítico ha declinado la cata/publicación de este vino.',
      'Eliminación posible: registro individual (icono papelera) o envío completo desde la ficha del vino. El lápiz junto a la fecha de un envío permite modificarla después.',
    ]},
        { num:'7', title:'Planificación - ¿qué debo enviar?', steps:[
      'La pestaña Planificación responde a «¿qué debo enviar ahora?». Lista primero <strong>Por enviar ahora</strong> (vinos atrasados y del trimestre en curso), luego <strong>Próximos</strong> (trimestres futuros, con su fecha límite) y por último <strong>Terminados</strong> (plegado).',
      'Un vino está <strong>terminado</strong> cuando todos sus críticos objetivo han recibido el envío (Enviado, Recibido, Evaluado o Rechazado). Un vino a 1/2 sigue pendiente, con el crítico restante punteado.',
      '<strong>Enviar</strong> abre un nuevo envío con el vino y los críticos restantes ya marcados, y la fecha de hoy.',
      '<span style="display:inline-flex;flex-direction:column;gap:5px;margin-top:2px">' +
        [['#ef4444','Filete rojo - trimestre terminado, vino aún no enviado a todos los críticos objetivo'],
         ['#f59e0b','Filete naranja - 30 días o menos hasta el fin del trimestre'],
         ['#3b6d11','✓ verde - enviado (Enviado / Recibido / Evaluado)'],
         ['#9e9890','○ punteado - por hacer; ↗ ámbar - presentado; ✕ rojo - rechazado'],
         ['#6b7280','Gris «Cerrado» - año terminado, vino no enviado: el 1 de enero, un vino no enviado pasa directamente de naranja a gris, sin pasar por rojo']].map(([c,l]) =>
          '<span style="display:flex;align-items:center;gap:8px;font-size:12px"><span style="width:8px;height:8px;border-radius:50%;background:'+c+';flex-shrink:0"></span>'+l+'</span>'
        ).join('') +
      '</span>',
    ]},
    { num:'8', title:'Tracker - orden y filtros', steps:[
      '<strong>Orden</strong> - haga clic en un encabezado de columna (País, Dominio, Denominación, Añada, Color, Q). Un 2º clic invierte el orden.',
      '<strong>Filtros</strong> - Búsqueda texto · País · Revista · Estado · Trimestre, todos combinables. Si se elige una revista, el estado se aplica a esa revista: por ejemplo WS + No enviado = lo que falta por enviar a WS.',
      '<strong>Vista tabla / tarjetas</strong> - botones ▤ / ⊞ arriba a la derecha de la barra de filtros.',
      '<strong>↺ Restablecer</strong> - borra todos los filtros activos, tanto en el Tracker como en el Catálogo.',
    ]},
    { num:'9', title:'Exportar datos', steps:[
      'Haga clic en <strong>⬇ Exportar CSV</strong> o <strong>⬇ Exportar Excel</strong> en el Tracker para descargar los datos del año mostrado (catálogo + estados + notas por revista)',
      'En el Catálogo, <strong>⬇ Exportar Excel</strong> descarga la lista mostrada (filtros incluidos): las columnas de la importación agrupada (con Q y Revistas objetivo), y luego MAD, Envíos y la fecha de alta.',
    ]},
    { num:'10', title:'Entrada asistida', steps:[
      'En <strong>Añadir un vino</strong>, los campos País, Dominio/Marca y Variedad ofrecen autocompletado basado en los valores ya presentes en el catálogo.',
    ]},
  ],
};

  const sections = sectionsAll[LANG] || sectionsAll.fr;
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
        '<div class="modal-title">' + T('guide_title') + '</div>' +
        '<button class="btn btn-sm" onclick="closeModal()">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' + body + '</div>' +
      '<div class="modal-footer"><button class="btn btn-sm btn-primary" onclick="closeModal()">' + T('btn_close') + '</button></div>' +
    '</div></div>';
  document.querySelector('.modal-overlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}


function exportCSV() {
  const wrs = getWineRevueStatus();
  const header = ['Pays','Domaine ou Marque','Dénomination','Millésime','Couleur','Importateur US','U.S. Price','Case Production (9L)','Cases Imported (9L)','COLA','Cépage','Degré','Lien externe','Commentaire'].concat(
    REVUES.flatMap(r => [r.full + ' statut', r.full + ' note'])
  );
  const rows = wines.map(w => [
    w.pays, w.appellation, w.nom, w.millesime || '', w.couleur, w.importateurUS || '',
    w.prixUS == null ? '' : w.prixUS, w.caseProduction == null ? '' : w.caseProduction, w.casesImported == null ? '' : w.casesImported,
    w.cola === 'oui' ? 'Oui' : w.cola === 'non' ? 'Non' : '',
    w.cepage || '', w.degre || '', w.lienExterne || '', w.commentaire || ''
  ].concat(
    REVUES.flatMap(r => { const i = wrs[w.id] && wrs[w.id][r.id]; return [i ? i.statut : 'pending', i ? i.note : '']; })
  ));
  const csv = [header, ...rows].map(r => r.map(c => '"' + String(c || '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv);
  a.download = 'press_tracker_' + currentCampagne + '_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}

function exportCatalogueXLSX() {
  const wrs = getWineRevueStatus();
  const list = getCatalogueFiltered(wrs);
  if (!list.length) { toast(T('tracker_empty'), 'warn'); return; }
  const rows = list.map(w => {
    const statuts = {};
    Object.entries(wrs[w.id] || {}).forEach(([rid, info]) => { statuts[rid] = info.statut; });
    return catalogueExportRow(w, statuts, REVUES, SENT_STATUTS).concat(w.createdAt ? fmtDate(w.createdAt) : '');
  });
  const ws = XLSX.utils.aoa_to_sheet([CATALOGUE_EXPORT_HEADER.concat('Ajouté le'), ...rows]);
  ws['!cols'] = [14, 26, 26, 12, 11, 22, 8, 36, 36, 26, 6, 24, 12, 8, 12].map(wch => ({ wch }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Catalogue');
  XLSX.writeFile(wb, 'catalogue_' + currentCampagne + '_' + new Date().toISOString().slice(0, 10) + '.xlsx');
  toast('✓ ' + list.length + ' ' + T('toast_exported'));
}

function exportXLSX() {
  const wrs = getWineRevueStatus();
  const header = ['Pays','Domaine ou Marque','Dénomination','Millésime','Couleur','Importateur US','U.S. Price','Case Production (9L)','Cases Imported (9L)','COLA','Cépage','Degré','Lien externe','Commentaire'].concat(
    REVUES.flatMap(r => [r.full + ' statut', r.full + ' note'])
  );
  const rows = wines.map(w => [
    w.pays, w.appellation, w.nom, w.millesime || '', w.couleur, w.importateurUS || '',
    w.prixUS == null ? '' : w.prixUS, w.caseProduction == null ? '' : w.caseProduction, w.casesImported == null ? '' : w.casesImported,
    w.cola === 'oui' ? 'Oui' : w.cola === 'non' ? 'Non' : '',
    w.cepage || '', w.degre || '', w.lienExterne || '', w.commentaire || ''
  ].concat(
    REVUES.flatMap(r => { const i = wrs[w.id] && wrs[w.id][r.id]; return [i ? i.statut : 'pending', i ? i.note : '']; })
  ));
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Press Tracker');
  XLSX.writeFile(wb, 'press_tracker_' + currentCampagne + '_' + new Date().toISOString().slice(0, 10) + '.xlsx');
}

// ═══════════════════════════════════════════════════════════
// EVENT BINDINGS
// ═══════════════════════════════════════════════════════════

document.getElementById('btnLogin').addEventListener('click', doLogin);
document.getElementById('pwdInput').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('btnLogout').addEventListener('click', doLogout);
document.getElementById('btnExport').addEventListener('click', exportCSV);
document.getElementById('btnExportXlsx').addEventListener('click', exportXLSX);
document.getElementById('btnExportCatalogue').addEventListener('click', exportCatalogueXLSX);
document.getElementById('btnResetTracker').addEventListener('click', resetTrackerFilters);
document.getElementById('btnResetCatalogue').addEventListener('click', resetCatalogueFilters);
document.getElementById('btnNewShipment').addEventListener('click', () => openShipmentModal());
document.getElementById('btnAddWine').addEventListener('click', () => openAddWineModal());
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
document.getElementById('alertSearch').addEventListener('input', renderAlerts);
document.getElementById('alertFilterPays').addEventListener('change', renderAlerts);
document.getElementById('alertFilterTrimestre').addEventListener('change', renderAlerts);
document.getElementById('alertFilterCritique').addEventListener('change', renderAlerts);
document.getElementById('btnResetAlerts').addEventListener('click', resetAlertsFilters);

document.addEventListener('input', e => { if (e.target.closest && e.target.closest('.modal')) modalDirty = true; });
document.addEventListener('change', e => { if (e.target.closest && e.target.closest('.modal')) modalDirty = true; });

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768 && trackerView === 'table') setTrackerView('card');
});
