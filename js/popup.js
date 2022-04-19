import { sw_filter, osm_filter } from "./mapLayers.js";

const newPopup = () =>
  new mapboxgl.Popup({
    closebutton: false,
    className: "i-am-a-popup",
  });

const bindPopup = (map, html_msg, target) => {
  var popup = newPopup();
  popup.setLngLat(target.lngLat).setHTML(html_msg).addTo(map);
};

// ----------------------------------------------------------------------------------
// Dynamic text content that appears in HOVER popup windows
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
    return "<h1>🚷</h1><p>No transit stops are within a 2-hour walk or accessible solely via the sidewalk network</p>";
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
  return "<h1>" + props.category + "</h1><p>" + props.poi_name + "</p>";
};

const school_popup_msg = (e) => {
  var props = e.features[0].properties;
  return "<h1>" + props.type + "</h1><p>" + props.name + "</p>";
};
const school_node_popup_msg = (e) => {
  var props = e.features[0].properties;
  if (props.n_1_school < 180) {
    return (
      "<h1>" +
      props.n_1_school.toFixed(1) +
      " minutes</h1><p>to the nearest school by foot</p>"
    );
  } else {
    return "<h1>🚷</h1><p>No schools are within a 2-hour walk or accessible solely via the sidewalk network</p>";
  }
};

const island_popup_msg = (e) => {
  var props = e.features[0].properties;
  if (props.muni_count == 1) {
    var muni_text =
      " is entirely within <strong>" +
      props.muni_names.split(":")[0] +
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
  school_nodes: school_node_popup_msg,
  schools: school_popup_msg,
};

const hover_keys = Object.keys(hover_popup_meta);

// ----------------------------------------------------------------------------------
// Popups for CLICK events
// ----------------------------------------------------------------------------------

const wire_station_click = (map) => {
  map.on("click", "stations", function (e) {
    var props = e.features[0].properties;

    var id_filter = ["in", "poi_uid", props.poi_uid.toString()];

    map.setFilter("iso_sw", ["all", id_filter, sw_filter]);
    map.setPaintProperty("iso_sw", "fill-opacity", 0.7);

    map.setFilter("iso_osm", ["all", id_filter, osm_filter]);
    map.setPaintProperty("iso_osm", "fill-opacity", 0.7);

    map.setFilter("station_selected", ["in", "poi_uid", props.poi_uid]);
    map.setPaintProperty("station_selected", "circle-opacity", 1);
    map.setPaintProperty("station_selected", "circle-stroke-opacity", 1);

    map.setFilter("ridescore_pois_all", ["in", "dvrpc_id", props.poi_uid]);
    map.setPaintProperty("ridescore_pois_all", "circle-opacity", 1);
    map.setPaintProperty("ridescore_pois_all", "circle-stroke-opacity", 1);

    map.flyTo({
      center: e.lngLat,
      zoom: 13,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  });
};

export {
  newPopup,
  bindPopup,
  hover_popup_meta,
  hover_keys,
  wire_station_click,
};
