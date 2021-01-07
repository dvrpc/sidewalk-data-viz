mapboxgl.accessToken =
  "pk.eyJ1IjoiYWFyb25kdnJwYyIsImEiOiJja2NvN2s5dnAwaWR2MnptbzFwYmd2czVvIn0.Fcc34gzGME_zHR5q4RnSOg";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  attributionControl: false,
  center: [-75.163603, 39.952406],
  zoom: 10,
});

var sw_filter = ["all", ["==", "schema", "rs_sw"]];
var osm_filter = ["all", ["==", "schema", "rs_osm"]];

// Switch between analyses
// -----------------------

var rail_walkshed_layers = [
  "station_selected",
  "stations",
  "iso_osm",
  "iso_sw",
];
var rail_names = [
  "Selected Rail Station",
  "Rail Stations",
  "Street Centerline Walkshed (1-mile)",
  "Sidewalk Walkshed (1-mile)",
];

var nearest_transit_stop_layers = ["transit_stops", "sw_nodes"];
var transit_names = ["Transit Stops", "Walk Time"];

var segment_layers = ["centerlines"];
var segment_names = ["Street Centerlines"];

var island_layers = ["islands"];
var island_names = ["Islands of Connectivity"];

function turnOffLayersAndRemoveButtons(list_of_ids) {
  var layer_buttons = document.getElementById("layer-buttons");

  for (i = 0; i < list_of_ids.length; i++) {
    layer_id = list_of_ids[i];

    // Remove button if it exists
    var btn = document.getElementById(layer_id);
    if (btn) {
      layer_buttons.removeChild(btn);
    }

    // Set the vector layer visibility to none
    map.setLayoutProperty(layer_id, "visibility", "none");
  }
}

function turnOnLayersAndAddButtons(list_of_ids, list_of_nice_names) {
  var layer_buttons = document.getElementById("layer-buttons");

  for (i = 0; i < list_of_ids.length; i++) {
    layer_id = list_of_ids[i];
    nice_name = list_of_nice_names[i];

    // Add button if it doesn't exist
    var btn_exists = document.getElementById(layer_id);
    if (!btn_exists) {
      var btn = document.createElement("button");
      btn.textContent = nice_name;
      btn.id = layer_id;
      btn.setAttribute("onclick", "toggleLayer(this.id)");
      btn.classList.add("btn", "btn-sm", "btn-secondary", "lyr-btn");
      layer_buttons.prepend(btn);
    }

    // Set the vector layer visibility to none
    map.setLayoutProperty(layer_id, "visibility", "none");

    // Turn the mapbox layer on
    map.setLayoutProperty(layer_id, "visibility", "visible");
  }
}

var all_analysis_names = [
  "gap-analysis",
  "transit-analysis",
  "rail-walksheds",
  "island-analysis",
];

function updateLegendImage(image_path) {
  // Update the legend in the sidebar
  document.getElementById("legend-image").setAttribute("src", image_path);
}

