// 实现HTML内容转换为Markdown格式的核心函数
function htmlToMarkdown(node) {
    let markdown = '';
    if (node.nodeType === Node.TEXT_NODE) {
        // 处理特殊字符转义
        markdown += node.textContent
            .replace(/\*/g, '\\*')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_');
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const classes = node.classList;

        // 预生成子节点内容以处理嵌套格式
        let childContent = Array.from(node.childNodes)
            .map(child => htmlToMarkdown(child))
            .join('');

        // 处理标题
        const titleClass = Array.from(classes).find(c => c.startsWith('title'));
        if (titleClass) {
            const level = parseInt(titleClass.replace('title', ''), 10);
            childContent = `${'#'.repeat(level)} ${childContent}\n\n`;
        }

        // 处理粗体
        if (classes.contains('bold')) {
            childContent = `**${childContent}**`;
        }

        // 处理斜体
        if (classes.contains('italic')) {
            childContent = `*${childContent}*`;
        }

        // 处理引用块
        if (tag === 'blockquote') {
            childContent = `> ${childContent.replace(/\n/g, '\n> ')}\n\n`;
        }

        // 处理换行（div/p/br等块级标签）
        if (['div', 'p', 'br'].includes(tag)) {
            childContent += '\n';
        }

        // 处理链接（假设链接文本直接存储）
        if (classes.contains('link')) {
            childContent = `[${childContent}](URL)`;
        }

        markdown += childContent;
    }
    return markdown;
}

// 实现另存为Markdown文件的功能
function saveAsFile() {
    try {
        const inputElement = document.getElementById('inputText');
        const tempWrapper = document.createElement('div');
        tempWrapper.innerHTML = inputElement.innerHTML;
        
        // 转换处理并清理多余换行
        let markdownContent = htmlToMarkdown(tempWrapper)
            .replace(/\n{3,}/g, '\n\n')  // 合并多余空行
            .trim();

        // 创建下载文件
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'document.md';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('导出Markdown失败:', error);
        alert('导出失败，请检查控制台日志');
    }
}