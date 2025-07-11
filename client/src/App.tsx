import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "@fontsource/inter";
import { Controls } from "./lib/types";
import GameScreen from "./components/screens/GameScreen";
import MainMenu from "./components/screens/MainMenu";
import EndScreen from "./components/screens/EndScreen";
import TutorialScreen from "./components/screens/TutorialScreen";
import { useGame } from "./lib/stores/useGame";
import { useIsMobile, useMobileOptimization } from "./components/MobileControls";

// Define control keys for the game
const keyboardMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.action, keys: ["KeyE"] },
  { name: Controls.extinguish, keys: ["KeyF"] },
  { name: Controls.crouch, keys: ["KeyC"] },
  { name: Controls.run, keys: ["ShiftLeft"] },
  { name: Controls.pause, keys: ["Escape"] },
];

// Main App component - Simplified for debugging
function App() {
  const { phase: gamePhase } = useGame();
  const isMobile = useIsMobile();
  const mobileConfig = useMobileOptimization();
  const [loadingComplete, setLoadingComplete] = useState(true); // Set to true by default for testing

  // Debug logging
  useEffect(() => {
    console.log("🚀 App mounted, Game Phase:", gamePhase);
    console.log("📱 Mobile device:", isMobile);
    console.log("⚙️ Mobile config:", mobileConfig);
  }, [gamePhase, isMobile, mobileConfig]);

  const startTutorial = () => {
    console.log("📚 Starting tutorial");
    // For now, just start the game directly
    useGame.getState().start();
  };

  const startGame = () => {
    console.log("🎮 Starting game");
    useGame.getState().start();
  };

  // Simple render logic without complex state management
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen relative overflow-hidden bg-blue-500">
        {/* Debug overlay */}
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded z-50">
          <div>Phase: {gamePhase}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
          <div>Loading: {loadingComplete ? 'Complete' : 'Loading'}</div>
        </div>

        <KeyboardControls map={keyboardMap}>
          {/* Show main menu when ready */}
          {gamePhase === "ready" && (
            <MainMenu onStartTutorial={startTutorial} onStartGame={startGame} />
          )}
          
          {/* Show game when playing */}
          {gamePhase === "playing" && (
            <>
              <Canvas
                shadows={mobileConfig.shadows}
                camera={{
                  position: [0, 5, 10],
                  fov: 50,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: mobileConfig.antialias,
                  powerPreference: mobileConfig.powerPreference
                }}
                dpr={mobileConfig.pixelRatio}
                style={{ background: '#87CEEB' }}
              >
                <color attach="background" args={["#87CEEB"]} />
                <Suspense fallback={null}>
                  <GameScreen />
                </Suspense>
              </Canvas>
            </>
          )}
          
          {/* Show end screen when ended */}
          {gamePhase === "ended" && <EndScreen />}
        </KeyboardControls>
      </div>
    </QueryClientProvider>
  );
}

export default App;
