const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const target =
    process.env.NODE_ENV === 'production'
      ? 'postgres://jmgksodqqehgem:510d7c4a8c1c38b72b6851fd0fbe40fc22fc97bcce532277e67e29f895c8905a@ec2-34-197-91-131.compute-1.amazonaws.com:5432/do82ndqfpbd4c'
      : 'http://localhost:5000';

  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
