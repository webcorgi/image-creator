const server = 'http://localhost:3000'; // 서버 주소 설정
const loader = '<div class="loader__wrap"><div class="loader"><span></span></div></div>' // 로딩 애니메이션 HTML

// generatebox 요소에 HTML 삽입하는 함수
function insertToGeneratebox(e){
    document.querySelector('.generatebox').innerHTML = e
}

// 텍스트 번역 함수
function translateText(text) {
    return fetch(server + '/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    })
}

/********************************************
 * 이미지 생성
 *********************************************/
async function activeCreateImage(){
    let url = '/create';
    var ea = document.getElementById('create__select__ea').value; // 생성할 이미지의 수량 선택
    var size = document.getElementById('create__select__size').value; // 이미지 크기 선택
    let prompt = document.getElementById('create__input').value // 사용자 입력 텍스트

     // 수량 선택 확인
    if (ea === "") {
        alert('수량을 선택해주세요') // 수량 미선택 시 알림
        return
    }

     // 크기 선택 확인
    if (size === "") {
        alert('크기를 선택해주세요') // 크기 미선택 시 알림
        return
    }

    // 프롬프트 입력 확인
    if(!prompt.trim().length) {
        alert("프롬프트를 입력해주세요") // 프롬프트 미입력 시 알림
        return
    }

    // 서버에 이미지 생성 요청
    connectServerCreate(url, ea, size, prompt)
}

async function connectServerCreate(url, ea, size, prompt){
    insertToGeneratebox(loader) // 로딩 애니메이션 표시

    try {
        let response = await translateText(prompt); // 텍스트 번역 요청
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // 응답 오류 처리
        }
        let jsonResponse = await response.json(); // JSON 형태로 응답 변환

        let data = {
            ea: ea,
            size: size,
            prompt: jsonResponse.message.result.translatedText // 번역된 텍스트 사용
        }

        let imageResponse = await fetch(server + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!imageResponse.ok) {
            throw new Error(`HTTP error! status: ${imageResponse.status}`); // 이미지 응답 오류 처리
        }

        let imageUrls = await imageResponse.json(); // 생성된 이미지 URL들
        const imageTags = imageUrls.map((imageUrl) => `<div class="imgbox"><a href=${imageUrl} class="btn__download" download></a><img src="${imageUrl}" alt="Generated Image"></div>`)
        insertToGeneratebox(imageTags.join(' ')); // 이미지 태그를 generatebox에 삽입
    } catch (error) {
        console.error('Error:', error); // 오류 처리
        insertToGeneratebox('<div></div>') // 오류 시 빈 div 표시
    }
}

/********************************************
 * 이미지 생성 종료
 *********************************************/
