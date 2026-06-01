import React from 'react';

const ALERTS = [
  { id: 1, type: 'warning', icon: '⚠️', title: 'Travaux VDN', desc: 'Ralentissements sur la VDN entre Liberté VI et Grand Yoff. Prévoir +10 min sur DDD-02.', time: 'Actif jusqu\'au 15 juin', lines: ['DDD-02'], color: '#d97706' },
  { id: 2, type: 'info',    icon: 'ℹ️', title: 'BRT — Fréquence renforcée', desc: 'La ligne BRT-L1 passe toutes les 3 min aux heures de pointe (7h-9h et 17h-20h).', time: 'Lun–Ven', lines: ['BRT-L1'], color: '#1a56db' },
  { id: 3, type: 'success', icon: '✅', title: 'TER — Service normal', desc: 'Tous les trains circulent normalement. Prochain départ de Dakar : 08h45.', time: 'Aujourd\'hui', lines: ['TER-01'], color: '#059669' },
  { id: 4, type: 'warning', icon: '🚧', title: 'AFTU-R1 — Déviation', desc: 'Déviation par Thiaroye km 14 suite à un accident. Prévoir +15 min.', time: 'Depuis 06h00', lines: ['AFTU-R1'], color: '#d97706' },
];

const TIPS = [
  { icon: '💡', title: 'Heures de pointe', text: '7h–9h et 17h–20h. Préférez le BRT pour un trajet plus rapide.' },
  { icon: '📱', title: 'Payer sans monnaie', text: 'Le TER accepte la carte bancaire et Orange Money en gare.' },
  { icon: '🌞', title: 'Météo & transport', text: 'En hivernage (juil–oct), prévoir +15 min sur les lignes banlieue.' },
  { icon: '♿', title: 'Accessibilité', text: 'Les stations BRT et les gares TER sont équipées pour PMR.' },
];

const css = `
.alerts-page { display:flex; flex-direction:column; height:100%; overflow:hidden; }
.alerts-scroll { flex:1; overflow-y:auto; padding:14px; }
.alert-card {
  border-radius:var(--radius-md); padding:14px 16px; margin-bottom:10px;
  border-left:4px solid transparent; background:var(--surface-0);
  border-top:1px solid var(--surface-border); border-right:1px solid var(--surface-border); border-bottom:1px solid var(--surface-border);
  box-shadow:var(--shadow-sm); animation:fadeIn .2s var(--ease) both;
}
.alert-top { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
.alert-icon { font-size:20px; }
.alert-title { font-size:14px; font-weight:700; color:var(--text-primary); flex:1; }
.alert-time { font-size:11px; color:var(--text-muted); }
.alert-desc { font-size:13px; color:var(--text-secondary); line-height:1.55; margin-bottom:8px; }
.alert-lines { display:flex; gap:5px; flex-wrap:wrap; }
.alert-line-tag {
  font-size:10px; font-weight:700; color:white;
  padding:2px 8px; border-radius:10px;
}
.section-title { font-size:13px; font-weight:700; color:var(--text-primary); margin:16px 0 10px; display:flex; align-items:center; gap:8px; }
.tip-card {
  display:flex; gap:12px; align-items:flex-start;
  background:var(--surface-1); border-radius:var(--radius-sm);
  padding:12px 14px; margin-bottom:8px;
  border:1px solid var(--surface-border);
}
.tip-icon { font-size:22px; flex-shrink:0; margin-top:1px; }
.tip-title { font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:3px; }
.tip-text  { font-size:12px; color:var(--text-secondary); line-height:1.5; }
`;

const LINE_COLORS = { 'DDD-02':'#2563eb','BRT-L1':'#7c3aed','TER-01':'#059669','AFTU-R1':'#d97706' };

export default function AlertsPage() {
  return (
    <div className="alerts-page">
      <style>{css}</style>
      <div className="alerts-scroll">

        <div className="section-title">⚠️ Alertes trafic en cours</div>
        {ALERTS.map(a => (
          <div key={a.id} className="alert-card" style={{ borderLeftColor: a.color }}>
            <div className="alert-top">
              <span className="alert-icon">{a.icon}</span>
              <span className="alert-title">{a.title}</span>
              <span className="alert-time">{a.time}</span>
            </div>
            <div className="alert-desc">{a.desc}</div>
            <div className="alert-lines">
              {a.lines.map(l => (
                <span key={l} className="alert-line-tag" style={{ background: LINE_COLORS[l] || '#64748b' }}>{l}</span>
              ))}
            </div>
          </div>
        ))}

        <div className="section-title">💡 Conseils voyageurs</div>
        {TIPS.map((t, i) => (
          <div key={i} className="tip-card">
            <div className="tip-icon">{t.icon}</div>
            <div>
              <div className="tip-title">{t.title}</div>
              <div className="tip-text">{t.text}</div>
            </div>
          </div>
        ))}

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
