import React from 'react'
import DeckGl from "deck.gl";
import Map from "react-map-gl";

const RealTimeMap = () => {
   
    return (
        <div className='fixed left-0'>
            <DeckGl
                initialViewState={{
                    longitude: 0,
                    latitude: 0,
                    zoom: 3,
                }}
                controller={true}
                style={{
                    height: "calc(100vh - 48px)",
                    width: "calc(100vw)",
                    position: "relative",
                }}
            //   layers={state ? [layer] : []}
            // layers={[filteredPathLayers, filteredScatterplotLayers]}
            // layers={[filteredPathLayers]}
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
