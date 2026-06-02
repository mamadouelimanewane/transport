import { configureStore, createSlice } from '@reduxjs/toolkit';

const mobilitySlice = createSlice({
  name: 'mobility',
  initialState: {
    // Carte
    selectedOperator: 'all',
    focusedLine:      null,
    selectedStop:     null,
    userLocation:     null,
    mapCenter:        [14.7167, -17.4677],
    mapZoom:          12,

    // Navigation
    activeTab: 'plan',

    // Itinéraire
    origin:      null,
    destination: null,
    route:       null,

    // UX
    darkMode:    false,
    language:    'fr',   // 'fr' | 'wo' | 'en'
    pmrMode:     false,

    // Favoris
    favoriteStops: [],
    favoriteLines: [],

    // Historique
    searchHistory: [],
  },

  reducers: {
    // Carte
    setSelectedOperator: (s,a) => { s.selectedOperator = a.payload; },
    setFocusedLine:      (s,a) => { s.focusedLine = s.focusedLine===a.payload ? null : a.payload; },
    clearFocusedLine:    s     => { s.focusedLine = null; },
    setSelectedStop:     (s,a) => { s.selectedStop = a.payload; },
    setUserLocation:     (s,a) => { s.userLocation = a.payload; },
    setMapCenter:        (s,a) => { s.mapCenter = a.payload; },
    setMapZoom:          (s,a) => { s.mapZoom = a.payload; },

    // Navigation
    setActiveTab: (s,a) => { s.activeTab = a.payload; },

    // Itinéraire
    setOrigin:      (s,a) => { s.origin = a.payload; },
    setDestination: (s,a) => { s.destination = a.payload; },
    setRoute:       (s,a) => { s.route = a.payload; },
    clearRoute:     s     => { s.route = null; },

    // UX
    toggleDarkMode: s     => { s.darkMode = !s.darkMode; },
    setLanguage:    (s,a) => { s.language = a.payload; },
    setPmrMode:     (s,a) => { s.pmrMode = a.payload; },

    // Favoris
    toggleFavoriteStop: (s,a) => { const i=s.favoriteStops.indexOf(a.payload); i===-1?s.favoriteStops.push(a.payload):s.favoriteStops.splice(i,1); },
    toggleFavoriteLine: (s,a) => { const i=s.favoriteLines.indexOf(a.payload); i===-1?s.favoriteLines.push(a.payload):s.favoriteLines.splice(i,1); },

    // Historique
    addToHistory: (s,a) => {
      const e=a.payload;
      s.searchHistory = [e,...s.searchHistory.filter(h=>h.fromId!==e.fromId||h.toId!==e.toId)].slice(0,5);
    },
    clearHistory: s => { s.searchHistory = []; },
  },
});

export const {
  setSelectedOperator, setFocusedLine, clearFocusedLine, setSelectedStop,
  setUserLocation, setMapCenter, setMapZoom,
  setActiveTab,
  setOrigin, setDestination, setRoute, clearRoute,
  toggleDarkMode, setLanguage, setPmrMode,
  toggleFavoriteStop, toggleFavoriteLine,
  addToHistory, clearHistory,
} = mobilitySlice.actions;

export const store = configureStore({
  reducer: { mobility: mobilitySlice.reducer },
  middleware: g => g({ serializableCheck: false }),
});
