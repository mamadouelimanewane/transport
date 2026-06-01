// ══════════════════════════════════════════════════════════════
//  SenBus v4 — AFTU couleur rouge vif + TER correspondances
// ══════════════════════════════════════════════════════════════

export const OPERATORS = {
  DDD:  { id:'DDD',  name:'DDD',  fullName:'Dakar Dem Dikk',        icon:'🚌', color:'#1a56db', bg:'#eff6ff', tarif:200 },
  AFTU: { id:'AFTU', name:'AFTU', fullName:'AFTU Car Rapide',        icon:'🚐', color:'#e11d48', bg:'#fff1f2', tarif:150 },  // ← ROUGE VIF
  BRT:  { id:'BRT',  name:'BRT',  fullName:'Bus Rapid Transit',      icon:'🚍', color:'#7c3aed', bg:'#f5f3ff', tarif:300 },
  TER:  { id:'TER',  name:'TER',  fullName:'Train Express Régional', icon:'🚆', color:'#059669', bg:'#ecfdf5', tarif:500 },
};

// Tarifs TER officiels
export const TER_TARIFS = [
  { from:'Dakar',      to:'Thiaroye',   prix:500,  classe:'2e' },
  { from:'Dakar',      to:'Rufisque',   prix:900,  classe:'2e' },
  { from:'Dakar',      to:'Bargny',     prix:1200, classe:'2e' },
  { from:'Dakar',      to:'Diamniadio', prix:1500, classe:'2e' },
  { from:'Dakar',      to:'AIBD',       prix:2000, classe:'2e' },
  { from:'Thiaroye',   to:'Rufisque',   prix:500,  classe:'2e' },
  { from:'Thiaroye',   to:'Diamniadio', prix:1100, classe:'2e' },
  { from:'Rufisque',   to:'AIBD',       prix:1200, classe:'2e' },
];

// Abonnements TER mensuels
export const TER_ABONNEMENTS = [
  { id:'ter-mensuel-dakar-thiaroye',   label:'Mensuel Dakar ↔ Thiaroye',   prix:12000,  trajets:'Illimité', icon:'🚆' },
  { id:'ter-mensuel-dakar-rufisque',   label:'Mensuel Dakar ↔ Rufisque',   prix:20000,  trajets:'Illimité', icon:'🚆' },
  { id:'ter-mensuel-dakar-diamniadio', label:'Mensuel Dakar ↔ Diamniadio', prix:30000,  trajets:'Illimité', icon:'🚆' },
  { id:'ter-mensuel-dakar-aibd',       label:'Pass AIBD mensuel',          prix:38000,  trajets:'Illimité', icon:'✈️' },
  { id:'ter-pass10-rufisque',          label:'Carnet 10 trajets Rufisque', prix:8000,   trajets:'10 trajets', icon:'🎟️' },
  { id:'ter-pass10-aibd',              label:'Carnet 10 trajets AIBD',     prix:18000,  trajets:'10 trajets', icon:'🎟️' },
];

