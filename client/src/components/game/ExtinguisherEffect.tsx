import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAudio } from "@/lib/stores/useAudio";
import { InteractiveObjectType } from "@/lib/types";

interface ExtinguisherEffectProps {
  isActive: boolean;
  playerPosition: { x: number; y: number; z: number };
  playerRotation: { y: number };
  extinguisherType?: InteractiveObjectType; // New prop for extinguisher type
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

export default function ExtinguisherEffect({ 
  isActive, 
  playerPosition, 
  playerRotation,
  extinguisherType = InteractiveObjectType.FireExtinguisher
}: ExtinguisherEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useRef<Particle[]>([]);
  const spraySound = useRef<HTMLAudioElement | null>(null);
  const { isMuted } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Generate different sound effects based on extinguisher type
  const generateExtinguisherSound = (type: InteractiveObjectType): ArrayBuffer => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 1;
    const frameCount = sampleRate * duration;
    const arrayBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = arrayBuffer.getChannelData(0);
    
    switch (type) {
      case InteractiveObjectType.WaterExtinguisher:
        // Water spray sound - continuous hissing with water droplet effects
        for (let i = 0; i < frameCount; i++) {
          const t = i / sampleRate;
          const baseNoise = (Math.random() * 2 - 1) * 0.4;
          const waterDroplets = Math.sin(t * 800 + Math.random() * 10) * 0.1;
          channelData[i] = baseNoise + waterDroplets;
        }
        break;
        
      case InteractiveObjectType.FoamExtinguisher:
        // Foam spray sound - thicker, bubbly texture
        for (let i = 0; i < frameCount; i++) {
          const t = i / sampleRate;
          const baseNoise = (Math.random() * 2 - 1) * 0.3;
          const bubbles = Math.sin(t * 200 + Math.random() * 5) * 0.15;
          const thickness = Math.sin(t * 50) * 0.1;
          channelData[i] = baseNoise + bubbles + thickness;
        }
        break;
        
      case InteractiveObjectType.CO2Extinguisher:
        // CO2 sound - sharp, compressed gas release
        for (let i = 0; i < frameCount; i++) {
          const t = i / sampleRate;
          const baseNoise = (Math.random() * 2 - 1) * 0.5;
          const pressureRelease = Math.sin(t * 1200) * 0.2 * Math.exp(-t * 2);
          channelData[i] = baseNoise + pressureRelease;
        }
        break;
        
      case InteractiveObjectType.PowderExtinguisher:
        // Powder spray - dry, dusty sound
        for (let i = 0; i < frameCount; i++) {
          const baseNoise = (Math.random() * 2 - 1) * 0.35;
          const dusty = Math.random() > 0.7 ? (Math.random() * 2 - 1) * 0.2 : 0;
          channelData[i] = baseNoise + dusty;
        }
        break;
        
      case InteractiveObjectType.WetChemicalExtinguisher:
        // Wet chemical - smooth, liquid spray
        for (let i = 0; i < frameCount; i++) {
          const t = i / sampleRate;
          const baseNoise = (Math.random() * 2 - 1) * 0.25;
          const smooth = Math.sin(t * 400) * 0.15;
          channelData[i] = baseNoise + smooth;
        }
        break;
        
      default:
        // Default fire extinguisher sound
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = (Math.random() * 2 - 1) * 0.3;
        }
        break;
    }
    
