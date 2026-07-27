# Equity Through Access (ETA) Map Toolkit (v2)

DVRPC created this ETA Priority Score Map Toolkit. This interactive web-based tool demonstrates disparities in access to essential services like hospitals, health clinics, recreational spaces, senior centers, and more in the Greater Philadelphia region. Users can view layers representing different datasets including the locations of essential services; bus routes, transit stops, and rail lines; transit walksheds; distributions of vulnerable populations like seniors, households in poverty, and people with disabilities; and areas where transit access is low. By reviewing these simple, color-coded layers, users can explore the relationships between transportation access, opportunity, and equity.

<br/>

## Setup

To run this project locally after cloning the repository first install the dependencies

```
- npm install
```

Next, create a .env file and copy the contents of .env_sample. You will need to provide a [mapbox access token ](https://docs.mapbox.com/help/getting-started/access-tokens/) for the MAPBOX_ACCESS_TOKEN variable

Finally, run the project

```
- npm start
```

To build the project, use

```
- npm run build
```

The build contents can be accessed in the newly created /dist folder

## JS Dependencies

ETA is primarily built with native Javscript/HTML/CSS, Mapbox-gl, and bundled using Webpack.

- [webpack (v5.10.3)](https://webpack.js.org/concepts/)
- [mapbox-gl (v3.6.0)](https://docs.mapbox.com/mapbox-gl-js/api/)
- [fontawesome (v6.6.0)](https://fontawesome.com/)
- [jspdf (v2.5.2)](https://raw.githack.com/MrRio/jsPDF/master/docs/index.html)

## Geospatial Data Dependencies

ETA datasets are utilizing hosted feature services on DVRPC AGOL, DVRPC Open Data Portal as well as Vector Tiles from DVRPCs TileServer GL
