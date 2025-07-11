import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Debug logging
console.log("🚀 APULA 3D Fire Safety Simulator - Starting...");
console.log("📦 React version:", React.version);
console.log("🌐 User Agent:", navigator.userAgent);
console.log("📱 Screen size:", window.innerWidth, "x", window.innerHeight);

// Check for WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log("🎮 WebGL Support:", gl ? "✅ Yes" : "❌ No");

// Add global error handler
window.addEventListener('error', (error) => {
  console.error("🚨 Global Error:", error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("🚨 Unhandled Promise Rejection:", event.reason);
});

const root = createRoot(document.getElementById("root")!);

try {
  root.render(<App />);
  console.log("✅ App rendered successfully");
} catch (error) {
  console.error("❌ Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c33; font-family: monospace;">
      <h2>🚨 Application Failed to Start</h2>
      <p>Error: ${error}</p>
      <p>Check the console for more details.</p>
    </div>
  `;
}
