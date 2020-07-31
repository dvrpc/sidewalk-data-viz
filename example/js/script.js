/*********************************************/ 
/******************* Modal *******************/
/*********************************************/  
/*var modal = document.querySelector('#modal')
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
*/
/*********************************************/ 
/**************** Map ***************/
/*********************************************/ 


// create the latLngBounds object because google is annoying 
//var sw = {lat: -76.09405517578125, lng: 39.49211914385648}
//var ne = {lat: -74.32525634765625, lng: 40.614734298694216}
//var latLngBounds = new google.maps.LatLngBounds(sw, ne)

mapboxgl.accessToken = 'pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA'

var tiles = {
    'type': 'vector',
    'url': 'https://tiles.dvrpc.org/data/dvrpc-municipal.json'
}

var census = {
    'type': 'vector',
    'url': 'https://tiles.dvrpc.org/data/census_boundaries.json'
}

var crash = {
    'type': 'vector',
    'url': 'https://tiles.dvrpc.org/data/pev.json'
}

var map = new mapboxgl.Map({
    container: 'map',
  //  style: 'mapbox://styles/mapbox/light-v9',
    style: 'mapbox://styles/crvanpollard/ck5fpyqti0v971itf7edp2eyd',
    attributionControl: false,
    center: [-77.462261,40.949709 ],
    zoom: 6
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
    'id': 'municipality-fill',
    'type': 'fill',
    'source': tiles,
    'source-layer': 'municipalities',
    'layout': {},
    'paint': {
        'fill-opacity': 1
    }
  }, )
  map.addLayer({
    'id': 'municipality-outline',
    'type': 'line',
    'source': tiles,
    'source-layer': 'municipalities',
    'paint': {
        'line-width': 0.5,
        'line-color': '#141414'
    }
  })
  map.addLayer({
    'id': 'municipality-hover',
    'type': 'line',
    'source': tiles,
    'source-layer': 'municipalities',
    'paint': {
      'line-width': 2,
      'line-color': '#0074ad'
    },
    'filter': [
      '==',
      'geoid',
      ''
    ]
  })
 
 
//   let expression2 = ["match", ["get", "GEOID10"]]
//   csvPA.forEach(function(row) {
//       let data = row["FutPEV"],
//       color
//     if (data < 10) color = '#eff3ff'
//     else if (data >= 10 && data < 20) color = '#bdd7e7'
//     else if (data >=20 && data < 40) color = '#6baed6'
//     else if (data >= 40 && data < 80) color = '#3182bd'
//     else if (data >= 80 && data < 150) color ='#08519c'
//     else { color = '#08519c'; }
//     expression2.push(row['GEOID10'].toString(), color);
//   });
//  // Last value is the default, used where there is no data
//   expression2.push("rgba(0,0,0,0)");
//  // map.setPaintProperty('blocks-fill', 'fill-color', expression2)
//    map.addLayer({
//     'id': 'blocks-fill',
//     'type': 'fill',
//     'source': census,
//     'source-layer': 'blocks',
//     'layout': {},
//     'paint': {
//       'fill-color': expression2,
//       'fill-opacity': 1
//     }
//   }, )


  map.addLayer({
    'id': 'crash-point',
    'type': 'circle',
    'source': crash,
    'source-layer': 'pev',
    'paint': {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': {
      'base': 1.75,
      'stops': [[5, .75],[11, 2], [22, 180]]
      },
      // color circles by ethnicity, using a match expression
      // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
      'circle-color': [
      'match',
      ['get', 'TYPE'],
      'current',
      '#EA563D',
      'projected',
      '#3182D1',
    //  'NJ',
    //  '#e55e5e',
     // 2017,
     // '#3bb2d0',
      /* other */ '#ccc'
      ]
      },
       "filter": [
                    "==",
                    "REGION",
                    "PA"
            ],
                firstSymbolId
  })
/*
  let expression3 = ["match", ["get", "GEOID10"]]
  csvPA.forEach(function(row) {
      let data = row["FuPEV_SM"],
      color
    if (data < 56.98760) color = '#B6EDF0'
    else if (data >= 56.98760 && data < 163.153772) color = '#98D2ED'
    else if (data >=163.153772 && data < 328.378652) color = '#7CBBEB'
    else if (data >= 328.378652 && data < 602.083758) color = '#5CA3E6'
    else if (data >= 602.083758 && data < 1013.329840) color ='#368DE3'
    else if (data >= 1013.329840 && data < 1649.944320) color = '#2176D9'
    else if (data >=1649.944320 && data < 2692.761851) color = '#2259C7'
    else if (data >= 2692.761851 && data < 4469.331348) color = '#1D3EB5'
    else if (data >= 4469.331348 && data < 7515.466880) color ='#1727A3'
    else if (data >= 7515.466880 && data < 12267.415228) color ='#090991'
    else { color = '#08519c'; }
    expression3.push(row['GEOID10'].toString(), color);
  });
 // Last value is the default, used where there is no data
  expression3.push("rgba(0,0,0,0)");
 // map.setPaintProperty('blocks-fill', 'fill-color', expression2)
   map.addLayer({
    'id': 'FuPEV SM',
    'type': 'fill',
    'source': census,
    'source-layer': 'blocks',
    'layout': {},
    'paint': {
      'fill-color': expression3,
      'fill-opacity': 1
    }
  }, 
        firstSymbolId
 // "landcover_crop"
  )
  
  var popup = new mapboxgl.Popup({
    closebutton: false,
    closeOnClick: true
  })
  map.on('mousemove', 'municipality-fill', function(e){
    map.getCanvas().style.cursor = 'pointer'
    map.setFilter('municipality-hover', ['==', 'geoid', e.features[0].properties['geoid']])
    generatePopup(popup, e)
  })
  map.on('mouseleave', 'municipality-fill', function(e){
    map.getCanvas().style.cursor = ''
    map.setFilter('municipality-hover', ['==', 'geoid', ''])
    popup.remove()
  })
*/
  //map.on('click', 'municipality-fill', function(e){
  //  getReport(e)
 // })

 let expression = ["match", ["get", "geoid"]]
  csvData.forEach(function(row) {
      let data = row["EMIACRE"],
      color
    if (data < 10) color = '#1a9850'
    else if (data >= 10 && data < 20) color = '#91cf60'
    else if (data >=20 && data < 40) color = '#d9ef8b'
    else if (data >= 40 && data < 80) color = '#fee08b'
    else if (data >= 80 && data < 150) color ='#fc8d59'
    else { color = '#d73027'; }
    expression.push(row['geoid'].toString(), color);
  });
  // Last value is the default, used where there is no data
  expression.push("rgba(0,0,0,0)");
  map.setPaintProperty('municipality-fill', 'fill-color', expression)
 
})

//function getReport(e) {
//  window.open('mcdDetail.aspx?mcdcode='+e.features[0].properties['geoid']);
//}