import makeMap from "./map.js";
import sources from "./mapSources.js";
import { layers, paint_props } from "./mapLayers.js";
import { ariaShowModal, ariaHideModal } from "./modal.js";

import { toggleAnalysis, analysis_names } from "./mapUtils.js";

// OPTIONAL imports. Uncomment to use
import { toggleLayers } from "./forms.js";
import {
  hoverPopup,
  bindPopup,
  hover_popup_meta,
  hover_keys,
  wire_station_click,
} from "./popup.js";

const modal = document.getElementById("modal");
const modalToggle = document.getElementById("modal-toggle");
const closeModal = document.getElementById("close-modal");

// OPTIONAL elements. Uncomment to use
const toggleLayerForms = Array.from(
  document.querySelectorAll(".sidebar-form-toggle")
);

// map
const map = makeMap();

const hover_popup = hoverPopup();

map.on("load", () => {
  // Load vector tile sources
  for (const source in sources) map.addSource(source, sources[source]);

  // Load layer style definitions
  for (const layer in layers) map.addLayer(layers[layer]);

  // Load scale-based paint properties
  for (const paint in paint_props)
    map.setPaintProperty(
      paint_props[paint].id,
      paint_props[paint].attribute,
      paint_props[paint].style
    );

  // Wire all layer toggles to an on-click event
  toggleLayerForms.forEach((form) => toggleLayers(form, map));

  // Wire all hover popups
  for (var i = 0; i < hover_keys.length; i++) {
    let this_key = hover_keys[i];
    map.on("mousemove", this_key, function (e) {
      var msg = hover_popup_meta[this_key](e);
      bindPopup(map, msg, hover_popup, e);
    });
    map.on("mouseleave", this_key, function (e) {
      hover_popup.remove();
    });
  }

  // Wire click-based popups
  wire_station_click(map);

  // popups
  // map.on('click', 'county-outline', e => {
  //     const allProps = e.features[0].properties

  //     const target = {
  //         lngLat: e.lngLat,
  //         props: [
  //         ]
  //     }

  //     makePopupContent(map, target, popup)
  // })
  // map.on('mouseenter', 'county-outline', () => map.getCanvas().style.cursor = 'pointer')
  // map.on('mouseleave', 'county-outline', () => map.getCanvas().style.cursor = '')
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
