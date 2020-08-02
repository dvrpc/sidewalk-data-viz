/*********************************************/ 
/******************* Modal *******************/
/*********************************************/  
var modal = document.querySelector('#modal')
var modalToggle = document.querySelector('#modal-toggle')
var close = document.querySelector('#close-modal')
// hide and add aria-hidden attribute
var ariaHideModal = function() {
  modal.style.display = 'none'
  modal.setAttribute('aria-hidden', 'true')
}
// reveal and remove aria-hidden attribute
var ariaShowModal = function() {
  modal.style.display = 'block'
  modal.setAttribute('aria-hidden', 'false')
}
// open the modal by clicking the div
modalToggle.onclick = function(){
  modal.style.display = 'none' ? ariaShowModal() : ariaHideModal()
}
// closing the modal options: by clicking the 'x' or anywhere outside of it or pressing the escape key
close.onclick = function(){ariaHideModal()}
window.onclick = function(event) {
    if (event.target == modal) {
      ariaHideModal()
    }
}
document.onkeydown = function(event) {
  // make sure the modal is open first
  if(modal.style.display === 'block'){
    // keyCode for th escape key
    if(event.keyCode === 27){
      ariaHideModal()
    }
  }
}

/*********************************************/ 
/**************** Map ***************/
/*********************************************/ 


// create the latLngBounds object because google is annoying 
//var sw = {lat: -76.09405517578125, lng: 39.49211914385648}
//var ne = {lat: -74.32525634765625, lng: 40.614734298694216}
//var latLngBounds = new google.maps.LatLngBounds(sw, ne)

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25kdnJwYyIsImEiOiJja2NvN2s5dnAwaWR2MnptbzFwYmd2czVvIn0.Fcc34gzGME_zHR5q4RnSOg'

var sidewalks = {
  "type": "vector",
  "url": "https://tiles.dvrpc.org/data/pedestrian-network.json"
}

var analysis_data = {
  "type": "vector",
  "url": "https://tiles.dvrpc.org/data/ped-analysis.json"
}

var tiles = {
    'type': 'vector',
    'url': 'https://tiles.dvrpc.org/data/dvrpc-municipal.json'
}

var map = new mapboxgl.Map({
    container: 'map',
   style: 'mapbox://styles/mapbox/dark-v10',
    // style: 'mapbox://styles/aarondvrpc/ckcw41n8v12761jpejubwq6da',
    attributionControl: false,
    center: [-75.117988, 39.945437],
    zoom: 15
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

  var layers = map.getStyle().layers;
  
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'line') {
      firstSymbolId = layers[i].id;
      break;
    }
  }



  // ADD OUTLINE OF COUNTIES IN BLACK
  map.addLayer({
    'id': 'county-outline',
    'type': 'line',
    'source': tiles,
    'source-layer': 'county',
    'paint': {
      'line-width': 2.5,
      'line-color': 'rgba(0,0,0,0.7)'
    },
    'filter': ["all", ['==', 'dvrpc', 'Yes'],
                      ['==', 'state', 'NJ']
    ]
  })


  // ADD CROSSWALKS AS THICK WHITE LINE
  map.addLayer({
    'id': 'crosswalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 15,
    'paint': {
      'line-width': 4,
      'line-color': 'rgba(255,255,255,0.7)'
    },
    'filter': [
      '==',
      'line_type',
      2
    ]
  })

    // ADJUST CROSSWALK WIDTH BY ZOOM LEVEL
    map.setPaintProperty('crosswalks', 'line-width', [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      15, 2,
      18, 7 
      ]
    );

  // ADD SIDEWALK SEGMENTS AS DASHED-WHITE
  map.addLayer({
    'id': 'sidewalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 14,
    'paint': {
      'line-width': 1.2,
      'line-color': 'rgba(255,255,255,0.7)',
      "line-dasharray": [5, 1]
    },
    'filter': [
      '==',
      'line_type',
      1
    ]
  })

    // ADJUST SIDEWALK WIDTH BY ZOOM LEVEL
    map.setPaintProperty('sidewalks', 'line-width', [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      15, 1,
      17, 2.5
      ]
    );

  // ADD SIDEWALK NODES
  map.addLayer({
    'id': 'sw_nodes',
    'type': 'circle',
    'source': analysis_data,
    'source-layer': 'nodes',
    'minzoom': 12,
    'paint': {
      'circle-radius': 4,
      'circle-color': 'rgba(0,255,0,0.7)',
      // 'circle-stroke-color': "rgba(0,0,0,0.7)",
      // 'circle-stroke-width': 2,
    },
  })

  // ADJUST SW NODE RADIUS BY ZOOM LEVEL
  map.setPaintProperty('sw_nodes', 'circle-radius', [
    'interpolate',
    ['linear'],
    ['zoom'],
    12, 2,
    16, 8
    ]
  );

  // COLOR THE CENTERLINES BY THE SW_COVERAGE VALUE
  let expression = ["match", ["get", "sw_node_id"]]
  network_data.forEach(function(row) {
    let data = row["school"],
    color
      if (data < 5 ) color = 'rgba(8,104,172,0.7)'
      else if (data >= 5 && data < 10) color = 'rgba(67,162,202,0.7)'
      else if (data >= 10 && data < 20) color = 'rgba(123,204,196,0.7)'
      else if (data >= 20 && data < 30) color = 'rgba(168,221,181,0.7)'
      else if (data >= 30 && data < 60) color = 'rgba(204,235,197,0.7)'
      else if (data >= 60 && data < 180) color = 'rgba(240,249,232,0.7)'
      else { color = 'rgba(215,25,28,0.7)'; 
    }
    expression.push(parseInt(row['node_id']), color);
    // console.log(data);
    // console.log(row["node_id"]);
  });
  // Last value is the default, used where there is no data
  expression.push("rgba(255,255,255,1)");
  map.setPaintProperty('sw_nodes', 'circle-color', expression);

  function generatePopup(popup, e){
    var props = e.features[0].properties;
    var found_node = network_data.find(element => element.node_id == props.sw_node_id);
    if (found_node.school < 180)
      msg = "<p>The nearest school is "+ found_node.school.toFixed(2) +" minutes away</p>"
    else
      {msg = "<p>No schools are accessible solely via the sidewalk network</p>"}
    popup.setLngLat(e.lngLat)
    .setHTML(msg)
    .addTo(map)
  }

  var popup = new mapboxgl.Popup({
    closebutton: false,
    closeOnClick: true
  })
  map.on('mousemove', 'sw_nodes', function(e){
    generatePopup(popup, e)
  })
  map.on('mouseleave', 'sw_nodes', function(e){
    popup.remove()
  })


})
