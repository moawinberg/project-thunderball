import React, { useState, useEffect } from 'react';
import MapGL, { NavigationControl, Source, Layer } from 'react-map-gl';
import tokens from '../../tokens.json'
import create_polygons, { roundToQuarter } from '../../lib/form-polygons'
import { dataLayer } from './mapstyle'

const MapView = () => {
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
            // find coordinates of edges of map
            const bounds = mapRef.current.getMap().getBounds();
        
            // use coordinate edges to filter data
            const geo = create_polygons(bounds._ne, bounds._sw, "aaaa")
            //console.log(polys)
            setPolys(geo);

        }
    }, [mapRef, viewPort])

    const dataLayer = {
        id: 'data',
        type: 'fill',
        paint: {
            'fill-color': {
              property: 'airPressure',
              stops: [
                [1000, '#3288bd'],
                [1100, '#66c2a5'],
                
              ]
            },
            'fill-opacity': 0.5
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
            {polys && (<Source type="geojson" data={polys}>
                <Layer {...dataLayer} />
            </Source>)}
            <div style={{ "position": "absolute", "right": "0" }}>
                <NavigationControl />
            </div>
        </MapGL>
    )
}

export default MapView