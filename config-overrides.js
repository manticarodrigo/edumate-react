const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config)  // change importing css to less
  config = rewireLess.withLoaderOptions({
    modifyVars: { 
      "@primary-color": "#0D99FC",
      "@info-color": "#0288D1",
      "@success-color": "#4FD689"
    },
  })(config, env)
  return config
}