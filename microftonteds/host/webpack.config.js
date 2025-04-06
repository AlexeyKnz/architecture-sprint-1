const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8080/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
          "event-bus": path.resolve(__dirname, "../shared/event-bus"),
    },
  },

  devServer: {
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/shared-ui')
        ],
        use: 'babel-loader'
      },
      {
        test: /\.svg$/i,
        oneOf: [
          // 1. Для импорта как React-компонента (JSX/TSX)
          {
            issuer: /\.(js|ts)x?$/,
            resourceQuery: /react/, // важно!
            use: ['@svgr/webpack'],
          },
          // 2. Для обычного импорта как URL
          {
            type: 'asset/resource',
            generator: {
              filename: 'images/[hash][ext][query]'
            }
          }
        ]
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        'authentication': 'authentication@http://localhost:8081/remoteEntry.js',
        'userprofile': 'userprofile@http://localhost:8082/remoteEntry.js',
        'cards': 'cards@http://localhost:8083/remoteEntry.js',
        'shared_ui': 'shared_ui@http://localhost:8084/remoteEntry.js',
      },
      exposes: {},
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^17.0.2',
        },
        "react-dom": {
          singleton: true,
          requiredVersion: '^17.0.2',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^5.2.0',
        },
        "history": { 
          singleton: true,
          requiredVersion: '^4.10.1'
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
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8080,
    hot: true,
  },
};
