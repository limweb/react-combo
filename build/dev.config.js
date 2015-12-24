module.exports = {
  entry: './index.js',
  module: {
    loaders: require('./loaders.config')
  },
  devServer: {
    publicPath: '/assets/',
    port: 9090,
    host: '0.0.0.0'
  }
}
