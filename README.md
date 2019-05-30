# SmithPlot

Single Page Application for plotting Touchstone Files on Smith Charts and on Cartesian Coordinates

## Current Support as of version 1.0.0

- Plot Touchstone version 1.0 files. 
- Plot reflection coefficient, or S_nn, on a Smith Chart
- Change Colors and toggle plots
- Change name of imported files
- Plot S-Parameters from multiple 

## Planned for next version

- Performance optimizations in scaling plots and data store for many plots
  * Currently operations can be slow for many plots or for plots with many data points. I believe I can further optimize the data store.
- User control of plot dimensions (max and min dimensions, tick marks)

## Submit Feature requests or bugs

Please submit any feature requests or bug reports with the labels "Feature request" or "bug" under the repo's [issues](https://github.com/Maxbrain0/smith-plot/issues)

Or you may contact me directly via email. 

# Running and Building Code Base

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
