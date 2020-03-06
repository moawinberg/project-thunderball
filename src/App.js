import React, { useEffect } from 'react';
import './App.css';
import MapView from './Components/Map'
import useFetch from './lib/use-fetch';
import create_polygons from './lib/form-polygons'
import { range } from './lib/create_range';
import tokens from './tokens.json'
// import logo from './logo.svg';
// import * as qs from 'querystring'

const BASE_URL = "https://api.greenlytics.io/weather/v1";
const REFERENCE_TIME = '2020-03-06';

const bounds = { ne: { lon: 37, lat: 70 }, sw: { lon: 2, lat: 52 } }

const coords = { lon: range(bounds.sw.lon, bounds.ne.lon, 0.5), lat: range(bounds.sw.lat, bounds.ne.lat,0.5) }


function App() {
  const [fetch, isLoading, data, error] = useFetch();
  const [polygons, setPolygons] = React.useState();
  const [forecastTimes, setForecastTimes] = React.useState();
  const [validTime, setValidTime] = React.useState(0);
  const [validTimes, setValidTimes] = React.useState();

  useEffect(() => {
    const endpoint_url = "/get_nwp?query_params="
    const params = {
      'model': 'DWD_ICON-EU',
      'start_date': '2020-03-06 00',
      'end_date': '2020-03-07 00',
      'freq': '3H',
      'coords': { 'latitude': coords.lat, 'longitude': coords.lon, 'height': [60] },
      'variables': ['T', 'U', 'V']
    }

    const options = {
      headers: {
        "Authorization": tokens["greenlytics"]
      },
    }

    //console.log(params)
    fetch(BASE_URL + endpoint_url + JSON.stringify(params), options)
  }, [])

  useEffect(() => {
    if (!isLoading && data !== null && error === null) {
      setPolygons(create_polygons(data['data_vars'], coords.lon, coords.lat, validTime, 0, 0))
      setForecastTimes(data.coords['reference_time'].data)
      setValidTimes(data.coords['valid_time'].data)
    }
  }, [data, isLoading, error])

  useEffect(() => {
    if(data){
    //console.log(data)
    //console.log('should redefine polygons')
    setPolygons(create_polygons(data['data_vars'], coords.lon, coords.lat, validTime,0,0))}
  }, [validTime])

  const createTime = hrs => {
    const d = new Date(Date.parse(REFERENCE_TIME))
    //console.log(d.getHours)
    d.setHours(d.getHours() + hrs)
    //console.log(d)
    return d
  }

  const createDropdown = validTimes => {
    return (<select
    onChange={opt => setValidTime(opt.target.value)}>
      {validTimes.map(el => (<option value={el} key={el}>{ createTime(el).toLocaleTimeString()}</option>))}
    </select>)
  }

  return (
    <div className="App">
      {(polygons&&validTimes) ? (<MapView polygons={polygons} DropDown={createDropdown(validTimes)} />) : (<h3>Loading map..</h3>)}
    </div>
  );
}

export default App;
