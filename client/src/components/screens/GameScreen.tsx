import { Suspense, useEffect, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Level from "../game/Level";
import KeyboardManager from "../game/KeyboardManager";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { Level as LevelType } from "@/lib/types";
import { useGame } from "@/lib/stores/useGame";
import EnhancedGameDemo from "../game/EnhancedGameDemo";

export default function GameScreen() {
  const { startLevel, levelTime, isLevelComplete } = useFireSafety();
  const { health, score } = usePlayer();
  const { end } = useGame();
  
  // Enhanced mode toggle - press 'M' to switch between modes
  const [isEnhancedMode, setIsEnhancedMode] = useState(false);
  
  // Start the kitchen level when game screen loads
  useEffect(() => {
    startLevel(LevelType.Kitchen);
  }, [startLevel]);
  
  // Enhanced mode toggle controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        setIsEnhancedMode(prev => !prev);
        console.log(`Switched to ${!isEnhancedMode ? 'Enhanced' : 'Original'} mode`);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEnhancedMode]);
  
  // Check for game over conditions
  useEffect(() => {
    // Only check game over conditions after a short delay to allow the level to initialize
    const gameOverCheckDelay = setTimeout(() => {
      // Game over if health reaches zero
      if (health <= 0) {
        console.log("Game over: Player health depleted");
        end();
      }
      
      // Game over if time runs out
      if (levelTime <= 0 && levelTime !== undefined) {
        console.log("Game over: Time ran out");
        end();
      }
    }, 1000); // 1 second delay before checking game over conditions
    
    return () => clearTimeout(gameOverCheckDelay);
  }, [health, levelTime, end]);
  
  // Handle level completion separately
  useEffect(() => {
    if (isLevelComplete) {
      console.log("Level completed!");
      
      // Check if there are more levels to play
      const currentLevel = useFireSafety.getState().currentLevel;
      const completedLevels = useFireSafety.getState().completedLevels;
      
      if (currentLevel === LevelType.Kitchen && !completedLevels.includes(LevelType.LivingRoom)) {
        // Start living room level
        setTimeout(() => startLevel(LevelType.LivingRoom), 2000);
      } else if (currentLevel === LevelType.LivingRoom && !completedLevels.includes(LevelType.Bedroom)) {
        // Start bedroom level
        setTimeout(() => startLevel(LevelType.Bedroom), 2000);
      } else {
        // All levels completed
        setTimeout(() => end(), 2000);
      }
    }
  }, [isLevelComplete, end, startLevel]);
  
  return (
    <>
      {/* Mode indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '14px',
        fontFamily: 'monospace'
      }}>
        Mode: {isEnhancedMode ? 'Enhanced' : 'Original'}<br/>
        Press 'M' to toggle
      </div>
      
      {!isEnhancedMode && (
        <>
          {/* Original Camera */}
          <PerspectiveCamera
            makeDefault
            position={[0, 5, 10]}
            fov={50}
          />
          
          {/* Original Controls - limit to prevent going below the floor */}
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={5}
            maxDistance={15}
          />
        </>
      )}
      
      {/* Game level */}
      <Suspense fallback={null}>
        {isEnhancedMode ? <EnhancedGameDemo /> : <Level />}
      </Suspense>
      
      {/* Keyboard manager component to handle key presses */}
      {!isEnhancedMode && <KeyboardManager />}
    </>
  );
}

