// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);
	// Customize the config before returning it.
	config.resolve.alias["@stripe/stripe-react-native"] = "null-loader"; // ADD THIS LINE
	return config;
};

module: {
  rules: [
    // This would match almost any react-native module
    {
      test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
      include: /node_modules/,
      exclude: [/react-native-web/, /\.(native|ios|android)\.(ts|js)x?$/],
      loader: 'babel-loader'
    },
  
  ]
}