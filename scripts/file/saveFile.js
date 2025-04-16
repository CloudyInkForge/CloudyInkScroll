function saveFile() {
    // 直接保存原始HTML内容
    const inputContent = document.getElementById('inputText').innerHTML;
    
    // 创建带样式的完整HTML文档
    const fullContent = `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="../styles/mdview.css">
</head>
<body>
    <div class="normal">${inputContent}</div>
</body>
</html>`;

    const blob = new Blob([fullContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.mdh'; // 使用自定义扩展名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
