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
  "url": "http://0.0.0.0:8080/data/ridescoreanalysis.json"
  // "url": "https://tiles.dvrpc.org/data/ped-analysis.json"
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

var sw_filter = ["all", ['==', 'schema', 'rs_sw']];
var osm_filter = ["all", ['==', 'schema', 'rs_osm']];

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

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
    ]
  })
    // ADD OSM ISOCHRONES
    map.addLayer({
      'id': 'iso_osm',
      'type': 'fill',
      'source': analysis_data,
      'source-layer': 'isos',
      'paint': {
        'fill-color': 'rgba(255, 255, 255, 0.5)',
        'fill-opacity': 0,
      },
      'filter': osm_filter,
    })

    // ADD SW ISOCHRONES
    map.addLayer({
      'id': 'iso_sw',
      'type': 'fill',
      'source': analysis_data,
      'source-layer': 'isos',
      'paint': {
        'fill-color': 'rgba(0, 255, 0, 0.5)',
        'fill-opacity': 0,
      },
      'filter': sw_filter,
    })
  


  // ADD CROSSWALKS AS THICK WHITE LINE
  map.addLayer({
    'id': 'crosswalks',
    'type': 'line',
    'source': sidewalks,
    'source-layer': 'ped_lines',
    "minzoom": 14,
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


  // ADD RAIL STATIONS
  map.addLayer({
    'id': 'stations',
    'type': 'circle',
    'source': analysis_data,
    'source-layer': 'stations',
    'minzoom': 9,
    'paint': {
      'circle-radius': 12,
      'circle-stroke-color': 'white',
      'circle-stroke-width': 1.5,
      'circle-color': {
        "property": "sidewalkscore",
        "default": "black",
        "stops": [
          [0, "rgba(255, 0, 0, 1)"],
          [0.7, "rgba(255, 255, 0, 1)"],
          [1, "rgba(0, 153, 0, 1)"],
          [2, "rgba(0, 153, 0, 1)"]
        ],
      }
    },
  })


  // ADD SELECTED RAIL STATIONS
  map.addLayer({
    'id': 'station_selected',
    'type': 'circle',
    'source': analysis_data,
    'source-layer': 'stations',
    'minzoom': 9,
    'paint': {
      'circle-radius': 20,
      'circle-stroke-color': 'black',
      'circle-stroke-width': 4,
      'circle-color': {
        "property": "sidewalkscore",
        "default": "black",
        "stops": [
          [0, "rgba(255, 0, 0, 1)"],
          [0.7, "rgba(255, 255, 0, 1)"],
          [1, "rgba(0, 153, 0, 1)"],
          [2, "rgba(0, 153, 0, 1)"]
        ],
      },
      'circle-opacity': 0,
      'circle-stroke-opacity': 0,
    },
  })

  // ADJUST RAIL STATION RADIUS BY ZOOM LEVEL
  map.setPaintProperty('stations', 'circle-radius', [
    'interpolate',
    ['linear'],
    ['zoom'],
    12, 5,
    18, 20
    ]
  );

  // ADJUST RAIL STATION RADIUS BY ZOOM LEVEL
  map.setPaintProperty('station_selected', 'circle-radius', [
    'interpolate',
    ['linear'],
    ['zoom'],
    12, 9,
    18, 30
    ]
  );



  function generatePopup(popup, e){
    var props = e.features[0].properties;
    if (props.sidewalkscore == null)
      msg = "<h3>"+ props.operator + " : " + props.station + "</h3><p>No sidewalk score was calculated since the point did not snap to either the OSM or sidewalk networks</p>"
    else if (props.sidewalkscore == 0)
      msg = "<h3>"+ props.operator + " : " + props.station + "</h3><p>This point did not snap to the sidewalk network</p>"

    else
      msg = "<h3>" + props.operator + " : " + props.station + "</h3><p>Sidewalk score: " + props.sidewalkscore.toFixed(3) + "</p>"
    popup.setLngLat(e.lngLat)
    .setHTML(msg)
    .addTo(map)
  }

  var popup = new mapboxgl.Popup({
    closebutton: false,
    closeOnClick: true
  })
  map.on('mousemove', 'stations', function(e){
    generatePopup(popup, e);
  })

  map.on('mouseleave', 'stations', function(e){
    popup.remove();
  })

  map.on('click', 'stations', function(e){
    var props = e.features[0].properties;

    var id_filter = ['in', 'dvrpc_id', props.dvrpc_id.toString()];

    map.setFilter('iso_sw', ['all', id_filter, sw_filter]);
    map.setPaintProperty('iso_sw', 'fill-opacity', 0.7); 

    map.setFilter('iso_osm', ['all', id_filter, osm_filter]);
    map.setPaintProperty('iso_osm', 'fill-opacity', 0.7); 

    map.setFilter('station_selected', ['in', 'dvrpc_id', props.dvrpc_id]);
    map.setPaintProperty('station_selected', 'circle-opacity', 1); 
    map.setPaintProperty('station_selected', 'circle-stroke-opacity', 1); 

  });


})
