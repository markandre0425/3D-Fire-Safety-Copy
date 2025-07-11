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
import { Controls, FireClass, InteractiveObjectType } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";
// import { getLevelConfig } from "@/lib/levelConfigs";

// Helper function to get fire class from extinguisher type
const getExtinguisherFireClass = (extinguisherType: InteractiveObjectType): FireClass => {
  switch (extinguisherType) {
    case InteractiveObjectType.ClassAExtinguisher: return FireClass.A;
    case InteractiveObjectType.ClassBExtinguisher: return FireClass.B;
    case InteractiveObjectType.ClassCExtinguisher: return FireClass.C;
    case InteractiveObjectType.ClassDExtinguisher: return FireClass.D;
    case InteractiveObjectType.ClassKExtinguisher: return FireClass.K;
    default: return FireClass.A; // Default fallback
  }
};

export default function Level() {
  const { 
    hazards, 
    interactiveObjects, 
    updateLevelTime,
    extinguishHazard,
    collectObject,
    activateSmokeDetector,
    isPaused,
    currentLevel
  } = useFireSafety();
  
  // Debug: Log interactive objects on each render
  console.log("Level component - Interactive objects:", interactiveObjects);
  
  const playerState = usePlayer();
  const [isExtinguishing, setIsExtinguishing] = useState(false);

  
  const lastUpdateTime = useRef(Date.now());
  const extinguishCooldown = useRef(0);
  
  // Load current level configuration
  // const levelConfig = getLevelConfig(1); // Start with level 1 for now
  
  // Initialize level-specific items
  // useEffect(() => {
  //   if (levelConfig) {
  //     // Set up gas masks from level config
  //     const levelGasMasks = levelConfig.items
  //       .filter(item => item.type === 'gasMask')
  //       .map(item => ({
  //         id: item.id,
  //         position: item.position,
  //         collected: false
  //       }));
  //     setGasMasks(levelGasMasks);
      
  //     // Set up smoke zones from level config
  //     const levelSmokeZones = levelConfig.hazards
  //       .filter(hazard => hazard.type === 'smoke')
  //       .map(hazard => ({
  //         id: hazard.id,
  //         position: hazard.position,
  //         intensity: hazard.intensity,
  //         radius: hazard.smokeRadius || 2
  //       }));
  //     setSmokeZones(levelSmokeZones);
  //   }
  // }, [levelConfig]);
  
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
      // Check for nearby interactive objects
      interactiveObjects.forEach(obj => {
        if (obj.isCollected || (obj.type === InteractiveObjectType.SmokeDetector && obj.isActive)) return;
        
        const dx = playerState.position.x - obj.position.x;
        const dz = playerState.position.z - obj.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.INTERACTION_DISTANCE * GAME_CONSTANTS.INTERACTION_DISTANCE) {
          if (obj.type === InteractiveObjectType.ClassAExtinguisher || 
              obj.type === InteractiveObjectType.ClassBExtinguisher ||
              obj.type === InteractiveObjectType.ClassCExtinguisher ||
              obj.type === InteractiveObjectType.ClassDExtinguisher ||
              obj.type === InteractiveObjectType.ClassKExtinguisher) {
            collectObject(obj.id);
          } else if (obj.type === InteractiveObjectType.SmokeDetector) {
            activateSmokeDetector(obj.id);
          }
          
          console.log(`Interacted with ${obj.type}: ${obj.id}`);
        }
      });
    }
  }, [actionPressed, interactiveObjects, playerState.position, collectObject, activateSmokeDetector]);
  
  // Handle fire extinguisher usage with enhanced effects
  useEffect(() => {
    if (extinguishPressed && playerState.hasExtinguisher && extinguishCooldown.current <= 0) {
      setIsExtinguishing(true);
      
      // Check for nearby hazards to extinguish
      let extinguishedAny = false;
      const playerExtinguisherClass = playerState.extinguisherType ? getExtinguisherFireClass(playerState.extinguisherType) : null;
      
      hazards.forEach(hazard => {
        if (hazard.isExtinguished || !hazard.isActive) return;
        
        const dx = playerState.position.x - hazard.position.x;
        const dz = playerState.position.z - hazard.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.EXTINGUISHER_RANGE * GAME_CONSTANTS.EXTINGUISHER_RANGE) {
          const hazardFireClass = hazard.fireClass || FireClass.A;
          
          // Check if extinguisher class matches fire class
          if (playerExtinguisherClass === hazardFireClass) {
            extinguishHazard(hazard.id);
            extinguishedAny = true;
            console.log(`✅ Extinguished Class ${hazardFireClass} fire with Class ${playerExtinguisherClass} extinguisher: ${hazard.id}`);
          } else {
            console.log(`❌ Wrong extinguisher! Class ${hazardFireClass} fire needs Class ${hazardFireClass} extinguisher, but you have Class ${playerExtinguisherClass}`);
            // Could add UI feedback here for wrong extinguisher type
          }
        }
      });
      
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
        console.log("Rendering interactive object:", obj);
        return (
          <ExtinguisherPickup 
            key={obj.id} 
            object={obj} 
            isCollected={obj.isCollected} 
          />
        );
      })}
      

      
      {/* Extinguisher effect when player is extinguishing */}
      {isExtinguishing && (
        <ExtinguisherEffect
          isActive={isExtinguishing}
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
