mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25kdnJwYyIsImEiOiJja2NvN2s5dnAwaWR2MnptbzFwYmd2czVvIn0.Fcc34gzGME_zHR5q4RnSOg'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    attributionControl: false,
    center: [-75.163603, 39.952406],
    zoom: 10
});

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


map.on('load', function () {
    // Sidewalk Inventory source
    map.addSource('sidewalk_inventory', {
        type: 'vector',
        url: "https://tiles.dvrpc.org/data/pedestrian-network.json"
    });
    // Sidewalk LINES
    map.addLayer({
        'id': 'sidewalks',
        'type': 'line',
        'source': 'sidewalk_inventory',
        'layout': {
            // make layer visible by default
            'visibility': 'visible'
        },
        'paint': {
            'line-width': 1.2,
            'line-color': 'rgba(255,255,255,0.7)',
        },
        'source-layer': 'ped_lines',
        'filter': [
            '==',
            'line_type',
            1
          ]      
    });
    // --- CROSSWALKS ---
    // --- add layer  ---
    map.addLayer({
        'id': 'crosswalks',
        'type': 'line',
        'source': 'sidewalk_inventory',
        'layout': {
            // make layer visible by default
            'visibility': 'visible'
        },
        'minzoom': 13,
        'paint': {
            'line-width': 4,
            'line-color': 'rgba(255,255,255,0.7)',
            // "line-dasharray": [1, 0.5]
        },
        'source-layer': 'ped_lines',
        'filter': [
            '==',
            'line_type',
            2
          ]
    });
    // --- adjust width by zoom level ---
    map.setPaintProperty('crosswalks', 'line-width', [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            15, 2,
            18, 12 
        ]
    );
    

// add source and layer for contours
map.addSource('contours', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-terrain-v2'
    });
    map.addLayer({
        'id': 'contours',
        'type': 'line',
        'source': 'contours',
        'source-layer': 'contour',
        'layout': {
            // make layer visible by default
            'visibility': 'visible',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#877b59',
            'line-width': 1
        }
    });
});
     
// enumerate ids of the layers
var toggleableLayerIds = ['contours', 'sidewalks', 'crosswalks'];
     
// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];
        
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;
        
    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        
        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
        
        // toggle layer visibility by changing the layout object's visibility property
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };
        
    var layers = document.getElementById('menu');
    layers.appendChild(link);
}