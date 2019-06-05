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

const getAxes = (plots, selectedPlotType, viewPort, axesSettings) => {
  // get svg extends to define axes
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

  // get axes and tick values
  const limits = getLimits(plots, selectedPlotType) // from plot extents

  let yMinLimit = limits.yMin
  let yMaxLimit = limits.yMax
  let xMinLimit = limits.xMin
  let xMaxLimit = limits.xMax
  let numXTicks = 5
  let numYTicks = 5

  if (axesSettings.yMin || axesSettings.yMin === 0) {
    yMinLimit = axesSettings.yMin
  }

  if (axesSettings.yMax || axesSettings.yMax === 0) {
    yMaxLimit = axesSettings.yMax
  }

  if (axesSettings.xMin || axesSettings.xMin === 0) {
    xMinLimit = axesSettings.xMin
  }

  if (axesSettings.xMax || axesSettings.xMax === 0) {
    xMaxLimit = axesSettings.xMax
  }

  if (axesSettings.xTicks) {
    numXTicks = axesSettings.xTicks
  }

  if (axesSettings.yTicks) {
    numYTicks = axesSettings.yTicks
  }

  const yScale = d3
    .scaleLinear()
    .domain([yMinLimit, yMaxLimit])
    .range([yMax, yMin])

  const xScale = d3
    .scaleLinear()
    .domain([xMinLimit, xMaxLimit])
    .range([xMin, xMax])

  // zero path will be used for a dashed line at y = 0 if plot contains y = 0
  let zeroPath = null

  // compute positions of tick marks for both axes
  const ticksY = []

  for (let i = 0; i <= numYTicks; i++) {
    const labelHeight = yMinLimit + (yMaxLimit - yMinLimit) * (i / numYTicks)
    ticksY.push({
      label: labelHeight,
      offset: yScale(labelHeight)
    })
  }

  const ticksX = []

  for (let i = 0; i <= numXTicks; i++) {
    const labelOffset = xMinLimit + (xMaxLimit - xMinLimit) * (i / numXTicks)
    ticksX.push({
      label: labelOffset,
      offset: xScale(labelOffset)
    })
  }

  // add data for a dashed line horizontal line at 0 if scale goes from negative to positive
  if (yMinLimit < 0 && yMaxLimit > 0) {
    const path0 = d3.path()
    path0.moveTo(0, yScale(0))
    path0.lineTo(
      viewPort.x - axesSettings.insetRight - axesSettings.insetLeft,
      yScale(0)
    )

    zeroPath = path0.toString()
  }

  return {
    yAxisPath: yAxisPath.toString(), // path of the yAxis
    xAxisPath: xAxisPath.toString(),
    ticksY,
    ticksX,
    zeroPath,
    yScale,
    xScale
  }
}

const getPathFromPlot = (plot, selectedPlotType, xScale, yScale) => {
  // returns a path string from a single plot
  const lineGenerator = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX)

  const pathData = []

  // need to find more efficient way to do this before hand in data store
  for (let i = 0; i < plot.freq.length; i++) {
    pathData.push({
      x: plot.freq[i] * unitMap.get(plot.unit), // scale to Hz
      y: plot[selectedPlotType][i]
    })
  }

  const path = lineGenerator(pathData)
  return {
    path,
    pathData
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

// returns the index for the frequency nearest to a mouseover event in CartesianPlot.vue
const getNearestPointFromFreq = (approxFreq, freqArray, freqUnit) => {
  const freq = approxFreq / unitMap.get(freqUnit)
  const i = d3.bisectLeft(freqArray, freq)
  const freq0 = freqArray[i - 1]
  const freq1 = freqArray[i]

  // if checks are for end points where the other point is out of bounds
  if (!freq0) {
    return i
  } else if (!freq1) {
    return i - 1
  } else {
    return freq - freq0 < freq1 - freq ? i - 1 : i
  }
}

const normalizeFreq = (freq, outputUnit, inputUnit) =>
  (freq * unitMap.get(inputUnit)) / unitMap.get(outputUnit)

export { getAxes, getNearestPointFromFreq, getPathFromPlot, normalizeFreq }
