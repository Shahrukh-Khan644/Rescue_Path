import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { useEffect } from 'react';

export default function EscapeRouteMap({ routeData }) {
  useEffect(() => {
    console.log("🗺️ routeData received by EscapeRouteMap:", routeData);
  }, [routeData]);

  if (!routeData || !routeData.origin || !routeData.destination || !routeData.route) {
    return <p>Loading map data...</p>;
  }

  const { origin, destination, route } = routeData;

  if (!route.geometry || !route.geometry.coordinates || !Array.isArray(route.geometry.coordinates)) {
    return <p>Invalid route data received</p>;
  }

  const positions = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);

  return (
    <MapContainer center={[origin.lat, origin.lon]} zoom={14} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[origin.lat, origin.lon]}>
        <Popup>Your Location</Popup>
      </Marker>
      <Marker position={[destination.lat, destination.lon]}>
        <Popup>{destination.name}</Popup>
      </Marker>
      <Polyline positions={positions} />
    </MapContainer>
  );
}
