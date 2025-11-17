# Xite

ERP Management System – Tauri + React + PHP-to-React Bridging Compiler

Welcome to the ERP Management System project — a modern, lightweight, and modular ERP platform built with Tauri for the desktop layer, React for the frontend, and a custom bridging compiler that translates PHP source code into React-compatible source code.

This project is designed to modernize legacy ERP systems while maintaining high performance and clean architecture.

# 📌 Project Overview
This ERP system aims to provide a scalable, modular, and developer-friendly platform using the following technologies:
- Tauri → Bundles the ERP into a fast, secure, and small-footprint desktop application.
- React → Delivers a responsive, modular, and modern UI.
- Bridging Compiler (PHP → React) → Automatically translates legacy PHP modules into React components, hooks, schemas, or services.

The system can be extended to support typical ERP functionalities such as:
- Finance & accounting
- Inventory management
- Procurement
- Sales & invoicing
- HR / personnel
- Custom workflows

# 🚀 Key Features
1. Desktop Application Powered by Tauri
- Very small build size
- High performance (lighter than Electron)
- Access to native OS APIs (file system, window control, etc.)
- Secure and easy to deploy across Windows, Linux, and macOS

2. Modern React Frontend
- Declarative UI components
- Flexible state management (Redux, Zustand, Recoil — optional)
- Fully modular component architecture

3. PHP → React Bridging Compiler

A core innovation of this project is a custom bridging compiler that:
- Reads and analyses PHP source modules
- Parses PHP AST (Abstract Syntax Tree)
- Extracts metadata such as:
    - Module name
    - Fields / schema
    - Validation rules
    - Simple business logic

- Maps the extracted structure into React-friendly output:
    - React components (JSX/TSX)
    - React hooks
    - Form/table configurations
    - API service interfaces
    - Validation schemas

This dramatically speeds up the migration of legacy PHP ERP codebases into modern applications.

# 🏗️ Project Structure
```
/src
  /frontend
    /react-app
      /components
      /pages
      /hooks
      /services
  /backend
    /compiler
      parser.php
      translator.js
      mapping-rules.json
  /tauri
    src-tauri/
      main.rs
      tauri.conf.json

/config
  module-schema/
  compiler-rules/

/docs
  architecture.md
  compiler-spec.md
```

# ⚙️ How the Bridging Compiler Works
1. PHP Source Input
The compiler reads PHP modules from the source directory.

2. PHP AST Parsing
The parser extracts:
- Classes
- Field definitions
- Functions
- Validation rules
- Metadata

3. Rule-Based Mapping
The compiler matches PHP structures with predefined mapping rules in mapping-rules.json.

4. React Code Output
The compiler generates:
- React components (*.jsx or *.tsx)
- Hooks for state and API interaction
- Table or form configuration objects
- API service files

5. Integration into the React App
The output is automatically placed into the appropriate frontend folder.


# 🛠️ Getting Started
1. Install Dependencies
**React Frontend**
```
cd src/frontend/react-app
npm install
```

**Tauri CLI**
```
cargo install tauri-cli
```

**PHP for Compiler**
Ensure PHP is available:
```
php -v
```

2. Generate React Code from PHP Sources
```
php src/backend/compiler/parser.php --input=modules --output=src/frontend/react-app/generated
```

3. Start the React Development Server
```
npm run dev
```

4. Build the Tauri Desktop Application
```
cd src/tauri
npm run tauri build
```

# 🤝 Contributing

Contributions are welcome! You may help by:
- Adding or improving ERP modules
- Enhancing the bridging compiler
- Improving UI/UX
- Extending documentation
Feel free to open issues or pull requests.

# 📜 License
This project is released under the MIT License — free to use, modify, and distribute.
