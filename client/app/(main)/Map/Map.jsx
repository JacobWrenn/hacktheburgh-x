"use client";

import React, { useState, useEffect } from "react";
import * as h3p from "h3-polyfill";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";

const Map = (props) => {
  const [Map, setMap] = useState(null);
  const [LatLong, setLatLong] = useState([0, 0]);
  const [LatLongSet, setLatLongSet] = useState(false);
  const resolution = 6;

  const zoom = 10; // Initial zoom level

  function calculateCentroid(points) {
    let sumLat = 0;
    let sumLng = 0;
    const n = points.length; // Should be 6 for a hexagon
    for (let i = 0; i < n; i++) {
      sumLat += points[i][0]; // Sum latitudes
      sumLng += points[i][1]; // Sum longitudes
    }
    const centroidLat = sumLat / n;
    const centroidLng = sumLng / n;
    return [centroidLat, centroidLng]; // Return centroid as [latitude, longitude]
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setLatLong([latitude, longitude]);
      setLatLongSet(true);
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

    // Load GeoJSON data
    fetch("/uk.json")
      .then((response) => response.json())
      .then((data) => {
        const h3Indices = h3p(data, resolution);
        h3Indices.features.forEach((feature, index) => {
          let color = props.colors[index] ?? "red";

          feature.properties.color = color;

          let centroid = calculateCentroid(
            feature.geometry.coordinates[0].slice(0, -1)
          );
          // Add the H3 index as a property to the hexagon
          feature.properties.centroid = centroid;

          feature.properties.color = color;
        });

        // Now geoJson contains hexagons with their respective H3 index as a property
        setMap(h3Indices);
      });
  }, [props.colors]);
  const hexStyle = (feature) => {
    const color = feature.properties.color;
    return {
      color: color,
    };
  };

  return (
    <div>
      {LatLongSet ? (
        <MapContainer
          center={LatLong}
          zoom={zoom}
          style={{ height: "20em", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Map ? (
            <GeoJSON data={Map} key="j" style={hexStyle} />
          ) : (
            "not working 😅"
          )}
          <Marker position={LatLong}>
            <Popup>You</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="w-full text-center">Loading...</p>
      )}
    </div>
  );
};

export default Map;
