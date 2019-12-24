const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV === 'development',
  chainWebpack(config) {
    if (process.env.npm_config_report) {
      config.plugin('bundle-analyzer-plugin').use(new BundleAnalyzerPlugin());
    }

    config.plugins.delete('preload');
    config.plugins.delete('prefetch');

    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'));

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          }
        }
      });
    });
  }
};
