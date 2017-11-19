var upload = require('./upload.js');
var get = require('./get.js');
var index = require('./index.js');
var view = require('./view.js');

module.exports = function (app) {
    app.use('/', index);
    app.use('/v*', view);
    app.use('/api/upload', upload);
    app.use('/api/get', get);
};