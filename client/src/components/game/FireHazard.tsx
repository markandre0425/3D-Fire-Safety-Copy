import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HazardState, HazardType } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";
import { useFireSafety } from "@/lib/stores/useFireSafety";

interface FireHazardProps {
  hazard: HazardState;
}

export default function FireHazard({ hazard }: FireHazardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fireRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Mesh>(null);
  const sparkParticles = useRef<THREE.Mesh[]>([]);
  
  const { updateHazard } = useFireSafety();
  
  // Create spark particles - ensure it's a positive integer
  const numParticles = useMemo(() => {
    // Ensure we have a positive integer for array creation
    const count = Math.max(0, Math.floor(Math.min(10, hazard.severity * 3)));
    return isNaN(count) ? 0 : count;
  }, [hazard.severity]);
  
  // Initialize particles
  useEffect(() => {
    if (numParticles > 0) {
      sparkParticles.current = Array(numParticles)
        .fill(null)
        .map(() => {
          const particle = new THREE.Mesh();
          particle.position.set(
            Math.random() * 0.4 - 0.2,
            Math.random() * 0.5,
            Math.random() * 0.4 - 0.2
          );
          particle.userData = {
            velocity: new THREE.Vector3(
              Math.random() * 0.04 - 0.02,
              Math.random() * 0.1 + 0.05,
              Math.random() * 0.04 - 0.02
            ),
            lifespan: Math.random() * 2 + 1
          };
          return particle;
        });
    } else {
      sparkParticles.current = [];
    }
  }, [numParticles]);
  
  // Animate fire and particles
  useFrame((_, delta) => {
    if (hazard.isExtinguished) return;
    
    // Animate fire
    if (fireRef.current) {
      // Pulsate fire size
      const scale = 0.2 + Math.sin(Date.now() * 0.005) * 0.05;
      fireRef.current.scale.set(
        hazard.severity * (1 + scale),
        hazard.severity * (1 + scale * 0.8),
        hazard.severity * (1 + scale)
      );
    }
    
    // Animate smoke
    if (smokeRef.current && hazard.isSmoking) {
      smokeRef.current.rotation.y += delta * 0.5;
      
      // Pulse smoke opacity based on the fire's strength
      const material = smokeRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
    }
    
    // Animate particles
    sparkParticles.current.forEach(particle => {
      const velocityData = particle.userData.velocity as THREE.Vector3;
      
      // Move particle
      particle.position.add(
        new THREE.Vector3(
          velocityData.x,
          velocityData.y,
          velocityData.z
        )
      );
      
      // Reduce lifespan
      particle.userData.lifespan -= delta;
      
      // Reset particle if it's reached the end of its life
      if (particle.userData.lifespan <= 0) {
        particle.position.set(
          Math.random() * 0.4 - 0.2,
          Math.random() * 0.2,
          Math.random() * 0.4 - 0.2
        );
        particle.userData.lifespan = Math.random() * 2 + 1;
      }
    });
    
    // Chance for fire to spread (increase severity)
    if (hazard.isActive && !hazard.isExtinguished && hazard.severity < 3) {
      const spreadChance = GAME_CONSTANTS.FIRE_SPREAD_RATE * delta;
      
      if (Math.random() < spreadChance) {
        updateHazard(hazard.id, { 
          severity: hazard.severity + 0.1,
          isSmoking: true 
        });
      }
    }
  });
  
  // Get hazard color based on type
  const getHazardBaseColor = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return "#7F8C8D"; // Gray
      case HazardType.StoveTop:
        return "#BDC3C7"; // Silver
      case HazardType.Candle:
        return "#FFFDD0"; // Cream for candle wax
      case HazardType.Fireplace:
        return "#E74C3C"; // Red
      case HazardType.SpacerHeater:
        return "#E67E22"; // Orange
      case HazardType.CloggedDryer:
        return "#95A5A6"; // Light gray
      default:
        return "#FFFFFF"; // White
    }
  };
  
  // Determine the size of the hazard base
  const getHazardDimensions = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return [0.2, 0.3, 0.1] as [number, number, number];
      case HazardType.StoveTop:
        return [0.8, 0.2, 0.6] as [number, number, number];
      case HazardType.Candle:
        return [0.15, 0.3, 0.15] as [number, number, number];
      case HazardType.Fireplace:
        return [1.2, 1, 0.4] as [number, number, number];
      case HazardType.SpacerHeater:
        return [0.6, 0.4, 0.3] as [number, number, number];
      case HazardType.CloggedDryer:
        return [0.8, 1, 0.6] as [number, number, number];
      default:
        return [0.5, 0.3, 0.5] as [number, number, number];
    }
  };
  
  return (
    <group 
      ref={groupRef}
      position={[hazard.position.x, hazard.position.y, hazard.position.z]}
    >
      {/* Hazard base object */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[
          getHazardDimensions()[0], 
          getHazardDimensions()[1], 
          getHazardDimensions()[2]
        ]} />
        <meshStandardMaterial color={getHazardBaseColor()} />
      </mesh>
      
      {/* Fire */}
      {hazard.isActive && !hazard.isExtinguished && (
        <mesh 
          ref={fireRef}
          position={[0, getHazardDimensions()[1] / 2 + 0.2, 0]}
        >
          <coneGeometry args={[0.2, 0.4, 8]} />
          <meshStandardMaterial 
            color="#FF4500" 
            emissive="#FF8C00"
            emissiveIntensity={2} 
            toneMapped={false}
          />
        </mesh>
      )}
      
      {/* Smoke */}
      {hazard.isSmoking && !hazard.isExtinguished && (
        <mesh 
          ref={smokeRef}
          position={[0, getHazardDimensions()[1] / 2 + 0.6, 0]}
        >
          <sphereGeometry args={[0.3 * hazard.severity, 8, 8]} />
          <meshStandardMaterial 
            color="#666666" 
            transparent={true} 
            opacity={0.4}
          />
        </mesh>
      )}
      
      {/* Spark particles */}
      {hazard.isActive && !hazard.isExtinguished && sparkParticles.current.map((_, i) => (
        <mesh 
          key={`spark-${hazard.id}-${i}`}
          position={[
            Math.random() * 0.4 - 0.2,
            getHazardDimensions()[1] / 2 + 0.2,
            Math.random() * 0.4 - 0.2
          ]}
          scale={[0.05, 0.05, 0.05]}
        >
          <sphereGeometry args={[1, 4, 4]} />
          <meshStandardMaterial 
            color="#FFDD00" 
            emissive="#FFFF00"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
