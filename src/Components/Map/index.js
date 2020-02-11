import React, { useState } from 'react';
import MapGL from 'react-map-gl';
import tokens from '../../tokens.json'

const MapView = () => {
    const [viewPort, setViewPort] = useState({
        // just for prototyping purposes, change initial coords later
        latitude: 59.33258,
        longitude: 18.0649,
        zoom: 5,
        bearing: 0,
        pitch: 0
    })
    return (
        <MapGL
        {...viewPort}
        width="100wv"
        height="100vh"
        onViewportChange = {setViewPort}
        mapboxApiAccessToken = {tokens["mapbox"]}
        />
    )
}

export default MapView