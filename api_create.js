const express = require('express') // express 모듈을 불러옵니다.
const OpenAI = require('openai') // openai 모듈을 불러옵니다.
const { imgSaver } = require('./imgSaver') // imgSaver 모듈을 불러옵니다.
const cors = require('cors') // cors 모듈을 불러옵니다.
const router = express.Router() // express 라우터를 생성합니다.

router.use(cors()) // CORS 미들웨어를 사용합니다.
router.use(express.json()) // JSON 형식의 요청 본문을 처리하기 위한 미들웨어를 사용합니다.
router.use(express.urlencoded({extended: true})) // URL 인코딩된 요청 본문을 처리하기 위한 미들웨어를 사용합니다.

require("dotenv").config() // .env 파일에서 환경 변수를 불러옵니다.

// .env에서 값을 불러올 때, API 키 값이 변경되는 것을 의심해야 함. 환경 변수나 다른 곳에서 덮어쓰기가 발생했을 수 있음.
const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})

// 이미지 생성 라우트
router.post('/', async (req, res) => {
    const { ea, size, prompt } = req.body; // 요청 본문에서 ea, size, prompt를 추출합니다.
    if (!ea || !size || !prompt) {
        return res.status(400).send('No prompt provided') // 필요한 데이터가 없으면 에러 응답을 보냅니다.
    }

    try {
        // OpenAI API에 이미지 생성 요청
        const response = await openai.images.generate({
            n: ea, // 생성할 이미지 수 (1에서 10 사이)
            size: size,
            prompt: prompt,
        })

        // 응답에서 이미지 URL 추출
        const imageUrls = response.data.map((item) => item.url)

        // 서버에 이미지 저장
        imageUrls.map((imageUrl) => imgSaver(imageUrl, 'create'))

        // 프론트엔드에 이미지 정보 전송
        res.send(imageUrls)
    } catch (error) {
        res.status(500).send('Error generating image: ' + error.message) // 이미지 생성 중 오류 발생 시 처리
    }
})

module.exports = {
    createRouter: router, // 생성된 라우터를 모듈로 내보냅니다.
}
