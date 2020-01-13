const CracoAntDesignPlugin = require("craco-antd");
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: require("craco-cesium")()
    },
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#368AC4",
          "@link-color": "#368AC4",
          "@layout-header-background": "rgba(20, 20, 20, 0.75)",
          "@menu-bg": "rgba(20, 20, 20, 0.75)"
        }
      }
    }
  ]
};
