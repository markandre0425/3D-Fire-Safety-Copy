import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { Controls } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-is-mobile";

// Enhanced components
import EnhancedCharacter from "./EnhancedCharacter";
import PhysicsWorld, { PhysicsObject } from "./PhysicsWorld";
import EnhancedCameraControls, { useCameraMode } from "./EnhancedCameraControls";
import EnhancedMobileControls from "./EnhancedMobileControls";

// Existing components
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import Hazard from "./Hazard";
import ExtinguisherPickup from "./ExtinguisherPickup";
import GameUI from "./GameUI";

// Stores
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";

// Control mapping
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

interface EnhancedGameDemoProps {
  enablePhysics?: boolean;
  enableEnhancedCharacter?: boolean;
  enableEnhancedCamera?: boolean;
  enableMobileControls?: boolean;
  showDebug?: boolean;
}

export default function EnhancedGameDemo({
  enablePhysics = false,
  enableEnhancedCharacter = false,
  enableEnhancedCamera = false,
  enableMobileControls = true,
  showDebug = false
}: EnhancedGameDemoProps) {
  const isMobile = useIsMobile();
  const { hazards, interactiveObjects, isPaused, pauseGame, resumeGame } = useFireSafety();
  const { rotate } = usePlayer();
  
  // Camera mode management
  const [cameraMode, setCameraMode] = useState<"firstPerson" | "thirdPerson" | "overview" | "cinematic">("thirdPerson");
  
  // Handle mobile camera rotation
  const handleCameraRotate = (deltaX: number, deltaY: number) => {
    // Rotate player based on camera movement
    rotate(deltaX);
  };
  
  // Handle mobile actions
  const handleMobileAction = () => {
    // Trigger fire extinguisher or interaction
    console.log("Mobile action triggered!");
  };
  
  // Handle pause
  const handlePause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };
  
  return (
    <div className="w-full h-full">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 5, 10],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: !isMobile, // Disable antialiasing on mobile for performance
            powerPreference: isMobile ? "default" : "high-performance",
            stencil: false,
          }}
        >
          <color attach="background" args={["#87CEEB"]} />
          
          {/* Physics World (optional) */}
          <PhysicsWorld enabled={enablePhysics} showDebug={showDebug}>
            
            {/* Enhanced Camera Controls */}
            {enableEnhancedCamera && (
              <EnhancedCameraControls
                enabled={!isMobile} // Disable on mobile to avoid conflicts
                cameraMode={cameraMode}
                followPlayer={true}
                                 onCameraModeChange={(mode) => setCameraMode(mode as any)}
              />
            )}
            
            {/* Lighting */}
            <Lights />
            
            {/* Environment */}
            <Suspense fallback={null}>
              <HomeEnvironment />
            </Suspense>
            
            {/* Character - Enhanced or Regular */}
            <Suspense fallback={null}>
              {enableEnhancedCharacter ? (
                <EnhancedCharacter 
                  enablePhysics={enablePhysics}
                  showDebug={showDebug}
                />
              ) : (
                // Fallback to basic character representation
                <mesh position={[0, 1, 0]} castShadow>
                  <capsuleGeometry args={[0.3, 1.7]} />
                  <meshStandardMaterial color="#3498DB" />
                </mesh>
              )}
            </Suspense>
            
            {/* Fire Hazards with Physics (optional) */}
            {hazards.map((hazard) => (
              <group key={hazard.id}>
                {enablePhysics ? (
                  <PhysicsObject
                    type="fixed"
                    position={[hazard.position.x, hazard.position.y, hazard.position.z]}
                    cuboidArgs={[0.5, 0.5, 0.5]}
                  >
                    <Hazard hazard={hazard} />
                  </PhysicsObject>
                ) : (
                  <Hazard hazard={hazard} />
                )}
              </group>
            ))}
            
            {/* Interactive Objects (Extinguishers, etc.) */}
            {interactiveObjects.map((obj) => (
              <group key={obj.id}>
                {enablePhysics ? (
                  <PhysicsObject
                    type="dynamic"
                    position={[obj.position.x, obj.position.y, obj.position.z]}
                    cuboidArgs={[0.2, 0.4, 0.2]}
                    mass={5}
                  >
                                         <ExtinguisherPickup object={obj} isCollected={obj.isCollected} />
                   </PhysicsObject>
                 ) : (
                   <ExtinguisherPickup object={obj} isCollected={obj.isCollected} />
                )}
              </group>
            ))}
            
            {/* Environmental Physics Objects (walls, furniture) */}
            {enablePhysics && (
              <>
                {/* Room walls */}
                <PhysicsObject
                  type="fixed"
                  position={[0, 1.5, -5]}
                  cuboidArgs={[10, 3, 0.1]}
                >
                  <mesh>
                    <boxGeometry args={[10, 3, 0.1]} />
                    <meshStandardMaterial color="#8B4513" transparent opacity={0.3} />
                  </mesh>
                </PhysicsObject>
                
                <PhysicsObject
                  type="fixed"
                  position={[0, 1.5, 5]}
                  cuboidArgs={[10, 3, 0.1]}
                >
                  <mesh>
                    <boxGeometry args={[10, 3, 0.1]} />
                    <meshStandardMaterial color="#8B4513" transparent opacity={0.3} />
                  </mesh>
                </PhysicsObject>
                
                <PhysicsObject
                  type="fixed"
                  position={[-5, 1.5, 0]}
                  cuboidArgs={[0.1, 3, 10]}
                >
                  <mesh>
                    <boxGeometry args={[0.1, 3, 10]} />
                    <meshStandardMaterial color="#8B4513" transparent opacity={0.3} />
                  </mesh>
                </PhysicsObject>
                
                <PhysicsObject
                  type="fixed"
                  position={[5, 1.5, 0]}
                  cuboidArgs={[0.1, 3, 10]}
                >
                  <mesh>
                    <boxGeometry args={[0.1, 3, 10]} />
                    <meshStandardMaterial color="#8B4513" transparent opacity={0.3} />
                  </mesh>
                </PhysicsObject>
              </>
            )}
            
          </PhysicsWorld>
        </Canvas>
        
        {/* Mobile Controls Overlay */}
        {enableMobileControls && isMobile && (
          <EnhancedMobileControls
            enabled={true}
            showDebug={showDebug}
            onCameraRotate={handleCameraRotate}
            onAction={handleMobileAction}
            onPause={handlePause}
          />
        )}
        
        {/* Game UI */}
        <GameUI />
        
        {/* Debug Info */}
        {showDebug && (
          <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg text-sm space-y-2">
            <h3 className="font-bold text-lg">Enhanced Movement Demo</h3>
            <div className="space-y-1">
              <div>Physics: {enablePhysics ? "✅ Enabled" : "❌ Disabled"}</div>
              <div>Enhanced Character: {enableEnhancedCharacter ? "✅ Enabled" : "❌ Disabled"}</div>
              <div>Enhanced Camera: {enableEnhancedCamera ? "✅ Enabled" : "❌ Disabled"}</div>
              <div>Mobile Controls: {enableMobileControls ? "✅ Enabled" : "❌ Disabled"}</div>
              <div>Camera Mode: {cameraMode}</div>
              <div>Device: {isMobile ? "📱 Mobile" : "🖥️ Desktop"}</div>
            </div>
            
            {!isMobile && (
              <div className="mt-4 space-y-1 text-xs">
                <div className="font-semibold">Keyboard Shortcuts:</div>
                <div>WASD: Move | Shift: Run | C: Crouch</div>
                <div>E: Interact | F: Extinguish</div>
                <div>1-4: Camera Modes | Esc: Pause</div>
              </div>
            )}
          </div>
        )}
        
        {/* Feature Toggle Controls */}
        <div className="absolute top-4 right-4 bg-black/70 text-white p-4 rounded-lg text-sm space-y-2">
          <h3 className="font-bold">Features</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded ${enablePhysics ? 'bg-green-600' : 'bg-gray-600'}`}>
              Physics
            </div>
            <div className={`p-2 rounded ${enableEnhancedCharacter ? 'bg-green-600' : 'bg-gray-600'}`}>
              Ecctrl
            </div>
            <div className={`p-2 rounded ${enableEnhancedCamera ? 'bg-green-600' : 'bg-gray-600'}`}>
              Camera
            </div>
            <div className={`p-2 rounded ${enableMobileControls ? 'bg-green-600' : 'bg-gray-600'}`}>
              Mobile
            </div>
          </div>
        </div>
        
      </KeyboardControls>
    </div>
  );
} 