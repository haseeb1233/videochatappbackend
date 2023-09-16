const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
 require('dotenv').config();

 const app = express();

 var PORT = process.env.PORT;

// Fill the appID and appCertificate key given by Agora.io
var appID = process.env.APP_ID;
var appCertificate = process.env.APP_CERTIFICATE;

// token expire time, hardcode to 3600 seconds = 1 hour
var expirationTimeInSeconds = 3600
var role = RtcRole.PUBLISHER

app.disable('x-powered-by');
app.set('port', PORT);



var generateRtcToken = function(req, resp) {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var channelName = req.query.channelName||"main";
    // use 0 if uid is not specified
    var uid = req.query.uid || 0
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel name is required' }).send();
    }


    var key = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

    resp.header("Access-Control-Allow-Origin", "*")
        //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

var generateRtmToken = function(req, resp) {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var account = req.query.account;
    if (!account) {
        return resp.status(400).json({ 'error': 'account is required' }).send();
    }

    var key = RtmTokenBuilder.buildToken(appID, appCertificate, account, RtmRole, privilegeExpiredTs);

    resp.header("Access-Control-Allow-Origin", "*")
        //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

app.get('/rtcToken', generateRtcToken);
app.get('/rtmToken', generateRtmToken);





  app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });