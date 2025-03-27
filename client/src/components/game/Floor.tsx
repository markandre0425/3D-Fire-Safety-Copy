import { useRef } from "react";
import { DoubleSide, Mesh, RepeatWrapping, TextureLoader } from "three";
import { useTexture } from "@react-three/drei";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Level } from "@/lib/types";

export default function Floor() {
  const meshRef = useRef<Mesh>(null);
  const { currentLevel } = useFireSafety();
  
  // Load the appropriate texture based on the current level
  const getTextureUrl = () => {
    switch (currentLevel) {
      case Level.Kitchen:
        return "/textures/wood.jpg";
      case Level.LivingRoom:
        return "/textures/wood.jpg";
      case Level.Bedroom:
        return "/textures/wood.jpg";
      default:
        return "/textures/wood.jpg";
    }
  };
  
  const texture = useTexture(getTextureUrl());
  
  // Configure the texture
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  
  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial map={texture} side={DoubleSide} />
    </mesh>
  );
}
