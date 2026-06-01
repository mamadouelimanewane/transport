import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup,
  Polyline, Circle, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedStop, setMapCenter, setMapZoom, clearFocusedLine } from '../store/store';
import { STOPS, LINES, OPERATORS, getNextDepartures } from '../data/transportData';
import { useGeolocation } from '../hooks/useGeolocation';

import iconUrl       from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl     from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// ── OSRM routing ─────────────────────────────────────────────
const OSRM = 'https://router.project-osrm.org/route/v1/driving';

async function routeOnRoads(points) {
  if (points.length < 2) return null;
  const coords = points.map(p => `${p.lng},${p.lat}`).join(';');
  try {
    const res  = await fetch(`${OSRM}/${coords}?overview=full&geometries=geojson&continue_straight=true`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return null;
    return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
  } catch { return null; }
}

async function routeLine(stops) {
  if (stops.length < 2) return null;
  const all = [], chunk = 20;
  for (let i = 0; i < stops.length - 1; i += chunk - 1) {
    const slice  = stops.slice(i, i + chunk);
    const coords = await routeOnRoads(slice);
    if (coords) { if (all.length > 0) all.pop(); all.push(...coords); }
    else slice.forEach(s => all.push([s.lat, s.lng]));
  }
  return all.length > 1 ? all : null;
}

// ── Icônes ───────────────────────────────────────────────────
const makeStopIcon = (color, size = 10) => L.divIcon({
  className: '',
  html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>`,
  iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -size],
});

const makeTerminusIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:${color};border:2.5px solid white;transform:rotate(45deg);box-shadow:0 2px 10px rgba(0,0,0,.35);border-radius:3px"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -12],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:22px;height:22px">
    <div style="position:absolute;inset:0;border-radius:50%;background:rgba(26,86,219,.2);animation:pr 2s ease-out infinite"></div>
    <div style="position:absolute;inset:4px;border-radius:50%;background:#1a56db;border:2.5px solid white;box-shadow:0 2px 10px rgba(26,86,219,.5)"></div>
  </div>
  <style>@keyframes pr{0%{transform:scale(.8);opacity:.8}100%{transform:scale(2.6);opacity:0}}</style>`,
  iconSize: [22, 22], iconAnchor: [11, 11],
});

// Icônes départ / arrivée — plus grands et distinctifs
const makeRouteEndIcon = (color, label) => L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center">
    <div style="width:20px;height:20px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:white">${label}</div>
    <div style="width:3px;height:10px;background:${color};margin-top:-1px;border-radius:0 0 2px 2px"></div>
  </div>`,
  iconSize: [20, 30], iconAnchor: [10, 30], popupAnchor: [0, -32],
});

const originIcon = makeRouteEndIcon('#059669', 'A');
const destIcon   = makeRouteEndIcon('#dc2626', 'B');

// ── Recentrer ────────────────────────────────────────────────
function MapController() {
  const map  = useMap();
  const { mapCenter, mapZoom } = useSelector(s => s.mobility);
  const prev = useRef(null);
  useEffect(() => {
    const key = `${mapCenter[0]},${mapCenter[1]},${mapZoom}`;
    if (key !== prev.current) { prev.current = key; map.flyTo(mapCenter, mapZoom, { duration: 1.2 }); }
  }, [mapCenter, mapZoom, map]);
  return null;
}

// ── Fitbounds sur l'itinéraire ───────────────────────────────
function FitRouteBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 1) {
      map.fitBounds(L.latLngBounds(coords), { padding: [60, 60], maxZoom: 14, duration: 1.2 });
    }
  }, [coords]);
  return null;
}

// ── Popup arrêt ──────────────────────────────────────────────
function StopPopup({ stop }) {
  const deps = getNextDepartures(stop.id);
  return (
    <div style={{ minWidth: 210, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#1a56db', color: 'white', padding: '10px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{stop.name}</div>
        <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>{stop.zone}</div>
      </div>
      <div style={{ padding: '8px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {stop.operators.map(op => (
          <span key={op} style={{ background: OPERATORS[op]?.color||'#64748b', color:'white', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:10 }}>{op}</span>
        ))}
      </div>
      <div style={{ padding: '8px 14px' }}>
        <div style={{ fontSize:10, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>Prochains passages</div>
        {deps.slice(0,3).map((d,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
            <div style={{ background:d.color, color:'white', fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, minWidth:60, textAlign:'center' }}>{d.lineName}</div>
            <span style={{ fontSize:11, color:'#475569', flex:1, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{d.route.split('↔')[1]?.trim()||d.route}</span>
            <span style={{ fontSize:12, fontWeight:700, color:d.waitMin<=5?'#059669':d.waitMin<=15?'#d97706':'#94a3b8' }}>{d.waitMin} min</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cache OSRM ───────────────────────────────────────────────
const lineRouteCache = {};

// ── Ligne de bus (mode normal) ───────────────────────────────
function BusLine({ line, isFocused, hasFocus }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (lineRouteCache[line.id]) { setCoords(lineRouteCache[line.id]); return; }
    const stops = line.stops.map(sid => STOPS.find(s => s.id === sid)).filter(Boolean);
    if (stops.length < 2) return;
    routeLine(stops).then(result => {
      const c = result || stops.map(s => [s.lat, s.lng]);
      lineRouteCache[line.id] = c;
      setCoords(c);
    });
  }, [line.id]);

  if (!coords || coords.length < 2) return null;

  const opacity = hasFocus && !isFocused ? 0.07 : isFocused ? 1 : 0.75;
  const weight  = isFocused ? 7 : 4;

  return (
    <>
      <Polyline positions={coords} color="rgba(0,0,0,.15)" weight={hasFocus&&!isFocused?0:weight+3} opacity={1}/>
      <Polyline positions={coords} color={line.color} weight={weight} opacity={opacity}
        dashArray={line.operator==='TER'?'14 7':null}/>
    </>
  );
}

// ── Tracé itinéraire voyageur — TRÈS VISIBLE ─────────────────
function TripRoute({ origin, destination, onCoordsReady }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!origin || !destination) { setCoords(null); onCoordsReady?.(null); return; }
    setCoords(null);
    setLoading(true);
    routeOnRoads([origin, destination]).then(res => {
      const c = res || [[origin.lat, origin.lng], [destination.lat, destination.lng]];
      setCoords(c);
      onCoordsReady?.(c);
      setLoading(false);
    });
  }, [origin?.id, destination?.id]);

  if (!coords || coords.length < 2) return null;

  return (
    <>
      {/* Halo blanc large */}
      <Polyline positions={coords} color="white"           weight={16} opacity={0.85}/>
      {/* Contour sombre */}
      <Polyline positions={coords} color="rgba(0,0,0,.25)" weight={14} opacity={1}/>
      {/* Ligne principale bleue vif */}
      <Polyline positions={coords} color="#1a56db"          weight={9}  opacity={1}/>
      {/* Tirets blancs animés (sens de parcours) */}
      <Polyline positions={coords} color="rgba(255,255,255,.9)" weight={3} opacity={1} dashArray="8 20"/>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
export default function MapView() {
  const dispatch = useDispatch();
  const { selectedOperator, userLocation, route, focusedLine } = useSelector(s => s.mobility);
  const { locate, loading: geoLoading } = useGeolocation();
  const [loadingCount, setLoadingCount] = useState(0);
  const [routeCoords, setRouteCoords]   = useState(null);

  // Mode itinéraire actif → masquer toutes les lignes
  const routeMode = !!(route?.origin && route?.destination);

  // Lignes visibles seulement si PAS en mode itinéraire
  const visibleLines = routeMode ? [] : (
    focusedLine
      ? LINES.filter(l => l.id === focusedLine)
      : (selectedOperator === 'all' ? LINES : LINES.filter(l => l.operator === selectedOperator))
  );

  // Arrêts : en mode itinéraire → seulement départ et arrivée
  // En mode focus ligne → arrêts de cette ligne seulement
  // Sinon → arrêts selon opérateur
  const routeStopIds = routeMode
    ? [route.origin?.id, route.destination?.id].filter(Boolean)
    : focusedLine
      ? (LINES.find(l => l.id === focusedLine)?.stops || [])
      : null;

  const visibleStops = routeMode
    ? [] // Les marqueurs départ/arrivée suffisent
    : routeStopIds
      ? STOPS.filter(s => routeStopIds.includes(s.id))
      : (selectedOperator === 'all' ? STOPS : STOPS.filter(s => s.operators.includes(selectedOperator)));

  // Compteur chargement OSRM
  useEffect(() => {
    if (routeMode) { setLoadingCount(0); return; }
    const t = setInterval(() => {
      const c = visibleLines.filter(l => lineRouteCache[l.id]).length;
      setLoadingCount(c < visibleLines.length ? visibleLines.length - c : 0);
    }, 600);
    return () => clearInterval(t);
  }, [selectedOperator, focusedLine, routeMode]);

  return (
    <div style={{ position:'relative', flex:1, overflow:'hidden' }}>

      {/* Indicateur chargement tracés */}
      {!routeMode && loadingCount > 0 && (
        <div style={{
          position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
          zIndex:900, background:'white', borderRadius:20, padding:'6px 16px',
          boxShadow:'0 4px 16px rgba(0,0,0,.15)', fontSize:12, fontWeight:600,
          color:'#1a56db', display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap',
        }}>
          <span style={{ display:'inline-block', animation:'spin 1s linear infinite' }}>⟳</span>
          Tracés sur routes… ({loadingCount} restant{loadingCount>1?'s':''})
        </div>
      )}

      {/* Indicateur chargement itinéraire */}
      {routeMode && !routeCoords && (
        <div style={{
          position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
          zIndex:900, background:'#1a56db', color:'white', borderRadius:20, padding:'8px 18px',
          boxShadow:'0 4px 20px rgba(26,86,219,.4)', fontSize:12, fontWeight:700,
          display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap',
        }}>
          <span style={{ display:'inline-block', animation:'spin 1s linear infinite' }}>⟳</span>
          Calcul du tracé sur routes réelles…
        </div>
      )}

      {/* Bannière focus ligne (hors mode itinéraire) */}
      {!routeMode && focusedLine && (() => {
        const fl = LINES.find(l => l.id === focusedLine);
        return fl ? (
          <div style={{
            position:'absolute', top:10, left:10, zIndex:900,
            background:fl.color, color:'white', borderRadius:12, padding:'8px 14px',
            boxShadow:'0 4px 20px rgba(0,0,0,.25)',
            display:'flex', alignItems:'center', gap:10, fontFamily:'Inter, sans-serif',
          }}>
            <span style={{ fontWeight:800, fontSize:14 }}>{fl.name}</span>
            <span style={{ fontSize:12, opacity:.9 }}>{fl.route}</span>
            <button onClick={() => dispatch(clearFocusedLine())} style={{
              background:'rgba(255,255,255,.25)', border:'none', borderRadius:8,
              color:'white', cursor:'pointer', padding:'3px 9px', fontSize:12, fontWeight:600,
            }}>✕ Tout</button>
          </div>
        ) : null;
      })()}

      {/* Bouton géoloc */}
      <button onClick={locate} title="Ma position" style={{
        position:'absolute', bottom:24, right:14, zIndex:900,
        width:46, height:46, borderRadius:13,
        background:'white', border:'1px solid rgba(26,86,219,.2)',
        boxShadow:'0 4px 16px rgba(0,0,0,.15)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:20, cursor:'pointer',
      }}>
        {geoLoading
          ? <span style={{ animation:'spin 1s linear infinite', display:'block' }}>⟳</span>
          : '📍'}
      </button>

      <MapContainer center={[14.7167, -17.4677]} zoom={12}
        style={{ width:'100%', height:'100%' }} zoomControl={false}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org">OpenStreetMap</a> | Routing © OSRM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController/>

        {/* ── MODE NORMAL : toutes les lignes ── */}
        {!routeMode && visibleLines.map(line => (
          <BusLine key={line.id} line={line}
            isFocused={focusedLine===line.id}
            hasFocus={!!focusedLine}/>
        ))}

        {/* ── MODE NORMAL : arrêts ── */}
        {!routeMode && visibleStops.map(stop => {
          const mainOp = stop.operators[0];
          const color  = OPERATORS[mainOp]?.color||'#1a56db';
          const isHub  = stop.lines.length > 2;
          const icon   = isHub ? makeTerminusIcon(color) : makeStopIcon(color, stop.operators.length>1?13:10);
          return (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={icon}
              eventHandlers={{ click:()=>dispatch(setSelectedStop(stop.id)) }}>
              <Popup maxWidth={230} minWidth={210}><StopPopup stop={stop}/></Popup>
            </Marker>
          );
        })}

        {/* ── MODE ITINÉRAIRE : tracé très visible ── */}
        {routeMode && route?.origin && route?.destination && (
          <>
            <TripRoute
              origin={route.origin}
              destination={route.destination}
              onCoordsReady={c => setRouteCoords(c)}
            />
            {routeCoords && <FitRouteBounds coords={routeCoords}/>}
          </>
        )}

        {/* ── Marqueurs départ / arrivée ── */}
        {routeMode && route?.origin && (
          <Marker position={[route.origin.lat, route.origin.lng]} icon={originIcon} zIndexOffset={1000}>
            <Popup>
              <div style={{ padding:'10px 14px', fontFamily:'Inter,sans-serif' }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#059669' }}>🟢 Départ</div>
                <div style={{ fontSize:13, marginTop:4 }}>{route.origin.name}</div>
              </div>
            </Popup>
          </Marker>
        )}
        {routeMode && route?.destination && (
          <Marker position={[route.destination.lat, route.destination.lng]} icon={destIcon} zIndexOffset={1000}>
            <Popup>
              <div style={{ padding:'10px 14px', fontFamily:'Inter,sans-serif' }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#dc2626' }}>🔴 Arrivée</div>
                <div style={{ fontSize:13, marginTop:4 }}>{route.destination.name}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ── Position utilisateur (toujours visible) ── */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup><div style={{ padding:'10px 14px', fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:14 }}>📍 Ma position</div></Popup>
            </Marker>
            <Circle center={userLocation} radius={300} color="#1a56db" fillColor="#1a56db" fillOpacity={0.07} weight={1}/>
          </>
        )}
      </MapContainer>
    </div>
  );
}
