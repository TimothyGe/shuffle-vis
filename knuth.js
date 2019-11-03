{
  var State = {
    UNFINISHED: '#C9C9C9', // lightgrey
    SWAPPING: '#EB4034', // red
    FINISHED: '#91FA6E', // finished
  }

  var Phase = {
    SWAP: 0,
    STOP: 1,
  }

  let phase = Phase.STOP
  let fc = 0

  let n = 8

  let cube_size = 30
  let cube_radius = 5
  let left_offset = 30
  let bottom = 280
  let up_offset = 110
  let gap = 10
  let e_b = Math.floor(up_offset / 1.8)

  let fps = 15 // frame per swap

  let forward = true
  let frozen = false

  let A = []
  let swapee = []

  function pos(val) {
    return val * (cube_size + gap) + left_offset
  }

  class Element {
    constructor(val, c = State.UNFINISHED) {
      this.val = val
      this.xpos = pos(val)
      this.ypos = up_offset
      this.x = val
      this.c = c
    }

    move(fc, src, dst) {
      let a = abs((pos(dst) - pos(src)) / 2)
      let b = e_b
      let cx = (pos(dst) + pos(src)) / 2 // center
      let cy = up_offset
      let angle = fc / fps * Math.PI
      if (dst > src) {
        this.xpos = cx - cos(angle) * a
        this.ypos = cy - sin(angle) * b
      } else {
        this.xpos = cx + cos(angle) * a
        this.ypos = cy + sin(angle) * b
      }
    }
  }

  let swapee_index = -1

  function setup() {
    var canvas = createCanvas(680, 600)
    canvas.parent('knuth')
    textAlign(CENTER, CENTER)
    let button_h = bottom + 30

    s1 = createButton('< prev')
    s1.parent('knuth')
    s1.position(30, button_h)
    s1.mousePressed(last)

    s2 = createButton('next >')
    s2.parent('knuth')
    s2.position(130, button_h)
    s2.mousePressed(next)

    s3 = createButton('reshuffle')
    s3.parent('knuth')
    s3.position(240, button_h)
    s3.mousePressed(init)

    init()

    frameRate(30)
  }

  function draw() {
    background(255)
    switch (phase) {
      case Phase.SWAP:
        if (swapee_index >= n || swapee_index < 0) {
          break
        }
        let a = swapee[swapee_index].a
        let b = swapee[swapee_index].b
        let src = A[a].x
        let dst = A[b].x
        let k = frameCount
        A[a].c = State.SWAPPING
        A[b].c = State.SWAPPING
        A[a].move(k - fc, src, dst)
        A[b].move(k - fc, dst, src)
        if (k - fc >= fps) {
          let tmp = A[a]; A[a] = A[b]; A[b] = tmp
          A[a].x = a; A[b].x = b

          A[a].c = State.UNFINISHED; A[b].c = State.UNFINISHED

          if (forward) {
            A[a].c = State.FINISHED
          } else {
            swapee_index--
          }
          phase = Phase.STOP
          frozen = false
        }
        break
      case Phase.STOP:
        break
    }

    fill(0); textSize(25); text("Fisher-Yates shuffle", 500, 30)

    for (let i = 0; i < n; i++) {
      noStroke(); fill(0); textSize(12); text(i, pos(i) + cube_size / 2, up_offset - cube_size / 2)
    }

    for (let i = 0; i < n; i++) {
      fill(255); stroke(A[i].c); strokeWeight(2); rect(A[i].xpos, A[i].ypos, cube_size, cube_size, cube_radius)
      fill(A[i].c); bh = A[i].val * 5; rect(A[i].xpos, bottom - bh, cube_size, bh)
      noStroke(); fill(0); textSize(12); text(A[i].val, A[i].xpos + cube_size / 2, A[i].ypos + cube_size / 2)
    }

    noStroke(); fill(0); textSize(15); text('Number of swaps: ' + str(swapee_index + 1), 100, 30)
    if (swapee_index < n && swapee_index >= 0) {
      let a = swapee[swapee_index].a
      let b = swapee[swapee_index].b
      text('Current swap: ' + str(a) + " <=> " + str(b), 270, 30)
    }
    entropy()
  }

  function entropy() {
    var dict = {}
    for (let i = 0; i < n; ++i) {
      delta = (A[(i + 1) % n].val - A[i].val + n) % n
      if (delta in dict) {
        dict[delta]++
      } else {
        dict[delta] = 1
      }
      noStroke(); fill(0); textSize(12); text('A[' + str((i + 1) % n) + ']' + ' - ' + 'A[' + i + ']' + ' = (' + A[(i + 1) % n].val + ' - ' + A[i].val + ') (mod ' + n + ')' + ' = ', 460, 90 + 30 * i)
      fill('red'); text('                                                          ' + delta, 460, 90 + 30 * i)
    }
    textAlign(LEFT, TOP)
    let i = 0
    for (var key in dict) {
      fill('red'); text(key, 580, 90 + 30 * i)
      fill(0); text(': ', 590, 90 + 30 * i)
      fill('#0084db'); text(dict[key], 600, 90 + 30 * i)
      fill(0); text('times', 610, 90 + 30 * i)
      i++
    }

    let res = 0
    for (key in dict) {
      let t = dict[key] / n
      res += -t * Math.log(t) / Math.log(2)
    }
    textSize(15)
    text('Shannon Entropy = ', 400, 330)
    textSize(18)
    text(res.toFixed(4), 540, 329)
    textAlign(CENTER, CENTER)

    hist1_draw(dict)
    hist2_draw(dict)
  }

  function hist1_init() {
    h1 = new GPlot(this)
    h1.setPos(0, 390)
    h1.setDim(230, 100)
    h1.getXAxis().setTicks([])
    h1.setYLim(0, n)
    h1.getXAxis().setAxisLabelText("Modulo differences")
    h1.getYAxis().setAxisLabelText("Count")
    h1.setTitleText("Histogram of modulo differences")
    h1.startHistograms(GPlot.VERTICAL)
    h1.getHistogram().setDrawLabels(true)
    h1.getHistogram().setBgColors(['#0084db'])
    h1.getHistogram().setLineColors(['#0084db'])
    h1.getHistogram().setSeparations([5])
    h1.setPoints(stack2hist1({ 1: n }))
  }

  function hist2_init() {
    h2 = new GPlot(this)
    h2.setPos(320, 390)
    h2.setDim(230, 100)
    h2.getXAxis().setTicks([])
    h2.setYLim(0, 1)
    h2.getXAxis().setAxisLabelText("Modulo differences")
    h2.getYAxis().setAxisLabelText("Normalized Count")
    h2.setTitleText("Normalized histogram of modulo differences\n(count/n, n = " + n + ")")
    h2.startHistograms(GPlot.VERTICAL)
    h2.getHistogram().setDrawLabels(true)
    h2.getHistogram().setBgColors(['orange'])
    h2.getHistogram().setLineColors(['orange'])
    h2.getHistogram().setSeparations([5])
    h2.setPoints(stack2hist2({ 1: n }))
  }

  function stack2hist1(dict) {
    stack = []
    pts = new Array(n)

    for (let i = 0; i < n; i++) {
      stack[i] = 0
    }
    for (let key in dict) {
      stack[key] = dict[key]
    }
    for (let i = 0; i < stack.length; i++) {
      pts[i] = new GPoint(i + 0.5 - stack.length / 2, stack[i], i)
    }
    return pts
  }

  function stack2hist2(dict) {
    stack = []
    pts = new Array(n)

    for (let i = 0; i < n; i++) {
      stack[i] = 0
    }
    for (let key in dict) {
      stack[key] = dict[key]
    }
    for (let i = 0; i < stack.length; i++) {
      pts[i] = new GPoint(i + 0.5 - stack.length / 2, stack[i] / n, i)
    }
    return pts
  }

  function hist1_draw(dict) {
    pts = stack2hist1(dict)
    h1.setPoints(pts)
    h1.beginDraw();
    h1.drawBox();
    h1.drawXAxis();
    h1.drawYAxis();
    h1.drawTitle();
    h1.drawHistograms();
    h1.endDraw();
  }

  function hist2_draw(dict) {
    pts = stack2hist2(dict)
    h2.setPoints(pts)
    h2.beginDraw();
    h2.drawBox();
    h2.drawXAxis();
    h2.drawYAxis();
    h2.drawTitle();
    h2.drawHistograms();
    h2.endDraw();
  }

  async function swap() {
    let a = swapee[swapee_index].a
    let b = swapee[swapee_index].b
    A[a].c = State.SWAPPING
    A[b].c = State.SWAPPING
    await sleep(500)

    phase = Phase.SWAP
    fc = frameCount
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function last() {
    if (!frozen && swapee_index >= 0) {
      frozen = true
      forward = false
      swap()
    }
  }

  function next() {
    if (!frozen && swapee_index < n - 1) {
      frozen = true
      swapee_index++
      forward = true
      swap()
    }
  }

  function init() {
    phase = Phase.STOP
    forward = true
    frozen = false
    A = []
    swapee = []
    swapee_index = -1
    A = new Array(n)
    for (let i = 0; i < n; i++) {
      A[i] = new Element(i)
    }
    knuth()
    hist1_init()
    hist2_init()
  }

  function knuth() {
    for (let i = n - 1; i >= 0; i--) {
      let j = floor(random(i + 1))
      swapee.push({ a: i, b: j })
    }
  }
}