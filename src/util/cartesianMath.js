import math from 'mathjs'
import * as d3 from 'd3'

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

const getXLimits = plots => {
  const allExtent = []
  plots.forEach(plot => {
    const plotExtent = d3.extent(plot.freq)
    const plotMin = plotExtent[0] * unitMap.get(plot.unit)
    const plotMax = plotExtent[1] * unitMap.get(plot.unit)
    allExtent.push(plotMin, plotMax)
  })

  return {
    min: d3.min(allExtent),
    max: d3.max(allExtent)
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

export { getSComponents, getXLimits, getYLimits }
