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

  map.addLayer({
    'id': 'county-outline',
    'type': 'line',
    'source': tiles,
    'source-layer': 'county',
    'paint': {
      'line-width': 2.5,
      'line-color': '#141414'
    },
    'filter': [
      '==',
      'dvrpc',
      'Yes'
    ]
  })

  map.addLayer({
    'id': 'sidewalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 12,
    'paint': {
      'line-width': 0.8,
      'line-color': 'rgba(255,255,255,0.7)',
      "line-dasharray": [5, 1]
    },
    'filter': [
      '==',
      'line_type',
      1
    ]
  })



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



  map.setPaintProperty('nj_centerlines', 'line-width', [
    'interpolate',
    ['exponential', 0.5],
    ['zoom'],
    15, 1.5,
    22, 15
    ]
  );


  map.addLayer({
    'id': 'crosswalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 12,
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

  // map.addLayer({
  //   'id': 'municipality-fill',
  //   'type': 'fill',
  //   'source': tiles,
  //   'source-layer': 'municipalities',
  //   'layout': {},
  //   'paint': {
  //       'fill-opacity': 1
  //   }
  // }, )
  // map.addLayer({
  //   'id': 'municipality-outline',
  //   'type': 'line',
  //   'source': tiles,
  //   'source-layer': 'municipalities',
  //   'paint': {
  //       'line-width': 0.5,
  //       'line-color': '#141414'
  //   }
  // })
  // map.addLayer({
  //   'id': 'municipality-hover',
  //   'type': 'line',
  //   'source': tiles,
  //   'source-layer': 'municipalities',
  //   'paint': {
  //     'line-width': 2,
  //     'line-color': '#0074ad'
  //   },
  //   'filter': [
  //     '==',
  //     'geoid',
  //     ''
  //   ]
  // })

  // map.addLayer({
  //   'id': 'crash-point',
  //   'type': 'circle',
  //   'source': crash,
  //   'source-layer': 'pev',
  //   'paint': {
  //     // make circles larger as the user zooms from z12 to z22
  //     'circle-radius': {
  //     'base': 1.75,
  //     'stops': [[5, .75],[11, 2], [22, 180]]
  //     },
  //     // color circles by ethnicity, using a match expression
  //     // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
  //     'circle-color': [
  //     'match',
  //     ['get', 'TYPE'],
  //     'current',
  //     '#EA563D',
  //     'projected',
  //     '#3182D1',
  //   //  'NJ',
  //   //  '#e55e5e',
  //    // 2017,
  //    // '#3bb2d0',
  //     /* other */ '#ccc'
  //     ]
  //     },
  //      "filter": [
  //                   "==",
  //                   "REGION",
  //                   "PA"
  //           ],
  //               firstSymbolId
  // })

  
//   var popup = new mapboxgl.Popup({
//     closebutton: false,
//     closeOnClick: true
//   })
//   map.on('mousemove', 'municipality-fill', function(e){
//     map.getCanvas().style.cursor = 'pointer'
//     map.setFilter('municipality-hover', ['==', 'geoid', e.features[0].properties['geoid']])
//     generatePopup(popup, e)
//   })
//   map.on('mouseleave', 'municipality-fill', function(e){
//     map.getCanvas().style.cursor = ''
//     map.setFilter('municipality-hover', ['==', 'geoid', ''])
//     popup.remove()
//   })
//   //map.on('click', 'municipality-fill', function(e){
//   //  getReport(e)
//  // })

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
