mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25kdnJwYyIsImEiOiJja2NvN2s5dnAwaWR2MnptbzFwYmd2czVvIn0.Fcc34gzGME_zHR5q4RnSOg'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    attributionControl: false,
    center: [-75.163603, 39.952406],
    zoom: 10
});

map.on('load', function () {

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
    
    // disable map rotation using right click + drag
    map.dragRotate.disable();
    
    // disable map rotation using touch rotation gesture
    // map.touchZoomRotate.disableRotation();
    
    // --- LOAD VECTOR TILE SOURCES ---

    // --- DVRPC Sidewalk Inventory ---
    map.addSource('sidewalk_inventory', {
        type: 'vector',
        url: "https://tiles.dvrpc.org/data/pedestrian-network.json"
    });

    // --- OSM Centerlines with 'sw_ratio' ---
    map.addSource('ped_analysis', {
        type: 'vector',
        // url: "http://0.0.0.0:8080/data/tiles.json",
        url: "https://tiles.dvrpc.org/data/ped-analysis.json"
    });

    // --- DVRPC region boundaries ---
    map.addSource('regional_boundaries', {
        type: "vector",
        url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json"
    });

    // --- LOAD ICON FOR TRANSIT STOPS ---
    map.loadImage(
        '../images/transit-stop-icon.png',
        function (error, image) {
          if (error) throw error;
          map.addImage('bus-icon', image);
        }
    );

    // --- REGIONAL COUNTIES ---
    map.addLayer({
        'id': 'county-outline',
        'type': 'line',
        'source': 'regional_boundaries',
        'source-layer': 'county',
        'paint': {
          'line-width': 4.5,
          'line-color': 'rgba(0,255,255,0.7)'
        },
        'filter': ["all", ['==', 'dvrpc', 'Yes'],
        ],
        'layout': {'visibility': 'none'},
    });

    // --- MUNICIPALITIES ---
    map.addLayer({
        'id': 'municipalities',
        'type': 'line',
        'source': 'regional_boundaries',
        'source-layer': 'municipalities',
        'paint': {
        'line-width': 5.5,
        'line-color': 'rgba(0,0,0,0.3)'
        },
        'layout': {'visibility': 'none'},
    });

    // --- OSM CENTERLINES ---
    //      --- add layer ---
    map.addLayer({
        'id': 'centerlines',
        'type': 'line',
        'source': 'ped_analysis',
        'source-layer': 'nj_centerlines',
        'minzoom': 9,
        'paint': {
            'line-width': 4,
            "line-color": [
                "case",
                ["<", ["get", "sw"], 0.45], "rgba(215,25,28,0.7)",
                ["<=", ["get", "sw"], 0.82], "rgba(253,174,97,0.7)",
                "rgba(26,150,65,0.3)"
            ]
            // 'line-color': {
            //     "property": "sw",
            //     "stops": [
            //         [0, "rgba(215,25,28,0.7)"],
            //         [0.00001, "rgba(253,174,97,0.7)"],
            //         [0.4, "rgba(255,255,191,0.7)"],
            //         [0.8, "rgba(26,150,65,0.3)"]
            //         ]
            //     }
        },
        'layout': {'visibility': 'visible'},
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
            'line-color': 'rgba(255,255,255,0.5)',
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
            15, 1 
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
            'line-color': 'rgba(255,255,255,0.5)',
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

    // TRANSIT WALK TIME by node
    map.addLayer({
        'id': 'sw_nodes',
        'type': 'circle',
        'source': 'ped_analysis',
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
        'layout': {'visibility': 'none'},
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
      'source': 'ped_analysis',
      'source-layer': 'transit_stops',
      'minzoom': 13,
      'layout': {
        'icon-image': 'bus-icon',
        'icon-size': 0.018,
        'icon-rotate': 180,
        'visibility': 'none',
      },
    })

    // Make a popoup for the sidewalk nodes
    function generateNodePopup(popup, e){
        var props = e.features[0].properties;
        if (props.walk_time < 180) {
            msg = "<h3><code>"+ props.walk_time.toFixed(1) +" minutes</code></h3><p>to the nearest transit stop by foot</p>"
        } else {
            msg = "<h1><code>🚷</code></h1><p>No transit stops are accessible solely via the sidewalk network</p>"
        }
        popup.setLngLat(e.lngLat)
        .setHTML(msg)
        .addTo(map)
    }
    
    var popup = new mapboxgl.Popup({
        closebutton: false,
        closeOnClick: true
    })
    map.on('mousemove', 'sw_nodes', function(e){
        generateNodePopup(popup, e)
    })
    map.on('mouseleave', 'sw_nodes', function(e){
        popup.remove()
    })

    // Make a popup for the segment layer
    function generateSegmentPopup(popup, e){
        var props = e.features[0].properties;
        var sw_val = props.sw * 100;
        if (sw_val > 100) { sw_val = 100; };
        if (sw_val == 100) {
            var sw_txt = "100%";
        } else if (sw_val == 0) {
            var sw_txt = "No";
        } else {
            var sw_txt = String(sw_val.toFixed(1)) + "%"
        };
        msg = "<h3>"+ sw_txt +"</h3><p>sidewalk coverage</p>"
        popup.setLngLat(e.lngLat)
        .setHTML(msg)
        .addTo(map)
    }
    map.on('mousemove', 'centerlines', function(e){
        generateSegmentPopup(popup, e)
    })
    map.on('mouseleave', 'centerlines', function(e){
        popup.remove()
    })
});


// Switch between analyses
// -----------------------
function toggleAnalysis(btn_id) {

    const layer_buttons = document.getElementById("layer-buttons");
    var cl_btn_exists = document.getElementById("centerlines");
    var sw_btn_exists = document.getElementById("sw_nodes");
    var transit_stop_btn_exists = document.getElementById("transit_stops");

    if (btn_id == "gap-analysis"){
        // set up the GAP analysis view
        var other_id = "transit-analysis";


        // Add the centerline button if it doesn't exist yet
        if (! cl_btn_exists){
            var btn_centerline = document.createElement("button");
            btn_centerline.setAttribute("onclick", "toggleLayer(this.id)");
            btn_centerline.textContent = "Centerlines";
            btn_centerline.id = "centerlines";
            btn_centerline.classList.add("btn", "btn-sm", "btn-secondary", "lyr-btn");
            layer_buttons.prepend(btn_centerline);
        }

        if (sw_btn_exists){
            layer_buttons.removeChild(sw_btn_exists);
        }

        if (transit_stop_btn_exists){
            layer_buttons.removeChild(transit_stop_btn_exists);
        }

        // Turn off the sw_nodes and transit_stops layer
        map.setLayoutProperty('sw_nodes', 'visibility', 'none');
        map.setLayoutProperty('transit_stops', 'visibility', 'none');


        // Turn on the centerline layer
        map.setLayoutProperty('centerlines', 'visibility', 'visible');

        // Update the legend image
        document.getElementById("legend-image").setAttribute("src", "../images/Webmap Legend v2_segment map.png")

    } else if (btn_id == "transit-analysis") {
        // set up the TRANSIT analysis view
        var other_id = "gap-analysis";

        if (! transit_stop_btn_exists){
            var btn = document.createElement("button");
            btn.setAttribute("onclick", "toggleLayer(this.id)");
            btn.textContent = "Transit Stops";
            btn.id = "transit_stops";
            btn.classList.add("btn", "btn-sm", "btn-secondary", "lyr-btn");
            layer_buttons.prepend(btn);
        }

        if (! sw_btn_exists){
            var btn = document.createElement("button");
            btn.setAttribute("onclick", "toggleLayer(this.id)");
            btn.textContent = "Walk Time";
            btn.id = "sw_nodes";
            btn.classList.add("btn", "btn-sm", "btn-secondary", "lyr-btn");
            layer_buttons.prepend(btn);
        }

        // Remove the centerline button if it exists
        if (cl_btn_exists){
            layer_buttons.removeChild(cl_btn_exists);
        }
        // Turn off the centerline layer
        map.setLayoutProperty('centerlines', 'visibility', 'none');

        // Turn on the sw_nodes and transit_stops layer
        map.setLayoutProperty('sw_nodes', 'visibility', 'visible');
        map.setLayoutProperty('transit_stops', 'visibility', 'visible');

        // Update the legend image
        document.getElementById("legend-image").setAttribute("src", "../images/Webmap Legend v2_network map.png")

    };

    document.getElementById(btn_id).classList.add('active')
    document.getElementById(other_id).classList.remove('active')
}


// Turn a single layer on or off
// -----------------------------
function toggleLayer(layer_id) {
    var visibility = map.getLayoutProperty(layer_id, 'visibility');

    if (visibility === 'visible') {
        // turn layer off and set Class to light outline
        map.setLayoutProperty(layer_id, 'visibility', 'none');
        document.getElementById(layer_id).classList.replace('btn-secondary', 'btn-outline-secondary')
    } else {
        // turn layer on and set class to filled 'secondary' color
        map.setLayoutProperty(layer_id, 'visibility', 'visible');
        document.getElementById(layer_id).classList.replace('btn-outline-secondary', 'btn-secondary')
    }
}
