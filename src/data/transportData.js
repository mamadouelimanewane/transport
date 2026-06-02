// ══════════════════════════════════════════════════════════════
//  SenBus v4 ALL FEATURES — Données transport Dakar
// ══════════════════════════════════════════════════════════════

export const OPERATORS = {
  DDD:  { id:'DDD',  name:'DDD',  fullName:'Dakar Dem Dikk',        icon:'🚌', color:'#1a56db', bg:'#eff6ff', tarif:200, climatise:false },
  AFTU: { id:'AFTU', name:'AFTU', fullName:'AFTU Car Rapide',        icon:'🚐', color:'#e11d48', bg:'#fff1f2', tarif:150, climatise:false },
  BRT:  { id:'BRT',  name:'BRT',  fullName:'Bus Rapid Transit',      icon:'🚍', color:'#7c3aed', bg:'#f5f3ff', tarif:300, climatise:true },
  TER:  { id:'TER',  name:'TER',  fullName:'Train Express Régional', icon:'🚆', color:'#059669', bg:'#ecfdf5', tarif:500, climatise:true },
};

// ── Tarifs TER ────────────────────────────────────────────────
export const TER_TARIFS = [
  { from:'Dakar', to:'Thiaroye',   prix:500,  classe:'2e' },
  { from:'Dakar', to:'Rufisque',   prix:900,  classe:'2e' },
  { from:'Dakar', to:'Bargny',     prix:1200, classe:'2e' },
  { from:'Dakar', to:'Diamniadio', prix:1500, classe:'2e' },
  { from:'Dakar', to:'AIBD',       prix:2000, classe:'2e' },
];

export const TER_ABONNEMENTS = [
  { id:'m-dk-th', label:'Mensuel Dakar ↔ Thiaroye',   prix:12000, trajets:'Illimité', icon:'🚆' },
  { id:'m-dk-rf', label:'Mensuel Dakar ↔ Rufisque',   prix:20000, trajets:'Illimité', icon:'🚆' },
  { id:'m-dk-dm', label:'Mensuel Dakar ↔ Diamniadio', prix:30000, trajets:'Illimité', icon:'🚆' },
  { id:'m-dk-ab', label:'Pass AIBD mensuel',           prix:38000, trajets:'Illimité', icon:'✈️' },
  { id:'c10-rf',  label:'Carnet 10 trajets Rufisque',  prix:8000,  trajets:'10',       icon:'🎟️' },
];

