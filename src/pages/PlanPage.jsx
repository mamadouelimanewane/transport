import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOrigin, setDestination, setRoute, clearRoute,
  setMapCenter, setMapZoom, setFocusedLine, clearFocusedLine,
  setSelectedOperator, addToHistory, toggleDarkMode,
} from '../store/store';
import {
  STOPS, LINES, OPERATORS, POI, TER_TARIFS, TER_ABONNEMENTS,
  getNextDepartures, getComfortIndex, getAffluence, getTerSchedule,
  REPORT_TYPES, getReports, addReport,
  getCagnotte, addToCagnotte, offrirTrajet,
  requestNotificationPermission, scheduleNotification,
  LANG, t,
} from '../data/transportData';
import { computeRoute } from '../utils/routing';
import { useGeolocation } from '../hooks/useGeolocation';

const css = `
/* ── Layout ── */
.plan-page{display:flex;flex-direction:column;height:100%;overflow:hidden}
.plan-scroll{flex:1;overflow-y:auto;padding:12px;scrollbar-width:none}
.plan-scroll::-webkit-scrollbar{display:none}

/* ── Search ── */
.search-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-lg);margin-bottom:10px;box-shadow:var(--shadow-sm);position:relative;overflow:visible}
.search-row{display:flex;align-items:center;gap:0;padding:4px 10px}
.search-row+.search-row{border-top:1px solid var(--surface-border)}
.dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-right:10px}
.s-input{flex:1;border:none;background:transparent;padding:10px 4px;font-size:15px;color:var(--text-primary);font-weight:500}
.s-input::placeholder{color:var(--text-muted);font-weight:400;font-size:14px}
.s-btn{width:28px;height:28px;border-radius:8px;border:none;background:var(--surface-2);color:var(--text-secondary);display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:background .12s}
.s-btn:hover{background:var(--surface-3)}
.swap-row{display:flex;justify-content:center;height:1px;background:var(--surface-border);position:relative;margin:0 10px}
.swap-btn{position:absolute;width:28px;height:28px;border-radius:50%;background:var(--surface-0);border:1.5px solid var(--surface-border);display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:all .12s;color:var(--text-secondary)}
.swap-btn:hover{background:var(--brand-600);color:white;border-color:var(--brand-600)}

/* ── Suggestions ── */
.suggestions{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:500;background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);overflow:hidden;max-height:260px;overflow-y:auto}
.sug-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background .1s;border-bottom:1px solid var(--surface-1)}
.sug-item:last-child{border-bottom:none}
.sug-item:hover{background:var(--surface-1)}
.sug-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.sug-cat{font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-top:1px}

/* ── Options bar ── */
.opts-bar{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px}
.opt-toggle{padding:5px 10px;border-radius:20px;border:1.5px solid var(--surface-border);font-size:11px;font-weight:600;cursor:pointer;background:var(--surface-1);color:var(--text-secondary);transition:all .12s;display:flex;align-items:center;gap:4px}
.opt-toggle.on{background:var(--brand-600);color:white;border-color:var(--brand-600)}
.opt-toggle:hover{border-color:var(--brand-400)}

/* ── Nearby btn ── */
.nearest-btn{display:flex;align-items:center;gap:8px;padding:9px 14px;background:var(--surface-1);border:1.5px dashed var(--surface-border);border-radius:var(--radius-sm);cursor:pointer;font-size:12px;color:var(--text-secondary);margin-bottom:10px;transition:all .12s;width:100%}
.nearest-btn:hover{border-color:var(--brand-400);color:var(--brand-600)}
.near-badge{background:var(--brand-600);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-left:auto}

/* ── Go btn ── */
.go-btn{width:100%;padding:14px;background:var(--brand-600);color:white;border-radius:var(--radius-md);border:none;font-size:15px;font-weight:600;cursor:pointer;box-shadow:var(--shadow-brand);transition:all .12s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px}
.go-btn:hover:not(:disabled){background:var(--brand-700);transform:translateY(-1px)}
.go-btn:disabled{background:var(--surface-3);color:var(--text-muted);box-shadow:none;transform:none;cursor:not-allowed}

/* ── Walk nav ── */
.walk-nav{background:var(--surface-1);border-radius:var(--radius-sm);padding:10px 12px;margin:10px 0;border-left:3px solid #64748b}
.walk-step{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;color:var(--text-secondary)}
.walk-step+.walk-step{border-top:1px dashed var(--surface-border);margin-top:4px;padding-top:6px}
.walk-dist{margin-left:auto;font-size:11px;color:var(--text-muted)}

/* ── Route card ── */
.route-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:10px;box-shadow:var(--shadow-sm);animation:fadeIn .25s ease both}
.route-header{background:linear-gradient(135deg,var(--brand-600),var(--brand-800));color:white;padding:14px 16px}
.route-rh{display:flex;align-items:center;gap:8px}
.route-metrics{display:flex;border-bottom:1px solid var(--surface-border)}
.metric{flex:1;padding:12px;text-align:center;border-right:1px solid var(--surface-border)}
.metric:last-child{border-right:none}
.metric-val{font-size:16px;font-weight:700;color:var(--text-primary)}
.metric-lbl{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}
.metric-sub{font-size:10px;color:#059669;margin-top:1px}
.steps-list{padding:12px 16px}
.step-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px}
.step-row:last-child{margin-bottom:0}
.step-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.step-label{font-size:13px;font-weight:600;color:var(--text-primary)}
.step-sub{font-size:12px;color:var(--text-secondary);margin-top:1px}
.step-dur{font-size:11px;color:var(--text-muted);margin-top:1px}
.step-conn{width:2px;height:12px;background:var(--surface-border);margin:0 15px}

/* ── Alternatives ── */
.alt-section{border-top:1px solid var(--surface-border);padding:12px 16px}
.alt-title{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.alt-row{border-radius:var(--radius-sm);padding:10px 12px;margin-bottom:6px;border:1.5px solid var(--surface-border);cursor:pointer;transition:all .12s}
.alt-row:hover{transform:translateY(-1px)}
.alt-rl{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px}
.line-badge{padding:3px 9px;border-radius:20px;color:white;font-size:11px;font-weight:800}
.reco-badge{background:#ecfdf5;color:#059669;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px}
.alt-meta{display:flex;gap:10px;font-size:11px;color:var(--text-muted)}
.comfort-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:8px;font-size:10px;font-weight:600}

/* ── TER ── */
.ter-banner{color:white;border-radius:var(--radius-sm);padding:12px 14px;margin:0 0 10px;cursor:pointer;transition:all .12s}
.ter-banner:hover{transform:translateY(-1px)}
.ter-train-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.15)}
.ter-train-row:last-child{border-bottom:none}
.ter-wait{font-size:14px;font-weight:700}
.ter-time{font-size:12px;opacity:.8}
.ter-dir{font-size:11px;opacity:.7;flex:1}

/* ── QR Modal ── */
.qr-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2000;display:flex;align-items:flex-end;justify-content:center}
.qr-modal{background:var(--surface-0);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px;max-height:90vh;overflow-y:auto;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.qr-handle{width:40px;height:4px;background:var(--surface-3);border-radius:2px;margin:0 auto 16px}
.qr-tabs{display:flex;gap:6px;margin-bottom:14px;background:var(--surface-1);padding:4px;border-radius:10px}
.qr-tab{flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:var(--text-secondary);transition:all .12s}
.qr-tab.active{background:var(--surface-0);color:var(--text-primary);box-shadow:var(--shadow-sm)}
.ticket-card{border:1.5px solid var(--surface-border);border-radius:var(--radius-md);padding:12px;margin-bottom:8px;cursor:pointer;transition:all .12s;display:flex;align-items:center;gap:12px}
.ticket-card.selected{border-color:#059669;background:#ecfdf5}
.ticket-price{font-size:16px;font-weight:700;color:#059669;margin-left:auto;white-space:nowrap}
.buy-btn{width:100%;padding:13px;background:#059669;color:white;border:none;border-radius:var(--radius-md);font-size:15px;font-weight:700;cursor:pointer;margin-top:14px;transition:all .12s}

/* ── Rating ── */
.rating-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:var(--radius-lg);margin-bottom:10px;overflow:hidden;animation:fadeIn .25s ease both}
.stars-row{display:flex;gap:6px;padding:12px 16px}
.star-btn{font-size:26px;cursor:pointer;border:none;background:none;padding:0;transition:transform .12s}
.star-btn:hover{transform:scale(1.15)}
.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 16px 10px}
.cat-item{display:flex;align-items:center;justify-content:space-between;background:var(--surface-1);border-radius:8px;padding:7px 10px}
.cat-label{font-size:12px;color:var(--text-secondary)}
.cat-stars{display:flex;gap:2px}
.cat-star{font-size:13px;cursor:pointer;border:none;background:none;padding:0}
.rate-textarea{display:block;width:calc(100% - 32px);margin:0 16px 10px;padding:9px 12px;border:1.5px solid var(--surface-border);border-radius:var(--radius-sm);font-size:14px;background:var(--surface-1);color:var(--text-primary);resize:none;font-family:inherit}
.rate-submit{display:flex;align-items:center;justify-content:center;gap:6px;margin:0 16px 14px;width:calc(100% - 32px);padding:10px;background:var(--brand-600);color:white;border:none;border-radius:var(--radius-sm);font-size:13px;font-weight:600;cursor:pointer}

/* ── Signalement ── */
.report-modal{background:var(--surface-0);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px;animation:slideUp .3s ease}
.report-type-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:14px}
.report-type{padding:10px 6px;border-radius:10px;border:1.5px solid var(--surface-border);text-align:center;cursor:pointer;transition:all .12s}
.report-type.selected{border-width:2px}
.report-type-emoji{font-size:20px;margin-bottom:4px}
.report-type-label{font-size:11px;color:var(--text-secondary);line-height:1.2}

/* ── Cagnotte ── */
.cagnotte-card{background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:var(--radius-lg);padding:16px;margin-bottom:10px;color:white}
.cagnotte-bal{font-size:28px;font-weight:700;margin:4px 0}
.cagnotte-actions{display:flex;gap:8px;margin-top:12px}
.cagnotte-btn{flex:1;padding:9px;background:rgba(255,255,255,.25);border:none;border-radius:10px;color:white;font-size:12px;font-weight:600;cursor:pointer}
.payment-methods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.pay-method{padding:14px;border-radius:12px;border:1.5px solid var(--surface-border);cursor:pointer;text-align:center;transition:all .12s}
.pay-method.selected{border-color:var(--brand-500);background:var(--brand-50)}
.pay-method-icon{font-size:24px;margin-bottom:4px}
.pay-method-name{font-size:12px;font-weight:600;color:var(--text-primary)}

/* ── POI Chips ── */
.poi-scroll{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.poi-scroll::-webkit-scrollbar{display:none}
.poi-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:20px;border:1.5px solid var(--surface-border);background:var(--surface-1);cursor:pointer;white-space:nowrap;font-size:12px;transition:all .12s}
.poi-chip:hover{border-color:var(--brand-400)}
.poi-chip-cat{font-size:10px;color:var(--text-muted)}

/* ── Hist / section ── */
.section-label{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;margin-top:14px;padding:0 2px}
.hist-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--surface-1);margin-bottom:6px;cursor:pointer;border:1px solid var(--surface-border);transition:all .12s}
.hist-item:hover{background:var(--surface-2)}

/* ── Affluence bar ── */
.aff-bar{height:6px;border-radius:3px;background:var(--surface-2);margin-top:4px;overflow:hidden}
.aff-fill{height:100%;border-radius:3px;transition:width .4s ease}

/* ── Quick lines ── */
.quick-lines{margin-top:12px}
.op-section{margin-bottom:12px}
.op-label{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;margin-bottom:6px;padding:4px 8px;border-radius:6px;background:var(--surface-1)}
.line-pills{display:flex;flex-wrap:wrap;gap:5px}
.line-pill{padding:5px 11px;border-radius:20px;border:none;cursor:pointer;font-size:11px;font-weight:700;color:white;transition:all .12s}
.line-pill:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.2)}
.line-pill.active{box-shadow:0 0 0 2px white,0 0 0 4px currentColor}

/* ── Notif banner ── */
.notif-banner{background:linear-gradient(135deg,#7c3aed,#5b21b6);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;cursor:pointer}
.notif-banner-text{font-size:12px;color:white;flex:1}
.notif-close{color:rgba(255,255,255,.7);font-size:16px;background:none;border:none;cursor:pointer}

@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
`;

