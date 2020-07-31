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

// var census = {
//     'type': 'vector',
//     'url': 'https://tiles.dvrpc.org/data/census_boundaries.json'
// }

// var crash = {
//     'type': 'vector',
//     'url': 'https://tiles.dvrpc.org/data/pev.json'
// }

var map = new mapboxgl.Map({
    container: 'map',
   style: 'mapbox://styles/mapbox/dark-v10',
    // style: 'mapbox://styles/aarondvrpc/ckcw41n8v12761jpejubwq6da',
    attributionControl: false,
    center: [-74.790027, 40.077928],
    zoom: 10
});

function generatePopup(popup, e){
  var props = e.features[0].properties
  popup.setLngLat(e.lngLat)
  .setHTML("<p>"+props.name+"</p><hr /><p>"+props.cty+" County</p>")
  .addTo(map)
}

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
    'filter': [
      '==',
      'dvrpc',
      'Yes'
    ]
  })


  // ADD SIDEWALK SEGMENTS AS DASHED-WHITE
  map.addLayer({
    'id': 'sidewalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 13,
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
      13, 0.8,
      15, 2.5
      ]
    );
  // ADD CENTERLINES
  map.addLayer({
    'id': 'nj_centerlines',
    'type': 'line',
    'source': analysis_data,
    'source-layer': 'nj_centerlines',
    'paint': {
      'line-width': 4,
      'line-color': '#CD6155'
    },
    'filter': ['!=', 'seg_guid', "{131D6750-1708-11E3-B5F2-0062151309FF}"],
  })

  // ADJUST CENTERLINE WIDTH BY ZOOM LEVEL
  map.setPaintProperty('nj_centerlines', 'line-width', [
    'interpolate',
    ['exponential', 0.5],
    ['zoom'],
    13, 1.5,
    22, 12
    ]
  );

  // ADD CROSSWALKS AS THICK WHITE LINE
  map.addLayer({
    'id': 'crosswalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 13,
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

    // ADJUST SIDEWALK WIDTH BY ZOOM LEVEL
    map.setPaintProperty('crosswalks', 'line-width', [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      13, 4,
      15, 5
      ]
    );


  // COLOR THE CENTERLINES BY THE SW_COVERAGE VALUE
  let expression = ["match", ["get", "seg_guid"]]
  centerline_classification_data.forEach(function(row) {
    let data = row["sw_coverage"],
    color
      if (data == 0) color = 'rgba(215,25,28,0.7)'
      else if (data > 0 && data < 0.4) color = 'rgba(253,174,97,0.7)'
      else if (data >=0.4 && data < 0.8) color = 'rgba(255,255,191,0.7)'
      else if (data >= 0.8 && data < 1) color = 'rgba(166,217,106,0.7)'
      else { color = 'rgba(26,150,65,0.7)'; 
  }
    expression.push(row['seg_guid'], color);
  });
  // Last value is the default, used where there is no data
  expression.push("rgba(0,0,0,0)");
  map.setPaintProperty('nj_centerlines', 'line-color', expression)

})
