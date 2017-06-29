export default ({ aggregatedFill, highlightFill }) => [
  {
    id: 'highways-raw',
    paint: {
      'line-width': 1,
      'line-color': aggregatedFill,
      'line-opacity': 1
    }
  },
  {
    id: 'highways-raw-highlight',
    paint: {
      'line-width': 2,
      'line-color': highlightFill,
      'line-opacity': 1
    }
  },
  {
    id: 'highways-aggregated-0',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[10, 0.1], [13, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-1',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[8, 0.1], [11, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-2',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[6, 0.1], [9, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-3',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[4, 0.1], [7, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-4',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[2, 0.1], [5, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-5',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[0, 0.1], [3, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-6',
    paint: {
      'fill-color': aggregatedFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[0, 0.7], [2, 1.0], [12, 1.0]]
      }
    }
  },

  {
    id: 'highways-aggregated-highlight-0',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[10, 0.1], [13, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-highlight-1',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[8, 0.1], [11, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-highlight-2',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[6, 0.1], [9, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-highlight-3',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[4, 0.1], [7, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-highlight-4',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[2, 0.1], [5, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-highlight-5',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[0, 0.1], [3, 1.0], [12, 1.0]]
      }
    }
  },
  {
    id: 'highways-aggregated-highlight-6',
    paint: {
      'fill-color': highlightFill,
      'fill-antialias': false,
      'fill-opacity': {
        base: 1,
        stops: [[0, 0.7], [2, 1.0], [12, 1.0]]
      }
    }
  }
]
