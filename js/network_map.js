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
  // "url": "http://0.0.0.0:8080/data/tiles.json"
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
    center: [-75.163603, 39.952406],
    zoom: 10
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {


  map.loadImage(
    // 'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
    '../images/transit-stop-icon.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('bus-icon', image);
    }
  );


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
    'minzoom': 9,
    'paint': {
      'circle-radius': 4,
      'circle-color': {
        "property": "walk_time",
        "stops": [
          [0, "rgba(8,104,172,0.7)"],
          [5, "rgba(67,162,202,0.7)"],
          [10, "rgba(123,204,196,0.7)"],
          [20, "rgba(168,221,181,0.7)"],
          [30, "rgba(204,235,197,0.7)"],
          [60, "rgba(240,249,232,0.7)"],
          [180, "rgba(215,25,28,0.7)"]
        ]
      }
    },
  })

  // ADJUST SW NODE RADIUS BY ZOOM LEVEL
  map.setPaintProperty('sw_nodes', 'circle-radius', [
    'interpolate',
    ['linear'],
    ['zoom'],
    12, 1.5,
    18, 12
    ]
  );

    // ADD TRANSIT STOPS
    map.addLayer({
      'id': 'transit_stops',
      'type': 'symbol',
      'source': analysis_data,
      'source-layer': 'transit_stops',
      'minzoom': 14,
      'layout': {
        'icon-image': 'bus-icon',
        'icon-size': 0.02,
        'icon-rotate': 180,
      }
    })



  function generatePopup(popup, e){
    var props = e.features[0].properties;
    if (props.walk_time < 180)
      msg = "<h1><code>"+ props.walk_time.toFixed(1) +" minutes</code></h1><p>to the nearest transit stop by foot</p>"
    else
      {msg = "<h1><code>🚷</code></h1><p>No transit stops are accessible solely via the sidewalk network</p>"}
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
