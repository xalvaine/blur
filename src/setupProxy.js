module.exports = function (app) {
  app.use('/service-worker.js(.map)?', function (req, res) {
    res.download(`./build${req.originalUrl}`)
  })

  app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
  });
};
