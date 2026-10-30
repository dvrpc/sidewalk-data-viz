import mapboxgl from 'mapbox-gl';

const swFilter = ['==', 'schema', 'access_score_sw'];
const osmFilter = ['==', 'schema', 'access_score_osm'];
let activePopup;

const newPopup = () =>
  new mapboxgl.Popup({
    closeButton: false,
    className: 'i-am-a-popup',
  });

const bindPopup = (map, htmlMessage, target) => {
  activePopup?.remove();
  activePopup = newPopup().setLngLat(target.lngLat).setHTML(htmlMessage).addTo(map);
};

const closeActivePopup = () => {
  activePopup?.remove();
  activePopup = undefined;
};

const centerlinePopupMessage = (event) => {
  const coverage = Math.min(Number(event.features[0].properties.sw_ratio) * 100, 100);
  const text = coverage === 100 ? '100%' : coverage === 0 ? 'No' : `${coverage.toFixed(1)}%`;
  return `<div class="popup-value">${text}</div><p class="popup-description">sidewalk coverage</p>`;
};

const swNodePopupMessage = (event) => {
  const walkTime = Number(event.features[0].properties.walk_time);
  return walkTime < 180
    ? `<div class="popup-value">${walkTime.toFixed(1)} minutes</div><p class="popup-description">to the nearest transit stop by foot</p>`
    : '<div class="popup-value" aria-label="No accessible transit stop">🚷</div><p class="popup-description">No transit stops are within a 2-hour walk or accessible solely via the sidewalk network</p>';
};

const railWalkshedPopupMessage = (event) => {
  const properties = event.features[0].properties;
  const station = `${properties.operator} : ${properties.station}`;
  if (properties.sidewalkscore == null) {
    return `<div class="popup-value">${station}</div><p class="popup-description">No sidewalk score was calculated since the point did not snap to either the OSM or sidewalk networks</p>`;
  }
  if (Number(properties.sidewalkscore) === 0) {
    return `<div class="popup-value">${station}</div><p class="popup-description">This point did not snap to the sidewalk network</p>`;
  }
  return `<div class="popup-value">${station}</div><p class="popup-description">Sidewalk score: ${Number(properties.sidewalkscore).toFixed(3)}</p>`;
};

const transitStopPopupMessage = (event) => {
  const properties = event.features[0].properties;
  return `<div class="popup-value">${properties.category}</div><p class="popup-description">${properties.poi_name}</p>`;
};

const schoolPopupMessage = (event) => {
  const properties = event.features[0].properties;
  return `<div class="popup-value">${properties.type}</div><p class="popup-description">${properties.name}</p>`;
};

const schoolNodePopupMessage = (event) => {
  const walkTime = Number(event.features[0].properties.n_1_school);
  return walkTime < 180
    ? `<div class="popup-value">${walkTime.toFixed(1)} minutes</div><p class="popup-description">to the nearest school by foot</p>`
    : '<div class="popup-value" aria-label="No accessible school">🚷</div><p class="popup-description">No schools are within a 2-hour walk or accessible solely via the sidewalk network</p>';
};

const islandPopupMessage = (event) => {
  const properties = event.features[0].properties;
  const municipalities =
    properties.muni_count == 1
      ? `is entirely within <strong>${properties.muni_names.split(':')[0]}</strong>`
      : `intersects <strong>${properties.muni_count} municipalities</strong>: ${properties.muni_names}`;
  return `<p class="popup-description popup-description--island">This island is <strong>${Number(properties.size_miles).toFixed(1)}</strong> linear miles long, and ${municipalities}</p>`;
};

const escapeHtml = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inventoryPopupMessage = (event, layerId) => {
  const properties = event.features[0].properties;
  const rows = Object.entries(properties)
    .map(([key, value]) => {
      const label = escapeHtml(key.replace(/_/g, ' '));
      const display = value === undefined || value === null || value === '' ? '—' : escapeHtml(value);
      return `<span class="popup-span"><strong>${label}:</strong> ${display}</span>`;
    })
    .join('');
  const title = layerId === 'crosswalks' ? 'Crosswalk' : layerId === 'ramps' ? 'Ramp' : 'Sidewalk';
  return `<div class="popup-value">${title}</div><div>${rows}</div>`;
};

const popupMessages = {
  centerlines: centerlinePopupMessage,
  sidewalks: inventoryPopupMessage,
  crosswalks: inventoryPopupMessage,
  ramps: inventoryPopupMessage,
  sw_nodes: swNodePopupMessage,
  stations: railWalkshedPopupMessage,
  station_selected: railWalkshedPopupMessage,
  ridescore_pois_all: railWalkshedPopupMessage,
  transit_stops: transitStopPopupMessage,
  islands: islandPopupMessage,
  school_nodes: schoolNodePopupMessage,
  schools: schoolPopupMessage,
};

