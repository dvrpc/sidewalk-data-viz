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

var centerlines = {
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
    attributionControl: false,
    // center: [-75.117988, 39.945437],
    center: [-75.163603, 39.952406],
    zoom: 10
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

  var layers = map.getStyle().layers;
  
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
  });
  // ADD CENTERLINES
  map.addLayer({
    'id': 'centerlines',
    'type': 'line',
    'source': centerlines,
    'source-layer': 'nj_centerlines',
    'minzoom': 9,
    'paint': {
      'line-width': 4,
      'line-color': {
        "property": "sw",
        "stops": [
          [0, "rgba(215,25,28,0.7)"],
          [0.00001, "rgba(253,174,97,0.7)"],
          [0.4, "rgba(255,255,191,0.7)"],
          [0.8, "rgba(26,150,65,0.3)"]
        ]
      }
    }
  });
  // ADJUST CENTERLINE WIDTH BY ZOOM LEVEL
  map.setPaintProperty('centerlines', 'line-width', [
    'interpolate',
    ['exponential', 0.5],
    ['zoom'],
    9, 0.2,
    15, 4,
    22, 22
    ]
  );
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
  });
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
  });
  // ADJUST SIDEWALK WIDTH BY ZOOM LEVEL
  map.setPaintProperty('sidewalks', 'line-width', [
    'interpolate',
    ['exponential', 0.5],
    ['zoom'],
    15, 1,
    17, 2.5
    ]
  );
  // HOVER + POPUP
  function generatePopup(popup, e){
    var props = e.features[0].properties;
    msg = "<h3>"+ props.sw.toFixed(3) +"</h3><p>SW len ➗ CL len ➗ 2</p>"
    popup.setLngLat(e.lngLat)
    .setHTML(msg)
    .addTo(map)
  }

  var popup = new mapboxgl.Popup({
    closebutton: false,
    closeOnClick: true
  })
  map.on('mousemove', 'centerlines', function(e){
    generatePopup(popup, e)
  })
  map.on('mouseleave', 'centerlines', function(e){
    popup.remove()
  })

})
