import { useRef, useEffect, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Controls } from "@/lib/types";
import { PLAYER_CONSTANTS, GAME_CONSTANTS } from "@/lib/constants";

// Preload the model
useGLTF.preload('/models/firefighter.glb');

export default function Character() {
  const playerRef = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Mesh>(null);
  const modelRef = useRef<THREE.Group>(null);
  const previousPosition = useRef<[number, number, number]>([0, 0, 0]);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Load the character model
  const { scene: characterModel } = useGLTF('/models/firefighter.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Get direct access to necessary player state properties
  const { 
    position, 
    rotation,
    isCrouching,
    hasExtinguisher,
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    setCrouching,
    setRunning,
    depleteOxygen,
    replenishOxygen
  } = usePlayer();
  
  // Get hazards and game pause state
  const { hazards, isPaused } = useFireSafety();
  
  // Get keyboard controls at the component level
  const [subscribe, getKeys] = useKeyboardControls<Controls>();
  
  // Store keyboard controls state
  const controlsRef = useRef({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    run: false,
    crouch: false
  });
  
  // Set up keyboard controls subscription once
  useEffect(() => {
    // Subscribe to all key changes
    const unsubscribe = subscribe(
      (state) => state,
      (state) => {
        // Update our local ref with current control states
        controlsRef.current = state;
        
        // Handle special controls directly
        setCrouching(state.crouch || false);
        setRunning(state.run || false);
      }
    );
    
    console.log("Keyboard controls registered:", Object.keys(getKeys()));
    
    return () => {
      unsubscribe();
    };
  }, [subscribe, getKeys, setCrouching, setRunning]);
  
  // Handle player movement and rotation in the game loop
  useFrame((_, delta) => {
    if (isPaused || !playerRef.current) return;
    
    // Use our locally stored controls state
    const controls = controlsRef.current;
    
    // Save previous position for collision detection
    previousPosition.current = [
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z
    ];
    
    // Move character based on keyboard input
    if (controls.forward) moveForward(delta);
    if (controls.backward) moveBackward(delta);
    if (controls.leftward) moveLeft(delta);
    if (controls.rightward) moveRight(delta);
    
    // Update player mesh position from state
    playerRef.current.position.x = position.x;
    playerRef.current.position.y = position.y;
    playerRef.current.position.z = position.z;
    playerRef.current.rotation.y = rotation.y;
    
    // Check if player is in smoke and deplete oxygen if necessary
    const activeSmokingHazards = hazards.filter(h => h.isSmoking && !h.isExtinguished);
    let inSmoke = false;
    
    for (const hazard of activeSmokingHazards) {
      const dx = position.x - hazard.position.x;
      const dz = position.z - hazard.position.z;
      const distanceSquared = dx * dx + dz * dz;
      
      if (distanceSquared < GAME_CONSTANTS.DAMAGE_DISTANCE * GAME_CONSTANTS.DAMAGE_DISTANCE) {
        // Player is in smoke, deplete oxygen
        depleteOxygen(PLAYER_CONSTANTS.OXYGEN_DEPLETION_RATE * delta);
        inSmoke = true;
        break;
      }
    }
    
    // If not in smoke, gradually replenish oxygen
    if (!inSmoke) {
      replenishOxygen(PLAYER_CONSTANTS.OXYGEN_DEPLETION_RATE * 0.5 * delta);
    }
    
    // Simple wall collision - keep player within the level bounds
    const boundarySize = 4.5;
    
    if (playerRef.current.position.x > boundarySize) {
      playerRef.current.position.x = boundarySize;
      position.x = boundarySize;
    }
    if (playerRef.current.position.x < -boundarySize) {
      playerRef.current.position.x = -boundarySize;
      position.x = -boundarySize;
    }
    if (playerRef.current.position.z > boundarySize) {
      playerRef.current.position.z = boundarySize;
      position.z = boundarySize;
    }
    if (playerRef.current.position.z < -boundarySize) {
      playerRef.current.position.z = -boundarySize;
      position.z = -boundarySize;
    }
  });
  
  // Set initial position on mount
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(position.x, position.y, position.z);
      playerRef.current.rotation.y = rotation.y;
    }
  }, []);
  
  // Update model loaded state
  useEffect(() => {
    if (characterModel) {
      setModelLoaded(true);
      console.log("Character model loaded successfully");
    }
  }, [characterModel]);
  
  return (
    <group 
      ref={playerRef} 
      position={[position.x, position.y, position.z]}
      rotation={[0, rotation.y, 0]}
    >
      {modelLoaded ? (
        <Suspense fallback={
          <mesh 
            ref={characterRef} 
            position={[0, 0, 0]} 
            castShadow
          >
            <boxGeometry args={[0.5, isCrouching ? 1 : 1.7, 0.5]} />
            <meshStandardMaterial color={hasExtinguisher ? "#E74C3C" : "#3498DB"} />
          </mesh>
        }>
          <group 
            ref={modelRef} 
            scale={[0.5, isCrouching ? 0.35 : 0.5, 0.5]} 
            position={[0, isCrouching ? -0.5 : 0, 0]}
          >
            <primitive object={characterModel.clone()} castShadow receiveShadow />
          </group>
          
          {/* Fire extinguisher (if player has one) */}
          {hasExtinguisher && (
            <mesh position={[0.3, 0.5, 0.3]} scale={[0.2, 0.4, 0.15]}>
              <boxGeometry />
              <meshStandardMaterial color="#C0392B" />
            </mesh>
          )}
        </Suspense>
      ) : (
        // Fallback while loading
        <mesh 
          ref={characterRef} 
          position={[0, 0, 0]} 
          castShadow
        >
          <boxGeometry args={[0.5, isCrouching ? 1 : 1.7, 0.5]} />
          <meshStandardMaterial color={hasExtinguisher ? "#E74C3C" : "#3498DB"} />
        </mesh>
      )}
    </group>
  );
}
