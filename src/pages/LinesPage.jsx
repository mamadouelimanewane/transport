import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteLine, setFocusedLine, clearFocusedLine, setMapCenter, setMapZoom, clearRoute } from '../store/store';
import { LINES, OPERATORS, getLineStops } from '../data/transportData';

const css = `
.lines-page { display:flex; flex-direction:column; height:100%; overflow:hidden; }
.lines-search { padding:12px 14px; border-bottom:1px solid var(--surface-border); flex-shrink:0; }
.lines-search-input {
  width:100%; padding:9px 14px; border-radius:var(--radius-sm);
  background:var(--surface-1); border:1.5px solid var(--surface-border);
  font-size:14px; color:var(--text-primary); transition:border-color var(--t-fast);
}
.lines-search-input:focus { border-color:var(--brand-500); background:var(--surface-0); }
.lines-scroll { flex:1; overflow-y:auto; padding:10px 14px; }

.focus-banner {
  display:flex; align-items:center; gap:8px;
  padding:10px 14px; border-radius:var(--radius-sm);
  margin-bottom:10px; font-size:13px; font-weight:600;
  animation: fadeIn .2s ease both;
}
.focus-banner-btn {
  margin-left:auto; padding:4px 10px; border-radius:6px;
  background:none; border:1.5px solid currentColor;
  cursor:pointer; font-size:11px; font-weight:700;
  font-family:var(--font-sans); opacity:.8;
}
.focus-banner-btn:hover { opacity:1; }

.op-group { margin-bottom:18px; }
.op-group-header {
  display:flex; align-items:center; gap:10px;
  padding:8px 10px; border-radius:var(--radius-sm);
  margin-bottom:8px; font-weight:700; font-size:13px;
}

.line-card {
  display:flex; align-items:stretch;
  background:var(--surface-0);
  border:1.5px solid var(--surface-border);
  border-radius:var(--radius-md); margin-bottom:7px;
  overflow:hidden; cursor:pointer;
  transition:all var(--t-fast); box-shadow:var(--shadow-sm);
}
.line-card:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }
.line-card.focused {
  border-color:transparent; box-shadow: var(--shadow-lg);
  transform:translateY(-2px);
}
.line-card-accent { width:5px; flex-shrink:0; }
.line-card-body { flex:1; padding:11px 13px; }
.line-card-top { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
.line-badge { color:white; font-size:11px; font-weight:800; padding:3px 9px; border-radius:20px; letter-spacing:.02em; }
.line-route { font-size:13px; font-weight:600; color:var(--text-primary); flex:1; }
.fav-btn { background:none; border:none; font-size:16px; cursor:pointer; padding:2px 4px; border-radius:6px; transition:transform var(--t-fast); flex-shrink:0; }
.fav-btn:hover { transform:scale(1.2); }
.line-meta { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
.line-chip { font-size:11px; color:var(--text-secondary); background:var(--surface-1); border:1px solid var(--surface-border); padding:2px 8px; border-radius:10px; }
.freq-dot { width:7px; height:7px; border-radius:50%; display:inline-block; margin-right:4px; }

.focus-hint {
  font-size:11px; color:var(--text-muted); margin-top:4px;
  display:flex; align-items:center; gap:4px;
}
.line-card-tap-hint {
  font-size:11px; color:var(--text-muted); margin-top:6px;
  display:flex; align-items:center; gap:4px; opacity:.7;
}
@keyframes lineCardPop {
  0%  { transform: scale(1); }
  40% { transform: scale(1.02); box-shadow: 0 6px 24px rgba(0,0,0,.18); }
  100%{ transform: scale(1); }
}
.line-card.focused { animation: lineCardPop .25s ease; }
`;

