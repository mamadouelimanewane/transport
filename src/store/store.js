import { configureStore, createSlice } from '@reduxjs/toolkit';

const mobilitySlice = createSlice({
  name: 'mobility',
  initialState: {
    activeTab: 'plan',
    selectedOperator: 'all',
    mapCenter: [14.7167, -17.4677],
    mapZoom: 12,
    selectedStop: null,
    selectedLine: null,
    // ✨ NOUVEAU : ligne en focus (affichée seule sur la carte)
    focusedLine: null,
    origin: null,
    destination: null,
    route: null,
    userLocation: null,
    darkMode: false,
    favoriteStops: [],
    favoriteLines: [],
  },
  reducers: {
    setActiveTab:         (s, a) => { s.activeTab = a.payload; },
    setSelectedOperator:  (s, a) => { s.selectedOperator = a.payload; },
    setMapCenter:         (s, a) => { s.mapCenter = a.payload; },
    setMapZoom:           (s, a) => { s.mapZoom = a.payload; },
    setSelectedStop:      (s, a) => { s.selectedStop = a.payload; },
    setSelectedLine:      (s, a) => { s.selectedLine = a.payload; },
    // Focus une ligne (l'afficher seule) ou la désactiver si déjà focalisée
    setFocusedLine:       (s, a) => {
      s.focusedLine = s.focusedLine === a.payload ? null : a.payload;
    },
    clearFocusedLine:     (s)    => { s.focusedLine = null; },
    setOrigin:            (s, a) => { s.origin = a.payload; },
    setDestination:       (s, a) => { s.destination = a.payload; },
    setRoute:             (s, a) => { s.route = a.payload; },
    clearRoute:           (s)    => { s.route = null; s.origin = null; s.destination = null; },
    setUserLocation:      (s, a) => { s.userLocation = a.payload; },
    toggleDarkMode:       (s)    => { s.darkMode = !s.darkMode; },
    toggleFavoriteStop:   (s, a) => {
      const idx = s.favoriteStops.indexOf(a.payload);
      if (idx === -1) s.favoriteStops.push(a.payload);
      else s.favoriteStops.splice(idx, 1);
    },
    toggleFavoriteLine:   (s, a) => {
      const idx = s.favoriteLines.indexOf(a.payload);
      if (idx === -1) s.favoriteLines.push(a.payload);
      else s.favoriteLines.splice(idx, 1);
    },
  },
});

export const {
  setActiveTab, setSelectedOperator, setMapCenter, setMapZoom,
  setSelectedStop, setSelectedLine, setFocusedLine, clearFocusedLine,
  setOrigin, setDestination, setRoute, clearRoute,
  setUserLocation, toggleDarkMode,
  toggleFavoriteStop, toggleFavoriteLine,
} = mobilitySlice.actions;

export const store = configureStore({
  reducer: { mobility: mobilitySlice.reducer },
});
