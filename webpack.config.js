const path = require('path');

module.exports = {
  entry: './src/index.js', // Path to the entry file
  output: {
    filename: 'tiptap-bundle.js', // Name of the output file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'production', // Optimize the build for production
};
