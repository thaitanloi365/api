import AntdScssThemePlugin from "antd-scss-theme-plugin";
import path from "path";

module.exports = {
  resolve: {
    root: path.resolve(__dirname),
    extensions: ["", ".js", ".jsx"],
    alias: {
      Assets: "src/Assets",
      Pages: "src/Pages",
      Services: "src/Services",
      Strings: "src/Strings"
    }
  },
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
