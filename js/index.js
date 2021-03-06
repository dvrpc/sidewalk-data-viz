import makeMap from "./map.js";
import sources from "./mapSources.js";
import { layers, paint_props } from "./mapLayers.js";
import { ariaShowModal, ariaHideModal } from "./modal.js";

import {
  toggleAnalysis,
  analysis_names,
  remove_all_popups,
} from "./mapUtils.js";

import { toggleLayers } from "./forms.js";
import {
  bindPopup,
  hover_popup_meta,
  hover_keys,
  wire_station_click,
} from "./popup.js";

const modal = document.getElementById("modal");
const modalToggle = document.getElementById("modal-toggle");
const closeModal = document.getElementById("close-modal");

const toggleLayerForms = Array.from(
  document.querySelectorAll(".sidebar-form-toggle")
);

const map = makeMap();

map.on("load", () => {
  // Find the index of the first symbol layer in the map style
  // This becomes an argument in map.addLayer and allows the
  // basemap labels to draw on top of the vector layers
  var base_layers = map.getStyle().layers;
  var firstSymbolId;
  for (var i = 0; i < base_layers.length; i++) {
    if (base_layers[i].type === "symbol") {
      firstSymbolId = base_layers[i].id;
      break;
    }
  }

  // Load vector tile sources
  for (const source in sources) map.addSource(source, sources[source]);

  // Load layer style definitions
  for (const layer in layers) map.addLayer(layers[layer], firstSymbolId);

  // Load scale-based paint properties
  for (const paint in paint_props)
    map.setPaintProperty(
      paint_props[paint].id,
      paint_props[paint].attribute,
      paint_props[paint].style
    );

  // Wire all checkbox layer toggles to an on-click event
  toggleLayerForms.forEach((form) => toggleLayers(form, map));

  // Wire all hover popups
  for (var i = 0; i < hover_keys.length; i++) {
    let this_key = hover_keys[i];

    // change mouse tip to pointer finger
    map.on(
      "mouseenter",
      this_key,
      () => (map.getCanvas().style.cursor = "pointer")
    );

    map.on("click", this_key, function (e) {
      remove_all_popups();

      var msg = hover_popup_meta[this_key](e);

      bindPopup(map, msg, e);
    });

    // change mouse tip upon leaving feature
    map.on("mouseleave", this_key, function (e) {
      map.getCanvas().style.cursor = "";
    });
  }

  // Wire click-based popups
  wire_station_click(map);
});

// Wire the onclick event to the analysis toggles
for (let i = 0; i < analysis_names.length; i++) {
  let this_analysis = analysis_names[i];
  document.getElementById(this_analysis).onclick = function () {
    toggleAnalysis(this_analysis, map);
  };
}

// modal
modalToggle.onclick = () => ariaShowModal(modal);
closeModal.onclick = () => ariaHideModal(modal);

modal.onclick = (event) => {
  if (event.target == modal) ariaHideModal(modal);
};
document.onkeydown = (event) => {
  if (event.code === "Escape" && modal.style.display === "flex")
    ariaHideModal(modal);
};
