const express = require('express');
const line = require('@line/bot-sdk');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/webhook', line.middleware(config), async (req, res) => {
  const events = req.body.events;
  const results = await Promise.all(events.map(async (event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text;

      const gptPrompt = `
你是一位營養師，請幫我分析以下一餐的內容，預估總熱量、蛋白質、碳水化合物。
請輸出簡單清楚的結果，不要多餘廢話。餐點如下：
"${userText}"
`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: gptPrompt }]
        });

        const replyText = completion.choices[0].message.content;

        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: replyText
        });

      } catch (err) {
        console.error('GPT 回應錯誤:', err);
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'Jarvis 分析失敗了🥲 請稍後再試'
        });
      }
    } else {
      return Promise.resolve(null);
    }
  }));

  res.json(results);
});

console.log('📦 環境變數讀取測試：');
console.log('CHANNEL_ACCESS_TOKEN:', process.env.CHANNEL_ACCESS_TOKEN);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '存在 ✅' : '❌ 沒讀到');

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Jarvis GPT 模式上線啦！');
});
