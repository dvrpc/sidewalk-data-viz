import makeMap from './map/map.js';
import sources from './map/mapSources.js';
import { layers } from './map/mapLayers.js';
import { clickFill, handleBlockGroups } from './click.js';
import { handleLegend } from './legend.js';
import { defaultSidebarInfo } from './consts.js';
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
link.href = process.env.NODE_ENV === 'production' ? '/webmaps/eta/' : '/';
button.innerHTML = '<i class="fa-solid fa-home"></i><span>&nbsp;&nbsp;Home</span>';
sidebarInfo.innerHTML = defaultSidebarInfo;

const layerToggleButtons = document.querySelectorAll('div.layerTogglers label');

localStorage.setItem('state_hoverId', '');
localStorage.setItem('state_transit_hoverId', '');
localStorage.setItem('state_selectedId', '');
localStorage.setItem('state_selectedLayer', 'vulnerable');
localStorage.setItem('state_selectedAttributes', '');
localStorage.setItem('state_layerOpacity', 1);

// map
const map = makeMap();

function selectAll(element, type) {
  const checkboxes = document.querySelectorAll(`input.${type}-checkbox`);
  if (element.innerText === 'Select All') {
    element.innerText = 'Deselect All';
    checkboxes.forEach((cb) => {
      cb.checked = true;
      if (type === 'es') {
        toggleEssentialService('visible', cb.value);
      } else {
        toggleBus('visible');
        toggleRail('visible');
        togglePedNetwork('visible');
      }
    });
  } else {
    element.innerText = 'Select All';
    checkboxes.forEach((cb) => {
      cb.checked = false;
      if (type === 'es') {
        toggleEssentialService('none', cb.value);
      } else {
        toggleBus('none');
        toggleRail('none');
        togglePedNetwork('none');
      }
    });
  }
}
essentialSelectAll.addEventListener('click', () => selectAll(essentialSelectAll, 'es'));
transitSelectAll.addEventListener('click', () => selectAll(transitSelectAll, 'tr'));

removeSelectionButton.addEventListener('click', () => {
  const selectedId = localStorage.getItem('state_selectedId');
  map.setFeatureState({ source: 'eta', sourceLayer: 'eta_score', id: selectedId }, { selected: false });
  localStorage.setItem('state_selectedId', '');
  localStorage.setItem('state_selectedAttributes', '');
  sidebarInfo.innerHTML = defaultSidebarInfo;
  removeSelectionButton.style.visibility = 'hidden';
  map.zoomTo(map.getZoom() - 3);
});

slider.addEventListener('input', (e) => {
  const opacity = parseInt(e.target.value, 10) / 100;
  map.setPaintProperty('vulnerable-fill', 'fill-opacity', opacity);
  map.setPaintProperty('essential-fill', 'fill-opacity', opacity);
  map.setPaintProperty('transit-fill', 'fill-opacity', opacity);
  map.setPaintProperty('mismatch-fill', 'fill-opacity', opacity);
  map.setPaintProperty('priority-fill', 'fill-opacity', opacity);

  // Value indicator
  localStorage.setItem('state_layerOpacity', opacity);
  sliderValue.textContent = e.target.value + '%';
});

toggleExpand.addEventListener('mouseover', (e) => {
  if (!toggleExpand.parentElement.hasAttribute('open')) {
    legendToggles.style.backgroundColor = 'rgba(220, 220, 220, 0.9)';
  }
});

toggleExpand.addEventListener('click', (e) => {
  legendToggles.style.backgroundColor = !toggleExpand.parentElement.hasAttribute('open')
    ? 'rgba(247, 247, 247, 0.9)'
    : 'rgba(220, 220, 220, 0.9)';
});

toggleExpand.addEventListener('mouseout', (e) => {
  legendToggles.style.backgroundColor = 'rgba(247, 247, 247, 0.9)';
});

