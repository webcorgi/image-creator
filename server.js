const express = require('express'); // Express 모듈을 불러옵니다.
const app = express(); // Express 앱을 생성합니다.
const cors = require('cors'); // CORS를 사용하기 위해 모듈을 불러옵니다.
const { translateRouter } = require('./api_translate'); // 'api_translate' 파일로부터 translateRouter를 가져옵니다.
const { createRouter } = require('./api_create'); // 'api_create' 파일로부터 createRouter를 가져옵니다.

app.use(cors()); // CORS 미들웨어를 사용합니다. 이를 통해 다른 도메인에서의 요청도 허용됩니다.
app.use(express.json()); // express.json 미들웨어를 사용합니다. 이를 통해 JSON 형식의 요청 본문을 파싱할 수 있습니다.

app.use('/translate', translateRouter); // '/translate' 경로로 오는 요청을 translateRouter로 처리합니다. (파파고 번역기 API를 사용)
app.use('/create', createRouter); // '/create' 경로로 오는 요청을 createRouter로 처리합니다.

app.list(3000, () => { // 서버가 3000번 포트에서 실행됩니다.
    console.log('Server started on port 3000'); // 서버가 시작되면 콘솔에 메시지를 출력합니다.
});