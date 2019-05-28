import math from 'mathjs'
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

const getSComponents = sParamsRealImag => {
  const sRe = []
  const sIm = []
  const sDb = []
  const sMag = []
  const sAngle = []
  const sDeg = []

  sParamsRealImag.forEach(sParam => {
    const mag = math.sqrt(sParam.re * sParam.re + sParam.im * sParam.im)
    const angle = math.atan2(sParam.im, sParam.re)
    sRe.push(sParam.re)
    sIm.push(sParam.im)
    sMag.push(mag)
    sDb.push(20 * math.log10(mag))
    sAngle.push(angle)
    sDeg.push((angle * 180) / Math.PI)
  })

  return {
    sRe,
    sIm,
    sMag,
    sDb,
    sAngle,
    sDeg
  }
}

const getXAxisData = (plots, viewPort, axesSettings) => {
  // constt xLimits = getXLimits(plots)
  const xMin = 10
  const xMax = viewPort.x - 10

  const path = d3.path()
  path.moveTo(xMin, viewPort.y - 10)
  path.lineTo(xMax, viewPort.y - 10)

  return {
    path: path.toString()
  }
}

const getXLimits = plots => {
  const allExtent = []
  plots.forEach(plot => {
    const plotExtent = d3.extent(plot.freq)
    allExtent.push(plotExtent[0], plotExtent[1])
  })

  return {
    min: d3.min(allExtent),
    max: d3.max(allExtent)
  }
}

const getYAxisData = (plots, selectedPlotType, viewPort, axesSettings) => {
  const yLimits = getYLimits(plots, selectedPlotType)
  const yMin = 10
  const yMax = viewPort.y - 10

  const yScale = d3
    .scaleLinear()
    .domain([yLimits.min, yLimits.max])
    .range([yMax, yMin])

  const path = d3.path()
  path.moveTo(10, yMin)
  path.lineTo(10, yMax)

  const ticks = []

  for (let i = 0; i <= axesSettings.yTicks; i++) {
    const labelHeight =
      yLimits.min + (yLimits.max - yLimits.min) * (i / axesSettings.yTicks)
    ticks.push({
      label: labelHeight,
      height: yScale(labelHeight)
    })
  }

  return {
    path: path.toString(), // path of the yAxis
    ticks
  }
}

const getYLimits = (plots, selectedPlotType) => {
  const allExtent = []
  plots.forEach(plot => {
    allExtent.push(...d3.extent(plot[selectedPlotType]))
  })

  return {
    min: d3.min(allExtent),
    max: d3.max(allExtent)
  }
}

const normalizeFreq = (frequencies, outputUnit, inputUnit) => {
  return frequencies.map(
    frequency => frequency * (unitMap.get(inputUnit) / unitMap.get(outputUnit))
  )
}

export { getSComponents, getXAxisData, getXLimits, getYAxisData, normalizeFreq }
