function openFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.mdh,.html'; // 接受自定义格式

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', function(e) {
                // 直接提取内容区的HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(e.target.result, 'text/html');
                const content = doc.querySelector('body > .normal').innerHTML;
                document.getElementById('inputText').innerHTML = content;
            });
            reader.readAsText(file);
        }
    });
    fileInput.click();
}
