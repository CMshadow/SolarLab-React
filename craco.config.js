const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: require('craco-cesium')()
    },
    {
      plugin: CracoAntDesignPlugin,
      options: {
      }
    }
  ]
};
