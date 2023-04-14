  import React, { useState, useEffect, useContext } from "react";
  import { Context } from "../store/appContext";
  import { useNavigate, Navigate } from "react-router-dom";
  import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import PropTypes from "prop-types";

  export const Map = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const position = [-34.839054258608684, -56.16434951021918];

    useEffect(() => {
      window.scrollTo(0, 0);
      store.onePet = {};
    }, []);

    const insertAt = (str, sub, pos) =>
    `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

    const handleMarkerClick = (id) => {
      navigate("/petlost/" + id); //usamos navigate para redireccionar
    };

    return (
      <MapContainer center={position} zoom={11} scrollWheelZoom={true} className="map" >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {store.pets.map((item, id) => (
          <Marker key={id}  
            eventHandlers={{
            click: (e) => handleMarkerClick(item.id),
          }}
          position={[parseFloat(item.latitud), parseFloat(item.longitud)]} icon={new L.Icon({
            iconUrl: insertAt(item.url[0], "w_90,h_90,c_fill/", 49) + "#custom_marker",
            iconSize: [90, 90],
            iconAnchor: [12, 41],
          })}/>
        ))}
      </MapContainer>
    );
  };

  Map.propTypes = {
    match: PropTypes.object,
  };