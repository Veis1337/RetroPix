const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const target =
    process.env.NODE_ENV === 'production'
      ? 'postgres://hzufnqdfgeiejx:764e8272856e364392d9e170f8f224a75bed431409a70589540e314031783312@ec2-18-211-215-8.compute-1.amazonaws.com:5432/dd41ktda7ioobh'
      : 'http://localhost:5000';

  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
