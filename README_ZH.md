# 庆云墨笺 - 轻量化前端笔记工具

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ 项目亮点

### 核心特性
- **极简美学设计**：沉浸式无干扰写作界面
- **多格式支持**：原生兼容Markdown/DOC/PDF文档交互（NC)
- **智能素材库**：动态磁贴面板自动推荐相关素材（基于AI分析和用户设定）（NC)
- **OCR深度整合**：图片/PDF内容切片，分配格式后识别转文字（NC)
- **版本保险箱**：多重备份与时光机式版本回溯

### 高级扩展
- **富媒体嵌入**：思维导图/3D模型/视频片段无缝集成（NC)
- **自建云同步**：云知识库（NC
- **LaTeX渲染**：数学公式即时预览 （NC)

## 🚀 快速启动

### 本地运行
```bash
# 使用Python内置服务器
python3 -m http.server 8000
# 或通过Node.js启动
npx live-server --port=8000
```

### 生产部署
```bash
# 推荐使用Nginx配置反向代理
server {
    listen 80;
    server_name note.yourdomain.com;
    root /path/to/qingyunmojian;
    index index.html;
}
```

## 📂 项目结构
```
├── index.html                  # 主入口文件，包含样式和脚本引用
├── LICENSE                     # MIT 许可证文件
├── README.md                   # 项目说明文档（含依赖信息）
├── scripts/
│   ├── action/
│   │   └── rightbar.js         # 右侧栏内容加载功能 <mcsymbol name="loadContent" filename="rightbar.js" path="scripts/action/rightbar.js" startline="2" type="function"></mcsymbol>
│   ├── core/
│   │   └── mdview.js          # Markdown 富文本编辑核心逻辑（格式检测/应用）
│   ├── file/
│   │   ├── openFile.js        # 文件打开功能（支持.mdh/.html格式）
│   │   └── saveFile.js        # 文件保存功能（生成带样式的HTML文档）
├── styles/
│   ├── mdview.css             # Markdown 渲染样式
│   ├── rightbar.css           # 右侧栏样式
│   ├── sidebar.css            # 侧边栏样式
│   ├── style.css              # 基础样式表
│   └── toolbar.css            # 工具栏样式
├── website/
│   └── rightbar/
│       ├── experience.html    # 体验设置界面（背景设置按钮）
│       ├── file.html          # 文件操作界面（导出/保存/另存按钮）
│       ├── materials.html     # 素材管理界面（版式选择/AI秘书功能）
│       └── rightbar.html      # 右侧栏主界面（功能入口按钮）
```

## 🛠️ 开发指南

### 环境需求
- 现代浏览器（Chrome 105+/Firefox 101+）
- Node.js 18+（可选，用于高级功能）

### 贡献方向
1. **UI/UX优化**：完成`rightbar.html`中未完成功能
2. **AI集成**：扩展AI模块功能
3. **移动适配**：优化媒体查询

👉 建议先查阅[开发路线图](ROADMAP.md)选择任务

## ⚠️ 重要说明

### 技术透明性
- 本项目开发过程中使用DEEPSEEK等AI辅助编码
- 核心AI功能需自行配置API端点（默认使用测试沙箱）

### 当前局限
- 云端同步模块尚未实现
- 移动端触控交互待优化
- 视频背景存在性能损耗

## 🌱 开发者故事
> "作为一个14岁的编程爱好者，这是我首次完整的前端项目实践。从零开始学习JavaScript到实现OCR集成，这段旅程充满挑战但也收获颇丰。期待与各位开发者共同成长！"  
> —— 项目发起者 @CloudyInkForge

## 📜 开源协议
本项目采用 **[MIT License](LICENSE)** 开放源代码，您可自由：
- 商用或私有化部署
- 修改并二次分发
- 承担使用风险

（保留原始版权声明与许可文件即可）

---

 [📬 提交功能建议](hzy02160312@outlook.com)
