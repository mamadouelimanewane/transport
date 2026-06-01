import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLocation, setMapCenter, setMapZoom } from '../store/store';

export function useGeolocation() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        dispatch(setUserLocation(coords));
        dispatch(setMapCenter(coords));
        dispatch(setMapZoom(15));
        setLoading(false);
      },
      () => {
        setError('Position indisponible');
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [dispatch]);

  return { locate, loading, error };
}
