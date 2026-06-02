import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteLine, setFocusedLine, clearFocusedLine, setMapCenter, setMapZoom, clearRoute } from '../store/store';
import { LINES, STOPS, OPERATORS, getLineStops, getComfortIndex } from '../data/transportData';

const css = `
.lines-page{display:flex;flex-direction:column;height:100%;overflow:hidden}
.lines-header{padding:10px 12px;border-bottom:1px solid var(--surface-border);flex-shrink:0;background:var(--surface-0)}
.lines-search{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface-1);border:1.5px solid var(--surface-border);border-radius:10px}
.lines-input{flex:1;border:none;background:transparent;font-size:14px;color:var(--text-primary)}
.lines-input::placeholder{color:var(--text-muted)}
.lines-list{flex:1;overflow-y:auto;padding:8px;scrollbar-width:none}
.lines-list::-webkit-scrollbar{display:none}
.op-section-header{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;margin-bottom:6px;margin-top:10px}
.line-card{background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:14px;margin-bottom:6px;overflow:hidden;cursor:pointer;transition:all .15s;display:flex}
.line-card:hover{border-color:var(--brand-300)}
.line-card.focused{border-width:2px;box-shadow:0 4px 16px rgba(0,0,0,.12)}
.line-accent{width:5px;flex-shrink:0}
.line-body{flex:1;padding:10px 12px}
.line-top{display:flex;align-items:center;gap:8px}
.line-badge{padding:4px 10px;border-radius:20px;color:white;font-size:11px;font-weight:800;white-space:nowrap;flex-shrink:0}
.line-route{font-size:13px;font-weight:600;color:var(--text-primary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.line-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.meta-chip{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);background:var(--surface-1);padding:2px 7px;border-radius:6px}
.freq-dot{width:6px;height:6px;border-radius:3px;flex-shrink:0}
.line-comfort{font-size:11px;font-weight:600;margin-top:4px}
.focus-hint{font-size:11px;font-weight:600;margin-top:4px}
.tap-hint{font-size:11px;color:var(--text-muted);margin-top:3px;display:flex;align-items:center;gap:4px}
`;

export default function LinesPage() {
  const dispatch  = useDispatch();
  const { selectedOperator, favoriteLines, focusedLine } = useSelector(s => s.mobility);
  const [search, setSearch] = useState('');

  const filtered = LINES
    .filter(l => selectedOperator==='all' || l.operator===selectedOperator)
    .filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.route.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
    );

  // Grouper par opérateur
  const sections = Object.entries(
    filtered.reduce((acc,l)=>{ if(!acc[l.operator])acc[l.operator]=[]; acc[l.operator].push(l); return acc; },{})
  ).map(([opId,data])=>({ key:opId, op:OPERATORS[opId], data }));

  const handleLinePress = useCallback((line) => {
    dispatch(clearRoute());
    if (focusedLine === line.id) { dispatch(clearFocusedLine()); return; }
    dispatch(setFocusedLine(line.id));
    const stops = getLineStops(line.id);
    if (stops.length > 0) {
      const lats = stops.map(s=>s.lat), lngs = stops.map(s=>s.lng);
      const cLat = (Math.min(...lats)+Math.max(...lats))/2;
      const cLng = (Math.min(...lngs)+Math.max(...lngs))/2;
      const spanLat = Math.max(...lats)-Math.min(...lats);
      const spanLng = Math.max(...lngs)-Math.min(...lngs);
      const zoom = spanLat<.02&&spanLng<.02 ? 14 : spanLat<.05&&spanLng<.05 ? 13 : 12;
      dispatch(setMapCenter([cLat,cLng]));
      dispatch(setMapZoom(zoom));
    }
  }, [focusedLine]);

  return (
    <div className="lines-page">
      <style>{css}</style>
      <div className="lines-header">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>🛤️ Lignes de transport</div>
          <div style={{fontSize:12,color:'var(--text-muted)'}}>{filtered.length} ligne{filtered.length>1?'s':''}</div>
        </div>
        <div className="lines-search">
          <span>🔍</span>
          <input className="lines-input" placeholder="Rechercher une ligne ou terminus…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {search && <button onClick={()=>setSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:14}}>✕</button>}
        </div>
      </div>

      <div className="lines-list">
        {sections.length===0 ? (
          <div style={{textAlign:'center',padding:'40px 0',color:'var(--text-muted)'}}>
            <div style={{fontSize:36,marginBottom:8}}>🔍</div>
            <div style={{fontSize:14}}>Aucune ligne trouvée</div>
          </div>
        ) : sections.map(({ key:opId, op, data }) => (
          <div key={opId}>
            <div className="op-section-header" style={{background:op.color+'15'}}>
              <span style={{fontSize:18}}>{op.icon}</span>
              <span style={{fontSize:13,fontWeight:700,color:op.color,flex:1}}>{op.fullName}</span>
              <span style={{fontSize:11,color:op.color,opacity:.7}}>{data.length} ligne{data.length>1?'s':''}</span>
              {op.climatise && <span style={{fontSize:12}}>❄️ Climatisé</span>}
            </div>

            {data.map(line => {
              const isFav    = favoriteLines.includes(line.id);
              const isFoc    = focusedLine === line.id;
              const stops    = getLineStops(line.id);
              const comfort  = getComfortIndex(line.operator);
              const freq     = line.freq||'';
              const freqColor = freq.startsWith('5')||freq.startsWith('6')||freq.startsWith('8') ? '#059669' : freq.match(/^1[0-5]/) ? '#d97706' : '#94a3b8';

              return (
                <div key={line.id}
                  className={`line-card${isFoc?' focused':''}`}
                  style={isFoc?{borderColor:line.color}:{}}
                  onClick={()=>handleLinePress(line)}>
                  <div className="line-accent" style={{background:line.color}}/>
                  <div className="line-body">
                    <div className="line-top">
                      <span className="line-badge" style={{background:line.color}}>{line.name}</span>
                      <span className="line-route">{line.route}</span>
                      <button onClick={e=>{e.stopPropagation();dispatch(toggleFavoriteLine(line.id))}}
                        style={{background:'none',border:'none',cursor:'pointer',fontSize:16,flexShrink:0}}>
                        {isFav?'⭐':'☆'}
                      </button>
                    </div>
                    <div className="line-meta">
                      <span className="meta-chip">🚏 {stops.length} arrêts</span>
                      <span className="meta-chip">
                        <span className="freq-dot" style={{background:freqColor}}/>
                        {line.freq}
                      </span>
                      <span className="meta-chip">💰 {op.tarif} F</span>
                      {line.operator==='BRT'&&<span className="meta-chip">♿ Accessible</span>}
                      {line.operator==='TER'&&<span className="meta-chip">♿ Accessible</span>}
                    </div>
                    <div className="line-comfort" style={{color:comfort.color}}>
                      {comfort.emoji} {comfort.label}
                    </div>
                    {isFoc ? (
                      <div className="focus-hint" style={{color:line.color}}>
                        🗺️ Tracé affiché sur la carte · Cliquer pour fermer
                      </div>
                    ) : (
                      <div className="tap-hint">👆 Cliquer pour voir le tracé sur la carte</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div style={{height:16}}/>
      </div>
    </div>
  );
}
