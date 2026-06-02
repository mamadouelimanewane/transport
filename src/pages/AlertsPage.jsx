import React, { useState } from 'react';
import { getAllReportedStops } from '../data/transportData';

const ALERTS = [
  { id:1, type:'warning', emoji:'⚠️', title:'Travaux VDN', desc:'Ralentissements entre Liberté VI et Grand Yoff. Prévoir +10 min sur DDD Lignes 2A et 6.', time:'Actif jusqu\'au 20 juin', lines:['L2A','L6'], color:'#d97706' },
  { id:2, type:'info',    emoji:'ℹ️', title:'BRT — Fréquence renforcée', desc:'Ligne BRT-L1 toutes les 3 min aux heures de pointe (7h-9h et 17h-20h).', time:'Lun–Ven', lines:['BRT-L1'], color:'#1a56db' },
  { id:3, type:'success', emoji:'✅', title:'TER — Service normal', desc:'Tous les trains circulent normalement. Dernier départ Dakar → AIBD : 23h00.', time:'Aujourd\'hui', lines:['TER-01'], color:'#059669' },
  { id:4, type:'warning', emoji:'🚧', title:'AFTU A2 — Déviation', desc:'Déviation temporaire par Thiaroye km 14 suite à des travaux. Prévoir +15 min.', time:'Depuis 06h00', lines:['A2'], color:'#d97706' },
  { id:5, type:'danger',  emoji:'🔥', title:'Chaleur extrême', desc:'Températures > 38°C. Préférez le BRT (climatisé) ou voyagez avant 10h ou après 18h.', time:'14h–18h', lines:['BRT-L1','TER-01'], color:'#dc2626' },
];

const TIPS = [
  { emoji:'💡', title:'Heures de pointe', text:'7h–9h et 17h–20h. Préférez le BRT (climatisé, ponctuel) pour un trajet plus rapide. Évitez AFTU A2 le vendredi à 13h (prière).' },
  { emoji:'📱', title:'Payer sans monnaie', text:'Le TER accepte Orange Money, Wave et carte bancaire en gare. Les bus DDD acceptent progressivement les paiements mobiles.' },
  { emoji:'🌧️', title:'Hivernage (juil–oct)', text:'Prévoir +15 à +30 min sur les lignes banlieue. La ligne BRT reste la plus fiable. Évitez les bas-fonds de Pikine en cas de forte pluie.' },
  { emoji:'♿', title:'Accessibilité PMR', text:'BRT et TER sont 100% accessibles PMR. Activez le mode ♿ dans l\'onglet Planifier pour filtrer uniquement ces lignes.' },
  { emoji:'🕌', title:'Vendredi & prières', text:'Circulation réduite à Dakar 13h-14h30 le vendredi (prière de Dhuhr). Évitez le centre-ville et le Plateau.' },
  { emoji:'🎁', title:'Offrir un trajet', text:'Via la Cagnotte dans l\'onglet Planifier, vous pouvez offrir un trajet à un proche via Wave ou Orange Money. Il reçoit un QR code valide 24h.' },
  { emoji:'🔔', title:'Notifications de passage', text:'Autorisez les notifications SenBus pour être alerté quand votre bus arrive dans 2 min à votre arrêt favori.' },
];

const COVERAGE = [
  { zone:'Plateau / Médina', pct:95, color:'#059669' },
  { zone:'Parcelles Assainies', pct:88, color:'#059669' },
  { zone:'Grand Yoff / Liberté', pct:85, color:'#d97706' },
  { zone:'Guédiawaye', pct:78, color:'#d97706' },
  { zone:'Pikine', pct:80, color:'#d97706' },
  { zone:'Keur Massar', pct:65, color:'#dc2626' },
  { zone:'Rufisque', pct:70, color:'#d97706' },
  { zone:'Yoff / Ngor', pct:60, color:'#dc2626' },
  { zone:'Almadies', pct:45, color:'#dc2626' },
  { zone:'Mbao / Jaxaay', pct:50, color:'#dc2626' },
];

const css = `
.alerts-page{height:100%;overflow-y:auto;scrollbar-width:none}
.alerts-page::-webkit-scrollbar{display:none}
.section-label{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin:16px 0 8px;padding:0 2px}
.alert-card{border-radius:14px;border:1px solid var(--surface-border);padding:12px 14px;margin-bottom:8px;border-left-width:4px;background:var(--surface-0)}
.alert-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.alert-title{flex:1;font-size:13px;font-weight:700;color:var(--text-primary)}
.alert-time{font-size:10px;color:var(--text-muted)}
.alert-desc{font-size:12px;color:var(--text-secondary);line-height:1.6}
.alert-pills{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap}
.alert-pill{padding:2px 7px;border-radius:10px;color:white;font-size:10px;font-weight:700}
.tip-card{display:flex;align-items:flex-start;gap:12px;background:var(--surface-0);border:1px solid var(--surface-border);border-radius:12px;padding:12px 14px;margin-bottom:6px}
.tip-title{font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:3px}
.tip-text{font-size:12px;color:var(--text-secondary);line-height:1.6}
.coverage-row{margin-bottom:8px}
.coverage-label{display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px}
.coverage-bar{height:7px;border-radius:4px;background:var(--surface-2);overflow:hidden}
.coverage-fill{height:100%;border-radius:4px;transition:width .5s ease}
.report-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:var(--surface-1);margin-bottom:6px;border:1px solid var(--surface-border)}
.report-badge{padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;color:white}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.stat-box{background:var(--surface-1);border-radius:10px;padding:12px;text-align:center}
.stat-num{font-size:22px;font-weight:700;color:var(--text-primary)}
.stat-lbl{font-size:11px;color:var(--text-muted);margin-top:2px}
`;

