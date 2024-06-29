import React from "react";
import DeckGl, { FlyToInterpolator } from "deck.gl";
import Map from "react-map-gl";
import { IconLayer, PathLayer } from "@deck.gl/layers";
import { useAreaContext } from "../../../hooks/useAreaContext";
import { useRealTimeContext } from "../../../hooks/useRealTimeContext";
import turf from "turf";
import * as nearest  from "@turf/turf"
const RealTimeMap = () => {
  const Area = useAreaContext();
  const realTimeData = useRealTimeContext();
  const [animalData, setAnimalData] = React.useState([]);
  const [insideGeofence, setInsideGeofence] = React.useState([]);
  const [outsideGeofence, setOutsideGeofence] = React.useState([]);
  const [distances, setDistances] = React.useState({});
  const [layers1, setLayers1] = React.useState(null);
  const [layers2, setLayers2] = React.useState(null);


  const[leftsideBar, setLeftSideBar] = React.useState(false)



  React.useEffect(() => {
    const inside = [];
    const outside = [];
     const updatedDistances = {};

    animalData.forEach((animal) => {
      if (animal) {
        let coords = [animal.data.coordinates[0], animal.data.coordinates[1]];
        let point = turf.point(coords);

        let buffered =
          Area.zone_geojson && turf.buffer(Area.zone_geojson, 200, "feet");
        let merge = buffered && turf.merge(buffered);
        let isInside = merge && turf.inside(point, merge);

        if (isInside) {
          inside.push({ name: animal.name, color: animal.color });
        } else {
          outside.push({ name: animal.name, color: animal.color });
        }

        // Calculate the nearest point and distance from the geofence boundary
        if (Area.zone_geojson) {
          // console.log(Area.zone_geojson.features[0].geometry.coordinates[0]);
          var line = nearest.lineString(
            Area.zone_geojson.features[0].geometry.coordinates[0]
          );
          // console.log(line);

          let nearestPoint = nearest.nearestPointOnLine(line, point, {
            units: "kilometers",
          });
          let distance = nearest.distance(point, nearestPoint, {
            units: "kilometers",
          });

          updatedDistances[animal.name] = distance;
        }
      }
    });

    setInsideGeofence(inside);
    setOutsideGeofence(outside);
    setDistances(updatedDistances);
  }, [animalData, Area.zone_geojson]);


   React.useEffect(() => {
     if (realTimeData.state.RealTimeData.length !== 0) {
       const updatedAnimalData = realTimeData.state.RealTimeData.map((objt) => {
         const data2 = realTimeData.state.color.find(
           (objt2) => objt2.id === objt.animal_TagId
         );

         const date = new Date(objt.animal_birthDay);
         const formattedDate = date.toISOString().split("T")[0];
         const birthDate = new Date(formattedDate);
         const currentDate = new Date();

         const timeDifference = currentDate - birthDate;
         const ageInMilliseconds = new Date(timeDifference);
         const age = Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);

         return data2
           ? {
               id: objt.animal_TagId,
               name: objt.animal_name,
               battery: objt.animalLocations[0].device_status,
               birthday: formattedDate,
               animal_sex: objt.animal_sex,
               age: age,
               data: objt.animalLocations[0].animal_location,
               color: data2.color,
             }
           : null;
       });

       setAnimalData(updatedAnimalData);
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [realTimeData.state.RealTimeData]);



  React.useEffect(() => {
    if (animalData.length !== 0) {
    }
    const iconLayer = new IconLayer({
      id: "IconLayer",
      data: animalData,
      getColor: (d) => d.color,
      getIcon: (d) => "marker",
      getPosition: (d) => [d.data.coordinates[0], d.data.coordinates[1]],
      getSize: 40,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json",
      pickable: true,
    });
    

    setLayers1(iconLayer);
  }, [animalData]);

  React.useEffect(()=>{
    if( Object.keys(Area.Area).length > 0){
      const area = [Area.Area];
      const pathLayer = new PathLayer({
        id: "PathLayer",
        data: area,
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
      setLayers2(pathLayer);
    }
    
  },[Area.Area])

  const [viewport, setViewport] = React.useState({
    longitude: 0,
    latitude: 0,
    zoom: 10.5,
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

  React.useEffect(() => {
    if (realTimeData.state.location) {
      // Update map viewport to focus on the selected location
      setViewport({
        longitude: realTimeData.state.location[1],
        latitude: realTimeData.state.location[0],
        zoom: 14, // Adjust zoom level as needed
        transitionDuration: 2000, // Optional: Adjust transition duration
        transitionInterpolator: new FlyToInterpolator(), // Optional: Add fly interpolator
      });
    }
  }, [realTimeData.state.location]);

  return (
    <div className="fixed left-0">
      <DeckGl
        initialViewState={viewport}
        controller={true}
        style={{
          height: "calc(100vh)",
          width: "calc(100vw)",
          position: "relative",
        }}
        layers={[layers1, layers2]}
        getTooltip={({ object }) => console.log(object)}
      >
        <Map
          mapboxAccessToken="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ"
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        ></Map>
      </DeckGl>
      <button
        className={
          !leftsideBar
            ? "absolute top-2 right-2 bg-white p-1"
            : "absolute top-2 right-96 bg-white p-1"
        }
        onClick={() => setLeftSideBar(!leftsideBar)}
      >
        <i className="fa fa-bars" />
      </button>
      {leftsideBar && (
        <>
          <div className="absolute inset-y-0 right-0 w-80 bg-white">
            <div className="ml-2 mt-2 flex flex-col">
              <h5 className="font-bold">Notification on Geofecing</h5>
              <div className="flex flex-col">
                <h5 className="font-bold text-orange-700">
                  Animals Inside the Zone
                </h5>
                {insideGeofence.length !== 0 ? (
                  <>
                    {insideGeofence.map((animal) => (
                      <div className="justify-between items-center w-full p-3.5 bg-gray-100 hover:bg-gray-300 rounded-lg  mt-2 border-2  border-transparent hover:border-orange-500">
                        <div key={animal.name} className="flex flex-col">
                          <div className="flex flex-row gap-2">
                            <div>
                              <div>{animal.name}</div>
                              <div>{distances[animal.name]?.toFixed(3)} Km inside the zone</div>

                            </div>
                            <div className="flex-grow"></div>
                            <div
                              className="w-12 h-12 rounded-none "
                              style={{
                                background: `rgb(${animal.color.join(",")})`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div>No Animal</div>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <h5 className="font-bold text-orange-700">
                  Animals Outside of the Zone
                </h5>
                {outsideGeofence.length !== 0 ? (
                  <>
                    {outsideGeofence.map((animal) => (
                      <div className="justify-between items-center w-full p-3.5 bg-gray-100 hover:bg-gray-300 rounded-lg  mt-2 border-2  border-transparent hover:border-orange-500">
                        <div key={animal.name} className="flex flex-col">
                          <div className="flex flex-row gap-2">
                            <div>
                              <div>{animal.name}</div>
                              <div>{distances[animal.name]?.toFixed(3)} Km out side the zone</div>
                            </div>
                            <div className="flex-grow"></div>
                            <div
                              className="w-12 h-12 rounded-none "
                              style={{
                                background: `rgb(${animal.color.join(",")})`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div>No Animal</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RealTimeMap;
