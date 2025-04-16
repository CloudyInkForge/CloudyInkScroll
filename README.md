# CloudInkNote

## Introduction
A front-end note-taking web application (current version v0.1.1) developed with JavaScript + HTML + CSS, supporting rich text editing, multi-layer content management, and responsive layout. Built with extensive AI-assisted coding, core functionalities are implemented but remain in a semi-complete state.

**Key Features**:
- 📌 Customized Markdown parsing engine based on `mmd.js`
- 🎨 Three-column frosted glass interface design (15% sidebar / 75% editor / 10% right panel)
- ✨ Layered editing system (Input Layer / Material Layer / Background Layer)
- 🤖 Dynamic interactive buttons and double-click Tab switching

---

## Software Architecture
### Core Modules
1. **Parsing Engine**  
   - Customized `mmd.js` for basic Markdown syntax parsing  
   - Supports bold/italic/headers/links and other rich text formats  
2. **Editing System**  
   - Multi-layer Tab switching (single-click for Input/Material layers, double-click for Background layer)  
   - Basic template selection and file loading mechanism  
3. **Interface System**  
   - Responsive layout for various screen sizes  
   - CSS effects (frosted glass sidebar, button animations)  

### Known Limitations
- ❌ No support for nested Markdown syntax or tables  
- ❌ Background file upload triggers dialog only (no processing logic)  
- ❌ Heading level adjustment lacks boundary checks  

---

## Installation Guide
### Dependencies
```plaintext
Core dependencies:
- mmd.js v0.5 (custom modified)

Optional dependencies (currently commented):
- jspdf@2.5.1
- html2canvas@1.4.1
- FileSaver.js@2.0.5