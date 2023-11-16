module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    // can assign fallbacks/polyfills here if webpack errors occur due to missing node.js core modules
    // see instructions here: https://web3auth.io/docs/troubleshooting/webpack-issues#react-create-react-app
  })
  config.resolve.fallback = fallback

  // can uncomment to polyfill buffer and process
  // config.plugins = (config.plugins || []).concat([
  //   new webpack.ProvidePlugin({
  //     process: "process/browser",
  //     Buffer: ["buffer", "Buffer"],
  //   }),
  // ]);

  // ignore expected warnings from metamask utils
  config.ignoreWarnings = [/Failed to parse source map/]
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: 'pre',
    loader: require.resolve('source-map-loader'),
    resolve: {
      fullySpecified: false,
    },
  })
  return config
}
