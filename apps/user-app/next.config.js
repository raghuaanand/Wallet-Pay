module.exports = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../../'),
  }
};
