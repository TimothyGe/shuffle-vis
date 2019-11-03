{
  var x1 = [];
  var x2 = [];
  Count = 100
  nn = 50
  a = new Array(nn)
  for (var i = 0; i < 200; i++) {
    x1.push(knuth());
    x2.push(rsort());
  }
  var trace1 = {
    x: x1,
    name: 'Fisher-Yates',
    histnorm: 'probability',
    autobinx: false,
    marker: {
      color: "rgba(255, 100, 102, 0.7)",
      line: {
        color: "rgba(255, 100, 102, 1)",
        width: 1
      }
    },
    opacity: 0.5,
    type: "histogram",
    xbins: {
      size: 0.05,
    }
  };
  var trace2 = {
    x: x2,
    histnorm: 'probability',
    autobinx: false,
    marker: {
      color: "rgba(100, 200, 102, 0.7)",
      line: {
        color: "rgba(100, 200, 102, 1)",
        width: 1
      }
    },
    name: "Randomsort",
    opacity: 0.75,
    type: "histogram",
    xbins: {
      size: 0.05,
    }
  };

  var data = [trace1, trace2];
  var layout = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
    title: "Shannon Entropy Distribution Comparison (n = " + nn + ")",
    xaxis: { title: "Shannon Entropy Sampling", fixedrange: true },
    yaxis: { title: "Probability", fixedrange: true }
  };
  Plotly.newPlot('Entropy', data, layout);

  setInterval(function () {
    t1 = knuth()
    t2 = rsort()
    Plotly.extendTraces('Entropy', { x: [[t1], [t2]] }, [0, 1])
    document.getElementById('Count').innerHTML = ++Count
  }, 300)

  function knuth() {
    for (let i = 0; i < nn; i++) { a[i] = i }
    for (let i = nn - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let tmp = a[i]; a[i] = a[j]; a[j] = tmp
    }

    var dict = {}
    for (let i = 0; i < nn; ++i) {
      delta = (a[(i + 1) % nn] - a[i] + nn) % nn
      if (delta in dict) {
        dict[delta]++
      } else {
        dict[delta] = 1
      }
    }

    let res = 0
    for (key in dict) {
      let t = dict[key] / nn
      res += -t * Math.log(t) / Math.log(2)
    }
    return res
  }

  function rsort() {
    for (let i = 0; i < nn; i++) { a[i] = i }
    a.sort(function (a, b) { return Math.random() - 0.5 })

    var dict = {}
    for (let i = 0; i < nn; ++i) {
      delta = (a[(i + 1) % nn] - a[i] + nn) % nn
      if (delta in dict) {
        dict[delta]++
      } else {
        dict[delta] = 1
      }
    }

    let res = 0
    for (key in dict) {
      let t = dict[key] / nn
      res += -t * Math.log(t) / Math.log(2)
    }
    return res
  }
}