function toggleAnalysis(btn_id) {
  // Get a list of the NON-SELECTED analyses
  var other_ids = all_analysis_names.filter(function (item) {
    return item !== btn_id;
  });

  if (btn_id == "gap-analysis") {
    turnOffLayersAndRemoveButtons(rail_walkshed_layers);
    turnOffLayersAndRemoveButtons(nearest_transit_stop_layers);
    turnOffLayersAndRemoveButtons(island_layers);

    turnOnLayersAndAddButtons(segment_layers, segment_names);
    updateLegendImage("img/Webmap-Legend-v2-segment-map.png");
  } else if (btn_id == "transit-analysis") {
    turnOffLayersAndRemoveButtons(rail_walkshed_layers);
    turnOffLayersAndRemoveButtons(segment_layers);
    turnOffLayersAndRemoveButtons(island_layers);

    turnOnLayersAndAddButtons(nearest_transit_stop_layers, transit_names);
    updateLegendImage("img/Webmap-Legend-v2-network-map.png");
  } else if (btn_id == "rail-walksheds") {
    turnOffLayersAndRemoveButtons(segment_layers);
    turnOffLayersAndRemoveButtons(nearest_transit_stop_layers);
    turnOffLayersAndRemoveButtons(island_layers);

    turnOnLayersAndAddButtons(rail_walkshed_layers, rail_names);
    updateLegendImage("img/Webmap-Legend-v2-rail-map.png");
  } else if (btn_id == "island-analysis") {
    // Remove buttons and layers from other analyses
    turnOffLayersAndRemoveButtons(segment_layers);
    turnOffLayersAndRemoveButtons(nearest_transit_stop_layers);
    turnOffLayersAndRemoveButtons(rail_walkshed_layers);

    turnOnLayersAndAddButtons(island_layers, island_names);
    updateLegendImage("img/Webmap-Legend-v2-island-map.png");
  }

  document.getElementById(btn_id).classList.add("active");

  for (i = 0; i < other_ids.length; i++) {
    other_id = other_ids[i];
    document.getElementById(other_id).classList.remove("active");

    var txt_id = other_id + "-description";
    var description = document.getElementById(txt_id);
    if (description) {
      description.classList.add("hidden-text");
    }
  }

  // Turn the description text on
  var description = document.getElementById(btn_id + "-description");
  description.classList.remove("hidden-text");
}

// Turn a single layer on or off
// -----------------------------
function toggleLayer(layer_id) {
  var visibility = map.getLayoutProperty(layer_id, "visibility");

  if (visibility === "visible") {
    // turn layer off and set Class to light outline
    map.setLayoutProperty(layer_id, "visibility", "none");
    document
      .getElementById(layer_id)
      .classList.replace("btn-secondary", "btn-outline-secondary");
  } else {
    // turn layer on and set class to filled 'secondary' color
    map.setLayoutProperty(layer_id, "visibility", "visible");
    document
      .getElementById(layer_id)
      .classList.replace("btn-outline-secondary", "btn-secondary");
  }
}

