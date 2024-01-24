const express = require('express'); // express 모듈을 불러옵니다.
const bodyParser = require('body-parser'); // body-parser 모듈을 불러옵니다.
const fs = require('fs'); // fs (파일 시스템) 모듈을 불러옵니다.
const path = require('path'); // path 모듈을 불러옵니다.
const app = express(); // Express 앱을 생성합니다.

app.use(bodyParser.json()); // JSON 형식의 요청 본문을 파싱하기 위해 body-parser 미들웨어를 사용합니다.

// 서버에 이미지를 저장할 디렉토리 설정
const imageDirectory = path.join(__dirname, 'images');

// 이미지 저장용 디렉토리 생성
if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory);
}

app.post('/save', (req, res) => {
    const dataUrl = req.body.dataUrl; // 요청 본문에서 dataUrl을 추출합니다.

    if (!dataUrl) {
        res.status(400).json({ error: 'No image data provided' }); // dataUrl이 없으면 에러 메시지를 보냅니다.
        return;
    }

    // 파일 이름 생성 (예: timestamp.jpg)
    const fileName = `${Date.now()}.jpg`;
    const filePath = path.join(imageDirectory, fileName);

    // dataUrl을 이미지 파일로 저장
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, ''); // dataUrl에서 Base64 데이터 추출

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err); // 에러 발생 시 콘솔에 출력
            res.status(500).json({ error: 'Error saving the image' }); // 클라이언트에 에러 메시지 전송
        } else {
            console.log(`Image saved as ${fileName}`); // 저장 성공 메시지 출력
            res.status(200).json({ message: 'Image saved on the server' }); // 클라이언트에 성공 메시지 전송
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`); // 서버가 3000번 포트에서 리스닝 중임을 콘솔에 출력
});
