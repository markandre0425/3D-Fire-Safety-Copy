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
  const { startLevel, levelTime, isLevelComplete, hazards, interactiveObjects, currentLevel } = useFireSafety();
  const { health, score, position } = usePlayer();
  const { end } = useGame();
  
  // Enhanced mode toggle - press 'M' to switch between modes
  const [isEnhancedMode, setIsEnhancedMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // Start the kitchen level when game screen loads
  useEffect(() => {
    try {
      console.log("🚀 GameScreen mounted - starting kitchen level");
      setDebugInfo("Starting kitchen level...");
      startLevel(LevelType.Kitchen);
      setDebugInfo("Kitchen level started successfully");
    } catch (error) {
      console.error("❌ Error starting level:", error);
      setDebugInfo(`Error starting level: ${error}`);
      setRenderError(`Failed to start level: ${error}`);
    }
  }, [startLevel]);

  // Debug level data
  useEffect(() => {
    console.log("🔍 GameScreen Debug Info:", {
      currentLevel,
      hazardsCount: hazards.length,
      objectsCount: interactiveObjects.length,
      levelTime,
      playerHealth: health,
      playerScore: score,
      playerPosition: position
    });
    
    setDebugInfo(`Level: ${currentLevel}, Hazards: ${hazards.length}, Objects: ${interactiveObjects.length}, Time: ${levelTime.toFixed(1)}s`);
  }, [currentLevel, hazards.length, interactiveObjects.length, levelTime, health, score, position]);
  
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

  // Error boundary for rendering issues
  const ErrorFallback = ({ error }: { error: string }) => (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      zIndex: 2000
    }}>
      <h2>🚨 Render Error</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} style={{
        background: 'white',
        color: 'red',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Reload Page
      </button>
    </div>
  );

  if (renderError) {
    return <ErrorFallback error={renderError} />;
  }
  
  return (
    <>
      {/* Enhanced Debug overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '300px'
      }}>
        <div><strong>🎮 Game Screen Active</strong></div>
        <div>📊 {debugInfo}</div>
        <div>❤️ Health: {health.toFixed(1)}</div>
        <div>🏆 Score: {score}</div>
        <div>📍 Position: ({position.x.toFixed(1)}, {position.z.toFixed(1)})</div>
        <div>🕒 Time: {levelTime.toFixed(1)}s</div>
        <div style={{marginTop: '10px', fontSize: '10px', color: '#aaa'}}>
          Press M to toggle Enhanced mode<br/>
          Current: {isEnhancedMode ? 'Enhanced' : 'Original'}
        </div>
      </div>
      
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
      
      {/* Simple visible element to confirm we're rendering */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 255, 0, 0.8)',
        color: 'black',
        padding: '10px 20px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        🟢 GameScreen is rendering - Use WASD to move, E to interact, F to extinguish
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
      
      {/* Game level with error boundary */}
      <Suspense fallback={
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 0, 0.9)',
          color: 'black',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1500
        }}>
          🔄 Loading game level...
        </div>
      }>
        {isEnhancedMode ? (
          <EnhancedGameDemo />
        ) : (
          <Level />
        )}
      </Suspense>
      
      {/* Keyboard manager component to handle key presses */}
      {!isEnhancedMode && <KeyboardManager />}
    </>
  );
}