export const STOPS = [
  // === PLATEAU / CENTRE ===
  { id:'p01', name:'Gare Palais (Rebeuss)',      zone:'Plateau',     lat:14.6697, lng:-17.4386, operators:['DDD','TER'],       lines:['L6','L7','L8','L9','L10','L12','L15','L23','TER-01'], terConnection:false },
  { id:'p02', name:'Avenue Petersen',            zone:'Plateau',     lat:14.6811, lng:-17.4464, operators:['DDD','AFTU','BRT'],lines:['A2','A3','A4','A5','A25','A29','BRT-L1'], terConnection:false },
  { id:'p03', name:'Sandaga',                    zone:'Plateau',     lat:14.6756, lng:-17.4436, operators:['DDD'],             lines:['L6','L9','L10'], terConnection:false },
  { id:'p04', name:'Colobane Gare',              zone:'Médina',      lat:14.6908, lng:-17.4478, operators:['DDD','AFTU'],      lines:['L9','A30','A33','A75'], terConnection:false },
  { id:'p05', name:'Tilène',                     zone:'Médina',      lat:14.6788, lng:-17.4428, operators:['DDD'],             lines:['L9','L10'], terConnection:false },
  { id:'p06', name:'Lat Dior (UCAD)',            zone:'Fann',        lat:14.6944, lng:-17.4594, operators:['AFTU'],            lines:['A1','A34','A46'], terConnection:false },
  { id:'p07', name:'Fann Résidence',             zone:'Fann',        lat:14.6933, lng:-17.4669, operators:['DDD','AFTU'],      lines:['L10','A24'], terConnection:false },

  // === LECLERC / HLM ===
  { id:'lc1', name:'Leclerc Terminus',           zone:'Liberté',     lat:14.7117, lng:-17.4567, operators:['DDD'],             lines:['L1A','L2A','L11','L14','L121'], terConnection:false },
  { id:'lc2', name:'HLM Grand Yoff',             zone:'HLM',         lat:14.7183, lng:-17.4553, operators:['DDD','AFTU'],      lines:['L121','A1'], terConnection:false },

  // === LIBERTÉ 5 / 6 ===
  { id:'lb5', name:'Terminus Liberté 5',         zone:'Liberté 5',   lat:14.7242, lng:-17.4528, operators:['DDD'],             lines:['L10','L13','L18','L20'], terConnection:false },
  { id:'lb6', name:'Rond-Point Liberté 6',       zone:'Liberté 6',   lat:14.7200, lng:-17.4450, operators:['DDD','AFTU'],      lines:['L9','L13','A57'], terConnection:false },

  // === PARCELLES ASSAINIES ===
  { id:'pa1', name:'Terminus Parcelles',         zone:'Parcelles Assainies', lat:14.7583, lng:-17.4308, operators:['DDD','AFTU'], lines:['L1A','L23','A2','A5','A25','A26','A29'], terConnection:false },
  { id:'pa2', name:'Parcelles Unité 17',         zone:'Parcelles Assainies', lat:14.7533, lng:-17.4275, operators:['DDD'],         lines:['L1A','L23'], terConnection:false },
  { id:'pa3', name:'Parcelles Unité 10',         zone:'Parcelles Assainies', lat:14.7483, lng:-17.4333, operators:['DDD'],         lines:['L23'], terConnection:false },

  // === YOFF / NGOR / ALMADIES ===
  { id:'yf1', name:'Yoff Village',               zone:'Yoff',        lat:14.7467, lng:-17.4903, operators:['DDD','AFTU'],      lines:['L8','A3','A4','A66'], terConnection:false },
  { id:'yf2', name:'Yoff Aéroport (ancien)',     zone:'Yoff',        lat:14.7403, lng:-17.4914, operators:['DDD'],             lines:['L8'], terConnection:false },
  { id:'ng1', name:'Ngor Village',               zone:'Ngor',        lat:14.7464, lng:-17.5178, operators:['AFTU'],            lines:['A35','A36','A49'], terConnection:false },
  { id:'al1', name:'Almadies',                   zone:'Almadies',    lat:14.7481, lng:-17.5289, operators:['AFTU'],            lines:['A61'], terConnection:false },

  // === OUAKAM ===
  { id:'ok1', name:'Ouakam Terminus',            zone:'Ouakam',      lat:14.7183, lng:-17.5058, operators:['DDD','AFTU'],      lines:['L7','A42','A43','A44'], terConnection:false },
  { id:'ok2', name:'Ouakam Mosquée',             zone:'Ouakam',      lat:14.7133, lng:-17.5025, operators:['DDD'],             lines:['L7'], terConnection:false },
  { id:'ok3', name:'Mamelles',                   zone:'Ouakam',      lat:14.7264, lng:-17.5047, operators:['DDD'],             lines:['L7'], terConnection:false },

  // === GRAND YOFF / SICAP ===
  { id:'gy1', name:'Grand Yoff Terminus',        zone:'Grand Yoff',  lat:14.7268, lng:-17.4553, operators:['DDD','AFTU'],      lines:['L121','L20','A3'], terConnection:false },
  { id:'sc1', name:'Sicap Liberté',              zone:'Sicap',       lat:14.7133, lng:-17.4603, operators:['DDD'],             lines:['L10','L13'], terConnection:false },
  { id:'sc2', name:'Point E',                    zone:'Point E',     lat:14.7058, lng:-17.4636, operators:['DDD'],             lines:['L10'], terConnection:false },

  // === HANN / BAUX MARAÎCHERS ===
  { id:'bm1', name:'Baux Maraîchers',            zone:'Hann',        lat:14.7192, lng:-17.3997, operators:['DDD','AFTU'],      lines:['L8','A51'], terConnection:false },
  { id:'ha1', name:'Hann Maristes',              zone:'Hann',        lat:14.7242, lng:-17.4022, operators:['DDD'],             lines:['L8'], terConnection:false },
  { id:'ha2', name:'Front de Terre',             zone:'Hann',        lat:14.7172, lng:-17.4069, operators:['DDD'],             lines:['L8','L9'], terConnection:false },

  // === GUÉDIAWAYE ===
  { id:'gd1', name:'Guédiawaye Marché',          zone:'Guédiawaye',  lat:14.7769, lng:-17.3986, operators:['DDD','BRT','AFTU'],lines:['L12','BRT-L1','A27','A30','A33','A64'], terConnection:false },
  { id:'gd2', name:'Wakhinane Nimzat',           zone:'Guédiawaye',  lat:14.7833, lng:-17.4025, operators:['DDD'],             lines:['L12'], terConnection:false },
  { id:'gd3', name:'Gadaye (Guédiawaye)',        zone:'Guédiawaye',  lat:14.7700, lng:-17.3919, operators:['AFTU'],            lines:['A42','A49','A72'], terConnection:false },
  { id:'gd4', name:'Notaire Guédiawaye',         zone:'Guédiawaye',  lat:14.7742, lng:-17.3969, operators:['AFTU'],            lines:['A24'], terConnection:false },

  // === PIKINE ===
  { id:'pk1', name:'Pikine Gare Routière',       zone:'Pikine',      lat:14.7499, lng:-17.3858, operators:['DDD','BRT','AFTU'],lines:['L15','L45','BRT-L1','A35'], terConnection:false },
  { id:'pk2', name:'Dépôt Thiaroye',             zone:'Pikine',      lat:14.7450, lng:-17.3800, operators:['AFTU'],            lines:['A26'], terConnection:false },

  // === KEUR MASSAR / YEUMBEUL ===
  { id:'km1', name:'Keur Massar Marché',         zone:'Keur Massar', lat:14.7833, lng:-17.3183, operators:['DDD','AFTU'],      lines:['L11','A52','A54','A56','A61','A71'], terConnection:false },
  { id:'km2', name:'Yeumbeul',                   zone:'Yeumbeul',    lat:14.7633, lng:-17.3500, operators:['AFTU'],            lines:['A26','A68'], terConnection:false },

  // === DAROUKHANE / CAMBERÈNE ===
  { id:'dk1', name:'Daroukhane Terminus',        zone:'Daroukhane',  lat:14.7850, lng:-17.4175, operators:['DDD','AFTU'],      lines:['L2A','A70'], terConnection:false },
  { id:'cb1', name:'Camberène Cité Nations',     zone:'Camberène',   lat:14.7633, lng:-17.4292, operators:['DDD','AFTU'],      lines:['L6','A29','A79'], terConnection:false },

  // === THIAROYE ===
  { id:'th1', name:'Thiaroye Marché',            zone:'Thiaroye',    lat:14.7358, lng:-17.3533, operators:['DDD','TER'],       lines:['TER-01'], terConnection:false },
  { id:'th2', name:'Poste Thiaroye',             zone:'Thiaroye',    lat:14.7325, lng:-17.3572, operators:['AFTU'],            lines:['A26','A73'], terConnection:false },

  // === RUFISQUE ===
  { id:'rf1', name:'Rufisque Gare Routière',     zone:'Rufisque',    lat:14.7153, lng:-17.2747, operators:['DDD','TER','AFTU'],lines:['L15','TER-01','A55','A57','A60','A62','A63','A64','A67'], terConnection:false },

  // === MALIKA / BAMBILOR ===
  { id:'ml1', name:'Malika Terminus',            zone:'Malika',      lat:14.7958, lng:-17.3475, operators:['DDD','AFTU'],      lines:['L16A','A50','A75'], terConnection:false },
  { id:'ba1', name:'Bambilor',                   zone:'Bambilor',    lat:14.8500, lng:-17.2500, operators:['AFTU'],            lines:['A73','A80'], terConnection:false },

  // === MBAO / JAXAAY ===
  { id:'mb1', name:'Grand Mbao',                 zone:'Mbao',        lat:14.7500, lng:-17.2917, operators:['DDD','AFTU'],      lines:['L45','A40','A44'], terConnection:false },
  { id:'jx1', name:'Jaxaay',                     zone:'Jaxaay',      lat:14.7900, lng:-17.2200, operators:['AFTU'],            lines:['A51','A56','A65','A70','A84'], terConnection:false },

  // === BRT STATIONS ===
  { id:'b01', name:'Petersen (BRT)',             zone:'Plateau',     lat:14.6811, lng:-17.4464, operators:['BRT'],             lines:['BRT-L1'], terConnection:false },
  { id:'b02', name:'Fass (BRT)',                 zone:'Fass',        lat:14.6919, lng:-17.4503, operators:['BRT'],             lines:['BRT-L1'], terConnection:false },
  { id:'b03', name:'Liberté 6 (BRT)',            zone:'Liberté',     lat:14.7200, lng:-17.4558, operators:['BRT'],             lines:['BRT-L1'], terConnection:false },
  { id:'b04', name:'Stèle Mermoz (BRT)',         zone:'Mermoz',      lat:14.7125, lng:-17.4761, operators:['BRT'],             lines:['BRT-L1'], terConnection:false },
  { id:'b05', name:'CICES (BRT)',                zone:'CICES',       lat:14.7342, lng:-17.4681, operators:['BRT'],             lines:['BRT-L1'], terConnection:false },
  { id:'b06', name:'Pikine (BRT)',               zone:'Pikine',      lat:14.7542, lng:-17.3958, operators:['BRT'],             lines:['BRT-L1'], terConnection:false },

  // === TER GARES (avec correspondances) ===
  { id:'t01', name:'Dakar Gare TER',    zone:'Plateau',    lat:14.6697, lng:-17.4386, operators:['TER'], lines:['TER-01'], terConnection:true,
    terInfo:{ gare:'Dakar', horaires:'04h30–23h30', freq:'30 min', quai:['1','2'], services:['Guichet','Distributeur','WiFi','Toilettes'], correspondances:['DDD L6','DDD L10','AFTU A2'] }},
  { id:'t02', name:'Thiaroye Gare TER', zone:'Thiaroye',   lat:14.7300, lng:-17.3558, operators:['TER'], lines:['TER-01'], terConnection:true,
    terInfo:{ gare:'Thiaroye', horaires:'04h45–23h15', freq:'30 min', quai:['1'], services:['Guichet','Distributeur'], correspondances:['DDD L15','AFTU A26'] }},
  { id:'t03', name:'Rufisque Gare TER', zone:'Rufisque',   lat:14.7142, lng:-17.2753, operators:['TER'], lines:['TER-01'], terConnection:true,
    terInfo:{ gare:'Rufisque', horaires:'04h50–23h10', freq:'30 min', quai:['1'], services:['Guichet','Distributeur','Boutiques'], correspondances:['DDD L15','AFTU A55','AFTU A57'] }},
  { id:'t04', name:'Bargny Gare TER',   zone:'Bargny',     lat:14.6964, lng:-17.2269, operators:['TER'], lines:['TER-01'], terConnection:true,
    terInfo:{ gare:'Bargny', horaires:'05h00–23h00', freq:'30 min', quai:['1'], services:['Guichet'], correspondances:['AFTU A60'] }},
  { id:'t05', name:'Diamniadio Gare TER',zone:'Diamniadio',lat:14.7289, lng:-17.1742, operators:['TER'], lines:['TER-01'], terConnection:true,
    terInfo:{ gare:'Diamniadio', horaires:'05h00–23h00', freq:'30 min', quai:['1','2'], services:['Guichet','Distributeur','WiFi','Parking','Bus navette'], correspondances:['AFTU A80'] }},
  { id:'t06', name:'AIBD Aéroport',     zone:'AIBD',       lat:14.7411, lng:-17.0900, operators:['TER'], lines:['TER-01'], terConnection:true,
    terInfo:{ gare:'AIBD', horaires:'05h00–23h30', freq:'30 min', quai:['1','2'], services:['Guichet','Distributeur','WiFi','Boutiques','Restaurants','Parking'], correspondances:['Navette aéroport'] }},
];

