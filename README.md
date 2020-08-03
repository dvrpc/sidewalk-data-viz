# sidewalk-data-viz
Interactive webmaps that visualize the outputs of the sidewalk gap analysis


## ``/example/``

Copied from Chris Pollard's [test repo](https://github.com/crvanpollard/webmapapp_testing/tree/master/Mapbox_Vector_Jsontable).

Vector tile geometries are styled with attributes saved within a companion text file.


## ``/html/segment_gaps.html``

Shows the results of the sidewalk classification process: which segments are missing full sidewalk coverage?


## ``/html/network_gaps.html``

Shows the results of the ``pandana`` sidewalk analysis: which nodes on the existing sidewalk network are disconnected from other nearby nodes?


## Local development

Run a local development server with ``Python``:

```
python -m http.server
```

Visit [http://0.0.0.0:8000/html/network_gaps.html](http://0.0.0.0:8000/html/network_gaps.html)
or [http://0.0.0.0:8000/html/segment_gaps.html](http://0.0.0.0:8000/html/segment_gaps.html)