// ── 40 POI populaires de Dakar ────────────────────────────────
export const POI = [
  { id:'poi-ucad',    name:'UCAD — Université Cheikh Anta Diop', lat:14.6925, lng:-17.4628, category:'Éducation',  emoji:'🎓', nearestStop:'p06' },
  { id:'poi-aibd',    name:'Aéroport AIBD Blaise Diagne',       lat:14.7411, lng:-17.0900, category:'Transport',  emoji:'✈️', nearestStop:'t06' },
  { id:'poi-hop',     name:'Hôpital Principal de Dakar',          lat:14.6889, lng:-17.4469, category:'Santé',      emoji:'🏥', nearestStop:'p03' },
  { id:'poi-fann',    name:'Hôpital de Fann',                     lat:14.6956, lng:-17.4700, category:'Santé',      emoji:'🏥', nearestStop:'p06' },
  { id:'poi-abass',   name:'Hôpital Abass Ndao',                  lat:14.6850, lng:-17.4500, category:'Santé',      emoji:'🏥', nearestStop:'p05' },
  { id:'poi-sand',    name:'Marché Sandaga',                      lat:14.6756, lng:-17.4436, category:'Commerce',   emoji:'🛒', nearestStop:'p03' },
  { id:'poi-tilen',   name:'Marché Tilène',                       lat:14.6788, lng:-17.4428, category:'Commerce',   emoji:'🛒', nearestStop:'p05' },
  { id:'poi-hlm',     name:'Marché HLM',                          lat:14.7008, lng:-17.4575, category:'Commerce',   emoji:'🛒', nearestStop:'lc2' },
  { id:'poi-colob',   name:'Marché Colobane',                     lat:14.6908, lng:-17.4478, category:'Commerce',   emoji:'🛒', nearestStop:'p04' },
  { id:'poi-castor',  name:'Marché Castor',                       lat:14.7150, lng:-17.4400, category:'Commerce',   emoji:'🛒', nearestStop:'lb6' },
  { id:'poi-port',    name:'Port Autonome de Dakar',              lat:14.6678, lng:-17.4247, category:'Transport',  emoji:'⚓', nearestStop:'p01' },
  { id:'poi-goree',   name:'Île de Gorée (Embarcadère)',          lat:14.6742, lng:-17.4278, category:'Tourisme',   emoji:'🏝️', nearestStop:'p01' },
  { id:'poi-stade',   name:'Stade Léopold Sédar Senghor',         lat:14.7050, lng:-17.4383, category:'Sport',      emoji:'⚽', nearestStop:'lb5' },
  { id:'poi-cices',   name:'CICES — Foire Internationale',        lat:14.7342, lng:-17.4681, category:'Culture',    emoji:'🎪', nearestStop:'b05' },
  { id:'poi-place',   name:'Place de l\'Indépendance',            lat:14.6712, lng:-17.4444, category:'Tourisme',   emoji:'🏛️', nearestStop:'p02' },
  { id:'poi-palais',  name:'Palais de la République',             lat:14.6639, lng:-17.4378, category:'Gouvernement',emoji:'🏛️', nearestStop:'p01' },
  { id:'poi-assemb',  name:'Assemblée Nationale',                 lat:14.6731, lng:-17.4422, category:'Gouvernement',emoji:'🏛️', nearestStop:'p02' },
  { id:'poi-vdn',     name:'VDN — Voie de Dégagement Nord',      lat:14.7300, lng:-17.4200, category:'Transport',  emoji:'🛣️', nearestStop:'lb5' },
  { id:'poi-almad',   name:'Les Almadies — Pointe des Almadies', lat:14.7481, lng:-17.5289, category:'Tourisme',   emoji:'🌊', nearestStop:'al1' },
  { id:'poi-ngor',    name:'Plage de Ngor',                       lat:14.7464, lng:-17.5178, category:'Tourisme',   emoji:'🏖️', nearestStop:'ng1' },
  { id:'poi-ren',     name:'Monument de la Renaissance',          lat:14.7225, lng:-17.5003, category:'Tourisme',   emoji:'🗽', nearestStop:'ok1' },
  { id:'poi-grande',  name:'Grande Mosquée de Dakar',             lat:14.6867, lng:-17.4506, category:'Religion',   emoji:'🕌', nearestStop:'p04' },
  { id:'poi-cathed',  name:'Cathédrale de Dakar',                 lat:14.6742, lng:-17.4456, category:'Religion',   emoji:'⛪', nearestStop:'p03' },
  { id:'poi-ifan',    name:'Musée IFAN — Arts Africains',         lat:14.6711, lng:-17.4458, category:'Culture',    emoji:'🏛️', nearestStop:'p02' },
  { id:'poi-sea',     name:'Sea Plaza Mall',                      lat:14.7050, lng:-17.4758, category:'Commerce',   emoji:'🏬', nearestStop:'p07' },
  { id:'poi-magic',   name:'Magic Land (Parc)',                   lat:14.7469, lng:-17.5100, category:'Loisirs',    emoji:'🎢', nearestStop:'ng1' },
  { id:'poi-dakar2',  name:'Gare Routière Baux Maraîchers',      lat:14.7192, lng:-17.3997, category:'Transport',  emoji:'🚌', nearestStop:'bm1' },
  { id:'poi-lac',     name:'Lac Rose — Lac Retba',                lat:14.8403, lng:-17.2339, category:'Tourisme',   emoji:'🌅', nearestStop:'ba1' },
  { id:'poi-tribunal',name:'Tribunal de Grande Instance',         lat:14.6742, lng:-17.4300, category:'Gouvernement',emoji:'⚖️', nearestStop:'p01' },
  { id:'poi-bcao',    name:'BCEAO — Banque Centrale',             lat:14.6722, lng:-17.4389, category:'Finance',    emoji:'🏦', nearestStop:'p02' },
  { id:'poi-elim',    name:'Stade Abdoulaye Wade (Diamniadio)',   lat:14.7289, lng:-17.1742, category:'Sport',      emoji:'🏟️', nearestStop:'t05' },
  { id:'poi-tech',    name:'Technopole (Zone Franche)',           lat:14.7233, lng:-17.4350, category:'Business',   emoji:'🏢', nearestStop:'lb5' },
  { id:'poi-expo',    name:'Centre Expo FIARA',                   lat:14.7342, lng:-17.4681, category:'Business',   emoji:'📊', nearestStop:'b05' },
  { id:'poi-km',      name:'Marché Keur Massar',                  lat:14.7833, lng:-17.3183, category:'Commerce',   emoji:'🛒', nearestStop:'km1' },
  { id:'poi-guedi',   name:'Marché Guédiawaye',                   lat:14.7769, lng:-17.3986, category:'Commerce',   emoji:'🛒', nearestStop:'gd1' },
  { id:'poi-pikine',  name:'Gare Routière Pikine',                lat:14.7499, lng:-17.3858, category:'Transport',  emoji:'🚌', nearestStop:'pk1' },
  { id:'poi-rufisque',name:'Marché de Rufisque',                  lat:14.7153, lng:-17.2747, category:'Commerce',   emoji:'🛒', nearestStop:'rf1' },
  { id:'poi-universi',name:'Université Amadou Mahtar Mbow',       lat:14.7300, lng:-17.1700, category:'Éducation',  emoji:'🎓', nearestStop:'t05' },
  { id:'poi-radio',   name:'RTS — Radio Télévision Sénégalaise',  lat:14.7117, lng:-17.4567, category:'Média',      emoji:'📻', nearestStop:'lc1' },
  { id:'poi-yoff',    name:'Village de Yoff',                     lat:14.7467, lng:-17.4903, category:'Tourisme',   emoji:'🏘️', nearestStop:'yf1' },
];

// ── Calendrier sénégalais (affluence) ─────────────────────────
export const MARCHES = { 0:'Sandaga/Castor', 1:'Tilène/HLM', 2:'Sandaga', 3:'Colobane/Tilène', 4:'Sandaga/HLM', 5:'Tous les marchés', 6:'Repos' };
export const PRIERES = ['Fajr 05h30','Dhuhr 13h30','Asr 16h00','Maghrib 19h00','Isha 20h30'];
export const FETES_SN = ['01-01','04-04','05-01','08-15','11-01','12-25','Korité','Tabaski','Maouloud','Grand Magal'];

