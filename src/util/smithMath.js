import math from 'mathjs'
import * as d3 from 'd3'

/*
 * First we include functions for computing arcs on Smith chart for going between
 * gamma and normalized load impedance
 */
const zLoadNormalizedToGamma = zLoadNormalized => {
  const numerator = math.subtract(zLoadNormalized, 1)
  const denominator = math.add(zLoadNormalized, 1)
  return math.divide(numerator, denominator)
}

const gammaToZLoadNormalized = gamma => {
  const numerator = math.add(1, gamma)
  const denominator = math.subtract(1, gamma)
  return math.divide(numerator, denominator)
}

/*
 * Given the reflection coefficient, gamma, and the carracteristic impedance, z0,
 * gammaToZload computers the complex load impedance
 */
const gammaToZLoad = (gamma, z0) => {
  return math.multiply(z0, gammaToZLoadNormalized(gamma))
}

/*
 * Takes in the value of the constant resitance circle and the start and end point
 * of this arc. The start and end point will be a particular value of the normalized
 * load reactance, xLoad
 *
 * Returns the values of the cirlce center and the start and end points of the arc and radius
 * x represents real gamma, y represents imaginary gamma
 * These numbers will feed into the d3.pth.arcTo path generator funtion
 */
const getRealArc = (rL, xL1, xL2) => {
  const zL1 = math.complex(rL, xL1) // normzlied impedance of arc start
  // Don't need to compute conjugate because of symmetry
  const zL2 = math.complex(rL, xL2)
  const gamma1 = zLoadNormalizedToGamma(zL1)
  const gamma2 = zLoadNormalizedToGamma(zL2)

  const radius = 1 / (1 + rL)
  const cx = rL / (1 + rL)
  const cy = 0

  // get angles from centers to gamma crossings
  let angle1 = math.subtract(gamma1, math.complex(cx, cy)).toPolar().phi
  let angle2 = math.subtract(gamma2, math.complex(cx, cy)).toPolar().phi

  // Keep angles positive for simplicity
  if (angle1 < 0) {
    angle1 = angle1 + 2 * Math.PI
  }
  if (angle2 < 0) {
    angle2 = angle2 + 2 * Math.PI
  }

  return {
    radius,
    cx,
    cy,
    angle1,
    angle2
  }
}

/*
 * Similar to above, except for section of the imaginary impedance arc
 */
const getImagArc = (xL, rL1, rL2) => {
  const zL1 = math.complex(rL1, xL)
  const zL2 = math.complex(rL2, xL)

  const gamma1 = zLoadNormalizedToGamma(zL1)
  const gamma2 = zLoadNormalizedToGamma(zL2)

  const radius = Math.abs(1 / xL)
  const cx = 1
  const cy = 1 / xL

  // get angles from centers to gamma crossings
  let angle1 = math.subtract(gamma1, math.complex(cx, cy)).toPolar().phi
  let angle2 = math.subtract(gamma2, math.complex(cx, cy)).toPolar().phi
  // Keep angles positive for simplicity
  if (angle1 < 0) {
    angle1 = angle1 + 2 * Math.PI
  }
  if (angle2 < 0) {
    angle2 = angle2 + 2 * Math.PI
  }
  return {
    radius,
    cx,
    cy,
    angle1,
    angle2
  }
}

// d3 scales - assume svg (minus margins) of width and height of 1000
// may handle dynamically in the future
const x = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([0, 1000])
const y = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([1000, 0])
const r = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, 500])
const a = d3
  .scaleLinear()
  .domain([0, 2 * Math.PI])
  .range([0, -2 * Math.PI])

// scale for plots (Smith traces and data points)
const a2 = d3
  .scaleLinear()
  .domain([0, 2 * Math.PI])
  .range([+Math.PI / 2, -2 * Math.PI + Math.PI / 2])
const smithXScale = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([-500, 500])
const smithYScale = d3
  .scaleLinear()
  .domain([-1, 1])
  .range([500, -500])

// d3 path generators
const getRealPath = rL => {
  const arc = getRealArc(rL, Number.MAX_VALUE, -Number.MAX_VALUE)

  const realPath = d3.path()

  realPath.arc(
    x(arc.cx),
    y(arc.cy),
    r(arc.radius),
    a(arc.angle1),
    a(arc.angle2),
    true
  )

  return realPath.toString()
}

const getImagPath = xL => {
  let imagPath = d3.path()

  if (xL === 0) {
    imagPath.moveTo(x(-1), y(0))
    imagPath.lineTo(x(1), y(0))
  } else {
    const arc = getImagArc(xL, 0, 1e6)
    const anticlockWise = xL > 0

    imagPath.arc(
      x(arc.cx),
      y(arc.cy),
      r(arc.radius),
      a(arc.angle1),
      a(arc.angle2),
      anticlockWise
    )
  }

  return imagPath.toString()
}

// d3 line generator
const getSmithPlotLine = plot => {
  const sRe = plot.sRe
  const sIm = plot.sIm

  const radialLine = d3
    .lineRadial()
    .radius((s, index) =>
      r(Math.sqrt(sRe[index] * sRe[index] + sIm[index] * sIm[index]))
    )
    .angle((s, index) => a2(math.atan2(sIm[index], sRe[index])))
    .curve(d3.curveNatural)

  return radialLine(sRe)
}

const getSmithCoordinate = (sRe, sIm) => {
  return {
    cx: smithXScale(sRe),
    cy: smithYScale(sIm)
  }
}

const getNearestPointFromComplex = (sReMouse, sImMouse, sReArray, sImArray) => {
  // data is not ordered, so we'll just live with O(n)... sad times
  let bestIndex = 0
  let bestDistance = Number.MAX_VALUE

  for (let i = 0; i < sReArray.length - 1; i++) {
    const diffRe = sReArray[i] - sReMouse
    const diffIm = sImArray[i] - sImMouse

    const distance = math.sqrt(diffRe * diffRe + diffIm * diffIm)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = i
    }
  }
  return bestIndex
}

export {
  getRealPath,
  getImagPath,
  getSmithPlotLine,
  getSmithCoordinate,
  getNearestPointFromComplex,
  gammaToZLoad,
  smithXScale,
  smithYScale
}