// ── LIGNES DDD ────────────────────────────────────────────────
const DDD_LINES = [
  { id:'L1A', name:'Ligne 1A', route:'Parcelles Assainies ↔ Leclerc',       color:'#1a56db', freq:'8 min',  tarif:200, stops:['pa1','pa2','pa3','lb5','lc1'] },
  { id:'L2A', name:'Ligne 2A', route:'Daroukhane ↔ Leclerc',                color:'#2563eb', freq:'10 min', tarif:200, stops:['dk1','gd1','lb5','lc1'] },
  { id:'L6',  name:'Ligne 6',  route:'Camberène ↔ Palais',                  color:'#1d4ed8', freq:'12 min', tarif:200, stops:['cb1','pa1','lb5','lb6','lc1','p03','p01'] },
  { id:'L7',  name:'Ligne 7',  route:'Ouakam ↔ Palais',                     color:'#3b82f6', freq:'15 min', tarif:200, stops:['ok1','ok2','ok3','lb6','p03','p01'] },
  { id:'L8',  name:'Ligne 8',  route:'Yoff ↔ Palais',                       color:'#60a5fa', freq:'15 min', tarif:200, stops:['yf1','yf2','bm1','ha1','ha2','p03','p01'] },
  { id:'L9',  name:'Ligne 9',  route:'Liberté 6 ↔ Palais',                  color:'#2563eb', freq:'10 min', tarif:200, stops:['lb6','sc1','ha2','p05','p03','p01'] },
  { id:'L10', name:'Ligne 10', route:'Liberté 5 ↔ Palais',                  color:'#1e40af', freq:'12 min', tarif:200, stops:['lb5','sc1','sc2','p05','p03','p01'] },
  { id:'L11', name:'Ligne 11', route:'Keur Massar ↔ Leclerc',               color:'#1e3a8a', freq:'15 min', tarif:250, stops:['km1','km2','gd1','lb5','lc1'] },
  { id:'L12', name:'Ligne 12', route:'Guédiawaye ↔ Palais',                 color:'#1a56db', freq:'12 min', tarif:200, stops:['gd1','gd2','pk1','p03','p01'] },
  { id:'L13', name:'Ligne 13', route:'Liberté 5 ↔ Palais (via Sicap)',      color:'#3b82f6', freq:'10 min', tarif:200, stops:['lb5','lb6','sc1','sc2','p05','p03','p01'] },
  { id:'L14', name:'Ligne 14', route:'Camp Vert ↔ Leclerc',                 color:'#2563eb', freq:'20 min', tarif:250, stops:['pk1','km2','lb5','lc1'] },
  { id:'L15', name:'Ligne 15', route:'Rufisque ↔ Palais',                   color:'#1d4ed8', freq:'20 min', tarif:300, stops:['rf1','th1','pk1','ha2','p03','p01'] },
  { id:'L16A',name:'Ligne 16A',route:'Malika ↔ Palais',                     color:'#60a5fa', freq:'25 min', tarif:300, stops:['ml1','gd2','gd1','pk1','p01'] },
  { id:'L18', name:'Ligne 18', route:'Liberté 5 (circulaire)',               color:'#3b82f6', freq:'15 min', tarif:200, stops:['lb5','lb6','sc1','lc2','gy1','lb5'] },
  { id:'L20', name:'Ligne 20', route:'Liberté 5 (express)',                  color:'#2563eb', freq:'10 min', tarif:200, stops:['lb5','gy1','lc2','lc1','lb5'] },
  { id:'L23', name:'Ligne 23', route:'Parcelles Assainies ↔ Palais',        color:'#1a56db', freq:'12 min', tarif:200, stops:['pa1','pa2','pa3','lb5','lb6','p05','p03','p01'] },
  { id:'L45', name:'Ligne 45', route:'Mbao ↔ Palais',                       color:'#1e40af', freq:'20 min', tarif:300, stops:['mb1','th2','pk1','ha2','p03','p01'] },
  { id:'L121',name:'Ligne 121',route:'HLM Grand Yoff ↔ Leclerc',            color:'#3b82f6', freq:'15 min', tarif:200, stops:['lc2','gy1','lb5','lc1'] },
].map(l => ({ ...l, operator:'DDD' }));