// ── Horaires TER réels (toutes les 30 min) ────────────────────
export function getTerSchedule(gareName) {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const currentMin = h * 60 + m;
  const start = gareName === 'Dakar' ? 270 : gareName === 'AIBD' ? 300 : 285; // 4h30, 5h00, 4h45
  const end   = gareName === 'Dakar' ? 1410 : 1380; // 23h30, 23h00
  const trains = [];
  for (let t = start; t <= end; t += 30) {
    if (t >= currentMin - 5) {
      const hh = Math.floor(t / 60).toString().padStart(2, '0');
      const mm = (t % 60).toString().padStart(2, '0');
      const wait = t - currentMin;
      trains.push({
        time: `${hh}:${mm}`,
        waitMin: Math.max(0, wait),
        direction: t % 60 === 0 ? 'AIBD →' : '← Dakar',
      });
      if (trains.length >= 5) break;
    }
  }
  return trains;
}

// ── Indice de confort thermique ────────────────────────────────
export function getComfortIndex(operatorId) {
  const h = new Date().getHours();
  const op = OPERATORS[operatorId];
  if (!op) return { score: 3, label: 'Moyen', color: '#d97706', emoji: '🌤️' };
  const isHotHour = h >= 11 && h <= 16;
  const isRush = (h >= 7 && h <= 9) || (h >= 17 && h <= 20);

  if (op.climatise) {
    return isRush
      ? { score: 4, label: 'Bon (climatisé, dense)', color: '#059669', emoji: '❄️' }
      : { score: 5, label: 'Excellent (climatisé)', color: '#059669', emoji: '❄️' };
  }
  if (isHotHour && isRush) return { score: 1, label: 'Très chaud + bondé', color: '#dc2626', emoji: '🔥' };
  if (isHotHour) return { score: 2, label: 'Chaud', color: '#f59e0b', emoji: '☀️' };
  if (isRush) return { score: 2, label: 'Bondé', color: '#f59e0b', emoji: '👥' };
  if (h >= 20 || h <= 6) return { score: 5, label: 'Agréable (frais)', color: '#059669', emoji: '🌙' };
  return { score: 3, label: 'Correct', color: '#d97706', emoji: '🌤️' };
}

// ── Affluence prévisionnelle par arrêt ────────────────────────
export function getAffluence(stopId) {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay(); // 0=dimanche
  const isRush = (h >= 7 && h <= 9) || (h >= 17 && h <= 20);
  const isMarketDay = day === 5; // Samedi = tous les marchés
  const isFriday = day === 5; // Prière du vendredi

  let base = 30; // pourcentage de remplissage
  if (isRush) base += 40;
  if (isMarketDay) base += 20;
  if (isFriday && h >= 12 && h <= 14) base += 25;
  if (h >= 22 || h <= 5) base = 10;
  base = Math.min(100, base + Math.floor(Math.random() * 10));

  if (base >= 80) return { level: 'Très fréquenté', pct: base, color: '#dc2626', emoji: '🔴', extra: '+15 min' };
  if (base >= 50) return { level: 'Fréquenté', pct: base, color: '#f59e0b', emoji: '🟡', extra: '+5 min' };
  return { level: 'Calme', pct: base, color: '#059669', emoji: '🟢', extra: '' };
}

// ── Signalements citoyens ─────────────────────────────────────
export const REPORT_TYPES = [
  { id:'retard',   label:'Bus en retard',   emoji:'⏰', color:'#d97706' },
  { id:'bonde',    label:'Arrêt bondé',     emoji:'👥', color:'#dc2626' },
  { id:'degrade',  label:'Arrêt dégradé',   emoji:'🚧', color:'#94a3b8' },
  { id:'insecure', label:'Insécurité',      emoji:'⚠️', color:'#dc2626' },
  { id:'proprete', label:'Manque propreté', emoji:'🗑️', color:'#6b7280' },
  { id:'accident', label:'Accident/Incident',emoji:'🚨', color:'#dc2626' },
];

export function getReports(stopId) {
  try { return JSON.parse(localStorage.getItem(`senbus_reports_${stopId}`) || '[]'); } catch { return []; }
}

export function addReport(stopId, report) {
  const reports = getReports(stopId);
  reports.unshift({ ...report, time: new Date().toISOString(), id: Date.now() });
  localStorage.setItem(`senbus_reports_${stopId}`, JSON.stringify(reports.slice(0, 10)));
  // Compteur global
  const count = parseInt(localStorage.getItem('senbus_report_count') || '0') + 1;
  localStorage.setItem('senbus_report_count', count.toString());
  return reports;
}

export function getAllReportedStops() {
  const reported = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('senbus_reports_')) {
      const sid = key.replace('senbus_reports_', '');
      const reports = JSON.parse(localStorage.getItem(key) || '[]');
      if (reports.length > 0) reported.push({ stopId: sid, count: reports.length, latest: reports[0] });
    }
  }
  return reported;
}

// ── Cagnotte transport ────────────────────────────────────────
export function getCagnotte() {
  try { return JSON.parse(localStorage.getItem('senbus_cagnotte') || '{"balance":0,"gifts":[]}'); } catch { return { balance: 0, gifts: [] }; }
}

export function addToCagnotte(amount, method) {
  const c = getCagnotte();
  c.balance += amount;
  c.gifts.unshift({ amount, method, time: new Date().toISOString(), id: Date.now() });
  localStorage.setItem('senbus_cagnotte', JSON.stringify(c));
  return c;
}

export function offrirTrajet(destinataire, montant) {
  const c = getCagnotte();
  if (c.balance < montant) return { success: false, error: 'Solde insuffisant' };
  c.balance -= montant;
  c.gifts.unshift({ type: 'offert', to: destinataire, amount: montant, time: new Date().toISOString(), id: Date.now(), qrCode: `SENBUS-GIFT-${Date.now()}` });
  localStorage.setItem('senbus_cagnotte', JSON.stringify(c));
  return { success: true, qrCode: c.gifts[0].qrCode, balance: c.balance };
}

