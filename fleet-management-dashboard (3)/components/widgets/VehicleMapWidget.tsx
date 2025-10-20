import React, { useEffect, useRef, useState } from 'react';
import { Vehicle } from '../../types';
import useGoogleMaps from '../../hooks/useGoogleMaps';

// Fix: Removed redundant declaration as it's now globally defined in types.ts

const statusColors: Record<Vehicle['status'], string> = {
  Active: '#4ade80',
  'In-Shop': '#facc15',
  Idle: '#9ca3af',
};

const getMarkerIcon = (color: string) => {
  return {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#ffffff',
    rotation: 0,
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  };
};

const VehicleMapWidget: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  const { isLoaded, error } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      // Fix: Use the globally declared 'google' variable instead of 'window.google' for consistency and to resolve type errors.
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 45.4215, lng: -75.6972 },
        zoom: 10,
        mapId: 'FLEET_MAP_ID',
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
      });
      setMap(newMap);
      infoWindowRef.current = new google.maps.InfoWindow();
    }
  }, [isLoaded, mapRef, map]);

  useEffect(() => {
    if (map && vehicles.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      const currentMarkers = markersRef.current;
      const vehicleIds = new Set(vehicles.map(v => v.id));

      vehicles.forEach(vehicle => {
        const position = { lat: vehicle.location.lat, lng: vehicle.location.lng };
        bounds.extend(position);
        const marker = currentMarkers.get(vehicle.id);
        
        if (marker) {
          marker.setPosition(position);
          marker.setIcon(getMarkerIcon(statusColors[vehicle.status]));
        } else {
          const newMarker = new google.maps.Marker({
            position,
            map,
            icon: getMarkerIcon(statusColors[vehicle.status]),
            title: vehicle.name,
          });

          newMarker.addListener('click', () => {
            const content = `
              <div style="color: #333;">
                <h4 style="font-weight: bold; margin: 0 0 5px 0;">${vehicle.name}</h4>
                <p style="margin: 0;"><strong>Driver:</strong> ${vehicle.driver || 'N/A'}</p>
                <p style="margin: 0;"><strong>Status:</strong> ${vehicle.status}</p>
              </div>`;
            infoWindowRef.current?.setContent(content);
            infoWindowRef.current?.open(map, newMarker);
          });
          
          currentMarkers.set(vehicle.id, newMarker);
        }
      });

      currentMarkers.forEach((marker, vehicleId) => {
        if (!vehicleIds.has(vehicleId)) {
          marker.setMap(null);
          currentMarkers.delete(vehicleId);
        }
      });
      
      if (vehicles.length > 1) {
        map.fitBounds(bounds);
      } else if (vehicles.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(14);
      }
    }
  }, [map, vehicles]);
  
  const renderContent = () => {
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return <div className="flex items-center justify-center h-full text-center text-gray-400 p-4">Google Maps API Key is not configured. Please set it in your Vercel environment variables.</div>;
    }
    if (error) {
        return <div className="flex items-center justify-center h-full text-center text-red-400 p-4">Error: {error.message}. Please check your API key and network connection.</div>;
    }
    if (!isLoaded) {
      return <div className="flex items-center justify-center h-full text-gray-400">Loading Map...</div>;
    }
    return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-md" />;
  }

  return renderContent();
};

export default VehicleMapWidget;