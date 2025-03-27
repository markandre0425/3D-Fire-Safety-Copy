import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGame } from "@/lib/stores/useGame";
import GameScreen from "@/components/screens/GameScreen";
import MainMenu from "@/components/screens/MainMenu";
import { KeyboardControls } from "@react-three/drei";
import { Controls } from "@/lib/types";
import EndScreen from "@/components/screens/EndScreen";

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

export default function Game() {
  const { phase, start, restart } = useGame();
  
  const handleStartGame = () => {
    start();
  };
  
  return (
    <div className="w-screen h-screen overflow-hidden">
      <KeyboardControls map={keyboardMap}>
        {phase === "ready" && (
          <MainMenu 
            onStartTutorial={() => {}} 
            onStartGame={handleStartGame} 
          />
        )}
        
        {phase === "playing" && (
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
          >
            <color attach="background" args={["#87CEEB"]} />
            
            <Suspense fallback={null}>
              <GameScreen />
            </Suspense>
          </Canvas>
        )}
        
        {phase === "ended" && (
          <EndScreen />
        )}
      </KeyboardControls>
    </div>
  );
}
