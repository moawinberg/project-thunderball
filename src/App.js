import React, { useEffect, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import MapView from './Components/Map'
import Timeline from './Components/Timeline'

function App() {
  

  return (
    <div className="App">
      <Timeline />
      <MapView />
    </div>

  );
}

export default App;
