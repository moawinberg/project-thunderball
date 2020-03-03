import React, { useEffect } from 'react';
import './App.css';
import MapView from './Components/Map'
import useFetch from './lib/use-fetch';
import create_polygons from './lib/form-polygons'
import { range } from './lib/create_range';
import tokens from './tokens.json'
import Timeline from './Components/Timeline'
// import logo from './logo.svg';
// import * as qs from 'querystring'

const BASE_URL = "https://api.greenlytics.io/weather/v1";
const REFERENCE_TIME = '2020-02-25 00';

const bounds = { ne: { lon: 37, lat: 70 }, sw: { lon: 2, lat: 52 } }

const coords = { lon: range(bounds.sw.lon, bounds.ne.lon, 0.5), lat: range(bounds.sw.lat, bounds.ne.lat,0.5) }


function App() {
  const [fetch, isLoading, data, error] = useFetch();
  const [polygons, setPolygons] = React.useState();

  useEffect(() => {
    const endpoint_url = "/get_nwp?query_params="
    const params = {
      'model': 'DWD_ICON-EU',
      'start_date': '2019-08-15 00',
      'end_date': '2019-08-16 00',
      'coords': { 'latitude': coords.lat, 'longitude': coords.lon, 'height': [59, 60] },
      'variables': ['T', 'U', 'V']
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
      setPolygons(create_polygons(data['data_vars'], coords.lon, coords.lat, 0, 0, 0))
    }
  }, [data, isLoading, error])

  return (
    <div className="App">
      <Timeline />
      {polygons ? (<MapView polygons={polygons} />) : (<h3>Loading map..</h3>)}
    </div>
  );
}

export default App;
