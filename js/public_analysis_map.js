mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25kdnJwYyIsImEiOiJja2NvN2s5dnAwaWR2MnptbzFwYmd2czVvIn0.Fcc34gzGME_zHR5q4RnSOg'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    attributionControl: false,
    center: [-75.163603, 39.952406],
    zoom: 10
});

var sw_filter = ["all", ['==', 'schema', 'rs_sw']];
var osm_filter = ["all", ['==', 'schema', 'rs_osm']];

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

    // --- RideScore analysis tiles ---
    map.addSource('ridescore_analysis', {
        type: "vector",
        url: "https://tiles.dvrpc.org/data/ridescoreanalysis.json"
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


    // ADD OSM ISOCHRONES
    map.addLayer({
        'id': 'iso_osm',
        'type': 'fill',
        'source': 'ridescore_analysis',
        'source-layer': 'isos',
        'paint': {
          'fill-color': 'rgba(255, 255, 255, 0.5)',
          'fill-opacity': 0,
        },
        'filter': osm_filter,
        'layout': {'visibility': 'none'},
      });
  
    // ADD SW ISOCHRONES
    map.addLayer({
        'id': 'iso_sw',
        'type': 'fill',
        'source': 'ridescore_analysis',
        'source-layer': 'isos',
        'paint': {
            'fill-color': 'rgba(0, 255, 0, 0.5)',
            'fill-opacity': 0,
        },
        'filter': sw_filter,
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
            10, 0.001,
            17, 0.5 
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


    // ADD RAIL STATIONS
    map.addLayer({
        'id': 'stations',
        'type': 'circle',
        'source': 'ridescore_analysis',
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
        'layout': {'visibility': 'none'},
    })

    // ADD SELECTED RAIL STATIONS
    map.addLayer({
        'id': 'station_selected',
        'type': 'circle',
        'source': 'ridescore_analysis',
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
        'layout': {'visibility': 'none'},
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

    // Popup for Ridescore analysis
    function generateRailWalkshedPopup(popup, e){
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

      map.on('mousemove', 'stations', function(e){
        generateRailWalkshedPopup(popup, e);
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

        
        // Zoom!
        // map.setCenter(map.getCenter());
        // map.setZoom(15);
        map.flyTo({
            center: e.lngLat,
            zoom: 13,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

      });

});


// Switch between analyses
// -----------------------

var rail_walkshed_layers = ["station_selected", "stations", "iso_osm", "iso_sw"];
var rail_names = ["Selected Rail Station", "Rail Stations", "1-mile Walkshed (Centerline)", "1-mile Walkshed (Sidewalk)"];

var nearest_transit_stop_layers = ["transit_stops", "sw_nodes"];
var transit_names = ["Transit Stops", "Walk Time"];

var segment_layers = ["centerlines"];
var segment_names = ["Street Centerlines"];


function turnOffLayersAndRemoveButtons(list_of_ids){
    var layer_buttons = document.getElementById("layer-buttons");

    for (i = 0; i < list_of_ids.length; i++) {
        layer_id = list_of_ids[i];

        // Remove button if it exists
        var btn = document.getElementById(layer_id);
        if (btn){
            layer_buttons.removeChild(btn);
        };

        // Set the vector layer visibility to none
        map.setLayoutProperty(layer_id, 'visibility', 'none');
    };    
};

function turnOnLayersAndAddButtons(list_of_ids, list_of_nice_names){

    var layer_buttons = document.getElementById("layer-buttons");

    for (i = 0; i < list_of_ids.length; i++) {
        layer_id = list_of_ids[i];
        nice_name = list_of_nice_names[i];

        // Add button if it doesn't exist
        var btn_exists = document.getElementById(layer_id);
        if (! btn_exists){
            var btn = document.createElement("button");
            btn.textContent = nice_name;
            btn.id = layer_id;
            btn.setAttribute("onclick", "toggleLayer(this.id)");
            btn.classList.add("btn", "btn-sm", "btn-secondary", "lyr-btn");
            layer_buttons.prepend(btn);
        };

        // Set the vector layer visibility to none
        map.setLayoutProperty(layer_id, 'visibility', 'none');

        // Turn the mapbox layer on
        map.setLayoutProperty(layer_id, 'visibility', 'visible');
    };   
}

function toggleAnalysis(btn_id) {

    if (btn_id == "gap-analysis"){
        // set up the GAP analysis view
        var other_ids = ["transit-analysis", "rail-walksheds"];


        // Remove buttons and layers from other analyses
        turnOffLayersAndRemoveButtons(rail_walkshed_layers);
        turnOffLayersAndRemoveButtons(nearest_transit_stop_layers);

        // Add button and turn this layer on
        turnOnLayersAndAddButtons(segment_layers, segment_names);

        // Update the legend image
        document.getElementById("legend-image").setAttribute("src", "../images/Webmap Legend v2_segment map.png")

    } else if (btn_id == "transit-analysis") {

        // set up the TRANSIT analysis view

        var other_ids = ["gap-analysis", "rail-walksheds"];

        // Remove buttons and layers from other analyses
        turnOffLayersAndRemoveButtons(rail_walkshed_layers);
        turnOffLayersAndRemoveButtons(segment_layers);

        // Add button and turn this layer on
        turnOnLayersAndAddButtons(nearest_transit_stop_layers, transit_names);


        // Update the legend image
        document.getElementById("legend-image").setAttribute("src", "../images/Webmap Legend v2_network map.png")

    } else if (btn_id == "rail-walksheds") {
        var other_ids = ["transit-analysis", "gap-analysis"];

        // Remove buttons and layers from other analyses
        turnOffLayersAndRemoveButtons(segment_layers);
        turnOffLayersAndRemoveButtons(nearest_transit_stop_layers);

        // Add button and turn this layer on
        turnOnLayersAndAddButtons(rail_walkshed_layers, rail_names);


    };

    document.getElementById(btn_id).classList.add('active');

    for (i = 0; i < other_ids.length; i++) {
        other_id = other_ids[i];
        document.getElementById(other_id).classList.remove('active');
    };
    
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
