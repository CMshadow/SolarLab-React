const CracoAntDesignPlugin = require("craco-antd");

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
          "@layout-header-background": "#202020",
          "@menu-bg": "#202020"


        }
      }      
    }
  ]
};
