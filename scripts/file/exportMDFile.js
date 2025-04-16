// exportMDFile.js

function exportMDFile() {
    // 获取输入框的内容，包括HTML标签
    const inputContent = document.getElementById('inputText').innerHTML;

    // 创建一个隐藏的div来渲染HTML内容
    const hiddenDiv = document.createElement('div');
    hiddenDiv.innerHTML = inputContent;
    hiddenDiv.style.position = 'absolute';
    hiddenDiv.style.left = '-9999px';
    document.body.appendChild(hiddenDiv);

    // 使用html2canvas将div内容转换为canvas
    html2canvas(hiddenDiv).then(function(canvas) {
        // 创建一个jsPDF实例
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        // 将canvas内容添加到PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4纸张宽度
        const pageHeight = 297; // A4纸张高度
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // 移除隐藏的div
        document.body.removeChild(hiddenDiv);

        // 生成PDF的Blob对象
        pdf.output('blob').then(blob => {
            // 使用FileSaver.js保存文件
            saveAs(blob, 'exportedContent.pdf');
        });
    });
}