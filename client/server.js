const proxy = require('http-proxy-middleware');
const Bundler = require('parcel-bundler');
const express = require('express');

const bundler = new Bundler('./public/index.html');
const app = express();

app.use('/api',
    proxy({
        target: 'http://localhost:5000'
    })
);

app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 3000));