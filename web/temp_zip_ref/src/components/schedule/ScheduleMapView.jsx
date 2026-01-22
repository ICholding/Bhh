import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ScheduleMapView({ jobs }) {
  const [selectedJob, setSelectedJob] = useState(null);

  // Default center (Boston area)
  const center = [42.3601, -71.0589];

  const handleNavigate = (address) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100" style={{ height: '400px' }}>
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {jobs.map((job) => (
            <Marker
              key={job.id}
              position={[job.lat, job.lng]}
              eventHandlers={{
                click: () => setSelectedJob(job),
              }}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold text-sm">{job.client_name}</p>
                  <p className="text-xs text-gray-600">{job.service_type}</p>
                  <p className="text-xs text-gray-500 mt-1">{job.start_time} - {job.end_time}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Today's Locations</h3>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`bg-white rounded-xl p-4 border cursor-pointer transition-colors ${
              selectedJob?.id === job.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{job.client_name}</h4>
                <p className="text-sm text-gray-600">{job.service_type}</p>
                <p className="text-xs text-gray-500 mt-1">{job.address}</p>
                <p className="text-xs text-gray-500">{job.start_time} - {job.end_time}</p>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(job.address);
                }}
                className="flex-shrink-0"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}