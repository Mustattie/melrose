import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ServiceAreaMap: React.FC = () => {
  const officeLocation: [number, number] = [42.4584, -71.0658];
  const serviceRadius = 40000;

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={officeLocation}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={officeLocation}
          radius={serviceRadius}
          pathOptions={{
            fillColor: '#991b1b',
            fillOpacity: 0.1,
            color: '#991b1b',
            weight: 2,
          }}
        />

        <Marker position={officeLocation}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-900">Melrose Mobile Restrooms</h3>
              <p className="text-gray-600">Main Office</p>
              <p className="text-sm text-gray-500 mt-2">Serving the Greater Boston Area</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ServiceAreaMap;
