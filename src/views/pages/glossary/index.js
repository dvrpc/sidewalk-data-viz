import { faHouse, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { library, dom } from '@fortawesome/fontawesome-svg-core';

library.add(faHouse, faFilePdf);
dom.watch();

process.env.NODE_ENV;

let homeLink = document.getElementById('home-link');
homeLink.href = process.env.NODE_ENV === 'production' ? '/webmaps/pedestrian-portal/' : '/';