// ── i18n Wolof / Français / Anglais ───────────────────────────
export const LANG = {
  fr: {
    planifier:'Planifier', lignes:'Lignes', arrets:'Arrêts', alertes:'Alertes',
    ouPartez:'D\'où partez-vous ?', ouAllez:'Où allez-vous ?',
    calculer:'Calculer l\'itinéraire', arretProche:'Arrêt le plus proche',
    destination:'Destination', direct:'Direct', correspondance:'Correspondance',
    duree:'Durée', distance:'Distance', tarif:'Tarif est.',
    noterVoyage:'Notez votre voyage', envoyer:'Envoyer mon avis',
    signaler:'Signaler', partager:'Partager', effacer:'Effacer',
    tresChaud:'Très chaud', climatise:'Climatisé', confort:'Confort',
    affluence:'Affluence', calme:'Calme', frequente:'Fréquenté',
    cagnotte:'Cagnotte transport', offrir:'Offrir un trajet',
    maPosition:'📍 Ma position actuelle',
  },
  wo: {
    planifier:'Planifier', lignes:'Yoon yi', arrets:'Taxaw yi', alertes:'Xébar yi',
    ouPartez:'Fan ngay jóge ?', ouAllez:'Fan ngay dem ?',
    calculer:'Wut yoon bi', arretProche:'Taxaw bi gëna jege',
    destination:'Foofu ngay dem', direct:'Jubbanti', correspondance:'Weccali kër',
    duree:'Lu tax', distance:'Araf', tarif:'Njëg',
    noterVoyage:'Yeesal sa tali bi', envoyer:'Yonnee sa xalaat',
    signaler:'Fesal', partager:'Séddalal', effacer:'Far',
    tresChaud:'Doy na tàng', climatise:'Sedd na', confort:'Neex',
    affluence:'Mbooloo', calme:'Dëkk', frequente:'Ëpp nit',
    cagnotte:'Cagnotte yoon', offrir:'Joxal yoon',
    maPosition:'📍 Sama palaas',
  },
  en: {
    planifier:'Plan', lignes:'Lines', arrets:'Stops', alertes:'Alerts',
    ouPartez:'Where from?', ouAllez:'Where to?',
    calculer:'Calculate route', arretProche:'Nearest stop',
    destination:'Destination', direct:'Direct', correspondance:'Transfer',
    duree:'Duration', distance:'Distance', tarif:'Est. fare',
    noterVoyage:'Rate your trip', envoyer:'Submit review',
    signaler:'Report', partager:'Share', effacer:'Clear',
    tresChaud:'Very hot', climatise:'Air-conditioned', confort:'Comfort',
    affluence:'Crowding', calme:'Calm', frequente:'Crowded',
    cagnotte:'Transport fund', offrir:'Gift a ride',
    maPosition:'📍 My current location',
  },
};

export function t(key, lang = 'fr') { return LANG[lang]?.[key] || LANG.fr[key] || key; }

