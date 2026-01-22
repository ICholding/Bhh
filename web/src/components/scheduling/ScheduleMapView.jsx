import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function ScheduleMapView({ jobs = [], center = [37.7749, -122.4194], zoom = 12 }) {
  // Filter jobs with valid location data
  const jobsWithLocation = jobs.filter(job => 
    job.location && job.location.lat && job.location.lng
  );

  if (jobsWithLocation.length === 0) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No jobs with location data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {jobsWithLocation.map(job => (
          <Marker
            key={job.id}
            position={[job.location.lat, job.location.lng]}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-sm">{job.title}</h4>
                {job.assignedTo && (
                  <p className="text-xs text-gray-600 mt-1">
                    Assigned to: {job.assignedTo.name}
                  </p>
                )}
                {job.scheduledDate && (
                  <p className="text-xs text-gray-600">
                    {new Date(job.scheduledDate).toLocaleString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
