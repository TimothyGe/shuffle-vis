{
  var x1 = [];
  var y1 = [];
  var z1 = [];
  var x2 = [];
  var y2 = [];
  var z2 = [];
  var data = [];

  nn = 10
  N = 5000
  tick = []
  ok = 0
  for (var i = 0; i < nn; ++i) { tick.push(i) }
  var trace1 = {}, trace2 = {};
  Plotly.d3.csv('https://raw.githubusercontent.com/TimothyGe/shuffle-vis/master/k.csv', function (data) { p1(data) })

  Plotly.d3.csv('https://raw.githubusercontent.com/TimothyGe/shuffle-vis/master/r.csv', function (data) { p2(data) })

  function p1(rows) {
    for (var i = 0; i < rows.length; i++) {
      row = rows[i]
      for (var j = 0; j < nn; j++) {
        x1.push(j)
        y1.push(row[j])
        z1.push(row['id'])
      }
    }

    trace1 = {
      x: x1,
      y: y1,
      z: z1,
      colorscale: 'Reds',
      type: 'histogram2d',
      xbins: {
        start: 0,
        size: 1,
        end: nn
      }
    }
    ok++
  }

  function p2(rows) {
    for (var i = 0; i < rows.length; i++) {
      row = rows[i]
      for (var j = 0; j < nn; j++) {
        x2.push(j)
        y2.push(row[j])
        z2.push(row['id'])
      }
    }

    trace2 = {
      x: x2,
      y: y2,
      z: z2,
      xaxis: 'x2',
      yaxis: 'y2',
      colorscale: 'Reds',
      type: 'histogram2d',
      xbins: {
        start: 0,
        size: 1,
        end: nn
      }
    }
    ok++
  }

  async function makePlot() {
    while (ok != 2) {
      console.log(ok)
      await sleep(20)
    }
    data = [trace1, trace2]
    var Steps = []
    for (var i = 0; i < N; i += 1000) {
      Steps.push({
        label: i,
        method: 'restyle',
        args: ['transforms[0]', [{
          type: 'filter',
          enabled: true,
          target: 'z',
          operation: '<=',
          value: i
        }], [0, 1]]
      })
    }

    var layout = {
      width: 660,
      height: 460,
      grid: { rows: 1, columns: 2 },
      xaxis: {
        title: "Original position",
        fixedrange: true,
        tickmode: "array",
        tickvals: tick,
      },
      yaxis: {
        title: "Shuffled position",
        fixedrange: true,
        tickmode: "array",
        tickvals: tick,
      },
      xaxis2: {
        title: "Original position",
        fixedrange: true,
        tickmode: "array",
        tickvals: tick,
      },
      yaxis2: {
        title: "Shuffled position",
        fixedrange: true,
        tickmode: "array",
        tickvals: tick,
      },
      sliders: [{
        pad: { b: 0 },
        x: 0,
        y: -0.2,
        currentvalue: {
          xanchor: 'left',
          prefix: 'Test counts: ',
          font: {
            color: '0',
            size: 15
          }
        },
        steps: Steps
      }]
    };
    Plotly.newPlot('heat', data, layout);
  }

  makePlot()

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
