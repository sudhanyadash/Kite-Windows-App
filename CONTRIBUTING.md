# 🤝 Contributing to Kite Windows

We love your interest in making **Kite Windows** even better! Whether it's a bug fix, feature request, or documentation improvement, we welcome your contributions.

---

### **1. 🚀 Development Setup**

Follow these steps to get your local development environment ready:

1. **Fork the Repository**: Create your own copy of the repository.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Kite-Windows-App.git
   ```
3. **Install Dependencies**:
   ```bash
   cd Kite-Windows-App
   npm install
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. **Lint Your Code**:
   ```bash
   npm run lint
   ```

---

### **2. 📋 Pull Request (PR) Checklist**

Before submitting your PR, please ensure the following:

- [x] **Scoped Changes**: Keep your PRs focused on a single topic. Avoid bundling multiple unrelated changes.
- [x] **Clean Commits**: Use descriptive and clear commit messages.
- [x] **No Build Artifacts**: Ensure you don't commit anything from `dist/`, `dist-electron/`, or `releases/`. They are ignore by `.gitignore`.
- [x] **Documentation**: Update the README or create new documentation files if you're adding user-facing features.
- [x] **Verify Builds**: Run `npm run build-win` to ensure your changes don't break the final packaged application.

---

### **3. 🧱 Repository Structure Overview**

To help you get oriented:

- `app/electron/`: Contains the Electron main process logic, IPC handlers, and window management.
- `app/src/`: The React-based renderer process where the UI lives.
- `assets/`: Global branding assets like the app icon.
- `docs/product/`: Contains the PRD and Technical Specification documents.

---

### **4. 🛠️ Coding Standards**

- **Typescript**: Use types wherever possible. Avoid `any`.
- **Styling**: We use **Tailwind CSS**. Prefer utility classes over custom CSS.
- **Components**: Keep React components small, focused, and reusable. Use functional components with hooks.
- **State Management**: We use **Zustand** for lightweight global state.

---

### **5. 🚩 Reporting Issues**

If you find a bug or have a suggestion, please open a standard issue on GitHub. Include:

- **OS Version** (e.g., Windows 10, Windows 11)
- **Steps to reproduce** (for bugs)
- **Clear description** of the expected vs. actual behavior
- **Screenshots or Logs** when possible

---

### **6. 📜 License**

By contributing, you agree that your contributions will be licensed under the **MIT License**.

---

Thank you for being part of the community! ❤️