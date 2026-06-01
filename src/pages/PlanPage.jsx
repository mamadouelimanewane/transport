import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOrigin, setDestination, setRoute, clearRoute,
  setMapCenter, setMapZoom, setFocusedLine, clearFocusedLine,
  setSelectedOperator,
} from '../store/store';
import { STOPS, LINES, OPERATORS, TER_TARIFS, TER_ABONNEMENTS } from '../data/transportData';
import { computeRoute } from '../utils/routing';
import { useGeolocation } from '../hooks/useGeolocation';

// ── Haversine distance km ─────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearestStop(lat, lng) {
  return STOPS.reduce((best, s) => {
    const d = haversine(lat, lng, s.lat, s.lng);
    return d < best.dist ? { stop: s, dist: d } : best;
  }, { stop: null, dist: Infinity }).stop;
}

const css = `
.plan-page{display:flex;flex-direction:column;height:100%;overflow:hidden}
.plan-scroll{flex:1;overflow-y:auto;padding:14px}

.search-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-md);margin-bottom:10px;box-shadow:var(--shadow-sm);position:relative;overflow:visible}
.search-row{display:flex;align-items:center;gap:0;padding:4px 10px}
.search-row+.search-row{border-top:1px solid var(--surface-border)}
.search-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-right:10px}
.search-input{flex:1;border:none;background:transparent;padding:10px 4px;font-size:14px;color:var(--text-primary);font-weight:500}
.search-input::placeholder{color:var(--text-muted);font-weight:400}
.s-btn{width:30px;height:30px;border-radius:8px;border:none;background:var(--surface-2);color:var(--text-secondary);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;flex-shrink:0;transition:background var(--t-fast)}
.s-btn:hover{background:var(--surface-3)}
.swap-row{display:flex;justify-content:center;height:1px;background:var(--surface-border);position:relative;margin:0 10px}
.swap-btn{position:absolute;width:28px;height:28px;border-radius:50%;background:var(--surface-0);border:1.5px solid var(--surface-border);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;transition:all var(--t-fast);color:var(--text-secondary)}
.swap-btn:hover{background:var(--brand-600);color:white;border-color:var(--brand-600)}

.suggestions{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:500;background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);overflow:hidden;max-height:220px;overflow-y:auto}
.sug-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background var(--t-fast);border-bottom:1px solid var(--surface-1)}
.sug-item:last-child{border-bottom:none}
.sug-item:hover{background:var(--surface-1)}
.sug-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}

/* Bouton arrêt le plus proche */
.nearest-btn{display:flex;align-items:center;gap:8px;padding:9px 14px;background:var(--surface-1);border:1.5px dashed var(--surface-border);border-radius:var(--radius-sm);cursor:pointer;font-size:12px;color:var(--text-secondary);margin-bottom:10px;transition:all var(--t-fast);width:100%}
.nearest-btn:hover{background:var(--surface-2);border-color:var(--brand-400);color:var(--brand-600)}
.nearest-badge{background:var(--brand-600);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:auto}

.go-btn{width:100%;padding:13px;background:var(--brand-600);color:white;border-radius:var(--radius-md);border:none;font-size:15px;font-weight:600;cursor:pointer;box-shadow:var(--shadow-brand);transition:all var(--t-fast);display:flex;align-items:center;justify-content:center;gap:8px}
.go-btn:hover:not(:disabled){background:var(--brand-700);transform:translateY(-1px)}
.go-btn:disabled{background:var(--surface-3);color:var(--text-muted);box-shadow:none;transform:none;cursor:not-allowed}

.route-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-md);overflow:hidden;margin-top:12px;box-shadow:var(--shadow-sm);animation:fadeIn .25s ease both}
.route-header{background:linear-gradient(135deg,var(--brand-600),var(--brand-800));color:white;padding:14px 16px}
.route-metrics{display:flex;border-bottom:1px solid var(--surface-border)}
.metric{flex:1;padding:12px;text-align:center;border-right:1px solid var(--surface-border)}
.metric:last-child{border-right:none}
.metric-val{font-size:18px;font-weight:700;color:var(--text-primary)}
.metric-lbl{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}
.steps-list{padding:14px 16px}
.step-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.step-row:last-child{margin-bottom:0}
.step-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.step-label{font-size:13px;font-weight:600;color:var(--text-primary)}
.step-sub{font-size:12px;color:var(--text-secondary);margin-top:1px}
.step-dur{font-size:11px;color:var(--text-muted);margin-top:2px}
.step-connector{width:2px;height:14px;background:var(--surface-border);margin:0 15px}

.ter-connection-banner{background:linear-gradient(135deg,#059669,#047857);color:white;border-radius:var(--radius-sm);padding:12px 14px;margin:0 16px 12px;cursor:pointer;transition:all var(--t-fast)}
.ter-connection-banner:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(5,150,105,.3)}
.ter-conn-title{font-size:13px;font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:4px}
.ter-conn-sub{font-size:11px;opacity:.85;display:flex;gap:10px;flex-wrap:wrap}

/* QR Modal */
.qr-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2000;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .2s ease}
.qr-modal{background:var(--surface-0);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px;max-height:90vh;overflow-y:auto;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.qr-handle{width:40px;height:4px;background:var(--surface-3);border-radius:2px;margin:0 auto 20px}
.qr-tabs{display:flex;gap:6px;margin-bottom:16px;background:var(--surface-1);padding:4px;border-radius:10px}
.qr-tab{flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:var(--text-secondary);transition:all var(--t-fast)}
.qr-tab.active{background:var(--surface-0);color:var(--text-primary);box-shadow:var(--shadow-sm)}
.ticket-card{border:1.5px solid var(--surface-border);border-radius:var(--radius-md);padding:14px;margin-bottom:10px;cursor:pointer;transition:all var(--t-fast);display:flex;align-items:center;gap:12px}
.ticket-card:hover{border-color:var(--brand-400);box-shadow:var(--shadow-md)}
.ticket-card.selected{border-color:#059669;background:#ecfdf5}
.ticket-price{font-size:16px;font-weight:700;color:#059669;margin-left:auto;white-space:nowrap}
.qr-display{text-align:center;padding:20px 0}
.buy-btn{width:100%;padding:13px;background:#059669;color:white;border:none;border-radius:var(--radius-md);font-size:15px;font-weight:700;cursor:pointer;margin-top:16px;transition:all var(--t-fast)}
.buy-btn:hover{background:#047857;transform:translateY(-1px)}

/* Notation */
.rating-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-md);margin-top:12px;overflow:hidden;animation:fadeIn .25s ease both}
.rating-header{padding:14px 16px;border-bottom:1px solid var(--surface-border);display:flex;align-items:center;gap:10px}
.stars-row{display:flex;gap:6px;padding:14px 16px}
.star-btn{font-size:28px;cursor:pointer;transition:transform var(--t-fast);border:none;background:none;padding:0}
.star-btn:hover{transform:scale(1.15)}
.rating-cats{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px 12px}
.cat-item{display:flex;align-items:center;justify-content:space-between;background:var(--surface-1);border-radius:8px;padding:8px 12px}
.cat-label{font-size:12px;color:var(--text-secondary)}
.cat-stars{display:flex;gap:2px}
.cat-star{font-size:14px;cursor:pointer;border:none;background:none;padding:0}
.rating-textarea{display:block;width:calc(100% - 32px);margin:0 16px 12px;padding:10px 12px;border:1.5px solid var(--surface-border);border-radius:var(--radius-sm);font-size:13px;background:var(--surface-1);color:var(--text-primary);resize:none;font-family:var(--font-sans)}
.rating-submit{display:flex;align-items:center;justify-content:center;gap:6px;margin:0 16px 16px;width:calc(100% - 32px);padding:10px;background:var(--brand-600);color:white;border:none;border-radius:var(--radius-sm);font-size:13px;font-weight:600;cursor:pointer}

/* Lignes rapides */
.quick-lines{margin-top:16px}
.section-label{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;padding:0 2px}
.op-section{margin-bottom:14px}
.op-label{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;margin-bottom:6px;padding:4px 8px;border-radius:6px;background:var(--surface-1)}
.quick-line-grid{display:flex;flex-wrap:wrap;gap:5px}
.quick-line-pill{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:20px;border:none;cursor:pointer;font-size:11px;font-weight:700;transition:all var(--t-fast);color:white;opacity:1}
.quick-line-pill:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.2)}
.quick-line-pill.active{box-shadow:0 0 0 2px white,0 0 0 4px var(--pill-color,#1a56db)}

/* Historique */
.history-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--surface-1);margin-bottom:6px;cursor:pointer;border:1px solid var(--surface-border);transition:all var(--t-fast)}
.history-item:hover{background:var(--surface-2)}
`;

