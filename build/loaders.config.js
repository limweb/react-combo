module.exports = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel'
  },
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader!autoprefixer-loader'
  }
]
