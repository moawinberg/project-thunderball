import "mapbox-gl/dist/mapbox-gl.css"
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"
import React, { useState, useEffect } from 'react';
import MapGL, { NavigationControl, Source, Layer, GeolocateControl } from 'react-map-gl';
import tokens from '../../tokens.json'
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocoder from "react-map-gl-geocoder";
import create_polygons, { roundToQuarter } from '../../lib/form-polygons'
import { dataLayer } from './mapstyle'

const MapView = ({ polygons }) => {
  const mapRef = React.useRef();
  const [polys, setPolys] = useState();

  const boundSW = [2.250475, 52.500440]; //longitude, latitude TWEAK THESE FOR BETTER BOUNDS
  const boundNE = [37.848053, 70.740996];

  const [viewPort, setViewPort] = useState({
    // just for prototyping purposes, change initial coords later
    latitude: 59.33258,
    longitude: 18.0649,
    zoom: 5,
    bearing: 0,
    pitch: 0
  });

  const setBounds = (viewPort) => {
    if (viewPort.longitude > boundNE[0]) {
      viewPort.longitude = boundNE[0];
    }
    if (viewPort.longitude < boundSW[0]) {
      viewPort.longitude = boundSW[0];
    }
    if (viewPort.latitude > boundNE[1]) {
      viewPort.latitude = boundNE[1];
    }
    if (viewPort.latitude < boundSW[1]) {
      viewPort.latitude = boundSW[1];
    }

    setViewPort(viewPort);
  }

  // update map bounds when viewport changes
  useEffect(() => {
    if (mapRef) {
      // // find coordinates of edges of map
      // const bounds = mapRef.current.getMap().getBounds();

      // // use coordinate edges to filter data
      // const geo = create_polygons(bounds._ne, bounds._sw, "aaaa")
      // setPolys(geo);

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

  const handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return setViewPort({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  return (
    <MapGL
      {...viewPort}
      width="100wv"
      height="100vh"
      onViewportChange={setBounds}
      mapboxApiAccessToken={tokens["mapbox"]}
      ref={mapRef}>
      {
        polygons && (
          <Source type="geojson" data={polygons}>
            <Layer {...dataLayer} />
          </Source>
        )
      }
      <div style={{ "position": "absolute", "right": "0" }}>
        <NavigationControl />
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={tokens["mapbox"]}
          position='top-left'
        />
      </div>
    </MapGL>
  )
}

export default MapView;