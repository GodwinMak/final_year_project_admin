/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
} from "react-map-gl";
import DeckGl, { FlyToInterpolator, } from "deck.gl";
import { PathLayer } from "@deck.gl/layers";
import axios from 'axios'
import NoArea from "../../pages/NoContentPage/NoArea";


const Areas = () => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("https://apiv2.at.patrickmamsery.co.tz/api/areas/all")
          .then((res) => {
            setAreas(res.data);
          });

      } catch (error) {
        console.log(error)
      }
    };

    fetchData()
  }, [])

  // console.log(areas)
  function convertToGeoJSON(apiData) {
    const features = apiData
      .map((item) => {
        const pointFeature = {
          type: "Feature",
          properties: { ...item, createdAt: undefined, updatedAt: undefined },
          point: {
            type: "Point",
            coordinates: item.area_location.coordinates,
          },
          polygon: {
            type: "Polygon",
            coordinates: item.area_polygon.coordinates[0]
          }
        };


        return [pointFeature];
      })
      .flat();

    return {
      type: "FeatureCollection",
      features: features,
    };
  }

  // console.log(convertToGeoJSON(areas));
  const AreaData = convertToGeoJSON(areas);

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 3,
  });

  const [selectedStore, setSelectedStore] = useState(null);


  const handleMarkerClick = (marker) => {
    flyToStore(marker);
    setSelectedStore(marker);
  };

  const handlePopupClose = () => {
    setSelectedStore(null);
  };

  const buildLocationList = () => {
    return AreaData.features.map((store) => (
      <div
        key={store.properties.area_id}
        className="px-2 py-4 cursor-pointer flex-col hover:text-orange-500 border-orange-600 border-b-2 duration-300 justify-start items-center gap-2 flex w-full"
        onClick={() => {
          flyToStore(store);
          setSelectedStore(store);
        }}
      >
        <a className="">{store.properties.area_name}</a>
        <div>
          {store.properties.area_area} square meters
        </div>
      </div>
    ));
  };

  const flyToStore = (currentFeature) => {
    setViewport({
      latitude: currentFeature.point.coordinates[1],
      longitude: currentFeature.point.coordinates[0],
      zoom: 6,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const layer = new PathLayer({
    id: "path-layer",
    data: areas,
    pickable: true,
    widthScale: 20,
    widthMinPixels: 2,
    getPath: (d) => d.area_polygon.coordinates[0],
    getColor: (d) => {
      const hex = "#ed1c24";
      return hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16));
    },
    getWidth: (d) => 5,
  });
  return (
    <>
      {areas.length !== 0 ? (
        <div
          className="mx-auto container h-screen left-0 relative main max-w-full flex flex-1 justify-between"
          style={{ height: "calc(100vh - 76px)" }}
        >
          <div className="relative">
            <div className="h-full z-50 fixed drop-shadow-2xl md:drop-shadow flex ">
              <div className="flex-col overflow-hidden md:overflow-auto justify-start items-start gap-4 flex bg-white min-h-full">
                <div className="bg-orange-500 px-2 py-4 w-full">
                  <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                    Area Location
                  </h2>
                </div>
                {buildLocationList()}
              </div>
            </div>
          </div>
          <div className="w-full">
            <DeckGl initialViewState={viewport} controller={true} layers={layer}>
              <Map
                mapboxAccessToken="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ"
                mapStyle="mapbox://styles/mapbox/streets-v9"
              >
                <NavigationControl position="top-right" />
                {selectedStore &&
                  AreaData.features.map((marker) => (
                    <Marker
                      key={marker.properties.area_id}
                      latitude={marker.point.coordinates[1]}
                      longitude={marker.point.coordinates[0]}
                    >
                      <div
                        className="marker"
                        onClick={() => handleMarkerClick(marker)}
                        style={{ cursor: "pointer" }}
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
                      </div>
                    </Marker>
                  ))}

                {selectedStore && (
                  <Popup
                    latitude={selectedStore.point.coordinates[1]}
                    longitude={selectedStore.point.coordinates[0]}
                    onClose={handlePopupClose}
                    closeButton={false}
                  >
                    <div>
                      <h3 className="capitalize">
                        {selectedStore.properties.area_name}
                      </h3>
                      <h4>{selectedStore.properties.area_area} square meters</h4>
                    </div>
                  </Popup>
                )}
              </Map>
            </DeckGl>
          </div>
        </div>
      ) : (<NoArea />)}
    </>
  );
};

export default Areas;
