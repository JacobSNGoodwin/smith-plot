import math from 'mathjs'
// import * as d3 from 'd3'

// const HZ = 1
// const KHZ = 1e3
// const MHZ = 1e6
// const GHZ = 1e9
// const THZ = 1e12 // just in case some numskull wants to try optical on this... groan

const getSComponents = sParamsRealImag => {
  const sDb = []
  const sMag = []
  const sAngle = []
  const sDeg = []

  sParamsRealImag.forEach(sParam => {
    const mag = math.sqrt(sParam.re * sParam.re + sParam.im * sParam.im)
    const angle = math.atan2(sParam.im, sParam.re)
    sMag.push(mag)
    sDb.push(20 * math.log10(mag))
    sAngle.push(angle)
    sDeg.push((angle * 180) / Math.PI)
  })

  return {
    sMag,
    sDb,
    sAngle,
    sDeg
  }
}

export { getSComponents }
