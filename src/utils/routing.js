import { STOPS, LINES, OPERATORS } from '../data/transportData';

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function nearestStops(lat, lng, n=5) {
  return STOPS.map(s=>({...s,dist:haversine(lat,lng,s.lat,s.lng)})).sort((a,b)=>a.dist-b.dist).slice(0,n);
}

function resolveLines(stop) {
  if (stop.lines?.length>0) return stop.lines;
  return nearestStops(stop.lat,stop.lng,5).flatMap(s=>s.lines||[]);
}

// Tarif précis
function calcTarif(lines, dist) {
  if (!lines || lines.length===0) return 0;
  return lines.reduce((sum, l) => {
    const op = OPERATORS[l.operator];
    if (l.operator==='TER') return sum + Math.max(500, Math.round(dist/l.stops.length*800));
    return sum + (op?.tarif||200);
  }, 0);
}

// Navigation piétonne (instructions turn-by-turn simulées)
function generateWalkInstructions(fromLat, fromLng, toLat, toLng, toName) {
  const dist = haversine(fromLat, fromLng, toLat, toLng);
  const distM = Math.round(dist * 1000);
  const timeMin = Math.max(1, Math.round(distM / 80)); // 80m/min marche

  const angle = Math.atan2(toLng - fromLng, toLat - fromLat) * 180 / Math.PI;
  const dir = angle > -22.5 && angle <= 22.5 ? 'nord' : angle > 22.5 && angle <= 67.5 ? 'nord-est'
    : angle > 67.5 && angle <= 112.5 ? 'est' : angle > 112.5 && angle <= 157.5 ? 'sud-est'
    : (angle > 157.5 || angle <= -157.5) ? 'sud' : angle > -157.5 && angle <= -112.5 ? 'sud-ouest'
    : angle > -112.5 && angle <= -67.5 ? 'ouest' : 'nord-ouest';

  const steps = [
    { icon:'🚶', text:`Marchez vers le ${dir}`, dist:`${distM > 500 ? Math.round(distM/100)*100 : distM} m` },
    { icon:'🚏', text:`Arrivée à l'arrêt ${toName}`, dist:'' },
  ];

  if (distM > 300) {
    steps.splice(1, 0, { icon:'↗️', text:'Continuez tout droit', dist:`${Math.round(distM * 0.6)} m` });
  }

  return { distM, timeMin, steps, coords: [[fromLat, fromLng], [toLat, toLng]] };
}

