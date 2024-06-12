import React from 'react'
import DeckGl, { FlyToInterpolator } from "deck.gl";
import Map from "react-map-gl";
import { IconLayer } from '@deck.gl/layers';
import { RealTimeContext } from "../../context/RealTimeContext"

const RealTimeMap = () => {
    const { state: animalState } = React.useContext(RealTimeContext)
    console.log(animalState.location)

    const animalData = animalState.RealTimeData.map((objt) => {
        const data2 = animalState.color.find(objt2 => objt2.id === objt.animal_TagId);

        const date = new Date(objt.animal_birthDay);
        const formattedDate = date.toISOString().split('T')[0];
        const birthDate = new Date(formattedDate);
        const currentDate = new Date();

        // Calculate the difference in milliseconds between the two dates
        const timeDifference = currentDate - birthDate;

        // Convert milliseconds to years
        const ageInMilliseconds = new Date(timeDifference);
        const age = Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);

        return data2 ? { id: objt.animal_TagId, name: objt.animal_name, battery: objt.animalLocations[0].device_status, birthday: formattedDate, animal_sex: objt.animal_sex, age: age, data: objt.animalLocations[0].animal_location, color: data2.color } : null;
    })

    const layer = new IconLayer ({
        id: 'IconLayer',
        data: animalData,
        getColor: (d) => d.color,
        getIcon: (d) => 'marker',
        getPosition: (d) => [d.data.coordinates[0], d.data.coordinates[1]],
        getSize: 40,
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
        pickable: true
    });
    const [viewport, setViewport] = React.useState({
        longitude: 0,
        latitude: 0,
        zoom: 3,
    });

    React.useEffect(() => {
        if (animalState.location) {
            // Update map viewport to focus on the selected location
            setViewport({
                longitude: animalState.location[1],
                latitude: animalState.location[0],
                zoom: 14, // Adjust zoom level as needed
                transitionDuration: 2000, // Optional: Adjust transition duration
                transitionInterpolator: new FlyToInterpolator(), // Optional: Add fly interpolator
            });
        }
    }, [animalState.location]);
    
    return (
        <div className='fixed left-0'>
            <DeckGl
                initialViewState={viewport}
                controller={true}
                style={{
                    height: "calc(100vh - 48px)",
                    width: "calc(100vw)",
                    position: "relative",
                }}
              layers={[layer]}
                getTooltip={({ object }) => object && object.name}
            >
                <Map
                    mapboxAccessToken="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ"
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                ></Map>
            </DeckGl>
        </div>
    )
}

export default RealTimeMap
