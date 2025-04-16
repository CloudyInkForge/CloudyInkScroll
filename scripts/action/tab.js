// ./scripts/action/tab.js
document.addEventListener('DOMContentLoaded', () => {
    // 监听TAB键事件来切换输入层、素材层和背景层
    let tabPressCount = 0;
    let lastTabPressTime = 0;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault(); // 阻止默认的TAB键行为

            const currentTime = new Date().getTime();
            const timeDifference = currentTime - lastTabPressTime;

            if (timeDifference < 300 && tabPressCount > 0) {
                // 双击处理逻辑
                handleTabDoubleClick();
                tabPressCount = 0; // 重置计数器
            } else {
                tabPressCount++;
                lastTabPressTime = currentTime;
                setTimeout(() => {
                    if (tabPressCount === 1) {
                        // 单击处理逻辑
                        handleTabSingleClick();
                    }
                    tabPressCount = 0; // 重置计数器
                }, 300);
            }
        }
    });

    function handleTabSingleClick() {
        const inputText = document.getElementById('inputText');
        const materialText = document.getElementById('materialText');

        if (inputText.style.display === 'none') {
            inputText.style.display = 'block';
            materialText.style.display = 'none';
        } else {
            inputText.style.display = 'none';
            materialText.style.display = 'block';
        }
    }

    function handleTabDoubleClick() {
        const inputText = document.getElementById('inputText');
        const backgroundLayer = document.getElementById('backgroundLayer');

        if (inputText.style.display === 'none') {
            inputText.style.display = 'block';
            backgroundLayer.style.display = 'none';
        } else {
            inputText.style.display = 'none';
            backgroundLayer.style.display = 'block';
        }
    }
});