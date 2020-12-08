mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25kdnJwYyIsImEiOiJja2NvN2s5dnAwaWR2MnptbzFwYmd2czVvIn0.Fcc34gzGME_zHR5q4RnSOg'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    attributionControl: false,
    center: [-75.163603, 39.952406],
    zoom: 10
});

map.on('load', function () {

    // --- LOAD VECTOR TILE SOURCES ---

    // --- DVRPC Sidewalk Inventory ---
    map.addSource('sidewalk_inventory', {
        type: 'vector',
        url: "https://tiles.dvrpc.org/data/pedestrian-network.json"
    });

    // --- OSM Centerlines with 'sw_ratio' ---
    map.addSource('osm_centerlines', {
        type: 'vector',
        // url: "http://0.0.0.0:8080/data/tiles.json",
        url: "https://tiles.dvrpc.org/data/ped-analysis.json"
    });

    // --- DVRPC region boundaries ---
    map.addSource('regional_boundaries', {
        type: "vector",
        url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json"
    });

    // --- OSM CENTERLINES ---
    //      --- add layer ---
    map.addLayer({
        'id': 'centerlines',
        'type': 'line',
        'source': 'osm_centerlines',
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
        },
        'layout': {
            // make layer visible by default
            'visibility': 'visible'
        },
    });
    //      --- adjust width by zoom level ---
    map.setPaintProperty('centerlines', 'line-width', [
        'interpolate',
        ['exponential', 0.5],
        ['zoom'],
        9, 0.2,
        15, 4,
        22, 22
        ]
    );

    // --- SIDEWALK LINES ---
    //      --- add layer ---
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
    //      --- adjust width by zoom level ---
    map.setPaintProperty('sidewalks', 'line-width', [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            10, 0.1,
            15, 1.2 
        ]
    );

    // --- CROSSWALKS ---
    //      --- add layer  ---
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
    //      --- adjust width by zoom level ---
    map.setPaintProperty('crosswalks', 'line-width', [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            15, 2,
            18, 12 
        ]
    );
});


// Switch between analyses
// -----------------------
function toggleAnalysis(btn_id) {

    const layer_buttons = document.getElementById("layer-buttons");
    var cl_btn_exists = document.getElementById("centerlines");

    if (btn_id == "gap-analysis"){
        // set up the GAP analysis view
        other_id = "transit-analysis";


        // Add the centerline button if it doesn't exist yet
        if (! cl_btn_exists){
            var btn_centerline = document.createElement("button");
            btn_centerline.setAttribute("onclick", "toggleLayer(this.id)");
            btn_centerline.textContent = "Centerlines";
            btn_centerline.id = "centerlines";
            btn_centerline.classList.add("btn", "btn-sm", "btn-secondary", "lyr-btn");
            layer_buttons.appendChild(btn_centerline);
    
        }

    } else if (btn_id == "transit-analysis") {
        // set up the TRANSIT analysis view
        other_id = "gap-analysis" 
    }

    document.getElementById(btn_id).classList.replace('btn-light', 'btn-primary')
    document.getElementById(other_id).classList.replace('btn-primary', 'btn-light')
}


// Turn a single layer on or off
// -----------------------------
function toggleLayer(layer_id) {
    var visibility = map.getLayoutProperty(layer_id, 'visibility');

    if (visibility === 'visible') {
        // turn layer off and set Class to light outline
        map.setLayoutProperty(layer_id, 'visibility', 'none');
        document.getElementById(layer_id).classList.replace('btn-secondary', 'btn-outline-light')
    } else {
        // turn layer on and set class to filled 'secondary' color
        map.setLayoutProperty(layer_id, 'visibility', 'visible');
        document.getElementById(layer_id).classList.replace('btn-outline-light', 'btn-secondary')
    }
}
