import { faHouse, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { library, dom } from '@fortawesome/fontawesome-svg-core';

library.add(faHouse, faFilePdf);
dom.watch();

process.env.NODE_ENV;

let homeLink = document.getElementById('home-link');
homeLink.href = process.env.NODE_ENV === 'production' ? '/webmaps/pedestrian-portal/' : '/';

const navButtonLink = document.getElementById('nav-button-link');
const navButton = document.getElementById('nav-button');

navButtonLink.href = process.env.NODE_ENV === 'production' ? '/webmaps/pedestrian-portal/' : '/';
navButton.innerHTML = '<i class="fa-solid fa-house"></i><span>&nbsp;&nbsp;Home</span>';
