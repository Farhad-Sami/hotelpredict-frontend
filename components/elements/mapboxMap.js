"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useTheme } from 'next-themes';

const MapboxMap = () => {
  const mapContainerRef = useRef(null);
  const [zoom, setZoom] = useState(10);
  const [lng, setLng] = useState(-117.15602058431624);
  const [lat, setLat] = useState(32.71761913366557);
  const { theme } = useTheme();
  const [map, setMap] = useState(null);

  const lightStyle = 'mapbox://styles/mapbox/satellite-streets-v12';
  const darkStyle = 'mapbox://styles/mapbox/dark-v11';

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGlsbHMiLCJhIjoiY20xa283ZzkwMDBkbzJrc24xOW1sOHBlbyJ9.J5zXocj7jEgbhZr7-L7qVQ'

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: theme === 'dark' 
        ? darkStyle
        : lightStyle,
      center: [lng, lat],
      zoom: zoom
    });

    setMap(mapInstance);

    mapInstance.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
      }),
      'bottom-right'
    );

    mapInstance.addControl(new mapboxgl.NavigationControl({
      showCompass: false
    }),
      'top-right');

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map) {
      map.setStyle(
        theme === 'dark'
          ? darkStyle
          : lightStyle
      );
    }
  }, [theme, map]);

  useEffect(() => {
    if (map) {
      map.on('moveend', () => {
        const newCenter = map.getCenter();
        console.log('New center coordinates:', newCenter.lng, newCenter.lat);
        // You can also update state or perform other actions here
      });
    }
  }, [map]);

  return (
    <div className="map-container w-full h-full" ref={mapContainerRef} />
  );
};

export default MapboxMap;