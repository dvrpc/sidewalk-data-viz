const sources = {
  boundaries: {
    type: 'vector',
    url: 'https://tiles.dvrpc.org/data/dvrpc-municipal',
  },
  sidewalk_inventory: {
    type: 'vector',
    url: 'https://tiles.dvrpc.org/data/pedestrian-network',
  },
  ped_analysis: {
    type: 'vector',
    url: 'https://tiles.dvrpc.org/data/sidewalk-gaps-analysis-v3',
  },
  regional_boundaries: {
    type: 'vector',
    url: 'https://tiles.dvrpc.org/data/dvrpc-municipa',
  },
  ped_coverage: {
    type: 'vector',
    url: 'https://tiles.dvrpc.org/data/transportation/pedestriannetwork_coverage',
  },
};

export default sources;
