import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Character from "./Character";
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import Hazard from "./Hazard";
import ExtinguisherPickup from "./ExtinguisherPickup";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";

export default function Level() {
  const { 
    hazards, 
    interactiveObjects, 
    updateLevelTime,
    extinguishHazard,
    collectObject,
    activateSmokeDetector,
    isPaused
  } = useFireSafety();
  
  const playerState = usePlayer();
  
  const lastUpdateTime = useRef(Date.now());
  
  // Get keyboard controls
  const actionPressed = useKeyboardControls<Controls>(state => state.action);
  const extinguishPressed = useKeyboardControls<Controls>(state => state.extinguish);
  
  // Update level time on every frame
  useFrame(() => {
    if (isPaused) return;
    
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 1000; // in seconds
    lastUpdateTime.current = now;
    
    // Update level time
    updateLevelTime(deltaTime);
  });
  
  // Handle player interaction with objects
  useEffect(() => {
    if (actionPressed) {
      // Check for nearby interactive objects
      interactiveObjects.forEach(obj => {
        if (obj.isCollected || (obj.type === "SmokeDetector" && obj.isActive)) return;
        
        const dx = playerState.position.x - obj.position.x;
        const dz = playerState.position.z - obj.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.INTERACTION_DISTANCE * GAME_CONSTANTS.INTERACTION_DISTANCE) {
          if (obj.type === "FireExtinguisher") {
            collectObject(obj.id);
          } else if (obj.type === "SmokeDetector") {
            activateSmokeDetector(obj.id);
          }
          
          console.log(`Interacted with ${obj.type}: ${obj.id}`);
        }
      });
    }
  }, [actionPressed, interactiveObjects, playerState.position, collectObject, activateSmokeDetector]);
  
  // Handle fire extinguisher usage
  useEffect(() => {
    if (extinguishPressed && playerState.hasExtinguisher) {
      // Check for nearby hazards to extinguish
      hazards.forEach(hazard => {
        if (hazard.isExtinguished || !hazard.isActive) return;
        
        const dx = playerState.position.x - hazard.position.x;
        const dz = playerState.position.z - hazard.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.EXTINGUISHER_RANGE * GAME_CONSTANTS.EXTINGUISHER_RANGE) {
          extinguishHazard(hazard.id);
          console.log(`Extinguished hazard: ${hazard.id}`);
        }
      });
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
      
      {/* Render interactive objects */}
      {interactiveObjects.map(obj => (
        <ExtinguisherPickup 
          key={obj.id} 
          object={obj} 
          isCollected={obj.isCollected} 
        />
      ))}
      
      <Character />
    </>
  );
}
