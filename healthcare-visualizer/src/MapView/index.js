import React from 'react'
import './styles.css';

import L from 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css'
import statesData from './../data/us-states'

const position = [37.8, -96];
const zoom = 4;
export default class MapView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { map: {}, data: {}, showedProp: 'density' }
    const self = this;

    const data = self.state.data;
    statesData.features.forEach(function (feature) {
      data[feature.properties.name] = { density: feature.properties.density, name: feature.properties.name };
    });
    console.log(this.state.data);
  }

  componentDidMount() {
    this.buildMap();
  }

  buildMap = () => {
    const map = L.map('map').setView(position, zoom);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmplbm53YXJlIiwiYSI6ImNqYXU0N3duMzF5NjYzM3FrZm1xdnF1anoifQ.5jKVpaLhq7h09xil58yEMQ', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
    }).addTo(map);

    const info = this.addInfoBox(map);
    const geojson = this.addGeoJson(map);
    const legend = this.addLegend(map);
    this.setState({ map, info, geojson, legend });
  };

  addInfoBox = (map) => {
    // control that shows state info on hover
    const info = L.control();
    const self = this;

    info.onAdd = function (map) {
      console.log(map);
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (props) {
      console.log(props);
      this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props[self.state.showedProp] + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
    };

    info.addTo(map);
    return info;
  };

  addGeoJson = (map, info) => {
    const self = this;

    const geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
    this.setState({ geojson });

    function style(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: self.getColor(self.state.data[feature.properties.name][self.state.showedProp])
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      self.state.info.update(self.state.data[layer.feature.properties.name]);
    }

    function resetHighlight(e) {
      self.state.geojson.resetStyle(e.target);
      self.state.info.update();
    }

    function zoomToFeature(e) {
      self.state.map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on('mouseover', highlightFeature);
      layer.on('mouseout', resetHighlight);
      layer.on('click', zoomToFeature);
    }

    map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
    return geojson;
  };

  addLegend = (map) => {
    const self = this;
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from, to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' + self.getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
    return legend;
  };

  // get color depending on population density value
  getColor = (d) => {
    return d > 1000 ? '#800026' :
      d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
          d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 10 ? '#FED976' :
                  '#FFEDA0';
  };

  render() {
    return (
      <div id='map' style={{ height: "100vh" }}>
      </div>
    )
  }
}