// ══════════════════════════════════════════════════════════════
//  STOPS
// ══════════════════════════════════════════════════════════════
export const STOPS = [
  { id:'p01', name:'Gare Palais (Rebeuss)',      zone:'Plateau',    lat:14.6697, lng:-17.4386, operators:['DDD','TER'],       lines:['L6','L7','L8','L9','L10','L12','L15','L23','TER-01'], terConnection:true, terInfo:{ gare:'Dakar', horaires:'04h30–23h30', freq:'30 min', quai:['1','2'], services:['Guichet','WiFi','Toilettes'], correspondances:['DDD L6','DDD L10','AFTU A2'] }},
  { id:'p02', name:'Avenue Petersen',            zone:'Plateau',    lat:14.6811, lng:-17.4464, operators:['DDD','AFTU','BRT'],lines:['A2','A3','A5','A25','BRT-L1'] },
  { id:'p03', name:'Sandaga',                    zone:'Plateau',    lat:14.6756, lng:-17.4436, operators:['DDD'],             lines:['L6','L9','L10'] },
  { id:'p04', name:'Colobane Gare',              zone:'Médina',     lat:14.6908, lng:-17.4478, operators:['DDD','AFTU'],      lines:['L9','A30','A33','A75'] },
  { id:'p05', name:'Tilène',                     zone:'Médina',     lat:14.6788, lng:-17.4428, operators:['DDD'],             lines:['L9','L10'] },
  { id:'p06', name:'Lat Dior (UCAD)',            zone:'Fann',       lat:14.6944, lng:-17.4594, operators:['AFTU'],            lines:['A1','A34'] },
  { id:'p07', name:'Fann Résidence',             zone:'Fann',       lat:14.6933, lng:-17.4669, operators:['DDD','AFTU'],      lines:['L10','A24'] },
  { id:'lc1', name:'Leclerc Terminus',           zone:'Liberté',    lat:14.7117, lng:-17.4567, operators:['DDD'],             lines:['L1A','L2A','L11','L14','L121'] },
  { id:'lc2', name:'HLM Grand Yoff',             zone:'HLM',        lat:14.7183, lng:-17.4553, operators:['DDD','AFTU'],      lines:['L121','A1'] },
  { id:'lb5', name:'Terminus Liberté 5',         zone:'Liberté 5',  lat:14.7242, lng:-17.4528, operators:['DDD'],             lines:['L10','L13','L18','L20'] },
  { id:'lb6', name:'Rond-Point Liberté 6',       zone:'Liberté 6',  lat:14.7200, lng:-17.4450, operators:['DDD','AFTU'],      lines:['L9','L13','A57'] },
  { id:'pa1', name:'Terminus Parcelles',         zone:'Parcelles',  lat:14.7583, lng:-17.4308, operators:['DDD','AFTU'],      lines:['L1A','L23','A2','A5','A25','A26','A29'] },
  { id:'pa2', name:'Parcelles Unité 17',         zone:'Parcelles',  lat:14.7533, lng:-17.4275, operators:['DDD'],             lines:['L1A','L23'] },
  { id:'pa3', name:'Parcelles Unité 10',         zone:'Parcelles',  lat:14.7483, lng:-17.4333, operators:['DDD'],             lines:['L23'] },
  { id:'yf1', name:'Yoff Village',               zone:'Yoff',       lat:14.7467, lng:-17.4903, operators:['DDD','AFTU'],      lines:['L8','A3','A4','A66'] },
  { id:'yf2', name:'Yoff Aéroport (ancien)',     zone:'Yoff',       lat:14.7403, lng:-17.4914, operators:['DDD'],             lines:['L8'] },
  { id:'ng1', name:'Ngor Village',               zone:'Ngor',       lat:14.7464, lng:-17.5178, operators:['AFTU'],            lines:['A35','A49'] },
  { id:'al1', name:'Almadies',                   zone:'Almadies',   lat:14.7481, lng:-17.5289, operators:['AFTU'],            lines:['A61'] },
  { id:'ok1', name:'Ouakam Terminus',            zone:'Ouakam',     lat:14.7183, lng:-17.5058, operators:['DDD','AFTU'],      lines:['L7','A42','A44'] },
  { id:'gy1', name:'Grand Yoff Terminus',        zone:'Grand Yoff', lat:14.7268, lng:-17.4553, operators:['DDD','AFTU'],      lines:['L121','L20','A3'] },
  { id:'sc1', name:'Sicap Liberté',              zone:'Sicap',      lat:14.7133, lng:-17.4603, operators:['DDD'],             lines:['L10','L13'] },
  { id:'bm1', name:'Baux Maraîchers',            zone:'Hann',       lat:14.7192, lng:-17.3997, operators:['DDD','AFTU'],      lines:['L8','A51'] },
  { id:'ha2', name:'Front de Terre',             zone:'Hann',       lat:14.7172, lng:-17.4069, operators:['DDD'],             lines:['L8','L9'] },
  { id:'gd1', name:'Guédiawaye Marché',          zone:'Guédiawaye', lat:14.7769, lng:-17.3986, operators:['DDD','BRT','AFTU'],lines:['L12','BRT-L1','A27','A64'] },
  { id:'gd2', name:'Wakhinane Nimzat',           zone:'Guédiawaye', lat:14.7833, lng:-17.4025, operators:['DDD'],             lines:['L12'] },
  { id:'pk1', name:'Pikine Gare Routière',       zone:'Pikine',     lat:14.7499, lng:-17.3858, operators:['DDD','BRT','AFTU'],lines:['L15','L45','BRT-L1','A35'] },
  { id:'km1', name:'Keur Massar Marché',         zone:'Keur Massar',lat:14.7833, lng:-17.3183, operators:['DDD','AFTU'],      lines:['L11','A52','A61','A71'] },
  { id:'km2', name:'Yeumbeul',                   zone:'Yeumbeul',   lat:14.7633, lng:-17.3500, operators:['AFTU'],            lines:['A26','A68'] },
  { id:'dk1', name:'Daroukhane Terminus',        zone:'Daroukhane', lat:14.7850, lng:-17.4175, operators:['DDD','AFTU'],      lines:['L2A','A70'] },
  { id:'cb1', name:'Camberène Cité Nations',     zone:'Camberène',  lat:14.7633, lng:-17.4292, operators:['DDD','AFTU'],      lines:['L6','A29','A79'] },
  { id:'rf1', name:'Rufisque Gare Routière',     zone:'Rufisque',   lat:14.7153, lng:-17.2747, operators:['DDD','TER','AFTU'],lines:['L15','TER-01','A55','A57','A64'], terConnection:true, terInfo:{ gare:'Rufisque', horaires:'04h50–23h10', freq:'30 min', quai:['1'], services:['Guichet','Distributeur'], correspondances:['DDD L15','AFTU A55'] }},
  { id:'th1', name:'Thiaroye Marché',            zone:'Thiaroye',   lat:14.7358, lng:-17.3533, operators:['DDD','TER'],       lines:['TER-01'] },
  { id:'ml1', name:'Malika Terminus',            zone:'Malika',     lat:14.7958, lng:-17.3475, operators:['DDD','AFTU'],      lines:['L16A','A50','A75'] },
  { id:'mb1', name:'Grand Mbao',                 zone:'Mbao',       lat:14.7500, lng:-17.2917, operators:['DDD','AFTU'],      lines:['L45','A40','A44'] },
  { id:'ba1', name:'Bambilor',                   zone:'Bambilor',   lat:14.8500, lng:-17.2500, operators:['AFTU'],            lines:['A73','A80'] },
  { id:'jx1', name:'Jaxaay',                     zone:'Jaxaay',     lat:14.7900, lng:-17.2200, operators:['AFTU'],            lines:['A51','A56','A65','A70','A84'] },
  { id:'b01', name:'Petersen (BRT)',             zone:'Plateau',    lat:14.6811, lng:-17.4464, operators:['BRT'],             lines:['BRT-L1'] },
  { id:'b02', name:'Fass (BRT)',                 zone:'Fass',       lat:14.6919, lng:-17.4503, operators:['BRT'],             lines:['BRT-L1'] },
  { id:'b03', name:'Liberté 6 (BRT)',            zone:'Liberté',    lat:14.7200, lng:-17.4558, operators:['BRT'],             lines:['BRT-L1'] },
  { id:'b04', name:'Stèle Mermoz (BRT)',         zone:'Mermoz',     lat:14.7125, lng:-17.4761, operators:['BRT'],             lines:['BRT-L1'] },
  { id:'b05', name:'CICES (BRT)',                zone:'CICES',      lat:14.7342, lng:-17.4681, operators:['BRT'],             lines:['BRT-L1'] },
  { id:'t01', name:'Dakar Gare TER',             zone:'Plateau',    lat:14.6697, lng:-17.4386, operators:['TER'],             lines:['TER-01'], terConnection:true, terInfo:{ gare:'Dakar', horaires:'04h30–23h30', freq:'30 min', quai:['1','2'], services:['Guichet','WiFi','Boutiques'], correspondances:['DDD L6','DDD L10'] }},
  { id:'t02', name:'Thiaroye Gare TER',          zone:'Thiaroye',   lat:14.7300, lng:-17.3558, operators:['TER'],             lines:['TER-01'], terConnection:true, terInfo:{ gare:'Thiaroye', horaires:'04h45–23h15', freq:'30 min', quai:['1'], services:['Guichet'], correspondances:['AFTU A26'] }},
  { id:'t03', name:'Rufisque Gare TER',          zone:'Rufisque',   lat:14.7142, lng:-17.2753, operators:['TER'],             lines:['TER-01'], terConnection:true, terInfo:{ gare:'Rufisque', horaires:'04h50–23h10', freq:'30 min', quai:['1'], services:['Guichet','Distributeur'], correspondances:['DDD L15','AFTU A55'] }},
  { id:'t04', name:'Bargny Gare TER',            zone:'Bargny',     lat:14.6964, lng:-17.2269, operators:['TER'],             lines:['TER-01'], terConnection:true, terInfo:{ gare:'Bargny', horaires:'05h00–23h00', freq:'30 min', quai:['1'], services:['Guichet'], correspondances:['AFTU A60'] }},
  { id:'t05', name:'Diamniadio Gare TER',        zone:'Diamniadio', lat:14.7289, lng:-17.1742, operators:['TER'],             lines:['TER-01'], terConnection:true, terInfo:{ gare:'Diamniadio', horaires:'05h00–23h00', freq:'30 min', quai:['1','2'], services:['Guichet','WiFi','Parking'], correspondances:['AFTU A80'] }},
  { id:'t06', name:'AIBD Aéroport',              zone:'AIBD',       lat:14.7411, lng:-17.0900, operators:['TER'],             lines:['TER-01'], terConnection:true, terInfo:{ gare:'AIBD', horaires:'05h00–23h30', freq:'30 min', quai:['1','2'], services:['Guichet','WiFi','Boutiques','Restaurants','Parking'], correspondances:['Navette aéroport'] }},
];

