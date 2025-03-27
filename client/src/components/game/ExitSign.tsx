import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { InteractiveObject } from "@/lib/types";

interface ExitSignProps {
  object: InteractiveObject;
}

export default function ExitSign({ object }: ExitSignProps) {
  const groupRef = useRef<Group>(null);
  const signRef = useRef<Mesh>(null);
  const textRef = useRef<Mesh>(null);
  
  // Make the sign glow
  useFrame(() => {
    if (textRef.current) {
      // Pulse the glow intensity
      const material = textRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1 + Math.sin(Date.now() * 0.002) * 0.5;
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[0, Math.PI, 0]} // Face exit sign toward player
    >
      {/* Sign background */}
      <mesh 
        ref={signRef}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.8, 0.3, 0.05]} />
        <meshStandardMaterial color="#003300" />
      </mesh>
      
      {/* EXIT text (simplified as a bar) */}
      <mesh 
        ref={textRef}
        position={[0, 0, 0.03]}
        castShadow
      >
        <boxGeometry args={[0.6, 0.15, 0.01]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      
      {/* Arrow pointing down */}
      <mesh 
        position={[0, -0.25, 0]}
        castShadow
      >
        <boxGeometry args={[0.1, 0.2, 0.05]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
