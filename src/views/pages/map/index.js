import makeMap from './map/map.js';
import mapboxgl from 'mapbox-gl';
import sources from './map/mapSources.js';
import { layers } from './map/mapLayers.js';
import { analysis_meta } from './consts.js';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faHouse, faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faHouse, faXmark);
dom.watch();

const mainForm = document.getElementById('main-form');
const checkboxForm = document.getElementById('checkbox-form');
const analysisLayerControls = document.getElementById('analysis-layer-checkboxes');
const analysisLayerGroup = analysisLayerControls.closest('.checkbox-subgroup');
const analysisLegend = document.getElementById('legend-container');
const methodologyTitle = document.getElementById('methodology-title');
const methodologyDescriptions = document.querySelectorAll('[id$="-description"]');
const sidebarContent = document.getElementById('sidebar-content');
const legendContainerParent = document.querySelector('.legend-container-parent');
const mapControls = document.getElementById('legend-toggles');
const link = document.getElementById('nav-button-link');
const button = document.getElementById('nav-button');

const themeHeading = mainForm.querySelector('.sidebar-h3');
const layerHeading = checkboxForm.querySelector('.sidebar-h3');
themeHeading.id = 'theme-heading';
layerHeading.id = 'layer-heading';

const createSidebarSection = (className, labelledBy) => {
  const section = document.createElement('section');
  section.className = `sidebar-section ${className}`;
  section.setAttribute('aria-labelledby', labelledBy);
  return section;
};

const themeSection = createSidebarSection('sidebar-theme-section', 'theme-heading');
const methodologySection = createSidebarSection('sidebar-methodology-section', 'methodology-title');
const contextSection = document.createElement('section');
contextSection.className = 'legend-container map-context-controls';
contextSection.setAttribute('aria-labelledby', 'layer-heading');

const contextToggle = document.createElement('button');
contextToggle.className = 'overlay-minimize';
contextToggle.type = 'button';
contextToggle.setAttribute('aria-expanded', 'true');
contextToggle.setAttribute('aria-controls', 'checkbox-form');
contextToggle.innerHTML = '<span>Context</span><span class="overlay-minimize-icon" aria-hidden="true">−</span>';

themeSection.appendChild(mainForm);
methodologySection.append(methodologyTitle, ...methodologyDescriptions);
contextSection.append(contextToggle, checkboxForm);
sidebarContent.append(themeSection, methodologySection);
legendContainerParent.appendChild(contextSection);
mapControls.remove();

const initializeOverlayMinimizers = () => {
  document.querySelectorAll('.overlay-minimize').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const container = toggle.closest('.legend-container');
      const isMinimized = container.classList.toggle('is-minimized');
      const overlayName = container.classList.contains('map-context-controls') ? 'context controls' : 'legend';
      toggle.setAttribute('aria-expanded', String(!isMinimized));
      toggle.setAttribute('aria-label', `${isMinimized ? 'Expand' : 'Minimize'} ${overlayName}`);
      toggle.querySelector('.overlay-minimize-icon').textContent = isMinimized ? '+' : '−';
    });
  });
};

initializeOverlayMinimizers();

link.href = process.env.NODE_ENV === 'production' ? '/webmaps/sidewalk-gaps/' : '/';
button.innerHTML = '<i class="fa-solid fa-home"></i><span>&nbsp;&nbsp;Home</span>';

// map
const map = makeMap();

const analysisLayerIds = Object.values(analysis_meta).flatMap((meta) => meta.layer_ids);
const baseLayerIds = ['sidewalks', 'crosswalks', 'county-outline', 'municipality-outline'];
const sidewalkViewLayerIds = ['sidewalks', 'crosswalks'];
let activeTheme;
let segmentPopup;

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