// ── QR Code SVG ───────────────────────────────────────────────
function QRCodeSVG({ data, size = 160 }) {
  const N = 21, cell = size / N;
  const hash = (i) => ((data.charCodeAt(i % data.length) * 6364136 + i * 1442695) % 256) > 127;
  const isCornerZone = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N-7) || (r >= N-7 && c < 7);
  const isCornerBorder = (r, c) => {
    if (r < 7 && c < 7) return r===0||r===6||c===0||c===6;
    if (r < 7 && c >= N-7) return r===0||r===6||c===N-7||c===N-1;
    if (r >= N-7 && c < 7) return r===N-7||r===N-1||c===0||c===6;
    return false;
  };
  const isCornerFill = (r, c) => {
    if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
    if (r >= 2 && r <= 4 && c >= N-5 && c <= N-3) return true;
    if (r >= N-5 && r <= N-3 && c >= 2 && c <= 4) return true;
    return false;
  };
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    let fill = '#fff';
    if (isCornerZone(r, c)) fill = (isCornerBorder(r, c) || isCornerFill(r, c)) ? '#111' : '#fff';
    else fill = hash(r * N + c) ? '#111' : '#fff';
    cells.push(<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill={fill}/>);
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{background:'white',borderRadius:8}}>{cells}</svg>;
}

