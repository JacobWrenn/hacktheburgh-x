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
const icon2 = L.icon({ iconUrl: "/marker-16.png" });

const postData = async (url = '', data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST', // Specify the request method
      headers: {
        'Content-Type': 'application/json', // Specify the content type in the header
      },
      body: JSON.stringify(data), // Stringify the data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // If you expect a JSON response:
    const result = await response.json();
    console.log('Data successfully sent to the server:', result);
    // Handle the response data as needed
    return result; // You can return the result (if needed)

  } catch (error) {
    console.error("Failed to send data:", error);
    // Handle errors here
  }
};
















const Map = (props) => {
  const [Map, setMap] = useState(null)
  const [LatLong, setLatLong] = useState([0,0])
  const [LatLongSet, setLatLongSet] = useState(false)
  const resolution = 6; 
  
 
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
      
 
        
        
        const h3Indices = h3p(data, resolution);
        let curr_max = 0;
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
  function cleanup(beforeImg,afterImg) {
    let beforeTrash = uploadImage(beforeImg) 
    let afterTrash = uploadImage(afterImg) 
    if (afterTrash < beforeTrash){
      postData('http://localhost:8080/colour/hexagon', {"hexID": h3p.geoToH3(LatLong[0], LatLong[1], resolution)});
    }
  
    
  }
  

  return (
    <div>
      <h3>UK Hexagons</h3>
      {LatLongSet?
      <MapContainer center={LatLong} zoom={zoom} style={{ height: '20em', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors"/>
      {/* Add the GeoJSON layer */}
      {Map ? <GeoJSON data={Map} key="j" style={hexStyle} />: "not working 😅"}
      <Marker position={LatLong}><Popup>You</Popup></Marker>
      {/* {
        props.events.map((trashLatLong, index) => (
          <Marker key={index} position={trashLatLong} icon={icon2}><Popup>Trash Reported</Popup></Marker>
        ))
      } */}
    </MapContainer>
    :"Loading..."}
  
    
    </div>
  );
};

function uploadImage(file) {
  // Get image somehow as file


  const formData = new FormData();
  formData.append('file', file); // Append the file to the 'file' key

  fetch("http://127.0.0.1:8000/upload", { // Replace with your actual endpoint
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