// ── LIGNES AFTU (couleur ROUGE) ───────────────────────────────
const AFTU_COLORS = ['#e11d48','#f43f5e','#be123c','#e11d48','#f43f5e','#be123c','#e11d48','#f43f5e'];
const AFTU_LINES = [
  { id:'A1',  name:'AFTU 1',  route:'Lat Dior ↔ HLM Grand Yoff',           freq:'8 min',  tarif:150, stops:['p06','lc2','gy1'] },
  { id:'A2',  name:'AFTU 2',  route:'Parcelles ↔ Petersen (route princ.)',  freq:'6 min',  tarif:150, stops:['pa1','lb5','lb6','p04','p02'] },
  { id:'A3',  name:'AFTU 3',  route:'Yoff ↔ Petersen',                     freq:'10 min', tarif:150, stops:['yf1','ok1','gy1','lb6','p04','p02'] },
  { id:'A4',  name:'AFTU 4',  route:'Yoff Village ↔ Petersen',             freq:'10 min', tarif:150, stops:['yf1','yf2','ok3','p04','p02'] },
  { id:'A5',  name:'AFTU 5',  route:'Parcelles Assainies ↔ Petersen',      freq:'8 min',  tarif:150, stops:['pa1','pa2','cb1','lb5','p02'] },
  { id:'A24', name:'AFTU 24', route:'UCAD ↔ Notaire Guédiawaye',           freq:'15 min', tarif:150, stops:['p07','lb6','gy1','gd4'] },
  { id:'A25', name:'AFTU 25', route:'Parcelles ↔ Petersen (express)',       freq:'8 min',  tarif:150, stops:['pa1','lb5','p02'] },
  { id:'A26', name:'AFTU 26', route:'Parcelles ↔ Poste Thiaroye',          freq:'12 min', tarif:150, stops:['pa1','km2','pk2','th2'] },
  { id:'A27', name:'AFTU 27', route:'Marché Boubess ↔ Petersen',           freq:'12 min', tarif:150, stops:['gd1','lb6','p04','p02'] },
  { id:'A29', name:'AFTU 29', route:'Cité Nations Unies ↔ Petersen',       freq:'10 min', tarif:150, stops:['cb1','pa1','lb5','p04','p02'] },
  { id:'A30', name:'AFTU 30', route:'Gadaye ↔ Gare Colobane',              freq:'15 min', tarif:150, stops:['gd3','gd1','pk1','p04'] },
  { id:'A33', name:'AFTU 33', route:'Colobane ↔ Guédiawaye',               freq:'12 min', tarif:150, stops:['p04','lb6','gy1','gd1'] },
  { id:'A34', name:'AFTU 34', route:'Nord Foire ↔ Lat Dior',               freq:'15 min', tarif:150, stops:['pa1','lb5','lc2','p06'] },
  { id:'A35', name:'AFTU 35', route:'Ngor ↔ Pikine Texaco',                freq:'20 min', tarif:150, stops:['ng1','ok1','gy1','pk1'] },
  { id:'A40', name:'AFTU 40', route:'Grand Mbao ↔ Petersen',               freq:'20 min', tarif:200, stops:['mb1','pk1','ha2','p02'] },
  { id:'A42', name:'AFTU 42', route:'Gadaye ↔ Ouakam',                     freq:'20 min', tarif:150, stops:['gd3','gd1','gy1','ok1'] },
  { id:'A44', name:'AFTU 44', route:'Grand Mbao ↔ Ouakam',                 freq:'25 min', tarif:200, stops:['mb1','pk1','gy1','ok1'] },
  { id:'A45', name:'AFTU 45', route:'Kounoune ↔ Parcelles Église',         freq:'20 min', tarif:150, stops:['km1','km2','pa1'] },
  { id:'A49', name:'AFTU 49', route:'Gadaye ↔ Ngor',                       freq:'25 min', tarif:150, stops:['gd3','gd1','gy1','ng1'] },
  { id:'A50', name:'AFTU 50', route:'Petersen ↔ Malika Cimetière',         freq:'25 min', tarif:200, stops:['p02','gd1','ml1'] },
  { id:'A51', name:'AFTU 51', route:'Jaxaay ↔ Baux Maraîchers',            freq:'20 min', tarif:200, stops:['jx1','mb1','bm1'] },
  { id:'A52', name:'AFTU 52', route:'Bountou Pikine ↔ Keur Massar',        freq:'15 min', tarif:150, stops:['pk1','km2','km1'] },
  { id:'A55', name:'AFTU 55', route:'Rufisque ↔ Petersen',                 freq:'20 min', tarif:250, stops:['rf1','pk1','ha2','p02'] },
  { id:'A56', name:'AFTU 56', route:'Jaxaay 2 ↔ Petersen',                freq:'25 min', tarif:200, stops:['jx1','km1','gd1','p02'] },
  { id:'A57', name:'AFTU 57', route:'Liberté 6 ↔ Rufisque',               freq:'20 min', tarif:250, stops:['lb6','pk1','rf1'] },
  { id:'A60', name:'AFTU 60', route:'Colobane ↔ Bargny',                  freq:'30 min', tarif:300, stops:['p04','pk1','rf1','t04'] },
  { id:'A61', name:'AFTU 61', route:'Almadies ↔ Keur Massar',             freq:'25 min', tarif:200, stops:['al1','ng1','ok1','gy1','km1'] },
  { id:'A62', name:'AFTU 62', route:'Rufisque ↔ Gueule Tapée',            freq:'25 min', tarif:250, stops:['rf1','pk1','p04'] },
  { id:'A64', name:'AFTU 64', route:'Guédiawaye ↔ Rufisque',              freq:'20 min', tarif:200, stops:['gd1','pk1','rf1'] },
  { id:'A65', name:'AFTU 65', route:'Colobane ↔ Jaxaay',                  freq:'25 min', tarif:200, stops:['p04','pk1','km1','jx1'] },
  { id:'A66', name:'AFTU 66', route:'Yoff ↔ Gorom',                       freq:'30 min', tarif:200, stops:['yf1','rf1'] },
  { id:'A68', name:'AFTU 68', route:'Yeumbeul ↔ Sébikotane',              freq:'30 min', tarif:250, stops:['km2','rf1','t05'] },
  { id:'A70', name:'AFTU 70', route:'Daroukhane ↔ Jaxaay 2',              freq:'25 min', tarif:200, stops:['dk1','gd1','km1','jx1'] },
  { id:'A71', name:'AFTU 71', route:'Keur Massar ↔ Claudel',              freq:'20 min', tarif:150, stops:['km1','gd1','lb5'] },
  { id:'A72', name:'AFTU 72', route:'Guédiawaye ↔ Kounoune',              freq:'20 min', tarif:150, stops:['gd3','gd1','km1'] },
  { id:'A73', name:'AFTU 73', route:'Lac Rose ↔ Poste Thiaroye',          freq:'30 min', tarif:250, stops:['ba1','ml1','km2','th2'] },
  { id:'A75', name:'AFTU 75', route:'Malika ↔ Gare Colobane',             freq:'25 min', tarif:200, stops:['ml1','gd1','pk1','p04'] },
  { id:'A79', name:'AFTU 79', route:'Sangalkam ↔ Camberène',              freq:'30 min', tarif:200, stops:['ba1','km1','cb1'] },
  { id:'A80', name:'AFTU 80', route:'Diamniadio ↔ Médina',                freq:'30 min', tarif:300, stops:['t05','rf1','pk1','p04'] },
  { id:'A84', name:'AFTU 84', route:'Grand Yoff ↔ Jaxaay',               freq:'25 min', tarif:200, stops:['gy1','km1','jx1'] },
].map((l, i) => ({ ...l, operator:'AFTU', color: AFTU_COLORS[i % AFTU_COLORS.length] }));

