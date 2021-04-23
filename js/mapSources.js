const sources = {
  boundaries: {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json",
  },
  sidewalk_inventory: {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/pedestrian-network.json",
  },
  ped_analysis: {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/sidewalk-gaps-analysis-v2.json",
    // url: "http://0.0.0.0:8080/data/gaps.json",
  },
  regional_boundaries: {
    type: "vector",
    url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json",
  },
};

export default sources;
