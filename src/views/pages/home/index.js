import { faMap, faTable } from '@fortawesome/free-solid-svg-icons';
import { library, dom } from '@fortawesome/fontawesome-svg-core';

let button = document.getElementById('nav-button');
let headerLink = document.getElementById('nav-button-link');
let mapLink = document.getElementById('map-link');
let glossaryLink = document.getElementById('glossary-link');

library.add(faMap, faTable);
dom.watch();

process.env.NODE_ENV;
headerLink.href = process.env.NODE_ENV === 'production' ? '/webmaps/pedestrian-portal/map.html' : '/map.html';
mapLink.href = process.env.NODE_ENV === 'production' ? '/webmaps/pedestrian-portal/map.html' : '/map.html';
glossaryLink.href =
  process.env.NODE_ENV === 'production' ? '/webmaps/pedestrian-portal/glossary.html' : '/glossary.html';

button.innerHTML = '<i class="fa-solid fa-map"></i><span>View Map</span>';