export default function AlertsPage() {
  const reportedStops = getAllReportedStops();
  const totalReports  = reportedStops.reduce((s,r)=>s+r.count,0);
  const [tab, setTab] = useState('alertes');

  const TABS = ['alertes','conseils','dashboard'];

  return (
    <div className="alerts-page">
      <style>{css}</style>
      <div style={{padding:'10px 12px 0'}}>
        <div style={{fontSize:15,fontWeight:700,color:'var(--text-primary)',marginBottom:10}}>⚠️ Alertes & Infos</div>

        {/* Mini-tabs */}
        <div style={{display:'flex',gap:4,background:'var(--surface-1)',padding:4,borderRadius:10,marginBottom:12}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{flex:1,padding:'7px 4px',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',
                background:tab===t?'var(--surface-0)':'transparent',
                color:tab===t?'var(--text-primary)':'var(--text-muted)',
                boxShadow:tab===t?'var(--shadow-sm)':'none',
                textTransform:'capitalize'}}>
              {t==='alertes'?'⚠️ Alertes':t==='conseils'?'💡 Conseils':'📊 Dashboard'}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'0 12px 80px'}}>
        {/* ── Alertes trafic ── */}
        {tab==='alertes' && (
          <>
            {ALERTS.map(a=>(
              <div key={a.id} className="alert-card" style={{borderLeftColor:a.color}}>
                <div className="alert-top">
                  <span style={{fontSize:18}}>{a.emoji}</span>
                  <span className="alert-title">{a.title}</span>
                  <span className="alert-time">{a.time}</span>
                </div>
                <div className="alert-desc">{a.desc}</div>
                <div className="alert-pills">
                  {a.lines.map(l=><span key={l} className="alert-pill" style={{background:a.color}}>{l}</span>)}
                </div>
              </div>
            ))}

            {/* Signalements récents de la communauté */}
            {reportedStops.length > 0 && (
              <>
                <div className="section-label">🚨 Signalements citoyens récents</div>
                {reportedStops.slice(0,5).map((r,i)=>(
                  <div key={i} className="report-row">
                    <span style={{fontSize:20}}>{r.latest.type==='retard'?'⏰':r.latest.type==='bonde'?'👥':r.latest.type==='degrade'?'🚧':'⚠️'}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:'var(--text-primary)'}}>{r.latest.label}</div>
                      <div style={{fontSize:11,color:'var(--text-muted)'}}>Arrêt {r.stopId} · {r.count} signalement{r.count>1?'s':''}</div>
                    </div>
                    <span className="report-badge" style={{background:'#dc2626'}}>{r.count}</span>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* ── Conseils ── */}
        {tab==='conseils' && TIPS.map((tip,i)=>(
          <div key={i} className="tip-card">
            <span style={{fontSize:24,flexShrink:0}}>{tip.emoji}</span>
            <div>
              <div className="tip-title">{tip.title}</div>
              <div className="tip-text">{tip.text}</div>
            </div>
          </div>
        ))}

        {/* ── Dashboard open data ── */}
        {tab==='dashboard' && (
          <>
            <div className="section-label">📊 Statistiques réseau SenBus</div>
            <div className="stats-grid">
              <div className="stat-box"><div className="stat-num" style={{color:'#1a56db'}}>60</div><div className="stat-lbl">Lignes actives</div></div>
              <div className="stat-box"><div className="stat-num" style={{color:'#e11d48'}}>46</div><div className="stat-lbl">Arrêts AFTU</div></div>
              <div className="stat-box"><div className="stat-num" style={{color:'#059669'}}>6</div><div className="stat-lbl">Gares TER</div></div>
              <div className="stat-box"><div className="stat-num" style={{color:'#7c3aed'}}>1</div><div className="stat-lbl">Ligne BRT</div></div>
              <div className="stat-box"><div className="stat-num" style={{color:'#d97706'}}>{totalReports||0}</div><div className="stat-lbl">Signalements citoyens</div></div>
              <div className="stat-box"><div className="stat-num" style={{color:'#6b7280'}}>40</div><div className="stat-lbl">POI référencés</div></div>
            </div>

            <div className="section-label">🗺️ Couverture réseau par zone</div>
            {COVERAGE.map((c,i)=>(
              <div key={i} className="coverage-row">
                <div className="coverage-label">
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{c.zone}</span>
                  <span style={{fontSize:12,fontWeight:600,color:c.color}}>{c.pct}%</span>
                </div>
                <div className="coverage-bar"><div className="coverage-fill" style={{width:`${c.pct}%`,background:c.color}}/></div>
              </div>
            ))}
            <div style={{fontSize:11,color:'var(--text-muted)',textAlign:'center',marginTop:10,lineHeight:1.6}}>
              Zones en rouge = sous-desservies. Source : données OpenStreetMap + CETUD 2026
            </div>

            <div className="section-label">🌡️ Indice de confort réseau actuel</div>
            {['BRT','TER','DDD','AFTU'].map(opId=>{
              const op = require('../data/transportData').OPERATORS[opId];
              const comfort = require('../data/transportData').getComfortIndex(opId);
              return (
                <div key={opId} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'var(--surface-1)',borderRadius:10,marginBottom:6,border:'1px solid var(--surface-border)'}}>
                  <span style={{fontSize:16}}>{op.icon}</span>
                  <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',flex:1}}>{op.name}</span>
                  <span style={{fontSize:12,fontWeight:600,color:comfort.color}}>{comfort.emoji} {comfort.label}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
