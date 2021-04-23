// put functions for map events - hover, click, popups, etc in here
// import into index.js and add to map within map.on('load')

// ----------------------------------------------------------------------------------
// TOGGLE BETWEEN ANALYSES ON THE MAP
// When clicking an option under "Select an analysis:"
//    - turn off all layers for all analyses that are NOT selected
//    - remove all analyis layer toggle buttons for non-selected analyses
//    - turn on layers for the selected analysis
//    - update methodology text, legend, and other text-based content for selected
//
// To add a new analysis:
//    - put an entry into the "analysis_meta" object
//    - add content to index.html, making sure to set classes up so that the
//      new analysis is hidden by default
// ----------------------------------------------------------------------------------

const analysis_meta = {
  "gap-analysis": {
    layer_ids: ["centerlines"],
    layer_names: ["Sidewalk Coverage"],
    image_path: "img/Webmap-Legend-v2-segment-map.png",
    alt_text: "Legend showing sidewalk coverage",
    methodology_title: "Street Segment Gap Methodology",
  },
  "transit-analysis": {
    layer_ids: ["transit_stops", "sw_nodes"],
    layer_names: [
      "Transit Stops (SEPTA, NJ TRANSIT, & PATCO)",
      "Walk Time to Nearest Transit Stop",
    ],
    image_path: "img/Webmap-Legend-v2-network-map.png",
    alt_text: "Legend showing walk time to nearest transit stop",
    methodology_title: "Walk Time to Transit Methodology",
  },
  "rail-walksheds": {
    layer_ids: [
      "ridescore_pois_all",
      "station_selected",
      "stations",
      "iso_osm",
      "iso_sw",
    ],
    layer_names: [
      "[Selected] Rail Station Access Point",
      "[Selected] Rail Station Sidewalk Score",
      "Rail Station Sidewalk Score",
      "Street Centerline Walkshed (1-mile)",
      "Sidewalk Walkshed (1-mile)",
    ],
    image_path: "img/Webmap-Legend-v2-rail-map.png",
    alt_text:
      "Legend showing sidewalk and centerline walksheds around rail stations",
    methodology_title: "Rail Station Walksheds Methodology",
  },
  "island-analysis": {
    layer_ids: ["islands"],
    layer_names: ["Islands of Connectivity"],
    image_path: "img/Webmap-Legend-v2-island-map.png",
    alt_text: "Legend for distinct islands",
    methodology_title: "Islands of Connectivity Methodology",
  },
};

const analysis_names = Object.keys(analysis_meta);

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

function toggleAnalysis(btn_id, map, hover_popup) {
  hover_popup.remove();

  // Get a list of the NON-SELECTED analyses
  var other_ids = analysis_names.filter(function (item) {
    return item !== btn_id;
  });

  // Iterate over other non-selected analyses and scrub them away
  for (var i = 0; i < other_ids.length; i++) {
    var other_id = other_ids[i];

    // Turn off layers and remove buttons
    turnOffLayersAndRemoveButtons(analysis_meta[other_id]["layer_ids"], map);

    // Make sure this analysis is not blue
    document.getElementById(other_id).classList.remove("active");

    // Hide the methodology text for this analysis
    var txt_id = other_id + "-description";
    var description = document.getElementById(txt_id);
    if (description) {
      description.classList.add("hidden-text");
    }
  }

  // Turn on the layers for the selected analysis
  turnOnLayersAndAddButtons(
    analysis_meta[btn_id]["layer_ids"],
    analysis_meta[btn_id]["layer_names"],
    map
  );

  // Update legend for the selected analysis
  document
    .getElementById("legend-image")
    .setAttribute("src", analysis_meta[btn_id]["image_path"]);
  document
    .getElementById("legend-image")
    .setAttribute("alt", analysis_meta[btn_id]["alt_text"]);
  document.getElementById("methodology-title").innerText =
    analysis_meta[btn_id]["methodology_title"];

  // Set the selected analysis with class active to make it blue
  document.getElementById(btn_id).classList.add("active");

  // Turn the description text on
  var description = document.getElementById(btn_id + "-description");
  description.classList.remove("hidden-text");
}
// ----------------------------------------------------------------------------------
// END of the toggling analysis section
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// MOUSE HOVER EVENTS
// ----------------------------------------------------------------------------------

export { toggleAnalysis, turnOffLayersAndRemoveButtons, analysis_names };
