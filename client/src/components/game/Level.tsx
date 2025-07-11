import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Character from "./Character";
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import Hazard from "./Hazard";
import ExtinguisherPickup from "./ExtinguisherPickup";
import ExtinguisherEffect from "./ExtinguisherEffect";
import SmokeZone from "./SmokeZone";
// import BFPEducationalContent from "./BFPEducationalContent";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";
// import { getLevelConfig } from "@/lib/levelConfigs";

export default function Level() {
  const { 
    hazards, 
    interactiveObjects, 
    updateLevelTime,
    extinguishHazard,
    collectObject,
    activateSmokeDetector,
    isPaused,
    currentLevel,
    startLevel
  } = useFireSafety();
  
  const playerState = usePlayer();
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    hazardsCount: 0,
    objectsCount: 0,
    playerPosition: { x: 0, y: 0, z: 0 },
    hasExtinguisher: false
  });
  const [testCubeRotation, setTestCubeRotation] = useState(0);

  const lastUpdateTime = useRef(Date.now());
  const extinguishCooldown = useRef(0);
  
  // Test cube animation
  useFrame((_, delta) => {
    setTestCubeRotation((prev: number) => prev + delta);
  });
  
  // Reload level to show new stoves on furniture (trigger this once)
  useEffect(() => {
    console.log("🔄 Reloading level to show stoves on red furniture...");
    startLevel(currentLevel);
  }, []);
  
  // Debug: Log interactive objects on each render
  useEffect(() => {
    console.log("🎯 Level component - Interactive objects:", interactiveObjects);
    setDebugInfo({
      hazardsCount: hazards.length,
      objectsCount: interactiveObjects.length,
      playerPosition: playerState.position,
      hasExtinguisher: playerState.hasExtinguisher
    });
  }, [hazards, interactiveObjects, playerState.position, playerState.hasExtinguisher]);
  
  // Get keyboard controls
  const actionPressed = useKeyboardControls<Controls>(state => state.action);
  const extinguishPressed = useKeyboardControls<Controls>(state => state.extinguish);
  
  // Update level time on every frame
  useFrame((_, delta) => {
    if (isPaused) return;
    
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 1000; // in seconds
    lastUpdateTime.current = now;
    
    // Update level time
    updateLevelTime(deltaTime);
    
    // Update extinguisher cooldown
    if (extinguishCooldown.current > 0) {
      extinguishCooldown.current -= delta;
    }
  });
  
  // Handle player interaction with objects
  useEffect(() => {
    if (actionPressed) {
      console.log("🎮 Action key pressed - checking for interactive objects...");
      
      // Check for nearby interactive objects
      interactiveObjects.forEach(obj => {
        if (obj.isCollected || (obj.type === "SmokeDetector" && obj.isActive)) return;
        
        const dx = playerState.position.x - obj.position.x;
        const dz = playerState.position.z - obj.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.INTERACTION_DISTANCE * GAME_CONSTANTS.INTERACTION_DISTANCE) {
          if (obj.type === "FireExtinguisher" || 
              obj.type === "WaterExtinguisher" ||
              obj.type === "FoamExtinguisher" ||
              obj.type === "CO2Extinguisher" ||
              obj.type === "PowderExtinguisher" ||
              obj.type === "WetChemicalExtinguisher") {
            collectObject(obj.id);
            console.log(`✅ Collected extinguisher: ${obj.type}`);
          } else if (obj.type === "SmokeDetector") {
            activateSmokeDetector(obj.id);
            console.log(`✅ Activated smoke detector: ${obj.id}`);
          }
          
          console.log(`🎯 Interacted with ${obj.type}: ${obj.id}`);
        }
      });
    }
  }, [actionPressed, interactiveObjects, playerState.position, collectObject, activateSmokeDetector]);
  
  // Handle fire extinguisher usage with enhanced effects
  useEffect(() => {
    if (extinguishPressed && playerState.hasExtinguisher && extinguishCooldown.current <= 0) {
      setIsExtinguishing(true);
      console.log("🔥 Using fire extinguisher...");
      
      // Check for nearby hazards to extinguish
      let extinguishedAny = false;
      hazards.forEach(hazard => {
        if (hazard.isExtinguished || !hazard.isActive) return;
        
        const dx = playerState.position.x - hazard.position.x;
        const dz = playerState.position.z - hazard.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.EXTINGUISHER_RANGE * GAME_CONSTANTS.EXTINGUISHER_RANGE) {
          extinguishHazard(hazard.id);
          extinguishedAny = true;
          console.log(`✅ Extinguished hazard: ${hazard.id}`);
        }
      });
      
      if (!extinguishedAny) {
        console.log("⚠️ No hazards in range to extinguish");
      }
      
      // Set cooldown to prevent spam and allow for animation
      extinguishCooldown.current = 0.5;
      
      // Stop extinguishing effect after a short duration
      setTimeout(() => {
        setIsExtinguishing(false);
      }, 200);
    } else if (!extinguishPressed) {
      setIsExtinguishing(false);
    }
  }, [extinguishPressed, playerState.hasExtinguisher, hazards, playerState.position, extinguishHazard]);
  
  return (
    <>
      {/* TEST: Simple spinning cube to verify 3D rendering works */}
      <mesh position={[0, 2, 0]} rotation={[testCubeRotation, testCubeRotation, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* TEST: Simple green ground plane */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>
      
      {/* TEST: Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Debug Info - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 1000
        }}>
          <div>🎯 Hazards: {debugInfo.hazardsCount}</div>
          <div>📦 Objects: {debugInfo.objectsCount}</div>
          <div>👤 Position: ({debugInfo.playerPosition.x.toFixed(1)}, {debugInfo.playerPosition.z.toFixed(1)})</div>
          <div>🧯 Extinguisher: {debugInfo.hasExtinguisher ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      <Lights />
      <HomeEnvironment />
      
      {/* Render hazards */}
      {hazards.map(hazard => (
        <Hazard key={hazard.id} hazard={hazard} />
      ))}
      
      {/* Simple smoke zone for testing */}
      <SmokeZone
        position={[3, 1, 3]}
        radius={2}
        intensity={1}
        damageRate={10}
      />
      
      {/* Render interactive objects */}
      {interactiveObjects.map(obj => {
        console.log("🎨 Rendering interactive object:", obj);
        return (
          <ExtinguisherPickup 
            key={obj.id} 
            object={obj} 
            isCollected={obj.isCollected} 
          />
        );
      })}
      
      {/* Fire extinguisher effects */}
      {playerState.hasExtinguisher && (
        <ExtinguisherEffect
          isActive={isExtinguishing}
          playerPosition={playerState.position}
          playerRotation={playerState.rotation}
          extinguisherType={playerState.extinguisherType || undefined}
        />
      )}
      
      {/* BFP Educational Content Modal */}
      {/* <BFPEducationalContent
        isVisible={showBFPEducation}
        onClose={() => setShowBFPEducation(false)}
      /> */}
      
      <Character />
    </>
  );
}
