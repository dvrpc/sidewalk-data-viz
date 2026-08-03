var sw_filter = ["all", ["==", "schema", "access_score_sw"]];
var osm_filter = ["all", ["==", "schema", "access_score_osm"]];

const layers = {
  countyOutline: {
    id: "county-outline",
    type: "line",
    source: "boundaries",
    "source-layer": "county",
    paint: {
      "line-width": 2.5,
      "line-color": "#6cd0ff",
    },
    filter: ["==", "dvrpc", "Yes"],
    // layout: { visibility: "none" },
  },
  muniOutline: {
    id: "municipality-outline",
    type: "line",
    source: "boundaries",
    "source-layer": "municipalities",
    paint: {
      "line-width": 0.5,
      "line-color": "#6cd0ff",
    },
    // layout: { visibility: "none" },
  },
  iso_osm: {
    id: "iso_osm",
    type: "fill",
    source: "ped_analysis",
    "source-layer": "accessscore_results",
    paint: {
      "fill-color": "rgba(255, 255, 255, 0.5)",
      "fill-opacity": 0,
    },
    filter: osm_filter,
    layout: { visibility: "none" },
  },
  iso_sw: {
    id: "iso_sw",
    type: "fill",
    source: "ped_analysis",
    "source-layer": "accessscore_results",
    paint: {
      "fill-color": "rgba(0, 255, 0, 0.5)",
      "fill-opacity": 0,
    },
    filter: sw_filter,
    layout: { visibility: "none" },
  },
  sidewalks: {
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
  crosswalks: {
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
  centerlines: {
    id: "centerlines",
    type: "line",
    source: "ped_coverage",
    "source-layer": "pedestriannetwork_coverage",
    minzoom: 7,
    paint: {
      "line-width": 4,
      "line-color": [
        "case",
        ["<", ["get", "sw_ratio"], 0.45],
        "rgba(118,42,131,0.7)",
        ["<=", ["get", "sw_ratio"], 0.82],
        "rgba(175,141,195,0.7)",
        "rgba(27,120,55,0.3)",
      ],
    },
    layout: { visibility: "visible" },
  },
  sw_nodes: {
    id: "sw_nodes",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "sw_nodes",
    minzoom: 7,
    paint: {
      "circle-radius": 4,
      "circle-color": {
        property: "walk_time",
        stops: [
          [0, "rgba(27,120,55,0.7)"],
          [5, "rgba(90,174,97,0.7)"],
          [10, "rgba(166,219,160,0.7)"],
          [30, "rgba(247,247,247,0.7)"],
          [60, "rgba(216,181,212,0.7)"],
          [90, "rgba(175,141,195,0.7)"],
          [180, "rgba(118,42,131,0.7)"],
        ],
        default: "rgba(118,42,131,0.7)"
      },
    },
    layout: { visibility: "none" },
  },
  school_nodes: {
    id: "school_nodes",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "school_results",
    minzoom: 7,
    paint: {
      "circle-radius": 4,
      "circle-color": {
        property: "n_1_school",
        stops: [
          [0, "rgba(27,120,55,0.7)"],
          [5, "rgba(90,174,97,0.7)"],
          [10, "rgba(166,219,160,0.7)"],
          [30, "rgba(247,247,247,0.7)"],
          [60, "rgba(216,181,212,0.7)"],
          [90, "rgba(175,141,195,0.7)"],
          [180, "rgba(118,42,131,0.7)"],
        ],
        default: "rgba(118,42,131,0.7)"
      },
    },
    layout: { visibility: "none" },
  },
  ridescore_pois_all: {
    id: "ridescore_pois_all",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "access_score_final_poi_set",
    minzoom: 12,
    paint: {
      "circle-radius": 4,
      "circle-stroke-color": "white",
      "circle-stroke-width": 1.5,
      "circle-color": "rgba(0,0,0,1)",
      "circle-opacity": 0,
      "circle-stroke-opacity": 0,
    },
    layout: { visibility: "none" },
  },
  stations: {
    id: "stations",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "accessscore_points",
    minzoom: 7,
    paint: {
      "circle-radius": 12,
      "circle-stroke-color": "white",
      "circle-stroke-width": 1.5,
      "circle-color": {
        property: "sidewalkscore",
        default: "black",
        stops: [
          [0, "rgba(118, 42, 131, 1)"],
          [0.7, "rgba(175, 141, 195, 1)"],
          [1, "rgba(90, 174, 97, 1)"],
          [2, "rgba(27, 120, 55, 1)"],
        ],
      },
    },
    layout: { visibility: "none" },
  },
  station_selected: {
    id: "station_selected",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "accessscore_points",
    minzoom: 7,
    paint: {
      "circle-radius": 20,
      "circle-stroke-color": "black",
      "circle-stroke-width": 4,
      "circle-color": {
        property: "sidewalkscore",
        default: "black",
        stops: [
          [0, "rgba(118, 42, 131, 1)"],
          [0.7, "rgba(175, 141, 195, 1)"],
          [1, "rgba(90, 174, 97, 1)"],
          [2, "rgba(27, 120, 55, 1)"],
        ],
      },
      "circle-opacity": 0,
      "circle-stroke-opacity": 0,
    },
    layout: { visibility: "none" },
  },
  islands: {
    id: "islands",
    type: "line",
    source: "ped_analysis",
    layout: { visibility: "none" },
    "source-layer": "islands",
    paint: {
      "line-color": ["get", "rgba"],
    },
  },
  transit_stops: {
    id: "transit_stops",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "transit_stops",
    minzoom: 12,
    paint: {
      "circle-radius": 6,
      "circle-stroke-color": "white",
      "circle-stroke-width": 1.5,
      "circle-color": "rgba(0,0,0,0)",
    },
    layout: { visibility: "none" },
  },
  schools: {
    id: "schools",
    type: "circle",
    source: "ped_analysis",
    "source-layer": "school_points",
    minzoom: 12,
    paint: {
      "circle-radius": 6,
      "circle-stroke-color": "white",
      "circle-stroke-width": 1.5,
      "circle-color": "rgba(0,0,0,0)",
    },
    layout: { visibility: "none" },
  },
};

export { layers };
