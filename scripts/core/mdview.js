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
function updateFormatDebug(element) {
    const formatDisplay = document.getElementById('current-format');
    const pathDisplay = document.getElementById('element-path');
    
    if (!formatDisplay || !pathDisplay) return;
    
    let path = [];
    let current = element;
    while (current && current !== document.body) {
        path.push(`${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ''}`);
        current = current.parentElement;
    }
    
    formatDisplay.textContent = getFormatInfo(element) || '无特殊格式';
    pathDisplay.textContent = `DOM路径：${path.slice(0, 5).join(' > ')}${path.length > 5 ? '...' : ''}`;
}

function getFormatInfo(element) {
    if (!element?.classList) return null;
    
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

    const matchedClass = Array.from(element.classList).find(c => formatMap[c]);
    
    if (!matchedClass) {
        let current = element.parentElement;
        for (let i = 0; i < 3 && current; i++) {
            const parentClass = Array.from(current.classList).find(c => formatMap[c]);
            if (parentClass) return formatMap[parentClass];
            current = current.parentElement;
        }
    }

    return matchedClass ? formatMap[matchedClass] : null;
}

function showFormatError(message) {
    const errorBar = document.createElement('div');
    errorBar.className = 'format-error';
    errorBar.textContent = message;
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
    
    document.body.appendChild(errorBar);
    setTimeout(() => {
        errorBar.style.animation = 'fadeOut 0.3s';
        setTimeout(() => errorBar.remove(), 300);
    }, 2700);
}

// 初始化（移除 setupFormatHover 调用）
document.addEventListener('DOMContentLoaded', () => {});