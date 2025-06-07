// 定時推播功能
const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const USER_ID = 'U6169d7be03e2f9a1dc41a70f8a7f4fb5'; // 用戶 LINE ID

// 定義要發送的訊息內容
const dailyReminders = [
  { time: '08:00', message: '早安☀️ Jarvis 問你：早餐吃了什麼呀？' },
  { time: '10:00', message: '🍽 該紀錄早餐囉，吃了什麼呢？' },
  { time: '13:00', message: '🥗 午餐時間到，吃了什麼呢？' },
  { time: '19:00', message: '🌙 晚餐通常在這時候吃～有特別吃什麼嗎？' },
  { time: '21:00', message: '🍱 晚餐記得紀錄，Jarvis 等你回報唷' },
  { time: '20:00', message: '🏃‍♂️ Jarvis 提醒：今天運動安排記得完成唷！' },
  { time: '23:00', message: '🛌 睡前提醒：今天有運動嗎？也讓我幫你整理三餐紀錄吧！' }
];

// 提供一個 ping 用的 GET 路由
app.get('/webhook', (req, res) => {
  res.send('✅ Jarvis is awake and ready to push!');
});

// 觸發推播的 endpoint
app.post('/push', async (req, res) => {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5);

  const task = dailyReminders.find(r => r.time === hhmm);

  if (task) {
    try {
      await client.pushMessage(USER_ID, {
        type: 'text',
        text: task.message
      });
      console.log(`✅ ${hhmm} 傳送訊息：「${task.message}」`);
      res.status(200).send('OK');
    } catch (err) {
      console.error('❌ 傳送失敗：', err);
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('⏰ 非定時時間，不發送');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Jarvis 推播模式啟動！');
});