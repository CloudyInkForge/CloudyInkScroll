// scripts/action/rightbar.js
function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById('content-container').innerHTML = '<p>无法加载内容</p>';
        });
}