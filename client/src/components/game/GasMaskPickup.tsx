import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface GasMaskPickupProps {
  position: [number, number, number];
  isCollected?: boolean;
  onCollect?: () => void;
}

export default function GasMaskPickup({ position, isCollected = false }: GasMaskPickupProps) {
  const maskRef = useRef<THREE.Group>(null);
  
  // Don't render if collected
  if (isCollected) return null;
  
  // Animate the mask with floating motion
  useFrame((_, delta) => {
    if (!maskRef.current) return;
    
    const time = Date.now() * 0.001;
    
    // Floating animation
    maskRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3;
    maskRef.current.rotation.y += delta * 2;
  });
  
  return (
    <group ref={maskRef} position={position}>
      {/* Simple mask representation using basic geometry */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.3]} />
        <meshStandardMaterial color="#2563eb" /> {/* Blue color */}
      </mesh>
      
      {/* Filter cartridge */}
      <mesh position={[0, -0.3, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
        <meshStandardMaterial color="#1f2937" /> {/* Dark gray */}
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        BFP Breathing Apparatus
      </Text>
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="yellow"
        anchorX="center"
        anchorY="middle"
      >
        Press E to Collect
      </Text>
    </group>
  );
} 