// ── LIGNES ────────────────────────────────────────────────────
const DDD = [
  { id:'L1A', name:'Ligne 1A', route:'Parcelles Assainies ↔ Leclerc',    color:'#1a56db', freq:'8 min',  tarif:200, stops:['pa1','pa2','pa3','lb5','lc1'] },
  { id:'L2A', name:'Ligne 2A', route:'Daroukhane ↔ Leclerc',             color:'#2563eb', freq:'10 min', tarif:200, stops:['dk1','gd1','lb5','lc1'] },
  { id:'L6',  name:'Ligne 6',  route:'Camberène ↔ Palais',               color:'#1d4ed8', freq:'12 min', tarif:200, stops:['cb1','pa1','lb5','lb6','lc1','p03','p01'] },
  { id:'L7',  name:'Ligne 7',  route:'Ouakam ↔ Palais',                  color:'#3b82f6', freq:'15 min', tarif:200, stops:['ok1','lb6','p03','p01'] },
  { id:'L8',  name:'Ligne 8',  route:'Yoff ↔ Palais',                    color:'#60a5fa', freq:'15 min', tarif:200, stops:['yf1','yf2','bm1','ha2','p03','p01'] },
  { id:'L9',  name:'Ligne 9',  route:'Liberté 6 ↔ Palais',               color:'#2563eb', freq:'10 min', tarif:200, stops:['lb6','sc1','ha2','p05','p03','p01'] },
  { id:'L10', name:'Ligne 10', route:'Liberté 5 ↔ Palais',               color:'#1e40af', freq:'12 min', tarif:200, stops:['lb5','sc1','p05','p03','p01'] },
  { id:'L11', name:'Ligne 11', route:'Keur Massar ↔ Leclerc',            color:'#1e3a8a', freq:'15 min', tarif:250, stops:['km1','km2','gd1','lb5','lc1'] },
  { id:'L12', name:'Ligne 12', route:'Guédiawaye ↔ Palais',              color:'#1a56db', freq:'12 min', tarif:200, stops:['gd1','gd2','pk1','p03','p01'] },
  { id:'L13', name:'Ligne 13', route:'Liberté 5 ↔ Palais (Sicap)',       color:'#3b82f6', freq:'10 min', tarif:200, stops:['lb5','lb6','sc1','p05','p03','p01'] },
  { id:'L14', name:'Ligne 14', route:'Camp Vert ↔ Leclerc',              color:'#2563eb', freq:'20 min', tarif:250, stops:['pk1','km2','lb5','lc1'] },
  { id:'L15', name:'Ligne 15', route:'Rufisque ↔ Palais',                color:'#1d4ed8', freq:'20 min', tarif:300, stops:['rf1','th1','pk1','ha2','p03','p01'] },
  { id:'L16A',name:'Ligne 16A',route:'Malika ↔ Palais',                  color:'#60a5fa', freq:'25 min', tarif:300, stops:['ml1','gd2','gd1','pk1','p01'] },
  { id:'L18', name:'Ligne 18', route:'Liberté 5 (circulaire)',            color:'#3b82f6', freq:'15 min', tarif:200, stops:['lb5','lb6','sc1','lc2','gy1'] },
  { id:'L20', name:'Ligne 20', route:'Liberté 5 (express)',               color:'#2563eb', freq:'10 min', tarif:200, stops:['lb5','gy1','lc2','lc1'] },
  { id:'L23', name:'Ligne 23', route:'Parcelles Assainies ↔ Palais',     color:'#1a56db', freq:'12 min', tarif:200, stops:['pa1','pa2','pa3','lb5','lb6','p05','p03','p01'] },
  { id:'L45', name:'Ligne 45', route:'Mbao ↔ Palais',                    color:'#1e40af', freq:'20 min', tarif:300, stops:['mb1','pk1','ha2','p03','p01'] },
  { id:'L121',name:'Ligne 121',route:'HLM Grand Yoff ↔ Leclerc',         color:'#3b82f6', freq:'15 min', tarif:200, stops:['lc2','gy1','lb5','lc1'] },
].map(l => ({ ...l, operator:'DDD' }));

