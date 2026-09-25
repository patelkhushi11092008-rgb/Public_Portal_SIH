/**
 * MapFlyTo — a small helper component that lives inside <MapContainer>
 * and imperatively calls map.flyTo() when `target` changes.
 */
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapFlyTo({ target, zoom = 15 }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], zoom, { duration: 1.2 });
    }
  }, [target, zoom, map]);

  return null;
}
