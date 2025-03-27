import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { Mesh, RepeatWrapping } from "three";

interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export default function Wall({ position, rotation, scale }: WallProps) {
  const meshRef = useRef<Mesh>(null);
  
  // Load wall texture
  const texture = useTexture("/textures/asphalt.png");
  
  // Configure the texture
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 1);
  
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation} 
      receiveShadow
      castShadow
    >
      <boxGeometry args={scale} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
