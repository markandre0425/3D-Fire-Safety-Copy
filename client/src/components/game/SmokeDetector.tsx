import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, MeshStandardMaterial } from "three";
import { InteractiveObject } from "@/lib/types";

interface SmokeDetectorProps {
  object: InteractiveObject;
  isActive: boolean;
}

export default function SmokeDetector({ object, isActive }: SmokeDetectorProps) {
  const groupRef = useRef<Group>(null);
  const detectorRef = useRef<Mesh>(null);
  const indicatorRef = useRef<Mesh>(null);
  
  // Blink the indicator light if active
  useFrame(() => {
    if (isActive && indicatorRef.current) {
      // Blink every second
      const blinkState = Math.floor(Date.now() / 1000) % 2 === 0;
      
      // Update emissive color based on blink state
      const material = indicatorRef.current.material as MeshStandardMaterial;
      material.emissive.set(blinkState ? "#FF0000" : "#330000");
      material.emissiveIntensity = blinkState ? 2 : 0.5;
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
    >
      {/* Main detector body */}
      <mesh 
        ref={detectorRef}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Indicator light */}
      <mesh 
        ref={indicatorRef}
        position={[0, -0.01, 0]}
        castShadow
      >
        <boxGeometry args={[0.02, 0.01, 0.02]} />
        <meshStandardMaterial 
          color={isActive ? "#FF0000" : "#333333"} 
          emissive={isActive ? "#FF0000" : "#000000"}
          emissiveIntensity={isActive ? 2 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
