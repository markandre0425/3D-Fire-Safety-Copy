import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Controls } from "@/lib/types";
import { PLAYER_CONSTANTS, GAME_CONSTANTS } from "@/lib/constants";

// Preload the model
useGLTF.preload('/models/firefighter.glb');

interface EnhancedCharacterProps {
  enablePhysics?: boolean;
  showDebug?: boolean;
}

export default function EnhancedCharacter({ 
  enablePhysics = true, 
  showDebug = false 
}: EnhancedCharacterProps) {
  const characterRef = useRef<THREE.Group>(null);
  const extinguisherRef = useRef<THREE.Mesh>(null);
  const [isUsingExtinguisher, setIsUsingExtinguisher] = useState(false);
  const animationPhase = useRef(0);
  
  // Load the character model
  const { scene: characterModel } = useGLTF('/models/firefighter.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Get player state
  const { 
    position, 
    rotation,
    isCrouching,
    isRunning,
    hasExtinguisher,
    depleteOxygen,
    replenishOxygen,
    takeDamage
  } = usePlayer();
  
  // Get game state
  const { hazards, isPaused } = useFireSafety();
  
  // Get keyboard controls
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
  
  // Set up keyboard controls subscription
  useEffect(() => {
    const unsubscribe = subscribe(
      (state) => state,
      (state) => {
        controlsRef.current = state;
        
        // Handle extinguisher animation
        if (state.extinguish && hasExtinguisher) {
          setIsUsingExtinguisher(true);
        } else {
          setIsUsingExtinguisher(false);
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [subscribe, hasExtinguisher]);
  
  // Handle environmental hazards
  useFrame((_, delta) => {
    if (isPaused || !characterRef.current) return;
    
    // Animate fire extinguisher usage
    if (isUsingExtinguisher && extinguisherRef.current) {
      animationPhase.current += delta * 8;
      const shake = Math.sin(animationPhase.current) * 0.1;
      extinguisherRef.current.position.set(0.3 + shake * 0.2, 0.5 + shake * 0.1, 0.3);
      extinguisherRef.current.rotation.x = shake * 0.3;
      extinguisherRef.current.rotation.z = shake * 0.2;
    } else if (extinguisherRef.current) {
      extinguisherRef.current.position.set(0.3, 0.5, 0.3);
      extinguisherRef.current.rotation.set(0, 0, 0);
      animationPhase.current = 0;
    }
    
    // Check smoke hazards
    const activeSmokingHazards = hazards.filter(h => h.isSmoking && !h.isExtinguished);
    let inSmoke = false;
    
    for (const hazard of activeSmokingHazards) {
      const dx = position.x - hazard.position.x;
      const dz = position.z - hazard.position.z;
      const distanceSquared = dx * dx + dz * dz;
      
      if (distanceSquared < GAME_CONSTANTS.DAMAGE_DISTANCE * GAME_CONSTANTS.DAMAGE_DISTANCE) {
        depleteOxygen(PLAYER_CONSTANTS.OXYGEN_DEPLETION_RATE * delta);
        inSmoke = true;
        break;
      }
    }
    
    // Check fire hazards
    const activeFireHazards = hazards.filter(h => h.isActive && !h.isExtinguished);
    
    for (const hazard of activeFireHazards) {
      const dx = position.x - hazard.position.x;
      const dz = position.z - hazard.position.z;
      const distanceSquared = dx * dx + dz * dz;
      
      const fireContactDistance = GAME_CONSTANTS.DAMAGE_DISTANCE * 0.6;
      
      if (distanceSquared < fireContactDistance * fireContactDistance) {
        const fireDamage = PLAYER_CONSTANTS.HEALTH_DEPLETION_RATE * hazard.severity * delta;
        takeDamage(fireDamage);
        break;
      }
    }
    
    // Replenish oxygen if not in smoke
    if (!inSmoke) {
      replenishOxygen(PLAYER_CONSTANTS.OXYGEN_DEPLETION_RATE * 0.5 * delta);
    }
  });
  
  // Ecctrl configuration
  const ecctrlProps = {
    debug: showDebug,
    animated: true,
    followLight: true,
    spring: enablePhysics,
    disableFollowCam: false,
    disableFollowCamPos: { x: 0, y: 5, z: 8 },
    disableFollowCamTarget: { x: 0, y: 1, z: 0 },
    
    // Movement speeds (integrate with existing player constants)
    maxVelLimit: isRunning ? PLAYER_CONSTANTS.RUNNING_SPEED : PLAYER_CONSTANTS.MOVEMENT_SPEED,
    jumpVel: 4,
    jumpForceToGroundRatio: 5,
    slopJumpMulitplier: 0.25,
    sprintMult: 1.8,
    sprintJumpMulitplier: 1.2,
    airDragMultiplier: 0.2,
    dragDamping: -0.15,
    accDeltaTime: 8,
    rejectVelMult: 4,
    moveImpulsePointY: 0.5,
    camInitDis: -5,
    camMinDis: -0.7,
    camFollowMult: 11.5,
    turnVelMultiplier: 1,
    turnSpeed: 15,
    mode: "CameraBasedMovement" as const,
    
    // Control mapping
    controls: controlsRef.current,
    
    // Position from player state
    position: [position.x, position.y, position.z] as [number, number, number],
  };
  
  return (
    <group ref={characterRef}>
      <Ecctrl {...ecctrlProps}>
        <EcctrlAnimation
          characterURL="/models/firefighter.glb"
          animationSet={{
            idle: "Idle",
            walk: "Walk",
            run: "Run",
            jump: "Jump"
          }}
        >
          {/* Fallback character model */}
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.3, isCrouching ? 1 : 1.7]} />
            <meshStandardMaterial 
              color={
                isRunning ? "#FF6B6B" : 
                hasExtinguisher ? "#E74C3C" : "#3498DB"
              } 
            />
          </mesh>
        </EcctrlAnimation>
        
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
      </Ecctrl>
    </group>
  );
} 