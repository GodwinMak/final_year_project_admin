/* eslint-disable no-unused-vars */
import React from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { url } from "../../../../utils/API";
import axios from "axios";
import { RealTimeContext } from "../../../../context/RealTimeContext";
import { useAreaContext } from "../../../../hooks/useAreaContext";
import * as turf from "@turf/turf";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";

const LineMap = () => {
  const mapContainer = React.useRef(null);
  const { state: animalState } = React.useContext(RealTimeContext);
  const Area = useAreaContext();
  // console.log(Area.zone_geojson.features[0].geometry.coordinates);
  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v9",
      zoom: 0,
    });
    map.on("load", async () => {
      try {
        map.addSource(`area`, {
          type: "geojson",
          data: Area.zone_geojson.features[0],
        });

        // Add a new layer to visualize the polygon.
        map.addLayer({
          id: "area",
          type: "fill",
          source: "area", // reference the data source
          layout: {},
          paint: {
            "fill-color": "#0080ff", // blue color fill
            "fill-opacity": 0.5,
          },
        });
        map.addLayer({
          id: "outline",
          type: "line",
          source: "area",
          layout: {},
          paint: {
            "line-color": "#000",
            "line-width": 3,
          },
        });
        const response = await axios.get(`${url}/api/animals/getDataLineMap`, {
          params: {
            animalTagIds: animalState.selectedAnimal.join(","),
            numberOfDays: animalState.numberOfDays,
          },
        });

        const data = response.data;

        data.length !== 0 &&
          data.forEach((geojson, index) => {
            const coordinates =
              geojson.geojson.features[0].geometry.coordinates;
            geojson.geojson.features[0].geometry.coordinates = [coordinates[0]];

            const animalColor = animalState.color.find(
              (colorData) => colorData.id === geojson.animal_TagId
            );

            const lineColor = animalColor
              ? `rgb(${animalColor.color.join(",")})`
              : "yellow"; // Default to yellow if no color is found

            map.addSource(`trace-${index}`, {
              type: "geojson",
              data: geojson.geojson,
            });

            map.addLayer({
              id: `trace-${index}`,
              type: "line",
              source: `trace-${index}`,
              paint: {
                "line-color": lineColor,
                "line-opacity": 0.75,
                "line-width": 3,
              },
            });

            map.addLayer({
              id: `points-${index}`,
              type: "circle",
              source: `trace-${index}`,
              paint: {
                "circle-radius": 3,
                "circle-color": lineColor,
              },
            });

            // if (index === 0) {
            map.jumpTo({ center: coordinates[0], zoom: 8 });
            map.setPitch(25);
            // }

            let i = 0;
            const timer = setInterval(() => {
              if (i < coordinates.length) {
                geojson.geojson.features[0].geometry.coordinates.push(
                  coordinates[i]
                );
                map.getSource(`trace-${index}`).setData(geojson.geojson);
                map.panTo(coordinates[i]);
                if (i === coordinates.length - 1) {
                  // Create a marker at the last point
                  const marker = new mapboxgl.Marker({
                    color: lineColor,
                  })
                    .setLngLat(coordinates[i])
                    .addTo(map);
                  const point = turf.point(coordinates[i]);
                  const line = turf.lineString(
                    Area.zone_geojson.features[0].geometry.coordinates[0]
                  );
                  const poly = turf.polygon(
                    Area.zone_geojson.features[0].geometry.coordinates
                  );
                  const nearestPoint = turf.nearestPointOnLine(line, point, {
                    units: "kilometers",
                  });
                  const distance = turf.distance(point, nearestPoint, {
                    units: "kilometers",
                  });

                  const location = turf.booleanPointInPolygon(point, poly);
                  console.log(location);
                  // Create a popup
                  const popup = new mapboxgl.Popup({
                    offset: 25,
                    closeButton: false,
                    closeOnClick: false,
                  }).setHTML(`
                    <div class="flex flex-col">
                      <h3 class="font-bold text-orange-700">Animal Name: ${
                        geojson.animal_name
                      }</h3>
                      <p class="font-bold">Coordinates: ${coordinates[i].join(
                        ", "
                      )}</p>
                      <p>${distance?.toFixed(3)} km ${
                    location ? "In the Border" : "Out of border"
                  }</p>
                    </div>
                  `);

                  // Add hover and click event to the marker
                  marker.getElement().addEventListener("mouseenter", () => {
                    marker.getPopup().addTo(map);
                  });
                  marker.getElement().addEventListener("mouseleave", () => {
                    marker.getPopup().remove();
                  });
                  marker.getElement().addEventListener("click", () => {
                    popup.addTo(map);
                  });

                  marker.setPopup(popup);
                }
                i++;
              } else {
                window.clearInterval(timer);
              }
            }, 10);
          });
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    });
  }, [
    Area.zone_geojson.features,
    animalState.color,
    animalState.numberOfDays,
    animalState.selectedAnimal,
  ]);

  return (
    <div
      className="w-full flex flex-col items-center justify-between"
      style={{ height: "calc(100vh - 76px)" }}
    >
      <div
        ref={mapContainer}
        className="fixed top-0 left-0 right-0 bottom-0 right-0 h-full w-full"
      />
    </div>
  );
};

export default LineMap;
