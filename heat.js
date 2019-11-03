{
  var x1 = [];
  var y1 = [];
  var x2 = [];
  var y2 = [];
  Count2 = 150
  nn = 10
  N = 5000
  b = []
  Plotly.d3.csv('./k.csv', function (data) { p(data, x1, y1) })
  // Plotly.d3.csv('r.csv', function (data) { p(data, x2, y2) })

  function p(rows, x, y) {
    console.log("bra")
    for (var i = 0; i < rows.length; i++) {
      row = rows[i]
      for (var j = 0; j < nn; j++) {
        x.push(j)
        y.push(row[str(j)])
      }
    }
  }

  console.log(x1.length, x2.length)

  var trace1 = {
    x: x1,
    y: y1,
    colorscale: 'Reds',
    type: 'histogram2d',
    xbins: {
      start: 0,
      size: 1,
      end: nn
    }
  };

  var trace2 = {
    x: x2,
    y: y2,
    xaxis: 'x2',
    yaxis: 'y2',
    colorscale: 'Reds',
    type: 'histogram2d',
    xbins: {
      start: 0,
      size: 1,
      end: nn
    }
  };

  var data = [trace1, trace2];

  var Steps = []

  for (var i = 0; i < N; i++) {
    Steps.push({
      label: i,
      method: 'restyle',
      args: [i, {
        transforms: [{
          type: 'filter',
          target: 'id',
          operation: '<',
          value: i
        }]
      }]
    })
  }

  var layout = {
    width: 660,
    height: 460,
    grid: { rows: 1, columns: 2, pattern: 'independent' },
    xaxis: {
      title: "Original position",
      fixedrange: true,
      tickmode: "array",
      tickvals: b,
    },
    yaxis: {
      title: "Shuffled position",
      fixedrange: true,
      tickmode: "array",
      tickvals: b,
    },
    xaxis2: {
      title: "Original position",
      fixedrange: true,
      tickmode: "array",
      tickvals: b,
    },
    yaxis2: {
      title: "Shuffled position",
      fixedrange: true,
      tickmode: "array",
      tickvals: b,
    },
    sliders: [{
      pad: { t: 0 },
      x: 0,
      y: -0.2,
      currentvalue: {
        xanchor: 'left',
        font: {
          color: '#888',
          size: 15
        }
      },
      steps: Steps
    }]
  };

  Plotly.newPlot('heat', data, layout);

}
