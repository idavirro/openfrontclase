import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

export default {
  entry: "./src/client/SchoolMain.ts",
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "eval-source-map",
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: "asset/resource",
        generator: {
          filename: "sounds/[name][ext]",
        },
      },
      {
        test: /\.txt$/i,
        use: "raw-loader",
      },
      {
        test: /\.json$/i,
        type: "asset/resource",
        generator: {
          filename: "data/[name][ext]",
        },
      },
    ],
  },
  
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].js",
    path: path.resolve(__dirname, "dist-school"),
    clean: true,
    publicPath: "/",
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/school.html",
      filename: "index.html",
      inject: "body",
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "resources",
          to: "",
          globOptions: {
            ignore: ["**/node_modules/**"],
          },
        },
      ],
    }),
    
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
      "process.env.GAME_ENV": JSON.stringify("dev"),
      "process.env.API_DOMAIN": JSON.stringify("localhost:3000"),
    }),
  ],
  
  devServer: {
    static: {
      directory: path.join(__dirname, "dist-school"),
    },
    compress: true,
    port: 8080,
    host: "0.0.0.0", // Allow external connections (important for Codespaces)
    allowedHosts: "all", // Allow all hosts (important for Codespaces)
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};