const renderAnalysisLayerControls = (themeValue) => {
  const meta = analysis_meta[themeValue];
  analysisLayerControls.innerHTML = '';
  if (!meta) return;

  analysisLayerGroup.hidden = meta.layer_ids.length === 0;

  meta.layer_ids.forEach((layerId, index) => {
    const labelText = meta.layer_names[index] ?? layerId;
    const label = document.createElement('label');
    label.className = 'label-input overlay-input';

    const input = document.createElement('input');
    input.id = `analysis-${layerId}`;
    input.className = 'switch-input es-checkbox';
    input.type = 'checkbox';
    input.value = layerId;
    input.checked = true;

    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${labelText}`));
    analysisLayerControls.appendChild(label);
  });
};

const updateBaseLayerControls = (isSidewalkView) => {
  baseLayerIds.forEach((layerId) => {
    const control = checkboxForm.querySelector(`.switch-input[value="${layerId}"]`);
    if (!control) return;

    const label = control.closest('label');
    const isSidewalkViewLayer = sidewalkViewLayerIds.includes(layerId);
    label.hidden = isSidewalkView && !isSidewalkViewLayer;

    if (isSidewalkView) {
      if (isSidewalkViewLayer) control.checked = true;
      setLayerVisibility(layerId, isSidewalkViewLayer);
    } else {
      setLayerVisibility(layerId, control.checked);
    }
  });
};

const renderAnalysisDetails = (themeValue) => {
  const meta = analysis_meta[themeValue];
  if (!meta) return;

  methodologyTitle.textContent = meta.methodology_title;
  methodologyDescriptions.forEach((description) => {
    description.hidden = description.id !== `${themeValue}-description`;
  });

  analysisLegend.innerHTML = '';
  const title = document.createElement('h2');
  title.className = 'analysis-legend-title';
  title.textContent = meta.legend.title;
  analysisLegend.appendChild(title);

  if (meta.legend.description) {
    const description = document.createElement('p');
    description.className = 'analysis-legend-description';
    description.textContent = meta.legend.description;
    analysisLegend.appendChild(description);
  }

  const list = document.createElement('ul');
  list.className = 'analysis-legend-list';
  if (themeValue === 'transit-analysis' || themeValue === 'school-analysis') {
    list.classList.add('analysis-legend-list--walk-time');
  }
  meta.legend.items.forEach(({ label, color, symbol }) => {
    const item = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = `analysis-legend-swatch analysis-legend-swatch--${symbol}`;
    if (color) swatch.style.backgroundColor = color;
    swatch.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = label;
    item.append(swatch, text);
    list.appendChild(item);
  });
  analysisLegend.appendChild(list);
};

const handleThemeSelection = (themeValue) => {
  const selectedLayers = analysis_meta[themeValue]?.layer_ids ?? [];
  const isSidewalkView = themeValue === 'sidewalk-view';
  activeTheme = themeValue;
  if (segmentPopup && !isSidewalkView) {
    segmentPopup.remove();
    segmentPopup = undefined;
  }
  renderAnalysisLayerControls(themeValue);
  renderAnalysisDetails(themeValue);

  analysisLayerIds.forEach((layerId) => {
    const visible = selectedLayers.includes(layerId);
    setLayerVisibility(layerId, visible);

    const control = checkboxForm.querySelector(`.switch-input[value="${layerId}"]`);
    if (control) control.checked = visible;
  });
  updateBaseLayerControls(isSidewalkView);
  updateThemeButtons(themeValue);
};

const formatPropertyLabel = (property) =>
  property
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

const createSegmentPopupContent = (layerId, properties) => {
  const container = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = layerId === 'crosswalks' ? 'Crosswalk segment' : 'Sidewalk segment';
  container.appendChild(heading);

  Object.entries(properties)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .forEach(([property, value]) => {
      const row = document.createElement('span');
      row.className = 'popup-span';
      row.textContent = `${formatPropertyLabel(property)}: ${value}`;
      container.appendChild(row);
    });

  return container;
};

const addSegmentPopup = (layerId, event) => {
  if (activeTheme !== 'sidewalk-view' || !event.features?.length) return;
  segmentPopup?.remove();
  segmentPopup = new mapboxgl.Popup()
    .setLngLat(event.lngLat)
    .setDOMContent(createSegmentPopupContent(layerId, event.features[0].properties))
    .addTo(map);
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
['sidewalks', 'crosswalks'].forEach((layerId) => {
  map.on('click', layerId, (event) => addSegmentPopup(layerId, event));
  map.on('mouseenter', layerId, () => {
    if (activeTheme === 'sidewalk-view') map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', layerId, () => {
    map.getCanvas().style.cursor = '';
  });
});

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
