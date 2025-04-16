function formatText(mmd) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return; // 添加空选中保护

    // 获取当前格式状态
    const { formattedClass, element: parentElement } = getCurrentFormatState(range);

    // 处理取消格式化和特殊逻辑
    if (formattedClass) {
        if (shouldRemoveFormatting(mmd, formattedClass)) {
            return removeFormatting(parentElement, range, selectedText);
        }
        if (mmd === 'title') {
            return adjustHeadingLevel(parentElement, formattedClass);
        }
    }

    // 应用新格式
    applyNewFormatting(mmd, range, selectedText, parentElement);

    // 保持选区状态
    selection.removeAllRanges();
    selection.addRange(range);
}

// 辅助函数区域 ===============================================

/**
 * 获取当前文本的格式化状态
 */
function getCurrentFormatState(range) {
    let parentElement = range.commonAncestorContainer;
    
    // 向上查找包含格式的父元素（最多查找3层）
    for (let i = 0; i < 3; i++) {
        if (parentElement.nodeType === 3) { // 文本节点
            parentElement = parentElement.parentNode;
        }
        const classList = parentElement.classList;
        
        // 预定义的格式类型检测
        const formatTypes = {
            bold: 'bold',
            italic: 'italic',
            link: 'link',
            quote: 'blockquote', // blockquote 是标签名
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

/**
 * 判断是否需要移除现有格式
 */
function shouldRemoveFormatting(mmd, currentFormat) {
    const formatMapping = {
        bold: 'bold',
        italic: 'italic',
        link: 'link',
        quote: 'quote'
    };
    return formatMapping[mmd] === currentFormat;
}

/**
 * 移除现有格式
 */
function removeFormatting(element, range, text) {
    const textNode = document.createTextNode(text);
    element.parentNode.replaceChild(textNode, element);
    
    // 更新选区范围
    const newRange = document.createRange();
    newRange.setStart(textNode, 0);
    newRange.setEnd(textNode, text.length);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(newRange);
}

/**
 * 调整标题级别
 */
function adjustHeadingLevel(element, currentClass) {
    const headingLevels = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6'];
    const currentIndex = headingLevels.indexOf(currentClass);
    
    if (currentIndex === -1) return; // 非标题元素
    
    if (currentIndex === headingLevels.length - 1) {
        // 如果已经是最后一级，转为普通文本
        const textNode = document.createTextNode(element.textContent);
        element.parentNode.replaceChild(textNode, element);
    } else {
        // 降级标题
        element.classList.remove(currentClass);
        element.classList.add(headingLevels[currentIndex + 1]);
    }
}

/**
 * 应用新格式
 */
function applyNewFormatting(mmd, range, text, parentElement) {
    const formatters = {
        bold: () => createStyledElement('span', 'bold', text),
        italic: () => createStyledElement('span', 'italic', text),
        link: () => createStyledElement('span', 'link', text),
        quote: () => {
            const blockquote = document.createElement('blockquote');
            blockquote.textContent = text;
            blockquote.classList.add('gray-text'); // 添加灰色字体格式
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

    // 调整选区到新元素
    const newRange = document.createRange();
    newRange.selectNodeContents(newElement);
    range.setStart(newRange.startContainer, newRange.startOffset);
    range.setEnd(newRange.endContainer, newRange.endOffset);
}

/**
 * 创建带样式的元素
 */
function createStyledElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

/**
 * 获取下一个标题级别
 */
function getNextHeadingLevel(currentLevel) {
    const levels = ['title0', 'title1', 'title2', 'title3', 'title4', 'title5', 'title6'];
    let index = levels.indexOf(currentLevel);
    index = (index >= 6) ? 0 : (index < 0) ? 1 : index + 1;
    return levels[index];
}

// 在文件开头添加变量
let hoverTimer = null;
let currentHoverElement = null;

// 在文件末尾添加新函数
function setupFormatHover() {
    console.log('初始化格式提示功能...'); // 调试输出
    const inputText = document.getElementById('inputText');
    if (!inputText) {
        console.error('找不到输入框元素');
        return;
    }
    
    inputText.addEventListener('mousemove', (e) => {
        clearTimeout(hoverTimer);
        
        // 移除旧的提示
        const oldTooltip = document.querySelector('.format-tooltip');
        if (oldTooltip) oldTooltip.remove();
        
        // 获取光标下的元素
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        if (!elementUnderCursor || elementUnderCursor === currentHoverElement) return;
        
        currentHoverElement = elementUnderCursor;
        
        hoverTimer = setTimeout(() => {
            const formatInfo = getFormatInfo(elementUnderCursor);
            if (!formatInfo) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'format-tooltip';
            tooltip.textContent = formatInfo;
            
            // 定位在光标右下方
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
            
            document.body.appendChild(tooltip);
        }, 2000); // 2秒延迟
    });
    
    inputText.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        const tooltip = document.querySelector('.format-tooltip');
        if (tooltip) tooltip.remove();
    });
}

// 在getFormatInfo函数开头添加调试
function getFormatInfo(element) {
    console.log('检测元素:', element); // 调试输出
    if (!element.classList) return null;
    
    const formatMap = {
        'bold': '**加粗**',
        'italic': '*斜体*',
        'link': '[链接]()',
        'title1': '# 标题1',
        'title2': '## 标题2',
        'title3': '### 标题3',
        'title4': '#### 标题4',
        'title5': '##### 标题5',
        'title6': '###### 标题6',
        'gray-text': '> 引用'
    };
    
    for (const [cls, symbol] of Object.entries(formatMap)) {
        if (element.classList.contains(cls)) {
            return symbol;
        }
    }
    
    return null;
}

// 在文件末尾调用初始化
setupFormatHover();
