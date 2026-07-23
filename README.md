# Professional 3D Portfolio - Charesh Reddy Guntakrindapalli

A high-performance, visually stunning 3D scroll-driven developer portfolio designed with a modern data-engineering theme. Built using React, Vite, Tailwind CSS v4, React Three Fiber (Three.js), and GSAP ScrollTrigger.

---

## 🚀 Key Architectural Features

### 1. Unified Content Database (`src/data/content.js`)
All resume content, metadata, links, and system outputs are defined as clean structured JS objects in a single file: [content.js](src/data/content.js). No hardcoded resume text exists inside the visual components, making future updates (e.g. changing platforms or project parameters) completely stack-independent.

### 2. 3D WebGL Pipeline Background (`src/components/Pipeline3D.jsx`)
A custom 3D Canvas rendering a flowing data-node helix. The viewport camera smoothly tracks, rotates, and pans down this 3D pipeline matching the user's scroll progress via GSAP ScrollTrigger. Mouse movements generate subtle camera parallax shifts.

### 3. Dynamic Hardware & Motion Fallbacks
To ensure maximum performance across all hardware:
- Bypasses WebGL canvas rendering on devices with screens `< 768px` or processors with `<= 4` hardware threads, falling back to a static cyber-grid CSS overlay.
- Automatically disables motion and transitions if the user prefers reduced motion.

---

## 🛠️ Tech Stack & Integrations

- **Core**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js + React Three Fiber (R3F)
- **Animations**: GSAP (GreenSock) + ScrollTrigger
- **Icons**: Lucide React (with custom inline SVG brand fallbacks)

---

## 💻 Getting Started Locally

### Prerequisites
Ensure you have Node.js installed.

### Setup
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/ChareshReddy/My_Portfolio.git
   cd My_Portfolio
   ```
2. Install the dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the application at **`http://localhost:5173/`**.

### Production Build
To build the optimized static assets:
```bash
npm run build
```
The output will be built into the `dist/` directory, ready to deploy to Vercel, Netlify, or GitHub Pages.
