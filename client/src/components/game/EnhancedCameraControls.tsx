import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import * as THREE from "three";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";

// Install camera controls for Three.js
CameraControls.install({ THREE });

// Define the props for the enhanced camera controls
interface EnhancedCameraControlsProps {
  enabled?: boolean;
  smoothTime?: number;
  followPlayer?: boolean;
  cameraMode?: "firstPerson" | "thirdPerson" | "overview" | "cinematic";
  offset?: [number, number, number];
  lookAtTarget?: [number, number, number] | null;
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  dampingFactor?: number;
  onCameraModeChange?: (mode: string) => void;
}

export default function EnhancedCameraControls({
  enabled = true,
  smoothTime = 0.5,
  followPlayer = true,
  cameraMode = "thirdPerson",
  offset = [0, 5, 8],
  lookAtTarget = null,
  enableZoom = true,
  enableRotate = true,
  enablePan = false,
  minDistance = 2,
  maxDistance = 20,
  dampingFactor = 0.1,
  onCameraModeChange
}: EnhancedCameraControlsProps) {
  const controlsRef = useRef<CameraControls | null>(null);
  const { camera, gl } = useThree();
  const { position: playerPosition, rotation: playerRotation } = usePlayer();
  const { isPaused } = useFireSafety();
  
  // Initialize camera controls
  useEffect(() => {
    if (!enabled) return;
    
    // Create camera controls instance
    const controls = new CameraControls(camera, gl.domElement);
    controlsRef.current = controls;
    
    // Configure camera controls based on mode
    switch (cameraMode) {
      case "firstPerson":
        controls.minDistance = 0.1;
        controls.maxDistance = 0.1;
        break;
        
      case "thirdPerson":
        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;
        break;
        
      case "overview":
        controls.minDistance = 15;
        controls.maxDistance = 30;
        break;
        
      case "cinematic":
        // Cinematic mode - limited interaction
        controls.minDistance = 5;
        controls.maxDistance = 15;
        break;
    }
    
    // Set damping for smooth movement
    controls.dampingFactor = dampingFactor;
    
    // Notify about camera mode change
    onCameraModeChange?.(cameraMode);
    
  }, [cameraMode, enableZoom, enableRotate, enablePan, minDistance, maxDistance, dampingFactor, onCameraModeChange]);
  
  // Update camera position to follow player
  useFrame((_, delta) => {
    if (!controlsRef.current || !enabled || isPaused) return;
    
    const controls = controlsRef.current;
    
    if (followPlayer && cameraMode !== "overview") {
      const targetPosition = new THREE.Vector3(
        playerPosition.x + offset[0],
        playerPosition.y + offset[1],
        playerPosition.z + offset[2]
      );
      
      // Determine look-at target
      let lookAt: THREE.Vector3;
      
      if (lookAtTarget) {
        lookAt = new THREE.Vector3(...lookAtTarget);
      } else {
        // Look at player position with slight forward offset based on player rotation
        const forwardOffset = new THREE.Vector3(0, 0, -2);
        forwardOffset.applyEuler(new THREE.Euler(0, playerRotation.y, 0));
        lookAt = new THREE.Vector3(
          playerPosition.x + forwardOffset.x,
          playerPosition.y + 1,
          playerPosition.z + forwardOffset.z
        );
      }
      
      // Smooth camera movement based on mode
      switch (cameraMode) {
        case "firstPerson":
          // First person: camera at player position, rotate with player
          controls.setPosition(
            playerPosition.x,
            playerPosition.y + 1.6, // Eye level
            playerPosition.z,
            true
          );
          controls.setTarget(lookAt.x, lookAt.y, lookAt.z, true);
          break;
          
        case "thirdPerson":
          // Third person: camera behind and above player
          controls.setPosition(targetPosition.x, targetPosition.y, targetPosition.z, true);
          controls.setTarget(playerPosition.x, playerPosition.y + 1, playerPosition.z, true);
          break;
          
        case "cinematic":
          // Cinematic: smooth tracking with custom positioning
          const cinematicTarget = new THREE.Vector3(
            playerPosition.x,
            playerPosition.y + 2,
            playerPosition.z
          );
          controls.setTarget(cinematicTarget.x, cinematicTarget.y, cinematicTarget.z, true);
          break;
      }
    }
    
    // Update controls
    controls.update(delta);
  });
  
  // Handle keyboard shortcuts for camera mode switching
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!enabled) return;
      
      switch (event.key) {
        case '1':
          onCameraModeChange?.("firstPerson");
          break;
        case '2':
          onCameraModeChange?.("thirdPerson");
          break;
        case '3':
          onCameraModeChange?.("overview");
          break;
        case '4':
          onCameraModeChange?.("cinematic");
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, onCameraModeChange]);
  
  // Camera controls work imperatively, no JSX needed
  return null;
}

// Utility hook for camera mode management
export function useCameraMode(initialMode: string = "thirdPerson") {
  const [mode, setMode] = useState(initialMode);
  
  const switchToFirstPerson = () => setMode("firstPerson");
  const switchToThirdPerson = () => setMode("thirdPerson");
  const switchToOverview = () => setMode("overview");
  const switchToCinematic = () => setMode("cinematic");
  
  return {
    mode,
    setMode,
    switchToFirstPerson,
    switchToThirdPerson,
    switchToOverview,
    switchToCinematic
  };
} 