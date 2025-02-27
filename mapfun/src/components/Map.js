import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { SearchBox } from "mapbox-gl";
import ReactMapGL, { Marker, GeolocateControl } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { InfoModal } from "./InfoModal";

import { FaPlus, FaTimes } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import apis from "../api/api";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FnYXJtb2hhbnR5IiwiYSI6ImNsOHJueGlkcjBvM2Ezb24xMmY0OXZzNDMifQ.RoCjsG0LtvSHbsKXFmFGtQ";

export default function Map({ user }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const geocoderContainerRef = useRef();
  const [lng, setLng] = useState(84.5726);
  const [lat, setLat] = useState(21.3639);
  const [coordinates, setCoordinates] = useState([lng, lat]); // [lng, lat
  const [zoom, setZoom] = useState(15);
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

  const addMarkers = (task, mapRef) => {
    const el = document.createElement("div");
    const width = 40;
    const height = 40;
    el.className = "marker";
    el.style.backgroundImage = `url(https://cdn-icons-png.flaticon.com/512/106/106175.png)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div className="map-popup"><h6 >${task.title}</h6><p>${task.description}</p></div>`
    );
    const marker = new mapboxgl.Marker(el)
      .setLngLat([task.location.coordinates[0], task.location.coordinates[1]])
      .setPopup(popup)
      .addTo(mapRef.current);
    setMarkers([...markers, marker]);
  };

  const tasksNearby = async () => {
    try {
      console.log(coordinates);
      const response = await apis.getTasksByLocation(coordinates);
      console.log(response.data);
      response.data.tasks.map((task) => {
        // const el = document.createElement("div");
        // const width = 40;
        // const height = 40;
        // el.className = "marker";
        // el.style.backgroundImage = `url(https://cdn-icons-png.flaticon.com/512/106/106175.png)`;
        // el.style.width = `${width}px`;
        // el.style.height = `${height}px`;
        // el.style.backgroundSize = "100%";
        // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        //   `<div className="map-popup"><h6 >${task.title}</h6><p>${task.description}</p></div>`
        // );
        // const marker = new mapboxgl.Marker(el)
        //   .setLngLat([
        //     task.location.coordinates[0],
        //     task.location.coordinates[1],
        //   ])
        //   .setPopup(popup)
        //   .addTo(mapRef.current);
        // setMarkers([...markers, marker]);

        addMarkers(task, mapRef);
      });
    } catch (err) {
      console.log(err);
    }
  };

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

  // console.log(mapRef.current);
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCoordinates([position.coords.longitude, position.coords.latitude]);
        setZoom(15);
      });
    }
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    //postion the map to center using geolocation

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
    //change the map center when the coordinates change
    if (!mapRef.current) return; // wait for map to initialize

    mapRef.current.flyTo({
      center: coordinates,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });

    tasksNearby();
  }, [coordinates]);

  useEffect(() => {
    removeMapListener();
    if (addMode) mapRef.current.once("click", addMarker);

    // if (!addMode) mapRef.current.off("click", addMarker);
  }, [addMode]);

  const removeMapListener = () => {
    console.log("sas");
    if (!mapRef.current) return;
    mapRef.current.off("click", addMarker);
    mapRef.current._listeners.click = [];

    console.log(mapRef.current);
  };
  return (
    <div className={addMode ? "add_marker_cursor" : "hand_marker_cursor"}>
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
        //!
        addMarkers={addMarkers}
        mapRef={mapRef}
        //!
        setAddMode={setAddMode}
        removeMapListener={removeMapListener}
      />
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
