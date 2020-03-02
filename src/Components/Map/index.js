import React, { useState, useEffect } from 'react';
import MapGL, { NavigationControl, Source, Layer } from 'react-map-gl';
import tokens from '../../tokens.json'
import create_polygons, { roundToQuarter } from '../../lib/form-polygons'
import { dataLayer } from './mapstyle'

const MapView = ({polygons}) => {
    const mapRef = React.useRef();
    const [polys, setPolys] = useState();
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
         

        }
    }, [mapRef, viewPort])

    const dataLayer = {
        id: 'data',
        type: 'fill',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'airPressure'],
                273,
                '#03f4fc',
                300,
                '#fc0703'
                ],
            'fill-opacity': 0.5,
          }
    }

    return (
        <MapGL
            {...viewPort}
            width="100wv"
            height="100vh"
            onViewportChange={setViewPort}
            mapboxApiAccessToken={tokens["mapbox"]}
            ref={mapRef}
        >
            {polygons && (<Source type="geojson" data={polygons}>
                <Layer {...dataLayer} />
            </Source>)}
            <div style={{ "position": "absolute", "right": "0" }}>
                <NavigationControl />
            </div>
        </MapGL>
    )
}

export default MapView