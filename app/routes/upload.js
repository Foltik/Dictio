var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var Upload = require('../models/Upload.js');
var gmail = require('gmail-send');
var request = require('request');

function genId() {
    var charset = "abcdefghijklmnopqrstuvwxyz";
    id = "";
    for (var i = 0; i < 5; i++)
        id += charset.charAt(Math.floor(Math.random() * charset.length));
    return id;
}

function verifyRequest(body) {
    return body.name && body.body && body.encrypted;
}

function sendEmail(id, name, recipient) {
    gmail({
        user: 'xxxxxx@gmail.com',
        pass: 'xxxxxx',
        to: recipient,
        subject: 'Dictio',
        text: 'Someone has sent you a message, entitled "' + name + '"! View it at www.dictio.com/v/' + id
    }, function(err, res) {
        if (err) throw err;
    });
}

function sendSms(id, name, recipient) {
    request.post('https://textbelt.com/text', {
        form: {
            phone: recipient,
            message: 'Someone has sent you a message, entitled "' + name + '"! View it at www.dictio.com/v/' + id,
            key: 'xxxxxx'
        }
    }, function (err, res, body) {
        if (err) throw err;
    });
}

router.post('/', function (req, res) {
    var body = req.body;
    if (!verifyRequest(body))
        return res.status(400).json({"message": "Invalid request."});

    var id = genId();
    Upload.create({
        id: id,
        name: body.name,
        body: body.body,
        created: Date.now(),
        activates: body.activates === "undefined" ? null : body.activates,
        expires: body.expires === "undefined" ? null : body.expires,
        encrypted: body.encrypted,
        destroy: body.destroy,
        views: 0
    }, function (err) {
        if (err)
            res.status(500).json({"message": "Internal server error: " + err.message});
        else {
            //TODO: Implement proper email functionality
            //if (body.emailRecipient !== "undefined")
                //sendEmail(id, body.name, body.emailRecipient);

            //if (body.smsRecipient !== "undefined")
            //    sendSms(id, body.name, body.smsRecipient);

            res.status(200).json({"message": "Success.", "id": id});
        }
    });
});

module.exports = router;
