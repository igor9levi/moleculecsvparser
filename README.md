# Scientist - Compound Data Analyzer

A React application for analyzing scientific compound data. Upload CSV files containing compound information and get instant analysis with sortable tables, filters, and statistical summaries.

## Features

- Drag & drop CSV file upload
- Interactive data table with:
  - Sorting by any column
  - Column filters
  - Fixed compound ID column
  - Horizontal and vertical scrolling
- Global search functionality
- Statistical analysis dashboard
- Automatic calculation of min/max/average values for result fields

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### System Requirements

- Node.js 18+
- Operating Systems:
  - Windows 10+ or Windows Server 2016+ or Windows Subsystem for Linux (WSL)
  - macOS 13 Ventura or later
  - Debian 12, Ubuntu 22.04, Ubuntu 24.04 (x86-64 and arm64)

### Installation

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

### Running App

To run Playwright end-to-end tests:

1. Copy .env.local.example to .env.local
   (more details on https://vite.dev/guide/env-and-mode)

2. Install dependancies

   ```bash
   npm install
   ```

3. Run app
   ```bash
   npm run dev
   ```

### Running Tests

To run Playwright end-to-end tests:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. In a separate terminal, run the tests:
   ```bash
   npm run test:e2e
   ```
