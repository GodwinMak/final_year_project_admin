import React from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { url } from "../../../../utils/API";
import axios from "axios";
import * as turf from "@turf/turf";
import { RealTimeContext } from "../../../../context/RealTimeContext";
import { useAreaContext } from "../../../../hooks/useAreaContext";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";

const ConvexHull = () => {
  const mapContainer = React.useRef(null);
  const { state: animalState } = React.useContext(RealTimeContext);
  const Area = useAreaContext();


  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v9",
      center:Area.Area.area_location.coordinates, 
      zoom: 8,
    });

    map.on("load", async () => {
      try {
        const response = await axios.get(`${url}/api/animals/getDataPoint`, {
          params: {
            animalTagIds: animalState.selectedAnimal.join(","),
            numberOfDays: animalState.numberOfDays,
          },
        });
        const data = response.data;
        console.log(data);

        data.length !== 0 &&
          data.forEach((d, index) => {
            const points = turf.featureCollection(
              d.geojson.features.map((datum) =>
                turf.point(datum.geometry.coordinates)
              )
            );

            const options = { units: "kilometers", maxEdge: 1 };
            const hull = turf.convex(points, options);

            const animalColor = animalState.color.find(
              (colorData) => colorData.id === d.animal_TagId
            );

            const pointColor = animalColor
              ? `rgb(${animalColor.color.join(",")})`
              : "#0000ff"; // Default to blue if no color is found

            map.addSource(`points-${index}`, {
              type: "geojson",
              data: points,
            });

            map.addLayer({
              id: `points-${index}`,
              type: "circle",
              source: `points-${index}`,
              paint: {
                "circle-radius": 6,
                "circle-color": pointColor,
              },
            });

            if (hull) {
              map.addSource(`hull-${index}`, {
                type: "geojson",
                data: hull,
              });

              map.addLayer({
                id: `hull-${index}`,
                type: "fill",
                source: `hull-${index}`,
                paint: {
                  "fill-color": pointColor,
                  "fill-opacity": 0.5,
                },
              });
            }
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  }, [animalState.selectedAnimal, animalState.numberOfDays, animalState.color, Area.Area.area_location.coordinates]);

  return (
    <div
      className="w-full flex flex-col items-center justify-between"
      style={{ height: "calc(100vh - 76px)" }}
    >
      <div
        ref={mapContainer}
        className="fixed top-0 left-0 right-0 bottom-0 h-full w-full"
      />
    </div>
  );
};

export default ConvexHull;
