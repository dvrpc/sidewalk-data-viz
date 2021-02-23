const hoverPopup = () => new mapboxgl.Popup({ closebutton: false });
const clickPopup = () => new mapboxgl.Popup();

const bindPopup = (map, html_msg, popup, target) => {
  popup.setLngLat(target.lngLat).setHTML(html_msg).addTo(map);
};

// ----------------------------------------------------------------------------------
// Dynamic text content that appears in popup windows
// ----------------------------------------------------------------------------------

const centerline_popup_msg = (e) => {
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
  return "<h1>" + sw_txt + "</h1><p>sidewalk coverage</p>";
};

const sw_node_popup_msg = (e) => {
  var props = e.features[0].properties;
  if (props.walk_time < 180) {
    return (
      "<h1>" +
      props.walk_time.toFixed(1) +
      " minutes</h1><p>to the nearest transit stop by foot</p>"
    );
  } else {
    return "<h1>🚷</h1><p>No transit stops are accessible solely via the sidewalk network</p>";
  }
};

const rail_walkshed_popup_msg = (e) => {
  var props = e.features[0].properties;
  if (props.sidewalkscore == null)
    return (
      "<h1>" +
      props.operator +
      " : " +
      props.station +
      "</h1><p>No sidewalk score was calculated since the point did not snap to either the OSM or sidewalk networks</p>"
    );
  else if (props.sidewalkscore == 0)
    return (
      "<h1>" +
      props.operator +
      " : " +
      props.station +
      "</h1><p>This point did not snap to the sidewalk network</p>"
    );
  else
    return (
      "<h1>" +
      props.operator +
      " : " +
      props.station +
      "</h1><p>Sidewalk score: " +
      props.sidewalkscore.toFixed(3) +
      "</p>"
    );
};

const transit_stop_popup_msg = (e) => {
  var props = e.features[0].properties;
  return "<h1>" + props.src + "</h1><p>" + props.stop_name + "</p>";
};

const island_popup_msg = (e) => {
  var props = e.features[0].properties;
  if (props.muni_count == 1) {
    var muni_text =
      " is entirely within <strong>" +
      props.muni_names.replace(": 100.0,", "") +
      "</strong>";
  } else {
    var muni_text =
      " intersects <strong>" +
      props.muni_count +
      " municipalities </strong>: <ul>";
    props.muni_names
      .split(",")
      .slice(0, -1)
      .forEach(function (item, index) {
        muni_text += "<li>" + item + "%</li>";
      });
    muni_text += "</ul>";
  }

  return (
    "This island is <strong>" +
    props.size_miles.toFixed(1) +
    "</strong> linear miles long, and " +
    muni_text
  );
};

const hover_popup_meta = {
  centerlines: centerline_popup_msg,
  sw_nodes: sw_node_popup_msg,
  stations: rail_walkshed_popup_msg,
  transit_stops: transit_stop_popup_msg,
  islands: island_popup_msg,
};

const hover_keys = Object.keys(hover_popup_meta);

export { hoverPopup, bindPopup, hover_popup_meta, hover_keys };
