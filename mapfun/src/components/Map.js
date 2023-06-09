import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { SearchBox } from "mapbox-gl";
import ReactMapGL, { Marker, GeolocateControl } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { InfoModal } from "./InfoModal";

import { FaPlus, FaTimes } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FnYXJtb2hhbnR5IiwiYSI6ImNsOHJueGlkcjBvM2Ezb24xMmY0OXZzNDMifQ.RoCjsG0LtvSHbsKXFmFGtQ";

export default function Map({ user }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const geocoderContainerRef = useRef();
  const [lng, setLng] = useState(84.5726);
  const [lat, setLat] = useState(21.3639);
  const [zoom, setZoom] = useState(9);
  const Marker = <div></div>;
  const [show, setShow] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    name: user,
    instruction: "",
    radius: 100,
  });
  const [markers, setMarkers] = useState([]);

  const addPopup = () => {
    if (!modalData.name || !modalData.instruction) {
      markers[markers.length - 1].remove();
      return;
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div className="map-popup"><h6 >${modalData.name}</h6><p>${modalData.instruction}</p></div>`
    );
    modalData.id.setPopup(popup).addTo(mapRef.current);

    setModalData({ ...modalData, id: null, name: "", instruction: "" });
  };

  function addMarker(e) {
    if (addMode) {
      console.log(addMode + "Sdas");
      const el = document.createElement("div");
      const width = 40;
      const height = 40;
      el.className = "marker";
      el.style.backgroundImage = `url(https://cdn-icons-png.flaticon.com/512/106/106175.png)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";

      el.addEventListener("click", () => {
        e.preventDefault();
      });
      const marker = new mapboxgl.Marker(el)
        .setLngLat(e.lngLat)
        .addTo(mapRef.current);
      setMarkers([...markers, marker]);
      setShow(true);
      setModalData({ ...modalData, id: marker, lngLat: e.lngLat });
      document.querySelector(".marker").addEventListener("click", function (e) {
        // Prevent the `map.on('click')` from being triggered
        e.preventDefault();
      });
    }
  }
  useEffect(() => {
    if (mapRef.current) return; // initialize map only once
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    mapRef.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        showAccuracyCircle: false,

        trackUserLocation: true,
      }),
      "bottom-right"
    );
    mapRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: "Search for places",
      })
    );
    // mapRef.current.on("click", addMarker);
  }, []);

  useEffect(() => {
    if (addMode) mapRef.current.once("click", addMarker);
    // if (!addMode) mapRef.current.off("click", addMarker);
  }, [addMode, setAddMode]);

  const removeMapListener = () => {
    console.log("sas");
    mapRef.current.off("click", addMarker);
  };
  return (
    <div>
      {/* <div className="sidebar mt-10">
        Add an Instruction by clicking the + icon
      </div> */}
      <button className="add-icon" onClick={() => setAddMode(!addMode)}>
        {!addMode ? <FaPlus /> : <FaTimes />}
        {/* <FaPlus /> */}
      </button>

      <InfoModal
        show={show}
        setShow={setShow}
        modalData={modalData}
        setModalData={setModalData}
        addPopup={addPopup}
        setAddMode={setAddMode}
        removeMapListener={removeMapListener}
      />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
