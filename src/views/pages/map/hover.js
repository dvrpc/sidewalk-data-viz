import { createPopUp } from './popup';

const pointHover = (e, map) => {
  if (e.features.length > 0) {
    const sourceLayer = e.features[0].layer['source-layer'];
    const hoverId = e.features[0].id;
    const currentHoverId = localStorage.getItem('state_point_hoverId');
    const currentHoverLayer = localStorage.getItem('state_point_hoverLayer');

    // When the mouse moves over the station layer, update the
    // feature state for the feature under the mouse
    if (currentHoverId) {
      map.removeFeatureState({
        source: 'eta',
        sourceLayer: currentHoverLayer,
        id: currentHoverId,
      });
    }
    map.setFeatureState(
      {
        source: 'eta',
        sourceLayer: sourceLayer,
        id: hoverId,
      },
      {
        hover: true,
      },
    );
    localStorage.setItem('state_point_hoverId', hoverId);
    localStorage.setItem('state_point_hoverLayer', sourceLayer);
    createPopUp(e.features[0], map, e.features[0].layer.id);
  }
};

const pointHoverLeave = (map) => {
  const hoverId = localStorage.getItem('state_point_hoverId');
  const currentHoverLayer = localStorage.getItem('state_point_hoverLayer');

  map.setFeatureState({ source: 'eta', sourceLayer: currentHoverLayer, id: hoverId }, { hover: false });
  localStorage.setItem('state_point_hoverId', '');
  localStorage.setItem('state_point_hoverLayer', '');
  const popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
};

const hoverGeoFill = (e, map) => {
  let hoverId = localStorage.getItem('state_hoverId');

  map.getCanvas().style.cursor = 'pointer';

  if (e.features.length > 0) {
    if (hoverId.length) {
      map.setFeatureState({ source: 'eta', sourceLayer: 'eta_score', id: hoverId }, { hover: false });
    }

    hoverId = e.features[0].id;

    map.setFeatureState({ source: 'eta', sourceLayer: 'eta_score', id: hoverId }, { hover: true });

    localStorage.setItem('state_hoverId', hoverId);
    createPopUp(e.features[0], map, e.features[0].layer.id, e.lngLat.wrap());
  }
};

const leaveGeoFill = (map) => {
  let hoverId = localStorage.getItem('state_hoverId');

  map.getCanvas().style.cursor = '';

  if (hoverId.length) {
    map.setFeatureState({ source: 'eta', sourceLayer: 'eta_score', id: hoverId }, { hover: false });
  }

  localStorage.setItem('state_hoverId', null);
  const popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
};

export { pointHover, pointHoverLeave, hoverGeoFill, leaveGeoFill };
