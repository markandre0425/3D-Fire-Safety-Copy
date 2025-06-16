import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SmokeEffectProps {
  position: [number, number, number];
  intensity?: number;
  radius?: number;
  opacity?: number;
  color?: string;
  isActive?: boolean;
}

export default function SmokeEffect({ 
  position, 
  intensity = 1, 
  radius = 2, 
  opacity = 0.6,
  color = '#444444',
  isActive = true 
}: SmokeEffectProps) {
  const smokeRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  // Create smoke particles
  const { positions, velocities } = useMemo(() => {
    const particleCount = 100 * intensity;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position within radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      
      positions[i3] = Math.cos(angle) * distance;
      positions[i3 + 1] = Math.random() * 0.5;
      positions[i3 + 2] = Math.sin(angle) * distance;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = Math.random() * 0.3 + 0.1; // Upward movement
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return { positions, velocities };
  }, [intensity, radius]);
  
  // Animate smoke particles
  useFrame((_, delta) => {
    if (!particlesRef.current || !isActive) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const particleCount = positions.length / 3;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Update positions based on velocities
      positions[i3] += velocities[i3] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;
      
      // Reset particles that have moved too far up or out
      if (positions[i3 + 1] > 3 || 
          Math.abs(positions[i3]) > radius * 1.5 || 
          Math.abs(positions[i3 + 2]) > radius * 1.5) {
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 0.8;
        
        positions[i3] = Math.cos(angle) * distance;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(angle) * distance;
        
        // Randomize velocity again
        velocities[i3] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 1] = Math.random() * 0.3 + 0.1;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Animate material opacity for breathing effect
    if (materialRef.current) {
      const time = Date.now() * 0.001;
      materialRef.current.opacity = opacity + Math.sin(time * 2) * 0.1;
    }
  });
  
  if (!isActive) return null;
  
  return (
    <group ref={smokeRef} position={position}>
      {/* Particle smoke effect */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color={color}
          size={0.1}
          opacity={opacity}
          transparent
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Base smoke cloud */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[radius * 0.8, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          opacity={opacity * 0.3}
          transparent
          depthWrite={false}
        />
      </mesh>
      
      {/* Danger zone indicator (invisible collision mesh) */}
      <mesh position={[0, 0, 0]} visible={false} userData={{ type: 'smoke-damage-zone' }}>
        <cylinderGeometry args={[radius, radius, 2, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
} 