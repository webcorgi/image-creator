const axios = require('axios'); // HTTP 요청을 위한 axios 모듈을 불러옵니다.
const fs = require('fs'); // 파일 시스템(fs) 모듈을 불러옵니다.
const crypto = require('crypto'); // 암호화를 위한 crypto 모듈을 불러옵니다.

// 무작위 문자열 생성 함수
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 사용할 문자 세트
  const randomString = []; // 무작위 문자열을 저장할 배열
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length); // 무작위 인덱스 생성
    randomString.push(characters.charAt(randomIndex)); // 문자열에 문자 추가
  }
  return randomString.join(''); // 배열을 문자열로 변환하여 반환
}

// 이미지 파일 이름 생성 함수
function nameGenerator() {
  const now = new Date();

  // 날짜 형식 변경
  const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const randomPrefix = generateRandomString(4); // 무작위 접두사 생성
  const imageFileName = `${date.replace(/\//g, '')}${time.replace(/:/g, '')}${randomPrefix}`; // 파일 이름 생성

  console.log('Generated image file name:', imageFileName); // 생성된 파일 이름 출력
  return imageFileName; // 파일 이름 반환
}

// 이미지 저장 함수
function imgSaver(imageUrl, type){
  let imgName = ''
  axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream',
  })
  .then((response) => {
    const name = nameGenerator() // 이름 생성
    imgName = `${name}.jpg` // 파일 이름 설정

    let writer = ''
    // 이미지 경로에 파일 저장
    writer = fs.createWriteStream(`${__dirname}/img_ai/create/${imgName}`);

    response.data.pipe(writer); // 이미지 데이터를 파일에 씁니다.

    writer.on('finish', () => {
      console.log('Image downloaded and saved as JPG.'); // 다운로드 및 저장 완료 메시지
    });
    writer.on('error', (err) => {
      console.error('Error writing the image file:', err); // 파일 쓰기 오류 메시지
    });
    return imgName
  })
  .catch((error) => {
    console.error('Error:', error); // 다운로드 오류 메시지
  });
  return imgName
}

// 모듈 내보내기
module.exports = {
  imgSaver,
  nameGenerator
};
