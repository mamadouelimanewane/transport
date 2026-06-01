import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteStop, setMapCenter, setMapZoom, setSelectedStop } from '../store/store';
import { STOPS, OPERATORS, getNextDepartures } from '../data/transportData';

const css = `
.stops-page { display:flex; flex-direction:column; height:100%; overflow:hidden; }
.stops-toolbar {
  padding:12px 14px; border-bottom:1px solid var(--surface-border);
  display:flex; flex-direction:column; gap:8px; flex-shrink:0;
}
.stops-search-input {
  width:100%; padding:9px 14px; border-radius:var(--radius-sm);
  background:var(--surface-1); border:1.5px solid var(--surface-border);
  font-size:14px; color:var(--text-primary); transition:border-color var(--t-fast);
}
.stops-search-input:focus { border-color:var(--brand-500); background:var(--surface-0); }
.stops-count { font-size:12px; color:var(--text-muted); }
.stops-scroll { flex:1; overflow-y:auto; padding:10px 14px; }
.stop-card {
  background:var(--surface-0);
  border:1.5px solid var(--surface-border);
  border-radius:var(--radius-md);
  padding:12px 14px; margin-bottom:8px; cursor:pointer;
  transition:all var(--t-fast); box-shadow:var(--shadow-sm);
  animation:fadeIn .2s var(--ease) both;
}
.stop-card:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }
.stop-card-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; }
.stop-dot-wrap {
  width:36px; height:36px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  font-size:18px; flex-shrink:0;
}
.stop-name { font-size:14px; font-weight:600; color:var(--text-primary); line-height:1.2; }
.stop-zone { font-size:12px; color:var(--text-muted); margin-top:2px; }
.stop-fav-btn {
  background:none; border:none; font-size:17px; cursor:pointer;
  padding:2px; border-radius:6px; flex-shrink:0; margin-left:auto;
  transition:transform var(--t-fast);
}
.stop-fav-btn:hover { transform:scale(1.2); }
.stop-ops { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:8px; }
.op-tag {
  font-size:10px; font-weight:700; color:white;
  padding:2px 8px; border-radius:10px;
}
.stop-departures { border-top:1px solid var(--surface-border); padding-top:8px; }
.dep-row { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
.dep-row:last-child { margin-bottom:0; }
.dep-line-badge {
  color:white; font-size:10px; font-weight:700;
  padding:2px 7px; border-radius:4px; min-width:52px; text-align:center;
}
.dep-route { font-size:12px; color:var(--text-secondary); flex:1; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.dep-wait {
  font-size:12px; font-weight:700; flex-shrink:0;
}
.fav-section-label { font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em; margin:4px 0 8px; }
`;

function StopCard({ stop, isFav, onFav, onClick }) {
  const mainOp = stop.operators[0];
  const bg     = (OPERATORS[mainOp]?.color || '#1a56db') + '18';
  const deps   = getNextDepartures(stop.id).slice(0, 3);

  return (
    <div className="stop-card" onClick={onClick}>
      <div className="stop-card-top">
        <div className="stop-dot-wrap" style={{ background: bg }}>
          {OPERATORS[mainOp]?.icon || '🚏'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="stop-name">{stop.name}</div>
          <div className="stop-zone">{stop.zone}</div>
        </div>
        <button className="stop-fav-btn"
          onClick={e => { e.stopPropagation(); onFav(stop.id); }}
          title={isFav ? 'Retirer des favoris' : 'Ajouter'}>
          {isFav ? '⭐' : '☆'}
        </button>
      </div>

      <div className="stop-ops">
        {stop.operators.map(op => (
          <span key={op} className="op-tag" style={{ background: OPERATORS[op]?.color || '#64748b' }}>
            {OPERATORS[op]?.icon} {op}
          </span>
        ))}
      </div>

      <div className="stop-departures">
        {deps.map((d, i) => (
          <div key={i} className="dep-row">
            <div className="dep-line-badge" style={{ background: d.color }}>{d.lineName}</div>
            <span className="dep-route">{d.route.split('↔')[1]?.trim() || d.route}</span>
            <span className="dep-wait" style={{
              color: d.waitMin <= 5 ? '#059669' : d.waitMin <= 15 ? '#d97706' : '#94a3b8'
            }}>
              {d.waitMin} min
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StopsPage() {
  const dispatch = useDispatch();
  const { selectedOperator, favoriteStops } = useSelector(s => s.mobility);
  const [search, setSearch] = useState('');

  const all = STOPS
    .filter(s => selectedOperator === 'all' || s.operators.includes(selectedOperator))
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.zone.toLowerCase().includes(search.toLowerCase())
    );

  // Favoris en premier
  const favs = all.filter(s => favoriteStops.includes(s.id));
  const rest  = all.filter(s => !favoriteStops.includes(s.id));

  const handleClick = (stop) => {
    dispatch(setSelectedStop(stop.id));
    dispatch(setMapCenter([stop.lat, stop.lng]));
    dispatch(setMapZoom(15));
  };

  return (
    <div className="stops-page">
      <style>{css}</style>
      <div className="stops-toolbar">
        <input className="stops-search-input" placeholder="Rechercher un arrêt ou quartier…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="stops-count">
          {all.length} arrêt{all.length > 1 ? 's' : ''}
          {favoriteStops.length > 0 && ` · ${favs.length} favori${favs.length > 1 ? 's' : ''}`}
        </div>
      </div>

      <div className="stops-scroll">
        {favs.length > 0 && (
          <>
            <div className="fav-section-label">⭐ Mes favoris</div>
            {favs.map(s => (
              <StopCard key={s.id} stop={s} isFav={true}
                onFav={id => dispatch(toggleFavoriteStop(id))}
                onClick={() => handleClick(s)} />
            ))}
            {rest.length > 0 && <div className="fav-section-label" style={{ marginTop: 12 }}>Tous les arrêts</div>}
          </>
        )}
        {rest.map(s => (
          <StopCard key={s.id} stop={s} isFav={false}
            onFav={id => dispatch(toggleFavoriteStop(id))}
            onClick={() => handleClick(s)} />
        ))}
        {all.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
            <div>Aucun arrêt trouvé</div>
          </div>
        )}
      </div>
    </div>
  );
}
