import math from 'mathjs'
// import * as d3 from 'd3'

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
