# sidewalk-data-viz

Interactive webmaps that visualize the outputs of the sidewalk gap analysis,
leveraging data hosted on DVRPC's [vector tile server](https://tiles.dvrpc.org).

Vector tile geometries are styled with attributes saved within a companion text file.


## ``/example/``

Copied from Chris Pollard's [test repo](https://github.com/crvanpollard/webmapapp_testing/tree/master/Mapbox_Vector_Jsontable).


## ``/html/segment_gaps.html``

Shows the results of the [sidewalk classification process](https://github.com/dvrpc/network-routing/blob/master/sidewalk_gaps/segments/centerline_sidewalk_coverage.py): which segments are missing full sidewalk coverage?


## ``/html/network_gaps.html``

Shows the results of the ``pandana`` [sidewalk network analysis](https://github.com/dvrpc/network-routing): which nodes on the existing sidewalk network are disconnected from other nearby nodes?


## Local development

Run a local development server with ``Python``:

```
python -m http.server
```

Visit [http://0.0.0.0:8000/html/network_gaps.html](http://0.0.0.0:8000/html/network_gaps.html)
or [http://0.0.0.0:8000/html/segment_gaps.html](http://0.0.0.0:8000/html/segment_gaps.html)


The example can be seen at [http://0.0.0.0:8000/example/](http://0.0.0.0:8000/example/)

## Create a single tileset

In order to create a vector tileset in the `mbtiles` format, [download and install `tippecanoe`](https://github.com/mapbox/tippecanoe).

Once you've done this you can create a tileset from a `.geojson` file by executing:

```
tippecanoe -o stations.mbtiles -l stations -f -r1 -pk -pf sidewalkscore.geojson 
```

In this example we're converting `sidewalkscore.geojson` into `stations.mbtiles`.

## Merge multiple tilesets into one

To convert multiple tiles into a single grouped tileset:

```
tile-join -n ridescoreanalysis -f -o ridescoreanalysis.mbtiles stations.mbtiles isos.mbtiles
```
In this example we're building a set named `ridescoreanalysis.mbtiles` using `stations.mbtiles` and `isos.mbtiles`

## Serving the tilesets

Once you've built a tileset you can serve them locally with Docker:

```
docker run --rm -it -v $(pwd):/data -p 8080:80 maptiler/tileserver-gl
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