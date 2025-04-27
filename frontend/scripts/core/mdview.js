function formatText(mmd) {
    try {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText) return;

        const { formattedClass, element: parentElement } = getCurrentFormatState(range);

        if (formattedClass) {
            if (shouldRemoveFormatting(mmd, formattedClass)) {
                return removeFormatting(parentElement, range, selectedText);
            }
            if (mmd === 'title') {
                return adjustHeadingLevel(parentElement, formattedClass);
            }
        }

        applyNewFormatting(mmd, range, selectedText, parentElement);

        selection.removeAllRanges();
        selection.addRange(range);
        
        // 更新调试信息（保留）
        updateFormatDebug(range.startContainer.parentElement);
    } catch (error) {
        showFormatError(`格式操作失败：${error.message}`);
    }
}

/* ================ 辅助函数区域 ================ */
function getCurrentFormatState(range) {
    let parentElement = range.commonAncestorContainer;
    
    for (let i = 0; i < 3; i++) {
        if (parentElement.nodeType === 3) {
            parentElement = parentElement.parentNode;
        }
        const classList = parentElement.classList;
        
        const formatTypes = {
            bold: 'bold',
            italic: 'italic',
            link: 'link',
            quote: 'blockquote',
            title: /^title[1-6]$/
        };

        for (const [type, pattern] of Object.entries(formatTypes)) {
            if (typeof pattern === 'string' && classList.contains(pattern)) {
                return { formattedClass: pattern, element: parentElement };
            }
            if (pattern instanceof RegExp && Array.from(classList).some(c => pattern.test(c))) {
                return { formattedClass: Array.from(classList).find(c => pattern.test(c)), element: parentElement };
            }
            if (parentElement.tagName?.toLowerCase() === pattern) {
                return { formattedClass: type, element: parentElement };
            }
        }
        
        if (parentElement.parentNode) {
            parentElement = parentElement.parentNode;
        }
    }
    return { formattedClass: null, element: null };
}

function shouldRemoveFormatting(mmd, currentFormat) {
    const formatMapping = {
        bold: 'bold',
        italic: 'italic',
        link: 'link',
        quote: 'quote'
    };
    return formatMapping[mmd] === currentFormat;
}

function removeFormatting(element, range, text) {
    const textNode = document.createTextNode(text);
    element.parentNode.replaceChild(textNode, element);
    
    const newRange = document.createRange();
    newRange.setStart(textNode, 0);
    newRange.setEnd(textNode, text.length);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(newRange);
}

function adjustHeadingLevel(element, currentClass) {
    const headingLevels = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6'];
    const currentIndex = headingLevels.indexOf(currentClass);
    
    if (currentIndex === -1) return;
    
    if (currentIndex === headingLevels.length - 1) {
        const textNode = document.createTextNode(element.textContent);
        element.parentNode.replaceChild(textNode, element);
    } else {
        element.classList.remove(currentClass);
        element.classList.add(headingLevels[currentIndex + 1]);
    }
}

function applyNewFormatting(mmd, range, text, parentElement) {
    const formatters = {
        bold: () => createStyledElement('span', 'bold', text),
        italic: () => createStyledElement('span', 'italic', text),
        link: () => createStyledElement('span', 'link', text),
        quote: () => {
            const blockquote = document.createElement('blockquote');
            blockquote.textContent = text;
            blockquote.classList.add('gray-text');
            return blockquote;
        },
        title: () => {
            const currentLevel = parentElement?.classList?.value.match(/title[1-6]/)?.[0] || 'title0';
            const newLevel = getNextHeadingLevel(currentLevel);
            return createStyledElement('span', newLevel, text);
        }
    };

    const formatter = formatters[mmd] || (() => document.createTextNode(text));
    const newElement = formatter();

    range.deleteContents();
    range.insertNode(newElement);

    const newRange = document.createRange();
    newRange.selectNodeContents(newElement);
    range.setStart(newRange.startContainer, newRange.startOffset);
    range.setEnd(newRange.endContainer, newRange.endOffset);

    // 添加视觉反馈（保留）
    newElement.classList.add('format-highlight');
    setTimeout(() => {
        newElement.classList.remove('format-highlight');
    }, 1200);
}

function createStyledElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

function getNextHeadingLevel(currentLevel) {
    const levels = ['title0', 'title1', 'title2', 'title3', 'title4', 'title5', 'title6'];
    let index = levels.indexOf(currentLevel);
    index = (index >= 6) ? 0 : (index < 0) ? 1 : index + 1;
    return levels[index];
}

/* ================ 调试功能区域 ================ */
// 更新调试格式
function updateFormatDebug(element) {
    // 获取当前格式显示元素和元素路径显示元素
    const formatDisplay = document.getElementById('current-format');
    const pathDisplay = document.getElementById('element-path');
    
    // 如果没有获取到元素，则返回
    if (!formatDisplay || !pathDisplay) return;
    
    // 定义路径数组
    let path = [];
    // 定义当前元素
    let current = element;
    // 循环遍历当前元素的父元素，直到根元素
    while (current && current !== document.body) {
        // 将当前元素的标签名和id添加到路径数组中
        path.push(`${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ''}`);
        // 将当前元素设置为父元素
        current = current.parentElement;
    }
    
    // 将当前元素的格式信息显示在格式显示元素中
    formatDisplay.textContent = getFormatInfo(element) || '无特殊格式';
    // 将路径数组中的前5个元素以'>'连接，如果路径数组长度大于5，则添加'...'
    pathDisplay.textContent = `DOM路径：${path.slice(0, 5).join(' > ')}${path.length > 5 ? '...' : ''}`;
}

// 获取元素格式信息
function getFormatInfo(element) {
    // 如果元素没有classList属性，则返回null
    if (!element?.classList) return null;
    
    // 定义格式映射
    const formatMap = {
        'bold': '加粗',
        'italic': '倾斜',
        'link': '链接',
        'title1': '标题1',
        'title2': '标题2',
        'title3': '标题3',
        'title4': '标题4',
        'title5': '标题5',
        'title6': '标题6',
        'gray-text': '引用'
    };

    // 在元素的classList中查找匹配的格式
    const matchedClass = Array.from(element.classList).find(c => formatMap[c]);
    
    // 如果没有匹配的格式，则向上查找父元素的classList，最多查找3层
    if (!matchedClass) {
        let current = element.parentElement;
        for (let i = 0; i < 3 && current; i++) {
            const parentClass = Array.from(current.classList).find(c => formatMap[c]);
            if (parentClass) return formatMap[parentClass];
            current = current.parentElement;
        }
    }

    // 返回匹配的格式，如果没有匹配的格式，则返回null
    return matchedClass ? formatMap[matchedClass] : null;
}

// 定义一个函数，用于显示格式错误信息
function showFormatError(message) {
    // 创建一个div元素
    const errorBar = document.createElement('div');
    // 设置div元素的class为format-error
    errorBar.className = 'format-error';
    // 设置div元素的文本内容为传入的message参数
    errorBar.textContent = message;
    // 设置div元素的样式
    errorBar.style = `
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff4444;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 1000;
        animation: fadeIn 0.3s;
    `;
    
    // 将div元素添加到body元素中
    document.body.appendChild(errorBar);
    // 设置一个定时器，在2.7秒后执行
    setTimeout(() => {
        // 设置div元素的动画为fadeOut
        errorBar.style.animation = 'fadeOut 0.3s';
        // 设置一个定时器，在0.3秒后执行
        setTimeout(() => errorBar.remove(), 300);
    }, 2700);
}

// 初始化（移除 setupFormatHover 调用）
document.addEventListener('DOMContentLoaded', () => {});