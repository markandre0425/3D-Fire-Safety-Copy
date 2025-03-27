import { useRef } from "react";
import { Mesh } from "three";
import { useTexture } from "@react-three/drei";

interface FurnitureProps {
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
}

export default function Furniture({ 
  type, 
  position, 
  rotation = [0, 0, 0], 
  scale 
}: FurnitureProps) {
  const meshRef = useRef<Mesh>(null);
  
  // Load appropriate texture based on furniture type
  const getTextureUrl = () => {
    switch (type) {
      case "table":
      case "counter":
      case "dresser":
      case "bed":
        return "/textures/wood.jpg";
      default:
        return "/textures/wood.jpg";
    }
  };
  
  const texture = useTexture(getTextureUrl());
  
  // Color based on furniture type
  const getColor = () => {
    switch (type) {
      case "sofa":
        return "#3498DB"; // Blue for sofa
      case "bed":
        return "#9B59B6"; // Purple for bed
      case "dresser":
        return "#8B4513"; // Brown for dresser
      case "table":
      case "counter":
        return "#D35400"; // Dark orange for tables/counters
      default:
        return "#A0522D"; // Brown as default color
    }
  };
  
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
      castShadow 
      receiveShadow
    >
      <boxGeometry args={scale} />
      <meshStandardMaterial map={texture} color={getColor()} />
    </mesh>
  );
}
