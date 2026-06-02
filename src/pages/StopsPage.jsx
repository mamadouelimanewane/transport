import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteStop, setMapCenter, setMapZoom } from '../store/store';
import { STOPS, OPERATORS, getNextDepartures, getAffluence, getComfortIndex, REPORT_TYPES, addReport, scheduleNotification } from '../data/transportData';

const css = `
.stops-page{display:flex;flex-direction:column;height:100%;overflow:hidden}
.stops-header{padding:10px 12px;border-bottom:1px solid var(--surface-border);flex-shrink:0;background:var(--surface-0)}
.stops-search{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface-1);border:1.5px solid var(--surface-border);border-radius:10px}
.stops-input{flex:1;border:none;background:transparent;font-size:14px;color:var(--text-primary)}
.stops-input::placeholder{color:var(--text-muted)}
.stops-list{flex:1;overflow-y:auto;padding:8px;scrollbar-width:none}
.stops-list::-webkit-scrollbar{display:none}
.stop-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:14px;margin-bottom:8px;overflow:hidden;transition:all .15s;cursor:pointer}
.stop-card:hover{border-color:var(--brand-300);box-shadow:var(--shadow-sm)}
.stop-card.fav{border-color:var(--brand-300);background:linear-gradient(135deg,var(--brand-50),var(--surface-0))}
.stop-top{display:flex;align-items:center;gap:10px;padding:10px 12px}
.stop-op-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.stop-name{font-size:14px;font-weight:600;color:var(--text-primary)}
.stop-zone{font-size:11px;color:var(--text-muted);margin-top:1px}
.stop-ops{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}
.stop-op-badge{padding:2px 7px;border-radius:6px;color:white;font-size:10px;font-weight:800}
.stop-bottom{border-top:1px solid var(--surface-border);padding:8px 12px}
.stop-deps{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.stop-deps::-webkit-scrollbar{display:none}
.dep-item{display:flex;align-items:center;gap:5px;flex-shrink:0;background:var(--surface-1);border-radius:8px;padding:4px 8px}
.dep-badge{padding:2px 6px;border-radius:4px;color:white;font-size:10px;font-weight:700}
.dep-wait{font-size:12px;font-weight:700}

/* Affluence */
.aff-bar{height:5px;border-radius:2px;background:var(--surface-2);margin-top:4px;overflow:hidden}
.aff-fill{height:100%;border-radius:2px;transition:width .4s}
.comfort-row{display:flex;align-items:center;gap:6px;margin-top:4px}
.comfort-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

/* Report mini button */
.report-mini-btn{font-size:12px;background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px 6px;border-radius:6px}
.report-mini-btn:hover{background:#fef2f2;color:#dc2626}

/* Report modal */
.report-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2000;display:flex;align-items:flex-end;justify-content:center}
.report-sheet{background:var(--surface-0);border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.qr-handle{width:40px;height:4px;background:var(--surface-3);border-radius:2px;margin:0 auto 16px}
.report-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px}
.report-type{padding:10px 6px;border-radius:10px;border:1.5px solid var(--surface-border);text-align:center;cursor:pointer;transition:all .12s}
.report-type.selected{border-width:2px}
`;