const popupLayerThemes = {
  centerlines: 'gap-analysis',
  ramps: 'sidewalk-view',
  transit_stops: 'transit-analysis',
  sw_nodes: 'transit-analysis',
  schools: 'school-analysis',
  school_nodes: 'school-analysis',
  ridescore_pois_all: 'rail-walksheds',
  station_selected: 'rail-walksheds',
  stations: 'rail-walksheds',
  iso_osm: 'rail-walksheds',
  iso_sw: 'rail-walksheds',
  islands: 'island-analysis',
};

const addFeaturePopup = (map, layerId, event, activeTheme) => {
  if (activeTheme !== 'sidewalk-view' && activeTheme !== popupLayerThemes[layerId]) return;
  const message = popupMessages[layerId];
  if (!event.features?.length || !message) return;
  bindPopup(map, message(event, layerId), event);
};

const setStationSelection = (map, { poiUid, uid } = {}) => {
  const poiUidStr = poiUid !== undefined && poiUid !== null && poiUid !== '' ? String(poiUid) : null;
  const poiUidNum = poiUidStr !== null ? Number(poiUidStr) : null;
  const hasStation = poiUidStr !== null && !Number.isNaN(poiUidNum);

  const stationFilter = hasStation
    ? uid !== undefined && uid !== null
      ? ['==', 'uid', uid]
      : ['==', 'poi_uid', poiUidNum]
    : ['==', 'uid', ''];
  const walkshedFilter = (schemaFilter) =>
    hasStation ? ['all', schemaFilter, ['==', 'poi_uid', poiUidStr]] : ['all', schemaFilter, ['==', 'poi_uid', '']];
  const accessPointFilter = hasStation ? ['==', 'dvrpc_id', poiUidNum] : ['==', 'dvrpc_id', -1];

  if (map.getLayer('station_selected')) map.setFilter('station_selected', stationFilter);
  if (map.getLayer('ridescore_pois_all')) {
    map.setFilter('ridescore_pois_all', accessPointFilter);
  }
  if (map.getLayer('iso_osm')) map.setFilter('iso_osm', walkshedFilter(osmFilter));
  if (map.getLayer('iso_sw')) map.setFilter('iso_sw', walkshedFilter(swFilter));
  if (hasStation) {
    if (map.getLayer('iso_osm')) map.setLayoutProperty('iso_osm', 'visibility', 'visible');
    if (map.getLayer('iso_sw')) map.setLayoutProperty('iso_sw', 'visibility', 'visible');
    if (map.getLayer('station_selected')) map.setLayoutProperty('station_selected', 'visibility', 'visible');
    if (map.getLayer('ridescore_pois_all')) map.setLayoutProperty('ridescore_pois_all', 'visibility', 'visible');
  }
};

const wireStationClick = (map, getActiveTheme) => {
  map.on('click', 'stations', (event) => {
    if (getActiveTheme() !== 'rail-walksheds' || !event.features?.length) return;
    const properties = event.features[0].properties;
    // accessscore_points links to walksheds via poi_uid (number) -> accessscore_results.poi_uid (string)
    const poiUid = properties.poi_uid ?? properties.dvrpc_id ?? properties.uid;
    if (poiUid === undefined || poiUid === null || poiUid === '') return;
    setStationSelection(map, { poiUid, uid: properties.uid });
    map.flyTo({ center: event.lngLat, zoom: 13, essential: true });
  });
  map.on('click', 'ridescore_pois_all', (event) => {
    if (getActiveTheme() !== 'rail-walksheds' || !event.features?.length) return;
    const properties = event.features[0].properties;
    // access_score_final_poi_set links to walksheds via dvrpc_id (number) -> accessscore_results.poi_uid (string)
    const poiUid = properties.dvrpc_id ?? properties.poi_uid ?? properties.uid;
    if (poiUid === undefined || poiUid === null || poiUid === '') return;
    setStationSelection(map, { poiUid });
    map.flyTo({ center: event.lngLat, zoom: 13, essential: true });
  });
};

const featureStateHoverLayers = [
  'centerlines',
  'stations',
  'ridescore_pois_all',
  'transit_stops',
  'schools',
  'school_nodes',
  'islands',
];

// Layers without a unique feature id can't use feature-state; they get a
// geometry overlay highlight instead (see wireHover).
const overlayHoverLayers = ['sw_nodes', 'sidewalks', 'crosswalks', 'ramps'];

const HOVER_SOURCE = 'hover-highlight';
const HOVER_LINE_LAYER = 'hover-highlight-line';
const HOVER_DOT_LAYER = 'hover-highlight-dot';
const HOVER_RAMP_LAYER = 'hover-highlight-ramp';

const SIDEWALK_COLOR = '#67abd0';
const CROSSWALK_COLOR = '#cc00cc';

