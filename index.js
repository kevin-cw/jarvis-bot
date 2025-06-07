const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const app = express();
app.use(express.json()); // 允許接收 JSON 格式資料

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const USER_ID = 'U6169d7be03e2f9a1dc41a70f8a7f4fb5'; // 用戶 LINE ID

// 確認伺服器狀態（GET 用來 ping 測試）
app.get('/webhook', (req, res) => {
  res.send('✅ Jarvis is awake and ready to push!');
});

// 接收 Cron-job 傳來的 POST 請求推播訊息
app.post('/push', async (req, res) => {
  console.log('🔍 收到請求內容：', req.body);
  const { message } = req.body;

  if (!message) {
    console.log('❌ 缺少訊息內容');
    return res.status(400).send('缺少 message 內容');
  }

  try {
    await client.pushMessage(USER_ID, {
      type: 'text',
      text: message
    });
    console.log(`✅ 傳送訊息：「${message}」`);
    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ 傳送失敗：', err);
    res.status(500).send('Error');
  }
});

// 啟動伺服器
app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Jarvis 推播模式啟動（B方案）！');
});
