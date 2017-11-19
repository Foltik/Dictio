var mongoose = require('mongoose');

var UploadSchema = mongoose.Schema({
    id: String,
    name: String,
    body: String,
    created: Date,
    activates: Date,
    expires: Date,
    encrypted: Boolean,
    destroy: Number,
    views: Number
});

module.exports = mongoose.model('Upload', UploadSchema);