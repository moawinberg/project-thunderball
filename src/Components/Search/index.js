import "mapbox-gl/dist/mapbox-gl.css"
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"
import React, { Component, useState } from 'react'
import MapGL, {NavigationControl, GeolocateControl} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import tokens from '../../tokens.json';

class SearchableMap extends Component {
  state = { 
    viewport :{
    	latitude: 59.33258,
    	longitude: 18.0649,
    	zoom: 5,
    	bearing: 0,
        pitch: 0
    },
  }

  mapRef = React.createRef()

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }


  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    this.setState({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
    })
  }

    render(){
      const { viewport } = this.state
      return (
        <div style={{ height: '100vh'}}>
          <MapGL 
            ref={this.mapRef}
            {...viewport}
    		width="100wv"
        	height="100vh"
            onViewportChange={this.handleViewportChange}
            mapboxApiAccessToken = {tokens["mapbox"]}
            >
              <Geocoder 
                mapRef={this.mapRef}
                onResult={this.handleOnResult}
                onViewportChange={this.handleGeocoderViewportChange}
                mapboxApiAccessToken = {tokens["mapbox"]}
                position='top-left'
              />
             <div style={{"position": "absolute", "right": "0"}}>
                <NavigationControl/>
                <GeolocateControl
                positionOptions={{enableHighAccuracy: true}}
                trackUserLocation={true}
                />
            </div>
            </MapGL>
        </div>
      )
    }
}

export default SearchableMap;