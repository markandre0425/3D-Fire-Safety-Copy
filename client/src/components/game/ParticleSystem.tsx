import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  count?: number;
  position: [number, number, number];
  scale?: number;
  color?: string;
  type: 'fire' | 'smoke' | 'extinguish';
  active?: boolean;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

const StableParticleSystem: React.FC<ParticleProps> = ({
  count = 30,
  position,
  scale = 1,
  color,
  type = 'fire',
  active = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create stable particle data
  const particles = useMemo(() => {
    const particleArray: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const maxLife = 1 + Math.random() * 2; // 1-3 seconds
      particleArray.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * scale * 0.5,
          Math.random() * scale * 0.2,
          (Math.random() - 0.5) * scale * 0.5
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          0.02 + Math.random() * 0.03,
          (Math.random() - 0.5) * 0.02
        ),
        life: Math.random() * maxLife,
        maxLife: maxLife,
        size: type === 'fire' ? 0.1 + Math.random() * 0.2 : 0.05 + Math.random() * 0.15,
        opacity: 1
      });
    }
    
    return particleArray;
  }, [count, scale, type]);

  // Simple animation without buffer manipulation
  useFrame((_, delta) => {
    if (!groupRef.current || !active) return;

    groupRef.current.children.forEach((child, index) => {
      const particle = particles[index];
      if (!particle) return;

      // Update particle life
      particle.life += delta;
      
      // Reset particle if it dies
      if (particle.life >= particle.maxLife) {
        particle.life = 0;
        if (type === 'extinguish') {
          // Extinguisher particles start from spray point
          particle.position.set(
            (Math.random() - 0.5) * scale * 0.2,
            (Math.random() - 0.5) * scale * 0.2,
            (Math.random() - 0.5) * scale * 0.2
          );
          particle.velocity.set(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.02,
            0.1 + Math.random() * 0.05 // Forward spray
          );
        } else {
          particle.position.set(
            (Math.random() - 0.5) * scale * 0.5,
            Math.random() * scale * 0.2,
            (Math.random() - 0.5) * scale * 0.5
          );
          particle.velocity.set(
            (Math.random() - 0.5) * 0.02,
            0.02 + Math.random() * 0.03,
            (Math.random() - 0.5) * 0.02
          );
        }
      }

      // Update position based on particle type
      if (type === 'extinguish') {
        // Extinguisher spray behavior
        particle.position.add(particle.velocity.clone().multiplyScalar(delta * 80));
        
        // Add gravity and air resistance
        particle.velocity.y -= delta * 1.5; // Gravity
        particle.velocity.multiplyScalar(0.98); // Air resistance
        
        // Add some spray spread
        const spread = particle.life / particle.maxLife;
        particle.position.x += Math.sin(Date.now() * 0.003 + index) * 0.02 * spread;
        particle.position.y += Math.cos(Date.now() * 0.002 + index) * 0.01 * spread;
      } else {
        // Fire and smoke behavior
        particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));
        
        // Add some flickering movement for fire
        if (type === 'fire') {
          const flicker = Math.sin(Date.now() * 0.005 + index) * 0.01;
          particle.position.x += flicker;
          particle.position.z += Math.cos(Date.now() * 0.003 + index) * 0.01;
        }
      }

      // Update opacity based on life
      const lifeRatio = particle.life / particle.maxLife;
      particle.opacity = Math.max(0, 1 - lifeRatio);

      // Apply to mesh
      child.position.copy(particle.position);
      child.position.add(new THREE.Vector3(position[0], position[1], position[2]));
      
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = particle.opacity;
      
      // Scale based on life for realistic effect
      let scaleValue = particle.size;
      if (type === 'extinguish') {
        scaleValue = particle.size * (1 + lifeRatio * 0.3); // Extinguisher particles expand slightly
      } else {
        scaleValue = particle.size * (1 + lifeRatio * 0.5); // Fire particles expand more
      }
      child.scale.setScalar(scaleValue);
    });
  });

  // Determine colors based on type
  const getParticleColor = (index: number) => {
    if (color) return color;
    
    switch (type) {
      case 'fire':
        // Gradient from yellow to red to orange
        const fireColors = ['#FFFF00', '#FF8000', '#FF4000', '#FF0000'];
        return fireColors[index % fireColors.length];
      case 'smoke':
        return '#888888';
      case 'extinguish':
        return '#AACCFF';
      default:
        return '#FF5500';
    }
  };

  return (
    <group ref={groupRef}>
      {particles.map((_, index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshBasicMaterial
            color={getParticleColor(index)}
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export default StableParticleSystem;