// ── QR Code SVG ───────────────────────────────────────────────
function QRCode({ data, size = 160 }) {
  const N = 21, cell = size / N;
  const hash = i => ((data.charCodeAt(i % data.length) * 6364136 + i * 1442695) % 256) > 127;
  const isCZ = (r, c) => (r<7&&c<7)||(r<7&&c>=N-7)||(r>=N-7&&c<7);
  const isCB = (r, c) => {
    if(r<7&&c<7)return r===0||r===6||c===0||c===6;
    if(r<7&&c>=N-7)return r===0||r===6||c===N-7||c===N-1;
    if(r>=N-7&&c<7)return r===N-7||r===N-1||c===0||c===6;
    return false;
  };
  const isCF = (r, c) => (r>=2&&r<=4&&c>=2&&c<=4)||(r>=2&&r<=4&&c>=N-5&&c<=N-3)||(r>=N-5&&r<=N-3&&c>=2&&c<=4);
  const cells = [];
  for (let r=0;r<N;r++) for(let c=0;c<N;c++) {
    let fill = isCZ(r,c) ? (isCB(r,c)||isCF(r,c)?'#111':'#fff') : (hash(r*N+c)?'#111':'#fff');
    cells.push(<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill={fill}/>);
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{background:'white',borderRadius:8}}>{cells}</svg>;
}

