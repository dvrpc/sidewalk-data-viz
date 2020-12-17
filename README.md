# sidewalk-data-viz

Interactive webmaps that visualize the outputs of the sidewalk gap analysis,
leveraging data hosted on DVRPC's [vector tile server](https://tiles.dvrpc.org).


## Local development

Run a local development server with `python -m http.server`


Visit [http://0.0.0.0:8000](http://0.0.0.0:8000)

## Tileset Creation

### Create a single tileset

In order to create a vector tileset in the `mbtiles` format, [download and install `tippecanoe`](https://github.com/mapbox/tippecanoe).

Once you've done this you can create a tileset from a `.geojson` file by executing:

```
tippecanoe -o stations.mbtiles -l stations -f -r1 -pk -pf sidewalkscore.geojson 
```

In this example we're converting `sidewalkscore.geojson` into `stations.mbtiles`.

### Merge multiple tilesets into one

To convert multiple tiles into a single grouped tileset:

```
tile-join -n ridescoreanalysis -f -o ridescoreanalysis.mbtiles stations.mbtiles isos.mbtiles
```
In this example we're building a set named `ridescoreanalysis.mbtiles` using `stations.mbtiles` and `isos.mbtiles`

### Serving the tilesets

Once you've built a tileset you can serve them locally with Docker:

```
docker run --rm -it -v "$(pwd):/data" -p 8080:80 maptiler/tileserver-gl
```

With this process running in the background you can refer to them in JavaScript with:

```javascript
var analysis_data = {
  "type": "vector",
  "url": "http://0.0.0.0:8080/data/ridescoreanalysis.json"
}
```

After deploying the tileset to a webserver, update the `"url"` value. In this example, we're changing to the URL to point at the domain `tiles.dvrpc.org`

```javascript
var analysis_data = {
  "type": "vector",
  "url": "https://tiles.dvrpc.org/data/ped-analysis.json"
}
```