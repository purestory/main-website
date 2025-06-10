// Chrome Browser App Logic
document.addEventListener('DOMContentLoaded', function() {
    const chromeUrlInput = document.getElementById('chromeUrlInput');
    const chromeGoButton = document.getElementById('chromeGoButton');
    const chromeFrame = document.getElementById('chromeFrame');

    function navigateToUrl() {
        let url = chromeUrlInput.value.trim();
        
        // URL 형식 검사 및 보정
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                url = 'https://google.com/search?q=' + encodeURIComponent(url);
            }
        }

        try {
            chromeFrame.src = url;
            chromeUrlInput.value = url;
        } catch (error) {
            console.error('URL 로딩 오류:', error);
            alert('URL을 로드할 수 없습니다. 보안 정책으로 인해 일부 사이트는 iframe에서 실행되지 않을 수 있습니다.');
        }
    }

    if (chromeGoButton) {
        chromeGoButton.addEventListener('click', navigateToUrl);
    }

    if (chromeUrlInput) {
        chromeUrlInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                navigateToUrl();
            }
        });
    }

    // 브라우저 창이 열릴 때 포커스 설정
    const chromeWindow = document.getElementById('chrome-app-window');
    if (chromeWindow) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    const isVisible = chromeWindow.style.display !== 'none';
                    if (isVisible && chromeUrlInput) {
                        setTimeout(() => {
                            chromeUrlInput.focus();
                            chromeUrlInput.select();
                        }, 100);
                    }
                }
            });
        });

        observer.observe(chromeWindow, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
}); 