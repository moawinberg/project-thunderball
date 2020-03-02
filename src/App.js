import React, { useEffect, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import MapView from './Components/Map'
import useFetch from './lib/use-fetch';
import * as qs from 'querystring'
import create_polygons, { roundToQuarter } from './lib/form-polygons'
import {range} from './lib/create_range';
import tokens from './tokens.json'

const BASE_URL = "https://api.greenlytics.io/weather/v1";
const REFERENCE_TIME = '2020-02-25 00';

const bounds = {ne:{lon: 37, lat: 70}, sw: {lon:2, lat:52}}

const coords = {lon:range(bounds.sw.lon, bounds.ne.lon), lat: range(bounds.sw.lat, bounds.ne.lat)}
console.log(coords)

function App() {
  const [fetch, isLoading, data, error] = useFetch();
  const [polygons, setPolygons] = React.useState();

  useEffect(() => {
    const endpoint_url = "/get_nwp?query_params="
    const params = {
      'model': 'DWD_ICON-EU',
    'start_date': '2019-08-15 00',
    'end_date': '2019-08-16 00',
    'coords': {'latitude': coords.lat, 'longitude': coords.lon, 'height': [59,60]},
    'variables': ['T']
    }

    const options = {
      headers: {
        "Authorization": tokens["greenlytics"]
      },
    }

    console.log(params)
    fetch(endpoint_url + JSON.stringify(params), options)
  }, [])

  useEffect(() => {
    if (!isLoading && data !== null && error === null) {
      setPolygons(create_polygons(data['data_vars']['T']['data'],coords.lon, coords.lat, 0, 0, 0))
    }
  }, [data, isLoading, error])

  return (
    <div className="App">
<<<<<<< HEAD

      {polygons ? (<MapView polygons={polygons}/>) : (<h3>Loading map..</h3>)}
=======
    	<SearchableMap />
      <MapView />
>>>>>>> Add Search and geoLocate
    </div>

  );
}

export default App;