map.on("load", function () {
  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  // disable map rotation using right click + drag
  map.dragRotate.disable();

  var layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  // disable map rotation using touch rotation gesture
  // map.touchZoomRotate.disableRotation();

  // --- LOAD VECTOR TILE SOURCES ---

  // --- DVRPC Sidewalk Inventory ---
  map.addSource("sidewalk_inventory", {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/pedestrian-network.json",
  });

  // --- OSM Centerlines with 'sw_ratio' ---
  map.addSource("ped_analysis", {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/sidewalk-gaps-analysis.json",
    // url: "http://0.0.0.0:8080/data/sidewalk_gaps_analysis.json"
  });

  // --- RideScore analysis tiles ---
  map.addSource("ridescore_analysis", {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/ridescore-analysis.json",
  });

  // --- DVRPC region boundaries ---
  map.addSource("regional_boundaries", {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json",
  });

  // --- LOAD ICON FOR TRANSIT STOPS ---
  map.loadImage("../img/transit-stop-icon.png", function (error, image) {
    if (error) throw error;
    map.addImage("bus-icon", image);
  });

  // --- REGIONAL COUNTIES ---
  map.addLayer(
    {
      id: "county-outline",
      type: "line",
      source: "regional_boundaries",
      "source-layer": "county",
      paint: {
        "line-width": 4.5,
        "line-color": "rgba(0,255,255,0.7)",
      },
      filter: ["all", ["==", "dvrpc", "Yes"]],
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // --- MUNICIPALITIES ---
  map.addLayer(
    {
      id: "municipalities",
      type: "line",
      source: "regional_boundaries",
      "source-layer": "municipalities",
      paint: {
        "line-width": 5.5,
        "line-color": "rgba(0,0,0,0.3)",
      },
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // ADD OSM ISOCHRONES
  map.addLayer(
    {
      id: "iso_osm",
      type: "fill",
      source: "ridescore_analysis",
      "source-layer": "ridescore_isos",
      paint: {
        "fill-color": "rgba(255, 255, 255, 0.5)",
        "fill-opacity": 0,
      },
      filter: osm_filter,
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // ADD SW ISOCHRONES
  map.addLayer(
    {
      id: "iso_sw",
      type: "fill",
      source: "ridescore_analysis",
      "source-layer": "ridescore_isos",
      paint: {
        "fill-color": "rgba(0, 255, 0, 0.5)",
        "fill-opacity": 0,
      },
      filter: sw_filter,
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // --- OSM CENTERLINES ---
  //      --- add layer ---
  map.addLayer(
    {
      id: "centerlines",
      type: "line",
      source: "ped_analysis",
      "source-layer": "osm_sw_coverage",
      minzoom: 9,
      paint: {
        "line-width": 4,
        "line-color": [
          "case",
          ["<", ["get", "sw_ratio"], 0.45],
          "rgba(215,25,28,0.7)",
          ["<=", ["get", "sw_ratio"], 0.82],
          "rgba(253,174,97,0.7)",
          "rgba(26,150,65,0.3)",
        ],
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
      layout: { visibility: "visible" },
    },
    firstSymbolId
  );
  //      --- adjust width by zoom level ---
  map.setPaintProperty("centerlines", "line-width", [
    "interpolate",
    ["exponential", 0.5],
    ["zoom"],
    9,
    0.2,
    15,
    4,
    22,
    22,
  ]);

  // --- SIDEWALK LINES ---
  //      --- add layer ---
  map.addLayer(
    {
      id: "sidewalks",
      type: "line",
      source: "sidewalk_inventory",
      layout: {
        // make layer visible by default
        visibility: "visible",
      },
      paint: {
        "line-width": 1.2,
        "line-color": "rgba(255,255,255,0.5)",
      },
      "source-layer": "ped_lines",
      filter: ["==", "line_type", 1],
    },
    firstSymbolId
  );
  //      --- adjust width by zoom level ---
  map.setPaintProperty("sidewalks", "line-width", [
    "interpolate",
    ["exponential", 0.5],
    ["zoom"],
    10,
    0.001,
    17,
    0.5,
  ]);

  // --- CROSSWALKS ---
  //      --- add layer  ---
  map.addLayer(
    {
      id: "crosswalks",
      type: "line",
      source: "sidewalk_inventory",
      layout: {
        // make layer visible by default
        visibility: "visible",
      },
      minzoom: 13,
      paint: {
        "line-width": 4,
        "line-color": "rgba(255,255,255,0.5)",
        // "line-dasharray": [1, 0.5]
      },
      "source-layer": "ped_lines",
      filter: ["==", "line_type", 2],
    },
    firstSymbolId
  );
  //      --- adjust width by zoom level ---
  map.setPaintProperty("crosswalks", "line-width", [
    "interpolate",
    ["exponential", 0.5],
    ["zoom"],
    15,
    2,
    18,
    12,
  ]);

  // TRANSIT WALK TIME by node
  map.addLayer(
    {
      id: "sw_nodes",
      type: "circle",
      source: "ped_analysis",
      "source-layer": "sw_nodes",
      minzoom: 9,
      paint: {
        "circle-radius": 4,
        "circle-color": {
          property: "walk_time",
          stops: [
            [0, "rgba(8,104,172,0.7)"],
            [5, "rgba(67,162,202,0.7)"],
            [10, "rgba(123,204,196,0.7)"],
            [20, "rgba(168,221,181,0.7)"],
            [30, "rgba(204,235,197,0.7)"],
            [60, "rgba(240,249,232,0.7)"],
            [180, "rgba(215,25,28,0.7)"],
          ],
        },
      },
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // ADJUST SW NODE RADIUS BY ZOOM LEVEL
  map.setPaintProperty("sw_nodes", "circle-radius", [
    "interpolate",
    ["linear"],
    ["zoom"],
    12,
    1.5,
    18,
    12,
  ]);

  // ADD TRANSIT STOPS
  map.addLayer(
    {
      id: "transit_stops",
      type: "symbol",
      source: "ped_analysis",
      "source-layer": "transit_stops",
      minzoom: 13,
      layout: {
        "icon-image": "bus-icon",
        "icon-size": 0.018,
        "icon-rotate": 180,
        visibility: "none",
      },
    },
    firstSymbolId
  );

  // ADD RAIL STATIONS
  map.addLayer(
    {
      id: "stations",
      type: "circle",
      source: "ridescore_analysis",
      "source-layer": "sidewalkscore",
      minzoom: 9,
      paint: {
        "circle-radius": 12,
        "circle-stroke-color": "white",
        "circle-stroke-width": 1.5,
        "circle-color": {
          property: "sidewalkscore",
          default: "black",
          stops: [
            [0, "rgba(255, 0, 0, 1)"],
            [0.7, "rgba(255, 255, 0, 1)"],
            [1, "rgba(0, 153, 0, 1)"],
            [2, "rgba(0, 153, 0, 1)"],
          ],
        },
      },
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // ADD SELECTED RAIL STATIONS
  map.addLayer(
    {
      id: "station_selected",
      type: "circle",
      source: "ridescore_analysis",
      "source-layer": "sidewalkscore",
      minzoom: 9,
      paint: {
        "circle-radius": 20,
        "circle-stroke-color": "black",
        "circle-stroke-width": 4,
        "circle-color": {
          property: "sidewalkscore",
          default: "black",
          stops: [
            [0, "rgba(255, 0, 0, 1)"],
            [0.7, "rgba(255, 255, 0, 1)"],
            [1, "rgba(0, 153, 0, 1)"],
            [2, "rgba(0, 153, 0, 1)"],
          ],
        },
        "circle-opacity": 0,
        "circle-stroke-opacity": 0,
      },
      layout: { visibility: "none" },
    },
    firstSymbolId
  );

  // ADJUST RAIL STATION RADIUS BY ZOOM LEVEL
  map.setPaintProperty("stations", "circle-radius", [
    "interpolate",
    ["linear"],
    ["zoom"],
    12,
    5,
    18,
    20,
  ]);

  // ADJUST RAIL STATION RADIUS BY ZOOM LEVEL
  map.setPaintProperty("station_selected", "circle-radius", [
    "interpolate",
    ["linear"],
    ["zoom"],
    12,
    9,
    18,
    30,
  ]);

  // --- ISLANDS ---
  //      --- add layer ---
  map.addLayer(
    {
      id: "islands",
      type: "line",
      source: "ped_analysis",
      layout: { visibility: "none" },
      "source-layer": "islands",
      paint: {
        "line-color": ["get", "rgba"],
      },
    },
    firstSymbolId
  );
  //      --- adjust width by zoom level ---
  map.setPaintProperty("islands", "line-width", [
    "interpolate",
    ["exponential", 0.5],
    ["zoom"],
    10,
    0.75,
    17,
    2,
  ]);

  // Make a popoup for the sidewalk nodes
  function generateNodePopup(popup, e) {
    var props = e.features[0].properties;
    if (props.walk_time < 180) {
      msg =
        "<h3><code>" +
        props.walk_time.toFixed(1) +
        " minutes</code></h3><p>to the nearest transit stop by foot</p>";
    } else {
      msg =
        "<h1><code>🚷</code></h1><p>No transit stops are accessible solely via the sidewalk network</p>";
    }
    popup.setLngLat(e.lngLat).setHTML(msg).addTo(map);
  }

  var popup = new mapboxgl.Popup({
    closebutton: false,
    closeOnClick: true,
  });
  map.on("mousemove", "sw_nodes", function (e) {
    generateNodePopup(popup, e);
  });
  map.on("mouseleave", "sw_nodes", function (e) {
    popup.remove();
  });

  // Make a popup for the segment layer
  function generateSegmentPopup(popup, e) {
    var props = e.features[0].properties;
    var sw_val = props.sw_ratio * 100;
    if (sw_val > 100) {
      sw_val = 100;
    }
    if (sw_val == 100) {
      var sw_txt = "100%";
    } else if (sw_val == 0) {
      var sw_txt = "No";
    } else {
      var sw_txt = String(sw_val.toFixed(1)) + "%";
    }
    msg = "<h3>" + sw_txt + "</h3><p>sidewalk coverage</p>";
    popup.setLngLat(e.lngLat).setHTML(msg).addTo(map);
  }
  map.on("mousemove", "centerlines", function (e) {
    generateSegmentPopup(popup, e);
  });
  map.on("mouseleave", "centerlines", function (e) {
    popup.remove();
  });

  // Popup for Ridescore analysis
  function generateRailWalkshedPopup(popup, e) {
    var props = e.features[0].properties;
    if (props.sidewalkscore == null)
      msg =
        "<h3>" +
        props.operator +
        " : " +
        props.station +
        "</h3><p>No sidewalk score was calculated since the point did not snap to either the OSM or sidewalk networks</p>";
    else if (props.sidewalkscore == 0)
      msg =
        "<h3>" +
        props.operator +
        " : " +
        props.station +
        "</h3><p>This point did not snap to the sidewalk network</p>";
    else
      msg =
        "<h3>" +
        props.operator +
        " : " +
        props.station +
        "</h3><p>Sidewalk score: " +
        props.sidewalkscore.toFixed(3) +
        "</p>";
    popup.setLngLat(e.lngLat).setHTML(msg).addTo(map);
  }

  map.on("mousemove", "stations", function (e) {
    generateRailWalkshedPopup(popup, e);
  });

  map.on("mouseleave", "stations", function (e) {
    popup.remove();
  });

  map.on("click", "stations", function (e) {
    var props = e.features[0].properties;

    var id_filter = ["in", "dvrpc_id", props.dvrpc_id.toString()];

    map.setFilter("iso_sw", ["all", id_filter, sw_filter]);
    map.setPaintProperty("iso_sw", "fill-opacity", 0.7);

    map.setFilter("iso_osm", ["all", id_filter, osm_filter]);
    map.setPaintProperty("iso_osm", "fill-opacity", 0.7);

    map.setFilter("station_selected", ["in", "dvrpc_id", props.dvrpc_id]);
    map.setPaintProperty("station_selected", "circle-opacity", 1);
    map.setPaintProperty("station_selected", "circle-stroke-opacity", 1);

    // Zoom!
    // map.setCenter(map.getCenter());
    // map.setZoom(15);
    map.flyTo({
      center: e.lngLat,
      zoom: 13,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  });

  // Wire the onclick event to the analysis toggles
  var all_analyses = [
    "gap-analysis",
    "transit-analysis",
    "rail-walksheds",
    "island-analysis",
  ];

  for (let i = 0; i < all_analyses.length; i++) {
    let this_analysis = all_analyses[i];
    document.getElementById(this_analysis).onclick = function () {
      toggleAnalysis(this_analysis);
    };
  }
});

// Add a geocoder to the map. Limit the bbox to the DVRPC region.
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  placeholder: "Type here to zoom to...",
  bbox: [-76.210785, 39.478606, -73.885803, 40.601963],
});

map.addControl(geocoder);

var modalToggle = document.querySelector("#modal-toggle");
var close = document.querySelector("#close-modal");
// hide and add aria-hidden attribute
var ariaHideModal = function () {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
};
// reveal and remove aria-hidden attribute
var ariaShowModal = function () {
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
};
// open the modal by clicking the div
modalToggle.onclick = function () {
  modal.style.display = "none" ? ariaShowModal() : ariaHideModal();
};
// closing the modal options: by clicking the 'x' or anywhere outside of it or pressing the escape key
close.onclick = function () {
  ariaHideModal();
};
window.onclick = function (event) {
  if (event.target == modal) {
    ariaHideModal();
  }
};
document.onkeydown = function (event) {
  // make sure the modal is open first
  if (modal.style.display === "block") {
    // keyCode for th escape key
    if (event.keyCode === 27) {
      ariaHideModal();
    }
  }
};
