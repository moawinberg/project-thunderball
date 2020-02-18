import React, { useState, useEffect } from 'react';
import MapGL, {NavigationControl} from 'react-map-gl';
import tokens from '../../tokens.json'

const MapView = () => {
    const mapRef = React.useRef();
    const [viewPort, setViewPort] = useState({
        // just for prototyping purposes, change initial coords later
        latitude: 59.33258,
        longitude: 18.0649,
        zoom: 5,
        bearing: 0,
        pitch: 0
    });

    // update map bounds when viewport changes
    useEffect(() => {
        if (mapRef) {
            // find coordinates of edges of map
            const  bounds = mapRef.current.getMap().getBounds();
            // use coordinate edges to filter data
            console.log(bounds)
            
        }
    }, [mapRef, viewPort])

    return (
        <MapGL
        {...viewPort}
        width="100wv"
        height="100vh"
        onViewportChange = {setViewPort}
        mapboxApiAccessToken = {tokens["mapbox"]}
        ref={ mapRef}
        >
            <div style={{"position": "absolute", "right": "0"}}>
                <NavigationControl/>
            </div>
            </MapGL>
    )
}

export default MapView