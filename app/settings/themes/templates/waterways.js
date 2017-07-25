export default ({ aggregatedFill, highlightFill }) => [
  {
    id: 'waterways-raw',
    paint: {
      'line-width': 1,
      'line-color': aggregatedFill,
      'line-opacity': 1
    }
  },
  {
    id: 'waterways-raw-highlight',
    paint: {
      'line-width': 2,
      'line-color': highlightFill,
      'line-opacity': 1
    }
  },
  {
    id: 'waterways-aggregated-0',
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
    id: 'waterways-aggregated-1',
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
    id: 'waterways-aggregated-2',
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
    id: 'waterways-aggregated-3',
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
    id: 'waterways-aggregated-4',
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
    id: 'waterways-aggregated-5',
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
    id: 'waterways-aggregated-6',
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
    id: 'waterways-aggregated-highlight-0',
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
    id: 'waterways-aggregated-highlight-1',
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
    id: 'waterways-aggregated-highlight-2',
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
    id: 'waterways-aggregated-highlight-3',
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
    id: 'waterways-aggregated-highlight-4',
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
    id: 'waterways-aggregated-highlight-5',
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
    id: 'waterways-aggregated-highlight-6',
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