export default function LinesPage() {
  const dispatch = useDispatch();
  const { selectedOperator, favoriteLines, focusedLine } = useSelector(s => s.mobility);
  const [search, setSearch] = useState('');

  const focusedLineData = focusedLine ? LINES.find(l => l.id === focusedLine) : null;

  const grouped = {};
  LINES
    .filter(l => selectedOperator === 'all' || l.operator === selectedOperator)
    .filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.route.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
    )
    .forEach(l => {
      if (!grouped[l.operator]) grouped[l.operator] = [];
      grouped[l.operator].push(l);
    });

  const handleLineClick = (line) => {
    const stops = getLineStops(line.id);
    if (stops.length === 0) return;

    if (focusedLine === line.id) {
      // Déjà focalisé → tout réafficher
      dispatch(clearFocusedLine());
      return;
    }

    // 1. Effacer tout itinéraire actif (sinon MapView masque les lignes)
    dispatch(clearRoute());

    // 2. Focus cette ligne seule sur la carte
    dispatch(setFocusedLine(line.id));

    // 3. Centrer + zoom sur les bornes de la ligne
    const lats = stops.map(s => s.lat);
    const lngs = stops.map(s => s.lng);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const spanLat   = Math.max(...lats) - Math.min(...lats);
    const spanLng   = Math.max(...lngs) - Math.min(...lngs);
    const zoom = spanLat < 0.02 && spanLng < 0.02 ? 14
               : spanLat < 0.05 && spanLng < 0.05 ? 13
               : spanLat < 0.1  && spanLng < 0.1  ? 12 : 11;
    dispatch(setMapCenter([centerLat, centerLng]));
    dispatch(setMapZoom(zoom));
  };

  return (
    <div className="lines-page">
      <style>{css}</style>
      <div className="lines-search">
        <input className="lines-search-input"
          placeholder="Rechercher une ligne…"
          value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="lines-scroll">

        {/* Bannière focus actif */}
        {focusedLine && focusedLineData && (
          <div className="focus-banner" style={{ background: focusedLineData.color + '18', color: focusedLineData.color }}>
            <span style={{ fontSize:16 }}>{OPERATORS[focusedLineData.operator]?.icon}</span>
            <span>{focusedLineData.name} — {focusedLineData.route}</span>
            <button
              className="focus-banner-btn"
              style={{ color: focusedLineData.color }}
              onClick={() => dispatch(clearFocusedLine())}
            >
              ✕ Toutes
            </button>
          </div>
        )}

        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
            <div>Aucune ligne trouvée</div>
          </div>
        )}

        {Object.entries(grouped).map(([opId, lines]) => {
          const op = OPERATORS[opId];
          return (
            <div key={opId} className="op-group">
              <div className="op-group-header" style={{ background: op.color + '15', color: op.color }}>
                <span style={{ fontSize:18 }}>{op.icon}</span>
                <span>{op.fullName}</span>
                <span style={{ marginLeft:'auto', fontWeight:400, fontSize:12, opacity:.7 }}>
                  {lines.length} ligne{lines.length>1?'s':''}
                </span>
              </div>

              {lines.map(line => {
                const isFocused = focusedLine === line.id;
                const isFav     = favoriteLines.includes(line.id);
                const stops     = getLineStops(line.id);
                const freqColor = (line.freq||'').match(/^[1-8] /) ? '#059669' :
                                  (line.freq||'').match(/^(9|1[0-5]) /) ? '#d97706' : '#94a3b8';
                return (
                  <div
                    key={line.id}
                    className={`line-card${isFocused ? ' focused' : ''}`}
                    style={isFocused ? { borderColor: line.color, boxShadow: `0 4px 20px ${line.color}40` } : {}}
                    onClick={() => handleLineClick(line)}
                  >
                    <div className="line-card-accent" style={{ background: line.color }} />
                    <div className="line-card-body">
                      <div className="line-card-top">
                        <span className="line-badge" style={{ background: line.color }}>{line.name}</span>
                        <span className="line-route">{line.route}</span>
                        <button className="fav-btn"
                          onClick={e => { e.stopPropagation(); dispatch(toggleFavoriteLine(line.id)); }}
                          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                          {isFav ? '⭐' : '☆'}
                        </button>
                      </div>
                      <div className="line-meta">
                        <span className="line-chip">🚏 {stops.length} arrêts</span>
                        <span className="line-chip">
                          <span className="freq-dot" style={{ background: freqColor }} />
                          {line.freq}
                        </span>
                        <span className="line-chip">💰 {op.tarif} FCFA</span>
                      </div>
                      {isFocused ? (
                        <div className="focus-hint" style={{color:line.color,opacity:1,fontWeight:600}}>
                          <span>🗺️</span> Tracé affiché sur la carte — cliquer pour fermer
                        </div>
                      ) : (
                        <div className="line-card-tap-hint">
                          <span>👆</span> Cliquer pour voir le tracé sur la carte
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
