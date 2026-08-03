const analysis_meta = {
  'gap-analysis': {
    layer_ids: ['centerlines'],
    layer_names: ['Sidewalk Coverage'],
    legend: {
      title: 'Sidewalk Coverage',
      items: [
        { label: 'Missing sidewalks on both sides', color: '#762a83', symbol: 'line' },
        { label: 'Missing a sidewalk on one side', color: '#af8dc3', symbol: 'line' },
        { label: 'Has sidewalks on both sides', color: '#1b7837', symbol: 'line' },
      ],
    },
    methodology_title: 'Street Segment Gap Methodology',
  },
  'transit-analysis': {
    layer_ids: ['transit_stops', 'sw_nodes'],
    layer_names: ['Transit Stops (SEPTA, NJ TRANSIT, & PATCO)', 'Walk Time to Nearest Transit Stop'],
    legend: {
      title: 'Walk time to the nearest transit stop',
      description: 'Minutes',
      items: [
        { label: '0–5', color: '#1b7837', symbol: 'circle' },
        { label: '5–10', color: '#5aae61', symbol: 'circle' },
        { label: '10–30', color: '#a6dba0', symbol: 'circle' },
        { label: '30–60', color: '#f7f7f7', symbol: 'circle' },
        { label: '60–90', color: '#d8b5d4', symbol: 'circle' },
        { label: '90+', color: '#af8dc3', symbol: 'circle' },
        { label: 'Over 2 hours away or not accessible by sidewalk', color: '#762a83', symbol: 'circle' },
      ],
    },
    methodology_title: 'Walk Time to Transit Methodology',
  },
  'school-analysis': {
    layer_ids: ['schools', 'school_nodes'],
    layer_names: ['Public and Private Schools', 'Walk Time to Nearest School'],
    legend: {
      title: 'Walk time to the nearest school',
      description: 'Minutes',
      items: [
        { label: '0–5', color: '#1b7837', symbol: 'circle' },
        { label: '5–10', color: '#5aae61', symbol: 'circle' },
        { label: '10–30', color: '#a6dba0', symbol: 'circle' },
        { label: '30–60', color: '#f7f7f7', symbol: 'circle' },
        { label: '60–90', color: '#d8b5d4', symbol: 'circle' },
        { label: '90+', color: '#af8dc3', symbol: 'circle' },
        { label: 'Over 2 hours away or not accessible by sidewalk', color: '#762a83', symbol: 'circle' },
      ],
    },
    methodology_title: 'Walk Time to School Methodology',
  },
  'rail-walksheds': {
    layer_ids: ['ridescore_pois_all', 'station_selected', 'stations', 'iso_osm', 'iso_sw'],
    layer_names: [
      '[Selected] Rail Station Access Point',
      '[Selected] Rail Station Sidewalk Score',
      'Rail Station Sidewalk Score',
      'Street Centerline Walkshed (1-mile)',
      'Sidewalk Walkshed (1-mile)',
    ],
    legend: {
      title: 'Rail Station Sidewalk Score',
      items: [
        { label: 'Walksheds are the same size', color: '#5aae61', symbol: 'circle' },
        { label: 'Sidewalk walkshed is roughly half the size of the centerline walkshed', color: '#af8dc3', symbol: 'circle' },
        { label: 'Centerline walkshed is substantially larger than the sidewalk walkshed', color: '#762a83', symbol: 'circle' },
        { label: '1-mile walkshed on the sidewalk network', color: '#00ff00', symbol: 'polygon' },
        { label: '1-mile walkshed on the centerline network', color: '#000000', symbol: 'polygon' },
      ],
    },
    methodology_title: 'Rail Station Walksheds Methodology',
  },
  'island-analysis': {
    layer_ids: ['islands'],
    layer_names: ['Islands of Connectivity'],
    legend: {
      title: 'Islands of Connectivity',
      description: 'Each color identifies a group of connected sidewalks.',
      items: [],
    },
    methodology_title: 'Islands of Connectivity Methodology',
  },
  'sidewalk-view': {
    layer_ids: [],
    layer_names: [],
    legend: {
      title: 'Explore Sidewalks',
      description: 'Click a sidewalk or crosswalk segment to view its properties.',
      items: [],
    },
    methodology_title: 'Sidewalk View Methodology',
  }
};
export { analysis_meta };
