osm-analytics: data analysis tool frontend
=========================================

[![Join the chat at https://gitter.im/hotosm/osm-analytics](https://badges.gitter.im/hotosm/osm-analytics.svg)](https://gitter.im/hotosm/osm-analytics?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

OSM-Analytics lets you analyse interactively how specific OpenStreetMap features are mapped in a specific region.

Say, you'd like to know when most of a specific feature type (e.g. buildings) in a specific country or city were added. This tool lets you select the geographical region of interest and shows a graph of the mapping activity in the region. You can even select a specific time interval to get the number of touched features in that period, and the map will highlight the matching features. Alternatively, one can view the distribution of features by their mapper's user experience. The tool also gives a side by side comparison of the map state at different points in time and lets you view which [HOT](https://hotosm.org/) projects may have included the mapping of a region.

Features
--------

* supported feature types: *buildings* (any closed osm way with a building tag), *roads* (any osm way with a highway tag), *rivers* (any osm way with a waterway tag)
* graphs of feature *recency* or *mapper experience*
* highlighting of features by custom date range or user experience interval
* calculated statistics: total number/length of features in selected region and date/experience range, number of contributors
* shows which hot projects influenced the mapping of the selected region
* compare map at different points in time
* data updated daily

Technical Overview & Limitations
--------------------------------

See [documentation/architecture.md](documentation/architecture.md) for background information.

Installation and Usage
----------------------

The frontend is implemented in React/Redux and based on [tj/Frontend Boilerplate](https://github.com/tj/frontend-boilerplate).

Install dependencies:

```
$ npm install
```

Run in development mode:

```
$ npm start
```

Generate static build:

```
$ npm run build
```

The [`deploy.sh`](https://github.com/hotosm/osm-analytics/blob/master/deploy.sh) script can be useful to publish updates on github-pages.

Embedding
---------

This user interface supports a custom UI for embedding on 3rd party websites, using an HTML `iframe`. It allows generating a
time comparison between two points in time for the same region.

![Comparison map](https://github.com/GFDRR/osm-analytics/blob/master/documentation/embed-example-1.png?raw=true "Comparison map")


The above visualization can be generated using a specific URL structure:

`https://osm-analytics.org/#/compare/<region>/<start_year>...<end_year>/<feature_layer>/embed/<theme_name>`

- __iframe_base_url__ (`http://osm-analytics.org`)
- __region__ the area of interest the embedded map is shown for. Can be a bounding box (`bbox:110.28050,-7.02687,110.48513,-6.94219`), an [encoded polyline](https://www.npmjs.com/package/@mapbox/polyline) of a polygon (e.g. `polygon:ifv%7BDndwkBx%60%40aYwQev%40sHkPuf%40ss%40%7BfA_%40uq%40xdCn%7D%40%5E`)), or a hot project id (e.g. `hot:4053`) or a link to a github gist that contains a `polygon.geojson` file (e.g. `gist:36ea172ef996a44d36a554383d5fb4fa`).
- __start_year__ (`2016`) represents the start year of an OpenDRI project
- __end_year__ (`now`) represents the end year of an OpenDRI project. `now` can also be provided to compare with latest OSM data
- __feature_layer__ (`buildings`) compare `buildings`, `highways` or `waterways`
- __theme_name__ (`default`) use the `default` OSM Analytics visual style, or the `opendri` theme

The *gap detection* view can also be used as an embedded map in a very similar way:

`https://osm-analytics.org/#/gaps/<region>/buildings-vs-ghs/embed/<theme_name>`

The *edit recency* and *user experience* views can also be embedded like this:

`https://osm-analytics.org/#/show/<region>/<feature_layer>/embed/<theme_name>/recency` or `https://osm-analytics.org/#/show/<region>/<feature_layer>/embed/<theme_name>/experience`

Here, one can optionally supply a time or user experience selection, which triggers highlights respective features or regions on the map that fall into the given time period or user experience range. Just append the respective query parameter to the embed URL: `/?timeSelection=<timestamp_from>,<timestamp_to>` (timestamps are seconds since epoch) or `/?experienceSelection=<experience_from>,<experience_to>` (experience values as defined in the respective layer's [experience](https://github.com/hotosm/osm-analytics-config/blob/master/analytics-json.md#experience-field) field).

See Also
--------

* [lukasmartinelli/osm-activity](https://github.com/lukasmartinelli/osm-activity) – similar to OSM-Analytics, but with a simpler, more basic user interface
* [OSMatrix](http://wiki.openstreetmap.org/wiki/OSMatrix) by GIScience Heidelberg – "precursor" of OSM-Analytics
* [joto/taginfo](https://github.com/joto/taginfo) – aggregate statistics for all OSM tags
* [tyrasd/taghistory](https://github.com/tyrasd/taghistory) – tagging history for all OSM tags
* [Crowdlens](http://stateofthemap.us/2016/learning-about-the-crowd/) by Sterling Quinn – prototype of interactive mapping history visualization
* [mapbox/osm-analysis-collab](http://mapbox.github.io/osm-analysis-collab/osm-quality.html) – misc OSM contributor analyses based on osm-qa-tiles data
