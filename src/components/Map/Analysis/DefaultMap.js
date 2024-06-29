import React from "react";
import { useAreaContext } from "../../../hooks/useAreaContext";
import Map from "react-map-gl";
import DeckGl from "deck.gl";
import { useRealTimeContext } from "../../../hooks/useRealTimeContext";

const DefaultMap = () => {
  const Area = useAreaContext();
  const realtime = useRealTimeContext();
  console.log(realtime.state.layer);
  const [viewport, setViewport] = React.useState({
    longitude: 0,
    latitude: 0,
    zoom: 6.5,
  });

  React.useEffect(() => {
    if (Object.keys(Area.Area).length > 0) {
      setViewport({
        longitude: Area.Area.area_location.coordinates[0],
        latitude: Area.Area.area_location.coordinates[1],
        zoom: viewport.zoom, // Preserve current zoom level
      });
    }
  }, [Area.Area, viewport.zoom]);
  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-between"
      style={{ height: "calc(100vh - 76px)" }}
    >
      {/* {!realtime.state.layer && (
        
      )} */}
      <>
        <DeckGl initialViewState={viewport} controller={true}>
          <Map
            mapboxAccessToken="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ"
            mapStyle="mapbox://styles/mapbox/light-v11"
          />
        </DeckGl>
        <div className="flex justify-center items-center  bg-gray-100 absolute top-56">
          <div className="bg-orange-500 rounded-lg shadow-lg p-6 w-80 text-white">
            <h1 className="text-xl font-semibold mb-4">
              Choose Analysis Layer
            </h1>
            <p>Please select an analysis layer from the left sidebar.</p>
          </div>
        </div>
      </>
    </div>
  );
};

export default DefaultMap;
