import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, toggleDarkMode } from '../store/store';

const TABS = [
  { id: 'plan',   label: 'Planifier', icon: '🗺️' },
  { id: 'lines',  label: 'Lignes',    icon: '🛤️' },
  { id: 'stops',  label: 'Arrêts',    icon: '🚏' },
  { id: 'alerts', label: 'Alertes',   icon: '⚠️' },
];

const css = `
.header {
  position: relative; z-index: 200;
  background: var(--brand-700);
  box-shadow: 0 2px 20px rgba(26,86,219,.4);
  flex-shrink: 0;
}
.header-top {
  display: flex; align-items: center; gap: 12px;
  padding: 0 16px; height: var(--header-h);
}
.logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.logo-texts h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 17px; font-weight: 700; color: #fff; line-height: 1;
}
.logo-texts span {
  font-size: 10px; color: rgba(255,255,255,.65); display: block; margin-top: 1px;
}
.header-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.icon-btn {
  width: 34px; height: 34px; border-radius: 9px;
  background: rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: white; transition: background var(--t-fast);
  cursor: pointer; border: none;
}
.icon-btn:hover { background: rgba(255,255,255,.25); }
.tabs-bar {
  display: flex; gap: 0;
  border-top: 1px solid rgba(255,255,255,.1);
  overflow-x: auto; scrollbar-width: none;
}
.tabs-bar::-webkit-scrollbar { display: none; }
.tab-btn {
  flex: 1; min-width: 70px; padding: 10px 4px 9px;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  background: none; border: none; color: rgba(255,255,255,.6);
  font-size: 11px; font-weight: 500; cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--t-fast); white-space: nowrap;
}
.tab-btn .tab-icon { font-size: 16px; line-height: 1; }
.tab-btn.active { color: white; border-bottom-color: white; }
.tab-btn:hover:not(.active) { color: rgba(255,255,255,.85); }
`;

export default function Header() {
  const dispatch = useDispatch();
  const { activeTab, darkMode } = useSelector(s => s.mobility);

  return (
    <header className="header">
      <style>{css}</style>
      <div className="header-top">
        <div className="logo">
          <div className="logo-icon">🚌</div>
          <div className="logo-texts">
            <h1>DakarMobile</h1>
            <span>Transport en commun · Sénégal 🇸🇳</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => dispatch(toggleDarkMode())}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <nav className="tabs-bar" role="navigation" aria-label="Navigation principale">
        {TABS.map(tab => (
          <button key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => dispatch(setActiveTab(tab.id))}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
