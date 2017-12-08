import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapView from './MapView'
import SearchInterface from './SearchInterface';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchInterface styles={{position:'absolute'}}/>
        <MapView/>
      </div>
    );
  }
}

export default App;