// ── Modal billetterie TER ─────────────────────────────────────
function TerBilletterieModal({ stop, onClose }) {
  const [tab, setTab]       = useState('tickets');
  const [selected, setSel]  = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [paid, setPaid]     = useState(false);
  const tarifs = TER_TARIFS.filter(t => t.from === stop.terInfo?.gare || t.to === stop.terInfo?.gare);
  const qrData = selected ? `TER-SN-${selected.id||selected.from+'-'+selected.to}-${Date.now()}` : '';
  const handleBuy = () => { if (!selected) return; setShowQr(true); setTimeout(() => setPaid(true), 1500); };
  return (
    <div className="qr-modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="qr-modal">
        <div className="qr-handle"/>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <span style={{fontSize:28}}>🚆</span>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>Billetterie TER</div>
            <div style={{fontSize:12,color:'var(--text-secondary)'}}>Gare de {stop.terInfo?.gare}</div>
          </div>
          <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--text-muted)'}}>✕</button>
        </div>
        <div style={{background:'#ecfdf5',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:12}}>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            <span>🕐 {stop.terInfo?.horaires}</span>
            <span>⏱ / {stop.terInfo?.freq}</span>
            <span>🚉 Quai {stop.terInfo?.quai?.join(', ')}</span>
          </div>
          <div style={{marginTop:6,fontSize:11,color:'#047857'}}>Services : {stop.terInfo?.services?.join(' · ')}</div>
          {stop.terInfo?.correspondances?.length > 0 && (
            <div style={{marginTop:4,fontSize:11,color:'#047857'}}>🔄 {stop.terInfo.correspondances.join(' · ')}</div>
          )}
        </div>
        {!showQr ? (
          <>
            <div className="qr-tabs">
              <button className={`qr-tab${tab==='tickets'?' active':''}`} onClick={()=>{setTab('tickets');setSel(null)}}>🎟️ Tickets</button>
              <button className={`qr-tab${tab==='abonnements'?' active':''}`} onClick={()=>{setTab('abonnements');setSel(null)}}>📅 Abonnements</button>
            </div>
            {tab==='tickets' && tarifs.map((t,i) => (
              <div key={i} className={`ticket-card${selected===t?' selected':''}`} onClick={()=>setSel(t)}>
                <span style={{fontSize:22}}>🎫</span>
                <div><div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{t.from} → {t.to}</div><div style={{fontSize:11,color:'var(--text-secondary)'}}>2e classe · Aller simple</div></div>
                <div className="ticket-price">{t.prix.toLocaleString()} F</div>
              </div>
            ))}
            {tab==='abonnements' && TER_ABONNEMENTS.map(ab => (
              <div key={ab.id} className={`ticket-card${selected===ab?' selected':''}`} onClick={()=>setSel(ab)}>
                <span style={{fontSize:22}}>{ab.icon}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{ab.label}</div><div style={{fontSize:11,color:'var(--text-secondary)'}}>{ab.trajets}</div></div>
                <div className="ticket-price">{ab.prix.toLocaleString()} F</div>
              </div>
            ))}
            {selected && <button className="buy-btn" onClick={handleBuy}>💳 Acheter — {(selected.prix||0).toLocaleString()} FCFA</button>}
          </>
        ) : (
          <div className="qr-display">
            {paid ? (
              <>
                <div style={{fontSize:14,fontWeight:700,color:'#059669',marginBottom:16}}>✅ Paiement confirmé !</div>
                <div style={{display:'inline-block',padding:16,background:'white',borderRadius:16,border:'3px solid #059669',boxShadow:'0 8px 32px rgba(5,150,105,.2)'}}>
                  <QRCodeSVG data={qrData} size={180}/>
                </div>
                <div style={{fontWeight:700,marginTop:16,color:'var(--text-primary)'}}>{selected?.label||`${selected?.from} → ${selected?.to}`}</div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4,fontFamily:'monospace'}}>{qrData.slice(0,28)}…</div>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#ecfdf5',color:'#059669',borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:600,marginTop:12}}>
                  ✅ Valable {tab==='abonnements'?'30 jours':'aujourd\'hui'}
                </div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:10}}>Présentez ce QR au contrôleur ou au validateur</div>
                <button onClick={onClose} style={{marginTop:14,padding:'8px 20px',background:'var(--surface-1)',border:'1px solid var(--surface-border)',borderRadius:10,cursor:'pointer',fontSize:13,color:'var(--text-primary)'}}>Fermer</button>
              </>
            ) : (
              <div style={{padding:'40px 0'}}>
                <div style={{fontSize:32,marginBottom:12}}>⏳</div>
                <div style={{fontSize:14,color:'var(--text-secondary)'}}>Traitement du paiement…</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Notation du voyage ─────────────────────────────────────────
function RatingCard({ route }) {
  const [stars,   setStars]   = useState(0);
  const [hover,   setHover]   = useState(0);
  const [cats,    setCats]    = useState({ ponctualite:0, confort:0, proprete:0, securite:0 });
  const [comment, setComment] = useState('');
  const [done,    setDone]    = useState(false);
  const catLabels = { ponctualite:'Ponctualité', confort:'Confort', proprete:'Propreté', securite:'Sécurité' };
  if (done) return (
    <div className="rating-card">
      <div style={{textAlign:'center',padding:'20px'}}>
        <div style={{fontSize:32,marginBottom:8}}>🎉</div>
        <div style={{fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Merci pour votre avis !</div>
        <div style={{fontSize:13,color:'var(--text-secondary)'}}>Votre note aide à améliorer le service.</div>
      </div>
    </div>
  );
  return (
    <div className="rating-card">
      <div className="rating-header">
        <span style={{fontSize:20}}>⭐</span>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'var(--text-primary)'}}>Notez votre voyage</div>
          <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:1}}>{route?.origin?.name} → {route?.destination?.name}</div>
        </div>
      </div>
      <div className="stars-row">
        {[1,2,3,4,5].map(s => (
          <button key={s} className="star-btn" onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(s)}>
            {s<=(hover||stars)?'⭐':'☆'}
          </button>
        ))}
        {stars>0 && <span style={{fontSize:13,color:'var(--text-secondary)',marginLeft:8,lineHeight:'36px'}}>{['','Très mauvais','Mauvais','Correct','Bien','Excellent'][stars]}</span>}
      </div>
      <div className="rating-cats">
        {Object.entries(catLabels).map(([key,label])=>(
          <div key={key} className="cat-item">
            <span className="cat-label">{label}</span>
            <div className="cat-stars">
              {[1,2,3,4,5].map(s=>(
                <button key={s} className="cat-star" onClick={()=>setCats(c=>({...c,[key]:s}))}>{s<=cats[key]?'⭐':'☆'}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <textarea className="rating-textarea" rows={3} placeholder="Partagez votre expérience (optionnel)…" value={comment} onChange={e=>setComment(e.target.value)}/>
      <button className="rating-submit" disabled={stars===0} onClick={()=>stars>0&&setDone(true)} style={stars===0?{opacity:.5,cursor:'not-allowed'}:{}}>
        📤 Envoyer mon avis
      </button>
    </div>
  );
}

// ── Autocomplete ──────────────────────────────────────────────
function SuggestionList({ items, onSelect }) {
  return items.length===0 ? null : (
    <div className="suggestions">
      {items.map(s => {
        const op = s.operators[0];
        const color = OPERATORS[op]?.color||'#64748b';
        return (
          <div key={s.id} className="sug-item" onMouseDown={()=>onSelect(s)}>
            <div className="sug-icon" style={{background:color+'20'}}>{OPERATORS[op]?.icon||'🚏'}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:'var(--text-primary)'}}>{s.name}</div>
              <div style={{fontSize:11,color:'var(--text-muted)'}}>{s.zone} · {s.operators.join(', ')}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function PlanPage() {
  const dispatch = useDispatch();
  const { origin, destination, route, focusedLine, userLocation, selectedOperator } = useSelector(s => s.mobility);
  const { locate } = useGeolocation();

  const [fromQ, setFromQ] = useState(origin?.name||'');
  const [toQ,   setToQ]   = useState(destination?.name||'');
  const [fromSug, setFromSug] = useState([]);
  const [toSug,   setToSug]   = useState([]);
  const [history, setHistory] = useState(()=>{ try{return JSON.parse(localStorage.getItem('dm_history')||'[]')}catch{return [];} });
  const [terModal, setTerModal] = useState(null);
  const [nearestInfo, setNearestInfo] = useState(null);

  const fromRef = useRef(null);
  const toRef   = useRef(null);

  // ── Position actuelle → départ par défaut ─────────────────
  useEffect(() => {
    if (userLocation && !origin) {
      const [lat, lng] = userLocation;
      const pseudo = { id:'user_location', name:'📍 Ma position actuelle', zone:'GPS', lat, lng, operators:['DDD'], lines:[] };
      dispatch(setOrigin(pseudo));
      setFromQ('📍 Ma position actuelle');
      setNearestInfo(nearestStop(lat, lng));
    }
  }, [userLocation]);

  // ── Bouton "Arrêt le plus proche" ────────────────────────
  const handleNearestStop = () => {
    if (!userLocation) { locate(); return; }
    const [lat, lng] = userLocation;
    const nearest = nearestStop(lat, lng);
    if (nearest) {
      setToQ(nearest.name);
      setToSug([]);
      dispatch(setDestination(nearest));
      dispatch(setMapCenter([nearest.lat, nearest.lng]));
      dispatch(setMapZoom(15));
      setNearestInfo(nearest);
    }
  };

  const suggest = q => q.length>=2 ? STOPS.filter(s=>
    s.name.toLowerCase().includes(q.toLowerCase())||s.zone.toLowerCase().includes(q.toLowerCase())
  ).slice(0,7) : [];

  const selectFrom = stop => { setFromQ(stop.name); setFromSug([]); dispatch(setOrigin(stop)); dispatch(setMapCenter([stop.lat,stop.lng])); dispatch(setMapZoom(14)); };
  const selectTo   = stop => { setToQ(stop.name);   setToSug([]);   dispatch(setDestination(stop)); dispatch(setMapCenter([stop.lat,stop.lng])); dispatch(setMapZoom(14)); };

  const handleGeolocate = () => { locate(); setFromQ('📍 Ma position actuelle'); setFromSug([]); };
  const handleSwap = () => {
    const tmp = fromQ; setFromQ(toQ); setToQ(tmp);
    dispatch(setOrigin(destination)); dispatch(setDestination(origin));
  };

  const handleSearch = () => {
    if (!origin||!destination) return;
    const r = computeRoute(origin, destination);
    dispatch(setRoute(r));
    dispatch(setMapCenter([(origin.lat+destination.lat)/2,(origin.lng+destination.lng)/2]));
    dispatch(setMapZoom(13));
    const entry = { fromName:origin.name, toName:destination.name, fromId:origin.id, toId:destination.id };
    const updated = [entry,...history.filter(h=>h.fromId!==origin.id||h.toId!==destination.id)].slice(0,5);
    setHistory(updated);
    localStorage.setItem('dm_history', JSON.stringify(updated));
  };

  useEffect(() => {
    const h = e => {
      if (!fromRef.current?.contains(e.target)) setFromSug([]);
      if (!toRef.current?.contains(e.target))   setToSug([]);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Lignes filtrées selon l'opérateur sélectionné ────────
  const opGroups = {};
  LINES
    .filter(l => selectedOperator==='all' || l.operator===selectedOperator)
    .forEach(l => { if (!opGroups[l.operator]) opGroups[l.operator]=[]; opGroups[l.operator].push(l); });

  const nearbyTerStops = STOPS.filter(s=>s.terConnection);

  return (
    <div className="plan-page">
      <style>{css}</style>
      <div className="plan-scroll">

        {/* ── Saisie départ/arrivée ── */}
        <div className="search-card" ref={fromRef}>
          <div className="search-row">
            <div className="search-dot" style={{background:'#059669'}}/>
            <input className="search-input" value={fromQ}
              onChange={e=>{setFromQ(e.target.value);setFromSug(suggest(e.target.value))}}
              placeholder="D'où partez-vous ?"/>
            <button className="s-btn" onClick={handleGeolocate} title="Ma position">📍</button>
            {fromQ && <button className="s-btn" onClick={()=>{setFromQ('');dispatch(setOrigin(null))}}>✕</button>}
          </div>
          <div className="swap-row"><button className="swap-btn" onClick={handleSwap}>⇅</button></div>
          <div className="search-row" ref={toRef}>
            <div className="search-dot" style={{background:'#dc2626'}}/>
            <input className="search-input" value={toQ}
              onChange={e=>{setToQ(e.target.value);setToSug(suggest(e.target.value))}}
              placeholder="Où allez-vous ?"/>
            {toQ && <button className="s-btn" onClick={()=>{setToQ('');dispatch(setDestination(null))}}>✕</button>}
          </div>
          {fromSug.length>0 && <SuggestionList items={fromSug} onSelect={selectFrom}/>}
          {toSug.length>0   && <SuggestionList items={toSug}   onSelect={selectTo}/>}
        </div>

        {/* ── Bouton arrêt le plus proche ── */}
        <button className="nearest-btn" onClick={handleNearestStop}>
          <span>🚏</span>
          <span style={{flex:1,textAlign:'left'}}>
            {nearestInfo
              ? <>Arrêt le plus proche : <strong style={{color:'var(--text-primary)'}}>{nearestInfo.name}</strong></>
              : 'Trouver l\'arrêt de bus le plus proche'
            }
          </span>
          {nearestInfo && (
            <span style={{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap'}}>
              {Math.round(haversine(userLocation?.[0]||14.7167, userLocation?.[1]||-17.4677, nearestInfo.lat, nearestInfo.lng)*1000)} m
            </span>
          )}
          <span className="nearest-badge">→ Destination</span>
        </button>

        <button className="go-btn" onClick={handleSearch} disabled={!origin||!destination}>
          🔍 Calculer l'itinéraire
        </button>

        {/* ── Résultat itinéraire ── */}
        {route && (
          <>
            <div className="route-card">
              <div className="route-header">
                <div style={{fontSize:13,opacity:.8}}>{route.origin?.name}</div>
                <div style={{fontSize:20}}>↓</div>
                <div style={{fontSize:13,opacity:.8}}>{route.destination?.name}</div>
                {route.direct && (
                  <div style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.2)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:600}}>
                    ✅ Trajet direct
                  </div>
                )}
              </div>
              <div className="route-metrics">
                <div className="metric"><div className="metric-val">⏱ {route.duration} min</div><div className="metric-lbl">Durée</div></div>
                <div className="metric"><div className="metric-val">📏 {route.distance} km</div><div className="metric-lbl">Distance</div></div>
                <div className="metric"><div className="metric-val" style={{color:'#059669'}}>💰 {route.tarif} F</div><div className="metric-lbl">Tarif est.</div></div>
              </div>
              <div className="steps-list">
                {route.steps?.map((step,i)=>(
                  <React.Fragment key={i}>
                    <div className="step-row">
                      <div className="step-icon" style={{background:step.color+'20'}}>{step.icon}</div>
                      <div style={{flex:1,paddingTop:4}}>
                        <div className="step-label">{step.label}</div>
                        {step.sublabel && <div className="step-sub">{step.sublabel}</div>}
                        {step.dur>0 && <div className="step-dur">{step.dur} min</div>}
                      </div>
                    </div>
                    {i<route.steps.length-1 && <div className="step-connector"/>}
                  </React.Fragment>
                ))}
              </div>

              {/* ── LIGNES QUI DESSERVENT CE TRAJET ── */}
              {route.allAlternatives?.length > 0 && (
                <div style={{borderTop:'1px solid var(--surface-border)',padding:'14px 16px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>
                    🚌 Lignes qui desservent ce trajet
                  </div>
                  {route.allAlternatives.map((alt, i) => (
                    <div key={i} style={{
                      display:'flex', alignItems:'flex-start', gap:10,
                      padding:'9px 10px', borderRadius:10, marginBottom:6,
                      background: i===0 ? alt.color+'12' : 'var(--surface-1)',
                      border: `1.5px solid ${i===0 ? alt.color+'40' : 'var(--surface-border)'}`,
                      cursor:'pointer', transition:'all .15s',
                    }}
                    onClick={() => {
                      // Focus la 1ère ligne de l'alternative sur la carte
                      dispatch(setFocusedLine(alt.lines[0]?.id));
                    }}>
                      {/* Badge opérateur */}
                      <div style={{
                        background: alt.color, color:'white',
                        borderRadius:8, padding:'4px 8px', fontSize:10,
                        fontWeight:800, flexShrink:0, marginTop:1,
                        display:'flex', alignItems:'center', gap:4,
                      }}>
                        <span>{alt.opIcon}</span>
                        <span>{OPERATORS[alt.operator]?.name}</span>
                      </div>
                      {/* Infos */}
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:3}}>
                          {alt.lines.map((l,li) => (
                            <React.Fragment key={l.id}>
                              <span style={{
                                background:l.color, color:'white',
                                fontSize:11, fontWeight:800,
                                padding:'2px 9px', borderRadius:20,
                              }}>{l.name}</span>
                              {li < alt.lines.length-1 && (
                                <span style={{fontSize:12,color:'var(--text-muted)',fontWeight:700}}>+</span>
                              )}
                            </React.Fragment>
                          ))}
                          {i===0 && (
                            <span style={{
                              background:'#ecfdf5', color:'#059669',
                              fontSize:10, fontWeight:700,
                              padding:'2px 7px', borderRadius:10, marginLeft:'auto',
                            }}>Recommandé</span>
                          )}
                        </div>
                        <div style={{fontSize:12,color:'var(--text-secondary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                          {alt.type==='transfer'
                            ? `Correspondance à ${alt.pivot}`
                            : alt.lines[0]?.route}
                        </div>
                        <div style={{display:'flex', gap:10, marginTop:3}}>
                          <span style={{fontSize:11,color:'var(--text-muted)'}}>⏱ {alt.freq}</span>
                          <span style={{fontSize:11,color:'var(--text-muted)'}}>
                            {alt.type==='transfer' ? '🔄 Correspondance' : '✅ Direct'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TER correspondances */}
              <div style={{padding:'0 16px 14px'}}>
                <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:8}}>
                  🚆 Correspondances TER disponibles
                </div>
                {nearbyTerStops.slice(0,3).map(s=>(
                  <div key={s.id} className="ter-connection-banner" onClick={()=>setTerModal(s)}>
                    <div className="ter-conn-title">
                      🚆 {s.name}
                      <span style={{marginLeft:'auto',fontSize:11,background:'rgba(255,255,255,.2)',padding:'2px 8px',borderRadius:10}}>Billetterie →</span>
                    </div>
                    <div className="ter-conn-sub">
                      <span>⏱ {s.terInfo?.freq}</span>
                      <span>🕐 {s.terInfo?.horaires}</span>
                      <span>🔄 {s.terInfo?.correspondances?.slice(0,2).join(' · ')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{display:'flex',gap:8,padding:'0 16px 14px'}}>
                <button onClick={()=>{
                  const url=`${location.origin}?from=${encodeURIComponent(origin.name)}&to=${encodeURIComponent(destination.name)}`;
                  if(navigator.share) navigator.share({title:'SenBus',url}); else {navigator.clipboard.writeText(url);alert('Lien copié !');}
                }} style={{flex:1,padding:'9px',borderRadius:'10px',background:'var(--surface-1)',border:'1px solid var(--surface-border)',fontSize:12,fontWeight:500,cursor:'pointer',color:'var(--text-secondary)'}}>
                  🔗 Partager
                </button>
                <button onClick={()=>dispatch(clearRoute())} style={{flex:1,padding:'9px',borderRadius:'10px',background:'var(--surface-1)',border:'1px solid var(--surface-border)',fontSize:12,fontWeight:500,cursor:'pointer',color:'var(--text-secondary)'}}>
                  ✕ Effacer
                </button>
              </div>
            </div>

            <RatingCard route={route}/>
          </>
        )}

        {/* ── Historique ── */}
        {!route && history.length>0 && (
          <div style={{marginTop:16}}>
            <div className="section-label">Recherches récentes</div>
            {history.map((h,i)=>(
              <div key={i} className="history-item" onClick={()=>{
                const f=STOPS.find(s=>s.id===h.fromId), t=STOPS.find(s=>s.id===h.toId);
                if(f){selectFrom(f);setFromQ(f.name);}
                if(t){selectTo(t);setToQ(t.name);}
              }}>
                <span style={{fontSize:14}}>🕐</span>
                <span style={{fontSize:13,flex:1,color:'var(--text-primary)'}}>{h.fromName}</span>
                <span style={{fontSize:12,color:'var(--text-muted)'}}>→</span>
                <span style={{fontSize:13,color:'var(--text-primary)'}}>{h.toName}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── LIGNES filtrées par l'opérateur sélectionné ── */}
        <div className="quick-lines">
          <div className="section-label">
            {selectedOperator==='all'
              ? 'Toutes les lignes'
              : `Lignes ${OPERATORS[selectedOperator]?.fullName||selectedOperator}`
            }
          </div>

          {Object.keys(opGroups).length===0 && (
            <div style={{textAlign:'center',padding:'16px',color:'var(--text-muted)',fontSize:13}}>
              Aucune ligne pour cet opérateur
            </div>
          )}

          {Object.entries(opGroups).map(([opId,lines])=>{
            const op = OPERATORS[opId];
            return (
              <div key={opId} className="op-section">
                <div className="op-label" style={{color:op.color}}>
                  <span>{op.icon}</span>
                  <span>{op.fullName}</span>
                  <span style={{marginLeft:'auto',opacity:.6,fontWeight:400,fontSize:11}}>{lines.length} ligne{lines.length>1?'s':''}</span>
                </div>
                <div className="quick-line-grid">
                  {lines.map(line=>(
                    <button key={line.id}
                      className={`quick-line-pill${focusedLine===line.id?' active':''}`}
                      style={{ background:line.color, '--pill-color':line.color }}
                      onClick={()=>{
                        dispatch(setFocusedLine(line.id));
                        const stops = line.stops.map(sid=>STOPS.find(s=>s.id===sid)).filter(Boolean);
                        if (stops.length>0) {
                          const mid = stops[Math.floor(stops.length/2)];
                          dispatch(setMapCenter([mid.lat,mid.lng]));
                          dispatch(setMapZoom(13));
                        }
                      }}
                      title={line.route}
                    >
                      {line.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{height:20}}/>
      </div>

      {terModal && <TerBilletterieModal stop={terModal} onClose={()=>setTerModal(null)}/>}
    </div>
  );
}
