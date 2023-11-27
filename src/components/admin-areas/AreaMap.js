/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { BiShapePolygon } from "react-icons/bi";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { useControl } from "react-map-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useNavigate } from "react-router-dom";
import { useAreaContext } from "../../hooks/useAreaContext";
import area from "@turf/area";

const Area = (props)=>{
  console.log("props", props);
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
  }

  return Math.round(polygonArea * 100) / 100;
}

const DrawControl = (props) => {
   useControl(
     () => new MapboxDraw(props),
     ({ map }) => {
       map.on("draw.create", props.onCreate);
       map.on("draw.update", props.onUpdate);
       map.on("draw.delete", props.onDelete);
     },
     ({ map }) => {
       map.off("draw.create", props.onCreate);
       map.off("draw.update", props.onUpdate);
       map.off("draw.delete", props.onDelete);
     },
     {
       position: props.position,
     }
   );

  return null;
};

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
};
const AreaMap = () => {

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [enableMouseMove, setEnableMouseMove] = useState(false);
  const [features, setFeatures] = useState({});
  const [mapId, setMapId] = useState("");
  const { dispatch: areaDispatch } = useAreaContext();
  const popupRef = useRef();

  const mapRef = useRef();
  const navigate = useNavigate();

  const handleMapClick = useCallback(
    (event) => {
      if (enableMouseMove) {
        setSelectedLocation({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        });
        setEnableMouseMove(false);
      }
    },
    [enableMouseMove]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (enableMouseMove) {
        const { point, lngLat } = event;
        setCursorPosition({ x: point.x, y: point.y });
        document.getElementById("info").innerHTML =
          JSON.stringify(point) + "<br />" + JSON.stringify(lngLat.wrap());
      }
    },
    [enableMouseMove]
  );

  const handleToggleMouseMove = useCallback(() => {
    setEnableMouseMove((prev) => !prev);
  }, []);


  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
        setMapId(f);
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  useEffect(() => {
    const updateCursorPosition = () => {
      const map = mapRef.current?.getMap();
      const canvas = map?.getCanvasContainer();
      const cursorElement = document.getElementById("info");

      if (cursorElement && canvas) {
        const { x, y } = cursorPosition;
        const rect = canvas.getBoundingClientRect();
        const top = y - rect.top;
        const left = x - rect.left;

        cursorElement.style.top = `${top}px`;
        cursorElement.style.left = `${left + 10}px`; // Adjust for better positioning
      }
    };

    updateCursorPosition();

    const map = mapRef.current?.getMap();
    if (map) {
      map.on("move", updateCursorPosition);
    }

    return () => {
      const map = mapRef.current?.getMap();
      if (map) {
        map.off("move", updateCursorPosition);
      }
    };
  }, [cursorPosition, enableMouseMove]);

  const handleSaveArea = useCallback(() => {
    const area = Area({ polygons: Object.values(features) });
    areaDispatch({ type: "GET_LOCATION_AREA", payload: area });
    areaDispatch({
      type: "SET_LOCATION_COORDINATES",
      payload: selectedLocation,
    });
    areaDispatch({ type: "SET_POLYGON_COORDINATES", payload: mapId });
    navigate("/admin-dashboard/add_area");
  }, [navigate, mapId, selectedLocation]);

  return (
    <div
      className=" mx-auto h-screen flex flex-col"
      style={{ height: "calc(100vh - 76px)" }}
    >
      <div className="flex-grow">
        <Map 
          mapLib={import("mapbox-gl")}
          ref={mapRef}
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 3,
          }}
          className="container w-screen"
          mapboxAccessToken="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ"
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
        >
          <DrawControl
            position="top-left"
            displayControlsDefault={false}
            controls={{
              polygon: true,
              trash: true,
            }}
            defaultMode="draw_polygon"
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
          {selectedLocation && (
            <>
              <Marker
                longitude={selectedLocation.longitude}
                latitude={selectedLocation.latitude}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    border: "2px solid white",
                  }}
                />
              </Marker>
              <Popup
                ref={popupRef}
                longitude={selectedLocation.longitude}
                latitude={selectedLocation.latitude}
                onClose={handleClosePopup}
                closeOnClick={false} // Prevent closing on map click
                closeButton={false}
              >
                <div className="realtive right-0 top-0">
                  <h3>Location Details</h3>
                  <p>Latitude: {selectedLocation.latitude}</p>
                  <p>Longitude: {selectedLocation.longitude}</p>
                </div>
              </Popup>
            </>
          )}
          {enableMouseMove && (
            <div
              id="info"
              style={{
                position: "absolute",
                wordWrap: "anywhere",
                whiteSpace: "pre-wrap",
                padding: "10px",
                borderRadius: "3px",
                fontSize: "12px",
                textAlign: "center",
                color: "#222",
                background: "#fff",
                zIndex: 99,
              }}
            ></div>
          )}
          <div className="absolute flex flex-col bottom-9 right-2 z-10">
            <button
              onClick={handleToggleMouseMove}
              className="bg-white flex flex-wrap p-2 gap-x-2 items-center mb-2"
            >
              <FaLocationCrosshairs />
              <span>
                {enableMouseMove ? "Disable Mouse Move" : "Enable Mouse Move"}
              </span>
            </button>
            <button
              disabled={!mapId || !selectedLocation}
              onClick={handleSaveArea}
              className={`bg-orange-500 p-2 flex flex-wrap gap-x-2 items-center ${
                !mapId || !selectedLocation
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <MdOutlineDataSaverOn />
              <span> Save Area</span>
            </button>
          </div>
        </Map>
      </div>
    </div>
  );
};

export default AreaMap;
