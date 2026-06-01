import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header         from './components/Header';
import OperatorFilter from './components/OperatorFilter';
import MapView        from './components/MapView';
import GeolocGate     from './components/GeolocGate';
import PlanPage       from './pages/PlanPage';
import LinesPage      from './pages/LinesPage';
import StopsPage      from './pages/StopsPage';
import AlertsPage     from './pages/AlertsPage';

const PAGES = { plan: PlanPage, lines: LinesPage, stops: StopsPage, alerts: AlertsPage };

const css = `
.app-shell {
  display: flex; flex-direction: column; height: 100vh; overflow: hidden;
  background: var(--surface-0); transition: background var(--t-base), color var(--t-base);
}
.app-body { display: flex; flex: 1; overflow: hidden; }
.sidebar {
  width: var(--sidebar-w); min-width: 280px;
  display: flex; flex-direction: column;
  border-right: 1px solid var(--surface-border);
  background: var(--surface-0); flex-shrink: 0; overflow: hidden;
}
.map-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
@media (max-width: 640px) {
  .app-body { flex-direction: column-reverse; }
  .sidebar { width: 100%; min-width: unset; border-right: none; border-top: 1px solid var(--surface-border); height: 46vh; flex-shrink: 0; }
  .map-area { flex: 1; }
}
`;

export default function App() {
  const { activeTab, darkMode } = useSelector(s => s.mobility);
  const [geoReady, setGeoReady] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const Page = PAGES[activeTab] || PlanPage;

  return (
    <>
      {!geoReady && <GeolocGate onDone={() => setGeoReady(true)} />}
      <div className="app-shell" style={{ visibility: geoReady ? 'visible' : 'hidden' }}>
        <style>{css}</style>
        <Header />
        <div className="app-body">
          <aside className="sidebar">
            <OperatorFilter />
            <Page />
          </aside>
          <div className="map-area">
            <MapView />
          </div>
        </div>
      </div>
    </>
  );
}
