import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, toggleDarkMode } from './store/store';
import OperatorFilter from './components/OperatorFilter';
import MapView       from './components/MapView';
import GeolocGate    from './components/GeolocGate';
import PlanPage      from './pages/PlanPage';
import LinesPage     from './pages/LinesPage';
import StopsPage     from './pages/StopsPage';
import AlertsPage    from './pages/AlertsPage';

const TABS = [
  { id:'plan',   label:'Planifier', icon:'🗺️' },
  { id:'lines',  label:'Lignes',    icon:'🛤️' },
  { id:'stops',  label:'Arrêts',    icon:'🚏' },
  { id:'alerts', label:'Alertes',   icon:'⚠️' },
];
const PAGES = { plan: PlanPage, lines: LinesPage, stops: StopsPage, alerts: AlertsPage };

export default function App() {
  const dispatch = useDispatch();
  const { activeTab, darkMode } = useSelector(s => s.mobility);
  const [geoReady, setGeoReady] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const Page = PAGES[activeTab] || PlanPage;

  return (
    <>
      {!geoReady && <GeolocGate onDone={() => setGeoReady(true)} />}
      <div className="app-shell" style={{ visibility: geoReady ? 'visible' : 'hidden' }}>

        {/* ── Header compact ── */}
        <header className="app-header">
          <div className="header-logo">
            <div className="header-logo-icon">🚌</div>
            <div>
              <h1>SenBus</h1>
              <span>Dakar · Sénégal 🇸🇳</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn"
              onClick={() => setSidebarCollapsed(c => !c)}
              title={sidebarCollapsed ? 'Afficher panneau' : 'Masquer panneau'}>
              {sidebarCollapsed ? '📋' : '🗺️'}
            </button>
            <button className="header-btn"
              onClick={() => dispatch(toggleDarkMode())}
              title={darkMode ? 'Mode clair' : 'Mode sombre'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* ── Operator filter ── */}
        <OperatorFilter />

        {/* ── Body : carte + sidebar ── */}
        <div className="app-body">
          <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
            {/* Drag handle (mobile) */}
            <div className="sidebar-handle"
              onClick={() => setSidebarCollapsed(c => !c)}>
              <div className="sidebar-handle-bar" />
            </div>
            <Page />
          </aside>
          <div className="map-area">
            <MapView />
          </div>
        </div>

        {/* ── Bottom Navigation (mobile) ── */}
        <nav className="bottom-nav" role="navigation" aria-label="Navigation">
          {TABS.map(tab => (
            <button key={tab.id}
              className={`nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => {
                dispatch(setActiveTab(tab.id));
                setSidebarCollapsed(false);
              }}>
              <span className="nav-item-icon">{tab.icon}</span>
              <span className="nav-item-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