    return audioBufferToWav(arrayBuffer);
  };
  
  // Initialize spray sound based on extinguisher type
  useEffect(() => {
    // Create audio element for spray sound
    spraySound.current = new Audio();
    spraySound.current.volume = 0.7; // Slightly louder for better feedback
    spraySound.current.loop = true;
    
    // Generate type-specific sound
    const wavBuffer = generateExtinguisherSound(extinguisherType);
    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    spraySound.current.src = url;
    
    return () => {
      if (spraySound.current) {
        spraySound.current.pause();
        spraySound.current.currentTime = 0;
        URL.revokeObjectURL(url);
      }
    };
  }, [extinguisherType]); // Regenerate sound when extinguisher type changes
  
  // Handle sound effects with enhanced feedback
  useEffect(() => {
    if (isActive && !isMuted && spraySound.current) {
      if (!isPlaying) {
        // Add a slight ramp-up effect
        spraySound.current.volume = 0;
        spraySound.current.play().then(() => {
          // Gradually increase volume for realistic spray start
          const fadeIn = setInterval(() => {
            if (spraySound.current && spraySound.current.volume < 0.7) {
              spraySound.current.volume = Math.min(0.7, spraySound.current.volume + 0.1);
            } else {
              clearInterval(fadeIn);
            }
          }, 50);
        }).catch(console.error);
        setIsPlaying(true);
      }
    } else if (spraySound.current && isPlaying) {
      // Fade out effect when stopping
      const fadeOut = setInterval(() => {
        if (spraySound.current && spraySound.current.volume > 0) {
          spraySound.current.volume = Math.max(0, spraySound.current.volume - 0.1);
        } else {
          if (spraySound.current) {
            spraySound.current.pause();
            spraySound.current.currentTime = 0;
          }
          clearInterval(fadeOut);
          setIsPlaying(false);
        }
      }, 30);
    }
  }, [isActive, isMuted, isPlaying]);
  
  // Enhanced particle effects based on extinguisher type
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    if (isActive) {
      // Different particle behavior based on extinguisher type
      const particleCount = getParticleCount(extinguisherType);
      const particleColor = getParticleColor(extinguisherType);
      const particleSize = getParticleSize(extinguisherType);
      
      // Create new particles
      for (let i = 0; i < particleCount; i++) {
        const angle = playerRotation.y + (Math.random() - 0.5) * 0.3;
        const speed = 3 + Math.random() * 2;
        const spread = (Math.random() - 0.5) * 0.5;
        
        const particle: Particle = {
          position: new THREE.Vector3(
            playerPosition.x + Math.sin(angle) * 0.5,
            playerPosition.y + 0.8 + (Math.random() - 0.5) * 0.2,
            playerPosition.z + Math.cos(angle) * 0.5
          ),
          velocity: new THREE.Vector3(
            Math.sin(angle + spread) * speed,
            -0.5 + Math.random() * 0.3,
            Math.cos(angle + spread) * speed
          ),
          life: 0,
          maxLife: 0.8 + Math.random() * 0.4,
          size: particleSize * (0.8 + Math.random() * 0.4)
        };
        
        particles.current.push(particle);
      }
    }
    
    // Update existing particles
    particles.current = particles.current.filter(particle => {
      particle.life += delta;
      
      if (particle.life >= particle.maxLife) {
        return false;
      }
      
      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Apply gravity and air resistance
      particle.velocity.y -= 2 * delta;
      particle.velocity.multiplyScalar(0.98);
      
      return true;
    });
    
    // Limit particle count for performance
    if (particles.current.length > 200) {
      particles.current = particles.current.slice(-200);
    }
  });
  
  // Helper functions for different extinguisher types
  const getParticleCount = (type: InteractiveObjectType): number => {
    switch (type) {
      case InteractiveObjectType.CO2Extinguisher: return 12; // More gas particles
      case InteractiveObjectType.PowderExtinguisher: return 15; // Dense powder
      case InteractiveObjectType.FoamExtinguisher: return 6; // Fewer but larger foam particles
      default: return 8;
    }
  };
  
  const getParticleColor = (type: InteractiveObjectType): THREE.Color => {
    switch (type) {
      case InteractiveObjectType.WaterExtinguisher: return new THREE.Color(0.7, 0.8, 1.0);
      case InteractiveObjectType.FoamExtinguisher: return new THREE.Color(0.95, 0.95, 0.8);
      case InteractiveObjectType.CO2Extinguisher: return new THREE.Color(0.9, 0.9, 0.9);
      case InteractiveObjectType.PowderExtinguisher: return new THREE.Color(1.0, 0.9, 0.7);
      case InteractiveObjectType.WetChemicalExtinguisher: return new THREE.Color(0.8, 0.9, 0.8);
      default: return new THREE.Color(0.9, 0.9, 0.9);
    }
  };
  
  const getParticleSize = (type: InteractiveObjectType): number => {
    switch (type) {
      case InteractiveObjectType.FoamExtinguisher: return 0.15; // Larger foam particles
      case InteractiveObjectType.PowderExtinguisher: return 0.08; // Fine powder
      case InteractiveObjectType.CO2Extinguisher: return 0.12; // Gas particles
      default: return 0.1;
    }
  };
  
  // Convert AudioBuffer to WAV
  function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert samples
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  }
  
  return (
    <group ref={groupRef}>
      {/* Render particles with type-specific colors */}
      {particles.current.map((particle, index) => {
        const alpha = 1 - (particle.life / particle.maxLife);
        const scale = particle.size * (1 + particle.life);
        const color = getParticleColor(extinguisherType);
        
        return (
          <mesh
            key={index}
            position={[particle.position.x, particle.position.y, particle.position.z]}
            scale={[scale, scale, scale]}
          >
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial 
              color={color}
              transparent
              opacity={alpha * 0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
} 