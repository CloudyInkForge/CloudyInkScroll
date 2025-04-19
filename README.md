# Qingyun Mojian - Lightweight Frontend Note-Taking Tool

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Key Features

### Core Features
- **Minimalist Design**: Immersive distraction-free writing interface
- **Multi-Format Support**: Native Markdown/DOC/PDF document interaction (NC)
- **Smart Material Library**: Dynamic tile panel with AI-powered recommendations (NC)
- **Deep OCR Integration**: Image/PDF content slicing with format-aware text recognition (NC)
- **Version Vault**: Multi-layer backup & time-machine style version control

### Advanced Extensions
- **Rich Media Embedding**: Seamless mindmaps/3D models/video clips integration (NC)
- **Self-hosted Sync**: Private cloud knowledge base (NC)
- **LaTeX Rendering**: Real-time math formula preview (NC)

## 🚀 Quick Start

### Local Development
```bash
# Using Python built-in server
python3 -m http.server 8000
# Or via Node.js
npx live-server --port=8000
```

### Production Deployment
```bash
# Recommended Nginx configuration
server {
    listen 80;
    server_name note.yourdomain.com;
    root /path/to/qingyunmojian;
    index index.html;
}
```

## 📂 Project Structure
```
├── index.html                  # Main entry point
├── LICENSE                     # MIT License
├── README.md                   # Documentation
├── scripts/
│   ├── action/
│   │   └── rightbar.js         # Right sidebar logic <mcsymbol...>
│   ├── core/
│   │   └── mdview.js          # Markdown editor core
│   ├── file/
│   │   ├── openFile.js        # File opener (.mdh/.html)
│   │   └── saveFile.js        # Styled HTML exporter
├── styles/
│   ├── mdview.css             # Markdown styling
│   ├── rightbar.css           # Sidebar styles
│   ├── sidebar.css            # Side navigation
│   ├── style.css              # Base styles
│   └── toolbar.css            # Toolbar layout
├── website/
│   └── rightbar/
│       ├── experience.html    # UI customization
│       ├── file.html          # File operations
│       ├── materials.html     # Template management
│       └── rightbar.html      # Main sidebar UI
```

## 🛠️ Development Guide

### Requirements
- Modern browsers (Chrome 105+/Firefox 101+)
- Node.js 18+ (Optional for advanced features)

### Contribution Areas
1. **UI/UX Enhancement**: Complete unfinished features in `rightbar.html`
2. **AI Integration**: Expand AI assistant capabilities
3. **Mobile Adaptation**: Optimize media queries

👉 Check [ROADMAP.md](ROADMAP.md) for priority tasks

## ⚠️ Important Notes

### Technical Transparency
- Developed with AI assistance (including DeepSeek models)
- Core AI features require custom API endpoints

### Current Limitations
- Cloud sync module pending implementation
- Mobile touch interaction needs optimization
- Video backgrounds may impact performance

## 🌱 Developer Story
> "As a 14-year-old programming enthusiast, this marks my first complete frontend project. From learning JavaScript fundamentals to implementing OCR integration, this journey has been challenging yet rewarding. Looking forward to growing with the developer community!"  
> — Project Founder @CloudyInkForge

## 📜 License
Released under **[MIT License](LICENSE)**:
- Free for commercial/private use
- Modification and redistribution permitted
- No warranty provided

*(Retain original copyright notice and license file)*

---

[📬 Submit Feature Requests](mailto:hzy02160312@outlook.com)
