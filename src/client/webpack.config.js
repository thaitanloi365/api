const AntdScssThemePlugin = require("antd-scss-theme-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      AntdScssThemePlugin.themify({
        loader: "sass-loader",
        options: {
          sourceMap: process.env.NODE_ENV !== "production"
        }
      })
    ]
  },
  plugins: [new AntdScssThemePlugin("./theme.scss")]
};
