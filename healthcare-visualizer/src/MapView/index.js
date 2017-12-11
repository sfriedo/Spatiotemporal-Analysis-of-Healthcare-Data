import React from 'react'
import { connect } from 'react-redux'

import L from 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from './../data/us-states';
import statesCodes from './../data/stateCodes';

import './styles.css';

const position = [37.8, -96];
const zoom = 4;

class MapView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { map: {}, data: {}, showedProp: 'density' };
    const self = this;

    const data = self.state.data;
    statesData.features.forEach(function (feature) {
      data[feature.properties.name] = { density: feature.properties.density, name: feature.properties.name };
    });
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
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (props) {
      let val;
      if (props && props[self.state.showedProp]) val = props[self.state.showedProp];
      else val = 'Value unknown';
      this._div.innerHTML = `<h4>${self.state.showedProp.toUpperCase()}</h4>` + (props ?
        '<b>' + props.name + '</b><br />' + (val)
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
        // grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        grades = [0, 1, 2, 5, 10, 20, 50, 80],
        labels = [],
        from, to;

      for (var i = 0; i < grades.length; i++) {
        from = `${grades[i]}%`;
        to = grades[i + 1] ? `${grades[i + 1]}%` : undefined;

        labels.push(
          '<i style="background:' + self.getColorScale((grades[i] + 1) / 100) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
    return legend;
  };

  getColorScale = (t) => {
    if (t !== 0 && !t) return '#FFF';

    return t > 0.8 ? '#800026' :
      t > 0.5 ? '#BD0026' :
        t > 0.2 ? '#E31A1C' :
          t > 0.1 ? '#FC4E2A' :
            t > 0.05 ? '#FD8D3C' :
              t > 0.02 ? '#FEB24C' :
                t > 0.01 ? '#FED976' :
                  '#FFEDA0';
  };

  // get color depending on population density value
  getColor = (d) => {
    function lerp(v0, v1, t) {
      // return (1 - t) * v0 + t * v1 = d
      return v0 - t * v0 + t * v1
    }

    const t = (d - this.state.minValue) / (this.state.maxValue - this.state.minValue);
    return this.getColorScale(t);

    // return d > 1000 ? '#800026' :
    //   d > 500 ? '#BD0026' :
    //     d > 200 ? '#E31A1C' :
    //       d > 100 ? '#FC4E2A' :
    //         d > 50 ? '#FD8D3C' :
    //           d > 20 ? '#FEB24C' :
    //             d > 10 ? '#FED976' :
    //               '#FFEDA0';
  };

  componentWillReceiveProps(nextProps) {
    const data = this.state.data;
    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;

    nextProps.states.forEach(function (obj) {
      data[statesCodes(obj.state)][nextProps.search] = obj.value;
      minValue = Math.min(obj.value, minValue);
      maxValue = Math.max(obj.value, maxValue);
    });

    this.setState({ data, showedProp: nextProps.search, maxValue, minValue });
  }

  render() {
    const geo = this.state.geojson;
    if (geo) {
      geo.eachLayer(function (l) {
        geo.resetStyle(l);
      });
      this.state.info.update();
    }

    return (
      <div id='map' style={{ height: "100vh" }}>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    states: state.api.states,
    search: state.api.search
  }
};

export default connect(mapStateToProps, {})(MapView);
