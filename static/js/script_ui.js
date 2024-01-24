// DOM이 준비된 후 실행 (DOM이 모두 읽히고 처리될 수 있도록 타이밍 오류 방지)
document.addEventListener("DOMContentLoaded", function() {
    activePopup() // 팝업 창 열기 및 닫기
});

function activePopup(){
    const parentElement = document.querySelector('.ai__type'); // ai__type 클래스를 가진 요소 선택
    const buttons = parentElement.querySelectorAll('button'); // 버튼들 선택

    buttons.forEach(function (button) {
         // 팝업 창 열기
        button.addEventListener('click', function (event) {
            var clickedElement = event.target; // 클릭된 요소 추출

            const name = clickedElement.getAttribute('data-type'); // data-type 속성 추출
            const popup = document.querySelector(`.popup.${name}`); // 해당 이름의 팝업 선택
            popup.style.top = 0; // 팝업 위치 설정
            closePopup(name, popup) // 팝업 닫기 함수 호출
        })
    })
}

// 팝업 창 닫기 함수
function closePopup(name, popup){
    document.getElementById(`close__${name}`).addEventListener('click', function(){
        popup.style.top='100%' // 팝업 위치를 변경하여 닫음
    })
}

function downloadImage(el) {
    let src = el.getAttribute('src'); // 이미지 소스 URL 추출
    let img = new Image();

    img.onload = function () {
        let canvas = document.createElement('canvas'); // 캔버스 생성
        let ctx = canvas.getContext('2d'); // 2D 컨텍스트 획득
        canvas.width = img.width; // 캔버스 너비 설정
        canvas.height = img.height; // 캔버스 높이 설정
        ctx.drawImage(img, 0, 0); // 이미지를 캔버스에 그림

        // 캔버스에서 데이터 URL 생성
        let dataURL = canvas.toDataURL('image/png');

        // 다운로드 링크 생성 및 클릭
        let downloadLink = document.createElement('a'); // 링크 요소 생성
        downloadLink.href = dataURL; // 링크의 href에 데이터 URL 지정
        downloadLink.download = 'downloadedImage.png'; // 다운로드 될 파일명 설정
        document.body.appendChild(downloadLink); // 링크 요소를 문서에 추가
        downloadLink.click(); // 링크 클릭으로 다운로드 실행
        document.body.removeChild(downloadLink); // 링크 요소 제거
    };

    img.src = src; // 이미지 소스 설정
}