const hoverLinePaint = (layerId) => ({
  'line-color': layerId === 'crosswalks' ? CROSSWALK_COLOR : SIDEWALK_COLOR,
  'line-width': layerId === 'crosswalks' ? 6 : ['interpolate', ['linear'], ['zoom'], 10, 2.5, 14, 2.7, 18, 6.5],
});

const emptyHighlight = () => ({ type: 'FeatureCollection', features: [] });

const isHoverable = (layerId, activeTheme) => {
  if (activeTheme === 'sidewalk-view') {
    return layerId === 'sidewalks' || layerId === 'crosswalks' || layerId === 'ramps';
  }
  return popupLayerThemes[layerId] === activeTheme;
};

const clearHoverState = (map) => {
  if (clearHoverState.current) {
    map.setFeatureState(clearHoverState.current, { hover: false });
    clearHoverState.current = null;
  }
  if (map.getSource(HOVER_SOURCE)) map.getSource(HOVER_SOURCE).setData(emptyHighlight());
};

const wireHover = (map, getActiveTheme) => {
  if (!map.getSource(HOVER_SOURCE)) {
    map.addSource(HOVER_SOURCE, { type: 'geojson', data: emptyHighlight() });
  }
  if (!map.getLayer(HOVER_LINE_LAYER)) {
    map.addLayer(
      {
        id: HOVER_LINE_LAYER,
        type: 'line',
        source: HOVER_SOURCE,
        paint: { 'line-opacity': 1, ...hoverLinePaint('sidewalks') },
        filter: ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false],
      },
      'sidewalks',
    );
  }
  if (!map.getLayer(HOVER_DOT_LAYER)) {
    map.addLayer({
      id: HOVER_DOT_LAYER,
      type: 'circle',
      source: HOVER_SOURCE,
      paint: {
        'circle-radius': 6,
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'hover_value'],
          0,
          'rgba(0,136,55,0.9)',
          5,
          'rgba(83,178,108,0.9)',
          10,
          'rgba(166,219,160,0.9)',
          30,
          'rgba(247,247,247,0.9)',
          60,
          'rgba(220,206,227,0.9)',
          90,
          'rgba(194,165,207,0.9)',
          180,
          'rgba(123,50,148,0.9)',
        ],
      },
      filter: [
        'all',
        ['match', ['geometry-type'], ['Point', 'MultiPoint'], true, false],
        ['!=', ['get', 'hover_kind'], 'ramp'],
      ],
    });
  }
  if (!map.getLayer(HOVER_RAMP_LAYER)) {
    map.addLayer({
      id: HOVER_RAMP_LAYER,
      type: 'circle',
      source: HOVER_SOURCE,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 4.5, 16, 6, 18, 8],
        'circle-color': '#ffffff',
        'circle-stroke-color': '#0078ae',
        'circle-stroke-width': 1.5,
      },
      filter: [
        'all',
        ['match', ['geometry-type'], ['Point', 'MultiPoint'], true, false],
        ['==', ['get', 'hover_kind'], 'ramp'],
      ],
    });
  }

  map.on('mousemove', (event) => {
    const candidates = [...featureStateHoverLayers, ...overlayHoverLayers].filter(
      (layerId) => map.getLayer(layerId) && isHoverable(layerId, getActiveTheme()),
    );
    if (!candidates.length) {
      clearHoverState(map);
      return;
    }
    const feature = map.queryRenderedFeatures(event.point, { layers: candidates })[0];
    if (!feature) {
      clearHoverState(map);
      return;
    }

    if (overlayHoverLayers.includes(feature.layer.id)) {
      clearHoverState(map);
      const isRamp = feature.layer.id === 'ramps';
      const isLine = feature.layer.id === 'sidewalks' || feature.layer.id === 'crosswalks';
      if (isLine) {
        Object.entries(hoverLinePaint(feature.layer.id)).forEach(([paint, value]) =>
          map.setPaintProperty(HOVER_LINE_LAYER, paint, value),
        );
      }
      map.getSource(HOVER_SOURCE).setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: feature.geometry,
            properties: {
              ...(isRamp ? { hover_kind: 'ramp', hover_value: 30 } : { hover_kind: 'node' }),
              hover_value: feature.properties.walk_time ?? feature.properties.n_1_school ?? 30,
            },
          },
        ],
      });
      return;
    }

    const key = { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id };
    const current = clearHoverState.current;
    if (current && current.source === key.source && current.sourceLayer === key.sourceLayer && current.id === key.id) {
      return;
    }
    clearHoverState(map);
    if (key.id === undefined || key.id === null) return;
    clearHoverState.current = key;
    map.setFeatureState(key, { hover: true });
  });
  map.on('mouseout', () => clearHoverState(map));
};

export {
  addFeaturePopup,
  clearHoverState,
  closeActivePopup,
  newPopup,
  popupLayerThemes,
  setStationSelection,
  wireHover,
  wireStationClick,
};
