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

// 定义一个函数，用于应用新的格式化
function applyNewFormatting(mmd, range, text, parentElement) {
    // 定义一个对象，用于存储不同的格式化函数
    const formatters = {
        // 加粗
        bold: () => createStyledElement('span', 'bold', text),
        // 斜体
        italic: () => createStyledElement('span', 'italic', text),
        // 链接
        link: () => createStyledElement('span', 'link', text),
        // 引用
        quote: () => {
            // 创建一个blockquote元素
            const blockquote = document.createElement('blockquote');
            // 设置blockquote的文本内容
            blockquote.textContent = text;
            // 添加灰色文本的样式
            blockquote.classList.add('gray-text');
            // 返回blockquote元素
            return blockquote;
        },
        // 标题
        title: () => {
            // 获取当前元素的标题级别
            const currentLevel = parentElement?.classList?.value.match(/title[1-6]/)?.[0] || 'title0';
            // 获取下一个标题级别
            const newLevel = getNextHeadingLevel(currentLevel);
            // 返回一个新的span元素
            return createStyledElement('span', newLevel, text);
        }
    };

    // 根据mmd获取对应的格式化函数，如果没有对应的格式化函数，则返回一个创建文本节点的函数
    const formatter = formatters[mmd] || (() => document.createTextNode(text));
    // 调用格式化函数，创建一个新的元素
    const newElement = formatter();

    range.deleteContents();
    range.insertNode(newElement);
    // 插入新的元素

    const newRange = document.createRange();
    // 创建一个新的range对象，选中新的元素
    newRange.selectNodeContents(newElement);
    range.setStart(newRange.startContainer, newRange.startOffset);
    // 设置range的起始位置和结束位置
    range.setEnd(newRange.endContainer, newRange.endOffset);

    // 添加视觉反馈（保留）
    newElement.classList.add('format-highlight');
    setTimeout(() => {
    // 1.2秒后移除视觉反馈
        newElement.classList.remove('format-highlight');
    }, 1200);
}

// 创建一个带有指定标签名、类名和文本内容的元素
function createStyledElement(tagName, className, text) {
    // 创建一个指定标签名的元素
    const element = document.createElement(tagName);
    // 设置元素的类名
    element.className = className;
    // 设置元素的文本内容
    element.textContent = text;
    // 返回创建的元素
    return element;
}

// 获取下一个标题级别
function getNextHeadingLevel(currentLevel) {
    // 定义标题级别数组
    const levels = ['title0', 'title1', 'title2', 'title3', 'title4', 'title5', 'title6'];
    // 获取当前标题级别在数组中的索引
    let index = levels.indexOf(currentLevel);
    // 如果当前级别大于等于6，则返回第一个级别，否则如果当前级别小于0，则返回第二个级别，否则返回下一个级别
    index = (index >= 6) ? 0 : (index < 0) ? 1 : index + 1;
    // 返回下一个级别
    return levels[index];
}
// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initFormatTooltip();
});