// ── Modal QR billetterie TER ──────────────────────────────────
function TerModal({ stop, onClose }) {
  const [tab, setTab] = useState('tickets');
  const [sel, setSel] = useState(null);
  const [paid, setPaid] = useState(false);
  const trains = stop?.terInfo ? getTerSchedule(stop.terInfo.gare) : [];
  const qrData = sel ? `TER-SN-${sel.id||sel.from+'-'+sel.to}-${Date.now()}` : '';

  return (
    <div className="qr-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="qr-modal">
        <div className="qr-handle"/>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <span style={{fontSize:28}}>🚆</span>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>Billetterie TER</div>
            {stop?.terInfo && <div style={{fontSize:12,color:'var(--text-secondary)'}}>Gare de {stop.terInfo.gare} · {stop.terInfo.horaires}</div>}
          </div>
          <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--text-muted)'}}>✕</button>
        </div>

        {/* Prochains trains */}
        {trains.length>0 && !paid && (
          <div style={{background:'#ecfdf5',borderRadius:10,padding:'10px 14px',marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:'#047857',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:6}}>Prochains trains</div>
            {trains.slice(0,3).map((tr,i)=>(
              <div key={i} className="ter-train-row" style={{color:'#065f46'}}>
                <span className="ter-wait" style={{color:tr.waitMin<=5?'#059669':tr.waitMin<=15?'#d97706':'#6b7280'}}>{tr.waitMin} min</span>
                <span className="ter-time">{tr.time}</span>
                <span className="ter-dir">{tr.direction}</span>
              </div>
            ))}
          </div>
        )}

        {!paid ? (
          <>
            <div className="qr-tabs">
              <button className={`qr-tab${tab==='tickets'?' active':''}`} onClick={()=>{setTab('tickets');setSel(null)}}>🎟️ Tickets</button>
              <button className={`qr-tab${tab==='abonnements'?' active':''}`} onClick={()=>{setTab('abonnements');setSel(null)}}>📅 Abonnements</button>
            </div>
            {(tab==='tickets' ? TER_TARIFS : TER_ABONNEMENTS).map((item,i)=>(
              <div key={i} className={`ticket-card${sel===item?' selected':''}`} onClick={()=>setSel(item)}>
                <span style={{fontSize:22}}>{tab==='tickets'?'🎫':(item.icon||'🎟️')}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{tab==='tickets'?`${item.from} → ${item.to}`:item.label}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:1}}>{tab==='tickets'?`${item.classe} · Aller simple`:item.trajets}</div>
                </div>
                <div className="ticket-price">{item.prix.toLocaleString()} F</div>
              </div>
            ))}
            {sel && (
              <button className="buy-btn" onClick={()=>{scheduleNotification('SenBus TER','Votre billet a été généré. Bon voyage !');setTimeout(()=>setPaid(true),1200)}}>
                💳 Acheter — {sel.prix.toLocaleString()} FCFA
              </button>
            )}
          </>
        ) : (
          <div style={{textAlign:'center',paddingTop:10}}>
            <div style={{fontSize:14,fontWeight:700,color:'#059669',marginBottom:16}}>✅ Paiement confirmé !</div>
            <div style={{display:'inline-block',padding:16,background:'white',borderRadius:16,border:'3px solid #059669',boxShadow:'0 8px 32px rgba(5,150,105,.2)'}}>
              <QRCode data={qrData} size={180}/>
            </div>
            <div style={{fontWeight:700,marginTop:14,color:'var(--text-primary)'}}>{sel?.label||`${sel?.from} → ${sel?.to}`}</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#ecfdf5',color:'#059669',borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:600,marginTop:10}}>
              ✅ Valable {tab==='abonnements'?'30 jours':'aujourd\'hui'}
            </div>
            <div style={{fontSize:11,color:'var(--text-muted)',marginTop:8}}>Présentez ce QR au contrôleur ou au validateur</div>
            <button onClick={onClose} style={{marginTop:14,padding:'8px 20px',background:'var(--surface-1)',border:'1px solid var(--surface-border)',borderRadius:10,cursor:'pointer',fontSize:13}}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal Signalement ─────────────────────────────────────────
function ReportModal({ stop, onClose }) {
  const [type, setType] = useState(null);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!type) return;
    addReport(stop.id, { type: type.id, label: type.label, comment, stopId: stop.id });
    setDone(true);
    scheduleNotification('SenBus', `Signalement "${type.label}" enregistré. Merci !`);
  };

  return (
    <div className="qr-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="report-modal">
        <div className="qr-handle"/>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <span style={{fontSize:24}}>🚨</span>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>Signaler un problème</div>
            <div style={{fontSize:12,color:'var(--text-secondary)'}}>{stop.name}</div>
          </div>
          <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--text-muted)'}}>✕</button>
        </div>

        {done ? (
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:40,marginBottom:8}}>✅</div>
            <div style={{fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Signalement envoyé !</div>
            <div style={{fontSize:13,color:'var(--text-secondary)',marginBottom:16}}>Merci d'aider la communauté SenBus</div>
            <button onClick={onClose} style={{padding:'10px 24px',background:'var(--brand-600)',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600}}>Fermer</button>
          </div>
        ) : (
          <>
            <div className="report-type-grid">
              {REPORT_TYPES.map(rt => (
                <div key={rt.id} className={`report-type${type===rt?' selected':''}`}
                  style={type===rt?{borderColor:rt.color,background:rt.color+'15'}:{}}
                  onClick={()=>setType(rt)}>
                  <div className="report-type-emoji">{rt.emoji}</div>
                  <div className="report-type-label">{rt.label}</div>
                </div>
              ))}
            </div>
            <textarea style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--surface-border)',borderRadius:10,fontSize:14,background:'var(--surface-1)',color:'var(--text-primary)',resize:'none',fontFamily:'inherit',marginBottom:12}}
              rows={3} placeholder="Précisions (optionnel)…" value={comment} onChange={e=>setComment(e.target.value)}/>
            <button className="buy-btn" style={{background:type?.color||'var(--brand-600)'}} disabled={!type} onClick={submit}>
              {type?.emoji||'📤'} Envoyer le signalement
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Modal Cagnotte ────────────────────────────────────────────
function CagnotteModal({ onClose }) {
  const [tab, setTab] = useState('recharger');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(null);
  const [dest, setDest] = useState('');
  const [done, setDone] = useState(null);
  const cagnotte = getCagnotte();

  const METHODS = [
    { id:'orange', name:'Orange Money', emoji:'🟠', color:'#f97316' },
    { id:'wave',   name:'Wave',         emoji:'🌊', color:'#1a56db' },
    { id:'card',   name:'Carte bancaire',emoji:'💳', color:'#6b7280' },
  ];

  const handleRecharge = () => {
    if (!amount || !method) return;
    addToCagnotte(parseInt(amount), method);
    setDone({ type:'recharge', amount, method });
  };

  const handleOffrir = () => {
    if (!amount || !dest) return;
    const r = offrirTrajet(dest, parseInt(amount));
    if (r.success) setDone({ type:'offrir', qr: r.qrCode, dest, amount });
    else alert(r.error);
  };

  return (
    <div className="qr-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="qr-modal">
        <div className="qr-handle"/>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <span style={{fontSize:28}}>🎁</span>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>Cagnotte transport</div>
            <div style={{fontSize:12,color:'var(--text-secondary)'}}>Solde : {getCagnotte().balance.toLocaleString()} FCFA</div>
          </div>
          <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--text-muted)'}}>✕</button>
        </div>

        {done ? (
          <div style={{textAlign:'center',paddingTop:10}}>
            <div style={{fontSize:40,marginBottom:10}}>{done.type==='offrir'?'🎁':'✅'}</div>
            {done.type==='offrir' ? (
              <>
                <div style={{fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Trajet offert à {done.dest} !</div>
                <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:16}}>QR code à partager</div>
                <div style={{display:'inline-block',padding:16,background:'white',borderRadius:16,border:'3px solid #f59e0b'}}>
                  <QRCode data={done.qr} size={180}/>
                </div>
                <div style={{marginTop:10,fontSize:11,color:'var(--text-muted)'}}>Valable 24h — {done.amount} FCFA déduit de votre cagnotte</div>
              </>
            ) : (
              <>
                <div style={{fontWeight:700,color:'#059669',marginBottom:4}}>Rechargement confirmé !</div>
                <div style={{fontSize:13,color:'var(--text-secondary)'}}>{parseInt(done.amount).toLocaleString()} FCFA ajoutés</div>
              </>
            )}
            <button onClick={onClose} style={{marginTop:16,padding:'10px 24px',background:'var(--brand-600)',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600}}>Fermer</button>
          </div>
        ) : (
          <>
            <div className="qr-tabs">
              <button className={`qr-tab${tab==='recharger'?' active':''}`} onClick={()=>setTab('recharger')}>💳 Recharger</button>
              <button className={`qr-tab${tab==='offrir'?' active':''}`} onClick={()=>setTab('offrir')}>🎁 Offrir un trajet</button>
            </div>

            <div className="payment-methods">
              {METHODS.map(m=>(
                <div key={m.id} className={`pay-method${method===m?' selected':''}`} onClick={()=>setMethod(m)}>
                  <div className="pay-method-icon">{m.emoji}</div>
                  <div className="pay-method-name">{m.name}</div>
                </div>
              ))}
            </div>

            {tab==='offrir' && (
              <input style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--surface-border)',borderRadius:10,fontSize:14,background:'var(--surface-1)',color:'var(--text-primary)',marginBottom:8,fontFamily:'inherit'}}
                placeholder="Numéro de téléphone du destinataire" value={dest} onChange={e=>setDest(e.target.value)}/>
            )}

            <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
              {[500,1000,2000,5000].map(v=>(
                <button key={v} onClick={()=>setAmount(v.toString())}
                  style={{padding:'7px 14px',borderRadius:20,border:`1.5px solid ${amount==v?'var(--brand-500)':'var(--surface-border)'}`,background:amount==v?'var(--brand-50)':'var(--surface-1)',cursor:'pointer',fontSize:12,fontWeight:600,color:amount==v?'var(--brand-600)':'var(--text-secondary)'}}>
                  {v.toLocaleString()} F
                </button>
              ))}
            </div>

            <input type="number" style={{width:'100%',padding:'10px 12px',border:'1.5px solid var(--surface-border)',borderRadius:10,fontSize:14,background:'var(--surface-1)',color:'var(--text-primary)',marginBottom:12,fontFamily:'inherit'}}
              placeholder="Ou saisir un montant (FCFA)" value={amount} onChange={e=>setAmount(e.target.value)}/>

            <button className="buy-btn" style={{background:'#f59e0b'}} disabled={!amount||!method||(tab==='offrir'&&!dest)}
              onClick={tab==='recharger'?handleRecharge:handleOffrir}>
              {tab==='recharger'?'💳 Recharger':'🎁 Offrir le trajet'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Notation ──────────────────────────────────────────────────
function RatingCard({ route }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [cats, setCats]   = useState({ ponctualite:0, confort:0, proprete:0, securite:0 });
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  const CATS = { ponctualite:'Ponctualité', confort:'Confort', proprete:'Propreté', securite:'Sécurité' };

  if (done) return (
    <div className="rating-card" style={{padding:'20px',textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:6}}>🎉</div>
      <div style={{fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Merci pour votre avis !</div>
      <div style={{fontSize:13,color:'var(--text-secondary)'}}>Votre note aide à améliorer le réseau.</div>
    </div>
  );

  return (
    <div className="rating-card">
      <div style={{padding:'12px 16px',borderBottom:'1px solid var(--surface-border)',display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:18}}>⭐</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>Notez votre voyage</div>
          <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:1}}>{route?.origin?.name} → {route?.destination?.name}</div>
        </div>
      </div>
      <div className="stars-row">
        {[1,2,3,4,5].map(s=>(
          <button key={s} className="star-btn" onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(s)}>
            {s<=(hover||stars)?'⭐':'☆'}
          </button>
        ))}
        {stars>0 && <span style={{fontSize:13,color:'var(--text-secondary)',marginLeft:8,lineHeight:'34px'}}>{['','Très mauvais','Mauvais','Correct','Bien','Excellent'][stars]}</span>}
      </div>
      <div className="cat-grid">
        {Object.entries(CATS).map(([k,label])=>(
          <div key={k} className="cat-item">
            <span className="cat-label">{label}</span>
            <div className="cat-stars">
              {[1,2,3,4,5].map(s=>(
                <button key={s} className="cat-star" onClick={()=>setCats(c=>({...c,[k]:s}))}>{s<=cats[k]?'⭐':'☆'}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <textarea className="rate-textarea" rows={3} placeholder="Commentaire optionnel…" value={comment} onChange={e=>setComment(e.target.value)}/>
      <button className="rate-submit" disabled={stars===0} style={stars===0?{opacity:.5,cursor:'not-allowed'}:{}} onClick={()=>stars>0&&setDone(true)}>
        📤 Envoyer mon avis
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function PlanPage() {
  const dispatch = useDispatch();
  const { origin, destination, route, focusedLine, selectedOperator, userLocation, darkMode, language } = useSelector(s => s.mobility);
  const { locate } = useGeolocation();
  const lang = language || 'fr';

  const [fromQ, setFromQ] = useState(origin?.name||'');
  const [toQ,   setToQ]   = useState(destination?.name||'');
  const [fromSug, setFromSug] = useState([]);
  const [toSug,   setToSug]   = useState([]);
  const [history, setHistory] = useState(()=>{try{return JSON.parse(localStorage.getItem('dm_history')||'[]')}catch{return []}});
  const [activeInput, setActiveInput] = useState(null);

  // Modals
  const [terModal,   setTerModal]   = useState(null);
  const [reportModal, setReportModal] = useState(null);
  const [showCagnotte, setShowCagnotte] = useState(false);

  // Options
  const [pmrMode, setPmrMode]       = useState(false);
  const [groupMode, setGroupMode]   = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(() => 'Notification' in window && Notification.permission === 'default');

  const fromRef = useRef(null);
  const toRef   = useRef(null);

  // Position GPS → départ par défaut
  useEffect(() => {
    if (userLocation && !origin) {
      const pseudo = { id:'user_location', name:t('maPosition',lang), zone:'GPS', lat:userLocation[0], lng:userLocation[1], operators:['DDD'], lines:[] };
      dispatch(setOrigin(pseudo));
      setFromQ(t('maPosition',lang));
    }
  }, [userLocation]);

  // Suggestions arrêts + POI
  const suggest = useCallback(q => {
    if (q.length < 2) return [];
    const ql = q.toLowerCase();
    const stops = STOPS.filter(s=>s.name.toLowerCase().includes(ql)||s.zone.toLowerCase().includes(ql)).slice(0,5);
    const pois  = POI.filter(p=>p.name.toLowerCase().includes(ql)||p.category.toLowerCase().includes(ql)).slice(0,4);
    return [...stops, ...pois];
  }, []);

  const selectFrom = useCallback(item => {
    const stop = item.nearestStop ? (STOPS.find(s=>s.id===item.nearestStop)||item) : item;
    dispatch(setOrigin(stop)); setFromQ(item.name); setFromSug([]); setActiveInput(null);
  }, []);
  const selectTo = useCallback(item => {
    const stop = item.nearestStop ? (STOPS.find(s=>s.id===item.nearestStop)||item) : item;
    dispatch(setDestination(stop)); setToQ(item.name); setToSug([]); setActiveInput(null);
  }, []);

  const handleSwap = () => {
    const tmpQ=fromQ; setFromQ(toQ); setToQ(tmpQ);
    dispatch(setOrigin(destination)); dispatch(setDestination(origin));
  };

  const handleNearestStop = () => {
    if (!userLocation) { locate(); return; }
    const [lat,lng] = userLocation;
    const nearest = STOPS.reduce((b,s)=>{ const d=Math.sqrt((s.lat-lat)**2+(s.lng-lng)**2); return d<b.dist?{stop:s,dist:d}:b; },{stop:null,dist:Infinity}).stop;
    if (nearest) selectTo(nearest);
  };

  const handleSearch = () => {
    if (!origin||!destination) return;
    const r = computeRoute(origin, destination, { accessibilite: pmrMode });
    dispatch(setRoute(r));
    dispatch(setMapCenter([(origin.lat+destination.lat)/2,(origin.lng+destination.lng)/2]));
    dispatch(setMapZoom(13));
    const entry = { fromName:origin.name, toName:destination.name, fromId:origin.id, toId:destination.id };
    const updated = [entry,...history.filter(h=>h.fromId!==origin.id||h.toId!==destination.id)].slice(0,5);
    setHistory(updated); localStorage.setItem('dm_history',JSON.stringify(updated));

    // Notification si bus dans < 5 min
    const nearest = STOPS.find(s=>s.id===origin.id);
    if (nearest) {
      const deps = getNextDepartures(origin.id);
      const soonest = deps[0];
      if (soonest && soonest.waitMin <= 5) {
        scheduleNotification('🚌 SenBus', `${soonest.lineName} arrive dans ${soonest.waitMin} min à ${origin.name} !`);
      }
    }
  };

  // Lignes filtrées par opérateur
  const opGroups = {};
  LINES.filter(l=>selectedOperator==='all'||l.operator===selectedOperator)
    .forEach(l=>{ if(!opGroups[l.operator])opGroups[l.operator]=[]; opGroups[l.operator].push(l); });

  const nearbyTerStops = STOPS.filter(s=>s.terConnection);

  return (
    <div className="plan-page">
      <style>{css}</style>
      <div className="plan-scroll">

        {/* ── Bannière notifications ── */}
        {showNotifBanner && (
          <div className="notif-banner" onClick={()=>{ requestNotificationPermission(); setShowNotifBanner(false); }}>
            <span style={{fontSize:20}}>🔔</span>
            <div className="notif-banner-text">Activez les notifications pour être alerté quand votre bus arrive</div>
            <button className="notif-close" onClick={e=>{e.stopPropagation();setShowNotifBanner(false)}}>✕</button>
          </div>
        )}

        {/* ── Recherche ── */}
        <div className="search-card" ref={fromRef}>
          <div className="search-row">
            <div className="dot" style={{background:'#059669'}}/>
            <input className="s-input" value={fromQ} placeholder={t('ouPartez',lang)}
              onChange={e=>{setFromQ(e.target.value);setFromSug(suggest(e.target.value))}}
              onFocus={()=>setActiveInput('from')}/>
            <button className="s-btn" onClick={()=>{locate();setFromQ(t('maPosition',lang));setFromSug([])}} title="Ma position">📍</button>
            {fromQ && <button className="s-btn" onClick={()=>{setFromQ('');dispatch(setOrigin(null))}}>✕</button>}
          </div>
          <div className="swap-row"><button className="swap-btn" onClick={handleSwap}>⇅</button></div>
          <div className="search-row" ref={toRef}>
            <div className="dot" style={{background:'#dc2626'}}/>
            <input className="s-input" value={toQ} placeholder={t('ouAllez',lang)}
              onChange={e=>{setToQ(e.target.value);setToSug(suggest(e.target.value))}}
              onFocus={()=>setActiveInput('to')}/>
            {toQ && <button className="s-btn" onClick={()=>{setToQ('');dispatch(setDestination(null))}}>✕</button>}
          </div>

          {/* Suggestions */}
          {(activeInput==='from'?fromSug:toSug).length>0 && (
            <div className="suggestions">
              {(activeInput==='from'?fromSug:toSug).map(item=>{
                const isPOI = !!item.category;
                const mainOp = !isPOI&&item.operators?.[0];
                const color = isPOI?'#6b7280':(OPERATORS[mainOp]?.color||'#1a56db');
                const onSel = activeInput==='from'?selectFrom:selectTo;
                return (
                  <div key={item.id} className="sug-item" onMouseDown={()=>onSel(item)}>
                    <div className="sug-icon" style={{background:color+'18'}}>
                      {isPOI?item.emoji:(OPERATORS[mainOp]?.icon||'🚏')}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:500,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</div>
                      <div className="sug-cat">{isPOI?item.category:`${item.zone} · ${item.operators?.join(', ')}`}</div>
                    </div>
                    {!isPOI&&mainOp&&<div className="badge badge-sm" style={{background:color}}>{mainOp}</div>}
                    {isPOI&&<div style={{fontSize:10,color:'var(--text-muted)'}}>{item.category}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Options : PMR, Groupe, Cagnotte ── */}
        <div className="opts-bar">
          <button className={`opt-toggle${pmrMode?' on':''}`} onClick={()=>setPmrMode(v=>!v)}>♿ PMR</button>
          <button className={`opt-toggle${groupMode?' on':''}`} onClick={()=>setGroupMode(v=>!v)}>👨‍👩‍👧 Groupe ×4</button>
          <button className="opt-toggle" onClick={()=>setShowCagnotte(true)}>🎁 Cagnotte</button>
          <button className={`opt-toggle${language==='fr'?'':(language==='wo'?' on':'')}`}
            onClick={()=>dispatch({ type:'mobility/setLanguage', payload: language==='fr'?'wo':language==='wo'?'en':'fr' })}>
            {language==='wo'?'WO':language==='en'?'EN':'FR'} ⇄
          </button>
        </div>

        {/* ── Arrêt le plus proche ── */}
        <button className="nearest-btn" onClick={handleNearestStop}>
          <span>🚏</span>
          <span style={{flex:1,textAlign:'left',fontSize:12}}>{t('arretProche',lang)}</span>
          <span className="near-badge">→ {t('destination',lang)}</span>
        </button>

        {/* ── Bouton calculer ── */}
        <button className="go-btn" onClick={handleSearch} disabled={!origin||!destination}>
          🔍 {t('calculer',lang)}
          {pmrMode && ' ♿'}
        </button>

        {/* ── Résultat itinéraire ── */}
        {route && (
          <>
            <div className="route-card">
              <div className="route-header">
                <div className="route-rh">
                  <span style={{fontSize:13,opacity:.8,flex:1}}>{route.origin?.name}</span>
                  <span style={{fontSize:18}}>→</span>
                  <span style={{fontSize:13,opacity:.8,flex:1,textAlign:'right'}}>{route.destination?.name}</span>
                </div>
                {route.direct && <div style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.2)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:600}}>✅ {t('direct',lang)}</div>}
                {route.accessibilite && <div style={{marginTop:4,display:'inline-flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.15)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:600,marginLeft:6}}>♿ Accessible PMR</div>}
              </div>

              {/* Métriques */}
              <div className="route-metrics">
                <div className="metric">
                  <div className="metric-val">⏱ {route.duration} min</div>
                  <div className="metric-lbl">{t('duree',lang)}</div>
                </div>
                <div className="metric">
                  <div className="metric-val">📏 {route.distance} km</div>
                  <div className="metric-lbl">{t('distance',lang)}</div>
                </div>
                <div className="metric">
                  <div className="metric-val" style={{color:'#059669'}}>💰 {route.tarif} F</div>
                  <div className="metric-lbl">{t('tarif',lang)}</div>
                  {groupMode && <div className="metric-sub">×4 : {route.tarifGroupe?.toLocaleString()} F</div>}
                </div>
              </div>

              {/* Étapes */}
              <div className="steps-list">
                {route.steps?.map((step,i)=>(
                  <React.Fragment key={i}>
                    <div className="step-row">
                      <div className="step-icon" style={{background:step.color+'20'}}>{step.icon}</div>
                      <div style={{flex:1,paddingTop:2}}>
                        <div className="step-label">{step.label}</div>
                        {step.sublabel && <div className="step-sub">{step.sublabel}</div>}
                        {step.dur>0 && <div className="step-dur">{step.dur} min</div>}
                        {/* Navigation piétonne détaillée */}
                        {step.walkNav && step.walkNav.steps.length>0 && (
                          <div className="walk-nav">
                            {step.walkNav.steps.map((ws,wi)=>(
                              <div key={wi} className="walk-step">
                                <span style={{flexShrink:0}}>{ws.icon}</span>
                                <span style={{flex:1}}>{ws.text}</span>
                                {ws.dist && <span className="walk-dist">{ws.dist}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {i<route.steps.length-1 && <div className="step-conn"/>}
                  </React.Fragment>
                ))}
              </div>

              {/* Alternatives avec confort thermique */}
              {route.allAlternatives?.length>0 && (
                <div className="alt-section">
                  <div className="alt-title">🚌 Lignes pour ce trajet</div>
                  {route.allAlternatives.map((alt,i)=>{
                    const comfort = getComfortIndex(alt.operator);
                    const aff = getAffluence(route.originStop?.id);
                    return (
                      <div key={i} className="alt-row" style={{background:i===0?alt.color+'10':'var(--surface-1)',borderColor:i===0?alt.color+'40':'var(--surface-border)'}}>
                        <div className="alt-rl">
                          {alt.lines.map((l,li)=>(
                            <React.Fragment key={l.id}>
                              <span className="line-badge" style={{background:l.color}}>{l.name}</span>
                              {li<alt.lines.length-1&&<span style={{fontSize:12,color:'var(--text-muted)',fontWeight:700}}>+</span>}
                            </React.Fragment>
                          ))}
                          {alt.recommended&&<span className="reco-badge">Recommandé</span>}
                          {OPERATORS[alt.operator]?.climatise&&<span style={{fontSize:12}}>❄️</span>}
                        </div>
                        <div className="alt-meta">
                          <span>⏱ {alt.freq}</span>
                          <span>💰 {alt.tarif?.toLocaleString()||'-'} F</span>
                          <span className="comfort-chip" style={{background:comfort.color+'20',color:comfort.color}}>
                            {comfort.emoji} {comfort.label}
                          </span>
                        </div>
                        {/* Affluence */}
                        <div style={{marginTop:6}}>
                          <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:3}}>{t('affluence',lang)} : {aff.emoji} {aff.level}{aff.extra&&` · ${aff.extra}`}</div>
                          <div className="aff-bar"><div className="aff-fill" style={{width:`${aff.pct}%`,background:aff.color}}/></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Correspondances TER avec horaires temps réel */}
              {nearbyTerStops.slice(0,2).map(s=>{
                const trains = getTerSchedule(s.terInfo?.gare||'Dakar').slice(0,3);
                return (
                  <div key={s.id} className="ter-banner" style={{background:'linear-gradient(135deg,#059669,#047857)'}}
                    onClick={()=>setTerModal(s)}>
                    <div className="ter-conn-title" style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                      <span style={{fontSize:14,fontWeight:700}}>🚆 {s.name}</span>
                      <span style={{marginLeft:'auto',fontSize:11,background:'rgba(255,255,255,.2)',padding:'2px 8px',borderRadius:10}}>Billetterie →</span>
                    </div>
                    {trains.map((tr,i)=>(
                      <div key={i} className="ter-train-row">
                        <span className="ter-wait" style={{color:tr.waitMin<=5?'#6ee7b7':tr.waitMin<=15?'#fde68a':'rgba(255,255,255,.7)'}}>{tr.waitMin} min</span>
                        <span className="ter-time">{tr.time}</span>
                        <span className="ter-dir">{tr.direction}</span>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Signalement + Actions */}
              <div style={{display:'flex',gap:6,padding:'0 16px 12px',flexWrap:'wrap'}}>
                {route.originStop && (
                  <button onClick={()=>setReportModal(route.originStop)} style={{flex:1,padding:'8px',borderRadius:'10px',background:'#fef2f2',border:'1px solid #fecaca',fontSize:12,fontWeight:500,cursor:'pointer',color:'#dc2626'}}>
                    🚨 {t('signaler',lang)} un problème
                  </button>
                )}
                <button onClick={()=>{
                  const url=`${location.origin}?from=${encodeURIComponent(origin.name)}&to=${encodeURIComponent(destination.name)}`;
                  if(navigator.share) navigator.share({title:'SenBus',url}); else{navigator.clipboard.writeText(url);alert('Lien copié !')}
                }} style={{flex:1,padding:'8px',borderRadius:'10px',background:'var(--surface-1)',border:'1px solid var(--surface-border)',fontSize:12,fontWeight:500,cursor:'pointer',color:'var(--text-secondary)'}}>
                  🔗 {t('partager',lang)}
                </button>
                <button onClick={()=>dispatch(clearRoute())} style={{flex:1,padding:'8px',borderRadius:'10px',background:'var(--surface-1)',border:'1px solid var(--surface-border)',fontSize:12,fontWeight:500,cursor:'pointer',color:'var(--text-secondary)'}}>
                  ✕ {t('effacer',lang)}
                </button>
              </div>
            </div>

            {/* Notation */}
            <RatingCard route={route}/>
          </>
        )}

        {/* ── Historique ── */}
        {!route && history.length>0 && (
          <div>
            <div className="section-label">🕐 Recherches récentes</div>
            {history.map((h,i)=>(
              <div key={i} className="hist-item" onClick={()=>{
                const f=STOPS.find(s=>s.id===h.fromId), t2=STOPS.find(s=>s.id===h.toId);
                if(f){selectFrom(f);setFromQ(f.name)}
                if(t2){selectTo(t2);setToQ(t2.name)}
              }}>
                <span>🕐</span>
                <span style={{fontSize:13,flex:1,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{h.fromName}</span>
                <span style={{fontSize:12,color:'var(--text-muted)'}}>→</span>
                <span style={{fontSize:13,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{h.toName}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── POI populaires ── */}
        {!route && (
          <div>
            <div className="section-label">📍 Destinations populaires</div>
            <div className="poi-scroll">
              {POI.slice(0,15).map(poi=>(
                <button key={poi.id} className="poi-chip" onClick={()=>selectTo(poi)}>
                  <span>{poi.emoji}</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:12,color:'var(--text-primary)',fontWeight:500,whiteSpace:'nowrap'}}>{poi.name.split(' ').slice(0,3).join(' ')}</div>
                    <div className="poi-chip-cat">{poi.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Liste des lignes ── */}
        <div className="quick-lines">
          <div className="section-label">
            🛤️ {selectedOperator==='all'?'Toutes les lignes':OPERATORS[selectedOperator]?.fullName}
          </div>
          {Object.entries(opGroups).map(([opId,lines])=>{
            const op=OPERATORS[opId];
            return (
              <div key={opId} className="op-section">
                <div className="op-label" style={{color:op.color}}>
                  <span>{op.icon}</span>
                  <span>{op.fullName}</span>
                  <span style={{marginLeft:'auto',opacity:.6,fontWeight:400,fontSize:11}}>{lines.length} ligne{lines.length>1?'s':''}</span>
                  {op.climatise&&<span title="Climatisé">❄️</span>}
                </div>
                <div className="line-pills">
                  {lines.map(line=>{
                    const comfort=getComfortIndex(line.operator);
                    return (
                      <button key={line.id}
                        className={`line-pill${focusedLine===line.id?' active':''}`}
                        style={{background:line.color}}
                        onClick={()=>{ dispatch(setFocusedLine(line.id)); const stops=STOPS.filter(s=>line.stops.includes(s.id)); if(stops.length>0){const mid=stops[Math.floor(stops.length/2)]; dispatch(setMapCenter([mid.lat,mid.lng])); dispatch(setMapZoom(13));}}}
                        title={`${line.route} — ${comfort.label}`}>
                        {line.name} {comfort.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{height:20}}/>
      </div>

      {/* ── Modals ── */}
      {terModal    && <TerModal    stop={terModal}    onClose={()=>setTerModal(null)}/>}
      {reportModal && <ReportModal stop={reportModal} onClose={()=>setReportModal(null)}/>}
      {showCagnotte && <div className="qr-modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowCagnotte(false)}><CagnotteModal onClose={()=>setShowCagnotte(false)}/></div>}
    </div>
  );
}
