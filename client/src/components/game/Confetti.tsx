import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";

interface ConfettiProps {
  position?: [number, number, number];
  count?: number;
  spread?: number;
}

export function Confetti({ position = [0, 0, 0], count = 20, spread = 2 }: ConfettiProps) {
  const groupRef = useRef<Group>(null);
  const particles = useRef<Array<{
    position: Vector3;
    velocity: Vector3;
    rotation: number;
    rotationSpeed: number;
    color: string;
  }>>([]);

  // Initialize particles
  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      position: new Vector3(
        position[0] + (Math.random() - 0.5) * spread,
        position[1] + Math.random() * 2,
        position[2] + (Math.random() - 0.5) * spread
      ),
      velocity: new Vector3(
        (Math.random() - 0.5) * 0.1,
        Math.random() * 0.2 + 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"][Math.floor(Math.random() * 6)]
    }));
  }, [count, spread, position]);

  // Animate particles
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    particles.current.forEach((particle, index) => {
      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));
      
      // Apply gravity
      particle.velocity.y -= delta * 9.8 * 0.1;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed * delta * 60;
      
      // Reset if particle falls too low
      if (particle.position.y < position[1] - 5) {
        particle.position.set(
          position[0] + (Math.random() - 0.5) * spread,
          position[1] + Math.random() * 2,
          position[2] + (Math.random() - 0.5) * spread
        );
        particle.velocity.set(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.2 + 0.1,
          (Math.random() - 0.5) * 0.1
        );
      }
      
      // Update mesh position if it exists
      const mesh = groupRef.current?.children[index];
      if (mesh) {
        mesh.position.copy(particle.position);
        mesh.rotation.z = particle.rotation;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((particle, index) => (
        <mesh key={index} position={particle.position.toArray()}>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshBasicMaterial color={particle.color} />
        </mesh>
      ))}
    </group>
  );
}

export default Confetti; 