const AFTU_C = ['#e11d48','#f43f5e','#be123c'];
const AFTU = [
  { id:'A1',  name:'AFTU 1',  route:'Lat Dior ↔ HLM Grand Yoff',     freq:'8 min',  tarif:150, stops:['p06','lc2','gy1'] },
  { id:'A2',  name:'AFTU 2',  route:'Parcelles ↔ Petersen',           freq:'6 min',  tarif:150, stops:['pa1','lb5','lb6','p04','p02'] },
  { id:'A3',  name:'AFTU 3',  route:'Yoff ↔ Petersen',                freq:'10 min', tarif:150, stops:['yf1','ok1','gy1','lb6','p04','p02'] },
  { id:'A4',  name:'AFTU 4',  route:'Yoff Village ↔ Petersen',        freq:'10 min', tarif:150, stops:['yf1','yf2','ok1','p04','p02'] },
  { id:'A5',  name:'AFTU 5',  route:'Parcelles ↔ Petersen',           freq:'8 min',  tarif:150, stops:['pa1','cb1','lb5','p02'] },
  { id:'A24', name:'AFTU 24', route:'UCAD ↔ Notaire Guédiawaye',      freq:'15 min', tarif:150, stops:['p07','lb6','gy1'] },
  { id:'A25', name:'AFTU 25', route:'Parcelles ↔ Petersen (express)', freq:'8 min',  tarif:150, stops:['pa1','lb5','p02'] },
  { id:'A26', name:'AFTU 26', route:'Parcelles ↔ Poste Thiaroye',     freq:'12 min', tarif:150, stops:['pa1','km2','th1'] },
  { id:'A27', name:'AFTU 27', route:'Guédiawaye ↔ Petersen',          freq:'12 min', tarif:150, stops:['gd1','lb6','p04','p02'] },
  { id:'A29', name:'AFTU 29', route:'Cité Nations ↔ Petersen',        freq:'10 min', tarif:150, stops:['cb1','pa1','lb5','p04','p02'] },
  { id:'A30', name:'AFTU 30', route:'Gadaye ↔ Colobane',              freq:'15 min', tarif:150, stops:['gd1','pk1','p04'] },
  { id:'A33', name:'AFTU 33', route:'Colobane ↔ Guédiawaye',          freq:'12 min', tarif:150, stops:['p04','lb6','gy1','gd1'] },
  { id:'A34', name:'AFTU 34', route:'Nord Foire ↔ Lat Dior',          freq:'15 min', tarif:150, stops:['pa1','lb5','lc2','p06'] },
  { id:'A35', name:'AFTU 35', route:'Ngor ↔ Pikine',                  freq:'20 min', tarif:150, stops:['ng1','ok1','gy1','pk1'] },
  { id:'A40', name:'AFTU 40', route:'Grand Mbao ↔ Petersen',          freq:'20 min', tarif:200, stops:['mb1','pk1','ha2','p02'] },
  { id:'A42', name:'AFTU 42', route:'Gadaye ↔ Ouakam',                freq:'20 min', tarif:150, stops:['gd1','gy1','ok1'] },
  { id:'A44', name:'AFTU 44', route:'Grand Mbao ↔ Ouakam',            freq:'25 min', tarif:200, stops:['mb1','pk1','gy1','ok1'] },
  { id:'A49', name:'AFTU 49', route:'Gadaye ↔ Ngor',                  freq:'25 min', tarif:150, stops:['gd1','gy1','ng1'] },
  { id:'A50', name:'AFTU 50', route:'Petersen ↔ Malika',              freq:'25 min', tarif:200, stops:['p02','gd1','ml1'] },
  { id:'A51', name:'AFTU 51', route:'Jaxaay ↔ Baux Maraîchers',       freq:'20 min', tarif:200, stops:['jx1','mb1','bm1'] },
  { id:'A52', name:'AFTU 52', route:'Pikine ↔ Keur Massar',           freq:'15 min', tarif:150, stops:['pk1','km2','km1'] },
  { id:'A55', name:'AFTU 55', route:'Rufisque ↔ Petersen',            freq:'20 min', tarif:250, stops:['rf1','pk1','ha2','p02'] },
  { id:'A56', name:'AFTU 56', route:'Jaxaay ↔ Petersen',              freq:'25 min', tarif:200, stops:['jx1','km1','gd1','p02'] },
  { id:'A57', name:'AFTU 57', route:'Liberté 6 ↔ Rufisque',           freq:'20 min', tarif:250, stops:['lb6','pk1','rf1'] },
  { id:'A60', name:'AFTU 60', route:'Colobane ↔ Bargny',              freq:'30 min', tarif:300, stops:['p04','pk1','rf1','t04'] },
  { id:'A61', name:'AFTU 61', route:'Almadies ↔ Keur Massar',         freq:'25 min', tarif:200, stops:['al1','ng1','ok1','gy1','km1'] },
  { id:'A64', name:'AFTU 64', route:'Guédiawaye ↔ Rufisque',          freq:'20 min', tarif:200, stops:['gd1','pk1','rf1'] },
  { id:'A65', name:'AFTU 65', route:'Colobane ↔ Jaxaay',              freq:'25 min', tarif:200, stops:['p04','pk1','km1','jx1'] },
  { id:'A66', name:'AFTU 66', route:'Yoff ↔ Gorom',                   freq:'30 min', tarif:200, stops:['yf1','rf1'] },
  { id:'A68', name:'AFTU 68', route:'Yeumbeul ↔ Sébikotane',          freq:'30 min', tarif:250, stops:['km2','rf1','t04'] },
  { id:'A70', name:'AFTU 70', route:'Daroukhane ↔ Jaxaay',            freq:'25 min', tarif:200, stops:['dk1','gd1','km1','jx1'] },
  { id:'A71', name:'AFTU 71', route:'Keur Massar ↔ Claudel',          freq:'20 min', tarif:150, stops:['km1','gd1','lb5'] },
  { id:'A73', name:'AFTU 73', route:'Lac Rose ↔ Poste Thiaroye',      freq:'30 min', tarif:250, stops:['ba1','ml1','km2'] },
  { id:'A75', name:'AFTU 75', route:'Malika ↔ Colobane',              freq:'25 min', tarif:200, stops:['ml1','gd1','pk1','p04'] },
  { id:'A79', name:'AFTU 79', route:'Sangalkam ↔ Camberène',          freq:'30 min', tarif:200, stops:['ba1','km1','cb1'] },
  { id:'A80', name:'AFTU 80', route:'Diamniadio ↔ Médina',            freq:'30 min', tarif:300, stops:['t05','rf1','pk1','p04'] },
  { id:'A84', name:'AFTU 84', route:'Grand Yoff ↔ Jaxaay',            freq:'25 min', tarif:200, stops:['gy1','km1','jx1'] },
].map((l, i) => ({ ...l, operator:'AFTU', color: AFTU_C[i % AFTU_C.length] }));

