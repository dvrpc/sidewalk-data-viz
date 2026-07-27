import { Popup } from 'mapbox-gl';

const gtfsTitleMap = {
  septa_bus: 'SEPTA Bus',
  septa_rail: 'SEPTA Rail',
  njt_bus: 'NJT Bus',
  njt_rail: 'NJT Rail',
  patco: 'PATCO',
};

function createPopUp(currentFeature, map, layer, coordinates) {
  const popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
  // var popup = new mapboxgl.Popup({ closeOnClick: false })
  let html = '';
  const props = currentFeature.properties;

  if (layer === 'rail-stations') {
    const title = props.gtfs === 'septa_bus' ? 'SEPTA Rail' : gtfsTitleMap[props.gtfs];
    html += `<h3>${title}</h3>`;
    html += `<h4>${JSON.parse(props.route_names).join(', ')}</h4>`;
  } else if (layer === 'bus-stops') {
    html += `<h3>${gtfsTitleMap[props.gtfs]}</h3>`;
    let routes = JSON.parse(props.routes);
    if (routes.length === 0) {
      routes = JSON.parse(props.route_names);
    }
    html += `<h4>${routes.join(', ')}</h4>`;
  } else if (layer === 'hover-fill') {
    html += `<span>Block Group: ${props.geoid}</span><br/>`;
    html += `<span style="font-size: 13px">${props.mun1}</span>`;
  } else {
    html += `<h3>${props.type.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())}</h3>`;
    html += `<h4>${props.name}</h4>`;
  }
  new Popup({ closeButton: false, closeOnClick: false })
    .setLngLat(coordinates ? coordinates : currentFeature.geometry.coordinates)
    .setHTML(html)
    .addTo(map);
}

export { createPopUp };
