// utils/serveStaticWithCORS.js
const express = require('express');
const path = require('path');

function serveWithCORS(app, staticPath, route) {
  app.use(route, (req, res, next) => {
    const allowedOrigins =
      process.env.NODE_ENV === 'production'
        ? [
            'https://test.asole.xyz',
            'http://asole.xyz',
            'https://asole.xyz',
            'https://ayagro.asia',
            'https://www.ayagro.asia',
          ]
        : [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://ayagro.asia',
            'https://www.ayagro.asia',
          ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  app.use(route, express.static(staticPath));
}

module.exports = serveWithCORS;
