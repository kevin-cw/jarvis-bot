const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const USER_ID = 'U6169d7be03e2f9a1dc41a70f8a7f4fb5'; // 你的 LINE ID

// 設定定時訊息
const dailyReminders = [
  { time: '08:00', message: '☀️ 早安，王子殿下👑，今天是充滿活力的一天💪🏻' },
  { time: '10:00', message: '🥐 精神如何，早餐吃了什麼呢？' },
  { time: '13:00', message: '🍱 休息啦，午餐吃了什麼呢？' },
  { time: '19:00', message: '🍴 王子殿下👑，晚餐想吃什麼呢，快到ChatGPT跟我討論吧？' },
  { time: '20:00', message: '🏃‍♂️ 吃飽休息後，記得該運動一下吧！' },
  { time: '21:00', message: '🌙 最後....晚餐吃了什麼呢？' },
  { time: '23:00', message: '🛌 睡前提醒：今天有運動嗎？也讓我幫你整理三餐紀錄吧！' },
  { time: '00:55', message: '🧪 測試訊息：如果你看到這條代表定時推播成功' } 
];

// 確認 webhook 正常
app.get('/webhook', (req, res) => {
  res.send('✅ Jarvis is awake and ready to push!');
});

// 用來發送推播訊息的 POST 接口
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

// 啟動伺服器
app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Jarvis 推播模式啟動！');
});