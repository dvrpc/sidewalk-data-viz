mapboxgl.accessToken =
  "pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA";

const initMap = () => {
  // const longitudeOffset = window.innerWidth > 800 ? -75.8 : -75.2273;
  const zoom = window.innerWidth <= 420 ? 7.3 : 8.65;

  return new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-75.15913247977207, 40.02727228000965],
    zoom: zoom,
  });
};

const makeRegionalExtentControl = (map) => {
  // const longitudeOffset = window.innerWidth > 800 ? -75.8 : -75.2273;
  const zoom = window.innerWidth <= 420 ? 7.3 : 8.65;

  const dvrpcExtent = {
    center: [-75.15913247977207, 40.02727228000965],
    zoom: zoom,
  };

  const navigationControl = new mapboxgl.NavigationControl();

  // create custom button elements
  const button = document.createElement("button");
  const icon = document.createElement("img");

  button.type = "button";
  icon.id = "regional-extent-img";
  icon.alt = "DVRPC Alternative Logo";
  icon.src = "https://www.dvrpc.org/img/banner/new/bug-favicon.png";

  button.classList.add("mapboxgl-ctrl-icon");
  button.classList.add("mapboxgl-ctrl-dvrpc");

  button.setAttribute("aria-label", "Default DVRPC Extent");

  button.onclick = () =>
    map.flyTo({ center: dvrpcExtent.center, zoom: dvrpcExtent.zoom });

  button.appendChild(icon);

  // plug into mapbox fncs
  navigationControl._extent = button;
  navigationControl._container.appendChild(button);

  return navigationControl;
};

const makeMap = () => {
  const map = initMap();

  // Add a geocoder to the map. Limit the bbox to the DVRPC region.
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: "Type here to zoom to...",
    bbox: [-76.210785, 39.478606, -73.885803, 40.601963],
  });

  map.addControl(geocoder, "top-left");

  const control = makeRegionalExtentControl(map);
  map.addControl(control, "bottom-right");

  return map;
};

export default makeMap;
