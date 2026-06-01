import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLocation, setMapCenter, setMapZoom } from '../store/store';

const css = `
.geo-gate {
  position: fixed; inset: 0; z-index: 9999;
  background: linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1a56db 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: 'Inter', sans-serif; padding: 24px; text-align: center;
}
.geo-logo { font-size: 64px; margin-bottom: 20px; animation: bounce .9s ease-in-out infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
.geo-title {
  font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700;
  color: white; margin: 0 0 6px;
}
.geo-sub { font-size: 14px; color: rgba(255,255,255,.65); margin-bottom: 36px; }
.geo-card {
  background: rgba(255,255,255,.08); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.15); border-radius: 20px;
  padding: 28px 24px; max-width: 340px; width: 100%; margin-bottom: 20px;
}
.geo-icon-big { font-size: 48px; margin-bottom: 12px; }
.geo-card-title { font-size: 18px; font-weight: 700; color: white; margin-bottom: 8px; }
.geo-card-text { font-size: 13px; color: rgba(255,255,255,.7); line-height: 1.6; }
.geo-btn {
  width: 100%; max-width: 340px; padding: 15px;
  background: white; color: #1a56db;
  border: none; border-radius: 14px; cursor: pointer;
  font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif;
  box-shadow: 0 8px 32px rgba(0,0,0,.3);
  transition: all .2s ease; margin-bottom: 10px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.geo-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.4); }
.geo-btn:active { transform: translateY(0); }
.geo-btn:disabled { opacity: .6; cursor: wait; transform: none; }
.geo-skip {
  background: none; border: none; color: rgba(255,255,255,.5);
  font-size: 12px; cursor: pointer; font-family: 'Inter', sans-serif;
  padding: 8px; text-decoration: underline;
}
.geo-skip:hover { color: rgba(255,255,255,.8); }
.geo-error {
  background: rgba(220,38,38,.2); border: 1px solid rgba(220,38,38,.4);
  color: #fca5a5; border-radius: 10px; padding: 10px 16px;
  font-size: 12px; max-width: 340px; margin-bottom: 12px;
}
.geo-loading-dots span {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: #1a56db; margin: 0 3px;
  animation: dot .9s ease-in-out infinite;
}
.geo-loading-dots span:nth-child(2) { animation-delay: .15s; }
.geo-loading-dots span:nth-child(3) { animation-delay: .3s; }
@keyframes dot { 0%,80%,100% { transform: scale(0.6); opacity:.4; } 40% { transform: scale(1); opacity:1; } }
.geo-progress { width: 100%; max-width: 340px; height: 3px; background: rgba(255,255,255,.15); border-radius: 2px; margin-top: 16px; overflow: hidden; }
.geo-progress-bar { height: 100%; background: white; border-radius: 2px; animation: prog 2s ease-in-out; }
@keyframes prog { from { width: 0; } to { width: 100%; } }
`;

export default function GeolocGate({ onDone }) {
  const dispatch = useDispatch();
  const [state, setState] = useState('idle'); // idle | loading | error | done
  const [error, setError] = useState('');

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Votre navigateur ne supporte pas la géolocalisation.');
      setState('error');
      return;
    }
    setState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        dispatch(setUserLocation(coords));
        dispatch(setMapCenter(coords));
        dispatch(setMapZoom(15));
        setState('done');
        setTimeout(onDone, 800);
      },
      (err) => {
        const msgs = {
          1: 'Accès à la position refusé. Veuillez autoriser dans les paramètres du navigateur.',
          2: 'Position indisponible. Vérifiez votre GPS ou connexion.',
          3: 'Délai dépassé. Réessayez.',
        };
        setError(msgs[err.code] || 'Erreur de géolocalisation.');
        setState('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSkip = () => {
    // Centrer sur Dakar par défaut
    dispatch(setMapCenter([14.7167, -17.4677]));
    dispatch(setMapZoom(12));
    onDone();
  };

  return (
    <div className="geo-gate">
      <style>{css}</style>
      <div className="geo-logo">🚌</div>
      <div className="geo-title">SenBus</div>
      <div className="geo-sub">Transport en commun · Dakar, Sénégal 🇸🇳</div>

      <div className="geo-card">
        <div className="geo-icon-big">📍</div>
        <div className="geo-card-title">Activez votre position</div>
        <div className="geo-card-text">
          Pour trouver les bus près de vous, voir les arrêts les plus proches
          et calculer vos itinéraires, SenBus a besoin de votre position GPS.
        </div>
      </div>

      {error && <div className="geo-error">⚠️ {error}</div>}

      {state === 'done' ? (
        <div style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>
          ✅ Position trouvée !
          <div className="geo-progress"><div className="geo-progress-bar" /></div>
        </div>
      ) : state === 'loading' ? (
        <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 14, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          Recherche de votre position…
          <div className="geo-loading-dots"><span/><span/><span/></div>
        </div>
      ) : (
        <>
          <button className="geo-btn" onClick={handleLocate} disabled={state==='loading'}>
            📍 Activer ma position GPS
          </button>
          <button className="geo-skip" onClick={handleSkip}>
            Passer — voir Dakar sans ma position
          </button>
        </>
      )}
    </div>
  );
}
