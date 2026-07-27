// functions to create and configure popups

// import makePopup in index.js to create an instance of the mapbox popup
const makePopup = () => new mapboxgl.Popup();

// on map event, pass popup instance + output of popup HTML function into addPopup
const addPopup = (map, lnglat, html, popup) => {
  popup.setLngLat(lnglat).setHTML(html).addTo(map);
};

// create custom popup HTML functions here. export to index.js

export { makePopup, addPopup };
