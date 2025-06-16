import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayer } from '@/lib/stores/usePlayer';

interface SmokeZoneProps {
  position: [number, number, number];
  radius?: number;
  intensity?: number;
  damageRate?: number;
}

export default function SmokeZone({ 
  position, 
  radius = 2, 
  intensity = 1,
  damageRate = 5
}: SmokeZoneProps) {
  const smokeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const playerState = usePlayer();
  
  // Check if player is in smoke zone and apply damage
  useFrame((_, delta) => {
    if (!smokeRef.current) return;
    
    // Calculate distance from player to smoke center
    const playerPos = playerState.position;
    const smokePos = position;
    
    const distance = Math.sqrt(
      Math.pow(playerPos.x - smokePos[0], 2) + 
      Math.pow(playerPos.z - smokePos[2], 2)
    );
    
    // If player is within smoke radius, apply damage
    if (distance <= radius) {
      // Temporarily disable gas mask protection to debug
      const damage = damageRate * intensity * delta;
      playerState.depleteOxygen(damage);
      
      // Visual feedback - make smoke red when player is inside
      if (materialRef.current) {
        materialRef.current.color.setRGB(0.8, 0.2, 0.2); // Red when in smoke
      }
    } else {
      // Normal smoke color when player is outside
      if (materialRef.current) {
        materialRef.current.color.setRGB(0.4, 0.4, 0.4); // Gray
      }
    }
    
    // Animate smoke movement
    if (smokeRef.current) {
      smokeRef.current.rotation.y += delta * 0.3;
      smokeRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.2;
    }
  });
  
  return (
    <mesh
      ref={smokeRef}
      position={position}
    >
      {/* Simple cylinder geometry for smoke */}
      <cylinderGeometry args={[radius, radius * 1.2, 3, 8]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#666666"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
} 