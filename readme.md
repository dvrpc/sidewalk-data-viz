# Pedestrian Portal

The pedestrian portal collects various DVRPC pedestrian analyses into one central webmap with toggleable analysis layers. You can explore the region's sidewalk network, sidewalk gaps, and sidewalk connectivity. This was built to replace a deprecated wordpress site.

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

The build contents can be accessed in the /dist folder

## Geospatial Data Dependencies

All datasets are available on the [data catalog](https://catalog.dvrpc.org)
