function * nextColor () {
  // colors selected from among base colors and accent-4 of material design - color repeats after
  // end of the array is reached
  const colors = [
    '#F44336',
    '#673AB7',
    '#03A9F4',
    '#4CAF50',
    '#FFEB3B',
    '#FF5722',
    '#E91E63',
    '#3F51B5',
    '#00BCD4',
    '#8BC34A',
    '#FFC107',
    '#795548',
    '#9C27B0',
    '#2196F3',
    '#009688',
    '#CDDC39',
    '#FF9800',
    '#607D8B',
    '#D50000',
    '#6200EA',
    '#0091EA',
    '#00C853',
    '#FFD600',
    '#DD2C00',
    '#C51162',
    '#304FFE',
    '#00B8D4',
    '#64DD17',
    '#FFAB00',
    '#3E2723',
    '#AA00FF',
    '#2962FF',
    '#00BFA5',
    '#AEEA00',
    '#FF6D00',
    '#263238'
  ]

  let i = 0

  while (i < colors.length) {
    yield colors[i]

    if (i === colors.length - 1) {
      i = 0
    } else {
      i++
    }
  }
}

export default nextColor
