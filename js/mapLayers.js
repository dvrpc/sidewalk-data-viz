var sw_filter = ["all", ["==", "schema", "rs_sw"]];
var osm_filter = ["all", ["==", "schema", "rs_osm"]];

const layers = {
  countyOutline: {
    id: "county-outline",
    type: "line",
    source: "boundaries",
    "source-layer": "county",
    paint: {
      "line-width": 2.5,
      "line-color": "#f7f7f7",
    },
    filter: ["==", "dvrpc", "Yes"],
  },
  muniOutline: {
    id: "municipality-outline",
    type: "line",
    source: "boundaries",
    "source-layer": "municipalities",
    paint: {
      "line-width": 0.5,
      "line-color": "#e7e7e7",
    },
  },
  iso_osm: {
    id: "iso_osm",
    type: "fill",
    source: "ridescore_analysis",
    "source-layer": "ridescore_isos",
    paint: {
      "fill-color": "rgba(255, 255, 255, 0.5)",
      "fill-opacity": 0.5,
    },
    filter: osm_filter,
    layout: { visibility: "none" },
  },
  iso_sw: {
    id: "iso_sw",
    type: "fill",
    source: "ridescore_analysis",
    "source-layer": "ridescore_isos",
    paint: {
      "fill-color": "rgba(0, 255, 0, 0.5)",
      "fill-opacity": 0.5,
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
    source: "ped_analysis",
    "source-layer": "osm_sw_coverage",
    minzoom: 7,
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
  stations: {
    id: "stations",
    type: "circle",
    source: "ridescore_analysis",
    "source-layer": "sidewalkscore",
    minzoom: 7,
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
  station_selected: {
    id: "station_selected",
    type: "circle",
    source: "ridescore_analysis",
    "source-layer": "sidewalkscore",
    minzoom: 7,
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
};

const paint_props = {
  sidewalks: {
    id: "sidewalks",
    attribute: "line-width",
    style: ["interpolate", ["exponential", 0.5], ["zoom"], 10, 0.1, 17, 0.8],
  },
  crosswalks: {
    id: "crosswalks",
    attribute: "line-width",
    style: ["interpolate", ["exponential", 0.5], ["zoom"], 15, 2, 18, 12],
  },
  centerlines: {
    id: "centerlines",
    attribute: "line-width",
    style: [
      "interpolate",
      ["exponential", 0.5],
      ["zoom"],
      8.5,
      0.1,
      15,
      4,
      22,
      22,
    ],
  },
  sw_nodes: {
    id: "sw_nodes",
    attribute: "circle-radius",
    style: ["interpolate", ["linear"], ["zoom"], 12, 1.5, 18, 12],
  },
  transit_stops: {
    id: "transit_stops",
    attribute: "circle-radius",
    style: ["interpolate", ["linear"], ["zoom"], 12, 1.5, 18, 12],
  },
  stations: {
    id: "stations",
    attribute: "circle-radius",
    style: ["interpolate", ["linear"], ["zoom"], 12, 5, 18, 20],
  },
  station_selected: {
    id: "station_selected",
    attribute: "circle-radius",
    style: ["interpolate", ["linear"], ["zoom"], 12, 9, 18, 30],
  },
  islands: {
    id: "islands",
    attribute: "line-width",
    style: ["interpolate", ["exponential", 0.5], ["zoom"], 10, 0.75, 17, 2],
  },
};

// export default layers;
export { layers, paint_props };
