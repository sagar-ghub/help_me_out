"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "@/app/lib/api";
import { User } from "next-auth";

// Fix missing marker icons for Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const TaskMarker = dynamic(() => import("./TaskMarker"), { ssr: false });

// A helper component that re-centers the map when the coordinates change
function Recenter({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function MapComponentWithLocation() {
  const defaultCoords: [number, number] = [51.505, -0.09];
  const [coords, setCoords] = useState<[number, number]>(defaultCoords);
  const [locationError, setLocationError] = useState("");
  const [friends, setFriends] = useState<User[]>([]);

  let lastSentTime = 0;

  const sendCoords = async (coords: [number, number]) => {
    const now = Date.now();
    const debounceInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
    
    if (now - lastSentTime < debounceInterval) {
      console.log("Debounced: API call skipped.");
      return;
    }
    
    lastSentTime = now;
    try {
      const data: any = await apiRequest("/updateLocation", "POST", {
        latitude: coords[1],
        longitude: coords[0],
      });
      console.log("API call successful:", data);
    } catch (error) {
      console.error("API call error:", error);
    }
  };
  const fetchFriendList=async()=>{
    const data:any=await apiRequest("/friendList");
    setFriends(data.friends);

  }
  
  // Attempt to fetch the user's current location
  useEffect(() => {
    fetchFriendList()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCoords(newCoords);
          sendCoords(newCoords);
        },
        (error) => {
          console.error("Error obtaining location:", error);
          setLocationError("Unable to retrieve your location.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer center={coords} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {/* <Marker position={coords}>
          <Popup>
            {locationError ? locationError : "You are here!"}
          </Popup>
        </Marker> */}
        {friends.map((friend,index)=>{
         const coords: [number, number] = friend.lastLocation.coordinates;
          return <Marker position={coords} >
             <Popup>
            {friend.name}
          </Popup>
          </Marker>
        })}
        <Recenter coords={coords} />
        <TaskMarker />
      </MapContainer>

      {/* A button to re-fetch and update the current location */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const newCoords: [number, number] = [
                    position.coords.latitude,
                    position.coords.longitude,
                  ];
                  setCoords(newCoords);
                  setLocationError("");
                },
                (error) => {
                  console.error("Error obtaining location:", error);
                  setLocationError("Unable to retrieve your location.");
                }
              );
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Update Location
        </button>
      </div>
    </div>
  );
}