function ReportSheet({ stop, onClose }) {
  const [type, setType] = useState(null);
  const [done, setDone] = useState(false);
  const submit = () => {
    if (!type) return;
    addReport(stop.id, { type:type.id, label:type.label, stopId:stop.id });
    scheduleNotification('SenBus', `Signalement "${type.label}" enregistré pour ${stop.name}. Merci !`);
    setDone(true);
  };
  return (
    <div className="report-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="report-sheet">
        <div className="qr-handle"/>
        <div style={{fontSize:15,fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Signaler un problème</div>
        <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:14}}>{stop.name}</div>
        {done ? (
          <div style={{textAlign:'center',padding:'16px 0'}}>
            <div style={{fontSize:36,marginBottom:8}}>✅</div>
            <div style={{fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>Merci pour votre signalement !</div>
            <button onClick={onClose} style={{marginTop:12,padding:'8px 20px',background:'var(--brand-600)',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600}}>Fermer</button>
          </div>
        ) : (
          <>
            <div className="report-grid">
              {REPORT_TYPES.map(rt=>(
                <div key={rt.id} className={`report-type${type===rt?' selected':''}`}
                  style={type===rt?{borderColor:rt.color,background:rt.color+'15'}:{}}
                  onClick={()=>setType(rt)}>
                  <div style={{fontSize:22,marginBottom:4}}>{rt.emoji}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.2}}>{rt.label}</div>
                </div>
              ))}
            </div>
            <button onClick={submit} disabled={!type} style={{width:'100%',padding:'12px',borderRadius:10,background:type?.color||'var(--brand-600)',color:'white',border:'none',fontSize:14,fontWeight:600,cursor:'pointer',opacity:type?1:.5}}>
              Envoyer le signalement
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function StopsPage() {
  const dispatch = useDispatch();
  const { selectedOperator, favoriteStops } = useSelector(s => s.mobility);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [reportStop, setReportStop] = useState(null);

  const filtered = STOPS
    .filter(s => selectedOperator==='all' || s.operators.includes(selectedOperator))
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.zone.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const af = favoriteStops.includes(a.id) ? -1 : 0;
      const bf = favoriteStops.includes(b.id) ? -1 : 0;
      return af - bf;
    });

  return (
    <div className="stops-page">
      <style>{css}</style>
      <div className="stops-header">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>🚏 Arrêts & Gares</div>
          <div style={{fontSize:12,color:'var(--text-muted)'}}>{filtered.length} arrêt{filtered.length>1?'s':''}{favoriteStops.length>0?` · ${favoriteStops.length} ⭐`:''}</div>
        </div>
        <div className="stops-search">
          <span>🔍</span>
          <input className="stops-input" placeholder="Rechercher un arrêt ou quartier…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {search && <button onClick={()=>setSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:14}}>✕</button>}
        </div>
      </div>

      <div className="stops-list">
        {filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'40px 0',color:'var(--text-muted)'}}>
            <div style={{fontSize:36,marginBottom:8}}>🚏</div>
            <div style={{fontSize:14}}>Aucun arrêt trouvé</div>
          </div>
        ) : filtered.map(stop => {
          const mainOp = stop.operators[0];
          const op     = OPERATORS[mainOp];
          const isFav  = favoriteStops.includes(stop.id);
          const isExp  = expanded === stop.id;
          const aff    = getAffluence(stop.id);
          const deps   = isExp ? getNextDepartures(stop.id) : getNextDepartures(stop.id).slice(0,2);
          const comfort = getComfortIndex(mainOp);

          return (
            <div key={stop.id} className={`stop-card${isFav?' fav':''}`}>
              <div className="stop-top" onClick={()=>{ setExpanded(isExp?null:stop.id); dispatch(setMapCenter([stop.lat,stop.lng])); dispatch(setMapZoom(15)); }}>
                <div className="stop-op-icon" style={{background:op.color+'18'}}>
                  <span>{op.icon}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="stop-name" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{stop.name}</div>
                  <div className="stop-zone">{stop.zone}</div>
                  <div className="stop-ops">
                    {stop.operators.map(oid=>(
                      <span key={oid} className="stop-op-badge" style={{background:OPERATORS[oid]?.color||'#64748b'}}>{oid}</span>
                    ))}
                    {stop.terConnection && <span style={{fontSize:10,color:'#059669',fontWeight:600}}>🚆 TER</span>}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                  <button onClick={e=>{e.stopPropagation();dispatch(toggleFavoriteStop(stop.id))}} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,padding:2}}>
                    {isFav?'⭐':'☆'}
                  </button>
                  <span style={{fontSize:11,color:'var(--text-muted)'}}>{isExp?'▲':'▼'}</span>
                </div>
              </div>

              {isExp && (
                <div className="stop-bottom">
                  {/* Affluence */}
                  <div style={{marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-secondary)',marginBottom:2}}>
                      <span>Affluence : {aff.emoji} {aff.level}</span>
                      {aff.extra && <span style={{color:aff.color,fontWeight:600}}>{aff.extra}</span>}
                    </div>
                    <div className="aff-bar"><div className="aff-fill" style={{width:`${aff.pct}%`,background:aff.color}}/></div>
                  </div>

                  {/* Confort thermique */}
                  <div className="comfort-row">
                    <div className="comfort-dot" style={{background:comfort.color}}/>
                    <span style={{fontSize:11,color:comfort.color,fontWeight:600}}>{comfort.emoji} {comfort.label}</span>
                    {op.climatise && <span style={{fontSize:10,color:'#059669',marginLeft:4}}>❄️ Climatisé</span>}
                  </div>

                  {/* Prochains passages */}
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.5px',margin:'8px 0 4px'}}>Prochains passages</div>
                  <div className="stop-deps">
                    {deps.map((d,i)=>(
                      <div key={i} className="dep-item">
                        <span className="dep-badge" style={{background:d.color}}>{d.lineName}</span>
                        <span className="dep-wait" style={{color:d.waitMin<=5?'#059669':d.waitMin<=15?'#d97706':'#94a3b8'}}>{d.waitMin}m</span>
                        <span style={{fontSize:10,color:'var(--text-muted)'}}>{d.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{display:'flex',gap:6,marginTop:8}}>
                    <button className="report-mini-btn" onClick={()=>setReportStop(stop)}>🚨 Signaler</button>
                    {stop.terConnection && (
                      <button className="report-mini-btn" style={{color:'#059669'}} onClick={()=>window.open('https://ter.sn','_blank')}>🚆 Infos TER</button>
                    )}
                  </div>
                </div>
              )}

              {!isExp && (
                <div style={{padding:'0 12px 8px'}}>
                  <div className="stop-deps">
                    {deps.map((d,i)=>(
                      <div key={i} className="dep-item">
                        <span className="dep-badge" style={{background:d.color}}>{d.lineName}</span>
                        <span className="dep-wait" style={{color:d.waitMin<=5?'#059669':d.waitMin<=15?'#d97706':'#94a3b8'}}>{d.waitMin}m</span>
                      </div>
                    ))}
                    <span style={{fontSize:11,color:aff.color,marginLeft:4,flexShrink:0}}>{aff.emoji} {aff.level}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reportStop && <ReportSheet stop={reportStop} onClose={()=>setReportStop(null)}/>}
    </div>
  );
}
