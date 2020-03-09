import React, { useEffect } from 'react';
import './App.css';
import './spinner.css';
import MapView from './Components/Map'
import useFetch from './lib/use-fetch';
import create_polygons from './lib/form-polygons'
import { range } from './lib/create_range';
import tokens from './tokens.json'
import Timeline from './Components/Timeline'
// import logo from './logo.svg';
// import * as qs from 'querystring'

const BASE_URL = "https://api.greenlytics.io/weather/v1";
const REFERENCE_TIME = '2020-03-06T00:00:00.000000000';
const END_TIME = '2020-03-07T00:00:00.000000000';
const bounds = { ne: { lon: 37, lat: 70 }, sw: { lon: 2, lat: 52 } }

const coords = { lon: range(bounds.sw.lon, bounds.ne.lon, 0.5), lat: range(bounds.sw.lat, bounds.ne.lat, 0.5) }


function App() {
  const [fetch, isLoading, data, error] = useFetch();
  const [polygons, setPolygons] = React.useState();
  const [forecastTimes, setForecastTimes] = React.useState();
  const [referenceTime, setReferenceTime] = React.useState(REFERENCE_TIME);
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

  // collect data items to timeline
  const dataItems = [{
    start: '2019-08-15 10',
    end: '2019-08-15 12'
  },
  {
    start: '2019-08-15 14',
    end: '2019-08-15 15'
  }];

  useEffect(() => {
    if (!isLoading && data !== null && error === null) {
      setForecastTimes(data.coords['reference_time'].data)
      setValidTimes(data.coords['valid_time'].data)
      setPolygons(create_polygons(data['data_vars'], coords.lon, coords.lat, validTime, 0, data.coords['reference_time'].data.indexOf(referenceTime)))
      
    }
  }, [data, isLoading, error])

  //show different valid times
  useEffect(() => {
    if (data) {
      //console.log(data)
      //console.log('should redefine polygons')
      setPolygons(create_polygons(data['data_vars'], coords.lon, coords.lat, validTime, 0, forecastTimes.indexOf(referenceTime)))
    }
  }, [validTime])

  //redraw polygons based when reference time changes
  useEffect(() => {
    if (data) {
      setPolygons(create_polygons(data['data_vars'], coords.lon, coords.lat, validTime, 0, forecastTimes.indexOf(referenceTime)))
    }
  }, [referenceTime])

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
      {validTimes.map(el => (<option value={el} key={el}>{createTime(el).toLocaleTimeString()}</option>))}
    </select>)
  }

  return (
    <div className="App">
      <div id="container" className="svg-container"></div>
      {
        polygons && validTimes ? (
          <div>
            <Timeline dataItems={dataItems} start={REFERENCE_TIME} end={END_TIME} refTimes={forecastTimes} updateRefTime={setReferenceTime}/>
            <MapView polygons={polygons} DropDown={createDropdown(validTimes)} />
          </div>
        ) :
          (
            <div className="center-content">
              <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
              </div>
            </div>
          )
      }
    </div>
  );
}

export default App;
