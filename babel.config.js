module.exports = {
  plugins: ['babel-plugin-transform-vite-meta-env'],
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
}
