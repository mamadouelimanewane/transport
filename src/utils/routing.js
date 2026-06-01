import { STOPS, LINES, OPERATORS } from '../data/transportData';

// ── Haversine ─────────────────────────────────────────────────
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── N stops les plus proches d'un point GPS ───────────────────
function nearestStops(lat, lng, n = 5) {
  return STOPS
    .map(s => ({ ...s, dist: haversine(lat, lng, s.lat, s.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n);
}

// ── Résoudre les lignes réelles d'un stop (inclus stops proches si GPS) ──
function resolveLines(stop) {
  if (stop.lines && stop.lines.length > 0) return stop.lines;
  // Position GPS → collecter les lignes des 5 stops les plus proches
  const nearby = nearestStops(stop.lat, stop.lng, 5);
  return [...new Set(nearby.flatMap(s => s.lines || []))];
}

// ── Stops réels pour un point de départ/arrivée ───────────────
function resolveStops(stop) {
  if (stop.id !== 'user_location' && stop.lines?.length > 0) return [stop];
  return nearestStops(stop.lat, stop.lng, 4);
}

export function computeRoute(origin, destination) {
  if (!origin || !destination) return null;

  const dist = haversine(origin.lat, origin.lng, destination.lat, destination.lng);

  // Résoudre les lignes effectives
  const originLines = resolveLines(origin);
  const destLines   = resolveLines(destination);

  // Stops réels de départ et d'arrivée
  const originStops = resolveStops(origin);
  const destStops   = resolveStops(destination);

  // ── 1. Chercher lignes DIRECTES ───────────────────────────
  const directLines = originLines
    .filter(lid => destLines.includes(lid))
    .map(lid => LINES.find(l => l.id === lid))
    .filter(Boolean);

  // ── 2. Chercher CORRESPONDANCES (pivot unique) ────────────
  let allTransfers = [];
  if (directLines.length === 0) {
    STOPS.forEach(pivot => {
      if (!pivot.lines || pivot.lines.length < 2) return;
      // Lignes qui viennent du départ et passent par le pivot
      const fromLines = originLines.filter(l => pivot.lines.includes(l))
        .map(lid => LINES.find(l => l.id === lid)).filter(Boolean);
      // Lignes qui partent du pivot et vont à l'arrivée
      const toLines = destLines.filter(l => pivot.lines.includes(l))
        .map(lid => LINES.find(l => l.id === lid)).filter(Boolean);

      if (fromLines.length > 0 && toLines.length > 0) {
        fromLines.forEach(l1 => toLines.forEach(l2 => {
          if (l1.id !== l2.id) {
            allTransfers.push({
              pivot,
              line1: l1,
              line2: l2,
              score: haversine(origin.lat,origin.lng,pivot.lat,pivot.lng)
                   + haversine(pivot.lat,pivot.lng,destination.lat,destination.lng),
            });
          }
        }));
      }
    });
    // Dédupliquer par paire de lignes, garder le meilleur pivot
    const seen = new Map();
    allTransfers.forEach(t => {
      const key = `${t.line1.id}+${t.line2.id}`;
      if (!seen.has(key) || t.score < seen.get(key).score) seen.set(key, t);
    });
    allTransfers = [...seen.values()].sort((a,b) => a.score - b.score);
  }

  // ── 3. Construire les étapes ──────────────────────────────
  let steps = [], usedLines = [], transfers = 0, allAlternatives = [];

  // Stop de départ réel le plus proche
  const realOriginStop  = originStops[0]  || origin;
  const realDestStop    = destStops[0]    || destination;
  const walkToOrigin    = origin.id === 'user_location'
    ? Math.round(haversine(origin.lat,origin.lng,realOriginStop.lat,realOriginStop.lng) * 12 + 1)
    : 2;

  if (directLines.length > 0) {
    // ── Trajet direct ──
    const line = directLines[0];
    usedLines  = [line];
    transfers  = 0;

    steps = [
      { type:'walk',   icon:'🚶',
        label: origin.id==='user_location'
          ? `Marcher jusqu'à ${realOriginStop.name}`
          : `Départ de ${origin.name}`,
        sublabel: `${walkToOrigin} min à pied`,
        dur: walkToOrigin, color:'#64748b' },
      { type:'ride',   icon: OPERATORS[line.operator]?.icon||'🚌',
        label: `${line.name}`,
        sublabel: line.route,
        dur: Math.round(dist*3.5+4), color: line.color||'#1a56db', lineId: line.id },
      { type:'arrive', icon:'📍',
        label: `Arrivée à ${destination.name}`,
        sublabel: '', dur: 0, color:'#059669' },
    ];

    allAlternatives = directLines.map((l, i) => ({
      type:'direct', lines:[l],
      color: l.color, operator: l.operator,
      opIcon: OPERATORS[l.operator]?.icon||'🚌',
      freq: l.freq, route: l.route,
      recommended: i === 0,
    }));

  } else if (allTransfers.length > 0) {
    // ── Correspondance ──
    const best = allTransfers[0];
    const { pivot, line1, line2 } = best;
    usedLines = [line1, line2];
    transfers = 1;

    steps = [
      { type:'walk',     icon:'🚶',
        label: origin.id==='user_location'
          ? `Marcher jusqu'à ${realOriginStop.name}`
          : `Départ de ${origin.name}`,
        sublabel: `${walkToOrigin} min à pied`,
        dur: walkToOrigin, color:'#64748b' },
      { type:'ride',     icon: OPERATORS[line1.operator]?.icon||'🚌',
        label: `${line1.name}`,
        sublabel: `${line1.route} → descendre à ${pivot.name}`,
        dur: Math.round(dist*2.2), color: line1.color||'#1a56db', lineId: line1.id },
      { type:'transfer', icon:'🔄',
        label: `Correspondance à ${pivot.name}`,
        sublabel: `Prendre la ${line2.name}`,
        dur: 5, color:'#f59e0b' },
      { type:'ride',     icon: OPERATORS[line2.operator]?.icon||'🚌',
        label: `${line2.name}`,
        sublabel: `${line2.route} → jusqu'à ${destination.name}`,
        dur: Math.round(dist*1.8+3), color: line2.color||'#7c3aed', lineId: line2.id },
      { type:'arrive',   icon:'📍',
        label: `Arrivée à ${destination.name}`,
        sublabel:'', dur:0, color:'#059669' },
    ];

    // Toutes les alternatives (max 6 affichées)
    allAlternatives = allTransfers.slice(0, 6).map((t, i) => ({
      type:'transfer', lines:[t.line1, t.line2],
      color: t.line1.color, operator: t.line1.operator,
      opIcon: OPERATORS[t.line1.operator]?.icon||'🚌',
      freq: t.line1.freq, pivot: t.pivot.name,
      recommended: i === 0,
    }));

  } else {
    // ── Aucune ligne trouvée ──
    steps = [
      { type:'walk', icon:'🚶',
        label:'Aucun bus direct trouvé pour ce trajet',
        sublabel:`Trajet à pied estimé : ${Math.round(dist*12)} min`,
        dur: Math.round(dist*12), color:'#94a3b8' },
    ];
  }

  const totalDur  = steps.reduce((s, st) => s+(st.dur||0), 0);
  const operators = [...new Set(usedLines.map(l=>l?.operator).filter(Boolean))];
  const tarif     = operators.reduce((sum, op) => sum+(OPERATORS[op]?.tarif||200), 0);

  return {
    origin, destination,
    realOrigin:  realOriginStop,
    realDest:    realDestStop,
    distance:    Math.round(dist*10)/10,
    duration:    totalDur,
    transfers,
    tarif,
    steps,
    usedLines,
    allAlternatives,
    direct: directLines.length > 0,
  };
}
