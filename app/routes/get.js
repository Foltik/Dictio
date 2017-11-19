var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Upload = require("../models/Upload.js");

router.get('/:id', function(req, res) {
    Upload.findOne({
        id: req.params.id
    }, function(err, upload) {
        if (err) {
            res.status(500).json({"message": "Internal server error."});
        } else if (!upload) {
            res.status(404).json({"message": "Message not found."});
        } else {
            if (upload.destroy !== 0) {
                if (upload.views >= upload.destroy) {
                    Upload.deleteOne({id: req.params.id}, function(err) {
                        if (err) throw err;
                    });
                    res.status(404).json({"message": "Message not found."});
                    return;
                } else {
                    Upload.updateOne({id: req.params.id}, { $inc: {views: 1} }, function(err) {
                        if (err) throw err;
                    });
                }
            }

            if (upload.activates && Date.now() < upload.activates)
                res.status(403).json({"message": "Message not yet active."});
            else if (upload.expires && upload.expires < Date.now())
                res.status(403).json({"message": "Message expired."});
            else
                res.status(200).json({
                    "message": "Success.",
                    "name": upload.name,
                    "body": upload.body,
                    "created": upload.created,
                    "encrypted": upload.encrypted
                });
        }
    });
});

module.exports = router;