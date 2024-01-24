const express = require("express"); // express 모듈을 불러옴
const app = express(); // express 애플리케이션을 생성
const OpenAI = require("openai"); // openai 모듈을 불러옴

// OpenAI API를 사용하기 위한 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* 테스트 */
// '/' 경로로 GET 요청이 들어올 때의 처리
app.get("/", async (req, res) => {
  try {
    // OpenAI 챗봇의 응답을 생성
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "gpt-3.5-turbo",
    });

    // API에서 오류가 발생했을 경우 처리
    if (chatCompletion.errors) {
      res.status(500).send("API Error: " + chatCompletion.errors[0].message);
    } else {
      // 오류가 없으면 결과 전송
      res.send(chatCompletion);
      // 콘솔에 결과 출력
      console.log(
        "🚀 ~ file: app.js:20 ~ app.get ~ chatCompletion:",
        chatCompletion
      );
    }
  } catch (error) {
    // 요청 처리 중 오류 발생 시 처리
    res.status(500).send("Error: " + error.message);
  }
});

// 서버가 3000번 포트에서 실행됨을 알림
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