document.addEventListener('click', (e) => {
  const selectedLayer = localStorage.getItem('state_selectedLayer');

  const element = e.target;
  if (element.id === 'download-button') {
    handleDownload();
  }
  if (element.id === 'print-button') {
    handlePrint(selectedLayer);
  }
});

const toggleBus = (visibility) => {
  map.setLayoutProperty('bus-stops', 'visibility', visibility);
  map.setLayoutProperty('bus-stops', 'visibility', visibility);
  map.setLayoutProperty('bus-routes-septa', 'visibility', visibility);
  map.setLayoutProperty('bus-routes-njt', 'visibility', visibility);
};

const toggleRail = (visibility) => {
  map.setLayoutProperty('rail-stations', 'visibility', visibility);
  map.setLayoutProperty('rail-lines', 'visibility', visibility);
  map.setLayoutProperty('trolley-lines', 'visibility', visibility);
};

const togglePedNetwork = (visibility) => {
  map.setLayoutProperty('ped-lines', 'visibility', visibility);
  map.setLayoutProperty('ped-points', 'visibility', visibility);

  // map.setLayoutProperty('bus-walksheds', 'visibility', visibility);
};

const toggleEssentialService = (visibility, service) => {
  map.setLayoutProperty(service, 'visibility', visibility);
};

map.on('load', () => {
  for (const source in sources) map.addSource(source, sources[source]);

  for (const layer in layers) {
    const beforeId = layers[layer].type === 'fill' ? 'tunnel-path-trail' : 'road-label-simple';
    map.addLayer(layers[layer], beforeId);
  }
  map.on('mousemove', 'hover-fill', (e) => hoverGeoFill(e, map));
  map.on('mouseleave', 'hover-fill', () => leaveGeoFill(map));
  map.on('mousemove', ['rail-stations', 'bus-stops', 'es-food', 'es-health', 'es-senior', 'es-school'], (e) =>
    pointHover(e, map),
  );
  map.on('mouseleave', ['rail-stations', 'bus-stops', 'es-food', 'es-health', 'es-senior', 'es-school'], () =>
    pointHoverLeave(map),
  );
  map.on('click', 'hover-fill', (e) => clickFill(e, map));

  document.getElementById('legend-container').innerHTML = handleLegend('vulnerable');
  // add map events here (click, mousemove, popups, etc)
  // see popup.js for popup config fncs

  // add form events here (form.onchange, etc)
  mainForm.onchange = (e) => {
    const value = e.target.value;
    const selectedButton = document.getElementById(value + '-btn');
    const previousSelectedLayer = localStorage.getItem('state_selectedLayer');
    const selectedAttributes = localStorage.getItem('state_selectedAttributes');
    const currentLayerOpacity = localStorage.getItem('state_layerOpacity');
    layerToggleButtons.forEach((el) => el.classList.remove('toggle-btn-active'));
    selectedButton.classList.add('toggle-btn-active');
    document.getElementById('legend-container').innerHTML = handleLegend(value);

    if (selectedAttributes) {
      const text = handleBlockGroups(JSON.parse(selectedAttributes), value);
      document.getElementById('BGInfo').innerHTML = text;
    }

    map.setPaintProperty(value + '-fill', 'fill-opacity', parseFloat(currentLayerOpacity));
    map.setLayoutProperty(previousSelectedLayer + '-fill', 'visibility', 'none');
    map.setLayoutProperty(value + '-fill', 'visibility', 'visible');

    localStorage.setItem('state_selectedLayer', value);
  };

  checkboxForm.onchange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const visibility = checked ? 'visible' : 'none';
    //
    switch (value) {
      case 'bus':
        toggleBus(visibility);
        break;
      case 'rail':
        toggleRail(visibility);
        break;
      case 'ped':
        togglePedNetwork(visibility);
        break;
      default:
        toggleEssentialService(visibility, value);
        break;
    }
  };
  // see forms.js for sample form config fncs
});

// loading spinner
map.on('idle', () => {
  const spinner = map['_container'].querySelector('.lds-ring');
  spinner.classList.remove('lds-ring-active');
});

// modal
