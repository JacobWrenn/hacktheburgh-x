"use client"; 
import React, {useState, useEffect, memo} from "react";

import * as h3 from 'h3-js';
import * as h3p from "h3-polyfill";
import {geoToH3} from 'h3-js/legacy'

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup} from "react-leaflet";

// import Region from './Region'
// import {useColour} from './ColourContext'
import L from 'leaflet';
import api from "@/app/api";

const icon = L.icon({ iconUrl: "/marker-icon.png" });
const icon2 = L.icon({ iconUrl: "/marker-16.png" });


const Map = (props) => {
  const [Map, setMap] = useState(null)
  const [LatLong, setLatLong] = useState([0,0])
  const [LatLongSet, setLatLongSet] = useState(false)
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
        const h3Indices = h3p(data, resolution);
        let curr_max = 0;
          h3Indices.features.forEach((feature, index) => {
          // Calculate density or retrieve it from another data source
          // This is just an example calculation
   
          let color = props.colors[index] ?? "red"; // Random density value for demonstration
          
          feature.properties.color = color;
      
          let centroid = calculateCentroid(feature.geometry.coordinates[0].slice(0,-1))
          // Add the H3 index as a property to the hexagon
          feature.properties.centroid = centroid;
       

        });
       
        // Now geoJson contains hexagons with their respective H3 index as a property
        setMap(h3Indices);

      });
  }, [props.colors]);
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
  function cleanup(beforeImg,afterImg) {
    let beforeTrash = uploadImage(beforeImg);
    let afterTrash = uploadImage(afterImg);

    // Hardcoding for testing purposes
    beforeTrash = 1;
    afterTrash = 0;

    if (afterTrash < beforeTrash) {
      let closestDist = Number.MAX_SAFE_INTEGER
      let matchingHexagon = 0
      Map.features.forEach((feature,index) => {
        let lat = LatLong[1]
        let long = LatLong[0]
        let dist = Math.sqrt(((lat - feature.properties.centroid[0]) ** 2) + ((long - feature.properties.centroid[1]) ** 2))
        if (dist < closestDist) {
          closestDist = dist
          matchingHexagon = index
        }
      })
   
      api.post(`/hexagon/colour`, {MatchingHexagon: matchingHexagon})
    }
  }
  
  return (
    <div>
      
      {LatLongSet?
      <MapContainer center={LatLong} zoom={zoom} style={{ height: '20em', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {/* Add the GeoJSON layer */}
      {Map ? <GeoJSON data={Map} key="j" style={hexStyle} />: "not working 😅"}
      <Marker position={LatLong}><Popup>You</Popup></Marker>
      {/* {
        props.events.map((trashLatLong, index) => (
          <Marker key={index} position={trashLatLong} icon={icon2}><Popup>Trash Reported</Popup></Marker>
        ))
      } */}
    </MapContainer>
    :<p className="w-full text-center">Loading...</p>}
    <button onClick={() => cleanup(1,2)}>
      click
      
    </button>
  
    
    </div>
  );
};

function uploadImage(file) {
  // Get image somehow as file


  const formData = new FormData();
  formData.append('file', file); // Append the file to the 'file' key

  fetch("/detector/upload", { // Replace with your actual endpoint
    method: 'POST',
    body: formData, // Attach the FormData object
    // Note: When using FormData, you don't manually set the Content-Type header
    // The browser will automatically set it with the proper boundary
  })
  .then(response => {
    if (response.ok) {
      return response.text(); // or .text() if the response is not JSON
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}



export default Map;