export function computeRoute(origin, destination, options = {}) {
  if (!origin || !destination) return null;
  const { accessibilite = false } = options;

  const dist = haversine(origin.lat, origin.lng, destination.lat, destination.lng);
  const originLines  = resolveLines(origin);
  const destLines    = resolveLines(destination);

  // Lignes directes (filtre accessibilité)
  let directLines = originLines.filter(lid => destLines.includes(lid))
    .map(lid => LINES.find(l => l.id === lid)).filter(Boolean);
  if (accessibilite) directLines = directLines.filter(l => l.operator === 'BRT' || l.operator === 'TER');

  // Correspondances
  let allTransfers = [];
  if (directLines.length === 0) {
    const seen = new Map();
    STOPS.forEach(pivot => {
      const l1s = originLines.filter(l=>pivot.lines?.includes(l)).map(lid=>LINES.find(l=>l.id===lid)).filter(Boolean);
      const l2s = destLines.filter(l=>pivot.lines?.includes(l)).map(lid=>LINES.find(l=>l.id===lid)).filter(Boolean);
      l1s.forEach(l1=>l2s.forEach(l2=>{
        if(l1.id===l2.id) return;
        if(accessibilite && l1.operator!=='BRT' && l1.operator!=='TER') return;
        const key=`${l1.id}+${l2.id}`;
        const score = haversine(origin.lat,origin.lng,pivot.lat,pivot.lng)+haversine(pivot.lat,pivot.lng,destination.lat,destination.lng);
        if(!seen.has(key)||score<seen.get(key).score) seen.set(key,{pivot,line1:l1,line2:l2,score});
      }));
    });
    allTransfers = [...seen.values()].sort((a,b)=>a.score-b.score);
  }

  // Stops réels proches
  const originStop  = origin.id==='user_location'  ? nearestStops(origin.lat,origin.lng,1)[0] : origin;
  const destStop    = destination.id==='user_location' ? nearestStops(destination.lat,destination.lng,1)[0] : destination;

  // Navigation piétonne vers l'arrêt de départ
  const walkNav = origin.id==='user_location'
    ? generateWalkInstructions(origin.lat, origin.lng, originStop.lat, originStop.lng, originStop.name)
    : null;

  let steps=[], usedLines=[], transfers=0, allAlternatives=[];

  if (directLines.length > 0) {
    const line = directLines[0];
    usedLines = [line];
    transfers = 0;
    const walkTime = walkNav ? walkNav.timeMin : 2;

    steps = [
      walkNav
        ? { type:'walk', icon:'🚶', label:`Marcher jusqu'à ${originStop.name}`, sublabel:`${walkNav.distM} m · ${walkTime} min à pied`, dur:walkTime, color:'#64748b', walkNav }
        : { type:'depart', icon:'🚏', label:`Départ de ${origin.name}`, sublabel:'', dur:0, color:'#64748b' },
      { type:'ride', icon:OPERATORS[line.operator]?.icon||'🚌', label:line.name, sublabel:line.route, dur:Math.round(dist*3.5+4), color:line.color, lineId:line.id },
      { type:'arrive', icon:'📍', label:`Arrivée à ${destination.name}`, sublabel:'', dur:0, color:'#059669' },
    ];

    allAlternatives = directLines.map((l,i) => ({
      type:'direct', lines:[l], color:l.color, operator:l.operator,
      opIcon:OPERATORS[l.operator]?.icon||'🚌', freq:l.freq, route:l.route,
      tarif:calcTarif([l],dist), recommended:i===0,
    }));

  } else if (allTransfers.length > 0) {
    const { pivot, line1, line2 } = allTransfers[0];
    usedLines = [line1, line2];
    transfers = 1;
    const walkTime = walkNav ? walkNav.timeMin : 2;

    steps = [
      walkNav
        ? { type:'walk', icon:'🚶', label:`Marcher jusqu'à ${originStop.name}`, sublabel:`${walkNav.distM} m · ${walkTime} min`, dur:walkTime, color:'#64748b', walkNav }
        : { type:'depart', icon:'🚏', label:`Départ de ${origin.name}`, sublabel:'', dur:0, color:'#64748b' },
      { type:'ride',     icon:OPERATORS[line1.operator]?.icon||'🚌', label:line1.name, sublabel:`${line1.route} → descendre à ${pivot.name}`, dur:Math.round(dist*2.2), color:line1.color, lineId:line1.id },
      { type:'transfer', icon:'🔄', label:`Correspondance à ${pivot.name}`, sublabel:`Prendre la ${line2.name}`, dur:5, color:'#f59e0b' },
      { type:'ride',     icon:OPERATORS[line2.operator]?.icon||'🚌', label:line2.name, sublabel:`${line2.route} → jusqu'à ${destination.name}`, dur:Math.round(dist*1.8+3), color:line2.color, lineId:line2.id },
      { type:'arrive',   icon:'📍', label:`Arrivée à ${destination.name}`, sublabel:'', dur:0, color:'#059669' },
    ];

    allAlternatives = allTransfers.slice(0,6).map((t,i) => ({
      type:'transfer', lines:[t.line1,t.line2], color:t.line1.color,
      operator:t.line1.operator, opIcon:OPERATORS[t.line1.operator]?.icon||'🚌',
      freq:t.line1.freq, pivot:t.pivot.name,
      tarif:calcTarif([t.line1,t.line2],dist), recommended:i===0,
    }));

  } else {
    steps = [{ type:'walk', icon:'🚶', label:'Trajet entièrement à pied', sublabel:`${Math.round(dist*1000)} m · ${Math.round(dist*12)} min`, dur:Math.round(dist*12), color:'#94a3b8' }];
  }

  const totalDur = steps.reduce((s,st) => s+(st.dur||0), 0);
  const tarif    = calcTarif(usedLines, dist);
  const tarifGroupe = tarif * 4; // famille 4 personnes

  return {
    origin, destination, originStop, destStop, walkNav,
    distance: Math.round(dist*10)/10,
    duration: totalDur, transfers, tarif, tarifGroupe,
    steps, usedLines, allAlternatives,
    direct: directLines.length > 0,
    accessibilite,
  };
}
