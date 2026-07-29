const analysis_meta = {
  'gap-analysis': {
    layer_ids: ['centerlines'],
    layer_names: ['Sidewalk Coverage'],
    legend: {
      title: 'Sidewalk Coverage',
      items: [
        { label: 'Missing sidewalks on both sides', color: '#d7191c', symbol: 'line' },
        { label: 'Missing a sidewalk on one side', color: '#ff8c3e', symbol: 'line' },
        { label: 'Has sidewalks on both sides', color: '#1a9641', symbol: 'line' },
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
        { label: '0–5', color: '#1a9850', symbol: 'circle' },
        { label: '5–10', color: '#91cf60', symbol: 'circle' },
        { label: '10–30', color: '#d9ef8b', symbol: 'circle' },
        { label: '30–60', color: '#ffffbf', symbol: 'circle' },
        { label: '60–90', color: '#fee08b', symbol: 'circle' },
        { label: '90+', color: '#fc8d59', symbol: 'circle' },
        { label: 'Over 2 hours away or not accessible by sidewalk', color: '#d73027', symbol: 'circle' },
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
        { label: '0–5', color: '#1a9850', symbol: 'circle' },
        { label: '5–10', color: '#91cf60', symbol: 'circle' },
        { label: '10–30', color: '#d9ef8b', symbol: 'circle' },
        { label: '30–60', color: '#ffffbf', symbol: 'circle' },
        { label: '60–90', color: '#fee08b', symbol: 'circle' },
        { label: '90+', color: '#fc8d59', symbol: 'circle' },
        { label: 'Over 2 hours away or not accessible by sidewalk', color: '#d73027', symbol: 'circle' },
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
        { label: 'Walksheds are the same size', color: '#00a000', symbol: 'circle' },
        { label: 'Sidewalk walkshed is roughly half the size of the centerline walkshed', color: '#ffeb00', symbol: 'circle' },
        { label: 'Centerline walkshed is substantially larger than the sidewalk walkshed', color: '#ff0000', symbol: 'circle' },
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
      items: [{ label: 'Connected sidewalk group', symbol: 'multicolor' }],
    },
    methodology_title: 'Islands of Connectivity Methodology',
  },
};
export { analysis_meta };
