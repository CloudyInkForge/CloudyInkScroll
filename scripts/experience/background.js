document.addEventListener('DOMContentLoaded', () => {
    // 文件选择器事件处理
    document.getElementById('backgroundFileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const backgroundLayer = document.querySelector('.background-block');
                if (file.type.startsWith('image/')) {
                    backgroundLayer.style.backgroundImage = `url(${e.target.result})`;
                    backgroundLayer.style.backgroundSize = 'cover';
                    backgroundLayer.style.backgroundPosition = 'center';
                    backgroundLayer.style.backgroundRepeat = 'no-repeat';
                    backgroundLayer.innerHTML = ''; // 清除之前的视频内容
                } else if (file.type.startsWith('video/')) {
                    backgroundLayer.innerHTML = `<video autoplay loop muted playsinline>
                                                    <source src="${e.target.result}" type="${file.type}">
                                                    Your browser does not support the video tag.
                                                </video>`;
                    backgroundLayer.style.backgroundImage = ''; // 清除之前的图片背景
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // 显示文件选择器
    function showBackgroundFileInput() {
        document.getElementById('backgroundFileInput').click();
    }

    // 将 showBackgroundFileInput 函数暴露给全局作用域
    window.showBackgroundFileInput = showBackgroundFileInput;
});