const BRT_LINES = [{
  id:'BRT-L1', operator:'BRT', name:'BRT L1', route:'Petersen ↔ Guédiawaye',
  color:'#7c3aed', freq:'5 min', tarif:300,
  stops:['b01','b02','b03','b04','b05','b06','gd1'],
}];

const TER_LINES = [{
  id:'TER-01', operator:'TER', name:'TER 01', route:'Dakar ↔ AIBD',
  color:'#059669', freq:'30 min', tarif:500,
  stops:['t01','t02','t03','t04','t05','t06'],
}];

export const LINES = [...DDD_LINES, ...AFTU_LINES, ...BRT_LINES, ...TER_LINES];

export const getLineStops  = (id) => { const l = LINES.find(x=>x.id===id); return l ? l.stops.map(sid=>STOPS.find(s=>s.id===sid)).filter(Boolean) : []; };
export const getStopsByOperator = (op) => op==='all' ? STOPS : STOPS.filter(s=>s.operators.includes(op));
export const getLinesByOperator = (op) => op==='all' ? LINES : LINES.filter(l=>l.operator===op);

export const getNextDepartures = (stopId) => {
  const now  = new Date();
  const stop = STOPS.find(s=>s.id===stopId);
  if (!stop) return [];
  return stop.lines.slice(0,5).map((lineId,i) => {
    const line  = LINES.find(l=>l.id===lineId);
    const waits = [3,8,14,22,35];
    const wait  = waits[i%waits.length] + Math.floor(Math.random()*4);
    return {
      lineId, lineName:line?.name||lineId, operator:line?.operator||'DDD',
      color:line?.color||'#1a56db', route:line?.route||'', waitMin:wait,
      time:new Date(now.getTime()+wait*60000).toLocaleTimeString('fr-SN',{hour:'2-digit',minute:'2-digit'}),
    };
  }).sort((a,b)=>a.waitMin-b.waitMin);
};
