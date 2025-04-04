const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8083/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8083,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "cards",
      filename: "remoteEntry.js",
      remotes: {
        'shared_ui': 'shared_ui@http://localhost:8084/remoteEntry.js',
      },
      exposes: {
        './Cards': './src/components/Cards.js',
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: '^17.0.2',
          eager: false
        },
        "react-dom": {
          singleton: true,
          requiredVersion: '^17.0.2',
          eager: false
        },
        "event-bus": {
          singleton: true,
          requiredVersion: "1.0.0",
          eager: true,
        },
        'user-context': {
          singleton: true,
          requiredVersion: '1.0.0',
        },
        'shared-ui': {
          singleton: true,
          requiredVersion: '1.0.0',
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8083,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
