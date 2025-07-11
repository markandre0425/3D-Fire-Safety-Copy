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
  const extinguisherRef = useRef<THREE.Mesh>(null);
  const previousPosition = useRef<[number, number, number]>([0, 0, 0]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isUsingExtinguisher, setIsUsingExtinguisher] = useState(false);
  const animationPhase = useRef(0);
  
  // Animation state for walking/running
  const walkAnimationPhase = useRef(0);
  const [isMoving, setIsMoving] = useState(false);
  const [currentMoveSpeed, setCurrentMoveSpeed] = useState(0);
  
  // Load the character model
  const { scene: characterModel } = useGLTF('/models/firefighter.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Get direct access to necessary player state properties
  const { 
    position, 
    rotation,
    isCrouching,
    isRunning,
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
    crouch: false,
    extinguish: false
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
        
        // Handle extinguisher animation
        if (state.extinguish && hasExtinguisher) {
          setIsUsingExtinguisher(true);
        } else {
          setIsUsingExtinguisher(false);
        }
      }
    );
    
    console.log("Keyboard controls registered:", Object.keys(getKeys()));
    
    return () => {
      unsubscribe();
    };
  }, [subscribe, getKeys, setCrouching, setRunning, hasExtinguisher]);
  
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
    
    // Calculate movement for animations
    const deltaX = position.x - previousPosition.current[0];
    const deltaZ = position.z - previousPosition.current[2];
    const moveSpeed = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ) / delta;
    setCurrentMoveSpeed(moveSpeed);
    
    // Check if character is moving based on controls OR movement
    const anyMovementKey = controls.forward || controls.backward || controls.leftward || controls.rightward;
    const moving = moveSpeed > 0.01 || anyMovementKey; // Lower threshold and check keys
    setIsMoving(moving);
    
    // Debug movement detection
    if (anyMovementKey) {
      console.log("Movement keys pressed:", controls, "Position change:", {deltaX, deltaZ}, "Speed:", moveSpeed);
    }
    
    // Update player mesh position from state
    playerRef.current.position.x = position.x;
    playerRef.current.position.y = position.y;
    playerRef.current.position.z = position.z;
    playerRef.current.rotation.y = rotation.y;
    
    // Animate fire extinguisher usage
    if (isUsingExtinguisher && extinguisherRef.current) {
      animationPhase.current += delta * 8; // Animation speed
      const shake = Math.sin(animationPhase.current) * 0.1;
      extinguisherRef.current.position.set(0.3 + shake * 0.2, 0.5 + shake * 0.1, 0.3);
      extinguisherRef.current.rotation.x = shake * 0.3;
      extinguisherRef.current.rotation.z = shake * 0.2;
    } else if (extinguisherRef.current) {
      // Reset to default position
      extinguisherRef.current.position.set(0.3, 0.5, 0.3);
      extinguisherRef.current.rotation.set(0, 0, 0);
      animationPhase.current = 0;
    }
    
    // Enhanced character model animation based on movement and actions
    if (modelRef.current) {
      if (moving) {
        // Debug logging
        console.log("Moving:", moving, "Running:", isRunning, "Speed:", moveSpeed);
        
        // Different animation speeds for walking vs running
        const animationSpeed = isRunning ? 12 : 8; // Running is faster
        walkAnimationPhase.current += delta * animationSpeed;
        
        // Walking/Running bob animation (increased intensity for visibility)
        const bobIntensity = isRunning ? 0.15 : 0.08; // More visible bobbing
        const bobFrequency = isRunning ? 3 : 2.5; // Faster frequency
        
        // Vertical bobbing
        modelRef.current.position.y = Math.sin(walkAnimationPhase.current * bobFrequency) * bobIntensity;
        
        // Side-to-side sway for realistic walking
        modelRef.current.rotation.z = Math.sin(walkAnimationPhase.current * bobFrequency) * (isRunning ? 0.15 : 0.1);
        
        // Arm swing simulation (shoulder rotation)
        modelRef.current.rotation.x = Math.sin(walkAnimationPhase.current * bobFrequency) * (isRunning ? 0.2 : 0.15);
        
        // Add slight forward lean when running
        if (isRunning) {
          modelRef.current.rotation.x += -0.1; // Lean forward when running
        }
        
        // Crouching affects the animation
        if (isCrouching) {
          modelRef.current.position.y *= 0.5; // Reduce bob when crouching
          modelRef.current.rotation.z *= 0.7; // Reduce sway when crouching
        }
      } else {
        // Idle state - reset to neutral pose
        walkAnimationPhase.current = 0;
        modelRef.current.position.y = 0;
        modelRef.current.rotation.z = 0;
        modelRef.current.rotation.x = 0;
        
        // Subtle idle breathing animation
        const breathingPhase = Date.now() * 0.001;
        modelRef.current.position.y = Math.sin(breathingPhase) * 0.005;
      }
      
      // Special stance when using extinguisher (overrides walking animation)
      if (isUsingExtinguisher) {
        modelRef.current.rotation.x = -0.2; // Lean forward when using extinguisher
        modelRef.current.rotation.z = 0; // Stabilize when using tool
        modelRef.current.position.y = 0; // No bobbing when focused on extinguishing
      }
    }
    
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
    
    // Check if player is touching fire directly and take HP damage
    const activeFireHazards = hazards.filter(h => h.isActive && !h.isExtinguished);
    let inFire = false;
    
    for (const hazard of activeFireHazards) {
      const dx = position.x - hazard.position.x;
      const dz = position.z - hazard.position.z;
      const distanceSquared = dx * dx + dz * dz;
      
      // Smaller distance for direct fire contact (more dangerous than smoke)
      const fireContactDistance = GAME_CONSTANTS.DAMAGE_DISTANCE * 0.6;
      
      if (distanceSquared < fireContactDistance * fireContactDistance) {
        // Player is touching fire, take direct HP damage
        const fireDamage = PLAYER_CONSTANTS.HEALTH_DEPLETION_RATE * hazard.severity * delta;
        console.log(`Player taking fire damage: ${fireDamage} HP`);
        // Access takeDamage function directly from player store
        usePlayer.getState().takeDamage(fireDamage);
        inFire = true;
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
  
  // Get animation scale based on movement type
  const getAnimationScale = (): [number, number, number] => {
    if (isCrouching) return [0.5, 0.35, 0.5];
    if (isRunning && isMoving) return [0.52, 0.52, 0.52]; // Slightly bigger when running
    return [0.5, 0.5, 0.5];
  };
  
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
            <meshStandardMaterial 
              color={
                isRunning && isMoving ? "#FF6B6B" : // Red when running
                isMoving ? "#3498DB" : // Blue when walking  
                hasExtinguisher ? "#E74C3C" : "#3498DB" // Default colors
              } 
            />
          </mesh>
        }>
          <group 
            ref={modelRef} 
            scale={getAnimationScale()} 
            position={[0, isCrouching ? -0.5 : 0, 0]}
          >
            <primitive object={characterModel.clone()} castShadow receiveShadow />
          </group>
          
          {/* Fire extinguisher (if player has one) */}
          {hasExtinguisher && (
            <mesh 
              ref={extinguisherRef}
              position={[0.3, 0.5, 0.3]} 
              scale={[0.2, 0.4, 0.15]}
              castShadow
            >
              <boxGeometry />
              <meshStandardMaterial 
                color={isUsingExtinguisher ? "#FF6B6B" : "#C0392B"}
                emissive={isUsingExtinguisher ? new THREE.Color(0x331100) : new THREE.Color(0x000000)}
              />
            </mesh>
          )}
          
          {/* Action indicator when using extinguisher */}
          {isUsingExtinguisher && (
            <mesh position={[0, 2.2, 0]}>
              <ringGeometry args={[0.3, 0.4, 8]} />
              <meshBasicMaterial 
                color="#FFD700" 
                transparent 
                opacity={0.8}
                side={THREE.DoubleSide}
              />
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
          <meshStandardMaterial 
            color={
              isRunning && isMoving ? "#FF6B6B" : // Red when running
              isMoving ? "#3498DB" : // Blue when walking  
              hasExtinguisher ? "#E74C3C" : "#3498DB" // Default colors
            } 
          />
        </mesh>
      )}
    </group>
  );
}
