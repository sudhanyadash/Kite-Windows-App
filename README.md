# 🦅 Kite Windows App
> A powerful, multi-pane desktop experience for modern traders.

Welcome to the **Kite Windows App**, a bespoke desktop interface built to empower your trading workflows. By leveraging the Zerodha Kite ecosystem with a high-performance multi-pane architecture, this app provides ultimate control over market analysis and execution.

---

## 👥 For Users

### ✨ Key Features
- **Multi-Pane Split View:** Arrange your workspace with flexible vertical and horizontal splits. No more switching tabs; see everything at once.
- **Persistent Bookmarks:** Save your favorite symbols and market views in a dedicated, easy-access sidebar.
- **Customizable Layouts:** Your workspace layout is automatically saved and restored on launch.
- **Local Persistence:** Data is stored securely on your machine, ensuring privacy and lightning-fast performance.
- **Desktop Performance:** Optimized for Windows with a smooth, native-feel experience.

### 🚀 Getting Started
1. **Download:** Grab the latest `Kite-Windows.exe` from the [Releases](#) page.
2. **Launch:** Simply run the executable. No installation required (Portable).
3. **Log In:** Use your existing Zerodha credentials to log in securely.
4. **Trade:** Customize your view using the "Add View" and "Split" controls in the top bar.

---

## 🛠 For Developers

### 🏗 Tech Stack
- **Core:** [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Shell:** [Electron](https://www.electronjs.org/)
- **Styles:** [Tailwind CSS](https://tailwindcss.com/)
- **State:** [Zustand](https://github.com/pmndrs/zustand)
- **Persistence:** [Electron Store](https://github.com/sindresorhus/electron-store)

### 💻 Development Workflow
Follow these steps to set up the project locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sudhanyadash/Kite-Windows-App.git
   cd Kite-Windows-App
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
4. **Build the Executable:**
   ```bash
   npm run build-win
   ```

### 📂 Project Structure
- `/src`: Frontend React application.
- `/electron`: Electron main process and preload scripts.
- `/public`: Static assets (icons, etc.).
- `/release`: Compiled executables (generated after build).

### 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any features or bug fixes.

---

### 🌐 Connect
-   **Bug Reports:** [Issue Tracker](https://github.com/sudhanyadash/Kite-Windows-App/issues)
-   **Discussions:** [GitHub Discussions](https://github.com/sudhanyadash/Kite-Windows-App/discussions)