const BRT = [{ id:'BRT-L1', operator:'BRT', name:'BRT L1', route:'Petersen ↔ Guédiawaye', color:'#7c3aed', freq:'5 min', tarif:300, stops:['b01','b02','b03','b04','b05','pk1','gd1'] }];
const TER = [{ id:'TER-01', operator:'TER', name:'TER 01', route:'Dakar ↔ AIBD', color:'#059669', freq:'30 min', tarif:500, stops:['t01','t02','t03','t04','t05','t06'] }];

export const LINES = [...DDD, ...AFTU, ...BRT, ...TER];

// ── Helpers ───────────────────────────────────────────────────
export const getLineStops     = id => { const l=LINES.find(x=>x.id===id); return l ? l.stops.map(sid=>STOPS.find(s=>s.id===sid)).filter(Boolean) : []; };
export const getStopsByOp     = op => op==='all' ? STOPS : STOPS.filter(s=>s.operators.includes(op));
export const getLinesByOp     = op => op==='all' ? LINES : LINES.filter(l=>l.operator===op);

export const getNextDepartures = (stopId) => {
  const now = new Date(); const stop = STOPS.find(s=>s.id===stopId); if(!stop) return [];
  const waits = [3,8,14,22,35];
  return stop.lines.slice(0,5).map((lineId,i)=>{
    const line=LINES.find(l=>l.id===lineId); const wait=waits[i%5]+Math.floor(Math.random()*4);
    return { lineId, lineName:line?.name||lineId, operator:line?.operator||'DDD', color:line?.color||'#1a56db', route:line?.route||'', waitMin:wait,
      time:new Date(now.getTime()+wait*60000).toLocaleTimeString('fr-SN',{hour:'2-digit',minute:'2-digit'}),
      comfort: getComfortIndex(line?.operator||'DDD'),
    };
  }).sort((a,b)=>a.waitMin-b.waitMin);
};

// ── Notifications ─────────────────────────────────────────────
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function scheduleNotification(title, body, delayMs = 0) {
  if ('Notification' in window && Notification.permission === 'granted') {
    setTimeout(() => new Notification(title, { body, icon:'🚌', badge:'🚌', vibrate:[200,100,200] }), delayMs);
    return true;
  }
  return false;
}
