// put functions for map events - hover, click, popups, etc in here
// import into index.js and add to map within map.on('load')

var all_analysis_names = [
  "gap-analysis",
  "transit-analysis",
  "rail-walksheds",
  "island-analysis",
];

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

function turnOffLayersAndRemoveButtons(list_of_ids, map) {
  // Remove the existing <ul> element
  var toggler = document.getElementById("toggler");
  if (toggler) {
    toggler.remove();
  }

  // Set the vector layer visibility to none
  for (var i = 0; i < list_of_ids.length; i++) {
    var layer_id = list_of_ids[i];
    map.setLayoutProperty(layer_id, "visibility", "none");
  }
}

function turnOnLayersAndAddButtons(list_of_ids, list_of_nice_names, map) {
  // this function turns on all layers for analysis
  // and builds a <ul> with checkboxes to toggle the layers

  // Make a new <ul> inside the analysis toggler fieldset
  var togglerFieldset = document.getElementById("analysis-toggler");
  var toggler = document.createElement("ul");
  toggler.setAttribute("id", "toggler");

  for (var i = 0; i < list_of_ids.length; i++) {
    var layer_id = list_of_ids[i];
    var nice_name = list_of_nice_names[i];

    // Add <li> if it doesn't exist yet
    var input_exists = document.getElementById(layer_id);

    if (!input_exists) {
      // Make this:
      // <li> <label> <input /> LABEL TEXT </label> </li>
      var li = document.createElement("li");
      var label = document.createElement("label");
      label.innerText = nice_name;

      var newInput = document.createElement("input");
      newInput.id = layer_id;
      newInput.value = layer_id;
      newInput.type = "checkbox";
      newInput.name = "layer";
      newInput.checked = true;
      newInput.label = "&nbsp;" + nice_name;

      label.prepend(newInput);
      li.appendChild(label);

      // Add it to the <ul>
      toggler.prepend(li);
    }

    // Turn the mapbox layer on
    map.setLayoutProperty(layer_id, "visibility", "visible");
  }

  // Add the <ul> to the fieldset
  togglerFieldset.appendChild(toggler);
}

function toggleAnalysis(btn_id, map) {
  // Get a list of the NON-SELECTED analyses
  var other_ids = all_analysis_names.filter(function (item) {
    return item !== btn_id;
  });

  // STREET SEGMENT GAPS
  if (btn_id == "gap-analysis") {
    turnOffLayersAndRemoveButtons(rail_walkshed_layers, map);
    turnOffLayersAndRemoveButtons(nearest_transit_stop_layers, map);
    turnOffLayersAndRemoveButtons(island_layers, map);

    turnOnLayersAndAddButtons(segment_layers, segment_names, map);

    // Update the legend in the sidebar
    let image_path = "img/Webmap-Legend-v2-segment-map.png";
    let alt_text = "Legend showing sidewalk coverage";
    document.getElementById("legend-image").setAttribute("src", image_path);
    document.getElementById("legend-image").setAttribute("alt", alt_text);
    document.getElementById("methodology-title").innerText =
      "Street Segment Gap Methdology:";
  }
  // WALK TIME TO TRANSIT
  else if (btn_id == "transit-analysis") {
    turnOffLayersAndRemoveButtons(rail_walkshed_layers, map);
    turnOffLayersAndRemoveButtons(segment_layers, map);
    turnOffLayersAndRemoveButtons(island_layers, map);

    turnOnLayersAndAddButtons(nearest_transit_stop_layers, transit_names, map);

    // Update the legend in the sidebar
    let image_path = "img/Webmap-Legend-v2-network-map.png";
    let alt_text = "Legend showing walk time to nearest transit stop";
    document.getElementById("legend-image").setAttribute("src", image_path);
    document.getElementById("legend-image").setAttribute("alt", alt_text);
    document.getElementById("methodology-title").innerText =
      "Walk Time to Transit Methdology:";
  }
  // RAIL STATION WALKSHEDS
  else if (btn_id == "rail-walksheds") {
    turnOffLayersAndRemoveButtons(segment_layers, map);
    turnOffLayersAndRemoveButtons(nearest_transit_stop_layers, map);
    turnOffLayersAndRemoveButtons(island_layers, map);

    turnOnLayersAndAddButtons(rail_walkshed_layers, rail_names, map);

    let image_path = "img/Webmap-Legend-v2-rail-map.png";
    let alt_text =
      "Legend showing sidewalk and centerline walksheds around rail stations";
    document.getElementById("legend-image").setAttribute("src", image_path);
    document.getElementById("legend-image").setAttribute("alt", alt_text);
    document.getElementById("methodology-title").innerText =
      "Rail Station Walksheds Methdology:";
  }
  // ISLANDS OF CONNECTIVITY
  else if (btn_id == "island-analysis") {
    // Remove buttons and layers from other analyses
    turnOffLayersAndRemoveButtons(segment_layers, map);
    turnOffLayersAndRemoveButtons(nearest_transit_stop_layers, map);
    turnOffLayersAndRemoveButtons(rail_walkshed_layers, map);

    turnOnLayersAndAddButtons(island_layers, island_names, map);
    let image_path = "img/Webmap-Legend-v2-island-map.png";
    let alt_text = "Legend for distinct islands";
    document.getElementById("legend-image").setAttribute("src", image_path);
    document.getElementById("legend-image").setAttribute("alt", alt_text);
    document.getElementById("methodology-title").innerText =
      "Islands of Connectivity Methdology:";
  }

  // Set the selected analysis with class active to make it blue
  document.getElementById(btn_id).classList.add("active");

  // Iterate over other non-selected analyses
  for (var i = 0; i < other_ids.length; i++) {
    var other_id = other_ids[i];

    // Make sure this analysis is not blue
    document.getElementById(other_id).classList.remove("active");

    // Hide the methodology text for this analysis
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

export { toggleAnalysis, turnOffLayersAndRemoveButtons, all_analysis_names };
