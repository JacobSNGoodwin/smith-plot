import * as d3 from 'd3'

// Map for quick unit conversion
const unitMap = new Map([
  ['HZ', 1],
  ['KHZ', 1e3],
  ['MHZ', 1e6],
  ['GHZ', 1e9],
  ['THZ', 1e12],
  ['PHZ', 1e15]
])

const getPlotData = (plots, selectedPlotType, viewPort, axesSettings) => {
  // create linear scales based on max dimensions

  const limits = getLimits(plots, selectedPlotType)
  const yMin = axesSettings.insetTop
  const yMax = viewPort.y - axesSettings.insetBottom

  const xMin = axesSettings.insetLeft
  const xMax = viewPort.x - axesSettings.insetRight

  // a path representing the y axis
  const yAxisPath = d3.path()
  yAxisPath.moveTo(0, yMin)
  yAxisPath.lineTo(0, yMax)

  const xAxisPath = d3.path()
  xAxisPath.moveTo(xMin, 0)
  xAxisPath.lineTo(xMax, 0)

  // check if not plots, just retrun axes
  if (plots.length <= 0) {
    return {
      yAxisPath: yAxisPath.toString(),
      xAxisPath: xAxisPath.toString(),
      ticksY: null,
      ticksX: null,
      zeroPath: null,
      plotPaths: null,
      yScale: null,
      xScale: null
    }
  }

  const yScale = d3
    .scaleLinear()
    .domain([limits.yMin, limits.yMax])
    .range([yMax, yMin])

  const xScale = d3
    .scaleLinear()
    .domain([limits.xMin, limits.xMax])
    .range([xMin, xMax])

  // zero path will be used for a dashed line at y = 0 if plot contains y = 0
  let zeroPath = null

  // compute positions of tick marks for both axes
  const ticksY = []

  for (let i = 0; i <= axesSettings.yTicks; i++) {
    const labelHeight =
      limits.yMin + (limits.yMax - limits.yMin) * (i / axesSettings.yTicks)
    ticksY.push({
      label: labelHeight,
      offset: yScale(labelHeight)
    })
  }

  const ticksX = []

  for (let i = 0; i <= axesSettings.yTicks; i++) {
    const labelOffset =
      limits.xMin + (limits.xMax - limits.xMin) * (i / axesSettings.xTicks)
    ticksX.push({
      label: labelOffset,
      offset: xScale(labelOffset)
    })
  }

  // add data for a dashed line horizontal line at 0 if scale goes from negative to positive
  if (limits.yMin < 0 && limits.yMax > 0) {
    const path0 = d3.path()
    path0.moveTo(0, yScale(0))
    path0.lineTo(
      viewPort.x - axesSettings.insetRight - axesSettings.insetLeft,
      yScale(0)
    )

    zeroPath = path0.toString()
  }

  // get plot paths while we're at it since we have all the dadgummed info we dun need
  // plotPaths will contain an array of path strings
  const lineGenerator = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX)

  const plotPaths = plots.map(plot => {
    const pathData = []

    // need to find more efficient way to do this before hand in data store
    for (let i = 0; i < plot.freq.length; i++) {
      pathData.push({
        x: plot.freq[i] * unitMap.get(plot.unit), // scale to Hz
        y: plot[selectedPlotType][i]
      })
    }

    const path = lineGenerator(pathData)
    return { path, pathData }
  })

  return {
    yAxisPath: yAxisPath.toString(), // path of the yAxis
    xAxisPath: xAxisPath.toString(),
    ticksY,
    ticksX,
    zeroPath,
    plotPaths,
    yScale,
    xScale
  }
}

const getLimits = (plots, selectedPlotType) => {
  // extents hold a minima and maxima of all plots passed to function
  const extentY = []
  const extentX = []

  let minProperty
  let maxProperty

  switch (selectedPlotType) {
    case 'sRe':
      minProperty = 'sReMin'
      maxProperty = 'sReMax'
      break
    case 'sIm':
      minProperty = 'sImMin'
      maxProperty = 'sImMax'
      break
    case 'sMag':
      minProperty = 'sMagMin'
      maxProperty = 'sMagMax'
      break
    case 'sDb':
      minProperty = 'sDbMin'
      maxProperty = 'sDbMax'
      break
    case 'sAngle':
      minProperty = 'sAngleMin'
      maxProperty = 'sAngleMax'
      break
    case 'sDeg':
      minProperty = 'sDegMin'
      maxProperty = 'sDegMax'
      break
    default:
      minProperty = 'sReMin'
      maxProperty = 'sReMax'
      break
  }

  plots.forEach(plot => {
    // get min/max of Sparam based on plotType
    extentY.push(plot[minProperty], plot[maxProperty])
    // frequencies are ordered, so min is first el and max is last el
    // for plot scaale all freqz in Hz
    extentX.push(
      plot.freq[0] * unitMap.get(plot.unit),
      plot.freq[plot.freq.length - 1] * unitMap.get(plot.unit)
    )
  })

  return {
    yMin: d3.min(extentY),
    yMax: d3.max(extentY),
    xMin: d3.min(extentX),
    xMax: d3.max(extentX)
  }
}

const normalizeFreq = (freq, outputUnit, inputUnit) =>
  (freq * unitMap.get(inputUnit)) / unitMap.get(outputUnit)

export { getPlotData, normalizeFreq }
