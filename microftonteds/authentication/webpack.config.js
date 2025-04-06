const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8081/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "event-bus": path.resolve(__dirname, "../shared/event-bus"),
    },
  },

  devServer: {
    port: 8081,
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
      name: "authentication",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        './UserAuth': './src/components/UserAuth.js',
        './UserRegister': './src/components/UserRegister.js',
      },
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
        'user-context': {  // Указываем имя вашего пакета
          singleton: true,  // Гарантируем один экземпляр
          requiredVersion: '1.0.0',  // Фиксируем версию
          eager: true       // Загружаем сразу
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8081,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
