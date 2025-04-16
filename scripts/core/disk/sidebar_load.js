document.addEventListener('DOMContentLoaded', function() {
    const pathInput = document.getElementById('path-input');
    const pathList = document.getElementById('path-list');

    pathInput.addEventListener('input', function() {
        const inputPath = pathInput.value;
        const pathParts = inputPath.split('/').filter(part => part.trim() !== '');
        
        // 清空现有的路径列表
        pathList.innerHTML = '';

        // 根据输入的路径动态生成路径列表
        pathParts.forEach(part => {
            const listItem = document.createElement('li');
            listItem.textContent = part;
            pathList.appendChild(listItem);
        });
    });
});