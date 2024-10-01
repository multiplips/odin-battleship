import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const config = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    watchFiles: ['./src/template.html'],
  },
});

export default config;
