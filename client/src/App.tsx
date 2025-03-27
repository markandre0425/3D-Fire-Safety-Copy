import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "@fontsource/inter";
import { Controls } from "./lib/types";
import GameScreen from "./components/screens/GameScreen";
import MainMenu from "./components/screens/MainMenu";
import EndScreen from "./components/screens/EndScreen";
import TutorialScreen from "./components/screens/TutorialScreen";
import { useGame } from "./lib/stores/useGame";
import SoundManager from "./components/game/SoundManager";
import GameUI from "./components/game/GameUI";
import { Howl } from "howler";

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

// Main App component
function App() {
  const { phase: gamePhase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Load audio assets
  useEffect(() => {
    // Background music
    const bgMusic = new Howl({
      src: ['/sounds/background.mp3'],
      loop: true,
      volume: 0.4,
    });
    
    // Sound effects
    const hit = new Howl({
      src: ['/sounds/hit.mp3'],
      volume: 0.5,
    });
    
    const success = new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.5,
    });
    
    setBackgroundMusic(bgMusic);
    setHitSound(hit);
    setSuccessSound(success);
    
    setLoadingComplete(true);
    
    return () => {
      // Clean up audio resources when component unmounts
      bgMusic.stop();
      hit.stop();
      success.stop();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Update UI based on game phase
  useEffect(() => {
    if (loadingComplete) {
      switch (gamePhase) {
        case "ready":
          setShowMenu(true);
          setShowCanvas(false);
          setShowEndScreen(false);
          setShowTutorial(false);
          break;
        case "playing":
          setShowMenu(false);
          setShowCanvas(true);
          setShowEndScreen(false);
          break;
        case "ended":
          setShowEndScreen(true);
          break;
        default:
          break;
      }
    }
  }, [gamePhase, loadingComplete]);

  const startTutorial = () => {
    setShowMenu(false);
    setShowTutorial(true);
  };

  const startGame = () => {
    useGame.getState().start();
    setShowTutorial(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen relative overflow-hidden">
        <KeyboardControls map={keyboardMap}>
          {showMenu && <MainMenu onStartTutorial={startTutorial} onStartGame={startGame} />}
          
          {showTutorial && <TutorialScreen onComplete={startGame} />}
          
          {showCanvas && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 5, 10],
                  fov: 50,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#87CEEB"]} />
                <Suspense fallback={null}>
                  <GameScreen />
                </Suspense>
              </Canvas>
              {/* Game UI overlaid outside the Canvas */}
              <div className="absolute inset-0 pointer-events-none">
                <GameUI />
              </div>
            </>
          )}
          
          {showEndScreen && <EndScreen />}
          
          <SoundManager />
        </KeyboardControls>
      </div>
    </QueryClientProvider>
  );
}

export default App;
