"use client"; 
import React, {useState, useEffect, memo} from "react";


// import { ComposableMap, Geographies} from "react-simple-maps";
import datum from 'uk.json'
import * as h3 from 'h3-js';
import * as h3p from "h3-polyfill";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, Marker,Popup} from "react-leaflet";

// import Region from './Region'
// import {useColour} from './ColourContext'
import L from 'leaflet';

const icon = L.icon({ iconUrl: "/marker-icon.png" });
const Map = (props) => {
  const [Map, setMap] = useState(null)
  const [LatLong, setLatLong] = useState([0,0])
  const [LatLongSet, setLatLongSet] = useState(false)
  
 
  const zoom = 10; // Initial zoom level

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
    
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setLatLong([latitude,longitude])
      setLatLongSet(true)
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
    
    function error() {
      console.log("Unable to retrieve your location");
    }
    // Load your GeoJSON data (for example, from the public folder)
    fetch('/uk.json')
      .then(response => response.json())
      .then(data => {
      
 
        
        const resolution = 5; 
        const h3Indices = h3p(data, resolution);
          h3Indices.features.forEach((feature, index) => {
          // Calculate density or retrieve it from another data source
          // This is just an example calculation
   
          const color = props.colors[index] ?? "red"; // Random density value for demonstration
          
          feature.properties.color = color;
        });
        setMap(h3Indices);

      });
  }, []);
  const hexStyle = (feature) => {
    const color = feature.properties.color;
    return {
      color: color, // Border color
      // weight: 2, // Border width
      // opacity: 1, // Border opacity
      // fillColor: '#ffff00', // Fill color
      // fillOpacity: 0.5 // Fill opacity
    };
  };

  

  return (
    <div>
      <h3>UK Hexagons</h3>
      {LatLongSet?
      <MapContainer center={LatLong} zoom={zoom} style={{ height: '20em', width: '20em' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Add the GeoJSON layer */}
      {Map ? <GeoJSON data={Map} key="j" style={hexStyle} />: "not working 😅"}
      <Marker position={LatLong}><Popup>You</Popup></Marker>
      {
        {props.events.map((item, index) => (
          
          <Marker position={LatLong}><Popup>You</Popup></Marker>
        ))}
      }
    </MapContainer>
    :"Loading..."}
  
    
    </div>
  );
};

export default Map;