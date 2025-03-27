import { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { InteractiveObject } from "@/lib/types";

// Preload the model
useGLTF.preload('/models/fire_extinguisher.glb');

interface FireExtinguisherProps {
  object: InteractiveObject;
  isCollected: boolean;
}

export default function FireExtinguisher({ object, isCollected }: FireExtinguisherProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Load the model
  const { scene: extinguisherModel } = useGLTF('/models/fire_extinguisher.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Update loading state
  useEffect(() => {
    if (extinguisherModel) {
      setModelLoaded(true);
      console.log("Fire extinguisher model loaded successfully");
    }
  }, [extinguisherModel]);
  
  // Simple animation for the fire extinguisher
  useFrame((_, delta) => {
    if (!isCollected && groupRef.current) {
      // Make it hover slightly
      groupRef.current.position.y = object.position.y + Math.sin(Date.now() * 0.002) * 0.05;
      
      // Rotate slowly
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // Don't render if already collected
  if (isCollected) return null;
  
  return (
    <group 
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
      scale={[2.5, 2.5, 2.5]} // Scale up the model
    >
      {modelLoaded ? (
        <Suspense fallback={
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        }>
          <primitive object={extinguisherModel.clone()} castShadow receiveShadow />
        </Suspense>
      ) : (
        // Fallback while loading
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      )}
    </group>
  );
}
