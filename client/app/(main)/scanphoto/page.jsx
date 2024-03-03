"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import * as h3p from "h3-polyfill";
import api from "@/app/api";

export default function Home() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [LatLong, setLatLong] = useState([0, 0]);
  const [Map, setMap] = useState(null);

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
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

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

    // Load GeoJSON data
    fetch("/uk.json")
      .then((response) => response.json())
      .then((data) => {
        const h3Indices = h3p(data, 6);
        h3Indices.features.forEach((feature) => {
          let centroid = calculateCentroid(
            feature.geometry.coordinates[0].slice(0, -1)
          );
          feature.properties.centroid = centroid;
        });
        // Now geoJson contains hexagons with their respective H3 index as a property
        setMap(h3Indices);
      });
  }, []);

  async function cleanup() {
    let closestDist = Number.MAX_SAFE_INTEGER;
    let matchingHexagon = 0;
    Map.features.forEach((feature, index) => {
      let lat = LatLong[1];
      let long = LatLong[0];
      let dist = Math.sqrt(
        (lat - feature.properties.centroid[0]) ** 2 +
          (long - feature.properties.centroid[1]) ** 2
      );
      if (dist < closestDist) {
        closestDist = dist;
        matchingHexagon = index;
      }
    });

    const num1 = parseInt(await submit(file1));
    const num2 = parseInt(await submit(file2));
    api.post(`/hexagon/colour`, {
      MatchingHexagon: matchingHexagon,
      Points: num1 - num2,
    });
  }

  async function submit(file) {
    const formData = new FormData();
    formData.append("file", file);
    const resp = await axios.post("/detector/upload", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return resp.data;
  }

  return (
    <div className="min-h-screen items-center bg-gradient-to-r from-cyan-50 to-cyan-100 text-gray-700 flex flex-col">
      <h1 className="text-2xl text-center font-bold p-8 mt-6">
        Upload Photographs
      </h1>

      <div>
        <ul className="flex flex-col justify-center items-center text-gray-700">
          <li className="text-2xl pt-8">Before Photograph</li>
          <li>
            <input
              className="w-full pl-12 pt-4 pb-8 text-center"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                setFile1(e.target.files ? e.target.files[0] : null)
              }
            />
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex flex-col justify-center items-center text-gray-700">
          <li className="text-2xl pt-8">After Photograph</li>
          <li>
            <input
              className="w-full pl-12 pt-4 pb-8 text-center"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                setFile2(e.target.files ? e.target.files[0] : null)
              }
            />
          </li>
        </ul>
      </div>
      <button onClick={cleanup} className="p-2 bg-gray-300 rounded mt-4">
        Submit
      </button>
    </div>
  );
}
