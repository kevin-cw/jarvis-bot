const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

const config = {
  channelAccessToken: 'saL3wQf0xoUsCyma1ougV57yS3JXWRdHT+n/JBeQhzmOBI+ryqQNj1GYoV9/udujhs9bGQOfcV7wJtlmtSRpPZwCzMrGubIcuG0yuXKX6tGIWMRoAv4G0eBRofMSlCgVSeYFt8H+SNiDYRCvZ0sv6gdB04t89/1O/w1cDnyilFU=',
  channelSecret: '21ae88911a3b64fcc3dbba6c03694f1e'
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(event => {
      if (event.type === 'message' && event.message.type === 'text') {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: `Jarvis 收到：「${event.message.text}」✅`
        });
      }
      return Promise.resolve(null);
    }))
    .then(result => res.json(result));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Jarvis 開始工作啦！');
});
