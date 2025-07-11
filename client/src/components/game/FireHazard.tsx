import { useRef } from "react";
import { Mesh } from "three";
import { HazardState } from "@/lib/types";
import { FIRE_CLASS_COLORS } from "@/lib/constants";
import StableParticleSystem from "./ParticleSystem";
import VolumetricFire from "./VolumetricFire";

interface FireHazardProps {
  hazard: HazardState;
}

export default function FireHazard({ hazard }: FireHazardProps) {
  const meshRef = useRef<Mesh>(null);
  
  // Get color based on fire class
  const fireColor = hazard.fireClass ? FIRE_CLASS_COLORS[hazard.fireClass] : "#FF6B35";
  
  // Don't render if hazard is not active or already extinguished
  if (!hazard.isActive || hazard.isExtinguished) {
    return null;
  }

  return (
    <>
      {/* Volumetric fire animation for main flame */}
      <VolumetricFire
        position={[hazard.position.x, hazard.position.y + 0.3, hazard.position.z]}
        scale={0.8 + hazard.severity * 0.4}
        color={fireColor}
        intensity={0.8 + hazard.severity * 0.6}
        active={true}
      />
      
      {/* Add some particle-based smoke if the hazard is smoking */}
      {hazard.isSmoking && (
        <StableParticleSystem
          count={12}
          position={[hazard.position.x, hazard.position.y + 0.8, hazard.position.z]}
          scale={1.0 + hazard.severity * 0.3}
          type="smoke"
          active={true}
        />
      )}
      
      {/* Fire base glow for ground interaction */}
      <mesh 
        ref={meshRef} 
        position={[hazard.position.x, hazard.position.y + 0.05, hazard.position.z]}
      >
        <cylinderGeometry args={[0.25 + hazard.severity * 0.1, 0.15, 0.03]} />
        <meshStandardMaterial 
          color={fireColor} 
          transparent 
          opacity={0.4}
          emissive={fireColor}
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Enhanced visual indicator for fire class (colored ring above the hazard) */}
      {hazard.fireClass && (
        <mesh position={[hazard.position.x, hazard.position.y + 1.8, hazard.position.z]}>
          <ringGeometry args={[0.3, 0.5, 16]} />
          <meshBasicMaterial 
            color={fireColor} 
            transparent 
            opacity={0.8}
            side={2} // DoubleSide
          />
        </mesh>
      )}
      
      {/* Fire class label background */}
      {hazard.fireClass && (
        <mesh position={[hazard.position.x, hazard.position.y + 2.0, hazard.position.z]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial 
            color="black"
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </>
  );
}
