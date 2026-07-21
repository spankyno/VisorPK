import  { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const { BaseLayer, Overlay } = LayersControl;

function App() {
  const [geoData, setGeoData] = useState(null);
  const center: [number, number] = [40.4168, -3.7038];

  useEffect(() => {
    fetch('/pk_data_optimized.json')
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const pointToLayer = (feature: any, latlng: any) => {
    return L.circleMarker(latlng, {
      radius: 3,
      fillColor: '#ff0000',
      color: '#ff0000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  };

   const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties) {
      const { NOMBRE_VIA, NUM_POR } = feature.properties;
      layer.bindPopup(`
        <div>
          <strong>Carretera:</strong> ${NOMBRE_VIA}<br>
          <strong>PK:</strong> ${NUM_POR}
        </div>
      `);
    }
  };
 

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </BaseLayer>
          
          <BaseLayer name="Google Satellite">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; Google'
            />
          </BaseLayer>
          
          <BaseLayer name="Google Maps">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              attribution='&copy; Google'
            />
          </BaseLayer>
          
          <BaseLayer name="IGN España">
            <TileLayer
              url="https://www.ign.es/wmts/ign-base?layer=IGNBaseTodo&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix={z}&TileCol={x}&TileRow={y}"
              attribution='&copy; IGN España'
            />
          </BaseLayer>

          {geoData && (
            <Overlay name="Puntos Kilométricos" checked>
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={40}
              >
                <GeoJSON
                  data={geoData}
                  pointToLayer={pointToLayer}
                  onEachFeature={onEachFeature}
                />
              </MarkerClusterGroup>
            </Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default App;
 