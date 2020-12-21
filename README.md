# sidewalk-data-viz

Interactive webmaps that visualize the outputs of the sidewalk gap analysis,
leveraging data hosted on DVRPC's [vector tile server](https://tiles.dvrpc.org).

A live demo of the map can be seen here: [https://dvrpc.github.io/sidewalk-data-viz/](https://dvrpc.github.io/sidewalk-data-viz/)

## Development

Use `lite-server` to run a local develpoment server:

```bash
npm run dev
```

The webapp will run at [http://0.0.0.0:3000](http://0.0.0.0:3000)

## Build

Use `webpack` to transform source files into the build directory:

```bash
npm run build
```

## Data Analysis / Tileset Creation

The data analysis code (along with the creation of the vector tilesets) can be found in [`DVRPC/network-routing`](https://github.com/dvrpc/network-routing)
