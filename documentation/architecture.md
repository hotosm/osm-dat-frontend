Architecture and Infrastructure
===============================

Requirements and Prerequsites
-----------------------------

### Overall Project Goals

[OSM Analytics](https://wiki.openstreetmap.org/wiki/OSM_Analytics) is a tool for exploring and analyzing OpenStreetMap data. It should help making sense of the large amount of diverse geo-data that has been contributed by over a million volunteer contributors during the last one and a half decades.

OSM-Analytics has been created with the [goal](https://www.knightfoundation.org/grants/201551652/) of making OSM data more easy interpretable by the general public:

> Helping journalists, humanitarians, academics, government officials and others determine the quality of data in the OpenStreetMap database for a user-defined area, depending on the topic of interest.

Further goals are driven by questions and requirements of different groups working with and contributing to OpenStreetMap data. For example in order to [support the OpenCities Africa project](https://docs.google.com/spreadsheets/d/1-NweuHwkXaO9XCEa8w5Xny4lZdBPul3kF9hYAKg0Nr0/edit#gid=0), various questions are to be answered that can be categorized into three categories:

* planning activities and tracking progress
* quality assurance assistance
* community dynamics

 ### Core Principles

OSM-Analytics is built around a few core principles that follow from the project goals

* global coverage
* frequent / regular data updates
* flexible, customizable system
* "fast" and responsive user interface

### Data Sources

[osm-qa-tiles](http://osmlab.github.io/osm-qa-tiles/) is used as the primary source of (processed) OpenStreetMap data.

Further data sources are for example [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) for geocoding, the [HOT tasking manager API](https://tasks.hotosm.org/api-docs), etc.

System Architecture: User Interface
-----------------------------------

See the [about page](http://osm-analytics.org/#/about) or this [blog post](https://www.hotosm.org/updates/2016-04-28_explore_how_the_world_is_mapped_with_osm_analytics) for a general introduction into the frontend features of OSM-Analytics.

### Feature Layers

The user can select between different layers, which contain information about different OSM features, for example buildings or highways. For the low zoom levels, a heatmap is displayed which shows the relative density of the various features – depending on the feature type, either as counts (e.g of builings) or as total length (e.g. of roads).

In the highest zoom level, each layer displays the raw geometries of the respecitve OSM features.

### Analysis Panel

After selecting an area of interest (e.g. by using the geocoding search box or by manually selecting an area), a few statistics about the respective region are displayed in a bar on the bottom of the page. Graphs of feature recency (or mapper experience) are shown to indicate when the data has last been modified (or how experienced the mappers in the region are). 

After selecting a date range or user experience interval, the respective features or aggregation squares of the heatmap are highlighted on the map, and the statistics are updated accordingly.

In addition, the number of contributors and a list of HOT projects in the selected region is displayed.

From the analysis panel it is possible to switch to a "compare" view where the map panel is split into two, and two different time snapshot can be seen side by side.

System Architecture: Data Processing
------------------------------------

### Overview

The backend takes data from osm-qa-tiles and generates sets of vector tiles that contain only a specific set of features (e.g. builings). The vector tiles contain raw individual feature geometries at high zoom levels and an aggregated view at low zoom levels where features are aggregated into square bins.

The data from these vector tiles is used to display the features on the map and to generate the statistics (graphs, number of features, contributors, etc.) by intersecting the feature geometries with the user supplied area of interest using [turf](http://turfjs.org/).

### Data Sampling

The aggregated bins contained in the lower zoom level vector tiles contain the absolute number (or total length for linear objects) of features in the respective cell which is used to display a basic heatmap style map. In addition to that, each cell contains a set of samples of the properties of the individual features that went into the respective cell (i.e. timestamp samples, user experience samples). This is necessary in order to limit the number of features to transfer to the browser.

These data samples represent the statistical distribution of the constituent data in each cell and allow one to reconstruct the distribution of the data in an arbitrary region. They also allow one to extrapolate the number of features that fall into an given property interval (e.g. a date range).

### User Experience

Each feature is assigned a user experience value that estimates the contributor's experience in mapping the respective type of feature by looking at the total number (or length) of features that have currently been last edited by this user. For example, a user that has contributed many buildings but hardly any roads gets assigned a large score for buildings but a low one for buildings.

In the UI, this data is then displayed on a logarithmic scale histogram, displaying how many features have been added by users of different experience levels (beginners, intermediate users, experts).

Implementation
--------------

The overall system is split into two different parts: A data processing pipeline (called the *cruncher*), and front-end clients. In addition to the main client running at osm-analytics.org, there exists also a [data API](https://github.com/GFDRR/osm-analytics-api) that works on the same data.

The results of the cruncher is a set of [vector tiles](https://www.mapbox.com/vector-tiles/) in a schema specific to OSM-Analytics (defined by the aggregation grid schema described above). These vector tiles are also the main communication interface between the backend and frontend: The clients request the required vector tiles for the various analysis and visualization tasks.

### Cruncher

The cruncher is responsible for transforming the osm-qa-tiles input data into the OSM-Analytics vector tiles. The overall process is shown in this [flow chart](https://github.com/hotosm/osm-analytics-cruncher/blob/master/documentation/diagram.svg).

It is a multi step process: At first the user experience data is generated by iterating over the whole planet of osm-qa-tiles using a [tile-reduce](https://github.com/mapbox/tile-reduce) job. Another tile-reduce job is responsible for filtering the different feature layers out of the osm-qa-tiles input data and at the same time aggregates the data into the OSM-Analytics "bins" schema (which contains the data samples and is used for the heatmap map views). A third tile-reduce job is then applied on the result of this aggregation step to produce the lower zoom levels.

### Server

The results of the cruncher step is completed, the resulting vector tiles data is made accessible by a http server that responds to the requests made by the clients (i.e. return the appropriate vector tiles from a set of `.mbtiles` files containing the OSM-Analytics vector tiles).

### Frontend

-- to write --

### osm-analytics-api

-- to write --

Deployment
----------

### Maintainance

Currently, the different parts of the OSM-Analytics Stack are deployed and maintained by differnet entities:

* the base data (osm-qa-tiles) is provided by [mapbox](https://mapbox.com) on https://osmlab.github.io/osm-qa-tiles/
* the cruncher, the vector tiles server as well as the osm-analytics-api are run by the [World Bank](https://opendri.org/)
* the osm-analytics frontend and website are maintained by the [Humanitarian OpenStreetMap Team](https://www.hotosm.org/)

### Computation Requirements

-- to write --

Limitations
-----------

### OSM History

All data in this tool is based only derived from current OSM planet data (it doesn't incorporate the full history data), which means that deleted features as well as modifications of features are not incorporated in the analysis. This introduces an incalculable systematic error into any of the generated statistics (except totals such as the number of buildings in a region). This means that when interpreting the graphs and statistics one has to keep in mind that the data only represents the latest modification status of each object.

This issue could be fixed completely by taking the full history OSM planet data into account.

### Binning

The data binning at low zoom levels and it's inherent data sampling (see above) introduces both a geometric coarsening (a grid cell is either included as a whole in the selected region or not at all) and a statistical approximation of all generated values. The statistical error depends on the number of features in the affected region and time/experience interval, but for typical scenarios the relative error of totals should be below 1%.

### Multipolygons

The input data from osm-qa-tiles currently doesn't support multipolygon relations, which means that for example buildings that are mapped as a multipolygon relation are missing in the analysis and map view.

OC-Africa Development
---------------------

Recent development is going to introduce a few improvements to the OSM-Analytics architecture. Referencing below the different work packages from this github ticket: https://github.com/hotosm/osm-analytics/issues/79

### Gap Analysis

This will introduce a new analysis tab to OSM-Analytics called *gap analysis*. There, different OSM-Analytics feature layers are directly compared to some external reference data set.

In order to make this comparison possible, the given external reference data set will be converted into a vector tile schema very similar to the structure of the OSM-Analytics feature layers (i.e. aggregated into the same bin structure). After this is done, the concrete comparison of the OSM feature layer with the reference data can be accomplished in the client directly.

The transformation from the external data set into the OSM-Analytics vector tile schema is done in a process similar to the OSM-Analytics cruncher after the reference data has been converted into vector tiles, so that the data can be read by the cruncher. The main difference to the normal cruncher process is here that the reference data does only have to be crunched once (and not on a regular schedule like the OSM data).

### Expanding Coverage

The goal of this work package is to provide an easier way to add more feature layers to the OSM-Analytics tool. Currently, adding new layers required tweaking settings and parameters in a number of different places (e.g. the cruncher, the server and frontend code as well as frontend styling, etc.) and was not easily be accomplishable by people that are not perfectly aware of the full OSM-Analytics stack.

Introducing a single configuration file for defining feature layers will help making the process of adding more

At the same time the cruncher will be refactored to be able to process more layers more quickly. This improved vertical scalability is achieved by refactoring the cruncher, so that it can process all defined layers in a single tile-reduce job (compared to one tile-reduce job per feature layer).

A secondary (independent) improvement on this regard is to improve the OSM-history related metrics displayed by OSM-Analytics – for example making the graph showing the evolution of amount of features over time more fine grained (currently only available in a yearly resolution), or replacing the information about "latest modifications" with a more complete picture of all edits to the respective features. See the following section for a possible means to overcome this issue.

### Community Dynamics

Some important questions outlined in the [*prelimiary survey of OpenCities Africa mapping partners’ needs*](https://docs.google.com/spreadsheets/d/1-NweuHwkXaO9XCEa8w5Xny4lZdBPul3kF9hYAKg0Nr0/edit#gid=0) cannot be answered by the existing software and data stack used by OSM-Analytics, because they require knowledge of the full history of OpenStreetMap data (which is not provided by osm-qa-tiles). This includes, but is not limited to, answering questions like the total number of contributors to OpenStreetMap in a given region, and the nature and interaction between these contributions.

For this reason, the objective of further development on community dymanics analysis of OSM-Analytics will be the setting up of an enhanced or partially new data base, which allows querying of the full data history of OpenStreetMap. Different technical approaches are still to be evaluated, including the usage of the [ohsome.org “OpenStreetMap History Data Analysis” platform](http://ohsome.org/about.html), which is currently being developed at Heidelberg University: The ohsome data analysis framework uses open-source big data software (Apache Ignite) to make OpenStreetMap’s full history data analyzable in a flexible way (leveraging the Map-Reduce programming paradigm). This functionality can be exposed to the general public via web-based APIs, and used to enrich OSM-Analytics’ functionality with detailed information about the contribution history of OpenStreetMap.
