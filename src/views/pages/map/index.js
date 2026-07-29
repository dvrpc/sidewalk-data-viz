import makeMap from './map/map.js';
import sources from './map/mapSources.js';
import { layers } from './map/mapLayers.js';
import { clickFill, handleBlockGroups } from './click.js';
import { handleLegend } from './legend.js';
import { defaultSidebarInfo, analysis_meta } from './consts.js';
import { hoverGeoFill, leaveGeoFill, pointHover, pointHoverLeave } from './hover.js';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faPrint, faUsers, faHouse, faMap, faDownload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { handleDownload } from './download.js';
import { handlePrint } from './print.js';

library.add(faDownload, faUsers, faPrint, faHouse, faMap, faXmark);
dom.watch();

const mainForm = document.getElementById('main-form');
const checkboxForm = document.getElementById('checkbox-form');
const link = document.getElementById('nav-button-link');
const button = document.getElementById('nav-button');
const sidebarInfo = document.getElementById('BGInfo');
const removeSelectionButton = document.getElementById('remove-selection-btn');
const essentialSelectAll = document.getElementById('essential-select-all');
const transitSelectAll = document.getElementById('transit-select-all');
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');
const toggleExpand = document.getElementById('toggle-expand');
const legendToggles = document.getElementById('legend-toggles');
const closeForm = document.getElementById('close-form');

link.href = '/';
link.href = process.env.NODE_ENV === 'production' ? '/webmaps/sidewalk-gaps/' : '/';
button.innerHTML = '<i class="fa-solid fa-home"></i><span>&nbsp;&nbsp;Home</span>';

// map
const map = makeMap();

const analysisLayerIds = Object.values(analysis_meta).flatMap((meta) => meta.layer_ids);

const setLayerVisibility = (layerId, visible) => {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
};

const updateThemeButtons = (selectedValue) => {
  const themeButtons = mainForm.querySelectorAll('.toggle-btn');
  themeButtons.forEach((button) => {
    const input = button.querySelector('input[name="theme"]');
    button.classList.toggle('toggle-btn-active', input?.value === selectedValue);
  });
};

const handleThemeSelection = (themeValue) => {
  const selectedLayers = analysis_meta[themeValue]?.layer_ids ?? [];
  analysisLayerIds.forEach((layerId) => {
    const visible = selectedLayers.includes(layerId);
    setLayerVisibility(layerId, visible);
    const control = checkboxForm.querySelector(`.switch-input[value="${layerId}"]`);
    if (control) control.checked = visible;
  });
  updateThemeButtons(themeValue);
};

const handleSwitchToggle = ({ target }) => {
  if (!target.matches('.switch-input')) return;
  setLayerVisibility(target.value, target.checked);
};

const addSourcesToMap = () => {
  Object.entries(sources).forEach(([sourceId, sourceDef]) => {
    if (!map.getSource(sourceId)) map.addSource(sourceId, sourceDef);
  });
};

const addLayersToMap = () => {
  Object.values(layers).forEach((layerDef) => {
    if (!map.getLayer(layerDef.id)) map.addLayer(layerDef);
  });
};

const initializeMapLayers = () => {
  addSourcesToMap();
  addLayersToMap();
  const initialTheme = mainForm.querySelector('input[name="theme"]:checked');
  if (initialTheme) handleThemeSelection(initialTheme.value);
};

map.on('load', initializeMapLayers);

// loading spinner
map.on('idle', () => {
  const spinner = map['_container'].querySelector('.lds-ring');
  spinner.classList.remove('lds-ring-active');
});

mainForm.addEventListener('change', (event) => {
  if (event.target.name !== 'theme') return;
  handleThemeSelection(event.target.value);
});

checkboxForm.addEventListener('change', handleSwitchToggle);
