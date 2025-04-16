document.getElementById('bold').addEventListener('click', function() {
    formatText('bold');
});

document.getElementById('italic').addEventListener('click', function() {
    formatText('italic');
});

document.getElementById('list').addEventListener('click', function() {
    formatText('list');
});

document.getElementById('quote').addEventListener('click', function() {
    formatText('quote');
});

document.getElementById('title').addEventListener('click', function() {
    formatText('title');
});

// 定义一个函数，用于在选中的文本前后添加指定的前缀和后缀
function wrapSelection(prefix, suffix) {
    // 获取编辑器元素
    const editor = document.getElementById('editor');
    // 获取选中文本的起始位置
    const start = editor.selectionStart;
    // 获取选中文本的结束位置
    const end = editor.selectionEnd;
    // 获取选中的文本
    const selectedText = editor.value.substring(start, end);
    // 在选中文本前后添加指定的前缀和后缀
    const lines = selectedText.split('\n');
    const newText = lines.map(line => prefix + line).join('\n') + (suffix ? suffix : '');
    // 将选中文本替换为添加了前缀和后缀的新文本
    editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);
    // 设置光标位置为添加了前缀和后缀后的起始位置
    editor.selectionStart = start + prefix.length;
    editor.selectionEnd = start + newText.length - (suffix ? suffix.length : 0);
}